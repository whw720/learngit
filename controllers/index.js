/**
 * 功能说明: 首页
 * @author: 王小伟
 */
exports.index = function(req, res) {
    var baseUrl=req.protocol + '://' + req.get('Host');
	res.render('index', {
		title: '阳光优乐杯报名系统',
        userInfo:req.session.userInfo,
        webRoot : baseUrl
	});
};