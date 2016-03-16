/**
 * 功能说明: 科室
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

function list(params, callback) {
	var sql = 'SELECT ID as id, NAME as text FROM sys_departments';
	db.query(sql, params, callback);
}

function add(params, callback) {
	params.ID = uuid.generate();
	if (params.PATH_NAME.length == 0) {
		params.PATH_NAME = params.ID;
	} else {
		params.PATH_NAME += '.' + params.ID;
	}
	var sql = 'INSERT INTO sys_departments SET ?';
	db.query(sql, params, function(result) {
		callback({
			id: params.ID,
			path_name: params.PATH_NAME
		});
	});
}

function edit(params, callback) {
	var sql = 'UPDATE sys_departments SET ? WHERE ID=?';
	db.query(sql, [{
			NAME: params.name
		},
		params.id
	], callback);
}

function updateNode(params, callback) {
	var sql = 'UPDATE sys_departments SET ?, ? WHERE ID=?';
	db.query(sql, [{
			PARENT: params.PARENT
		}, {
			PATH_NAME: params.PATH_NAME
		},
		params.ID
	], callback);
}

function updateSort(params, callback) {
	var sql = 'UPDATE sys_departments SET ? WHERE ID=?';
	var orderDeptIdArray = params.orderDeptIdArray;
	if (typeof orderDeptIdArray == 'string') {
		orderDeptIdArray = [orderDeptIdArray];
	}
	for (var i = 0; i < orderDeptIdArray.length; i++) {
		db.query(sql, [{
				SORT_NUMBER: i + 1
			},
			orderDeptIdArray[i]
		], callback);
	}
}

function get(params, callback) {
	var sql = 'SELECT * FROM sys_departments WHERE ID=?';
	db.query(sql, params, callback);
}


//全部加载科室

function getDept(params, callback) {
	var results = [];
	var sql = 'SELECT ID as id, PARENT as pid, TYPE as type, NAME as text, PATH_NAME as pathName FROM sys_departments WHERE VALID = 1 AND TYPE=\'D\' ORDER BY SORT_NUMBER';
	db.query(sql, function(result) {
		for (var i = 0; i < result.length; i++) {
			if (result[i].pid === null) {
				var root = {};
				root.id = result[i].id;
				root.text = result[i].text;
				root.type = result[i].type;
				root.pathName = result[i].pathName;
				var childs = getChild(result, result[i].id);
				if (childs.length > 0) {
					root.expanded = true;
					root.children = childs;
				} else {
					root.leaf = true;
				}
				results.push(root);
			}
		}
		callback(results);
	});
}

function getChild(nodeList, root) {
	var childs = [];
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].pid === root) {
			var childTree = {};
			childTree.id = nodeList[i].id;
			childTree.text = nodeList[i].text;
			childTree.type = nodeList[i].type;
			childTree.pathName = nodeList[i].pathName;
			var child = getChild(nodeList, nodeList[i].id);
			if (child.length > 0) {
				childTree.expanded = true;
				childTree.leaf = false;
				childTree.children = child;
			} else {
				childTree.leaf = true;
			}
			childs.push(childTree);
		}
	}
	return childs;
}

//全部加载科室和病区,ICU

function getAll(params, callback) {
	//var results = [];
	var sql = 'SELECT ID as id, PARENT as pid, TYPE AS type, NAME as text, PATH_NAME as pathName, SORT_NUMBER as sort FROM sys_departments WHERE VALID = 1 ORDER BY SORT_NUMBER';
	// var sql_ward = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_ward WHERE VALID = 1 ORDER BY SORT_NUMBER';
	// var sql_icu = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_icu WHERE VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, function(result) {
		var dept = [],
			ward = [],
			icu = [];

		for(var i = 0;i<result.length;i++) {
			if(result[i].type == 'D') {
				dept.push(result[i]);
			} else if(result[i].type == 'W') {
				ward.push(result[i]);
			} else if(result[i].type == 'I') {
				icu.push(result[i]);
			}
		}
		var childs = getChilds(dept, null, ward, icu);
		callback(childs);
	});
}

function getChilds(nodeList, root, wardList, icuList) {
	var childs = [];

	//科室
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].pid === root) {
			var childTree = {};
			childTree.id = nodeList[i].id;
			childTree.text = nodeList[i].text;
			childTree.sort = nodeList[i].sort;
			childTree.type = nodeList[i].type;
			childTree.path_name = nodeList[i].pathName;
			var child = getChilds(nodeList, nodeList[i].id, wardList, icuList);
			if (child.length > 0) {
				childTree.expanded = true;
				childTree.leaf = false;
				childTree.children = child;
			}else{
				childTree.expanded = false;
				childTree.leaf = false;
			}
			childs.push(childTree);
		}
	}
	//病区
	for (var i = 0; i < wardList.length; i++) {
		if (wardList[i].pid === root) {
			var ward = {};
			ward.id = wardList[i].id;
			ward.text = wardList[i].text;
			ward.sort = wardList[i].sort;
			ward.type = wardList[i].type;
			ward.path_name = wardList[i].pathName;
			ward.iconCls = 'ward';
			var child = getChilds(nodeList, wardList[i].id, wardList, icuList);
			if (child.length > 0) {
				ward.expanded = true;
				ward.leaf = false;
				ward.children = child;
			}else{
				ward.expanded = false;
				ward.leaf = false;
			}
			childs.push(ward);
		}
	}

	//重症监护室
	for (var i = 0; i < icuList.length; i++) {
		if (icuList[i].pid === root) {
			var icu = {};
			icu.id = icuList[i].id;
			icu.text = icuList[i].text;
			icu.sort = icuList[i].sort;
			icu.type = icuList[i].type;
			icu.path_name = icuList[i].pathName;
			icu.leaf = true;
			icu.iconCls = 'icu-small';
			childs.push(icu);
		}
	}
	return childs;
}

//加载科室和ICU

function getDeptIcu(params, callback) {
//	var sql = 'SELECT ID as id, PARENT as pid, TYPE as type, NAME as text, PATH_NAME as pathName FROM sys_departments WHERE VALID = 1 ORDER BY SORT_NUMBER';
//	db.query(sql, function(result) {
//		var dept = [],
//			icu = [];
//		for(var i = 0;i<result.length;i++) {
//			if(result[i].type == 'D') {
//				dept.push(result[i]);
//			} else if(result[i].type == 'I') {
//				icu.push(result[i]);
//			}
//		}
//		var childs = getIcuChilds(dept, null, icu);
//		callback(childs);
//	});
	//var results = [];
	var sql = 'SELECT ID as id, PARENT as pid, TYPE AS type, NAME as text, PATH_NAME as pathName, SORT_NUMBER as sort FROM sys_departments WHERE VALID = 1 ORDER BY SORT_NUMBER';
	// var sql_ward = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_ward WHERE VALID = 1 ORDER BY SORT_NUMBER';
	// var sql_icu = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_icu WHERE VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, function(result) {
		var dept = [],
			ward = [],
			icu = [];

		for(var i = 0;i<result.length;i++) {
			if(result[i].type == 'D') {
				dept.push(result[i]);
			} else if(result[i].type == 'W') {
				ward.push(result[i]);
			} else if(result[i].type == 'I') {
				icu.push(result[i]);
			}
		}
		var childs = getIcuChilds(dept, null, ward, icu);
		callback(childs);
	});
}

//function getIcuChilds(nodeList, root, icuList) {
function getIcuChilds(nodeList, root, wardList, icuList){
	var childs = [];

	//科室
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].pid === root) {
			var childTree = {};
			childTree.id = nodeList[i].id;
			childTree.text = nodeList[i].text;
			childTree.sort = nodeList[i].sort;
			childTree.type = nodeList[i].type;
			childTree.path_name = nodeList[i].pathName;
			var child = getIcuChilds(nodeList, nodeList[i].id, wardList, icuList);
			if (child.length > 0) {
				childTree.expanded = true;
				childTree.leaf = false;
				childTree.children = child;
			}else{
				childTree.expanded = false;
				childTree.leaf = true;
			}
			childs.push(childTree);
		}
	}
	//病区
	for (var i = 0; i < wardList.length; i++) {
		if (wardList[i].pid === root) {
			var ward = {};
			ward.id = wardList[i].id;
			ward.text = wardList[i].text;
			ward.sort = wardList[i].sort;
			ward.type = wardList[i].type;
			ward.path_name = wardList[i].pathName;
			ward.iconCls = 'ward';
			var child = getIcuChilds(nodeList, wardList[i].id, wardList, icuList);
			if (child.length > 0) {
				ward.expanded = true;
				ward.leaf = false;
				ward.children = child;
			}else{
				ward.expanded = false;
				ward.leaf = true;
			}
			childs.push(ward);
		}
	}

	//重症监护室
	for (var i = 0; i < icuList.length; i++) {
		if (icuList[i].pid === root) {
			var icu = {};
			icu.id = icuList[i].id;
			icu.text = icuList[i].text;
			icu.sort = icuList[i].sort;
			icu.type = icuList[i].type;
			icu.path_name = icuList[i].pathName;
			icu.leaf = true;
			icu.iconCls = 'icu-small';
			childs.push(icu);
		}
	}
	return childs;
//	var childs = [];
//
//	//科室
//	for (var i = 0; i < nodeList.length; i++) {
//		if (nodeList[i].pid === root) {
//			var childTree = {};
//			childTree.id = nodeList[i].id;
//			childTree.text = nodeList[i].text;
//			childTree.sort = nodeList[i].sort;
//			childTree.type = nodeList[i].type;
//			childTree.path_name = nodeList[i].pathName;
//			var child = getIcuChilds(nodeList, nodeList[i].id, icuList);
//			if (child.length > 0) {
//				childTree.expanded = true;
//				childTree.leaf = false;
//				childTree.children = child;
//				childs.push(childTree);
//			} else {
//				childTree.leaf = true;
//			}
//			
//		}
//	}
//
//	//重症监护室
//	for (var i = 0; i < icuList.length; i++) {
//		if (icuList[i].pid === root) {
//			var icu = {};
//			icu.id = icuList[i].id;
//			icu.text = icuList[i].text;
//			icu.sort = icuList[i].sort;
//			icu.type = icuList[i].type;
//			icu.leaf = true;
//			icu.iconCls = 'icu-small';
//			childs.push(icu);
//		}
//	}
//	return childs;
}



exports.list = list;
exports.add = add;
exports.get = get;
exports.edit = edit;
exports.getAll = getAll;
exports.getDept = getDept;
exports.getDeptIcu = getDeptIcu;
exports.updateNode = updateNode;
exports.updateSort = updateSort;