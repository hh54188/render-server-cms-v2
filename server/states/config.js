var path = require('path');
var fs = require('fs');
var rsPath = require('./rs-path.js');
var checkRenderIsRunning = require('../services/check-render-is-running.js');
require('node-oojs'); // 需要本地安装node-oojs

function getState() {
	oojs.setPath(rsPath.getSrcPath());
	var configObj = oojs.using('rs.common.config.global');
	var renderServerAbsolutePath = rsPath.getRSRootPath();
	// 相对于node执行目录"."，而非相对于当前文件目录__dirname
	var renderServerRelativePath = path.relative(path.join('.'), rsPath.getRSRootPath());
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

module.exports = {
	getState: getState,
	updateConfigFile: updateConfigFile
}