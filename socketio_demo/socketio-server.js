var express = require('express');
var path = require("path");
var app = express();
app.use(express.static(__dirname));
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

io.on('connection', function connectionHandler(socket) {
	socket.on('config.updated', function (data) {
		console.log(data);
	});
});

server.listen(80);