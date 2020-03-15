var path = require("path");
var fs = require("fs");
var dirs = [];
var pathName = "./code";

function getFilesPathFromArr(pathArr = './') {
	if (typeof pathArr === 'string') {
		return getFilesPath(pathArr);
	} else {
		let filePathArr = [];
		let promiseArr = [];
		for(let item of pathArr) {
			promiseArr.push(getFilesPath(item, filePathArr));
		}
		return Promise.all(promiseArr).then(()=>{
			return filePathArr;
		});
	}
}

// 获取所有需要的文件的路径，后续对文件提供正则进行筛选
function getFilesPath(pathName, filePaths = []) {
	let promiseArr = [];
	promiseArr.push(
		new Promise((resolve, reject) => {
			fs.readdir(pathName, (err, files) => {
				if (err) {
					resolve(filePaths);
				} else {
					let promises = [];
					for (let item of files) {
						let url = path.join(pathName, item);
						promises.push(
							new Promise((resolve, reject) => {
								fs.stat(url, (err, data) => {
									if (err) {
										reject(err);
									}
									if (data.isFile()) {
										filePaths.push(url);
										resolve();
									} else if (data.isDirectory()) {
										getFilesPath(url, filePaths).then(() => {
											resolve();
										});
									}
								});
							})
						);
					}
					Promise.all(promises).then(() => {
						resolve(filePaths);
					});
				}
			});
		})
	);

	return new Promise((resolve) => {
		Promise.all(promiseArr).then(() => {
			resolve(filePaths);
		});
	});
}

module.exports = getFilesPathFromArr;
