var rsPath = require('./rsPath.js');
var fs = require('fs');
// 需要本地安装node-oojs
require('node-oojs');

// oojs.setPath(rsPath.getRSRootPath());
// oojs.setPath('C:/Users/liguangyi/Desktop/render-server/src');
oojs.setPath(rsPath.getSrcPath());

var configFilePath = rsPath.getConfigFilePath();
// var a = oojs.using(configFilePath);
var a = oojs.using('rs.common.config.global');
console.log(a);
var result = fs.readFileSync(configFilePath, 'utf-8');
// console.log(result);