/**
 * 功能说明: 全局变量，用于Nginx多进程部署
 * @author: 王小伟
 */
var sysVariableDao = require('../../models/dao/cluster/sys-variable-dao');
var config = require('../../config/lancet-config');

//判断是否是isNginx模式
var judgeIsNginx = function() {
    var isNginx = false;
    if (typeof(config.isNginx)!="undefined") {
        isNginx = config.isNginx;
    }
    return isNginx;
}

exports.judgeIsNginx = judgeIsNginx;

//硬件设备变化计数
exports.linkAdaperChangeCountAdd = function(addNum) {
    if (judgeIsNginx()==true) {
        sysVariableDao.variableAdd("linkAdaperChangeCount", addNum, function(){});
    }
}

//检索硬件设备变化计数
exports.findLinkAdaperChangeCount = function(callback) {
    if (judgeIsNginx()==true) {
        sysVariableDao.findVariable("linkAdaperChangeCount", function(result, errMessage){
            var linkAdaperChangeCount = 0;
            if (result.length>0) {
                linkAdaperChangeCount = parseInt(result[0].VALUE);
            }
            callback(linkAdaperChangeCount);
        });
    } else {
        callback(null);
    }
}

//患者变化计数
exports.patientChangeCountAdd = function(addNum) {
    if (judgeIsNginx()==true) {
        sysVariableDao.variableAdd("patientChangeCount", addNum, function(){});
    }
}

//检索患者变化计数
exports.findPatientChangeCount = function(callback) {
    if (judgeIsNginx()==true) {
        sysVariableDao.findVariable("patientChangeCount", function(result, errMessage){
            var patientChangeCount = 0;
            if (result.length>0) {
                patientChangeCount = parseInt(result[0].VALUE);
            }
            callback(patientChangeCount);
        });
    } else {
        callback(null);
    }
}