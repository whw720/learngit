/**
 * @作者：任中山
 * @功能：错误提示窗口，可以为错误、警告、异常等
 * @time：2010-7-13 14:02:30
 * @注：webRootPath是全局的变量，是web服务的根目录，需要在该js文件执行前定义
 */
// ajax请求完成事件扑捉
Ext.Ajax.on("requestcomplete", function(conn, response, option) {

});

// ajax 异常扑捉
Ext.Ajax.on("requestexception", function(conn, response, option) {
    Ext.MessageBox.alert("错误代码"+response.status, option.url+" "+response.responseText);
});