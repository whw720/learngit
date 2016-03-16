/**
 * 功能说明: 数据采集点
 * @author: 杨祖文
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

function list(params, callback) {
	var sql = 'SELECT ID as ID, NAME as NAME, URL as URL FROM sys_link WHERE VALID = 1';
	db.query(sql, params, callback);
}

function add(params, callback) {
	var id = uuid.generate();
	params.ID = id;
	params.IO_INTERFACE = null;
	params.DESCRIPTION = null;
	var sql = 'INSERT INTO sys_link SET ?';
	db.query(sql, params, callback);
}

function edit(params, callback) {
	var id = params.ID;
	var link = [{
			NAME: params.NAME,
			URL: params.URL
		},
		params.ID
	];
	var sql = 'UPDATE sys_link SET ? WHERE ID=?';
	db.query(sql, link, callback);
}

exports.listByIds = function(ids, callback) {
	var sql = 'SELECT ID, URL FROM sys_link where ID in(?)';
	db.query(sql, [ids], callback);
}

exports.destroy = function(params, callback) {
	var sql = 'UPDATE sys_link SET VALID=0 WHERE ID=?';
	db.query(sql, params, callback);
}

exports.list = list;
exports.add = add;
exports.edit = edit;