# w2w
Tool for WebSocket to WebSocket. Realizing W2W (WebSocket-to-WebSocket) like P2P. But is not P2P.

### サイト準備
https://w2w.info/

### 動機

10年以上前に、WebSocketのネットワークを繋いでいったら面白いのじゃないかと思って話したら、何故かいきなり「そんなのP2Pじゃないっ」と言われて凹んで、2022年となり、年取ったしまぁ人はどうでもいいから自分が面白そうと思うなら、自分のできる範囲でやってみようと思った。勇気づけてくれる方もいたので、感謝しつつ。

だから、ここでやろうとしてるのはほんの少しP2Pに似てるかもしれないけど、P2Pではないです。WebSocket 2 WebSockeのW2W。

### 経路type
<li>s2c (sent to client from server)
<li>c2s (sent to server from client)
<li>a2a (reply to myself)
<li>a2b (sent to an other)
<li>a2g (sent to gloup)
<li>a2n (sent to all/broadcast)
<li>s2s (server to server)

( x2s terminate on last server. )

### 構築後のフロー

メモ：1onN でアカウントを指定したグループ a2g が網羅されていないのであとで追加する
```mermaid
flowchart LR


text1(単一ネットワーク single network):::class_text

    %%single_type1
        text_s2c(s2c/sent to client from server):::class_text_min
        single_type1c(ws client ca) 
        single_type1s(ws server sa):::class_server
            text_s2c -.- single_type1s
            single_type1s --> single_type1c 

    %%single_type2
        text_c2s(c2s/sent to server from client):::class_text_min
        single_type2c(ws client ca) 
        single_type2s(ws server sa):::class_server
            text_c2s -.- single_type2c
            single_type2c --> single_type2s

    %%single_type3
        text_a2a(a2a):::class_text_min
        single_type3c(ws client ca) 
        single_type3s(ws server sa):::class_server
            text_a2a -.- single_type3c
            single_type3c --> single_type3s --> single_type3c

    %%single_type4
        text_a2b(a2b):::class_text_min
        single_type4c1(ws client ca) 
        single_type4s1(ws server sa):::class_server 
        single_type4c2(ws client cb)
            text_a2b -.- single_type4c1
            single_type4c1 --> single_type4s1 --> single_type4c2

    %%single_type6
        text_a2n(a2n):::class_text_min
        single_type5c1(ws client ca) 
        single_type5s1(ws server sa):::class_server 
        single_type5c2(ws client cb) 
        single_type5c3(ws client cc) 
        single_type5c4(ws client ..n) 
            text_a2n -.- single_type5c1
            single_type5c1 --> single_type5s1 --> single_type5c2
                        single_type5s1 --> single_type5c3
                        single_type5s1 --> single_type5c4

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff,margin:0
classDef class_text_min fill:#fff,color:#000,stroke:#fff,margin:0
```
```mermaid
flowchart LR

text2(複数ネットワーク multiple networks):::class_text

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
            multi_type4c1 --> multi_type4s1 --> |..n server| multi_type4s2 -->  |..n server| multi_type4s1--> multi_type4c1
 
     %%multi_type5
        text_a2b(a2b):::class_text_min
        multi_type5c1(ws client ca) 
        multi_type5s1(ws server sa):::class_server
        multi_type5s2(ws server sa):::class_server 
        multi_type5c3(ws client cc) 
            text_a2b -.- multi_type5c1
            multi_type5c1 --> multi_type5s1
                        multi_type5s1 -->  |..n server| multi_type5s2
                        multi_type5s2 --> multi_type5c3


     %%multi_type6
        text_a2n(a2n):::class_text_min
        multi_type6c1(ws client ca) 
        multi_type6s1(ws server sa):::class_server
        multi_type6s2(ws server sa):::class_server 

        multi_type6c2(ws client ..n) 

        multi_type6c5(ws client ..n) 
            text_a2n-.- multi_type6c1
            multi_type6c1 --> multi_type6s1 --> multi_type6c2
                        multi_type6s1 -->  |..n server| multi_type6s2
                        multi_type6s2 --> multi_type6c5
                     

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
classDef class_text_min fill:#fff,color:#000,stroke:#fff,margin:0

```
### 用語の暫定定義

<li>Client: wssネットワーク上のclient
<li>wss Server: WebSocketネットワークServer。以下の Node Client を兼ねる。
<li>Node Client: 参加しているNode List を持つClient。Clientに教える。
<li>ID: Node Client の Node List で公開されている各ClientのアカウントIDで公開鍵。


### 機能要件
<p><small>前提： 各通信全てがwssで暗号化されている</small></p>
<br/>
<p><small>動作イメージ： 例えば Client を立ち上げると、「参加処理 ID登録」で自動サインインし、wss Server の Node List にアカウントが登録される。
その後は、「データの取得と提供」により、アカウント指定して Node Client と接続し、1on1 or 1onN でデータを送受信できる。
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

### 宛先IDアドレスの作り方(ブロードキャストでは使わない)

プランA アルゴリズム
<ol>
<li>IDはclientのWebSocket生成時にsubprotocolとしてハッシュ(sha3やeddsaなど)を作り
<li>wssサーバーへ送信する
<li>サーバー側では onconnect時にsubprotocolの基礎要件を判定して
<li>falseなら接続終了
<li>trueなら更にIDの存在を（とりまメモリかDBで）確認し
<li>falseならメモリかDBへ登録する
<li>trueなら何もしない
<li>送信時に宛先を判定し
<li>(要：知ってるリストの問い合わせ方法)
<li>知ってるリストがあればそこへ送信する
<li>知ってるリストが無ければどうするのが良いか
</ol>

```mermaid
flowchart LR


    %%mk_id_1
        single_type2c(mk subprotocol=SHA or etc..) 
        db1[(save to memory or storage)]
        %%single_type2s(save to memory or storage):::class_server
            single_type2c --> db1:::class_server
            db1 --> A{"send時に送信先を判定"}:::class_server

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
```

### test

```

凡例 通信方向
------------------------------------------------------------------------------
sa->ca サーバーaからクライアントaへ送信する
sb->cb サーバーbからクライアントbへ送信する
ca->sa  クライアントaからサーバーaへ送信する
ca->sa->ca  クライアントaからサーバーaへ送信し、サーバーaからクライアントaへ返信する
ca->sa->cb  クライアントaからサーバーaへ送信し、サーバーaからクライアントbへ送信する
------------------------------------------------------------------------------

w2w.info\html>npm run test

> w2w@1.0.0 test
> mocha


  WebSocketサーバーからの受信
    ✔ sa->ca: wss://reien.top:3333 から"Response from 3333"を受信できた (333ms)
    ✔ sb->cb: wss://reien.top:3334 から"Response from 3334"を受信できた (289ms)
    ✔ ca->sa->ca: wss://reien.top:3333 へsendして結果を受け取った。"ca to 3333 to ca"を受信できた
    ✔ ca->sa->cb: ca から wss://reien.top:3333 へsendして cb が結果を受け取った。"ca to 3333 to cb"を受信できた


  3 passing (285ms)
```

### ca->sa->cb 違うクライアントへ送る場合
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
    <li>暫定text ✔
    <li>uuidv4
    <li>uuidv4+SHA224
    <li>sha3やeddsaとか楕円曲
</ol>
</ol>

### memo:


```
2022-07-20
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