var checkPortService = require('./check-port-in-use.js');

var PORT_REGEX = /^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/;
var port = '';
var isRunning = false;
var checkInterval = 1000 * 2;

setInterval(function () {
	
	if (port){
		checkPortService.portInUse(port, function (returnValue) {
			isRunning = returnValue;
		})
	}

}, checkInterval);

module.exports = {
	setRenderPort: function (number) {
		if (PORT_REGEX.test(number)) {
			port = number;
		}
	},
	getRenderState: function () {
		return isRunning;
	}
}