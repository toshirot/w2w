
// Including generateKeyPairSync from crypto module
const { generateKeyPairSync } = require('crypto');
  


let keys=mkKeyPairEd25519()
console.log(keys)
//-----------------------------------------------------------------------------
// make Key Pair
// @receivedData {string} received data
// @return keypair {object} oj.publicKey and oj.privateKey
function mkKeyPairEd25519(){
    //@see https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#keyobjectexportoptions
    //@see https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptogeneratekeypairsynctype-options
    // Including publicKey and  privateKey from 
    // generateKeyPairSync() method with its 
    // parameters
    const keypair =  generateKeyPairSync(
        'ed25519', 
        {
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' }, 
        publicKeyEncoding: { format: 'pem', type: 'spki' }
        }
    )
    
    //console.log(keypair.privateKey)
    //console.log(keypair.publicKey)
    return keypair
}

  
 