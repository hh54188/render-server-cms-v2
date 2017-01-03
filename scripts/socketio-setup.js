;(function () {
	if (!io) {
		return;
	}

	PubSub.subscribe('COMMAND', function (eventName, data) {
		socket.emit('COMMAND', data);
	});

	socket = io.connect('http://127.0.0.1');

	socket.on('PUSH_CONFIG_STATE_UPDATED', function (diffs) {
		// debugger
		PubSub.publish('config.update', diffs);
	});

	socket.on('PUSH_CONFIG_STATE', function (newState) {
		PubSub.publish('config.new', newState);
	});

})();