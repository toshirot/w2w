'use strict';

const websocket = require('ws')
const w2w = require('./lib/w2w')
const sendFromClient = require('./lib/sendFromClient')
const receiveFromServer = require('./lib/receiveFromServer')
const { mkKeyPair, sign, verify } = require('./lib/mkKeyPairEd25519')
const{
    getAndSetKeyPair,
    mkAccount, //pubkey
    removeCnf,
    getW2wCnf,
    getAccountId,
    setBeginEndStr,
    removeBeginEndStr
}  = require('./lib/mkAccount')
const mkClient = require('./lib/mkClient')

module.exports= new function() {
    this.sign=sign
    this.verify=verify
    this.mkKeyPair=mkKeyPair

    this.getAndSetKeyPair=getAndSetKeyPair
    this.mkAccount=mkAccount
    this.removeCnf=removeCnf
    this.getW2wCnf=getW2wCnf
    this.getAccountId=getAccountId
    this.setBeginEndStr=setBeginEndStr
    this.removeBeginEndStr=removeBeginEndStr

    this.mkClient=mkClient

    this.receiveFromServer=receiveFromServer
    this.sendFromClient=sendFromClient
    this.w2w=w2w

    this.createWebSocketStream=websocket.createWebSocketStream;
    this.Server=websocket.Server;
    this.Receiver=websocket.Receiver;
    this.Sender=websocket.Sender;
    this.WebSocket=websocket.WebSocket;
    this.WebSocketServer=websocket.WebSocketServer;
    this.Sender=websocket.Sender;
};
