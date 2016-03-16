/**
 * 功能说明: 角色权限
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

exports.get = function(params, callback) {
	var sql = 'SELECT ID as id, RESOURCE_ID as resource_id FROM sys_role_resource WHERE ROLE_ID=?';
	db.query(sql, params, callback);
}

exports.add = function(params, callback) {
	var sql_delete = 'DELETE FROM sys_role_resource WHERE ROLE_ID=?';
	db.trans(function(trans) {
		trans.queryd(sql_delete, params.ROLE_ID);
		var sql = 'INSERT INTO sys_role_resource SET ?';
		if (typeof params.RESOURCE_IDS === 'string') {
			var role_resource = {
				ID: uuid.generate(),
				ROLE_ID: params.ROLE_ID,
				RESOURCE_ID: params.RESOURCE_IDS
			}
			trans.queryd(sql, role_resource);
		} else {
			for (var i = 0; i < params.RESOURCE_IDS.length; i++) {
				var role_resource = {
					ID: uuid.generate(),
					ROLE_ID: params.ROLE_ID,
					RESOURCE_ID: params.RESOURCE_IDS[i]
				}
				trans.queryd(sql, role_resource);
			}
		}
		trans.commit(function() {
			trans.conn.release();
			callback();
		});
	});
}
