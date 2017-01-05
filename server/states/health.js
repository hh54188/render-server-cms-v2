var healthService = require('../services/health-check.js');
var PubSub = require('pubsub-js');

var healthState = healthService.getHealth();

PubSub.subscribe('HEALTH_STATE_UPDATED', function () {
	healthState = healthService.getHealth();
});

module.exports = {
	getState: function () {
		return healthState;
	}
}