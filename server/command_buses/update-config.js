var ConfigState = require('../states/config.js')l

module.exports = {
	handle: function (diffs) {
        ConfigState.updateConfigFile(diffs);
	}
}