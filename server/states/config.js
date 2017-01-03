var path = require('path');
var fs = require('fs');
var PubSub = require('pubsub-js');
var rsPath = require('./rs-path-classic.js');
var diffService = require('../services/diff-object.js');
var checkRenderIsRunning = require('../services/check-render-is-running.js');
var monitorConfig = require('../services/monitor-config.js');
require('node-oojs'); // 需要本地安装node-oojs
console.log(oojs);
function getState() {
	rsPath.updateRenderServerBasic(monitorConfig.getConfig());
	console.log(rsPath.getSrcPath());
	oojs.setPath(rsPath.getSrcPath());
	console.log(oojs.getPath());
	var configObj = oojs.using('rs.common.config.global');
	var configObj = oojs.reload('rs.common.config.global');
	console.log('database--->', configObj.db.database);
	var renderServerAbsolutePath = rsPath.getRootPath();
	// 相对于node执行目录"."，而非相对于当前文件目录__dirname
	var renderServerRelativePath = path.relative(path.join('.'), rsPath.getRootPath());
	checkRenderIsRunning.setRenderPort(configObj.server.port);
	return {
	    rs: {
	        isRunning: checkRenderIsRunning.getRenderState(),
	        directoryName: rsPath.getRenderServerDirName(),
	        absoluteDirectoryPath: renderServerAbsolutePath,
	        relativeDirectoryPath: renderServerRelativePath,
	        isProduction: rsPath.checkIsProduction(),
	        port: configObj.server.port
	    },
	    db: {
	        name: configObj.db.database,
	        port: configObj.db.port,
	        host: configObj.db.host,
	        account: configObj.db.readUsername,
	        password: configObj.db.readPassword
	    }
	}
}

function updateConfigFile(diffArr) {
	var configFilePath = rsPath.getConfigFilePath();
	var content = fs.readFileSync(configFilePath, 'utf-8');

	diffArr.forEach(function (diffPair) {
		var oldValue = diffPair.oldValue;
		var newValue = diffPair.newValue;

		content = content.replace(oldValue, newValue);
	});

	fs.writeFileSync(configFilePath, content);
}

var _state = getState();

PubSub.subscribe('CONFIG_STATE_UPDATED', function () {
	console.log('------CONFIG_STATE_UPDATED------');
	var diffs = diffService.diff(_state, _state = getState());
	console.log(diffs);
	console.log(_state);
	PubSub.publish('PUSH_CONFIG_STATE_UPDATED', diffs);
});

module.exports = {
	getState: function () {
		return _state;
	},
	updateConfigFile: updateConfigFile
}