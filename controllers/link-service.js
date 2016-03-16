/**
 * 功能说明: 客户端服务
 * @author: 王小伟
 */
var log4js = require('log4js'),
	querystring = require('querystring'),
	buffer = require('buffer'),
	url = require('url'),
	config = require('../config/lancet-config'),
	tool = require('../lib/tools'),
	uuid = require('../lib/uuid'),
	rawDao = require('../models/dao/sys/monitor-raw-data'),
	adapterDao = require('../models/dao/sys/adapter'),
	linkDao = require('../models/dao/sys/link'),
	protocol = require('../models/adapter/protocol/handler'),
	lancet = require('../lancet-icu'),
	adapterTaskQueue = require('../models/cache/adapter-task-queue'),
	saveInterval = 5000, //保存及向前台发送数据的间隔时间
	log = log4js.getLogger('link-service');

exports.reciveRawData = function(req, res) {
	var aid = req.params['id'];
	if (tool.isEmpty(aid)) {
		res.json({
			success: false,
			errors: '适配器编号不能为空！'
		});
		return;
	}
	//返回接收成功
	res.sendResult();

	var task = adapterTaskQueue.getAdapterTaskById(aid);
	if (tool.isEmpty(task)) {
		log.error('保存采集数据失败：适配器任务不存在或已停止，adapterId:', aid);
		return;
	}
	if (tool.isEmpty(task.surgeryId)) {
		log.error('保存采集数据失败：手术id为空。adapterId:', aid);
		return;
	}

	req.on('data', function(data) {
		if (!tool.isEmpty(task.items)) {
			var curDateTime = (new Date()).getTime();
			if (task.lastSaveDate === null || (curDateTime - task.lastSaveDate) >= task.interval) {
				parseAndSaveDate(task, data);
				task.lastSaveDate = curDateTime;
			}
		}
	});
};

function parseAndSaveDate(adapter, data) {
	//解析数据
	var items = protocol.getItems(adapter, data);
	//保存及向前台发送数据  5秒一次
	if (items && items.length !== 0) {
		rawDao.addBatch(items, function(err) {
			if (!err) {
				log.debug('采集数据保存成功，adapterId:%s，surgeryId:%s', adapter.adapterId, adapter.surgeryId);

				//监测-有创无创血压推送处理
				var deleteItem = [];
				for (var i = 0; i < items.length; i++) {
					var curr = items[i];
					for (var j = items.length - 1; j > i; j--) {
						//如果当前采集项目中同时存在无创和有创，则去除有创

						if (curr.ITEM_CODE === '3b3204f0228711e39af63734e7c644cb' && items[j].ITEM_CODE === '3b9f1ea0228711e394d199dd5901706f') {
							deleteItem.push(items[j]);
						} else if (items[j].ITEM_CODE === '3b9f1ea0228711e394d199dd5901706f') {
							items[j].ITEM_CODE = '3b3204f0228711e39af63734e7c644cb';
						}
						if (curr.ITEM_CODE === '3b56a3f0228711e39451919cea0878ad' && items[j].ITEM_CODE === '3bc32160228711e38216691e3354258e') {
							deleteItem.push(items[j]);
						} else if (items[j].ITEM_CODE === '3bc32160228711e38216691e3354258e') {
							items[j].ITEM_CODE = '3b56a3f0228711e39451919cea0878ad';
						}
					}
				}
				var newItems = [];
				if (deleteItem.length > 0) {
					for (var i = 0; i < items.length; i++) {
						for (var j = 0; j < deleteItem.length; j++) {
							if (items[i].ITEM_CODE != deleteItem[j].ITEM_CODE) {
								newItems.push(items[i]);
							}
						}
					}
				}
				if (newItems.length > 0) {
					items = newItems;
				}
				//向前台发送采集到的数据
				for (var i = 0; i < items.length; i++) {
					var rec = items[i];
					lancet.socketIO.send(getItemAlias(rec.ITEM_CODE, adapter.items), {
						ID: rec.ID,
						ITEM_CODE: rec.ITEM_CODE,
						VALUE: rec.VALUE,
						TIME: rec.COLLECT_TIME.getTime()
					});
				}
			} else {
				log.error('保存采集数据失败：' + err.stack);
			}
		});
	}
}

function getItemAlias(id, ids) {
	for (var i = 0; i < ids.length; i++) {
		if (id == ids[i].MONITOR_ITEM_CODE) {
			return ids[i].ALIAS;
		}
	}
	return '';
}

exports.register = function(req, res) {
	if (req.body.data) {
		var link = JSON.parse(req.body.data);
		log.debug('register data:\r\n%j', link);
		var linkId = uuid.generate();
		//保存客户端信息到数据库

		res.sendResult(linkId);
	} else {
		log.debug('register failure:');
		res.json({
			success: false,
			errors: '注册信息不能为空。'
		});
	}
};

//------------------------客户端接口--------------
exports.startAdapter = function(req, res) {
	var aid = req.params.aid;
	var sid = req.params.sid;
	if (aid === undefined || aid === '' || sid === undefined || sid === '') {
		res.json({
			success: false,
			errors: '适配器编号或手术编号不能为空！'
		});
		return;
	}

	adapterDao.getAdapterAndItemsByID(aid, function(adapter) {
		if (adapter === null) {
			res.json({
				success: false,
				errors: '适配器不存在！'
			});
			return;
		}
		if (!adapter.LINK_URL) {
			res.json({
				success: false,
				errors: '客户端访问地址未设置！'
			});
			return;
		}
		var linkUrl = url.parse(adapter.LINK_URL + 'adapter');

		var setting = JSON.parse(adapter.CHANNEL_SETTING);
		//校验CHANNEL_SETTING内容是否完整


		setting.interval = adapter.RECEIVING_INTERVAL;


		var sendData = {
			id: adapter.ID,
			type: adapter.TYPE,
			channel: adapter.CHANNEL,
			protocol: adapter.PROTOCOL,
			setting: JSON.stringify(setting),
			items: JSON.stringify(adapter.items)
		};
		// log.info('开始启动适配器，发送数据为：%j', sendData);
		sendData = querystring.stringify(sendData);
		tool.sendHTTPData({
			hostname: linkUrl.hostname,
			port: linkUrl.port,
			path: linkUrl.path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		}, sendData, function(err, response) {
			if (err) {
				log.error('启动适配器失败，http请求失败：客户端未启动或运行异常，错误为:\r\n%s', err.stack);
				res.json({
					success: false,
					errors: err.message
				});
			} else {
				var result = JSON.parse(response);
				if (result.success === true) {
					log.debug('启动适配器成功。');
					res.sendResult(result.data);
					//加入适配器任务队列
					adapterTaskQueue.addAdapterTask({
						linkUrl: adapter.LINK_URL,
						linkId: adapter.LINK_ID,
						surgeryId: sid,
						adapterId: aid,
						protocol: adapter.PROTOCOL,
						lastSaveDate: null,
						interval: setting.interval,
						items: adapter.items
					});
				} else {
					log.error('启动适配器失败，服务器返回错误消息:%s', result.errors);
					res.json({
						success: false,
						errors: result.errors
					});
				}
			}
		});
	});
};

exports.stopAdapter = function(req, res) {
	var aid = req.params.aid;
	if (tool.isEmpty(aid)) {
		res.json({
			success: false,
			errors: '适配器编号编号不能为空！'
		});
		return;
	}
	var task = adapterTaskQueue.getAdapterTaskById(aid);
	if (tool.isEmpty(task)) {
		res.sendResult();
		return;
	} else {
		var linkUrl = url.parse(task.linkUrl + '/adapter/stop/' + aid);
		tool.sendHTTPData({
			hostname: linkUrl.hostname,
			port: linkUrl.port,
			path: linkUrl.path,
			method: 'DELETE',
			headers: {
				'Content-Type': 'text/html',
			}
		}, null, function(err, response) {
			if (err) {
				log.error('向客户端发送停止适配器请求异常:%s', err);
				res.json({
					success: false,
					errors: err.message
				});
			} else {
				var result = JSON.parse(response);
				if (result.success === true) {
					log.debug('停止适配器成功，adapterId:%s', aid);
					res.sendResult();
					//删除适配器任务
					adapterTaskQueue.removeAdapterTask(aid);
				} else {
					log.error('停止适配器失败:%s', result.errors);
					res.json({
						success: false,
						errors: result.errors
					});
				}
			}
		});
	}
	/*adapterDao.getClientURLByID(aid, function(clientUrl) {
		if (url.length === 0) {
			res.json({
				success: false,
				errors: '客户端访问地址未设置！'
			});
			return;
		}
		
	});*/
};

exports.clientTest = function(req, res) {
	var ids = req.params['ids'];
	if (!ids || ids === '') {
		res.json({
			success: false,
			errors: '客户端编号不能为空！'
		});
		return;
	}
	linkDao.listByIds(ids.split(','), function(result) {
		var state = [];
		for (var i = 0; i < result.length; i++) {
			var rec = result[i];
			var linkUrl = url.parse(rec.URL + 'test');
			var id = rec.ID;
			(function(id) {
				tool.sendHTTPData({
					hostname: linkUrl.hostname,
					port: linkUrl.port,
					path: linkUrl.path,
					method: 'GET'
				}, null, function(err, response) {

					if (err) {
						state.push({
							ID: id,
							STATE: false
						});
					} else {
						var resultObj = JSON.parse(response);
						if (resultObj.success === true) {
							state.push({
								ID: id,
								STATE: true
							});
						} else {
							state.push({
								ID: id,
								STATE: false
							});
						}
					}
					if (state.length == result.length) {
						res.sendResult(state);
					}
				});
			})(id);
		}
	});
};

exports.getAdapterState = function(req, res) {
	var id = req.params['id'];
	if (!id || id === '') {
		res.json({
			success: false,
			errors: '适配器编号不能为空！'
		});
		return;
	}

	var task = adapterTaskQueue.getAdapterTaskById(id);
	if (tool.isEmpty(task)) {
		res.sendResult('disabled');
		return;
	} else {
		var linkUrl = url.parse(task.linkUrl + '/adapter/state/' + id);
		tool.sendHTTPData({
			hostname: linkUrl.hostname,
			port: linkUrl.port,
			path: linkUrl.path,
			method: 'GET'
		}, null, function(err, response) {
			if (err) {
				log.error('发送查询适配器状态请求异常:%s', err);
				res.sendResult('disabled');
			} else {
				var result = JSON.parse(response);
				if (result.success === true) {
					res.sendResult(result.data);
				} else {
					log.error('查询适配器状态失败:%s', result.errors);
					res.json({
						success: false,
						errors: result.errors
					});
				}
			}
		});
	}

	/*adapterDao.getClientURLByID(id, function(clientUrl) {
		if (url.length === 0) {
			res.json({
				success: false,
				errors: '客户端访问地址未设置！'
			});
			return;
		}
		
	});*/
};