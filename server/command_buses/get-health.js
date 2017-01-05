var HealthState = require('../states/health.js')
var PubSub = require('pubsub-js');

module.exports = {
	handle: function () {
		var stateResult = HealthState.getState();
		PubSub.publish('PUSH_HEALTH_STATE', stateResult);
	}
}