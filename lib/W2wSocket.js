module.exports ={
    W2wSocket: W2wSocket,
    mkSubProtocol: mkSubProtocol
}
const WebSocket = require('ws').WebSocket
const getOrSetKeyPair= require(__dirname+'/mkAccount').getOrSetKeyPair
const removeBeginEndStr= require(__dirname+'/mkAccount').removeBeginEndStr
//const { mkKeyPair, sign, verify } = require(__dirname+'/mkKeyPair')
const received= require('./received').received
const send=require('./send').send

const EdDSA = require('elliptic').eddsa;
const ec = new EdDSA('ed25519');


//----------------------------------------------
// ALICE

// Alice's Private Key
const AlicePriKeyHex='fa127e73935678a647daf3d3af2a934dc0e9c9c39dc4ac2e69c9c3648447ff53';
// Create key pair from secret
const keyPairAlice = ec.keyFromSecret(AlicePriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const AlicePubKeyHex = '78cd96278f49a78664faf50e9b238f3f5642360d80b3b0ce82782a4a8af3a8e9';
const AlicePubKey = ec.keyFromPublic(AlicePubKeyHex, 'hex');

//----------------------------------------------
// BOB

const BobPriKeyHex='16253458330e54b08e3d492d200776d8af2d0367bbca4ca59df88985175a6069';
// Create key pair from secret
const keyPairBob = ec.keyFromSecret(BobPriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const BobPubKeyHex = '6e6579f1f368f9a4ac6d20a11a7741ed44d1409a923fa9b213e0160d90aa0ecc';
const BobPubKey = ec.keyFromPublic(BobPubKeyHex, 'hex');

// -----------------------------------------------------------------------------
// W2wSocket
//
// @url {string} wss url
// @protocol {string} encoded sub protocol made by function mkSubProtocol
// @return {object} w2w WebSocket object 
function W2wSocket(url, protocol){

    if(!protocol){
        protocol=mkSubProtocol()
    }

    // これは冗長だよなぁ
    let protocolStr=getIdBySubprotocol(protocol)
   
    try{
        protocolOj=JSON.parse(protocolStr)
    } catch(e){
        return 
    }
    const id=protocolOj.id
    
    //接続情報
    //const url=URL+':'+PORT
    let ws = new WebSocket(url, protocol)
    ws.w2w={
        url: url
        , id //pubKey
        , status: 1
        , protocol: protocol // with encodeURIComponent 
    }
    let keypair= getOrSetKeyPair()

    ws.on('message', function message(data) {

        // only for sigB
        // receive from server
        const receiveB=received(id, 'sigB',  data)
        if(!receiveB)return

        const msg ='test'
        let signA= keyPairAlice.sign(msg).toHex()

        const actual_verify=BobPubKey.verify(signA, receiveB.sigB)
        //console.log('sigB: ', receiveB.sigB,  actual_verify  )

        if(actual_verify){
            // 送信するsigC
            const sendsigC={
                type: 'sigC'
                , from: id
                , to: [id] //toは配列
                , msg: ''
            }
            send(ws, sendsigC)
        }


    })

    return ws
}
// -----------------------------------------------------------------------------
// make SubProtocol
// @id {string} pubkey
// @connectType {string} type sigA|replay
// @return SubProtocol {string} encoded SubProtocol
function mkSubProtocol(id, connectType){
    // key pair
    const keys=getOrSetKeyPair()
    // アカウントID by Ed25519's PubKey
    const accountId=removeBeginEndStr(keys).publicKey
    // ID 
    const ID=id?id:accountId
    // sigA
   // const sigA=mkSigA(keys)
   const msg ='test'
   //const signA=sign(msg, keys.privateKey).toString('base64')
   let signA_= keyPairAlice.sign(msg).toHex()

   // console.log('sigA: ', signA_)

    // default type is reply
    if(!connectType)connectType='reply'
    
    // 初期送信のtypeはsigAのみ
    return encodeURIComponent(
        JSON.stringify({
            name: 'w2w'
            , type: connectType
            , status: 1
            , id: ID //pubKey
            , sigA: signA_
            , date: new Date()
        })
    )
}

function getIdBySubprotocol(protocol){

    return decodeURIComponent(
         protocol
    )
}
// -----------------------------------------------------------------------------
//  verify時に使うpublicKeyは　BeginEndStr start line　が必要
function verifyAB(msg, sigA, publicKey){
   // return verify(msg, sigA, publicKey)
    return BobPubKey.verify(sigB, sigA)
}
// -----------------------------------------------------------------------------
// make sigA
// @id {string} pubkey
// @return signA {string} base64 signA
function mkSigA(keys){
    const msg ='test'
    //const signA=sign(msg, keys.privateKey).toString('base64')
    const signA= keyPairAlice.sign(msg).toHex()

    console.log(signA )
    return signA
}
