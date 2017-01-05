var UpdateConfigCommandBus = require('./update-config.js');
var GetConfigCommandBus = require('./get-config.js');
var GetHealthCommandBus = require('./get-health.js');

function router(commandInfo) {
	var commandName = commandInfo.name;
	var payload = commandInfo.payload;
	switch(commandName) {
		case 'update_config': 
			UpdateConfigCommandBus.handle.apply(this, payload);
			break;
		case 'get_config':
			GetConfigCommandBus.handle.apply(this, payload);
			break;
		case 'get_health':
			GetHealthCommandBus.handle.apply(this, payload);
			break;
	}
}

module.exports = {
	process: function (commandInfo) {
		router(commandInfo);
	}
}