/**
 * 功能说明: 多进程运行JS
 * @author: 王小伟
 */
var cluster = require('cluster');
var http = require('http');
var net = require('net');
var launcher = require('../../models/socketio/launcher'),
    helper = require('../../models/cache/helper-code'),
    routeCodes = require('../../models/cache/drugs-route-code'),
    log = require('log4js').getLogger('MultiProcessRun');
var hardwareDataController = require('../hardware/hardware-data-controller');
var recordDataController = require('../hardware/record-data-controller');

var socketPort = 4444;

function hash(ip, seed) {
    var hash = ip.reduce(function(r, num) {
        r += parseInt(num, 10);
        r %= 2147483648;
        r += (r << 10)
        r %= 2147483648;
        r ^= r >> 6;
        return r;
    }, seed);

    hash += hash << 3;
    hash %= 2147483648;
    hash ^= hash >> 11;
    hash += hash << 15;
    hash %= 2147483648;

    return hash >>> 0;
}

exports.run = function(app, clusterNum) {
    var workers = [];

    if (cluster.isMaster) {
        console.log("主进程启动...");

        for (var i = 0; i < clusterNum; i++) {
            workers[i] = cluster.fork();
        }
        cluster.on('listening',function(worker,address){
            console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
        });
        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });

        var seed = ~~(Math.random() * 1e9);
        server = net.createServer(function(c) {
            var worker,
                ipHash = hash((c.remoteAddress || '').split(/\./g), seed);

            worker = workers[ipHash % workers.length];
            worker.send('sticky-session:connection', c);
        }).listen(socketPort, function() {
            console.log('主进程启动监听' + socketPort);
        });

        //主进程执行
        var mainProcess = require("./MainProcess");
        //主进程接收消息
        Object.keys(cluster.workers).forEach(function (id) {
            cluster.workers[id].on('message', function (msg) {
                //硬件取数全局变量更改
                if (msg.cmd && msg.cmd == 'linkAdaperChange') {
                    var hardwareDataController = require('../hardware/hardware-data-controller');
                    hardwareDataController.linkAdaperChangeCount++;
                //护理记录全局变量更改
                } else if (msg.cmd && msg.cmd == 'patientChange') {
                    var recordDataController = require('../hardware/record-data-controller');
                    recordDataController.patientChangeCount++;
                }
            });
        });
        //主进程发送消息
        setInterval(function () {
            for (var id in cluster.workers) {
                var worker = cluster.workers[id];
                worker.send({name: "adapters", obj: hardwareDataController.adapters});
                worker.send({name: "inDeptPatients", obj: recordDataController.inDeptPatients});
            }
        }, 3000);

    } else {
        //var oldListen = app.listen;
        //app.listen = function listen() {
        //    var lastArg = arguments[arguments.length - 1];
        //
        //    if (typeof lastArg === 'function') lastArg();
        //
        //    return oldListen.call(this, null);
        //};
        var server = app.listen(app.get('port'));
        exports.socketIO = new launcher(server);
        //加载汉字助词码字典表
        helper.load();
        routeCodes.load();

        //子进程接收消息
        process.on('message', function(msg, socket) {
            //适配器同步
            if (msg !== 'sticky-session:connection') {
                if (msg.name=="adapters") {
                    hardwareDataController.adapters = msg.obj;
                } else if (msg.name=="inDeptPatients") {
                    recordDataController.inDeptPatients = msg.obj;
                }
            //socket连接
            } else {
                server.emit('connection', socket);
            }
        });

    }
}

//硬件取数变动
exports.linkAdaperChange = function() {
    if (cluster.isWorker) {
        process.send({cmd: 'linkAdaperChange'})
    }
}

//护理记录取数变动
exports.patientChange = function() {
    if (cluster.isWorker) {
        process.send({cmd: 'patientChange'})
    }
}