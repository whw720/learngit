//客户端采集数据dao
var db = require('../../../db'),
	uuid = require('../../../lib/uuid'),
    log = require('log4js').getLogger('monitor-raw-data');


exports.addBatch = function(params, callback) {
	var sql = 'INSERT INTO adm_monitor_raw_data SET ?';
	db.trans(function(trans) {
		for (var i = 0; i < params.length; i++) {

			var raw = params[i];
			if (raw.VALUE === null || isNaN(raw.VALUE)) {
				continue;
			}
			raw.ID = uuid.generate();
			trans.queryd(sql, raw);
		}

		trans.commit(function() {
			trans.conn.release();
			callback();
		});
	});
};

exports.getByid = function(params, callback) {
	var sql = 'select * from adm_monitor_raw_data where ID= ?';
	db.query(sql, [params], callback);
};
/**
 * 定时清除icu_device_raw_data表中的数据相关SQL
 */
exports.clearRawDataSql = function(partitionName) {
    //查询分区是否存在SQL
    var isExistsByPartitionName = "SELECT * FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'icu_device_raw_data' AND PARTITION_NAME = ?";
    //是否存在要删除的数据
    var isExistsDataByPartitionName =
        "SELECT AM.ID\n" +
            "  FROM icu_device_raw_data PARTITION(" + partitionName + ") AM\n" +
            " WHERE NOT EXISTS (SELECT 1\n" +
            "          FROM icu_care_records MM\n" +
            "         WHERE MM.DEVICE_RAW_DATA_ID IS NOT NULL\n" +
            "           AND AM.ID = MM.DEVICE_RAW_DATA_ID) LIMIT 0, 1";

/*    var forUpdateSqlByPartitionName =
        "SELECT AM.* FROM icu_device_raw_data PARTITION(" + partitionName + ") AM\n" +
            " WHERE NOT EXISTS (SELECT 1\n" +
            "          FROM icu_care_records MM\n" +
            "         WHERE MM.DEVICE_RAW_DATA_ID IS NOT NULL\n" +
            "           AND AM.ID = MM.DEVICE_RAW_DATA_ID) FOR UPDATE";

    var delSqlByPartitionName =
        "DELETE AM FROM icu_device_raw_data PARTITION(" + partitionName + ") AM\n" +
            " WHERE NOT EXISTS (SELECT 1\n" +
            "          FROM icu_care_records MM\n" +
            "         WHERE MM.DEVICE_RAW_DATA_ID IS NOT NULL\n" +
            "           AND AM.ID = MM.DEVICE_RAW_DATA_ID)";*/
    var createTempTableForRawData = "create table tmp_icu_device_raw_data " +
        "select * " +
        "from " +
        "icu_device_raw_data partition (" + partitionName + ") AM " +
        "where exists " +
        "(select " +
        "1 " +
        "from " +
        "icu_care_records MM " +
        "where MM.DEVICE_RAW_DATA_ID is not null " +
        "and AM.ID = MM.DEVICE_RAW_DATA_ID)";
    //清空分区数据
    var clearPartitionData="alter table icu_device_raw_data truncate partition " + partitionName;
    //重新将数据写回raw_data表
    var reWriteDataToRawData="insert into icu_device_raw_data select * from tmp_icu_device_raw_data";
    //删除临时表
    var deleteTmpRawData="drop table if exists tmp_icu_device_raw_data";
    return {
        isExistsByPartitionName: isExistsByPartitionName,
        isExistsDataByPartitionName: isExistsDataByPartitionName,
        createTempTableForRawData: createTempTableForRawData,
        clearPartitionData: clearPartitionData,
        reWriteDataToRawData: reWriteDataToRawData,
        deleteTmpRawData: deleteTmpRawData
    };
};
/**
 * 定时清除adm_monitor_raw_data表中的数据(默认只保留最近三月的数据)
 */
exports.clearRawDataTask = function(config,callback) {
    var me = this;
    var tableSchema = config.db.DATABASE;

    var partitionInfo = me.getPartitionInfo(-3); //默认删除最近三个月的数据
    var partitionName = partitionInfo.partitionName;
    var sqlObj = me.clearRawDataSql(partitionName);
    var dateStart=new Date().getTime();
    db.query(sqlObj.isExistsByPartitionName, [tableSchema, partitionName], function (result) {
        if (result != null && result.length > 0) {
            //callback(null, true);
            db.query(sqlObj.isExistsDataByPartitionName,  function (result) {
                if (result != null && result.length > 0) {
                    log.debug('clearRawDataTask|执行定时清除adm_monitor_raw_data表中的数据|start|%s', partitionName);
                    db.query(sqlObj.createTempTableForRawData,  function (result) {
                        db.query(sqlObj.clearPartitionData,  function (result) {
                            db.query(sqlObj.reWriteDataToRawData,  function (result) {
                                db.query(sqlObj.deleteTmpRawData,  function (result) {
                                    var dateEnd=new Date().getTime();
                                    log.debug('定时清除 '+partitionName+' 分区数据成功开始! 耗时: '+(dateEnd-dateStart));
                                    callback(result);
                                });
                            });
                        });
                    });
                } else {
                    log.debug('clearRawDataTask|无需删除分区数据：|%s', partitionName);
                    callback(new Error('无需删除' + partitionName + '分区数据！'));
                }
            });
        } else {
            callback(false);
        }
    });
};
/**
 * 删除日志表
 * @param config
 * @constructor
 */
exports.ClearOrderLogDataTask=function(config){
    var sql="DELETE FROM icu_patient_medical_orders_log WHERE EXTRACT_TIME<=?";
    var endDate = new Date();
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    var str=endDate.Format("yyyy-MM-dd hh:mm:ss");
    db.query(sql,[str],  function (result) {

    });
}
/**
 * 统一删除数据表
 * @param config
 */
exports.commonClearDataTask=function(config){
    var me = this;
    me.ClearOrderLogDataTask(config);
    me.clearRawDataTask(config,function() {});
}
/**
 * 定时清除adm_monitor_raw_data表中的数据定时器
 */
exports.clearRawDataTaskTimmer = function(config,cb) {
    var me = this;
    var startDate = new Date();
    startDate.setMilliseconds(0);
    var endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(20);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    log.debug('clearRawDataTaskTimmer|延迟5秒，已启动定时任务');
    setTimeout(function() {
        me.commonClearDataTask(config);

        //开启定时任务
        setInterval(function() {
            try {
                var date = new Date();
                if (date.getHours() === 23) { //晚上23点
                    me.commonClearDataTask(config);
                }
            } catch (e) {
                log.error('clearRawDataTaskTimmer|启动定时任务|%s', e.message);
            }
        }, 24 * 60 * 60 * 1000);

    }, (endDate.getTime() - startDate.getTime()));
};
/**
 * 自动创建分区的Task
 * @param  {Function} cb   回调函数
 */
exports.createRawDatePartitionTask = function(config,tableName,partitionName,callback) {
    var me = this;
    var tableSchema = config.db.DATABASE;
    //查询分区是否存在SQL
    var querySql = "SELECT * FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND PARTITION_NAME = ?";

    //当前月的
    var partitionInfo1 = me.getPartitionInfo(0,partitionName);
    var strDate1 = partitionInfo1.strDate;
    var partitionName1 = partitionInfo1.partitionName;
    var createSql1 = "ALTER TABLE "+tableName+" ADD PARTITION( PARTITION " + partitionName1 + " VALUES LESS THAN ('" + strDate1 + "') ENGINE = INNODB)";
    //下一月的
    var partitionInfo2 = me.getPartitionInfo(1,partitionName);
    var strDate2 = partitionInfo2.strDate;
    var partitionName2 = partitionInfo2.partitionName;
    var createSql2 = "ALTER TABLE "+tableName+" ADD PARTITION( PARTITION " + partitionName2 + " VALUES LESS THAN ('" + strDate2 + "') ENGINE = INNODB)";
    db.query(querySql, [tableSchema,tableName, partitionName1], function (result) {
        if (result != null && result.length > 0) {
            log.debug('createRawDatePartitionTask|当月分区已经存在，无需要创建，partitionName|%s|%s', partitionName1, strDate1);
        } else {
            db.query(createSql1, [], function( result) {
                callback( result);
            });
        }
    });
    setTimeout(function() {
    db.query(querySql, [tableSchema,tableName, partitionName2], function (result) {
        if (result != null && result.length > 0) {
            log.debug('createRawDatePartitionTask|下一月分区已经存在，无需要创建，partitionName|%s|%s', partitionName2, strDate2);
        } else {
            db.query(createSql2, [], function(result) {
                callback(result);
            });
        }
    })},3000);
};
exports.commonExceutePartitionTask=function(config){
    var tableName_raw="icu_device_raw_data";
    var partitionName_raw="P_RAW_DATA";

    var tableName_care="icu_care_records";
    var partitionName_care="p_care_records";
    this.createRawDatePartitionTask(config,tableName_raw,partitionName_raw,function(r){

    });
    this.createRawDatePartitionTask(config,tableName_care,partitionName_care,function(rs){});
}

/**
 * 自动创建分区的Timmer
 * @param cb
 */
exports.createRawDatePartitionTaskTimmer = function(config,cb) {
    var me = this;
    var startDate = new Date();
    startDate.setMilliseconds(0);
    var endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    log.debug('createRawDatePartitionTaskTimmer|延迟5秒，已启动定时任务');
    //对于新部署的项目，程序启动时立即创建分区
    me.commonExceutePartitionTask(config);
    setTimeout(function() {
        me.commonExceutePartitionTask(config);
        //开启定时任务
        setInterval(function() {
            try {
                var date = new Date();
                if (date.getHours() === 23) { //晚上23点
                    me.commonExceutePartitionTask(config);
                }
            } catch (e) {
                log.error('createRawDatePartitionTaskTimmer|启动定时任务|%s', e.message);
            }
        }, 24 * 60 * 60 * 1000);

    }, (endDate.getTime() - startDate.getTime()));
};
/**
 * 获取分区名称
 * @param  {int} monthFlag 0：标示当月；>0:向后增加几个月；<0:向前减少几个月；
 * @return {[type]}           [description]
 */
exports.getPartitionInfo = function(monthFlag,partitionNameStr) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = ""; //格式：2014-12-01
    var partitionName="P_RAW_DATA";
    if(partitionNameStr){
        partitionName=partitionNameStr;
    }
    //var partitionName = "P_RAW_DATA"; //格式：P_RAW_DATA201409

    var year1 = null, //计算后的年份
        year2 = null, //计算后的年份+1
        month1 = null, //计算后的月份
        month2 = null; //计算后的月份+1

    year1 = year + parseInt((month + monthFlag) / 12);
    month1 = (month + monthFlag) % 12;
    if (month1 === 0) {
        year1 -= 1;
        month1 = 12;
    } else if (month1 < 0) {
        year1 -= 1;
        month1 += 12;
    }

    if ((month1 + 1) > 12) {
        year2 = year1 + parseInt((month1 + 1) / 12);
        month2 = (month1 + 1) % 12;
    } else {
        year2 = year1;
        month2 = month1 + 1;
    }

    if (month1 < 10) {
        month1 = "0" + month1;
    } else {
        month1 = "" + month1;
    }
    if (month2 < 10) {
        month2 = "0" + month2;
    } else {
        month2 = "" + month2;
    }

    partitionName += year1 + month1;
    strDate += year2 + "-" + month2 + "-01";

    return {
        partitionName: partitionName,
        strDate: strDate
    };
};