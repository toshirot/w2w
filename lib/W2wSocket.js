const WebSocket = require('ws').WebSocket
const getOrSetKeyPair= require(__dirname+'/mkAccount').getOrSetKeyPair
const removeBeginEndStr= require(__dirname+'/mkAccount').removeBeginEndStr
const { mkKeyPair, sign, verify } = require(__dirname+'/mkKeyPair')
const received= require(__dirname+'/received')

module.exports ={
    W2wSocket: W2wSocket,
    mkSubProtocol: mkSubProtocol
 }

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
    let id=protocolOj.id
    
    //接続情報
    //const url=URL+':'+PORT
    let ws = new WebSocket(url, protocol)
    ws.w2w={
        url: url
        , id
        , status: 1
        , protocol: protocol // with encodeURIComponent 
    }
    ws.on('message', function message(data) {
        // receive from server
        const receiveA=received(id, 'sigB',  data)
        if(!receiveA)return
       // console.log(1, receiveA)
       // const receiveC=received(ws, 'sigC',  data)
    })

    //console.log(decodeURIComponent(protocol))
    //verifyAB(sigA, sigA, pubId)

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
    const sigA=mkSigA(keys)
    // default type is reply
    if(!connectType)connectType='reply'
    
    // 初期送信のtypeはsigAのみ
    return encodeURIComponent(
        JSON.stringify({
            name: 'w2w'
            , type: connectType
            , status: 1
            , id: ID //pubKey
            , sigA: sigA
        })
    )
}

function getIdBySubprotocol(protocol){

    return decodeURIComponent(
         protocol
    )
}

// verify時に使うpublicKeyは　BeginEndStr start line　が必要
function verifyAB(msg, sigA, publicKey){
    return verify(msg, sigA, publicKey)
}
// -----------------------------------------------------------------------------
// make sigA
// @id {string} pubkey
// @return signA {string} base64 signA
function mkSigA(keys){
    const msg ='test'
    const signA=sign(msg, keys.privateKey)//.toString('base64')
    //console.log(signA )
    return signA
}

