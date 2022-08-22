
const assert = require("assert");
const mkAccount=require('../index.js').mkAccount
const removeCnf=require('../index.js').removeCnf
const getW2wCnf=require('../index.js').getW2wCnf
const getAccountId=require('../index.js').getAccountId
const getAndSetKeyPair=require('../index.js').getAndSetKeyPair
const WebSocket=require('../index.js').WebSocket

// -----------------------------------------------------------------------------
// mkClient
//
function mkClient(URL, PORT, protocol){
    //接続情報
    const url=URL+':'+PORT
    const ws = new WebSocket(url, protocol)

    return ws
}

describe.only('新しいAccountの作成', function () {

    it('一旦古いアカウントを削除した', (done) => {
        // 期待した値
        const expected=null
        //一旦古いアカウントがあれば削除する
        removeCnf()
        //cnf fileの存在を調べる。無ければnull
        const actual=getW2wCnf()
        assert.equal(expected, actual)
        done();
    })
    it('新しいアカウントを作製した', (done) => {
        
        //一旦アカウントを作製する
        // 期待した値
        const expected=mkAccount()
        //アカウントを削除する
        removeCnf()
        //アカウントを作製する
        const actual=mkAccount()
        assert.notEqual(expected, actual)
        done();
    })

    /*
    it('アカウントのPubKeyをサーバーへ送った', (done) => {
        
        //アカウントのを作製する
        // 期待した値
        const expected=mkAccount()
 

        //接続先
        const PORT=3333
        const URL='wss://reien.top'

        const id_a=expected
        const wss_protocol_a=encodeURIComponent(JSON.stringify({name:'w2w', id:id_a}))

        //let ws1=mkClient(URL, PORT, type1, msg1)
        let ws_a=mkClient(URL, PORT, wss_protocol_a)

        ws_a.on('open', function open() {
            // send to 3333
            sendFromClient(ws_a, 'a2a', 'ca', id_a)
        })

        ws_a.on('message', function message(data) {

            // receive from 3333
            const receivedData=receiveFromServer(data)
            console.log('data.msg', receivedData)
            // assert
            if(receivedData.type==='msg_from_'+PORT){
                if(receivedData.msg==='msg_from_'+PORT){
                    const actual=receivedData.msg
                    console.log('data.msg', receivedData.msg)
                    assert.equal(actual, expected)
                }
            }
            
        // ws.close()
        });


        done()


    })
    */
})