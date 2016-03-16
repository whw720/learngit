/**
 * 功能说明: 权限
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

// exports.get = function(params, callback) {
// 	if (params === null) {
// 		var sql = 'SELECT ID as id, NAME as text FROM sys_resource WHERE PARENT IS NULL AND VALID = 1 ORDER BY SORT_NUMBER';
// 		db.query(sql, params, function(result) {
// 			for (var i = 0; i < result.length; i++) {
// 				result[i].checked = false;
// 				result[i].expanded = true;
// 			}
// 			callback(result);
// 		});
// 	} else {
// 		var sql = 'SELECT ID as id, NAME as text FROM sys_resource WHERE PARENT=? AND VALID = 1 ORDER BY SORT_NUMBER';
// 		db.query(sql, params, function(result) {
// 			for (var i = 0; i < result.length; i++) {
// 				result[i].checked = false;
// 				result[i].expanded = true;
// 			}
// 			callback(result);
// 		});
// 	}
// }

exports.getAll = function(params, callback) {
	var results = [];
	var sql = 'SELECT ID as id, NAME as text, PARENT as pid FROM sys_resource WHERE VALID = 1 ORDER BY SORT_NUMBER';
	db.query(sql, function(result) {
		var root = {};
		root.expanded = true;
		root.children = getChild(result, null);
		results.push(root);
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
			childTree.checked = false;
			childTree.expanded = true;
			var child = getChild(nodeList, nodeList[i].id);
			if (child.length > 0) {
				childTree.children = child;
			}
			childs.push(childTree);
		}
	}
	return childs;
}