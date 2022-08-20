/*
https://github.com/bitchan/eccrypto

*/


ECDSA()
function ECDSA(){
    var crypto = require("crypto");
    var eccrypto = require("eccrypto");
    
    // A new random 32-byte private key.
    var privateKey = eccrypto.generatePrivate();
    // Corresponding uncompressed (65-byte) public key.
    var publicKey = eccrypto.getPublic(privateKey);
    
    var str = "message to sign";
    // Always hash you message to sign!
    var msg = crypto.createHash("sha256").update(str).digest();
    
    eccrypto.sign(privateKey, msg).then(function(sig) {
      console.log("Signature in DER format:", sig);
      eccrypto.verify(publicKey, msg, sig).then(function() {
        console.log("Signature is OK");
      }).catch(function() {
        console.log("Signature is BAD");
      });
    });
}

ECDH()
function ECDH(){
    var eccrypto = require("eccrypto");

    var privateKeyA = eccrypto.generatePrivate();
    var publicKeyA = eccrypto.getPublic(privateKeyA);
    var privateKeyB = eccrypto.generatePrivate();
    var publicKeyB = eccrypto.getPublic(privateKeyB);
    
    eccrypto.derive(privateKeyA, publicKeyB).then(function(sharedKey1) {
      eccrypto.derive(privateKeyB, publicKeyA).then(function(sharedKey2) {
        console.log("Both shared keys are equal:", sharedKey1, sharedKey2);
      });
    });

}