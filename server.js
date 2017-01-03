var express = require('express');
var app = express();
app.use(express.static('.'));
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var PubSub = require('pubsub-js');

var path = require("path");
var CommandManager = require('./server/command_buses/command-manager.js');

var globalSocket;

PubSub.subscribe('STATE_UPDATED', function (eventName, eventInfo) {
	globalSocket.emit('STATE_UPDATED', eventInfo);
});

io.on('connection', function connectionHandler(socket) {
	globalSocket = socket;
	socket.on('COMMAND', function (commandInfo) {
		CommandManager.process(commandInfo);
	});
});

server.listen(80);