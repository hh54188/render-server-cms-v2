var express = require('express');
var app = express();
app.use(express.static('.'));
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var PubSub = require('pubsub-js');

var path = require("path");
var CommandManager = require('./server/command_buses/command-manager.js');

io.on('connection', function connectionHandler(socket) {
	socket.on('command', function (commandInfo) {
		CommandManager.process(commandInfo);
	});

	PubSub.subscribe('state.update.config', function (eventName, state) {
		socket.emit('state.update.config', state);
	})
});

server.listen(80);