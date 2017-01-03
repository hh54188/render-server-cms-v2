;(function () {
	if (!io) {
		return;
	}


	PubSub.subscribe('COMMAND', function (eventName, data) {
		socket.emit('COMMAND', data);
	});

	socket = io.connect('http://127.0.0.1');

	socket.on('STATE_UPDATED', function (eventInfo) {
		PubSub.publish(eventInfo.name, eventInfo.data);
	});

})();