var fs = require('fs');
var rsPath = require('../global-services/rs-path-classic.js');
require('node-oojs');

var ERROR_PROTO_STYLETYPE_NUMBER_DUPLICATE = 1;
var ERROR_PROTO_STYLETYPE_NAME_DUPLICATE = 2;
var ERROR_STYLETYPE_FILE_NUMBER_DUPLICATE = 3;
var ERROR_STYLETYPE_FILE_NAME_DUPLICATE = 4;

Object.prototype.values = function (obj) {
	var _values = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			_values.push(obj[key]);
		}
	}
	return _values;
}


Object.prototype.keys = function (obj) {
	var _keys = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			_keys.push(key);
		}
	}
	return _keys;
}

// 从数组里找到重复项
function findDuplicateItemInArray(arr) {
	var duplicateItems = [];
	arr.forEach(function (item, index) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === item && i !== index && duplicateItems.indexOf(item) < 0) {
				duplicateItems.push(item);
			}
		}
	});
	return duplicateItems;
}

// 判断两个set里的元素是不是一致的
// 在javascript中set就是没有顺序的数组
function compareSets(setA, setB) {
	var InAButB = [];
	var InBButA = [];

	setA.forEach(function (itemA) {
		if (setB.indexOf(itemA) < 0) {
			InAButB.push(itemA);
		}
	});

	setB.forEach(function (itemB) {
		if (setA.indexOf(itemB) < 0) {
			InBButA.push(itemB);
		}
	});

	return [InAButB, InBButA];
}

function compareObjectValues(objA, objB) {
	var differences = [];
	for (var keyA in objA) {
		if (objA.hasOwnProperty(keyA) && objB.hasOwnProperty(keyA)) {
			if (objA[keyA] !== objB[keyA]) {
				differences.push({
					keyName: keyA,
					valueA: objA[keyA],
					valuB: objB[keyA]
				})
			}
		}
	}
	return differences;
}

// 从 styleType.js文件里抽取 styleType
function getJSStyleTypeObject(inProduction) {
	oojs.setPath(rsPath.getTemporarySrcPath(inProduction));
	var styleTypeObj = oojs.using('rs.common.model.styleType');
	styleTypeObj = oojs.reload('rs.common.model.styleType');
	return styleTypeObj.styleTypeEnum;
}

// 从rs.proto里抽取styleType
function getProtoStyleTypeObject(protoPath) {
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
	return styleTypeObj;
}

// ------Check method begin------

// 首先单个rs.proto文件自查
// rs.proto检查有没有styleType重复
// 有没有 styleType 的名字重复
function rsProtoSelfCheck(protoPath) {
	var styleTypeObj = getProtoStyleTypeObject(protoPath);
	// TEXT_BASE = 1000;
	var numbers = Object.values(styleTypeObj);
	var names = Object.keys(styleTypeObj);
	var duplicateStyleTypeNumbers = findDuplicateItemInArray(numbers);
	var duplicateStyleTypeNames = findDuplicateItemInArray(names);

	return [{
		errorCode: 0,
		duplicateStyleTypeNames: duplicateStyleTypeNames,
		duplicateStyleTypeNumbers: duplicateStyleTypeNumbers,
		filePaths: [protoPath]
	}];
}

// 对 styleType.js 文件进行检查
// 有没有styleType的编号和名字重复的问题
function styleTypeSelfCheck(inProduction) {
	var styleTypeObj = getJSStyleTypeObject(inProduction);
	var styleTypeFileInDevelopment = rsPath.getStyleTypeFilePath();
	var styleTypeFileInProduction = rsPath.getStyleTypeFilePath(true);

	// int1001: 'TEXT_APP_DOWNLOAD'
	var names = Object.values(styleTypeObj);
	var numbers = Object.keys(styleTypeObj);
	var duplicateStyleTypeNames = findDuplicateItemInArray(names);
	var duplicateStyleTypeNumbers = findDuplicateItemInArray(numbers);
	var path = inProduction ? styleTypeFileInProduction : styleTypeFileInDevelopment;
	
	return [{
		errorCode: 0,
		duplicateStyleTypeNames: duplicateStyleTypeNames,
		duplicateStyleTypeNumbers: duplicateStyleTypeNumbers,
		filePaths: [path]
	}];
}

// 同一个目录下（不能交叉目录）的多个文件的交叉比较
// 检测 rs.proto 之间的styleType是否匹配
// 检测 rs.proto 之间的文件内容是否匹配
function protoVSproto(protoPathA, protoPathB) {
	// 比较StyleType
	var styleTypeObjA = getProtoStyleTypeObject(protoPathA);
	var styleTypeObjB = getProtoStyleTypeObject(protoPathB);
	// 比较逻辑：
	// 1. A和B的name都是一样的（当作set，而不是array）：每一个A中的Name在B中都有，每一个B中的Name在A中也有，
	// 2. A和B每一个*共同的*name对应的number也是一样的
	var namesA = Object.keys(styleTypeObjA);	
	var namesB = Object.keys(styleTypeObjB);
	
	var diffsOfNames = compareSets(namesA, namesB);
	var diffsOfNumbers = compareObjectValues(styleTypeObjA, styleTypeObjB);

	return [{
		errorCode: 0,
		diffNames: diffsOfNames,
		diffNumbers: diffsOfNumbers,
		filePaths: [protoPathA, protoPathB]
	}];
}

// 检测 rs.proto 与 styleType.js 的 styleType 是否匹配 (x2)
// 逻辑和上面的函数一致
function protoVSstyletype(protoPath, styleTypeInProduction) {
	var styleTypeObjFromProto = getProtoStyleTypeObject(protoPath);
	var styleTypeObjFromJS = getJSStyleTypeObject(styleTypeInProduction);

	var namesFromProto = Object.keys(styleTypeObjFromProto);
	var namesFromJS = Object.values(styleTypeObjFromJS);
		return key.replace('int', '');
	});

	var diffsOfNames = compareSets(namesFromProto, namesFromJS);
	var diffsOfNumbers = compareObjectValues(styleTypeObjFromProto, styleTypeObjFromJS);
	var styleTypeFilePath = rsPath.getStyleTypeFilePath(styleTypeInProduction);

	return [{
		errorCode: 0,
		diffNames: diffsOfNames,
		diffNumbers: diffsOfNumbers,
		filePaths: [protoPath, styleTypeFilePath]
	}]
}

function main() {
	var interfaceProtoInDevelopment = rsPath.getInterfaceProtoPath();
	var protocolProtoInDevelopment = rsPath.getInterfaceProtoPath();
	
	var interfaceProtoInProduction = rsPath.getInterfaceProtoPath(true);
	var protocolProtoInProduction = rsPath.getProtocolProtoPath(true);

	var r1 = rsProtoSelfCheck(interfaceProtoInDevelopment);
	var r2 = rsProtoSelfCheck(protocolProtoInDevelopment);
	var r3 = styleTypeSelfCheck(false);
	var r4 = protoVSproto(interfaceProtoInDevelopment, protocolProtoInDevelopment);
	var r5 = protoVSstyletype(interfaceProtoInDevelopment, false);
	var r6 = protoVSstyletype(protocolProtoInDevelopment, false);

	// console.log(r1);
	// console.log(r2);
	// console.log(r3);
	// console.log(r4);
	console.log(r5[0].diffNames);
}

// setInterval(function () {
	main();
// }, 1000 * 1)