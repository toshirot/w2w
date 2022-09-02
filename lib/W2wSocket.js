const WebSocket = require('ws').WebSocket
// -----------------------------------------------------------------------------
// W2wSocket
//
function W2wSocket(url, protocol){
    //接続情報
    //const url=URL+':'+PORT
    let ws = new WebSocket(url, protocol)
    ws.w2w={
        url:url
        //,URL: URL
        //,PORT: PORT
        ,protocol:protocol
    }

    
    return ws
}
module.exports =W2wSocket

/*
const getAccountId=require('../').getAccountId
// -----------------------------------------------------------------------------
// make SubProtocol
// @id {string} pubkey
// @return SubProtocol {string} encoded SubProtocol
function mkSubProtocol(id){
    const ID=id?id:getAccountId()
    //const sigA=sign('20100728')
   // console.log( !!id, ID)
    return encodeURIComponent(
        JSON.stringify({
            name: 'w2w'
            , id: ID
        })
    )
}
        //接続先
        const PORT=3333
        const URL='wss://reien.top'

        // id
        const id_a="MCowBQYDK2VwAyEAVYnlTCRQhV0rOg1hOCPQCB3S60i0yGcwkS6MdtKkJ1E="
        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        // make wss client
        const url=URL+':'+PORT
        const ws_a= new W2wSocket(url, sub_a)

        ws_a.on('open', function(){
            console.log(ws_a.readyState)
        })
*/