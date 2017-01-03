var express = require('express');
var app = express();
app.use(express.static('.'));
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var PubSub = require('pubsub-js');

var path = require("path");
var CommandManager = require('./server/command_buses/command-manager.js');

var globalSocket;

PubSub.subscribe('PUSH_CONFIG_STATE_UPDATED', function (eventName, diffs) {
	globalSocket.emit('PUSH_CONFIG_STATE_UPDATED', diffs);
});

PubSub.subscribe('PUSH_CONFIG_STATE', function (eventName, newState) {
	globalSocket.emit('PUSH_CONFIG_STATE', newState);
});

io.on('connection', function connectionHandler(socket) {
	globalSocket = socket;
	socket.on('COMMAND', function (commandInfo) {
		CommandManager.process(commandInfo);
	});
});

server.listen(80);