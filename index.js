var babel = require("@babel/core");
var config = require("./src/config");
var getFilesPathFromArr = require("./src/FileLoader");
var filePathFilt = require("./src/fileFilter");
var getAstTreeFromFile = require("./src/babel");
var treeToCodeArr = require("./src/treeToCodeArr");
var fs = require("fs");

// TODO namespace，普通function，普通json对象，依赖项
getFilesPathFromArr(config.source.path)
	.then((filePaths) => {
		let promiseArr = [];
		let trees = [];
		filePaths = filePathFilt(filePaths, config.source.include, config.source.exclude);
		console.log(filePaths);
		for (let item of filePaths) {
			promiseArr.push(
				getAstTreeFromFile(item).then((tree) => {
					trees.push(tree);
				})
			);
		}
		return Promise.all(promiseArr).then(() => {
			return trees;
		});
	})
	.then((trees) => {
		let codeArr = [];
		for(let item of trees) {
			treeToCodeArr(item, config.api, codeArr);
		}
		console.log(codeArr);
		fs.writeFile(config.output, codeArr.join('\n'), { flag: "w", encoding: "utf-8" }, function(
			err
		) {
			if (err) {
				console.log("文件写入失败");
			} else {
				console.log("文件写入成功");
			}
		});
	});
