var express = require('express');
var app = express();

app.get('/', function (req, res) {
	return res.sendFile(__dirname + '/index.html');
})

app.listen(80);