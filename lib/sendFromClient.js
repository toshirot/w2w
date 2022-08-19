

//-----------------------------------------------------------------------------
// send to server
// @wss {object} websocket
// @type {string} data type
// @msg {string} send message
function sendFromClient(wss, type, msg, to){
    let oj={
        type: type
        ,msg: msg
    }
    if(to){
        oj.to=to
    }
    let send_msg=JSON.stringify(oj);
    // 送信する
    wss.send(send_msg)
}

module.exports = sendFromClient