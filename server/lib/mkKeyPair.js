/* 
@see 
@see for sign,verify https://stackoverflow.com/questions/70408080/crypto-generatekeypairsynced25519-does-not-verify-simple-test-which-an-ec
*/
// Including generateKeyPairSync from crypto module
module.exports = {
    mkKeyPair: mkKeyPair,
    sign: sign, 
    verify: verify
}
const crypto = require('crypto')


/*
let keys=mkKeyPair()

let msg = [1,2,3]//'testingInformation'
var signature =sign(msg, keys.privateKey)// var signature = crypto.sign(null, Buffer.from(msg), keys.privateKey)
var verified =verify(msg, signature, keys.publicKey)//crypto.verify(null, Buffer.from(msg),keys.publicKey, signature)
//console.log(signature.toString('base64'))
console.log(verified)
 */

//-----------------------------------------------------------------------------
// make Key Pair
// @hasNotBiginEnd {bool} flg of has not -----BEGIN PUBLIC KEY--...END PRIVATE KEY-----
// @return keypair {object} oj.publicKey and oj.privateKey
function mkKeyPair(hasNotBiginEnd){
    //@see https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#keyobjectexportoptions
    //@see https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptogeneratekeypairsynctype-options
    // Including publicKey and  privateKey from 
    // generateKeyPairSync() method with its 
    // parameters

    // cryptoで使える暗号化アルゴリズムを配列で取得する
    // const cipers = crypto.getCiphers();
    // console.log(cipers);
    // const hashes = crypto.getHashes();  
    // console.log(hashes);

    let keypair=crypto.generateKeyPairSync(
        'ed25519', 
        {
            privateKeyEncoding: { format: 'pem', type: 'pkcs8' }, 
            publicKeyEncoding: { format: 'pem', type: 'spki' }
        }
    )


    return keypair
}
//-----------------------------------------------------------------------------
// get signature
// @msg {string|ArrayBuffer|Buffer|TypedArray|DataView} 
// @privateKey {object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey} privateKey Key
// @return signature {buffer} signature
function sign(msg, privateKey){
    //console.log('privateKey is: ', privateKey)
    return crypto.sign(null, Buffer.from(msg), privateKey)
}
//-----------------------------------------------------------------------------
// get verify
// @msg {string|ArrayBuffer|Buffer|TypedArray|DataView} 
// @signature {ArrayBuffer|Buffer|TypedArray|DataView} signature
// @publicKey {object|string|ArrayBuffer|Buffer|TypedArray|DataView|KeyObject|CryptoKey} public Key
// @return verify {bool} true or false depending on the validity of the signature for the data and public key 
// @see https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptoverifyalgorithm-data-key-signature-callback
// verify時に使うpublicKeyには　BeginEndStr start line　が必要
function verify(msg, signature, publicKey){
   // console.log('publicKey is: ', publicKey)
    return crypto.verify(null, Buffer.from(msg), publicKey, signature)
}

 

 