/**
 * 功能说明: 监视Socket模拟器，定时返回指定类型的模拟数据（正常值随机数）
 * @author: 王小伟
 */
var util = require('util');
var async = require('async');
var db = require('../../db');
var tools = require('../../lib/tools');
var EventEmitter = require('events').EventEmitter;

function Monitor(opts) {
	this.opts = opts;
	var self = this,
		emitter = (opts.emitter != undefined ? opts.emitter : self);
	//立即触发启动事件
	setTimeout(function() {
		emitter.emit('start', 'Monitor started.'); //派发监护启动事件
	}, 0);

	async.waterfall([
		function(callback) {
			//从数据库中读取监测项目
			loadItems(opts.items, function(results) {
				callback(null, results);
			});
		},
		function(callback) {
			//将读取到的监测项目派发事件
			emitEvent(emitter, callback, opts);
		}
	]);

	//发送时钟（不带秒数）
	this.timeTask = setInterval(function() {
		emitter.emit('now-time', {
			ID: null,
			ITEM_CODE: null,
			VALUE: tools.getTimeString(true),
			TIME: (new Date()).getTime()
		});
	}, opts.timeout);
}

//读取数据库中的监测项目
function loadItems(items, callback) {
	var sql = 'SELECT CODE, ALIAS, NORMAL_RANGE FROM DIC_MONITOR_ITEM WHERE CODE IN(' + items + ')';
	db.query(sql, null, callback);
}

//派发监测事件
function emitEvent(monitor, results, opts) {
	var getRandomValue = function(range) {
		var r = range.split('~'),
			s = parseFloat((r[0] != undefined ? r[0] : 10)),
			e = parseFloat((r[1] != undefined ? r[1] : 50));
		return parseFloat(Math.random() * (e - s) + s);
	};

	opts.task = setInterval(function() {
		for (var i = 0; i < results.length; i++) {
			monitor.emit(results[i].ALIAS, {
				ID: 'simulator',
				ITEM_CODE: results[i].CODE,
				VALUE: getRandomValue(results[i].NORMAL_RANGE),
				TIME: (new Date()).getTime()
			});
		}
	}, opts.timeout);
}

util.inherits(Monitor, EventEmitter);

module.exports = Monitor;