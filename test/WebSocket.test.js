
const assert = require("assert");
const WebSocket=require('../index.js').WebSocket

describe('WebSocketサーバーからの受信', function () {
    it('ALICE: wss://reien.top:3333 から"Response from 3333"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        // 期待した値
        expected_str='Response from ' + PORT;

        const ws = new WebSocket(URL)
         
        ws.on('message', function message(data) {
            let actual_str=JSON.parse(data)

            assert.equal(expected_str, actual_str)
            done();
            ws.close()
        });

    });
    it('BOB: wss://reien.top:3334 から"Response from 3334"を受信できた', (done) => {

        //接続先
        const PORT=3334
        const URL='wss://reien.top:'+PORT
        // 期待した値
        expected_str='Response from ' + PORT;

        const ws = new WebSocket(URL)
         
        ws.on('message', function message(data) {
            let actual_str=JSON.parse(data)

            assert.equal(expected_str, actual_str)
            done();
            ws.close()
        });

    });

    it('ALICE: wss://reien.top:3333 へsendして結果を受け取った。"A to 3333 to A"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT

        // 期待した値
        expected_str='A to '+ PORT+' to A'

        const ws = new WebSocket(URL)
        ws.on('message', function message(data) {

            //-----------------------------------------------------------------------------
            // send to 3333
            //
            let send_msg=JSON.stringify({
                type: 'msg_from_ALICE'
                ,msg: 'A'
            });
            // 送信する
            ws.send(send_msg)

            //-----------------------------------------------------------------------------
            // receive from 3333
            //
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.log('JSONparse err:', data);
                return;
            }

            if(data.type==='msg_from_3333'){
                let actual_str=data.msg
                console.log('data.msg', data.msg)
                assert.equal(expected_str, actual_str)

            }
            
            ws.close()
        });

        done()
    });
});