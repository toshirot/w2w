'use strict';

const websocket = require('ws');
const w2w = require('./lib/w2w');
const sendFromClient = require('./lib/sendFromClient');
const receiveFromServer = require('./lib/receiveFromServer');

module.exports= new function() {
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
