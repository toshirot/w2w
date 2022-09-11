var EdDSA = require('elliptic').eddsa;

// Create and initialize EdDSA context
// (better do it once and reuse it)
var ec = new EdDSA('ed25519');

//----------------------------------------------
// ALICE  this is for stub

// Alice's Private Key
const AlicePriKeyHex='fa127e73935678a647daf3d3af2a934dc0e9c9c39dc4ac2e69c9c3648447ff53';
// Create key pair from secret
const keyPairAlice = ec.keyFromSecret(AlicePriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const AlicePubKeyHex = '78cd96278f49a78664faf50e9b238f3f5642360d80b3b0ce82782a4a8af3a8e9';
const AlicePubKey = ec.keyFromPublic(AlicePubKeyHex, 'hex');

//----------------------------------------------
// BOB  this is for stub

const BobPriKeyHex='16253458330e54b08e3d492d200776d8af2d0367bbca4ca59df88985175a6069';
// Create key pair from secret
const keyPairBob = ec.keyFromSecret(BobPriKeyHex, 'hex');// hex string, array or Buffer

// Import public key
const BobPubKeyHex = '6e6579f1f368f9a4ac6d20a11a7741ed44d1409a923fa9b213e0160d90aa0ecc';
const BobPubKey = ec.keyFromPublic(BobPubKeyHex, 'hex');


// Create key pair from secret
//var keyPairAlice = ec.keyFromSecret(AlicePriKeyHex); // hex string, array or Buffer

// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = keyPairAlice.sign(msgHash).toHex();

// Verify signature
console.log(keyPairAlice.verify(msgHash, signature));

// CHECK WITH NO PRIVATE KEY
 
// Import public key
//var key = ec.keyFromPublic(AlicePubKey, 'hex');

// Verify signature
 
console.log(AlicePubKey.verify(msgHash, signature));
