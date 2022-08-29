
const assert = require("assert");
const mkAccount=require('../index.js').mkAccount
const removeCnf=require('../index.js').removeCnf
const getW2wCnf=require('../index.js').getW2wCnf
const getAccountId=require('../index.js').getAccountId
const getOrSetKeyPair=require('../index.js').getOrSetKeyPair
const WebSocket=require('../index.js').WebSocket
const W2wSocket=require('../').W2wSocket


describe('新しいAccountの作成', function () {

    it('一旦古いアカウントを削除した', (done) => {
        // 期待した値
        const expected=null
        // 一旦古いアカウントがあれば削除する
        removeCnf()
        // cnf fileの存在を調べる。無ければnull
        const actual=getW2wCnf()
        // nullだった
        assert.equal(expected, actual)
        done();
    })
    it('新しいアカウントを作製した', (done) => {
        
        //一旦アカウントを作製する
        // 期待した値
        const expected=getAccountId()
        // アカウントを削除する
        removeCnf()
        // アカウントを作製する
        const actual=getAccountId()
        // 異なるアカウントIDが生成された
        assert.notEqual(expected, actual)
        done();
    })

})