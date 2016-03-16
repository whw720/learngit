var http = require('http'),
    util = require('util');
var log = require('log4js').getLogger('lib-tools');
exports.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

exports.getDateString = function(isTime) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + '-' + month + '-' + strDate;
    if (isTime != undefined && isTime == true) {
        currentDate += " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
    return currentDate;
};

exports.getTimeString = function(requireSeconds) {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (hours >= 1 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var currentTime = hours + ':' + minutes;
    if (requireSeconds != undefined && requireSeconds == true) {
        currentTime += ':' + seconds;
    }
    return currentTime;
};

exports.sendHTTPData = function(option, data, cb) {

    var req = http.request(option, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function(chunk) {
            var err = null;
            if (res.statusCode !== 200) {
                err = res.statusCode;
            }
            cb(err, chunk);
        });
    });
    req.setTimeout(5000);
    req.on('error', function(e) {
        cb(e);
    });
    if (data) {
        req.write(data);
    }
    req.end();
};

exports.formatDate = function(date) {
    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    return date.getFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate()) + ' ' +
        f(date.getHours()) + ':' +
        f(date.getMinutes()) + ':' +
        f(date.getSeconds());
};
//把日期字符串转化为日期对象，格式：2013120302351600
exports.ymdhmss2Date = function(date) {

    return new Date(date.substring(0, 4) + '-' +
        date.substring(4, 6) + '-' +
        date.substring(6, 8) + ' ' +
        date.substring(8, 10) + ':' +
        date.substring(10, 12) + ':' +
        date.substring(12, 14) + ':' + date.substring(14, 16));
};
//把日期字符串转化为日期对象，格式：20131121210756
exports.ymdhms2Date = function(date) {

    return new Date(date.substring(0, 4) + '-' +
        date.substring(4, 6) + '-' +
        date.substring(6, 8) + ' ' +
        date.substring(8, 10) + ':' +
        date.substring(10, 12) + ':' +
        date.substring(12, 14));
};

function parseISODate(value) {

    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
    return value;
};

exports.ipStr2Int = function(str) {

    return new Buffer(str.split('.')).readUInt32BE(0);
};

exports.isEmpty = function(value, allowEmptyString) {
    return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (util.isArray(value) && value.length === 0);
};
exports.getVersion = function(bloodtype) {
    var version = null;
    try {
        version = require('../version');
    } catch (e) {
        log.warn('版本文件不存在或文件格式不是json');
    }

    return version;
};
exports.getVersionStr = function(bloodtype) {
    var version = exports.getVersion();
    if (!version) {
        return '';
    }
    return version.major + '.' + version.minor + '.' + version.build;
};