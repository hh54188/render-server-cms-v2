var PubSub = require('pubsub-js');
PubSub.subscribe('a', function (eventName) {
	console.log(eventName);
})

PubSub.subscribe('a.b', function (eventName) {
	console.log(eventName);
});

PubSub.subscribe('a.b.c', function (eventName) {
	console.log(eventName);
});

PubSub.publish('a.b.c');