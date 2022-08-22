
//const getAccountId=require('../').getAccountId
const getAccountId=require('./mkAccount').getAccountId

//-----------------------------------------------------------------------------
// receive from server
// @acceptType {string} a2a|a2b|a2n|a2g|...
// @receivedData {string} received data
// @return data {object}
function receiveFromServer(acceptType, receivedData){
   
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
        //console.log(5555, data)
        return data
    } else {
        //console.log(666, data)
        //return data
    }
}
 
module.exports = receiveFromServer