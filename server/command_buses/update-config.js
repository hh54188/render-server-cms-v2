var ConfigState = require('../states/config.js')

module.exports = {
	handle: function (diffs) {
        ConfigState.updateConfigFile(diffs);
	}
}