/**
 * 功能说明: 分页操作
 * @author: 王小伟
 */
var db = require('../db');

exports.getPageParam=function(req){
	var start,limit=25;
	if(req.query){
		start=req.query.start;
		limit=req.query.limit;
	}else{
		start=req.body.start;
		limit=req.body.limit;
	}
	var page1={start:start,limit:limit};
	return page1;
};

exports.getDatePage=function(start,limit,totalCount,result){
	var dataResult={start:start,limit:limit,totalCount:totalCount,result:result};
	return dataResult;
};

exports.indexPage = function(pageParams, sql, callback) {
    var me = this;
    var sql_count = "SELECT count(*) AS all_count from (" + sql + ") pt";
    var fromIndex = sql.indexOf("from");
    if(fromIndex > 0 ) {
        sql_count = 'SELECT count(*) AS all_count ' + sql.substring(fromIndex);
    }

    var start=pageParams.start;
    var limit=pageParams.limit;
    var sql_new='SELECT * FROM (' + sql + ') pt limit ' + start + ',' + limit;

    db.query(sql_count, function(countResult) {
        db.query(sql_new, function(rowResult) {
            callback(me.getDatePage(start,limit,countResult[0].all_count,rowResult));
        });
    });
}