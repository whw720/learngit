/**
 * 功能说明: ICU运行脚本，判断是单进程运行还是多进程运行
 * @author: 王小伟
 */
var config = require('../../config/lancet-config');

exports.run = function(app) {
    var numCPUs = require('os').cpus().length;
    var clusterNum = 1; //子进程数量
    if (typeof(config.clusterNum)!="undefined") {
        clusterNum = config.clusterNum;
        if (clusterNum<1) {
            clusterNum = 1
        } else if (clusterNum>numCPUs) {
            clusterNum = numCPUs;
        }
    }

    if (clusterNum==1) {
        require('./SingleProcessRun').run(app);
    } else {
        require('./MultiProcessRun').run(app, clusterNum);
    }
}