
const assert = require("assert");
const WebSocket=require('../index.js').WebSocket

describe('WebSocketサーバーからの受信', function () {
    it('wss://reien.top:3333から受信できた', (done) => {

        //接続先
        const url='wss://reien.top:3333'
        // 期待した値
        expected_str='test response'

        const ws = new WebSocket(url)
         
        ws.on('message', function message(data) {
            let actual_str=JSON.parse(data)

            assert.equal(expected_str, actual_str)
            done();
            ws.close()
        });

    });
});