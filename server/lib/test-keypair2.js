const crypto = require('crypto')
const https = require('https')
const fs = require('fs')
k()
function k(){
    const keypair_=crypto.generateKeyPairSync(
        'Ed25519', 
        {
            privateKeyEncoding: { format: 'pem', type: 'pkcs8' }, 
            publicKeyEncoding: { format: 'pem', type: 'spki' }
        }
    )
    //console.log(keypair_)
}


const PORT=3335;
const HOST='reien.top'
const PEM_PATH='/etc/letsencrypt/live/'+HOST
const url=URL+':'+PORT
// server
const server = new https.createServer({
    cert: fs.readFileSync(PEM_PATH+'/fullchain.pem'),
    key: fs.readFileSync(PEM_PATH+'/privkey.pem'),
}).listen(PORT);

console.log(server)

