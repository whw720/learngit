/**
 * Created by Max on 2015/1/21.
 */
var db = require('../../../db'),
    uuid = require('../../../lib/uuid');

exports.getPrintInfo = function (params, callback) {
    var sql = "SELECT l.*,u.`NAME` FROM icu_print_log l,sys_user u " +
        "WHERE l.`USER_ID`=u.`ID` " +
        "AND care_date =? AND register_id=? order by l.print_time";
    db.query(sql, params, callback);
}

exports.add = function (params, callback) {
    var sql = "insert into icu_print_log set ? "
    db.query(sql, params, callback);
}