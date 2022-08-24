
const WebSocket = require('ws').WebSocket
const mkClient = require('./mkClient')

//-----------------------------------------------------------------------------
// send to server
// @wss {object} websocket
// @data {object 
// @type {string} data type
// @msg {string} send message
// @from {string} from ID (pubKey)
// @to {string} send to ID (pubKey)
// }
function sendFromClient(wss, data){
   // console.log('sendFromClient:0000-----', 'data', data )
    let oj={
        type: data.type
        ,from: data.from
        ,to: data.to
        ,msg: data.msg
    }
    if(wss.readyState==WebSocket.OPEN){
        // 送信する
        //console.log('sendFromClient:', typeof wss, wss.readyState, 'data', data, 'oj', oj)
        wss.send(JSON.stringify(oj))
    } else {
        wss=mkClient(wss.w2w.URL, wss.w2w.PORT, wss.w2w.protocol)
        wss.on('open', function open() {
            console.log(data.type+'=restart=======')
            wss.send(JSON.stringify(oj))
        })
    }
}

module.exports = sendFromClient