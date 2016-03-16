/**
 * 功能说明: 主进程要执行的内容，子进程无需重复执行
 * @author: 王小伟
 */
var fs = require('fs'),
    config = require('../../config/lancet-config');

//log文件夹不存在则创建
var hasLogForder = fs.existsSync(__dirname + '/logs');
if (!hasLogForder) {
    fs.mkdirSync(__dirname + '/logs');
}

