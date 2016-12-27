var net = require('net');
var server = net.createServer();

server.once('error', function(err) {
  	if (err.code === 'EADDRINUSE') {
    	// port is currently in use
  	}
});

server.once('listening', function() {
  	// close the server if listening doesn't fail
 	server.close();
});

server.listen(8124);


//------ConfigState------

// var ConfigState = require('./server/states/config.js');

// var diffs = [{
// 	oldValue: '8124',
// 	newValue: '6666'
// }];

// ConfigState.updateConfigFile(diffs);