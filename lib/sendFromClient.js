

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
    let oj={
        type: data.type
        ,msg: data.msg
    }
    if(data.from){
        oj.from=data.from
    }
    if(data.to){
        oj.to=data.to
    }
    // 送信する
    wss.send(JSON.stringify(oj))
}

module.exports = sendFromClient