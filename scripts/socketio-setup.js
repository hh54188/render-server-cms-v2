;(function () {
	if (!io) {
		return;
	}

	var socket = null;

	PubSub.subscribe('command', function (eventName, data) {
		socket.emit('command', data);
	});

	socket = io.connect('http://127.0.0.1');
})();