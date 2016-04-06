/**
 * 功能说明: 启动JS
 */
var express = require('express'),
	path = require('path'),
	ejs = require('ejs'),
	resource = require('express-resource'),
	router = require('./router'),
	fs=require('fs'),
	app = express(),
	log4js = require('log4js'),
    config = require('./config/learngit-config');

//指定配置文件
log4js.configure(__dirname + '/config/log4js.json', {
	cwd: __dirname
});
var log = log4js.getLogger('learngit');
//定义json格式化的时候处理日期类型
Date.prototype.toJSON = function(key) {
	function f(n) {
		return n < 10 ? '0' + n : n;
	}
	return this.getFullYear() + '-' +
		f(this.getMonth() + 1) + '-' +
		f(this.getDate()) + ' ' +
		f(this.getHours()) + ':' +
		f(this.getMinutes()) + ':' +
		f(this.getSeconds());
};

//response增加通用错误的返回方法
app.response.sendErrorResult = function(data) {
    if (!data) {
        this.json({
            success: false
        });
    } else {
        this.json({
            success: false,
            data: data
        });
    }
};

//response增加通用的返回方法
app.response.sendResult = function(data) {
	if (!data) {
		this.json({
			success: true
		});
	} else {
		this.json({
			success: true,
			data: data
		});
	}
};

//返回结果对象，但不提交立刻输出，用于增加属性
app.response.getSendObject = function(data) {
    if (!data) {
        return {
            success: true
        };
    } else {
        return {
            success: true,
            data: data
        };
    }
};

//直接输出json对象
app.response.sendResultJson = function(obj) {
    this.json(obj);
}
//端口号
var port = 4000;
if (config.port) {
    port = config.port;
}
app.set('port', process.env.PORT || port);
//gzip支持
app.use(express.compress());
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon(__dirname + '/public/128.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname + "/excel")));
app.use(express.bodyParser({ uploadDir: "../public/upload"}));
app.use(express.methodOverride());
app.use(express.cookieParser('school'));
app.use(express.session());

//异常处理
app.use(require('express-domain-middleware'));
app.use(app.router);
app.use(function errorHandler(err, req, res, next) {
    console.log('请求异常 %s %s', req.method, req.url);
    console.log(err);
    res.send(500, "系统内部异常!");
    if(err.domain) {
        //you should think about gracefully stopping & respawning your server
        //since an unhandled error might put your application into an unknown state
    }
});

//路由定义
router(app);

app.use(function(err, req, res, next) {
	if (~err.message.indexOf('not found')) return next();
	log.error(err.stack);
	res.json({
		sucess: false,
		errors: err.message
	});
});

app.use(function(req, res, next) {
	res.status(404).render('404', {
		url: req.originalUrl
	});
});

process.on('uncaughtException', function(err) {
	log.error('uncaughtException: \r\n' + err.stack);
});

//主程序启动
var server = app.listen(app.get('port'), function(req, rsp) {
	log.debug('服务端启动成功，端口：%d', app.get('port'));
	//start socket.io service.
	//exports.socketIO = new launcher(server);

	//主进程执行
	var isMainProcess = true;
	if (typeof(config.isMainProcess)!="undefined") {
		isMainProcess = config.isMainProcess;
	}
	if (isMainProcess==true) {
		var hasLogForder = fs.existsSync(__dirname + '/logs');
		if (!hasLogForder) {
			fs.mkdirSync(__dirname + '/logs');
		}
	}
});
/**
 * Date对象格式化
 */
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format= function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(s,i){
        return args[i];
    });
}