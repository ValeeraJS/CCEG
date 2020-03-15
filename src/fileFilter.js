// include 和exclude都是字符串形式的正则。如果include为空，那么任何文件路径都会包含。如果exclude为空，那么不会剔除任何文件

function filePathFilt(pathArr = [], include, exclude) {
	let regInclude = undefined;
	let regExclude = undefined;
	let result = [];
	if (include) {
        regInclude = new RegExp(include);
	}
	if (exclude) {
        regExclude = new RegExp(exclude);
	}

	for (let item of pathArr) {
		if (regInclude && !regInclude.test(item)) {
            continue;
        }
        if (regExclude && regExclude.test(item)) {
            continue;
        }
        result.push(item);
    }
    return result;
}

module.exports = filePathFilt;
