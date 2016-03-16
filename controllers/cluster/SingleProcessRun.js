/**
 * 功能说明: 单进程运行
 * @author: 王小伟
 */
var config = require('../../config/lancet-config'),
    log = require('log4js').getLogger('SingleProcessRun');

exports.run = function(app) {
    var server = app.listen(app.get('port'), function(req, rsp) {
        log.debug('单进程服务端启动成功，端口：%d', app.get('port'));
        //start socket.io service.
        //exports.socketIO = new launcher(server);

        //主进程执行
        var isMainProcess = true;
        if (typeof(config.isMainProcess)!="undefined") {
            isMainProcess = config.isMainProcess;
        }
        if (isMainProcess==true) {
            var mainProcess = require("./MainProcess");
        }
    });
}
