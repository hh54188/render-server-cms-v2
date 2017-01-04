var fs = require('fs');
var path = require('path');
var protobuf = require('protobufjs');
var protoPath = path.join(__dirname, 'protos', 'rs.proto');

// var builder = protobuf.load(protoPath, function (err, root) {
// 	console.log(err, root);
// });

var content = fs.readFileSync(protoPath, 'utf-8');
// 这个正则匹配不够好
// 万一 message AdElement 不在 enum StyleType 下面就不好了
var reg = /enum[\s]+StyleType[\s]+([\s\S]*)message[\s]+AdElement/;
var styleTypeBlockWithBracket = content.match(reg)[1]; // 首先把 enum StyleType 匹配出来（包括花括号）
// 把括号里的内容匹配出来
var styleTypeBlock = styleTypeBlockWithBracket.match(/\{([\s\S]*)\}/)[1];
// 把换行符去掉
styleTypeBlock = styleTypeBlock.replace(/\n/g, '');
// 把所有的空格去掉
styleTypeBlock = styleTypeBlock.replace(/\s/g, '');
// 切割为数组
var styleTypeArr = styleTypeBlock.split(';');
// 把数组的最后一项空字符串去掉
styleTypeArr.splice(styleTypeArr.length - 1, 1);
var styleTypeObj = {};
styleTypeArr.forEach(function (styleType) {
	styleType = styleType.split('=');
	
	var name = styleType[0];
	var value = styleType[1];
	
	styleTypeObj[name] = value;
});
