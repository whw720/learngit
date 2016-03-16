/**
 * 功能说明: 用户角色
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

exports.add = function(params, callback) {
	params.ID = uuid.generate();
	var sql = 'INSERT INTO sys_role_user SET ?';
	db.query(sql, params, callback);
}

exports.destroy = function(params, callback) {
	var sql = 'DELETE FROM sys_role_user WHERE ROLE_ID=? AND USER_ID=?';
	db.query(sql, params, callback);


}