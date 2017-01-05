var fs = require('fs');
var rsPath = require('../global-services/rs-path-classic.js');
var PubSub = require('pubsub-js');
var loopService = require('../global-services/loop.js');
require('node-oojs');

var ERROR_PROTO_STYLETYPE_NUMBER_DUPLICATE = 1;
var ERROR_PROTO_STYLETYPE_NAME_DUPLICATE = 2;

var ERROR_STYLETYPE_FILE_NUMBER_DUPLICATE = 3;
var ERROR_STYLETYPE_FILE_NAME_DUPLICATE = 4;

var ERROR_PROTO_VS_STYLETYPE_NAME_NOT_MATCH = 5;
var ERROR_PROTO_VS_STYLETYPE_NUMBER_NOT_MATCH = 6;

var ERROR_PROTO_VS_PROTO_NAME_NOT_MATCH = 7;
var ERROR_PROTO_VS_PROTO_NUMBER_NOT_MATCH = 8;

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

function reverseObjValueAndKey(obj, oldKeyProcessFn, oldValueProcessFn) {
	var newObj = {};
	for (var oldKey in obj) {
		var oldValue = obj[oldKey];
		oldKey = oldKeyProcessFn ? oldKeyProcessFn(oldKey) : oldKey;
		oldValue = oldValueProcessFn ? oldValueProcessFn(oldValue) : oldValue;
		newObj[oldValue] = oldKey;
	}
	return newObj;
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

	var result = [];

	if (duplicateStyleTypeNumbers.length) {
		result.push({
			errorCode: ERROR_PROTO_STYLETYPE_NUMBER_DUPLICATE,
			details: {
				duplicateStyleTypeNumbers: duplicateStyleTypeNumbers
			},
			filePaths: [protoPath]			
		});
	}

	if (duplicateStyleTypeNames.length) {
		result.push({
			errorCode: ERROR_PROTO_STYLETYPE_NAME_DUPLICATE,
			details: {
				duplicateStyleTypeNames: duplicateStyleTypeNames
			},
			filePaths: [protoPath]
		});
	}

	return result;
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

	var result = [];

	if (duplicateStyleTypeNumbers.length) {
		result.push({
			errorCode: ERROR_STYLETYPE_FILE_NUMBER_DUPLICATE,
			details: {
				duplicateStyleTypeNumbers: duplicateStyleTypeNumbers
			},
			filePaths: [path]			
		});
	}

	if (duplicateStyleTypeNames.length) {
		result.push({
			errorCode: ERROR_STYLETYPE_FILE_NAME_DUPLICATE,
			details: {
				duplicateStyleTypeNames: duplicateStyleTypeNames
			},
			filePaths: [path]
		});
	}
	
	return result;
}

function subArrayIsEmpty(arr) {
	var flag = true;

	arr.forEach(function (subArr) {
		if (subArr.length) {
			flag = false;
			return;
		}
	});

	return flag;
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

	var result = [];

	if (!subArrayIsEmpty(diffsOfNumbers)) {
		result.push({
			errorCode: ERROR_PROTO_VS_PROTO_NUMBER_NOT_MATCH,
			details: {
				diffNumbers: diffsOfNumbers
			},
			filePaths: [protoPathA, protoPathB]
		});
	}

	if (!subArrayIsEmpty(diffsOfNames)) {
		result.push({
			errorCode: ERROR_PROTO_VS_PROTO_NAME_NOT_MATCH,
			details: {
				diffNames: diffsOfNames
			},
			filePaths: [protoPathA, protoPathB]
		});
	}

	return result;
}

// 检测 rs.proto 与 styleType.js 的 styleType 是否匹配 (x2)
// 逻辑和上面的函数一致
function protoVSstyletype(protoPath, styleTypeInProduction) {
	var styleTypeObjFromProto = getProtoStyleTypeObject(protoPath);
	var styleTypeObjFromJS = getJSStyleTypeObject(styleTypeInProduction);
	
	// TEXT_BASE = 1000;
	var namesFromProto = Object.keys(styleTypeObjFromProto);
	// int1001: 'TEXT_APP_DOWNLOAD'
	var namesFromJS = Object.values(styleTypeObjFromJS);

	var diffsOfNames = compareSets(namesFromProto, namesFromJS);
	styleTypeObjFromJS = reverseObjValueAndKey(styleTypeObjFromJS, function (oldKey) {
		return oldKey.replace('int', '');
	});
	var diffsOfNumbers = compareObjectValues(styleTypeObjFromProto, styleTypeObjFromJS);
	var styleTypeFilePath = rsPath.getStyleTypeFilePath(styleTypeInProduction);

	var result = [];

	if (!subArrayIsEmpty(diffsOfNames)) {
		result.push({
			errorCode: ERROR_PROTO_VS_STYLETYPE_NAME_NOT_MATCH,
			details: {
				diffNames: diffsOfNames
			},
			filePaths: [protoPath, styleTypeFilePath]
		});
	}

	if (!subArrayIsEmpty(diffsOfNumbers)) {
		result.push({
			errorCode: ERROR_PROTO_VS_STYLETYPE_NUMBER_NOT_MATCH,
			details: {
				diffNumbers: diffsOfNumbers
			},
			filePaths: [protoPath, styleTypeFilePath]
		});
	}

	return result;
}

var healthState = null;

function check() {
	var interfaceProtoInDevelopment = rsPath.getInterfaceProtoPath();
	var protocolProtoInDevelopment = rsPath.getProtocolProtoPath();
	
	var interfaceProtoInProduction = rsPath.getInterfaceProtoPath(true);
	var protocolProtoInProduction = rsPath.getProtocolProtoPath(true);

	var developmentErrors = [];
	var productionErrors = [];
	var tempResult;

	function assembly(total, result) {
		if (result.length) {
			total = total.concat(result);
		}
		return total;		
	}

	developmentErrors = assembly(developmentErrors, rsProtoSelfCheck(interfaceProtoInDevelopment));
	developmentErrors = assembly(developmentErrors, rsProtoSelfCheck(protocolProtoInDevelopment));
	developmentErrors = assembly(developmentErrors, styleTypeSelfCheck(false));
	developmentErrors = assembly(
		developmentErrors, 
		protoVSproto(interfaceProtoInDevelopment, protocolProtoInDevelopment)
	);
	developmentErrors = assembly(developmentErrors, protoVSstyletype(interfaceProtoInDevelopment, false));
	developmentErrors = assembly(developmentErrors, protoVSstyletype(protocolProtoInDevelopment, false));

	productionErrors = assembly(productionErrors, rsProtoSelfCheck(interfaceProtoInProduction));
	productionErrors = assembly(productionErrors, rsProtoSelfCheck(protocolProtoInProduction));
	productionErrors = assembly(productionErrors, styleTypeSelfCheck(true));
	productionErrors = assembly(
		productionErrors, 
		protoVSproto(interfaceProtoInProduction, protocolProtoInProduction)
	);
	productionErrors = assembly(productionErrors, protoVSstyletype(interfaceProtoInProduction, true));
	productionErrors = assembly(productionErrors, protoVSstyletype(protocolProtoInProduction, true));

	return {
		developmentErrors: developmentErrors,
		productionErrors: productionErrors
	}
}

function main () {
	var tempHealthState = check();
	// 如果健康状况和之前的不一致
	// 代表出现了问题
	if (JSON.stringify(healthState) != JSON.stringify(tempHealthState)) {
		healthState = tempHealthState;
		// PubSub.publish('')
	}
}

healthState = check();
console.log(JSON.stringify(healthState, null, 4));

loopService.add(function () {
	main();
}.bind(this));
