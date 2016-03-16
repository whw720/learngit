/**
 * 功能说明: 手术室
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

function list(params, callback) {
	var sql = 'SELECT ID as value, NAME as text FROM sys_surgery_room WHERE VALID = 1';
	db.query(sql, params, callback);
}

function add(params, callback) {
	params.ID = uuid.generate();
	var sql = 'INSERT INTO sys_surgery_room SET ?';
	db.query(sql, params, function(result) {
		callback({
			id: params.ID
		});
	});
}

function edit(params, callback) {
	var sql = 'UPDATE sys_surgery_room SET ? WHERE ID=?';
	db.query(sql, [{
			NAME: params.name
		},
		params.id
	], callback);
}

function updateNode(params, callback) {
	var sql = 'UPDATE sys_surgery_room SET ? WHERE ID=?';
	db.query(sql, [{
			DEPT_ID: params.DEPT_ID
		},
		params.ID
	], callback);
}

function updateSort(params, callback) {
	var sql = 'UPDATE sys_surgery_room SET ? WHERE ID=?';
	var orderOperaIdArray = params.orderOperaIdArray;
	if (typeof orderOperaIdArray == 'string') {
		orderOperaIdArray = [orderOperaIdArray];
	}
	for (var i = 0; i < orderOperaIdArray.length; i++) {
		db.query(sql, [{
				SORT_NUMBER: i + 1
			},
			orderOperaIdArray[i]
		], callback);
	}
}

function get(params, callback) {
	var sql = 'SELECT * FROM sys_surgery_room WHERE ID=?';
	db.query(sql, params, callback);
}

function getOpera(params, callback) {
	var sql = 'SELECT ID as value, NAME as text FROM sys_surgery_room WHERE DEPT_ID=? AND VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, params, function(result) {
		if (result.length == 0) {
			//result = [{'text': '该科室下无病区，请重新选择'}];
			result = [{
				'text': ''
			}];
		}
		callback(result);
	});
}

function getAll(params, callback) {
	var sql = 'SELECT ID as id, PARENT as pid, NAME as text, PATH_NAME as pathName FROM sys_departments WHERE VALID = 1 ORDER BY SORT_NUMBER';
	var sql_opera = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_surgery_room WHERE VALID = 1 ORDER BY SORT_NUMBER';
	//var sql_icu = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_icu WHERE VALID = 1 ORDER BY SORT_NUMBER';
	var sql_pacu = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_pacu WHERE VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, function(dept) {
		db.query(sql_opera, function(opera) {
			db.query(sql_pacu, function(pacu) {
				var childs = getChilds(dept, null, opera, pacu);
				callback(childs);
			});
		});
	});
}

function getChilds(nodeList, root, operaList, pacuList) {
	var childs = [];

	//科室
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].pid === root) {
			var childTree = {};
			childTree.id = nodeList[i].id;
			childTree.text = nodeList[i].text;
			childTree.path_name = nodeList[i].pathName;
			var child = getChilds(nodeList, nodeList[i].id, operaList, pacuList);
			if (child.length > 0) {
				childTree.expanded = true;
				childTree.leaf = false;
				childTree.children = child;
				childs.push(childTree);
			} else {
				childTree.leaf = true;
			}
		}
	}

	//手术室
	for (var i = 0; i < operaList.length; i++) {
		if (operaList[i].did === root) {
			var opera = {};
			opera.id = operaList[i].id;
			opera.text = operaList[i].text;
			opera.sort = operaList[i].sort;
			opera.leaf = true;
			opera.iconCls = 'operating';
			childs.push(opera);
		}
	}

	//复苏室
	for (var i = 0; i < pacuList.length; i++) {
		if (pacuList[i].did === root) {
			var pac = {};
			pac.id = pacuList[i].id;
			pac.text = pacuList[i].text;
			pac.sort = pacuList[i].sort;
			pac.leaf = true;
			pac.iconCls = 'pac-small';
			childs.push(pac);
		}
	}

	//重症监护室
	// for (var i = 0; i < icuList.length; i++) {
	// 	if (icuList[i].did === root) {
	// 		var icu = {};
	// 		icu.id = icuList[i].id;
	// 		icu.text = icuList[i].text;
	// 		icu.sort = icuList[i].sort;
	// 		icu.leaf = true;
	// 		icu.iconCls = 'icu-small';
	// 		childs.push(icu);
	// 	}
	// }

	return childs;
}


function getDeptOpera(params, callback) {
	var sql = 'SELECT ID as id, PARENT as pid, NAME as text, PATH_NAME as pathName FROM sys_departments WHERE VALID = 1 ORDER BY SORT_NUMBER';
	var sql_opera = 'SELECT ID as id, DEPT_ID as did, NAME as text, SORT_NUMBER as sort FROM sys_surgery_room WHERE VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, function(dept) {
		db.query(sql_opera, function(opera) {
			var childs = getOperaChilds(dept, null, opera);
			callback(childs);
		});
	});
}

function getOperaChilds(nodeList, root, operaList) {
	var childs = [];

	//科室
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].pid === root) {
			var childTree = {};
			childTree.id = nodeList[i].id;
			childTree.text = nodeList[i].text;
			childTree.path_name = nodeList[i].pathName;
			childTree.type = 'dept';
			var child = getOperaChilds(nodeList, nodeList[i].id, operaList);
			if (child.length > 0) {
				childTree.expanded = true;
				childTree.leaf = false;
				childTree.children = child;
				childs.push(childTree);
			} else {
				childTree.leaf = true;
			}
		}
	}

	//手术室
	for (var i = 0; i < operaList.length; i++) {
		if (operaList[i].did === root) {
			var opera = {};
			opera.id = operaList[i].id;
			opera.text = operaList[i].text;
			opera.type = 'room';
			opera.sort = operaList[i].sort;
			opera.leaf = true;
			opera.iconCls = 'operating';
			childs.push(opera);
		}
	}

	return childs;
}

exports.list = list;
exports.add = add;
exports.get = get;
exports.getOpera = getOpera;
exports.edit = edit;
exports.updateNode = updateNode;
exports.updateSort = updateSort;
exports.getDeptOpera = getDeptOpera;
exports.getAll = getAll;