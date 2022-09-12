
const assert=require("assert")
const sqlite = require('sqlite3').verbose();


describe('sqlite3の動作確認', function () {

    it('CREATE TABLE、INSERTし、SELECTした', (done) => {
        const db = new sqlite.Database('db/test/test.sqlite');

        db.serialize(function() {
        
          // テーブルがなければ作成
          db.run('CREATE TABLE IF NOT EXISTS students(name STRING, age INT)');
         
          // プリペアードステートメントでデータ挿入
          const stmt = db.prepare('INSERT INTO students VALUES(?,?)');
          stmt.run(["Takahashi", 66]);
          //stmt.run(["def", 3]);
          stmt.finalize();
        });
        
        // 期待したtype
        const expected_name="Takahashi"
        const expected_age=66

        db.serialize(function() {
            db.each("SELECT * FROM students", function(err, line) {
                //console.log( line.name  + ":" + line.age);
                const actual_name=line.name 
                const actual_age=line.age
                // 検証
                assert.equal(actual_name, expected_name)
                assert.equal(actual_age, expected_age)
            });

            // レコードを削除
            db.run('DELETE FROM students WHERE name = "Takahashi"', function(err) {
                if (err) {
                    return console.error(err.message);
                }
            });
        });

        db.close();
        done()
    });

    /*
    it('test2 SELECTした', (done) => {
        const db = new sqlite.Database('db/w2w/lists.sqlite');
        
        // 期待したtype
        const expected_name="Takahashi"
        const expected_age=66

        db.serialize(function() {
            db.each("SELECT * FROM students", function(err, line) {
                //console.log( line.name  + ":" + line.age);
                const actual_id=line.id 
                const actual_utime=line.utime

                console.log(actual_id, new Date(actual_utime) )
                // 検証
                //assert.equal(actual_name, expected_name)
               // assert.equal(actual_age, expected_age)
            });

 
        });

        db.close();
        done()
    });
    */
});