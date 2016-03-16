/**
 * 功能说明: 适配器
 * @author: 王小伟
 */
var db = require('../../../db'),
	uuid = require('../../../lib/uuid');

function add(params, callback) {
	
	var adapter = [{
		ID: params.ID,
		LINK_ID: params.LINK_ID,
		TYPE: params.TYPE,
		NAME: params.NAME,
		MODEL: params.MODEL,
		LOCATION_ID: params.ICU_ROOM,
		RAW_DATA_CODE: '',
		MANUFACTURER: params.MANUFACTURER,
		PRODUCT_TYPE: params.PRODUCT_TYPE,
		DESCRIPTION: params.DESCRIPTION,
		CHANNEL: params.CHANNEL,
		CHANNEL_SETTING: params.CHANNEL_SETTING,
		PROTOCOL: params.PROTOCOL,
		RECEIVING_INTERVAL: params.RECEIVING_INTERVAL
	}];
	var sql = 'INSERT INTO sys_adapter SET ?';
	db.query(sql, adapter, callback);
}

function edit(params, callback) {
	var id = params.ID;

	var adapter = [{
			TYPE: params.TYPE,
			NAME: params.NAME,
			MODEL: params.MODEL,
        LOCATION_ID: params.ICU_ROOM || params.LOCATION_ID,
			MANUFACTURER: params.MANUFACTURER,
			PRODUCT_TYPE: params.PRODUCT_TYPE,
			DESCRIPTION: params.DESCRIPTION,
			CHANNEL: params.CHANNEL,
			CHANNEL_SETTING: params.CHANNEL_SETTING,
			PROTOCOL: params.PROTOCOL,
			RECEIVING_INTERVAL: params.RECEIVING_INTERVAL
		},
		params.ID
	];
	var sql = 'UPDATE sys_adapter SET ? WHERE ID=?';
	db.query(sql, adapter, callback);
}

function getAdapter(params, callback) {
	var sql = 'SELECT sa.ID,sa.LINK_ID,sa.MANUFACTURER,sa.PRODUCT_TYPE,sa.TYPE,sa.MODEL,sa.NAME,sa.LOCATION_ID,sa.RAW_DATA_CODE,sa.CHANNEL,dic_channel.NAME as CHANNELNAME,sa.CHANNEL_SETTING,sa.PROTOCOL,dic_pro.NAME AS PROTOCOLNAME,sa.RECEIVING_INTERVAL,sa.DESCRIPTION,sa.SORT_NUMBER,sa.VALID,si.NAME AS ICU_ROOM FROM sys_adapter sa LEFT JOIN sys_departments si ON sa.LOCATION_ID = si.ID LEFT JOIN dic_protocol dic_pro ON sa.PROTOCOL = dic_pro.code LEFT JOIN dic_channel dic_channel ON sa.CHANNEL = dic_channel.code WHERE sa.LINK_ID =? AND sa.VALID = 1';
	db.query(sql, params, function(result) {
		for (var i = 0; i < result.length; i++) {
			result[i].TYPE = getTypeName(result[i].TYPE);
			//result[i].MODEL = getTypeName(result[i].MODEL);
		}
		callback(result);
	});
}


// 根据type获取对应的值
function getTypeName(type) {
	var name;
	if (type === 'SOFTWARE') {
		name = '软件';
	} else if (type === 'HARDWARE') {
		name = '硬件';
	} else if (type === 'HIS') {
		name = '医院管理系统';
	} else if (type === 'EMR') {
		name = '电子病历系统';
	} else if (type === 'LIS') {
		name = '检验系统';
	} else if (type === 'PACS') {
		name = '影像系统';
	} else if (type === 'AIMS') {
		name = '手麻系统';
	} else if (type === 'MONITOR') {
		name = '监护仪';
	} else if (type === 'ANESTHESIA') {
		name = '麻醉机';
	} else if (type === 'VENTILATOR') {
		name = '呼吸机';
	} else if (type === 'INFUSION') {
		name = '输液泵';
	}
	return name;
}

function getAdaptersByClient(params, callback) {

	var sql = 'SELECT * FROM sys_adapter WHERE LINK_ID=? AND VALID = 1';
	db.query(sql, params, callback);
}

function getAdaptersByID(params, callback) {

	var sql = 'SELECT * FROM sys_adapter WHERE ID = ?';
	db.query(sql, params, callback);
}

exports.listAdaptersByScheduleID = function(id, callback) {

	var sql = 'SELECT d.* FROM sys_adapter d LEFT JOIN aam_surgery_schedule a ON d.SURGERY_ROOM_ID = a.SURGERY_ROOM_ID WHERE a.ID =?';
	var sql_items = 'SELECT am.ADAPTER_ID, m.CATEGORY,m.CODE as ITEM_CODE,m.ALIAS, m.UNIT, m.NORMAL_RANGE, m.EFFECTIVE_RANGE FROM sys_adapter_monitor_item am LEFT JOIN dic_monitor_item m ON am.MONITOR_ITEM_CODE=m.CODE WHERE am.ADAPTER_ID IN(?) AND m.VALID=1 ORDER BY m.IS_COMMON DESC,m.SORT_NUMBER ASC';
	db.query(sql, [id], function(adapters) {
		var result = {
			adapters: adapters,
			items: []
		};
		if (adapters.length > 0) {
			var ids = [];
			for (var i = 0; i < adapters.length; i++) {
				ids.push(adapters[i].ID);
			}
			db.query(sql_items, [ids], function(items) {
				//从option表中查询图例代码和颜色并组合到items中：DISPLAY_COLOR, LEGEND_CODE,
				var sql_options = 'SELECT TYPE,CASE NAME WHEN "颜色" THEN VALUE ELSE NULL END DISPLAY_COLOR, MAX(CASE NAME WHEN "图示" THEN VALUE ELSE NULL END ) LEGEND_CODE, MAX(CASE NAME WHEN "修正值" THEN VALUE ELSE NULL END ) CORRECTION_VALE FROM sys_options WHERE TYPE IN("脉搏","收缩压","舒张压", "自主呼吸","机械通气","体温") GROUP BY TYPE';
				db.query(sql_options, function(options) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].ITEM_CODE === '2bb062a05b0911e3a6ff7d7c27488ccd') { //脉搏
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '脉搏') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						} else if (items[i].ITEM_CODE === '3b3204f0228711e39af63734e7c644cb') { //收缩压   
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '收缩压') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						} else if (items[i].ITEM_CODE === '3b56a3f0228711e39451919cea0878ad') { //舒张压
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '舒张压') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						} else if (items[i].ITEM_CODE === '395f40c0228711e3b9490ffd380ea44a') { //自主呼吸
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '自主呼吸') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						} else if (items[i].ITEM_CODE === '3a10b670228711e3b7250d6e7183ed4d') { //机械通气
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '机械通气') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						} else if (items[i].ITEM_CODE === '41bab010228711e3a5ee59394fbd88a8') { //体温
							for (var j = 0; j < options.length; j++) {
								if (options[j].TYPE === '体温') {
									items[i].DISPLAY_COLOR = options[j].DISPLAY_COLOR;
									items[i].LEGEND_CODE = options[j].LEGEND_CODE;
									items[i].CORRECTION_VALE = options[j].CORRECTION_VALE; //修正值
								}
							}
						}
					}
					result.items = items;
					callback(result);
				});
			});
		} else {
			callback(result);
		}
	});
};
//没有返回null，有返回adapter对象及所包含的检测项目。
exports.getAdapterAndItemsByID = function(id, callback) {

	var sql = 'SELECT * FROM sys_adapter WHERE ID = ? and VALID=1';
	var sql_items = 'SELECT am.MONITOR_ITEM_CODE, m.THIRD_PARTY_CODE, mi.ALIAS FROM sys_adapter_monitor_item am LEFT JOIN dic_monitor_item_mapping m ON am.MONITOR_ITEM_CODE=m.LANCET_CODE LEFT JOIN dic_monitor_item mi ON am.MONITOR_ITEM_CODE=mi.CODE WHERE am.ADAPTER_ID=? AND m.PROTOCOL_NAME =?';
	var sys_link = 'SELECT URL FROM sys_link WHERE ID = ?';
	db.query(sql, [id], function(adapter) {
		if (adapter.length == 1) {
			var adp = adapter[0];
			db.query(sql_items, [id, adp.PROTOCOL], function(items) {
				if (items.length > 0) {
					adp.items = items;
				}
				db.query(sys_link, [adapter[0].LINK_ID], function(URL) {
					if (URL.length == 1) {
						adp.LINK_URL = URL[0].URL;
					}
					callback(adp);
				});
			});
		} else {
			callback(null);
		}
	});
};

exports.getClientURLByID = function(aid, callback) {

	var sql = 'SELECT c.URL FROM sys_adapter d LEFT JOIN sys_link c ON d.LINK_ID=c.ID WHERE d.ID=?';
	db.query(sql, aid, callback);
};

function list(params, callback) {
	var sql = 'SELECT ID, NAME, MANUFACTURER, PRODUCT_TYPE FROM sys_adapter WHERE VALID=1 ORDER BY NAME';
	db.query(sql, params, callback);
}

function updateAdapter(params, callback) {
	var id = params.ID;
	var link = [{
		VALID: 0
		},
		params.ID
	];
	var sql = 'UPDATE sys_adapter SET ? WHERE ID=?';
	db.query(sql, link, callback);
}
function getAdapterAsBed(params,callback) {
    var sql = "SELECT\n" +
        "  sd.name,\n" +
        "  ib.`BED_NUMBER`\n" +
        "FROM\n" +
        "  icu_bed_adapter ia,\n" +
        "  icu_beds ib,\n" +
        "  `sys_departments` sd\n" +
        "WHERE ib.icu_id = sd.id AND ia.`BED_ID` = ib.`ID`\n" +
        "  AND ia.`ADAPTER_ID` = ?";
    db.query(sql, params.ID, callback);
}


exports.getByCondition = function(params, callback) {
	var host = params['host'];
	var port = params['port'];
	var protocol = params['protocol'];
	var type = params['type'];
	var model = params['model'];
	var sql_params = ['http://' + host + ':' + port + '/'];
	var sql = 'SELECT l.id as linkId,a.id as adapterId, a.PROTOCOL, a.TYPE, a.NAME, a.MODEL, a.DESCRIPTION, a.RECEIVING_INTERVAL,a.CHANNEL_SETTING FROM sys_link l LEFT JOIN sys_adapter a ON a.LINK_ID=l.ID WHERE l.URL=? AND a.VALID=1';

  //  console.log(sql);

    if (protocol != 'all') {
		sql += ' and a.PROTOCOL = ?';
		sql_params.push(protocol);
	}
	if (type != 'all') {
		sql += ' and a.TYPE = ?';
		sql_params.push(type);
	}
	if (model != 'all') {
		sql += ' and a.MODEL = ?';
		sql_params.push(model);
	}
	db.query(sql, sql_params, callback);
}

exports.getAdapterAsBed = getAdapterAsBed;
exports.updateAdapter = updateAdapter;
exports.getAdapter = getAdapter;
exports.add = add;
exports.edit = edit;
exports.list = list;
exports.getAdaptersByID = getAdaptersByID;