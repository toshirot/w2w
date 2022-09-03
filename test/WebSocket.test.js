/*
凡例 通信方向
sa->ca サーバーaからクライアントaへ送信する
sb->cb サーバーbからクライアントbへ送信する
ca->sa  クライアントaからサーバーaへ送信する
ca->sa->ca  クライアントaからサーバーaへ送信し、サーバーaからクライアントaへ返信する
ca->sa->cb  クライアントaからサーバーaへ送信し、サーバーaからクライアントbへ送信する

*/
const assert = require("assert");
const getAccountId=require('../').getAccountId
const mkSubProtocol=require('../').mkSubProtocol
const W2wSocket=require('../').W2wSocket
const send=require('../').send
const received=require('../').received

//console.log(getAccountId())


describe('WebSocketサーバーとの各種送受信', function () {

    it('replyBack: "reply from wss://reien.top:3333"を受信できた', (done) => {

        // 接続先
        const URL='wss://reien.top'
        const PORT=3333
        const url=URL+':'+PORT
        // アカウントID by Ed25519's PubKey
        //const id=getAccountId()

        // 送受信type 
        // mkSubProtocolの第2引数でtypeを指定しなければ 送信typeはreplyになり
        // 着信typeもreplyになる
        const reciveType='reply'

        // WebSocket
        //const ws = new W2wSocket(url, mkSubProtocol(id))
        const ws = new W2wSocket(url)
        // 期待したid
        const id=expected_from=expected_to=getAccountId()
        // 期待したtype
        expected_type=reciveType
        // 期待したmsg
        expected_msg=reciveType+' from '+url

        //着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された reply back レスポンス
            let receive=received(id, expected_type,  data)
            if(!receive)return

            
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

            done();
            //ws.close()
        });
        

    });

    it('replyBack: "reply from wss://reien.top:3334"を受信できた', (done) => {

        // 接続先
        const PORT=3334
        const URL='wss://reien.top'
        const url=URL+':'+PORT

        // 送受信type 
        // mkSubProtocolの第2引数でtypeを指定しなければ 送信typeはreplyになり
        // 着信typeもreplyになる
        const reciveType='reply'

        // WebSocket
        const ws = new W2wSocket(url)
        // アカウントID by Ed25519's PubKey
        const id=getAccountId()
        // 期待したid
        expected_from=expected_to=id
        // 期待したtype
        expected_type=reciveType
        // 期待したmsg
        expected_msg=reciveType+' from '+url

        //着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された reply back レスポンス
            let receive=received(id, expected_type,  data)
            if(!receive)return
           
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

            done();
            //ws.close()
        });

    });

    it('a2a: wss://reien.top:3333 へsendして結果を受け取った。"a2a hello w2w"を受信できた', (done) => {


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

            //console.log('a2a:', receive, expected_type, receive.type)

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
            
            // ws.close()
        });

        done()
    });
    it('a2b: wss://reien.top:3333 へsendして cb が結果を受け取った。"a2b hello w2w"を受信できた', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top'
        const url=URL+':'+PORT
        const msgType='a2b'

        // id
        const id_a="MCowBQYDK2VwAyEAVYnlTCRQhV0rOg1hOCPQCB3S60i0yGcwkS6MdtKkJ1E="
        const id_b="MCowBQYDK2VwAyEAh8VkWJFCm0T9sX6OXT3x/UXxewb/2GkdfAe8B6w9z1w="
        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        let sub_b=mkSubProtocol(id_b)
        // make wss client
        const ws_a= new W2wSocket(url, sub_a)
        const ws_b= new W2wSocket(url, sub_b)


        // console.log(decodeURIComponent(sb))


        // 送信するデータ
        const senddata={
            type: msgType
            , from: id_a
            , to: [id_b] //toは配列
            , msg: 'a2b hello w2w'
        }

        // 期待したtype
        const expected_type=senddata.type
        // 期待したid
        const expected_from=id_a
        const expected_to=id_b
        // 期待したmsg
        const expected_msg=senddata.msg

        // ws_a かつ ws_b の open イベントでメッセージを1回送る
        ws_a.on('open', function open() {
            ws_b.on('open', function open() {
                // send to 3333
                send(ws_a, senddata)
            })
        })

        // ws_bの受信イベント
        ws_b.on('message', function message(data) {

            // receive from 3333
            const receive=received(id_b, expected_type,  data)
            if(!receive)return
            //console.log('a2b:', receive, expected_type, receive.type)


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
            
           // ws_b.close()
        // ws.close()
        });


        done()
    });

    it('a2g: client a,b,c があるときに to [b,c] へ送り b,c だけが受け取った。', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top'
        const url=URL+':'+PORT
        const msgType='a2g'

        // id
        const id_a="aCowBQYDK2VwAyEAbpLYChvmHPGObredyPNSDwrNFHFe/KBzEx8hgaiDYuU="
        const id_b="bCowBQYDK2VwAyEAxCb67kGCPrIzjyI/Y5hXnoag5xIlWgX5ADfrtthLDFU="
        const id_c="cC4CAQAwBQYDK2VwBCIEIPAAO8Vb7gwZwZ8vRTtfLHsnhRiUOym/DcuAoYA5NpbZ"

        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        let sub_b=mkSubProtocol(id_b)
        let sub_c=mkSubProtocol(id_c)

        // make wss client
        let ws_a= new W2wSocket(url, sub_a)
        let ws_b= new W2wSocket(url, sub_b)
        let ws_c= new W2wSocket(url, sub_c)

        // 送信するデータ
        const senddata={
            type: msgType
            , from: id_a
            , to: [id_b, id_c] //toは配列
            , msg: msgType+' hello w2w'
        }

        // 期待した値
        let expected=JSON.parse(JSON.stringify(senddata))
        //JSON.parse(JSON.stringify(senddata))
        
        // 各clientのopenを確認後に  送信とassertを実行する
        sendAndAssert()
        async function sendAndAssert(){
            await ws_a.on('open', function open() {
                //console.log('a2g=ws_a=opend======')
            })
            await ws_b.on('open', function open() {
                //console.log('a2g=ws_b=opend======')
            })
            await ws_c.on('open', function open() {
                //console.log('a2g=ws_c=opend======')
                // send to 3333
                setTimeout(function(){
                    //ws_a.close() <- open 失敗をテストする
                    send(ws_a, senddata)
                },0)
                
            })

            // asser用の受信イベント

            // ws_bの受信イベント
            ws_b.on('message', function message(data) {
                const myID=id_b
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=received(myID, expected.type,  data)
                if(!receive)return
                if(receive.to[0]!==expected.to[0])return
                // console.log('a2g: recived:', receive, expected.type, expected.to)

                // 検証
                assert.equal(receive.type, expected.type)
                assert.equal(receive.from, expected.from)
                assert.equal(receive.to[0], expected.to[0])
                assert.equal(receive.msg, expected.msg)

                // console.log('received myID:',receive.to[0])
            
            // ws_b.close()
 
            });

            // ws_bの受信イベント
            ws_c.on('message', function message(data) {
                const myID=id_c
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=received(myID, expected.type,  data)
                if(!receive)return
                if(receive.to[0]!==expected.to[0])return
                // console.log('a2g: recived:', receive, expected.type, expected.to)

                // 検証
                assert.equal(receive.type, expected.type)
                assert.equal(receive.from, expected.from)
                assert.equal(receive.to[0], expected.to[0])
                assert.equal(receive.msg, expected.msg)

                // console.log('received myID:',receive.to[0])
            
            // ws_c.close()
 
            });
        }
        
        done()
    });

    
    it('a2n: client a,b,c があるときに to n(all) へ送り 全員が受け取った。', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top'
        const url=URL+':'+PORT
        const msgType='a2n'

        // id
        const id_a="aCowBQYDK2VwAyEAbpLYChvmHPGObredyPNSDwrNFHFe/KBzEx8hgaiDYuU="
        const id_b="bCowBQYDK2VwAyEAxCb67kGCPrIzjyI/Y5hXnoag5xIlWgX5ADfrtthLDFU="
        const id_c="cC4CAQAwBQYDK2VwBCIEIPAAO8Vb7gwZwZ8vRTtfLHsnhRiUOym/DcuAoYA5NpbZ"

        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        let sub_b=mkSubProtocol(id_b)
        let sub_c=mkSubProtocol(id_c)

        // make wss client
        let ws_a= new W2wSocket(url, sub_a)
        let ws_b= new W2wSocket(url, sub_b)
        let ws_c= new W2wSocket(url, sub_c)

        // 送信するデータ
        const senddata={
            type: msgType
            , from: id_a
            , to: [] //toは配列 a2nでは省略 to自体を省略でも良いかな？？
            , msg: msgType+' hello w2w'
        }

        // 期待した値
        let expected=JSON.parse(JSON.stringify(senddata))
        //JSON.parse(JSON.stringify(senddata))
        
        // 各clientのopenを確認後に  送信とassertを実行する
        sendAndAssert()
        async function sendAndAssert(){
            await ws_a.on('open', function open() {
                //console.log('a2g=ws_a=opend======')
            })
            await ws_b.on('open', function open() {
                //console.log('a2g=ws_b=opend======')
            })
            await ws_c.on('open', function open() {
                //console.log('a2g=ws_c=opend======')
                // send to 3333
                setTimeout(function(){
                    //ws_a.close() <- open 失敗をテストする
                    send(ws_a, senddata)
                },0)
                
            })

            // asser用の受信イベント

            // ws_aの受信イベント
            ws_a.on('message', function message(data) {
                const myID=id_a
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=received(myID, expected.type,  data)
                if(!receive)return
                if(receive.to[0]!==expected.to[0])return
                //console.log('a2g: recived: ws_a', receive, expected.type, expected.to)

                // 検証
                assert.equal(receive.type, expected.type)
                assert.equal(receive.from, expected.from)
                assert.equal(receive.to[0], expected.to[0])
                assert.equal(receive.msg, expected.msg)

                // console.log('received myID:',receive.to[0])
            
            // ws_a.close()
 
            });
            // ws_bの受信イベント
            ws_b.on('message', function message(data) {
                const myID=id_b
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=received(myID, expected.type,  data)
                if(!receive)return
                if(receive.to[0]!==expected.to[0])return
                //console.log('a2g: recived: ws_b', receive, expected.type, expected.to)

                // 検証
                assert.equal(receive.type, expected.type)
                assert.equal(receive.from, expected.from)
                assert.equal(receive.to[0], expected.to[0])
                assert.equal(receive.msg, expected.msg)

                // console.log('received myID:',receive.to[0])
            
            // ws_b.close()
 
            });

            // ws_bの受信イベント
            ws_c.on('message', function message(data) {
                const myID=id_c
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=received(myID, expected.type,  data)
                if(!receive)return
                if(receive.to[0]!==expected.to[0])return
                //console.log('a2g: recived: ws_c', receive, expected.type,  expected.to)

                // 検証
                assert.equal(receive.type, expected.type)
                assert.equal(receive.from, expected.from)
                assert.equal(receive.to[0], expected.to[0])
                assert.equal(receive.msg, expected.msg)

                // console.log('received myID:',receive.to[0])
            
            // ws_c.close()
 
            });
        }
        
        done()
    });

});