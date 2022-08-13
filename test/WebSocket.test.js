
const assert = require("assert");
const WebSocket=require('../index.js').WebSocket

describe('WebSocketサーバーからの受信', function () {
    it('wss://reien.top:3333 から"Response from 3333"を受信できた', (done) => {

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
    it('wss://reien.top:3334 から"Response from 3334"を受信できた', (done) => {

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
});