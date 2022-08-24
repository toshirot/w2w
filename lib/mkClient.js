const WebSocket = require('ws').WebSocket
// -----------------------------------------------------------------------------
// mkClient
//
module.exports = function mkClient(URL, PORT, protocol){
    //接続情報
    const url=URL+':'+PORT
    let ws = new WebSocket(url, protocol)
    ws.w2w={
        url:url
        ,URL: URL
        ,PORT: PORT
        ,protocol:protocol
    }
    return ws
}
