const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {path: '/socketio'});

const port = process.env.PORT || 3001;

// signaling
require('./svr-socket')(io)

app.get('/status', (req, res) => {
    res.send(true);
});

// listener
http.listen(port, function () {
    console.log('listening on', port);
});