/**
 * 功能说明: 配置项
 * @author: 杨祖文
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

function list(params, callback) {
	var sql = 'SELECT ID as id, TYPE as type, NAME as name, CODE as code, VALUE as settings, CELL_EDITOR as cell_editor FROM sys_options where VALID = 1 AND CODE IS NULL order by name';
	var sql_items = 'SELECT CODE, TYPE, MAX(CASE NAME WHEN "颜色" THEN VALUE ELSE NULL END) DISPLAY_COLOR, MAX(CASE NAME WHEN "图示" THEN VALUE ELSE NULL END) LEGEND_CODE, MAX(CASE NAME WHEN "修正值" THEN VALUE ELSE NULL END) CORRECTION_VALUE FROM sys_options WHERE CODE IS NOT NULL AND VALID = 1 GROUP BY TYPE'
	db.query(sql, params, function(result) {
		var results = {
			data: result
		}
		db.query(sql_items, function(items) {
			results.items = items;
			callback(results);
		});
	});
}


function add(params, callback) {
	params.ID = uuid.generate();
	params.VALID = 1;
	params.CELL_EDITOR = null;
	var sql = 'INSERT INTO sys_options SET ?';
	db.query(sql, params, function(result) {
		result.id = params.ID;
		callback(result);
	});
}

function edit(params, callback) {
	var sql = 'UPDATE sys_options SET ? WHERE';
	var option = [];
	if(params.ID) {
		sql += ' ID=?';
		option = [{
			VALUE: params.VALUE
		}, params.ID];
	} else {
		sql += ' CODE=? AND NAME=?';
		option = [{
			VALUE: params.VALUE
		}, params.CODE, params.NAME];
	}
	db.query(sql, option, callback);
}

exports.destroy = function(params, callback) {
	var sql = 'UPDATE sys_options SET VALID=0 WHERE TYPE = ?';
	db.query(sql, params, callback);
}

exports.getValue = function (params, callback) {
    db.query('select * from sys_options where id=? ', params, callback);
}

exports.list = list;
exports.add = add;
exports.edit = edit;