var ConfigState = require('../states/config.js')
var PubSub = require('pubsub-js');

module.exports = {
	handle: function () {
		var stateResult = ConfigState.getState();
		PubSub.publish('STATE_UPDATED', {
			name: 'config.all',
			data: stateResult
		});
	}
}