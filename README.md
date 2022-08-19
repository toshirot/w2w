# w2w
Tool for WebSocket to WebSocket. Realizing W2W (WebSocket-to-WebSocket) like P2P

### サイト準備
https://w2w.info/

### 経路type
<li>s2c (sent to client from server)
<li>c2s (sent to server from client)
<li>a2a (reply to myself)
<li>a2b (sent to an other)
<li>a2n (sent to all/broadcast)
<li>s2s (server to server)

( x2s terminate on last server. )

### 構築後のフロー


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

### 機能要件

<li>参加処理 ID登録 
```mermaid
sequenceDiagram
  autonumber
        Note left of Client:  Client make the "sigA" <br/>by Client's Private Key<br/>And send "sigA" to Server
    Client->>+Server: send Client's PubKey and sigA
        Note right of Server: Server make the "sigB" <br/>by Server's Private Key and "sigA"<br/>And send "sigB" to Client
    Server->>+Client:send Server's PubKey and send sigB
        Note left of Client: Verify by Server's Public Key <br/>and "sigA"<br/>if true then Make the "sigC" <br/>by the Alice's Private Key <br/>and the "sigB".
    Client->>+Server: send sigC
        Note right of Server:  Verify by Client's Public Key<br/>and "sigB"<br/>if true then OK<br/>save to DB<br/>and publish to public
 
```
<li>脱退処理
<li>冗長化
<li>データの取得と提供（転送）
<li>データの暗号化、改竄防止機能
<li>データの公開機能
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