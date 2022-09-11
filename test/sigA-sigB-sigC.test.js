const assert=require("assert")
const received=require('../lib/received').received
const getAccountId=require('../lib/mkAccount').getAccountId
const { mkKeyPair, sign, verify } = require('../lib/mkKeyPair')
const { 
    W2wSocket,
    mkSubProtocol
}=require('../lib/W2wSocket')
const CryptoJS =require('crypto-js')
const EdDSA = require('elliptic').eddsa;
const ec = new EdDSA('ed25519');

//----------------------------------------------
// ALICE  this is for stub

// Alice's Private Key
const AlicePriKeyHex='fa127e73935678a647daf3d3af2a934dc0e9c9c39dc4ac2e69c9c3648447ff53';
// Create key pair from secret
const keyPairAlice = ec.keyFromSecret(AlicePriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const AlicePubKeyHex = '78cd96278f49a78664faf50e9b238f3f5642360d80b3b0ce82782a4a8af3a8e9';
const AlicePubKey = ec.keyFromPublic(AlicePubKeyHex, 'hex');

//----------------------------------------------
// BOB  this is for stub

const BobPriKeyHex='16253458330e54b08e3d492d200776d8af2d0367bbca4ca59df88985175a6069';
// Create key pair from secret
const keyPairBob = ec.keyFromSecret(BobPriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const BobPubKeyHex = '6e6579f1f368f9a4ac6d20a11a7741ed44d1409a923fa9b213e0160d90aa0ecc';
const BobPubKey = ec.keyFromPublic(BobPubKeyHex, 'hex');


describe('参加処理 ID登録 sigA から sigC を交換し verifyする', function () {

    it('sigA、sigB、sigCをサーバーと交換しお互いに verify して true だった', (done) => {

        // 接続先
        const URL='wss://w2w.info'
        const PORT=3333
        const url=URL+':'+PORT
        // アカウントID by Ed25519's PubKey
        //const id=getAccountId()

        // 送受信type 
        // mkSubProtocolの第2引数でtypeを'sigA'と指定する
        // 着信typeは自動的に'sigB'になる
        const sentType='sigA'
        const reciveType='sigB'

        // 期待したid
        const id=expected_from=expected_to=getAccountId()
 
        const subprotocol=mkSubProtocol(id, sentType)

        // WebSocket sigAを送る
        const ws = new W2wSocket(url, subprotocol)
     
        // console.log(' ws.w2w:', ws.w2w)
        // 期待したtype
        expected_type=reciveType
        //----------------------------------------------
        //  chatch sigB received
        expected_msg=reciveType+' from '+url

        // sigB 着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された sendToReplay レスポンス
            let receive=received(id, expected_type,  data)
            if(!receive)return

            // send(ws, sendsigC)はW2wSocket内で行われる

            // 着信結果
            const actual_type=receive.type
            const actual_from=receive.from
            const actual_to=receive.to
            const actual_msg=receive.msg
            const actual_verify=BobPubKey.verify(ws.w2w.sigA, receive.sigB)

            // 検証
            assert.equal(actual_type, expected_type)
            assert.equal(actual_from, expected_from)
            assert.equal(actual_to, expected_to)
            assert.equal(actual_msg, expected_msg)
            assert.equal(actual_verify, true)
             
            //console.log(actual_msg, expected_msg)
            done();
            //ws.close()
        });


        //----------------------------------------------
        // chatch sigOK received
        ws.on('message', function message(data) {
            let expected_type='sigOK'
            // on massage で発信された sigOK レスポンス
            let receive=received(id, 'sigOK',  data)
            if(!receive)return

            // 着信結果
            const actual_type=receive.type
            // 検証
            assert.equal(actual_type, expected_type)
        });
    });
});

/* 参加処理 ID登録
   Clientは自分の所属しているネットワークの 
   wss Serverと相互のPubkey/署名を交換し、
   OKなら wss Server はDBへ登録・公開する。
   公開されるアカウントIDは各Clientの公開鍵です。 
   この手順を踏むことでなりすましは、できなくなる。

Operation Helheim: sigA2sigB2sigC アルゴリズム

Client is ALICE, wss Server is BOB.

ALICE: wssサーバーに接続し、公開鍵(BOB's Address)を取得する
ALICE: 秘密鍵とmsgでsigAを作る
e.g sigA =sign(msg, AlicePriKey)

ALICE: 公開鍵(Alice's Address)とsigAをwssサーバーBOBへ送信する
e.g. wss.send(Alice's Address, sigA) //to BOB

BOB: get 公開鍵(Alice's Address) and sigA
e.g. let recived=recivedMsg() //from ALICE and get Alice's Address, sigA

BOB: save 公開鍵(Alice's Address) and sigA to memoly or DB
upsert {    
    utime: {type: Number, require:true}
    , addr: {type: String, require:true}
    , sigA: {type: String, require:true}
    , sigB: {type: String, require:true}
    , sigC: {type: String, require:true}    }
BOB: "sigB" を "sigA" と BOB's Private Keyで作る
e.g sigB = sign(sigA, BobPriKey)

BOB: upsert to DB, sigB where Alice's Address
e.g upsert sigB where Alice's addr

BOB: sigBをAliceへ送信する
e.g. wss.send(sigB) //to ALICE

ALICE: get sigB
e.g. let recived=recivedMsg() //from BOB get sigB

ALICE: verify sigA and sigB by Bobの公開鍵(BOB's Address)
let res:{bool} = verify(sigA, sigB, BobPubKey)

ALICE: res is true then Make the "sigC" by the Alice's Private Key and the "sigB". and send to Bob
if(res){
        sigC = sign(sigB, AlicePriKey)
        wss.send(sigC) //to BOB 
} else {
        //goto 1
} 
BOB: get sigC
e.g. let recived=recivedMsg() //from ALICE get sigC

BOB: find sigB from DB by Alice's addr, and Verify sigB and sigC by Alice's Public Key.
let res:{bool} = verify(sigB, sigC, AlicePubKey)

BOB: if res is then Alice's SignIn is OK, and send msg(status OK) to ALICE
if(res){
        upsert to DB, sigC where Alice's Address
        ss.send(status OK) //to ALICE 
} else {
        //goto 1
} 
honor to okarin
*/ 