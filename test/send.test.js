
const assert = require("assert");
const getAccountId=require('../').getAccountId
const W2wSocket=require('../').W2wSocket
const send=require('../').send
const received=require('../').received

describe('WebSocketサーバーへsendし返信を受け取る', function () {

    it('a2a: wss://reien.top:3333 へsendし返信を受け取った', (done) => {

        // 接続先
        const URL='wss://reien.top'
        const PORT=3333
        const url=URL+':'+PORT
        const msgType='a2a'

        // アカウントID by Ed25519's PubKey
        const id=getAccountId()

        // 送信するデータ
        const  senddata={
            type: msgType
            , from: id
            , to: [id] //toは配列
            , msg: 'a2a hello w2w'
        }
        const ws = new W2wSocket(url)

        // 期待したtype
        const expected_type=senddata.type
        // 期待したid
        const expected_from=id
        const expected_to=id
        // 期待したmsg
        const expected_msg=senddata.msg

        // ws の open イベントでメッセージを1回送る
        ws.on('open', function () {
            // send to 3333
            send(ws, senddata)
        })
        ws.on('message', function message(data) {

            // receive from 3333
            const receive=received(id, expected_type,  data)
            if(!receive)return

           // console.log('a2a:', receive, expected_type, receive.type)

            // 着信結果
            const actual_type=receive.type
            const actual_from=receive.from
            const actual_to=receive.to
            const actual_msg=receive.msg

            // 検証
            assert.equal(actual_type, expected_type)
            assert.equal(actual_from, expected_from)
            assert.equal(actual_to, expected_to)
            assert.equal(actual_msg, expected_msg)
            
            ws.close()
        });

        done()

    })
})
