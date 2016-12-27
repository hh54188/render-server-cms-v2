var express = require('express');
var app = express();
app.use(express.static('.'));
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var path = require("path");
var CommandManager = require('./server/command_buses/command-manager.js');

io.on('connection', function connectionHandler(socket) {
	socket.on('command', function (commandInfo) {
		CommandManager.process(commandInfo);
	});
});

server.listen(80);