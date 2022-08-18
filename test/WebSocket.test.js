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
const CryptoJS =require('crypto-js')

//-----------------------------------------------------------------------------
// send to server
// @wss {object} websocket
// @type {string} data type
// @msg {string} send message
function sendMsg(wss, type, msg, to){
    let send_msg=JSON.stringify({
        to: to
        ,type: type
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
        const id=CryptoJS.SHA224(uuidv4).toString()

        //console.log(id)
      
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:id}))
          
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
        const id=CryptoJS.SHA224(uuidv4).toString()

        //console.log(id)
      
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:id}))

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
        const id=CryptoJS.SHA224(uuidv4).toString()

        //console.log(id)
      
        const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:id}))

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
        const URL='wss://reien.top'
        //const wss_protocol=encodeURIComponent(JSON.stringify({name:'w2w', id:SHA256( uuidv4())}))


        // const uuidv4Str=uuidv4()
        // const id=CryptoJS.SHA224(uuidv4Str).toString()
        const id_a="9d6a5de9e16c3999c714840f47771f36dcc297a7bdefaac36c9515ae"
        const id_b="47222ac208fc654817a9a9422d6e97a46753479f3c190211e68103d6"

        const wss_protocol_a=encodeURIComponent(JSON.stringify({name:'w2w', id:id_a}))
        const wss_protocol_b=encodeURIComponent(JSON.stringify({name:'w2w', id:id_b}))

        //let ws1=mkClient(URL, PORT, type1, msg1)
        let ws1=mkClient(URL, PORT, 'a2a', 'ca', wss_protocol_a)
        let ws2=mkClient(URL, PORT, 'a2b', 'cb', wss_protocol_b, id_b)

        done()
    });

function mkClient(URL, PORT, type, msg, protocol, to){
    //接続情報
    const url=URL+':'+PORT


    // 送信するデータ
    //const type=type//'msg_from_ALICE'
   // const msg=msg//'ca'

    // 期待した値
    expected_str=msg+' to '+ PORT+' to '+msg

    const ws = new WebSocket(url, protocol)

    ws.on('open', function open() {
        // send to 3333
        sendMsg(ws, type, msg, to)
    })

    ws.on('message', function message(data) {

        // receive from 3333
        const receivedData=receiveFromServer(data)

        // assert
        if(receivedData.type==='msg_from_'+PORT){
            if(receivedData.msg==='msg_from_'+PORT){
                const actual_str=receivedData.msg
                console.log('data.msg', receivedData.msg)
                assert.equal(expected_str, actual_str)
            }
        }
        
        ws.close()
    });

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

