/**
 * 功能说明: 数据库操作封装
 * @author: 王小伟
 */
var mysql = require('mysql'),
	queues = require('mysql-queues'),
	log4js = require('log4js'),
	log = log4js.getLogger('db'),
	config = require('./config/lancet-config');

exports.pool = mysql.createPool({
	host: config.db.HOST,
	user: config.db.USER,
	password: config.db.PASS,
	database: config.db.DATABASE,
	charset: config.db.CHARSET,
    connectionLimit: (config.db.connectionLimit === undefined)
        ? 10
        : Number(config.db.connectionLimit)
});

exports.query = function(sql, params, cb) {
    var me = this;
	if (typeof params == "function") {
		cb = params;
		params = undefined;
	}
    me.pool.getConnection(function(err, conn) {
        if (err) {
            log.error('数据库连接失败：', err.message);
            cb(null);
            return;
        }
        //计算执行时间
        var startTime,endTime;
        var d=new Date();
        startTime=d.getTime();
        var query = conn.query(sql, params, function(err, results, fields) {
            conn.release();
            if (err) {
                log.error('数据库查询失败：', err.message);
                log.error('SQL：', sql);
                log.error('PARAMS：', params);
            }

            d=new Date();
            endTime=d.getTime();
            if (config.db.SHOWSQL === true && query) {
                if(((endTime-startTime)/1000)>0.5){
                    log.info('SQL：', sql);
                    log.info('PARAMS：', params);
                    log.info("执行时间" + ((endTime-startTime)/1000));
                }

            }
            cb(results);
        });
    });

};

exports.trans = function(service_cb) {
	this.pool.getConnection(function(err, conn) {
		if (err) {
			log.error('数据库连接失败：', err.message);
			service_cb(null);
			return;
		}
		//第二个参数为true则开启debug日志
		queues(conn, false);
		var trans = conn.startTransaction();
		trans.conn = conn;
		trans.queryd = function(sql, params) {
            //计算执行时间
            var startTime,endTime;
            var d=new Date();
            startTime=d.getTime();
			trans.query(sql, params, function(err) {
				if (err && trans.rollback) {
					trans.rollback(function() {
						conn.release();
					});
					log.error('数据库查询失败：\nsql：%s\n错误：', sql, err.message);
                    log.error('PARAMS：', params);
				}
                d=new Date();
                endTime=d.getTime();
                if (config.db.SHOWSQL === true) {
                    log.info('SQL：', sql);
                    log.info('PARAMS：', params);
                    log.info("执行时间" + ((endTime-startTime)/1000));
                }
			});
		};
		service_cb(trans);
	});
};

exports.querys = function(cb) {
	this.pool.getConnection(function(err, conn) {
		if (err) {
			log.error('数据库连接失败：', err.message);
			cb(null);
			return;
		}
		queues(conn, false);
		conn.queryd = function(sql, params) {
            //计算执行时间
            var startTime,endTime;
            var d=new Date();
            startTime=d.getTime();
			conn.query(sql, params, function(err) {
				if (err) {
					log.error('数据库查询失败：\nsql：%s\n错误：', sql, err.message);
				}
                d=new Date();
                endTime=d.getTime();
                if (config.db.SHOWSQL === true) {
                    if(((endTime-startTime)/1000)>1){
                        log.info('SQL：', sql);
                        log.info('PARAMS：', params);
                        log.info("执行时间" + ((endTime-startTime)/1000));
                    }

                }
			});
		};
		cb(conn);
	});
};