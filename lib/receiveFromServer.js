
//const getAccountId=require('../').getAccountId
const getAccountId=require('./mkAccount').getAccountId

//-----------------------------------------------------------------------------
// receive from server
// @id {string} my accout id 
// @acceptType {string} accept type a2a|a2b|a2n|a2g|...
// @receivedData {string} received data of JSON.stringified send Object
// @return data {object}
function receiveFromServer(id, acceptType, receivedData){
   
    const accountId =getAccountId()
    let data={}
    try {
        data = JSON.parse(receivedData);
    } catch (e) {
        console.log('JSONparse err:', data);
        return;
    }
    // on message後の受信なので
    
    /*
    if(!data)return {}
    if(!data.type)return {}
    if(!data.from)return {}
    if(!data.to)return {}
    */
    // if(data.to!==accountId){ return {}}
    
    // acceptType 以外は無視する
    if(data.type===acceptType){
        //console.log('----i am ', data.type, id, 'at', 'receiveFromServer')
        if(data.type==='replyBack'){
            // replyBackの時は onconnection 発信なのでdata.toがない 付けた方が良い？
            return data
        } else {
            // 着信時のto配列は1個だけidが入ってる。
            // つまりそれがidと同じなら正しく送付されたことになる
            if(data.to[0]===id){
                return data
            } 
        }
    } else {
        // do noting
    }

}
 
module.exports = receiveFromServer