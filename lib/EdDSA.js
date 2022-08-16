/*
'use strict';
const EdDSA = require('elliptic').eddsa;
const ec = new EdDSA('ed25519');
const { SHA3 } = require('sha3');


test()


function test(){


    //==============================================
    // Prepare Keys
    // Corresponds to 3 and 4 after 1 and 2
    // Communication with testnet is omitted this sourse
    // 
    
            //----------------------------------------------
            // ALICE

            // Alice's Private Key
            const AlicePriKeyHex='fa127e73935678a647daf3d3af2a934dc0e9c9c39dc4ac2e69c9c3648447ff53';
            // Create key pair from secret
            const AlicePriKey = ec.keyFromSecret(AlicePriKeyHex, 'hex');// hex string, array or Buffer

            // Import public key
            const AlicePubKeyHex = '78cd96278f49a78664faf50e9b238f3f5642360d80b3b0ce82782a4a8af3a8e9';
            const AlicePubKey = ec.keyFromPublic(AlicePubKeyHex, 'hex');

            //----------------------------------------------
            // BOB

            const BobPriKeyHex='16253458330e54b08e3d492d200776d8af2d0367bbca4ca59df88985175a6069';
            // Create key pair from secret
            const BobPriKey = ec.keyFromSecret(BobPriKeyHex, 'hex');// hex string, array or Buffer

            // Import public key
            const BobPubKeyHex = '6e6579f1f368f9a4ac6d20a11a7741ed44d1409a923fa9b213e0160d90aa0ecc';
            const BobPubKey = ec.keyFromPublic(BobPubKeyHex, 'hex');
    



    // Start testing from the 5th

    //==============================================
    // 5. BOB: Make the "sigB" by the msg hash and  Bob's Private Key.
    //        
    //         msg = sha3Hash('hello') // mk massage hash 
    //         sigB = BobPriKey.sign(msg) // Sign with BOB's private key.
    //         // on this test, without this wss send. 
    //         // wss.send(sigB, msg) 

            //----------------------------------------------
            // Massage
            const msg = (new SHA3(512)).update('msg hello').digest('hex');

            //----------------------------------------------
            // Sign
            const sigB = BobPriKey.sign(msg).toHex();

            //----------------------------------------------
            // Send "sigB" and msg to Alice by WebSocket
            // Omitted

    //==============================================
    // 6. ALICE: Verify by Bob's Public Key the signB and the msg that were received.
    //      
            const res6 = BobPubKey.verify(msg, sigB);
    
    //==============================================
    // 7. ALICE: if 6th is true then Make the "sigA" by the Alice's Private Key and the "sigB".
    //
    
            //----------------------------------------------
            // test for res6

            if(res6===true){
                    console.info('8. ALICE: OK. verify(msg, sigB) is true.');
            } else {
                    console.error('8. ALICE: Error. verify(msg, sigB) is false.');
            }
            
            //----------------------------------------------
            // if res6 is true then  Make the "sigA"
            
            let sigA; 
            if(res6){
                    sigA = AlicePriKey.sign(sigB)
                    //mkQR([sigB, Address])
            } else {
                    //goto 1
            }

    //==============================================
    // 8. BOB: Verify the "sigB" and "sigA" by Alice's Public Key.

            const res8 = AlicePubKey.verify(sigB, sigA);

    //==============================================
    // 9. BOB: if 8th is true then Alice login is OK.

            //----------------------------------------------
            // test for res8

            if(res8===true){
                    console.info('9. BOB: OK. verify(sigB, sigA) is true.');
            } else {
                    console.error('9.BOB: Error. verify(sigB, sigA) is false.');
            }

}


// response
7. ALICE: OK. verify(msg, sigB) is true.
9. BOB: OK. verify(sigB, sigA) is true.
*/




// https://github.com/indutny/elliptic
const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')



// Create key pair from secret
const key = ec.keyFromSecret(uuidv4()); // hex string, array or Buffer

// Sign the message's hash (input must be an array, or a hex-string)
const msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
const signature = key.sign(msgHash).toHex();

console.log(msgHash, signature)
// Verify signature
console.log(key.verify(msgHash, signature));


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
    setTimeout(function() {
        uuid=random=null;
    }, 1000);
    return uuid;
}