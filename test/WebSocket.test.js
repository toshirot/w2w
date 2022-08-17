/*
凡例 通信方向
sa->ca サーバーaからクライアントaへ送信する
sb->cb サーバーbからクライアントbへ送信する
ca->sa  クライアントaからサーバーaへ送信する
ca->sa->ca  クライアントaからサーバーaへ送信し、サーバーaからクライアントaへ返信する
ca->sa->cb  クライアントaからサーバーaへ送信し、サーバーaからクライアントbへ送信する

*/




const assert = require("assert");
const WebSocket=require('../index.js').WebSocket


//-----------------------------------------------------------------------------
// send to server
// @wss {object} websocket
// @type {string} data type
// @msg {string} send message
function sendMsg(wss, type, msg){
    let send_msg=JSON.stringify({
        type: type
        ,msg: msg
    });
    // 送信する
    wss.send(send_msg)
}

//-----------------------------------------------------------------------------
// receive from server
// @receivedData {string} received data
// @return data {object}
function receiveFromServer(receivedData){
    let data
    try {
        data = JSON.parse(receivedData);
    } catch (e) {
        console.log('JSONparse err:', data);
        return;
    }
    return data
}


describe.only('WebSocketサーバーからの受信', function () {
    it('sa->ca: wss://reien.top:3333 から"Response from 3333"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w'}))
          
        // 期待した値
        expected_str='Response from ' + PORT;

        const ws = new WebSocket(URL, wss_protocol)
         
        ws.on('message', function message(data) {
            // on connection で発信されたレスポンス
            // receive from 3333
            const actual_str=receiveFromServer(data)

            assert.equal(expected_str, actual_str)
            done();
            ws.close()
        });

    });
    it('sb->cb: wss://reien.top:3334 から"Response from 3334"を受信できた', (done) => {

        //接続先
        const PORT=3334
        const URL='wss://reien.top:'+PORT
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w'}))

        // 期待した値
        expected_str='Response from ' + PORT;

        const ws = new WebSocket(URL, wss_protocol)
         
        ws.on('message', function message(data) {
            // on connection で発信されたレスポンス
            // receive from 3333
            const actual_str=receiveFromServer(data)

            assert.equal(expected_str, actual_str)
            done();
            ws.close()
        });

    });

    it('ca->sa->ca: wss://reien.top:3333 へsendして結果を受け取った。"ca to 3333 to ca"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w'}))

        // 送信するデータ
        const type='msg_from_ALICE'
        const msg='ca'

        // 期待した値
        expected_str=msg+' to '+ PORT+' to '+msg

        const ws = new WebSocket(URL, wss_protocol)
        ws.on('message', function message(data) {

            // send to 3333
            sendMsg(ws, type, msg)

            // receive from 3333
            const receivedData=receiveFromServer(data)

            // assert
            if(receivedData.type==='msg_from_'+PORT){
                const actual_str=receivedData.msg
                console.log('data.msg', receivedData.msg)
                assert.equal(expected_str, actual_str)
            }
            
            ws.close()
        });

        done()
    });
    it('ca->sa->cb: wss://reien.top:3333 へsendして結果を受け取った。"ca to 3333 to cb"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w'}))

        // 送信するデータ
        const type='msg_from_ALICE'
        const msg='ca'

        // 期待した値
        expected_str=msg+' to '+ PORT+' to '+msg

        const ws = new WebSocket(URL, wss_protocol)
        ws.on('message', function message(data) {

            // send to 3333
            sendMsg(ws, type, msg)

            // receive from 3333
            const receivedData=receiveFromServer(data)

            // assert
            if(receivedData.type==='msg_from_'+PORT){
                const actual_str=receivedData.msg
                console.log('data.msg', receivedData.msg)
                assert.equal(expected_str, actual_str)
            }
            
            ws.close()
        });

        done()
    });

/*
    it('ca->sa->cb: wss://reien.top:3333 へsendしてcbが結果を受け取った。"A to 3333 to B" を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT

        // 送信するデータ
        const type='msg_from_ALICE'
        const msg='to B'

        // 期待した値
        expected_str='A to '+ PORT+' to B'

        const ws = new WebSocket(URL)
        ws.on('message', function message(data) {

            // send to 3333
            sendMsg(ws, type, msg)

            // receive from 3333
            const receivedData=receiveFromServer(data)

            // assert
            if(receivedData.type==='msg_from_3333'){
                const actual_str=receivedData.msg
                //console.log('data.msg', receivedData.msg)
                assert.equal(expected_str, actual_str)
            }
            
            ws.close()
        });

        done()
    });
    */
});

