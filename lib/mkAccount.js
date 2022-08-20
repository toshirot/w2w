

// https://github.com/indutny/elliptic
const EdDSA = require('elliptic').eddsa
// Create and initialize EdDSA context
// (better do it once and reuse it)
const ec = new EdDSA('ed25519');

mkKeypairTest()
//-----------------------------------------------------------------------------
// receive from server
// @receivedData {string} received data
// @return data {object}
function mkKeypairTest(){
 
    // Client's Private Key
    const ClientPriKeyHex='fa127e73935678a647daf3d3af2a934dc0e9c9c39dc4ac2e69c9c3648447ff53'
    // Import public key
    const ClientPubKeyHex = '78cd96278f49a78664faf50e9b238f3f5642360d80b3b0ce82782a4a8af3a8e9'

    // Create key pair from secret
    const ClientKeyPair = ec.keyFromSecret(ClientPriKeyHex) // hex string, array or Buffer

    // Sign the message's hash (input must be an array, or a hex-string)
    const msgHash = getRandomAry(2)
    const signatureA = ClientKeyPair.sign(msgHash).toHex()

    //console.log(msgHash, signature)
    // Verify signature
    console.log(ClientKeyPair.verify(msgHash, signatureA))


    //-----------------------------
    // Import public key
    const key2 = ec.keyFromPublic(ClientPubKeyHex, 'hex');

    // Verify signature
    //var signature = '70bed1...';
    console.log(key2.verify(msgHash, signatureA));
}

//-----------------------------------------------------------------------------
// getRandomAry
// @digitsNumber {number} the number of digits in the retrieved array
// @aryLen {number} array length, default is 10
// @return data {array} the array to be obtained e.g.  getRandomAry(2, 10) -> [15, 91, 96, 29, 94, 23, 35, 21, 34, 95]
function getRandomAry(digitsNumber, aryLen){
    let ary=[]
    if(!aryLen)aryLen=10
    for(let i=0;i<aryLen;i++){
        ary.push(getRandom(digitsNumber))
    }
    return ary
}

//-----------------------------------------------------------------------------
// getRandom
// @digitsNumber {number} number of digits to get
// @return data {number} random number e.g. getRandom(5) -> 32398
function getRandom(digitsNumber){
    return +(Math.random() *(10**digitsNumber)).toFixed()
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
    return uuid;
}