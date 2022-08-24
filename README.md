# w2w
Tool for WebSocket to WebSocket. Realizing W2W (WebSocket-to-WebSocket) like P2P. But is not P2P.

### サイト準備
https://w2w.info/

### 動機

約10年くらい前(たぶん2012年頃?)に、WebSocketのネットワークを繋いでいったら面白いのじゃないかと思って話したら、何故かいきなり横から「そんなのP2Pじゃないっ!」と言われて不条理ではあったけど凹んだまま、2022年となり、

歳も取って、既にその人が誰だったかすらも忘れ(^^;、まぁ他の人が何を言おうと、自分が面白いと思うなら、自分のできる範囲でやってみようかなと思ったのが、このプロジェクトを始めた動機です。

有難いことに勇気づけてくれる方もいたので、まぁ、お陰様でこの10年で自分の知識量も増えた訳だし、そのいきなり否定した方も含めて、今この世界線に自分が来たことを全ての方々に感謝しつつ頑張ろうかなと思ってます。

したがって、ここでやろうとしてるのはほんの少しP2Pに似てるかもしれないけど、P2Pではないです。WebSocket 2 WebSocke の W2W です。

p.s. 勇気付けてくれる人がいるだけで、人は立ち上がれる。再チャレンジできる。
自分も誰かに微力でも勇気を渡せるそんな人になりたいです。<無理かも

### TODO
<ol>
<li>「参加処理 ID登録」をsigCまでの手順でやってみる
<li>サーバーが接続してきたときに自動登録する仕組みを考える
<li>複数ネットワーク時の効率の良いルーティング手順を決める
<li>ディレクトリにサーバー側も入れて書き直す
<li>a2g (sent to gloup)で配列リストにグループ名をSlackチャンネルのように付けられると良いかもしれない
<li>a2g (sent to gloup)でグループメンバーの検証をするケースと単に宛先を複数指定するケースは別かもしれない。今は後者でテストしてる。
<li>できればこのTODOをClickUpに連動したい
<li>そろそろ dev_branchを作って作業したほうが良いかな
</ol>

### 最新のTEST状況

```

凡例 通信方向
------------------------------------------------------------------------------
replyBack: at onconnected 自分自身へ返す 
a2a: at onmsg, client から server へ送信し、更に、同じ client へ返信する
a2b: at onmsg, client から server へ送信し、更に、別の client へ送信する
a2g: at onmsg, client から server へ送信し、更に、複数の指定した client へ送信する
a2n: at onmsg, client から server へ送信し、更に、接続してる全 client へ送信する
------------------------------------------------------------------------------

w2w.info\html>npm run test

> w2w@1.0.0 test
> mocha

  新しいAccountの作成
    ✔ 一旦古いアカウントを削除した
    ✔ 新しいアカウントを作製した

  WebSocketサーバーとの送受信
    ✔ replyBack: "reply Back from wss://reien.top:3333"を受信できた (145ms)
    ✔ replyBack: "reply Back from wss://reien.top:3334"を受信できた (84ms)
    ✔ a2a: wss://reien.top:3333 へsendして結果を受け取った。"a2a hello w2w"を受信できた
    ✔ a2b: wss://reien.top:3333 へsendして cb が結果を受け取った。"a2b hello w2w"を受信できた
    ✔ a2g: client a,b,c があるときに to [b,c] へ送り b,c だけが受け取った。
    ✔ a2n: client a,b,c があるときに to n(all) へ送り 全員が受け取った。


  8 passing (275ms)
```

### 想定している実装環境
- OS
    Ubuntu ( or Win/Mac )
- フレームワーク
    Node.js
- データベース(現在は only on memory)
    MongoDB
- Client は現状 command line (browserfyなどして将来はブラウザUIもある？)
- wss Server はUbuntu/Node.js/ws

### 経路type
<ul>
    <li>1) at on connect:
        <ul>
        <li>replyBack (reply to myself)
        </ul>
    </li>
</ul>
<ul>
    <li>2) at on message: 
        <ul>
            <li>s2c (sent to client from server)
            <li>c2s (sent to server from client)
            <li>a2a (reply to myself)
            <li>a2b (sent to an other)
            <li>a2g (sent to gloup)
            <li>a2n (sent to all/broadcast)
            <li>s2s (server to server)
        </ul>
    </li>
</ul>

( x2s terminate on last server. )

### 構築後のフロー
<p>※◎はテスト済み</p>

#### at on connect: 自動で返される reply back

```mermaid
flowchart LR

%%test0("at on connect: 自動で返される reply back"):::class_text

    %%single_type3
        text_a2a("◎replyBack"):::class_text_min
        single_type3c(ws client ca) 
        single_type3s(ws server sa):::class_server
            text_a2a -.- single_type3c
            single_type3c --> |to rb| single_type3s --> single_type3c

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
classDef class_text_min fill:#fff,color:#000,stroke:#fff,margin:0
```

#### at on message:1 単一ネットワーク single network

```mermaid
flowchart LR

    %%single_type1
        text_s2c("s2c"):::class_text_min
        single_type1c(ws client ca) 
        single_type1s(ws server sa):::class_server
            text_s2c -.- single_type1s
            single_type1s --> single_type1c 

    %%single_type2
        text_c2s(c2s):::class_text_min
        single_type2c(ws client ca) 
        single_type2s(ws server sa):::class_server
            text_c2s -.- single_type2c
            single_type2c --> single_type2s

    %%single_type3
        text_a2a("◎a2a"):::class_text_min
        single_type3c(ws client ca) 
        single_type3s(ws server sa):::class_server
            text_a2a -.- single_type3c
            single_type3c --> |to a| single_type3s --> single_type3c

    %%single_type4
        text_a2b("◎a2b"):::class_text_min
        single_type4c1(ws client ca) 
        single_type4s1(ws server sa):::class_server 
        single_type4c2(ws client cb)
            text_a2b -.- single_type4c1
            single_type4c1 -->  |to b| single_type4s1 --> single_type4c2

    %%single_type6
        text_a2g("◎a2g"):::class_text_min
        single_type6c1(ws client ca) 
        single_type6s1(ws server sa):::class_server 
        single_type6c3(ws client cb) 
        single_type6c4(ws client cc) 
            text_a2g -.- single_type6c1
            single_type6c1 --> |to b,c| single_type6s1 
                        single_type6s1 --> single_type6c3
                        single_type6s1 --> single_type6c4
                        
    %%single_type5
        text_a2n("◎a2n"):::class_text_min
        single_type5c1(ws client ca) 
        single_type5s1(ws server sa):::class_server 
        single_type5c2(ws client ca) 
        single_type5c3(ws client cb) 
        single_type5c4(ws client ..n) 
            text_a2n -.- single_type5c1
            single_type5c1 --> |to all| single_type5s1 -->single_type5c2
                        single_type5s1 --> single_type5c3
                        single_type5s1 --> single_type5c4




classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff,margin:0
classDef class_text_min fill:#fff,color:#000,stroke:#fff,margin:0
```

#### at on message:2 複数ネットワーク multiple networks

```mermaid
flowchart LR

    %%multi_type1
        text_s2s(s2s):::class_text_min
        multi_type1s1(ws server sa):::class_server
        multi_type1s2(ws server sb):::class_server
            text_s2s -.- multi_type1s1
            multi_type1s1 --> |..n server| multi_type1s2

    %%multi_type2
        text_s2c(s2c):::class_text_min
        multi_type2s1(ws server sa):::class_server
        multi_type2s2(ws server sb):::class_server
        multi_type2c(ws client ..n) 
            text_s2c -.- multi_type2s1
            multi_type2s1 -->  |..n server| multi_type2s2 --> multi_type2c

    %%multi_type3
        text_c2s(c2s):::class_text_min
        multi_type3c(ws client ca) 
        multi_type3s1(ws server sa):::class_server
        multi_type3s2(ws server sb):::class_server
            text_c2s -.- multi_type3c
            multi_type3c --> multi_type3s1 -->  |..n server| multi_type3s2

    %%single_type4
        text_a2a(a2a):::class_text_min
        multi_type4c1(ws client ca) 
        multi_type4s1(ws server sa):::class_server 
        multi_type4s2(ws server sb):::class_server
            text_a2a -.- multi_type4c1
            multi_type4c1 -->  |to a| multi_type4s1 --> |..n server| multi_type4s2 -->  |..n server| multi_type4s1--> multi_type4c1
 
     %%multi_type5
        text_a2b(a2b):::class_text_min
        multi_type5c1(ws client ca) 
        multi_type5s1(ws server sa):::class_server
        multi_type5s2(ws server sa):::class_server 
        multi_type5c3(ws client cb) 
            text_a2b -.- multi_type5c1
            multi_type5c1 -->  |to b| multi_type5s1
                        multi_type5s1 -->  |..n server| multi_type5s2
                        multi_type5s2 --> multi_type5c3

    %%single_type6
        text_a2g(a2g):::class_text_min
        multi_type6c1(ws client ca) 
        multi_type6s1(ws server sa):::class_server 
        multi_type6s2(ws server sa):::class_server 
        multi_type6c2(ws client cb) 
        multi_type6c3(ws client cc) 
        multi_type6c4(ws client cd) 
            text_a2g -.- multi_type6c1
            multi_type6c1 -->  |to b,c,d| multi_type6s1
           
            multi_type6s1 --> multi_type6c2
            multi_type6s1 --> multi_type6s2
                        multi_type6s2 --> multi_type6c3
                        multi_type6s2 --> multi_type6c4


classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
classDef class_text_min fill:#fff,color:#000,stroke:#fff,margin:0

```
### 用語の暫定定義

<li><strong>Client:</strong> wssネットワーク上のclient
<li><strong>wss Server:</strong> WebSocketネットワークServer。以下の Node Client を兼ねる。
<li><strong>Node Client:</strong> 参加しているNode List を持つClient。Clientに教える。
<li><strong>ID:</strong> Node Client の Node List で公開されている各ClientのアカウントIDで公開鍵。


### 機能要件
<p><small>前提： 各通信全てがwssで暗号化されている</small></p>
<br/>
<p><small>動作イメージ： 例えば Client を立ち上げると、以下の「参加処理 ID登録」で自動サインインし、wss Server の Node List にアカウントが登録される。
その後は、「データの取得と提供」により、アカウントを指定して Node Client と接続し、1on1 or 1onN でデータを送受信できる。
「データの暗号化、改竄防止機能」は以下のイメージ。「データの取得と提供」接続時に使った"sigC"をencryptに利用する。
あるいは、a2g,a2nでの放送も可能。
</small></p>
<br/>

<li>参加処理 ID登録
<p><small>Clientは自分の所属しているネットワークの wss Serverと相互のPubkey/署名を交換し、OKなら wss Server はDBへ登録・公開する。公開されるアカウントIDは各Clientの公開鍵です。</small></p>

```mermaid
sequenceDiagram
  autonumber
        Note left of Client:  Client make the "sigA" <br/>by Client's Private Key<br/>And send "sigA" to Server
    Client->>+wss Server: send Client's PubKey and sigA
        Note right of wss Server: Server make the "sigB" <br/>by Server's Private Key and "sigA"<br/>And send "sigB" to Client
    wss Server->>+Client:send Server's PubKey and send sigB
        Note left of Client: Verify by Server's Public Key <br/>and "sigA"<br/>if true then Make the "sigC" <br/>by the Client's Private Key <br/>and the "sigB"<br/>if false then end
    Client->>+wss Server: send sigC
        Note right of wss Server:  Verify by Client's Public Key<br/>and "sigC"<br/>if true then OK<br/>save to DB<br/>and publish to public<br/>if false then end
 
```

<li>脱退処理
<ol>
    <li>サーバーサイドでのPing/Pongの監視
    <li>Clientからの明確なclose送信
</ol>
<li>冗長化
<li>データの取得と提供（転送）
<p><small>Clientはwss Serverから欲しいデータを持っているNode Clientリストを受け取る。Node Clientへデータを要求し、相互のPubkey/署名を交換して、認証OKならNode ClientはClientへデータを送る。</small></p>

```mermaid
sequenceDiagram
  autonumber
    Client->>+wss Server: get list from wss Server
        Note left of Client:  Client make the "sigA" <br/>by Client's Private Key<br/>And send "sigA" to Node Client
    wss Server->>+Client: send list from wss Server
    Client->>+Node Client: send Client's PubKey and sigA
        Note right of Node Client: Node Client make the "sigB" <br/>by Node Client's Private Key and "sigA"<br/>And send "sigB" to Client
    Node Client->>+Client:send Node Client's PubKey and send sigB
        Note left of Client: Verify by Node Client's Public Key <br/>and "sigA"<br/>if true then Make the "sigC" <br/>by the Client's Private Key <br/>and the "sigB"<br/>if false then end
    Client->>+Node Client: send sigC to Node Client
        Note right of Node Client:  Verify by Client's Public Key<br/>and "sigB"<br/>if true then OK<br/>sent   data to Client
    Node Client->>+Client:send Data/Msg
    Client->>+Node Client:send Data/Msg
```
<li>データの暗号化、改竄防止機能
<p><small>Node Clientは、Clientへデータ送信前に "sigC"をsoltとした暗号化を施して送り、Clientは "sigC"で解凍する。</small><p>
<p><small>改竄防止はハッシュで実装できるけど今はいらないかな？</small><p>

```mermaid
sequenceDiagram
  autonumber
    Client->>+Node Client: request to  Node Client with  Client's Private and sig
        Note right of Node Client:  get data from Client<br/> --omission-- <br/>Verify by Client's Public Key<br/>and "sigC"<br/>if true then OK
        Note right of Node Client:  Make encrypt data<br/>by sigC solt<br/>and sent data to Client
    Node Client->>+Client:send encrypt Data/Msg
        Note left of Client:  Client decrypt by sigC
        Note left of Client:  and make  encrypt by sigC
    Client->>+Node Client:send encrypt Data/Msg
        Note right of Node Client:  Node Client decrypt by sigC
        Note right of Node Client:  and make  encrypt by sigC
    Node Client->>+Client:send encrypt Data/Msg
        Note left of Client:  Client decrypt by sigC
    
```
<li>データの公開機能
<ol>
    <li>単純なアドレスリストはNode Clientが持つ。
    <li>「私はこういうデータを持っています」という宣言はフォーマットを決めて考慮
</ol>
<li>NAT越え機能
<ul>
    <li>リバースプロクシで443ではだめなの？
</ul>
<li>データのリモート削除機能 (Autonomous なら無しか代替機能)

### 宛先IDアドレスを作り登録するとか

プランA アルゴリズム
<ol>
<li>IDはclientのWebSocket生成時にsubprotocol用にkeypairを作り
<li>keypairはCONF_PATHへ保存する
<li>公開鍵とsigAをwssサーバーへ送信する
<li>サーバー側では onconnect時に
<li>subprotocolの基礎要件を判定(chkProtocol)して
<li>falseなら接続終了
<li>trueなら更にIDの存在をメモリかDBで確認し(if(hasId(protocol.id))return)
<li>falseならメモリかDBへ登録ネゴへ
<li>trueなら何もしない
<li>登録ネゴ:1 wssサーバーは、sigAとpriKeyでsigBを作る
<li>登録ネゴ:2 wssサーバーは、sigBと自身のPubKeyをclientへreplyBackする
<li>登録ネゴ:3 clientは受け取った sigBをVerify しNGなら終了
<li>登録ネゴ:4 OKならsigBとpriKeyでsigCを作る
<li>登録ネゴ:5 sigCをwssサーバーへ送る
<li>登録ネゴ:6 wssサーバーは受け取った sigCをVerify しNGなら終了
<li>登録ネゴ:7 OKなら登録する
<li>clientはリストを受け取る(ただの宛先リストと知ってるよリストなどがありうる)
<li>送信時にはリストから宛先を判定し
<li>(要：知ってるリストの問い合わせ方法)
<li>知ってるリストがあればそこへ送信する
<li>知ってるリストが無ければどうするのが良いか
<li>接続している wss Server 同士は socket.w2w_client を時々同期する
<li>全リストを持つのは無駄なのでアドレスを番地分けしておきたい。
<li>※サーバーが接続してきたときに登録する仕組みを考える
</ol>

```mermaid
flowchart LR


    %%mk_id_1
        single_type2c(mk subprotocol=<br/>Ed25519's Pubkey...) 
        db1[(memory<br/> or storage)]
        %%single_type2s(memory or storage):::class_server
            single_type2c --> db1:::class_server
            db1 --> A{"send時に<br/>送信先を判定"}:::class_server

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
```

### 例えば ca->sa->cb 違うクライアントへ送る場合
実現するいくつかの方法がある。
オプションで選択で聞くようにするか？どういうオプションが使いやすいか？

<br> ✔は2022-08-18 テスト実装
<br>
<ol>
<li>clientへの配信方法
<ol>
    <li>wss Serverでブロードキャストする方法
    <li>cbを特定して送る方法。 ✔
</ol>
<li>clientを特定する仕組み
<ol>
    <li>ipを記憶
    <li>idを作る ✔
</ol>
<li>idを作るタイミング1
<ol>
    <li>クライアント側　 ✔
    <li>サーバー側
</ol>
<li>idを作るタイミング2
<ol>
    <li>サブプロトコル ✔
    <li>サーバー側 onmessage
</ol>
<li>idを作る方法
<ol>
    <li>暫定text 
    <li>uuidv4
    <li>uuidv4+SHA224
    <li>sha3とか
    <li>Ed25519 楕円曲線 ✔
</ol>
</ol>

### memo:


```
2022-08-21
暫定send フォーマット {to,from,type,msg}
2022-08-20
仮にAES使うならこんな感じ
CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(msgs), sigC).toString()
CryptoJS.AES.decrypt(msgs, sigC).toString(CryptoJS.enc.Utf8);

2022-08-18
無限ループの止め方

2022-07-27
https://twitter.com/toshirot/status/1552300957433995265

![image](https://user-images.githubusercontent.com/154680/180593387-5702aee6-a8b1-4ce2-9f6a-d319a484a1cb.png)

https://www.npmjs.com/

.gitignore　を作っておいた
```

### 参考

<li>WebSocket Server https://github.com/websockets/ws
<li>WebSockets - Web 関連仕様 日本語訳 https://triple-underscore.github.io/WebSocket-ja.html
<li>RFC6455 The WebSocket Protocol 日本語訳 https://triple-underscore.github.io/RFC6455-ja.html
<li>RFC6455 The WebSocket Protocol https://www.rfc-editor.org/rfc/rfc6455
<li>WebSocket のセキュリティ 日本語 — Switch to English https://devcenter.heroku.com/ja/articles/websocket-security
<li>Hybrid P2P型とPure P2P型 https://internet.watch.impress.co.jp/www/column/wp2p/wp2p01.htm
    
```
    >Hybrid P2P型:誰がどんな情報を持っているかを把握したサーバーがあり、最初はそこに接続しに行って、Peerを発見する
    >Pure P2P型: 言ゲームの要領で、ネットワーク中のPeerを芋づる式に検索する
```
<li>wiki P2P https://ja.wikipedia.org/wiki/Peer_to_Peer

<li>先人達 2011.11.20 [P2P]Websocketでブラウザ間P2P通信は実現できるか？(その2) http://toremoro.tea-nifty.com/tomos_hotline/2011/11/p2pwebsocketp2p.html
<li>先人達 2011-11-05 WebSocketを使ってWebブラウザ間P2P通信をしてみた https://yogit.hatenadiary.org/entry/20111105/1320492134
<li>SSDP (Simple Service Discovery Protocol) https://datatracker.ietf.org/doc/html/draft-cai-ssdp-v1-03
<li> P2P通信でNatを越える https://qiita.com/nekobato/items/86e83d40b9d1a4d9b446 #Qiita 
<li> node-ssdp https://www.npmjs.com/package/node-ssdp
<li>memo Set Phasers to STUN/TURN: Getting Started with WebRTC using Node.js, Socket.io and Twilio’s NAT Traversal Service https://www.twilio.com/blog/2014/12/set-phasers-to-stunturn-getting-started-with-webrtc-using-node-js-socket-io-and-twilios-nat-traversal-service.html @twilioより 

<li>mermaid https://mermaid-js.github.io/mermaid/#/
<li>暗号検証 https://emn178.github.io/online-tools/
<li>暗号スイートの暗号強度と、公開鍵のビット数の設定 https://http2.try-and-test.net/ecdhe.html
<li>サーバ負荷をRSAとECDSAで比較 https://http2.try-and-test.net/ecdsa.html
<li>Node Doc https://nodejs.org/dist/latest-v16.x/docs/api/

```
2022-08-21

{
  "name": "w2w",
  "version": "1.0.0",
  "description": "Tool for WebSocket to WebSocket. Realizing W2W (WebSocket-to-WebSocket) like P2P",
  "main": "index.js",
  "directories": {
    "doc": "doc",
    "lib": "lib",
    "test": "test"
  },
  "scripts": {
    "test": "mocha"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/toshirot/w2w.git"
  },
  "keywords": [
    "websocket",
    "w2w",
    "p2p",
    "websocket to websocket"
  ],
  "author": "toshirot (https://github.com/toshirot/)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/toshirot/w2w/issues"
  },
  "homepage": "https://github.com/toshirot/w2w#readme",
  "dependencies": {
    "crypto": "^1.0.1",
    "crypto-js": "^4.1.1",
    "ws": "^8.8.1"
  },
  "devDependencies": {
    "mocha": "^10.0.0"
  }
}

```
