var rsPath = require('../global-services/rs-path-classic.js');

// 首先单个文件自查
// rs.proto检查有没有styleType重复
// styleType.js 检查有没有styleType重复
function interfaceProtoSelfCheck() {

}

function protocolProtoSelfCheck() {

}

function styleTypeSelfCheck() {

}

// 再进行多个文件的交叉比较
// 检测 rs.proto 之间的styleType是否匹配
// 检测 rs.proto 之间的文件内容是否匹配
// 检测 rs.proto 与 styleType.js 的 styleType 是否匹配 (x2)
function protoVSproto() {

}

function protoVSstyletype() {

}

// 再进行下一个目录的比较