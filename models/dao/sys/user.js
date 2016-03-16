/**
 * 功能说明: 人员
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid'),
	helpercode = require('../../cache/helper-code'),
	crypto = require('crypto'),
	page = require('../../../lib/page');

exports.list = function(params, callback) {
	var sql = 'SELECT * FROM sys_user  ORDER BY DEPT_ID,NAME';
	db.query(sql, params, callback);
};

exports.searchUser = function(req, callback) {
	var query = req.query.query;
	var helpcode = req.params['helpcode'],
		isDoctor = req.params['isDoctor'];
	deptid = req.params['deptid'];
	if (query == undefined) {
		query = helpcode;
	}
	query=query.replaceAll("'","");
	var sql = '';
	if(isDoctor == 'all') {
		sql = 'SELECT su.ID AS value, su.NAME AS text, su.HELPER_CODE AS str FROM sys_user su WHERE su.VALID = 1';
	} else {
 		sql = 'SELECT DISTINCT su.ID AS value, su.NAME AS text, su.HELPER_CODE AS str FROM sys_user su LEFT JOIN sys_role_user sru ON su.ID=sru.USER_ID WHERE su.VALID = 1';
	}
	if (query.length === 32) {
		sql += ' and su.ID = \'' + query + '\'';
	} else if (query.length != 0 && query != 'all') {
		sql += ' and (su.HELPER_CODE like \'%' + query + '%\' or su.NAME like \'%' + query + '%\')';
	}
	if (isDoctor === 'doctor') {
		sql += ' and sru.ROLE_ID IN (\'5b624ef0b10611e3ae2531b5b2f94cea\')';
	} else if(isDoctor === 'nurse') {
		sql += " and sru.ROLE_ID IN (\'1b0a03d0b94811e3917800271396a820\', \'61a5e2b078fd11e39fd9cb7044fb795e\') ";
	}
	if(deptid!=''&&deptid!='all'){
		sql += "and su.DEPT_ID='"+deptid+"' ";
	}
	sql += " AND su.`DEPT_ID` IS NOT NULL";
	var countSql = 'select count(*) as totalCount from ( ' + sql + ' ) a';
	//分页SQL
	var pageParams = page.getPageParam(req);
	var start=pageParams.start;
	var limit=pageParams.limit;
	var sql_new='SELECT * FROM (' + sql + ') pt limit ' + start + ',' + limit;
	if (typeof(start)=="undefined" || typeof(limit)=="undefined") {
		sql_new = sql;
	}
	db.query(sql_new, function(result) {
		if (result==undefined||result.length == 0) {
			result = [{
				'text': ''
			}];
		}
		var resObj = {
			data: result,
			totalCount: 0
		};
		db.query(countSql, function(res) {
			resObj.totalCount = res[0].totalCount;
			callback(resObj);
		})
	});
}

exports.add = function(params, callback) {
	params.ID = uuid.generate();
	params.PASSWORD = crypto.createHash('md5').update(params.PASSWORD).digest('hex');
	if(params.HELPER_CODE==null||params.HELPER_CODE==''){
		params.HELPER_CODE = helpercode.getHelperCode(params.NAME);
		params.HELPER_CODE=params.HELPER_CODE.substring(0,7);
	}
	//params.ROLE_ID = '3dba83a1089d11e396021b9f5cdf5941';
	var sql = 'INSERT INTO sys_user SET ?';
	db.query(sql, params, callback);
}

exports.edit = function(params, callback) {
	var sql = 'UPDATE sys_user SET ? WHERE ID=?';
	if(params.HELPER_CODE==null||params.HELPER_CODE==''){
		params.HELPER_CODE = helpercode.getHelperCode(params.NAME);
		params.HELPER_CODE=params.HELPER_CODE.substring(0,7);
	}
	if (params.PASSWORD.length > 0) {
		params.PASSWORD = crypto.createHash('md5').update(params.PASSWORD).digest('hex');

		db.query(sql, [{
				NAME: params.NAME,
				PASSWORD: params.PASSWORD,
				PHONE: params.PHONE,
				HELPER_CODE: params.HELPER_CODE,
				PRACTITIONER_QUALIFICATION: params.PRACTITIONER_QUALIFICATION,
				QUALIFICATION_YEAR: params.QUALIFICATION_YEAR
			},
			params.ID
		], callback);
	} else {
		db.query(sql, [{
				NAME: params.NAME,
				PHONE: params.PHONE,
				HELPER_CODE: params.HELPER_CODE,
				PRACTITIONER_QUALIFICATION: params.PRACTITIONER_QUALIFICATION,
				QUALIFICATION_YEAR: params.QUALIFICATION_YEAR
			},
			params.ID
		], callback);
	}

}

exports.get = function(params, callback) {
	if (params === 'all') {
		var sql = 'SELECT u.HELPER_CODE AS helpercode,u.ID AS id, u.DEPT_ID AS dept_id, d.NAME AS dept_name, u.NAME AS name, u.PHONE AS phone, u.PRACTITIONER_QUALIFICATION as practitioner_qualification, u.QUALIFICATION_YEAR as years_qualification FROM sys_user u LEFT JOIN sys_departments d ON u.DEPT_ID=d.ID WHERE u.VALID = 1 ORDER BY CASE WHEN u.`DEPT_ID` IS NULL THEN 1 ELSE 0 END ,u.`DEPT_ID`,u.`NAME`';
		db.query(sql, callback);
	} else {
		var sql = 'SELECT u.HELPER_CODE AS helpercode,u.ID AS id, u.DEPT_ID AS dept_id, d.NAME AS dept_name, u.NAME AS name, u.PHONE AS phone, u.PRACTITIONER_QUALIFICATION as practitioner_qualification, u.QUALIFICATION_YEAR as years_qualification FROM sys_user u LEFT JOIN sys_departments d ON u.DEPT_ID=d.ID WHERE u.DEPT_ID=? AND u.VALID = 1 ORDER BY CASE WHEN u.`DEPT_ID` IS NULL THEN 1 ELSE 0 END ,u.`DEPT_ID`,u.`NAME`';
		db.query(sql, params, callback);
	}
}

exports.login = function(params, callback) {
	var md5Passwd = crypto.createHash('md5').update(params.PASSWORD).digest('hex');
	var sql = 'SELECT u.*, d.TYPE,d.syncid as deptSid FROM sys_user u LEFT JOIN sys_departments d ON u.DEPT_ID=d.ID WHERE u.NAME=? AND u.PASSWORD=?';
	if (params.NAME != 'lite') {
		sql += ' AND u.VALID = 1';
	}
	db.query(sql, [params.NAME, md5Passwd], function(user) {
		if (user.length > 0) {
			var sql_role_resource = 'SELECT ID as id, PARENT as pid, NAME as name, TYPE as type FROM sys_resource WHERE ID IN (SELECT RESOURCE_ID FROM sys_role_resource WHERE ROLE_ID=?) AND VALID = 1 order by sort_number';
			db.query(sql_role_resource, params.ROLE, function(resource) {
				var data = {};
				data.flag = true;
				data.userId = user[0].ID;
				data.deptId = user[0].DEPT_ID,
                data.deptSid = user[0].deptSid,
				data.deptType = user[0].TYPE,
				data.role_name = params.role_name;
				data.roleId = params.ROLE;
				data.resource = resource;
				callback(data);
			});
		} else {
			var data = {};
			data.flag = false;
			data.msg = '用户名或密码错误。';
			callback(data);
		}
	});
}

/**
 *修改密码
 **/
exports.changePassword = function(params, callback) {
	var sql = "UPDATE sys_user SET PASSWORD=? WHERE ID=?";
	var sql_old = 'SELECT s.ID FROM sys_user s WHERE s.VALID=1 AND s.ID=? AND s.PASSWORD=?';
	params.OLDPASSWORD = crypto.createHash('md5').update(params.OLDPASSWORD).digest('hex');
	db.query(sql_old, [params.USERID, params.OLDPASSWORD], function(err, user) {
		if (err.length==0) {
			var data = {};
			data.flag = false;
			callback(data);
		} else {
				params.USERPASSWORD = crypto.createHash('md5').update(params.USERPASSWORD).digest('hex');
				db.query(sql, [params.USERPASSWORD, params.USERID], function(err, result) {
				});
				var data = {};
				data.flag = true;
				callback(data);
		}
	});
}

exports.queryUser = function(params, callback) {
	if(params.id==null){
		var querysql="SELECT *FROM sys_user WHERE NAME=? AND VALID=1";
		db.query(querysql, params.name, function(beds) {
			var data = {};
			if (beds.length > 0) {
				data.flag = false;
				data.msg = '该用户已存在！';
				callback(data);
			}else{
				data.flag = true;
				callback(data);
			}
		});
	}else{
		var querysql="SELECT *FROM sys_user WHERE NAME=? and id!=? AND VALID=1";
		db.query(querysql, [params.name,params.id], function(beds) {
			var data = {};
			if (beds.length > 0) {
				data.flag = false;
				data.msg = '该用户已存在！';
				callback(data);
			}else{
				data.flag = true;
				callback(data);
			}
		});
	}
	
}