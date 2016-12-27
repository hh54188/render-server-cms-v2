var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var path = require("path");
var CommandManager = require('./server/command_buses/command-manager.js');
// "."表示node程序运行的目录
// "__dirname" 表示文件所在的目录
app.use(express.static('.'));
// app.use(express.static(path.join('.', 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', connectionHandler);

function connectionHandler(socket) {
	console.log('Connection');
	socket.on('command', function (commandInfo) {
		CommandManager.process(commandInfo);
	});
}

var manipulateGlobal = require('./server/file_manipulations/manipulate-global.js');
// manipulateGlobal.


server.listen(80);