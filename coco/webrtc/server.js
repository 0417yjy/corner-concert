const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 3001;

// express routing
//app.use(express.static('public'));

// signaling
require('./svr-socket')(io);

// listener
http.listen(port || 3000, function () {
    console.log('listening on', port);
});