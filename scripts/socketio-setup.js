;(function () {
	if (!io) {
		return;
	}


	PubSub.subscribe('command', function (eventName, data) {
		socket.emit('command', data);
	});

	socket = io.connect('http://127.0.0.1');

	socket.on('state.update.config', function (newData) {
		PubSub.publish('state.update.config', newData);
	});

})();