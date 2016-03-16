/**
 * 功能说明: 角色
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

exports.list = function(params, callback) {
	var sql = 'SELECT ID as id, NAME as name FROM sys_role WHERE VALID = 1';
	db.query(sql, params, callback);
};

exports.get = function(params, callback) {
	var sql = 'SELECT ID as id, NAME as name FROM sys_role WHERE ID=? AND VALID = 1';
	db.query(sql, params, callback);
}

exports.getRoleByUser = function(params, callback) {
	var sql = 'SELECT ID AS id, NAME AS name FROM sys_role sr WHERE ID IN ((SELECT ROLE_ID FROM sys_role_user WHERE USER_ID IN (SELECT ID FROM sys_user WHERE NAME = ? AND VALID = 1 AND `DEPT_ID` IS NOT NULL)))';
	db.query(sql, params, callback);
}

exports.getRoleByUserID = function(params, callback) {
	var sql = 'SELECT ROLE_ID FROM sys_role_user WHERE USER_ID=?';
	db.query(sql, params, callback);
}