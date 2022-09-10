const assert=require("assert")
const {
  mkKeyPair: mkKeyPair,
  sign: sign, 
  verify: verify
}=require('../lib/mkKeyPair')


describe('signの作成とveryfy', function () {

    it('sign した signature は期待通りの値で、verify は true だった', (done) => {
        //let keys=mkKeyPair()
        let keys={
            publicKey: '-----BEGIN PUBLIC KEY-----\n' +
              'MCowBQYDK2VwAyEAGiL8jG0Po7lDi27Vvj9QGJIcIa66baYEsQnwKmisdGQ=\n' +
              '-----END PUBLIC KEY-----\n',
            privateKey: '-----BEGIN PRIVATE KEY-----\n' +
              'MC4CAQAwBQYDK2VwBCIEILtmRXxPQRtkYO6EBzTS0Rg5ZD9iZq0lf3PNAp0eBw9J\n' +
              '-----END PRIVATE KEY-----\n'
          }
          
        // 期待したtype
        const expected_sign='H24B/B4xS0944MbJvENa+4EnRrg31TNEEgYnyswe7VJspkg00j04B3ovVvaMAcQ1W96yLvcTHOTwhTUm8uYGCg=='
        const expected_verify=true

        let msg = [1,2,3]
        const signature =sign(msg, keys.privateKey)
        const actual_verify =verify(msg, signature, keys.privateKey)
        const actual_sign = signature.toString('base64')

        // 検証
        assert.equal(actual_sign, expected_sign)
        assert.equal(actual_verify, expected_verify)
        done()
    });

});