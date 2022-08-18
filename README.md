# w2w
Tool for WebSocket to WebSocket. Realizing W2W (WebSocket-to-WebSocket) like P2P

### サイト準備
https://w2w.info/

### 構築後のフロー

```mermaid
flowchart LR


text1(単一ネットワーク single network):::class_text

    %%single_type1
        single_type1c(ws client a) 
        single_type1s(ws server a):::class_server
           single_type1s --> single_type1c 

    %%single_type2
        single_type2c(ws client a) 
        single_type2s(ws server a):::class_server
            single_type2c --> single_type2s

    %%single_type3
        single_type3c(ws client a) 
        single_type3s(ws server a):::class_server
            single_type3c --> single_type3s --> single_type3c

    %%single_type4
        single_type4c1(ws client a) 
        single_type4s1(ws server a):::class_server 
        single_type4c2(ws client b) 
            single_type4c1 --> single_type4s1 --> single_type4c2

    %%single_type6
        single_type5c1(ws client a) 
        single_type5s1(ws server a):::class_server 
        single_type5c2(ws client b) 
        single_type5c3(ws client c) 
        single_type5c4(ws client ..n) 
            single_type5c1 --> single_type5s1 --> single_type5c2
                        single_type5s1 --> single_type5c3
                        single_type5s1 --> single_type5c4

classDef class_server fill:#eee,color:#000,stroke:#333
classDef class_text fill:#fff,color:#000,stroke:#fff
```
```mermaid
flowchart LR

text2(複数ネットワーク multiple networks):::class_text

    %%multi_type1
        multi_type1s1(ws server a):::class_server
        multi_type1s2(ws server b):::class_server
            multi_type1s1 --> multi_type1s2

    %%multi_type2
        multi_type2s1(ws server a):::class_server
        multi_type2s2(ws server b):::class_server
        multi_type2c(ws client ..n) 
            multi_type2s1 --> multi_type2s2 --> multi_type2c

    %%multi_type3
        multi_type3c(ws client a) 
        multi_type3s1(ws server a):::class_server
        multi_type3s2(ws server b):::class_server
            multi_type3c --> multi_type3s1 --> multi_type3s2

    %%single_type4
        multi_type4c1(ws client a) 
        multi_type4s1(ws server a):::class_server 
        multi_type4s2(ws server b):::class_server
　
            multi_type4c1 --> multi_type4s1 --> multi_type4s2 --> multi_type4s1--> multi_type4c1
 
     %%multi_type5
        multi_type5c1(ws client a) 
        multi_type5s1(ws server a):::class_server
        multi_type5s2(ws server a):::class_server 
        multi_type5c2(ws client b) 
        multi_type5c3(ws client c) 
            multi_type5c1 --> multi_type5s1 --> multi_type5c2
                        multi_type5s1 --> multi_type5s2
                        multi_type5s2 --> multi_type5c3

     %%multi_type6
        multi_type6c1(ws client a) 
        multi_type6s1(ws server a):::class_server
        multi_type6s2(ws server a):::class_server 
        multi_type6c2(ws client b) 
        multi_type6c3(ws client ..n) 
            multi_type6c1 --> multi_type6s1 --> multi_type6c2
                        multi_type6s1 --> multi_type6c3
                        multi_type6s1 --> multi_type6s2

     %%multi_type7
        multi_type7c1(ws client a) 
        multi_type7s1(ws server a):::class_server
        multi_type7s2(ws server a):::class_server 

        multi_type7c2(ws client b) 
        multi_type7c3(ws client ..n) 

        multi_type7c5(ws client ..n) 

            multi_type7c1 --> multi_type7s1 --> multi_type7c2
                        multi_type7s1 --> multi_type7c3
                        multi_type7s1 --> multi_type7s2
                        multi_type7s2 --> multi_type7c5
                     

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
    ✔ sa->ca: wss://reien.top:3333 から"Response from 3333"を受信できた (181ms)
    ✔ sb->cb: wss://reien.top:3334 から"Response from 3334"を受信できた (102ms)
    ✔ ca->sa->ca: wss://reien.top:3333 へsendして結果を受け取った。"A to 3333 to A"を受信できた


  3 passing (285ms)
```

### ca->sa->cb 違うクライアントへ送る場合
実現するいくつかの方法がある。
オプションで選択で聞くようにするか？どういうオプションが使いやすいか？
<ol>
<li>clientへの配信方法
<ol>
    <li>wss Serverでブロードキャストする方法
    <li>cbを特定して送る方法。
</ol>
<li>clientを特定する仕組み
<ol>
    <li>ipを記憶
    <li>idを作る
</ol>
<li>idを作るタイミング1
<ol>
    <li>クライアント側　
    <li>サーバー側
</ol>
<li>idを作るタイミング2
<ol>
    <li>サブプロトコル
    <li>サーバー側 onmessage
</ol>
<li>idを作る方法
<ol>
    <li>uuidv4
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
    
<li>Hybrid P2P型とPure P2P型 https://internet.watch.impress.co.jp/www/column/wp2p/wp2p01.htm
    
```
    >Hybrid P2P型:誰がどんな情報を持っているかを把握したサーバーがあり、最初はそこに接続しに行って、Peerを発見する
    >Pure P2P型: 言ゲームの要領で、ネットワーク中のPeerを芋づる式に検索する
```
