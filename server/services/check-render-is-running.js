var checkPortService = require('./check-port-in-use.js');

var PORT_REGEX = /^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/;
var port = '';
var isRunning = false;
var checkInterval = 1000 * 2;
var PubSub = require('pubsub-js');

setInterval(function () {
	
	if (port){
		checkPortService.portInUse(port, function (returnValue) {
			if (returnValue !== isRunning) {
				isRunning = returnValue;
				// 这样的处理不太好，
				// 服务应该只关心自身的业务
				// 1. 对外界产生了依赖，违反了单一职责原则
				// 2. 一旦config的数据结构发生修改，这里也需要修改
				PubSub.publish('STATE_UPDAED', {
					name: 'config.isRunning',
					data: isRunning
				});
			}
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