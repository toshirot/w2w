
//=============================================================================
// imPORT
//
const WebSocket=require('ws')
const fs = require('fs')
const https = require('https')
// w2w
const { mkKeyPair, sign, verify } = require(__dirname+'/mkKeyPair')
const getOrSetKeyPair= require(__dirname+'/mkAccount').getOrSetKeyPair
const removeBeginEndStr= require(__dirname+'/mkAccount').removeBeginEndStr
// crypt
const EdDSA = require('elliptic').eddsa;
const ec = new EdDSA('ed25519');
// DB
const sqlite = require('sqlite3').verbose()
const dbPath='../../db/w2w' //path
if (!fs.existsSync(dbPath)) {
  console.log('dbPath:', dbPath)
  fs.mkdirSync(dbPath);
}
const db = new sqlite.Database(dbPath+'/lists.sqlite');
console.log('dbPath2:', dbPath+'/lists.sqlite')

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

//----------------------------------------------------------------------60-------
// wss関連定数
//
const PORT=3333;
const HOST='w2w.info'
const PEM_PATH='/etc/letsencrypt/live/'+HOST
const url=URL+':'+PORT

//-----------------------------------------------------------------------------
// key pair oj, set or get KeyPair to conf  by Ed25519
const keys={}//getOrSetKeyPair()

//-----------------------------------------------------------------------------
// アカウントID PubKey widthout BeginEndStr
const accountId=123456//removeBeginEndStr(keys).publicKey

// -----------------------------------------------------------------------------
//  verify時に使うpublicKeyは BeginEndStr start line　が必要
function verifyAB(msg, sigA, publicKey){
  return verify(msg, sigA, publicKey)
}
// -----------------------------------------------------------------------------
// make signB, set or get KeyPair to conf
// @sigA {string} sigA
// @keys {object} keys of this serber
// @return signB {string} base64 signB
function mkSigB(sigA, keys){
  const sigB=sign(sigA, keys.privateKey)//.toString('base64')
  //console.log(signA , sigB)
  return sigB
}

//-----------------------------------------------------------------------------
// HTTPSサーバーを起動する
//
// server
const server = new https.createServer({
    cert: fs.readFileSync(PEM_PATH+'/fullchain.pem'),
    key: fs.readFileSync(PEM_PATH+'/privkey.pem'),
}).listen(PORT);

//-----------------------------------------------------------------------------
// WebSocketサーバーを起動する
//
const ws = new WebSocket.Server({server});
ws.w2w={
  url: url
  , id: accountId // pubkey widthout BeginEndStr
}
let wsIdList=[]
//broadCast();//データ配信開始する場合に使う

//-----------------------------------------------------------------------------
// on connection
//
ws.on('connection', function(socket, req) {
  console.log('on connected: at ' + PORT, new Date());
  //-----------------------------------------------------------------------------
  // protocolを取得する
  const protocol = getSubProtocol(socket, req)
  if(!protocol)return
  
  //console.log('protocol.id',protocol.id)
  //-----------------------------------------------------------------------------
  // client oj socket.w2w_clien をセットする
  socket.w2w_client=setW2wClient(socket, req, protocol)


  //-----------------------------------------------------------------------------
  // Respose of reply back at on connection
  // 
  sendToReplay(socket, req, protocol)
  console.log('after sendToReplay: ' , socket.w2w_client.type, 'from:'+ socket.w2w_client.id, new Date());
  //console.log('my------', 4, socket._events)
  //-----------------------------------------------------------------------------
  // Respose of onmessage recieved
  //
  socket.on('message', function message(msg) {
    console.log('on message: at ' + PORT, msg, new Date());
    // console.log('my------', 6)
  
    try {
      
      data = JSON.parse(msg);
    } catch (e) {
        console.log('JSONparse err:', msg);
        return;
    }
    //socket.w2w_client.name=data.msg
 
    //-----------------------------------------------------------------------------
    // chk
    if(data.type!=='a2n'){
      if(!data.to)return
      if(data.to.length<1)return
    }
    
    //-----------------------------------------------------------------------------
    // recieved and send msg

    // send to sigC
    if(data.type==='sigC'){
      console.log('sendSigC',data.type)
      ws.sendSigC(socket,  data)
      return
    } else 

    // reply back e.g. ca->sa->ca
    if(data.type==='a2a'){
      console.log('sendA2A',data.type)
      ws.sendA2A(socket,  data)
      return
    } else 

    // send to other client
    if(data.type==='a2b'){
      if(!data.to)return
      console.log('do sendA2B on message',data.type)
      ws.sendA2B(data)
      return
    } else 

    // sent to gloup
    if(data.type==='a2g'){
      console.log('goto sendA2G', data )
      if(!data.to)return
      if(typeof data.to!=='object')return
      if(data.to.length<1)return
     
      ws.sendA2G(socket, data)
      return
    } else 

    // send to all, limit hop とかは必要だろうか
    if(data.type==='a2n'){
      console.log('do sendA2N on message',data.type)
      ws.sendA2N(socket, data)
      return
    }
    console.log('my------', 7)
    return
  });
 
});


//=============================================================================
// for connection

//-----------------------------------------------------------------------------
// getSubProtocol
//
function getSubProtocol(socket, req){
      // サブプロトコルからnameを取得
      let protocol=''+req.headers['sec-websocket-protocol']
      if(!protocol)return
      if(protocol==='undefined')return
      if(protocol===undefined)return

      // サブプロトコルデコード
      protocol=decodeURIComponent(protocol)
      //console.log('Protocol:', '--'+protocol+'--',typeof protocol)

      try {
          protocol = JSON.parse(protocol);
      } catch (e) {
          console.log('JSON protocol parse err:', protocol);
          //プロトコルエラーは切断する
          socket.close()
          return null
      }
      // サブプロトコルチェック
      if(!chkProtocol(protocol))return null

      return protocol
}

//-----------------------------------------------------------------------------
// chk Protocol
//
function chkProtocol(protocol){
  const protocolName='w2w'

  if(typeof protocol !=='object')return false
  if(!protocol.name)return false
  if(!protocol.id)return false
  if(protocol.to){

  }
  //if(protocol.id.length===128)return false
  //if(typeof protocol.id.length==='string')return false
  if(protocol.name!==protocolName)return false
  return true
}


//-----------------------------------------------------------------------------
// client を記憶する at on connection, non db ipは不要?
//
function setW2wClient(socket, req, protocol){
  // 既に存在してたらパスする
  //if(hasId(protocol.id)){
  //  delete socket
  //  return null
  //}
  //if(!socket.w2w_client){delete socket; return} //重複する accounrの socketは削除してしまう
  //console.log('save', protocol.id)
  let replyType=protocol.type
  let sigA = '' //3項演算子でconstにできないかな
  let sigB = ''

  if(protocol.type==='sigA'){
    replyType='sigB'
    sigA = protocol.sigA
    //----------------------------------------------
    // Sign
    sigB = keyPairBob.sign(sigA).toHex();

  //} else if(protocol.type==='reply'){
 
  } else {
    replyType='reply'
    sigA = ''
    sigB = ''
  }

  // console.log(protocol.type, sigA, sigB)

  // 存在してなければ登録する
  socket.w2w_client={
      id    : protocol.id||uuidv4()
      ,ip    : req.connection.remoteAddress||
              req.headers['x-forwarded-for'].split(',')[0].trim()
      ,url   : 'wss://'+HOST+':'+PORT
      ,type  : protocol.type
      ,status  : protocol.status
      ,sigA  : sigA
      ,sigB  : sigB
      ,pub   : accountId
      ,time  : new Date().getTime()
      ,name  : ''
  }
  return socket.w2w_client
}
//----------------------------------------------------------------------60-------
// reply Back To Client Self at on connection
//

// sendToReplay と sendToSigAは分ける？
function sendToReplay(socket, req, protocol){
  //console.log('protocol2:' + JSON.stringify(protocol));

  if(!protocol)return
  if(!protocol.type)return
  if(!protocol.id)return
  let replyType='reply'
  if(protocol.type==='sigA'){
    replyType='sigB'
  }

  let replydata={
    type: replyType
    , from: protocol.id
    , to: [protocol.id]
    , status: 2
    , id: accountId //pubKey
    , url   : 'wss://'+HOST+':'+PORT
    , sigB: socket.w2w_client.sigB||''
    , msg: replyType+' from wss://'+HOST+':'+PORT
    , date: new Date()
  }
  /*
  console.log(
    'sendToReplay:', 
    protocol.type, '->' ,replyType,
   '\n sigA is ',socket.w2w_client.sigA,
   '\n sigB is ',socket.w2w_client.sigB,
   '\n to', socket.w2w_client.id
   )
*/
  //----------------------------------------------------------------------60-------
  // send to client
  socket.send(JSON.stringify(replydata));

  socket.w2w_client.status=2
}

//-----------------------------------------------------------------------------
// has id in the client.w2w_client list on ws
//
function hasId(id){
    let idlists=[]
    ws.clients.forEach(function each(client) {
      if(client.w2w_client){
        idlists.push(client.w2w_client.id)
      }
      
      /*
      if(!client)return //continue
      if(!client.w2w_client)return //continue
      if (client.w2w_client.id === id) {
        console.log(client.w2w_client.id === id)
        return true // hasId is true
      } else {
        return 
      }*/
    })
    if(idlists.indexOf(id)!==-1)return true // hasId is true
    else return false // hasId is false
}

//=============================================================================
// for send

//-----------------------------------------------------------------------------
// format of send object
//
function mkSendOj(data){
  return {
    type:  data.type
    ,from: data.from//socket.w2w_client.id
    ,to:   data.to
    ,url   : 'wss://'+HOST+':'+PORT
    ,msg:  data.msg
  }
}

ws.sendSigC=function(socket, data){
  let sigC = data.msg
  let sigC_verify=false
  let replyType='sigOK'
  // console.log('ssigB:--1-------', socket.w2w_client.sigB)
  // cconsole.log('ssigc:--1-------', sigC)

  //----------------------------------------------
  // verify for sigB, sigC
  sigC_verify=AlicePubKey.verify(socket.w2w_client.sigB, sigC)
  // cconsole.log('sendSigC:--2-------', sigC_verify, new Date())
  if(sigC_verify){
    data.type=replyType
    console.log('sendSigC:--3-------', sigC_verify, new Date())

    //----------------------------------------------
    // save to client list db
    saveToClientListDB(socket.w2w_client.id)
    
    //----------------------------------------------
    // send to client OK
    socket.send(
      JSON.stringify(mkSendOj(data))
    )
    console.log('sended! sendSigC:---------', data, new Date())
  }
}

//-----------------------------------------------------------------------------
// a2a返信
//
ws.sendA2A=function sendA2A(socket, data) {
  
  socket.send(
    JSON.stringify(mkSendOj(data))
  )
  //console.log('sended! sendA2A:---------', new Date())
}
//-----------------------------------------------------------------------------
// a2b送信 to を指定して送信する
//
ws.sendA2B=ws.sendByid=function sendByid(data) {
  
  ws.clients.forEach(function each(client) {
    //console.log('ws.clients: ', client.readyState, client.w2w_client.id)
    if (client.readyState === WebSocket.OPEN) {
      //console.log('sendA2B:1', data, 'client:',client.w2w_client.id,new Date())
      //console.log('sendA2B:2', client.w2w_client.id === data.to[0], 'to:', data.to[0], 'client:', client.w2w_client.id, new Date())
      if (client.w2w_client.id === data.to[0]) {
        data.s='sss'
          let res=JSON.stringify(mkSendOj(data));
          client.send(res);
          // console.log('sended! sendA2B:---------', new Date())
          return
      }
    }
  });
};

//-----------------------------------------------------------------------------
// a2g送信 gloup list を指定して送信する
// 大量のlistでDDos化しないように一応 interval をもうける
// 
ws.sendA2G=function sendA2G(socket, data) {
  // console.log('at sendA2G',data)
  const sendToList=JSON.parse(JSON.stringify(data.to))
  
  //let list_to=data.to
  ws.clients.forEach(function each(client) {
    console.log(client.readyState, client.w2w_client.id)
    if (client.readyState === WebSocket.OPEN) {
      for(i=0;i<sendToList.length;i++){
        if (client.w2w_client.id === sendToList[i]) {
          // console.log(client.w2w_client.id, client.readyState, sendToList[i])
            data.to= [sendToList[i]]
            let res=JSON.stringify(mkSendOj(data));
            client.send(res);
           // console.log('sended! sendA2G:---------', (i+1)+'/'+ sendToList.length, res, new Date())
             
        } else {
          
        }
        //console.log(i)
      }
    
    }
    
  });
  
}

//-----------------------------------------------------------------------------
// a2n送信 宛先を指定せずに接続中の client全てに送信する
// 大量のlistでDDos化しないように一応 interval をもうける
// 
ws.sendA2N=function sendA2N(socket, data) {
   console.log('at sendA2N',data)
   ws.broadcast(socket, data)
 }

//-----------------------------------------------------------------------------
// ブロードキャスト用 同胞送信に使える
//
ws.broadcast = function broadcast(socket, data) {
  let type=data.type.toUpperCase()// e.g. A2N
  ws.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        data.to= [client.w2w_client.id]
        let res=JSON.stringify(mkSendOj(data));
        //console.log('sended! send'+type+':--------- to:',  client.w2w_client.id, new Date())
        client.send(res);
      }
  });
};


//----------------------------------------------
// save to client list db
//
function saveToClientListDB(id){
  if(!id)return
  const utime=new Date().getTime()
  db.serialize(function() {
    // テーブルがなければ作成する
    db.run('CREATE TABLE IF NOT EXISTS students(id STRING, utime INTEGER)');
    // プリペアードステートメントでデータを挿入する
    const stmt = db.prepare('INSERT INTO students VALUES(?,?)');
    stmt.run([id, utime]);
    //stmt.run(["def", 3]);
    stmt.finalize();
  });
}


//-----------------------------------------------------------------------------
// ws.clients内の重複IDを削除する
//
function delDuplicatedAccount(ws_clients){
  ws_clients.forEach(function each(client) {
    console.log(client.w2w_client.id)
  })
  return ws_clients
}


//-----------------------------------------------------------------------------
// 送信
//
function send(socket, type, msg){
  if (socket.readyState===1) {
      let res=JSON.stringify({
          type: type
          ,msg: msg
      });
      socket.send(res);
  } else {
      //delClient(socket, 'at : send '+type+' '+socket.readyState);
  }
}

//=============================================================================
// other util

//-----------------------------------------------------------------------------
// Client切断
//
function delClient(socket, msg) {

  //if(!socket.user_data||socket.user_data===undefined)return
  //console.log('--to be del--: ', msg, socket.user_data.user_id)
  //socket.user_data=undefined
  socket.close()
  socket.terminate()
  socket.ping(function() {})
}



function mkData(){
let data = [
    ["年度"],
    ["s2"],
    ["s3"]
  ];
  let now = new Date();
  let H = now.getHours();
  let M = now.getMinutes();
  let S = now.getSeconds();
  H = (H < 10)?'0'+H:H;
  M = (M < 10)?'0'+M:M;
  S = (S < 10)?'0'+S:S;
  
    data[0]=H +':' + S;
    data[1]=Math.floor(Math.random(10) * 96 );
    data[2]=18 + Math.floor(Math.random(10) * 48);
  
  return data;
} 

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

/*
memo:

https://github.com/indutny/elliptic



    const EdDSA = require('elliptic').eddsa
    const ec = new EdDSA('ed25519')

    EdDSA
    var EdDSA = require('elliptic').eddsa;

    // Create and initialize EdDSA context
    // (better do it once and reuse it)
    var ec = new EdDSA('ed25519');

    // Create key pair from secret
    var key = ec.keyFromSecret('693e3c...'); // hex string, array or Buffer

    // Sign the message's hash (input must be an array, or a hex-string)
    var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    var signature = key.sign(msgHash).toHex();

    // Verify signature
    console.log(key.verify(msgHash, signature));

    // CHECK WITH NO PRIVATE KEY

    // Import public key
    var pub = '0a1af638...';
    var key = ec.keyFromPublic(pub, 'hex');

    // Verify signature
    var signature = '70bed1...';
    console.log(key.verify(msgHash, signature));

    //------------------------------------------------------------
    // e.g at https://github.com/toshirot/libra-auth

    //------------------------------------------------------------
    // BOB  this is for stub
    const BOB_ADDRESS_HEX='4fb5de5cf96588273ceab41ee1a807ea4efb0c6f8c08f10c2efc617175cea390'
    const BOB_PRI_KEY_HEX='16253458330e54b08e3d492d200776d8af2d0367bbca4ca59df88985175a6069';
    // Create key pair from secret
    const BobPriKey = ec.keyFromSecret(BOB_PRI_KEY_HEX, 'hex');// hex string, array or Buffer
    // const nemonic=["uncle", "grow", "purchase", "fury", "upper", "chalk", "venture", "evidence", "enrich", "margin", "gentle", "range", "seven", "route", "clip", "vehicle", "ticket", "lawn", "stuff", "hungry", "clap", "muffin", "choice", "such"]
    // Import public key
    const BOB_PUB_KEY_HEX = '6e6579f1f368f9a4ac6d20a11a7741ed44d1409a923fa9b213e0160d90aa0ecc';
    const BobPubKey = ec.keyFromPublic(BOB_PUB_KEY_HEX, 'hex');

        //------------------------------------------------------------
        // for temp0906
        let publicKeyHex=addreesAndMsg.pub
        const AlicePubKeyOj = ec.keyFromPublic(publicKeyHex, 'hex')
*/