

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

module.exports = receiveFromServer