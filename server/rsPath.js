var path = require('path');
var fs = require('fs');

function checkPathIsAvailable(path) {
	var checkExist = fs.lstatSync || fs.statSync || fs.existsSync;
	try {
        checkExist(path);
    } catch (e) {
    	return false;
    }
    return true;
}

var REQUEST_FOLDER_NAME = 'request';
var CREATIVE_JS_NAME = 'creative.js';
var isProduction = false;

// 默认该预览工具文件夹会和render-server放在同一级别（将来也可以支持用户自由配置）
var RS_ROOT = path.resolve(path.join('.', '..', 'render-server', (isProduction? 'production': '')));
var RS_CLASSIC_TEMPLATE = path.resolve(path.join(RS_ROOT, 'src', 'rs', 'template'));

var RS_STANDARDIZE_CACHE = path.resolve(path.join(RS_ROOT, 'cache'));
var RS_STANDARDIZE_TEMPLATE = path.resolve(path.join(RS_STANDARDIZE_CACHE, 'template'));
var RS_STANDARDIZE_STYLE = path.resolve(path.join(RS_STANDARDIZE_CACHE, 'style'));

// Classic
function getClassicTemplateFolderPath(templateName) {
	return path.join(RS_CLASSIC_TEMPLATE, templateName);
}

function getClassicTemplateRequestFolderPath(templateName) {
	return path.join(
		getClassicTemplateFolderPath(templateName), 
		REQUEST_FOLDER_NAME
	);
}

function getClassicTemplateRequestFilePath(templateName, requestInfoName) {
	return path.join(
		getClassicTemplateRequestFolderPath(templateName), 
		requestInfoName
	);
}

// Standardize
function getStandardizeTemplateFolderPath(templateName) {
	return path.join(RS_STANDARDIZE_TEMPLATE, templateName);
}

function getStandardizeTemplateRequestFolderPath(templateName) {
	return path.join(
		getStandardizeTemplateFolderPath(templateName), 
		REQUEST_FOLDER_NAME
	);
}

function getStandardizeTemplateRequestFilePath(templateName, requestInfoName) {
	return path.join(
		getStandardizeTemplateRequestFolderPath(templateName), 
		requestInfoName
	);	
}

// Standarize Only
function getStandardizeTemplateStylePath(styleName) {
	return path.join(
		RS_STANDARDIZE_STYLE,
		styleName
	);
}

function getStandardizeCreativePath(templateName) {
	return path.join(
		getStandardizeTemplateFolderPath(templateName),
		CREATIVE_JS_NAME
	);
}

module.exports = {
	getConfigFilePath: function () {
		return path.join(RS_ROOT, 'src', 'rs', 'common', 'config', 'global.js');
	},
	enbaleProduction: function () {
		isProduction = true;
	},
	getRSRootPath: function () {
		return RS_ROOT;
	},
	Classic: {
		getTemplateRootPath: function () {
			return RS_CLASSIC_TEMPLATE;
		},
		getTemplateFolderPath: getClassicTemplateFolderPath,
		getTemplateRequestFolderPath: getClassicTemplateRequestFolderPath,
		getTemplateRequestFilePath: getClassicTemplateRequestFilePath
	},
	Standarize: {
		getCacheRootPath: function () {
			return RS_STANDARDIZE_CACHE;
		},
		getTemplateRootPath: function () {
			return RS_STANDARDIZE_TEMPLATE;
		},
		getStyleRootPath: function () {
			return RS_STANDARDIZE_STYLE;
		},
		getTemplateFolderPath: getStandardizeTemplateFolderPath,
		getTemplateRequestFolderPath: getStandardizeTemplateRequestFolderPath,
		getTemplateRequestFilePath: getStandardizeTemplateRequestFilePath,
		getStylePath: getStandardizeTemplateStylePath,
		getCreativePath: getStandardizeCreativePath
	}
}