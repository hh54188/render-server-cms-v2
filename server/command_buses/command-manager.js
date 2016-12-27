var SaveConfigCommandBus = require('./save-config.js');

function saveConfigCommandBus(diff) {
	console.log(diff);
}

function route(commandInfo) {
	var commandName = commandInfo.name;
	var payload = commandInfo.payload;
	
	switch(commandName) {
		case 'save_config': 
			SaveConfigCommandBus.handle.apply(this, payload);
			break;
	}
}

module.exports = {
	process: function (commandInfo) {
		route(commandInfo);
	}
}