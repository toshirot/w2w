'use strict';

const websocket = require('ws');
websocket.w2w = require('./lib/w2w');

module.exports= new function() {
    this.w2w=websocket.w2w
    this.createWebSocketStream=websocket.createWebSocketStream;
    this.Server=websocket.Server;
    this.Receiver=websocket.Receiver;
    this.Sender=websocket.Sender;
    this.WebSocket=websocket.WebSocket;
    this.WebSocketServer=websocket.WebSocketServer;
    this.Sender=websocket.Sender;
};
