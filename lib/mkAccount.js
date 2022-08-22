
const { mkKeyPair , sign, verify } = require(__dirname+'/mkKeyPairEd25519')
const fs=require('fs')
const CONF_PATH='w2w.cnf'

module.exports ={
   // mkSigAndVeryfyTest: mkSigAndVeryfyTest,
    getAndSetKeyPair: getAndSetKeyPair,
    mkAccount: mkAccount, //pubkey
    removeCnf: removeCnf,
    getW2wCnf: getW2wCnf,
    getAccountId: getAccountId
}


/*

console.log(getAccountId())

let keys=getAndSetKeyPair()
console.log(1, keys)

let acc=mkAccount(true)
console.log(2, acc)
let removedBegin=removeBeginEndStr(keys)
console.log(3, removedBegin)
console.log(4,setBeginEndStr(removedBegin))
//removeCnf()
//console.log(getW2wCnf())
*/


//-----------------------------------------------------------------------------
// make Account 
// @hasNotBiginEnd {bool} flg of has not -----BEGIN PUBLIC KEY--...END PRIVATE KEY-----
// @return publicKey {string} publicKey
function mkAccount(hasNotBiginEnd){

    let keypair= keypairOj= getAndSetKeyPair()
    /* this keypair oj is 
    {
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
        'MCowBQYDK2VwAyEAj7HydxcbeJClJ9miNkdMFBYIk3/Y4ZKsGmnSwlA2F5Y=\n' +    
        '-----END PUBLIC KEY-----\n',
    privateKey: '-----BEGIN PRIVATE KEY-----\n' +
        'MC4CAQAwBQYDK2VwBCIEIGxgIrfrAGQixpto4uTVnN4lbpQsA39vi4IGCtbaxQ++\n' +
        '-----END PRIVATE KEY-----\n'
    }
        */
    if(hasNotBiginEnd){
        //has not -----BEGIN PUBLIC KEY--...END PRIVATE KEY-----
        keypairOj=removeBeginEndStr(keypair)
    }
    
    return keypairOj.publicKey
}



//-----------------------------------------------------------------------------
// removeCnf
function removeCnf(){
    if (!fs.existsSync(CONF_PATH))return
    try {
        fs.unlinkSync(CONF_PATH)
    //file removed
    } catch(err) {
        console.error(err)
    }
}

//-----------------------------------------------------------------------------
// setBiginEndStr
function setBeginEndStr(keyPair){
    if(keyPair.publicKey.indexOf('BEGIN PUBLIC KEY')===-1){
        keyPair.publicKey= '-----BEGIN PUBLIC KEY-----\n' +
        keyPair.publicKey+'\n' +    
        '-----END PUBLIC KEY-----\n'
    }
    if(keyPair.privateKey.indexOf('BEGIN PRIVATE KEY')===-1){
        keyPair.privateKey= '-----BEGIN PRIVATE KEY-----\n' +
        keyPair.privateKey+'\n' +    
        '-----END PRIVATE KEY-----\n'
    }
    return  keyPair
}
//-----------------------------------------------------------------------------
// removeBeginEndStr
function removeBeginEndStr(keypair){
    let keypairOj={
        publicKey: keypair.publicKey.split('\n')[1],
        privateKey: keypair.privateKey.split('\n')[1]
    }
    return keypairOj
}

//mkSigAndVeryfyTest()
//-----------------------------------------------------------------------------
// receive from server
// @receivedData {string} received data
// @return data {object}
function mkSigAndVeryfyTest(){

    if(process.env.w2w)return

    let keys=mkKeyPair()

    let msg = getRandomAry(2)
    var signature =sign(msg, keys.privateKey)
    var verified =verify(msg, keys.publicKey, signature)
    console.log(signature.toString('base64'))
    console.log(verified)
    return keys
}


//-----------------------------------------------------------------------------
// get KeyPair
// @return getAndSetKeyPair {object|null} getAndSetKeyPair
function getAndSetKeyPair(){
    let cnf_data=''
    if (fs.existsSync(CONF_PATH)) {
        return getW2wCnf()
    } else {
        return setW2wCnf()
    }
}

//-----------------------------------------------------------------------------
// set W2wCnf
// @return W2wCnf {object|null} W2wCnf
function setW2wCnf(){
    if (!fs.existsSync(CONF_PATH)) {
        // cnfが無ければ作りセットする
        let keys=mkKeyPair()
        let keysStr=JSON.stringify(keys)
        fs.writeFileSync(CONF_PATH,  keysStr)
    
        return keys
    } return null
}

//-----------------------------------------------------------------------------
// get W2wCnf
// @return W2wCnf {object|null} W2wCnf
function getW2wCnf(){
    if (fs.existsSync(CONF_PATH)) {
        cnf_data=fs.readFileSync(CONF_PATH, "utf8")
        try{
            return JSON.parse(cnf_data)
        } catch(e){
            return null
        }
    } return null
}
//-----------------------------------------------------------------------------
// get accountId 
// @return publicKey {string} publicKey widthout BeginEndStr
function getAccountId(){
    let keys=getAndSetKeyPair()
    keys=removeBeginEndStr(keys)
    return keys.publicKey
}
//-----------------------------------------------------------------------------
// get privateKey
// @return privateKey {string} privateKey
function getPrivKey(){
    let keys=getAndSetKeyPair()
    return keys.privateKey
}
//-----------------------------------------------------------------------------
// get publicKey
// @return publicKey {string} publicKey
function getPubkey(){
    let keys=getAndSetKeyPair()
    return keys.publicKey
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
