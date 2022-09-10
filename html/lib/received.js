 
module.exports = { received: received }
//const getAccountId=require('../').getAccountId
const getAccountId=require('./mkAccount').getAccountId

//-----------------------------------------------------------------------------
// receive from server 
// on message 後の受信
//
// @id {string} my accout id 
// @acceptType {string} accept type a2a|a2b|a2n|a2g|...
// @receivedData {string} received data of JSON.stringified send Object
// @return data {object}
// 
function received(id, acceptType, receivedData){
    // on message後の受信
    const accountId =getAccountId()

    //console.log(123,receivedData)
    let data={}
    try {
        data = JSON.parse(receivedData);
    } catch (e) {
        console.log('JSONparse err:', e);
        return;
    }
 
    //if(data.url)console.log(data) 
    /*
    console.log('received:', data);
    if(!data)return {}
    if(!data.type)return {}
    if(!data.from)return {}
    if(!data.to)return {}
    */
    // if(data.to!==accountId){ return {}}
    
    // acceptType 以外は無視する
    if(data.type===acceptType){

        // 着信時のto配列には1個だけidが入ってる。
        // つまりそれがidと同じなら正しく送付されたことになる
        if(data.to[0]===id){
            //console.log(acceptType, data)
            // if(data.type==='sigB')console.log(acceptType, data)
            return data
        } 
    } else {
        // do noting
    }

}