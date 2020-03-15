var babel = require("@babel/core");
var parser = require("@babel/parser");
const fs = require("fs");

var options = {
	sourceType: "module",
	ranges: true,
	allowAwaitOutsideFunction: true,
	allowImportExportEverywhere: true,
	allowReturnOutsideFunction: true,
	allowSuperOutsideMethod: true,
	plugins: [
		"babel-extract-comments",
		"typescript",
		"asyncGenerators",
		"bigInt",
		"classPrivateMethods",
		"classPrivateProperties",
		"classProperties",
		[
			"decorators",
			{
				decoratorsBeforeExport: true
			}
		],
		"doExpressions",
		"dynamicImport",
		"estree",
		"exportDefaultFrom",
		"exportNamespaceFrom",
		"functionBind",
		"functionSent",
		"importMeta",
		"jsx",
		"logicalAssignment",
		"nullishCoalescingOperator",
		"numericSeparator",
		"objectRestSpread",
		"optionalCatchBinding",
		"optionalChaining",
		[
			"pipelineOperator",
			{
				proposal: "minimal"
			}
		],
		"throwExpressions"
	]
};

// 代码文件路径
function getAstTreeFromFile(path) {
	return new Promise((resolve, reject)=>{
		fs.readFile(path, "utf-8", (error, data) => {
			if (error) {
				reject(error);
			} else {
				let tree = parser.parse(data, options);
				resolve(tree);
			}
		});
	});
	
}

module.exports = getAstTreeFromFile;