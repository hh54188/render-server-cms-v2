var ConfigState = require('../states/config.js')l

module.exports = {
	handle: function () {
		return ConfigState.getStatus();
	}
}