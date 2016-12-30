var ConfigState = require('../states/config.js')
var PubSub = require('pubsub-js');

module.exports = {
	handle: function () {
		var stateResult = ConfigState.getState();
		PubSub.publish('state.update.config', stateResult);
	}
}