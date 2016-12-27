var rsPath = require('./rs-path.js');
var path = require('path');
var fs = require('fs');
require('node-oojs'); // 需要本地安装node-oojs

// oojs.setPath(rsPath.getRSRootPath());
// oojs.setPath('C:/Users/liguangyi/Desktop/render-server/src');
oojs.setPath(rsPath.getSrcPath());

var configObj = oojs.using('rs.common.config.global');
var renderServerAbsolutePath = rsPath.getRSRootPath();
// 相对于node执行目录"."，而非相对于当前文件目录__dirname
var renderServerRelativePath = path.relative(path.join('.'), rsPath.getRSRootPath());
var state = {
    rs: {
        isRunning: false,
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

console.log(state);

// var configFilePath = rsPath.getConfigFilePath();
// var result = fs.readFileSync(configFilePath, 'utf-8');
// console.log(result);