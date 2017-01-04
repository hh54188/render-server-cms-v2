var fs = require('fs');
var path = require('path');
var PubSub = require('pubsub-js');
var LoopService = require('../global-services/loop.js');

var _config = config = {};
var configFilePath = path.join('.', 'config.js');

function checkPathIsAvailable(path) {
	var checkExist = fs.lstatSync || fs.statSync || fs.existsSync;
	try {
        checkExist(path);
    } catch (e) {
    	return false;
    }
    return true;
}

function getLatestConfig() {
	if (checkPathIsAvailable(configFilePath)) {
		try {
			return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
		} catch (e) {
			console.log('config.js syntax error------>', e);
			return {};
		}
	}

	return {};
}

_config = getLatestConfig();


LoopService.add(function () {
	config = getLatestConfig();

	if (JSON.stringify(_config) !== JSON.stringify(config)) {
		_config = config;
		PubSub.publish('CONFIG_STATE_UPDATED');
	}	
}.bind(this));

// setInterval(function () {
// 	config = getLatestConfig();

// 	if (JSON.stringify(_config) !== JSON.stringify(config)) {
// 		_config = config;
// 		PubSub.publish('CONFIG_STATE_UPDATED');
// 	}
// }, 1000 * 1);


module.exports = {
	getConfig: function () {
		return _config;
	}
}
