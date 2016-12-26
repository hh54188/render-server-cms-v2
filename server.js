var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var path = require("path");

// "."表示node程序运行的目录
// "__dirname" 表示文件所在的目录
app.use(express.static('.'));
// app.use(express.static(path.join('.', 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socketRequestHandler);

function socketRequestHandler(socket) {
	console.log('Connection');
}


server.listen(80);