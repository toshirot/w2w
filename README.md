# w2w
Tool for WebSocket to WebSocket


# サイト準備
https://w2w.info/

# 凡例 通信方向
```
sa->ca サーバーaからクライアントaへ送信する
sb->cb サーバーbからクライアントbへ送信する
ca->sa  クライアントaからサーバーaへ送信する
ca->sa->ca  クライアントaからサーバーaへ送信し、サーバーaからクライアントaへ返信する
ca->sa->cb  クライアントaからサーバーaへ送信し、サーバーaからクライアントbへ送信する

```

# test

```
w2w.info\html>npm run test

> w2w@1.0.0 test
> mocha


  WebSocketサーバーからの受信
    ✔ sa->ca: wss://reien.top:3333 から"Response from 3333"を受信できた (181ms)
    ✔ sb->cb: wss://reien.top:3334 から"Response from 3334"を受信できた (102ms)
    ✔ ca->sa->ca: wss://reien.top:3333 へsendして結果を受け取った。"A to 3333 to A"を受信できた


  3 passing (285ms)
```



memo:

```
午後5:03 · 2022年8月16日

ca->sa->cb するにはとりま思いつく方法がふたつある。

1.wss Serverでブロードキャストする方法と、2.cbを特定して送る方法。

2は例えば、ipを記憶したりidを作る方法がある。

ipは取れないことがあるので、私は普段はidを作ることが多い。

idを作るタイミングは、クライアント側、サーバー側が

あるけど、個人的にはサーバー側で作るのが馴染みやすい。

普段はuuidv4で作ることが多いけど、もしユーザーが増える事を予め想定すると、sha3やeddsaとか楕円曲線で作るのが良いかな。

他に、サブプロトコル時にやるというのもある。tslの暗号化はここでかかってたっけ？まあサーバー側なら無問題


```

2022-07-27
https://twitter.com/toshirot/status/1552300957433995265

![image](https://user-images.githubusercontent.com/154680/180593387-5702aee6-a8b1-4ce2-9f6a-d319a484a1cb.png)

https://www.npmjs.com/

.gitignore　を作っておいた

