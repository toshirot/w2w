const crypto = require('crypto')
const https = require('https')
const fs = require('fs')
 
const keypair_=crypto.generateKeyPairSync(
    'rsa', 
    {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret'
        }
    });
console.log(keypair_)
 

const PORT=3335;
const HOST='w2w.info'
const PEM_PATH='/etc/letsencrypt/live/'+HOST
const url=URL+':'+PORT
// server
const server = new https.createServer({
    cert: fs.readFileSync(PEM_PATH+'/fullchain.pem'),
    key: fs.readFileSync(PEM_PATH+'/privkey.pem'),
}).listen(PORT);

//console.log(server)
