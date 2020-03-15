function treeToCodeArr(tree, config, codeArr = []) {
	// 语法树的代码节点数组
	const nodeArr = tree.program.body;
	for (let item of nodeArr) {
		switch (item.type) {
			case "ClassDeclaration": {
				parseClassApi(item, config, codeArr);
			}
		}
	}
	return codeArr;
}

// 检查配置信息，判断某个api或者对象属性需要保留命名
// 决定性因素是access级别和注释tag。tag优先级高于access。没有tag才会再分析access
function checkRule(node, config) {
	let includeTag = config.include.commentTag;
	let excludeTag = config.exclude.commentTag;

	if (node.leadingComments && node.leadingComments.type === "CommentBlock") {
		// 遍历配置里的tag数组，判断是否有对应tag
		for (let item of includeTag) {
			// 有标签则生成externs标注
			if (node.leadingComments.value.includes(item)) {
				return true;
			}
		}
		for (let item of excludeTag) {
			// 有标签则不生成externs标注
			if (node.leadingComments.value.includes(item)) {
				return false;
			}
		}
	}
	// 判断access
	let access = config.include.access;
	let nodeAccess = node.accessibility || "default";
	if (access.includes(nodeAccess)) {
		return true;
	}
	return false;
}

function parseClassApi(node, config, codeArr) {
	console.log(JSON.stringify(node));
	let commentTag = config.exclude.commentTag;
	// 对于一个类是否需要保留命名，需要判断类的注释是否有tag标注。默认情况类会保留命名。并且tag必须在块级注释内
	if (node.leadingComments && node.leadingComments.type === "CommentBlock") {
		// 遍历配置里的tag数组，判断是否有对应tag
		for (let item of commentTag) {
			// 有标签则不再生成externs标注
			if (node.leadingComments.value.includes(item)) {
				return;
			}
		}
	}
	// 然后开始生成这个类的所有externs标注
	const className = node.id.name; // 类名
	// step 1: 先要找到构造函数，生成var xxx = function(a, b, c){}; 所以必须先遍历ast的子节点找到构造函数。如果没有构造函数就是function(){}
	let code = getFunctionCode(node.body.body);
	codeArr.push("var " + className + " = " + code);
	// step 2: 找到所有的属性和方法做一一处理
	for (let item of node.body.body) {
		let needExtern = checkRule(item, config);
		console.log(needExtern);
		if (!needExtern) {
			continue;
		}
		switch (item.type) {
			// 成员属性
			case "ClassProperty": {
				let name = item.key.name;
				if (item.static) {
					codeArr.push(className + "." + name + ";");
				} else {
					codeArr.push(className + ".prototype." + name + ";");
				}
				break;
			}
			case "MethodDefinition": {
				if (item.kind === "constructor") {
					break;
                }
				let name = item.key.name;
                if (item.static) {
					codeArr.push(className + "." + name + " = " +getFunctionParams(item));
				} else {
					codeArr.push(className + ".prototype." + name + " = " + getFunctionParams(item));
                }
                break;
			}
		}
	}
}

function getFunctionCode(nodes) {
	let node = false;
	for (let item of nodes) {
		if (item.type === "MethodDefinition" && item.kind === "constructor") {
			node = item;
			break;
		}
	}
	return getFunctionParams(node);
}

// 找到函数的参数列表，返回externs标注代码
function getFunctionParams(node) {
	if (!node) {
		return "function(){}";
	}
	// console.log(node)
	let params = node.value.params;
	if (!params) {
		return "function(){};";
	} else {
		let str = "";
		for (let i = 0; i < params.length; i++) {
			str += params[i].name;
			if (i < params.length - 1) {
				str += ", ";
			}
		}
		return "function(" + str + "){};";
	}
}

module.exports = treeToCodeArr;
