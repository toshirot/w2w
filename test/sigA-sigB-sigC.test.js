const assert = require("assert");
const WebSocket=require('../').WebSocket
const send=require('../').send
const received=require('../').received
const getAccountId=require('../').getAccountId
const sign=require('../').sign
const verify=require('../').verify
const W2wSocket=require('../').W2wSocket
const mkSubProtocol=require('../').mkSubProtocol
const CryptoJS =require('crypto-js')


describe('参加処理 ID登録 sigA から sigC を交換し verifyする', function () {

    it('sigAをサーバーへ送りsigBを受け取った', (done) => {

        // 接続先
        const URL='wss://reien.top'
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

        // WebSocket sigAを送る
        const ws = new W2wSocket(url, mkSubProtocol(id, sentType))
     

        // 期待したtype
        expected_type=reciveType
        // 期待したmsg
        expected_msg=reciveType+' from '+url

        //着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された reply back レスポンス
            let receive=received(id, expected_type,  data)
            if(!receive)return
            // 着信結果
            const actual_type=receive.type
            const actual_from=receive.from
            const actual_to=receive.to
            const actual_msg=receive.msg

            // 検証
            assert.equal(actual_type, expected_type)
            assert.equal(actual_from, expected_from)
            assert.equal(actual_to, expected_to)
            assert.equal(actual_msg, expected_msg)

            done();
            //ws.close()
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