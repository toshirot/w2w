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
        // アカウントID
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

            const acceptType=sendType

            // on connection で発信された reply back レスポンス
            let receive=receiveFromServer(acceptType, data)
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
        // アカウントID
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

            // 受け入れるtype
            const acceptType=sendType

            // on connection で発信された reply back レスポンス
            let receive=receiveFromServer(acceptType, data)
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

    it('ca->sa->ca: wss://reien.top:3333 へsendして結果を受け取った。"a2a hello w2w"を受信できた', (done) => {

        // 接続先
        const PORT=3333
        const URL='wss://reien.top:'+PORT
        // アカウントID
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
        ws.on('open', function open() {
            // send to 3333
            sendFromClient(ws, senddata)
        })
        ws.on('message', function message(data) {

            // 受け入れるtype
            const acceptType=senddata.type

            // receive from 3333
            const receive=receiveFromServer(acceptType, data)
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
    it('ca->sa->cb: wss://reien.top:3333 へsendして cb が結果を受け取った。"a2b hello w2w"を受信できた', (done) => {

        //接続先
        const PORT=3333
        const URL='wss://reien.top'
        //const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:SHA256( uuidv4())}))


        // const uuidv4Str=uuidv4()
        // const id=CryptoJS.SHA224(uuidv4Str).toString()
        const id_a="9d6a5de9e16c3999c714840f47771f36dcc297a7bdefaac36c9515ae"
        const id_b="47222ac208fc654817a9a9422d6e97a46753479f3c190211e68103d6"

        let sb=mkSubProtocol(id_b)
        //let ws1=mkClient(URL, PORT, type1, msg1)
        const ws_a=mkClient(URL, PORT, mkSubProtocol(id_a))
        const ws_b=mkClient(URL, PORT, sb)


         console.log(decodeURIComponent(sb))


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

            // 受け入れるtype
            const acceptType=senddata.type

            // receive from 3333
            const receive=receiveFromServer(acceptType, data)
            if(!receive)return
            console.log('a2b:', receive, expected_type, receive.type)


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

    

// -----------------------------------------------------------------------------
// mkClient
//
function mkClient(URL, PORT, protocol){
    //接続情報
    const url=URL+':'+PORT
    const ws = new WebSocket(url, protocol)

    return ws
}
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

