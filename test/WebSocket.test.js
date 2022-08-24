/*
凡例 通信方向
sa->ca サーバーaからクライアントaへ送信する
sb->cb サーバーbからクライアントbへ送信する
ca->sa  クライアントaからサーバーaへ送信する
ca->sa->ca  クライアントaからサーバーaへ送信し、サーバーaからクライアントaへ返信する
ca->sa->cb  クライアントaからサーバーaへ送信し、サーバーaからクライアントbへ送信する

*/
const assert = require("assert");
const mkAccount=require('../index.js').mkAccount
const WebSocket=require('../').WebSocket
const sendFromClient=require('../').sendFromClient
const receiveFromServer=require('../').receiveFromServer
const getAccountId=require('../').getAccountId
const mkClient=require('../').mkClient
const CryptoJS =require('crypto-js')

//console.log(getAccountId())

// -----------------------------------------------------------------------------
// make SubProtocol
// @id {string} pubkey
// @return SubProtocol {string} encoded SubProtocol
function mkSubProtocol(id){
    const ID=id?id:mkAccount(true)
   // console.log( !!id, ID)
    return encodeURIComponent(
        JSON.stringify({
            name: 'w2w'
            , id: ID
        })
    )
}


describe.only('WebSocketサーバーとの送受信', function () {

    it('replyBack: "reply Back from wss://reien.top:3333"を受信できた', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        // アカウントID by Ed25519's PubKey
        const id=getAccountId()
        // 送信type 
        const sendType='replyBack'

        // 期待したtype
        expected_type=sendType
        // 期待したid
        expected_from=expected_to=id
        // 期待したmsg
        expected_msg='reply Back from '+URL
        // WebSocket
        const ws = new WebSocket(URL, mkSubProtocol(id))
        //着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された reply back レスポンス
            let receive=receiveFromServer(id, expected_type,  data)
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

    it('replyBack: "reply Back from wss://reien.top:3334"を受信できた', (done) => {

        // 接続先
        const PORT=3334
        const URL='wss://reien.top:'+PORT
        // アカウントID by Ed25519's PubKey
        const id=getAccountId()
        // 送信type 
        const sendType='replyBack'

        // 期待したtype
        expected_type=sendType
        // 期待したid
        expected_from=expected_to=id
        // 期待したmsg
        expected_msg='reply Back from '+URL
        // WebSocket
        const ws = new WebSocket(URL, mkSubProtocol(id))
        //着信イベント
        ws.on('message', function message(data) {

            // on connection で発信された reply back レスポンス
            let receive=receiveFromServer(id, expected_type,  data)
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
            ws.close()
        });

    });

    it('a2a: wss://reien.top:3333 へsendして結果を受け取った。"a2a hello w2w"を受信できた', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        // アカウントID by Ed25519's PubKey
        const id=getAccountId()

        // 送信するデータ
        const  senddata={
            type: 'a2a'
            , from: id
            , to: [id] //toは配列
            , msg: 'a2a hello w2w'
        }

        // 期待したtype
        const expected_type=senddata.type
        // 期待したid
        const expected_from=id
        const expected_to=id
        // 期待したmsg
        const expected_msg=senddata.msg

        const ws = new WebSocket(URL, mkSubProtocol(id))

        // ws の open イベントでメッセージを1回送る
        ws.on('open', function () {
            // send to 3333
            sendFromClient(ws, senddata)
        })
        ws.on('message', function message(data) {

            // receive from 3333
            const receive=receiveFromServer(id, expected_type,  data)
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
    });
    it('a2b: wss://reien.top:3333 へsendして cb が結果を受け取った。"a2b hello w2w"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top'
        //const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:SHA256( uuidv4())}))
        // const uuidv4Str=uuidv4()
        // const id=CryptoJS.SHA224(uuidv4Str).toString()

        // id
        const id_a="MCowBQYDK2VwAyEAVYnlTCRQhV0rOg1hOCPQCB3S60i0yGcwkS6MdtKkJ1E="
        const id_b="MCowBQYDK2VwAyEAh8VkWJFCm0T9sX6OXT3x/UXxewb/2GkdfAe8B6w9z1w="
        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        let sub_b=mkSubProtocol(id_b)
        // make wss client
        const ws_a=mkClient(URL, PORT, sub_a)
        const ws_b=mkClient(URL, PORT, sub_b)


        // console.log(decodeURIComponent(sb))


        // 送信するデータ
        const senddata={
            type: 'a2b'
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
                sendFromClient(ws_a, senddata)
            })
        })

        // ws_bの受信イベント
        ws_b.on('message', function message(data) {

            // receive from 3333
            const receive=receiveFromServer(id_b, expected_type,  data)
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

        //接続先
        const PORT=3333
        const URL='wss://reien.top'

        // id
        const id_a="aCowBQYDK2VwAyEAbpLYChvmHPGObredyPNSDwrNFHFe/KBzEx8hgaiDYuU="
        const id_b="bCowBQYDK2VwAyEAxCb67kGCPrIzjyI/Y5hXnoag5xIlWgX5ADfrtthLDFU="
        const id_c="cC4CAQAwBQYDK2VwBCIEIPAAO8Vb7gwZwZ8vRTtfLHsnhRiUOym/DcuAoYA5NpbZ"

        // make subprotocol
        let sub_a=mkSubProtocol(id_a)
        let sub_b=mkSubProtocol(id_b)
        let sub_c=mkSubProtocol(id_c)

        // make wss client
        let ws_a=mkClient(URL, PORT, sub_a)
        let ws_b=mkClient(URL, PORT, sub_b)
        let ws_c=mkClient(URL, PORT, sub_c)

        // 送信するデータ
        const senddata={
            type: 'a2g'
            , from: id_a
            , to: [id_b, id_c] //toは配列
            , msg: 'a2g hello w2w'
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
                    sendFromClient(ws_a, senddata)
                },0)
                
            })

            // asser用の受信イベント

            // ws_bの受信イベント
            ws_b.on('message', function message(data) {
                const myID=id_b
                expected.to=[myID]

                // receive from 3333
                // actual received
                const receive=receiveFromServer(myID, expected.type,  data)
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
                const receive=receiveFromServer(myID, expected.type,  data)
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




// -----------------------------------------------------------------------------
// uuidv4
//
function uuidv4() {
    // Thanx for
    // https://gist.github.com/jcxplorer/823878
    // https://web.archive.org/web/20150201084235/http://blog.snowfinch.net/post/3254029029/uuid-v4-js

    let uuid = '';
    let random;
    for (let i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += '-';
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    setTimeout(function() {
        uuid=random=null;
    }, 1000);
    return uuid;
}
/*
    it('ca->sa->cb: wss://reien.top:3333 へsendしてcbが結果を受け取った。"A to 3333 to B" を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT

        // 送信するデータ
        const type='msg_from_ALICE'
        const msg='to B'

        // 期待した値
        expected='A to '+ PORT+' to B'

        const ws = new WebSocket(URL)
        ws.on('message', function message(data) {

            // send to 3333
            sendFromClient(ws, type, msg)

            // receive from 3333
            const receivedData=receiveFromServer(data)

            // assert
            if(receivedData.type==='msg_from_3333'){
                const actual=receivedData.msg
                //console.log('data.msg', receivedData.msg)
                assert.equal(actual, expected)
            }
            
            ws.close()
        });

        done()
    });
    */
});

