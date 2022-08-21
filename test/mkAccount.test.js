
const assert = require("assert");
const mkAccount=require('../index.js').mkAccount
const removeCnf=require('../index.js').removeCnf
const getW2wCnf=require('../index.js').getW2wCnf
const getKeyPair=require('../index.js').getKeyPair

describe.only('新しいAccountの作成', function () {

    it('一旦古いアカウントを削除した', (done) => {
        // 期待した値
        const expected=null
        //一旦古いアカウントがあれば削除する
        removeCnf()
        //cnf fileの存在を調べる。無ければnull
        const actual=getW2wCnf()
        assert.equal(expected, actual)
        done();
    })
    it('新しいアカウントを作製した', (done) => {
        
        //一旦アカウントを作製する
        // 期待した値
        const expected=mkAccount()
        //アカウントを削除する
        removeCnf()
        //アカウントを作製する
        const actual=mkAccount()
        assert.notEqual(expected, actual)
        done();
    })
})