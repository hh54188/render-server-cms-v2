var fs = require('fs');
var path = require('path');
var protobuf = require('protobufjs');
var protoPath = path.join(__dirname, 'proros', 'rs.proto');
var builder = protobuf.load(protoPath, function (err, root) {
	console.log(err, root);
});
