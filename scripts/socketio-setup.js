;(function (global) {
	if (!io) {
		return;
	}

	io.connect('http://127.0.0.1', function (socket) {
		global.socket = socket;
		socket.on('message', function () {

		});
	});

})(this);