/**
 * 功能说明: 全局变量，用于Nginx多进程部署
 * @author: 王小伟
 */
var db = require('../../../db');

//变量值加
exports.variableAdd = function(variableName, addNum, callback) {
    var sql = "update sys_variable v set v.VALUE=v.VALUE+? where v.NAME=?";
    db.query(sql, [addNum, variableName], callback);
}

//变量值查询
exports.findVariable = function(variableName, callback) {
    var sql = "select v.VALUE from sys_variable v where v.NAME=?";
    db.query(sql, [variableName], callback);
}

//保存对象值
exports.variableSave = function(variableName, value) {
    var sql = "update sys_variable v set v.VALUE=? where v.NAME=?";
    db.query(sql, [value, variableName], function(){});
}
