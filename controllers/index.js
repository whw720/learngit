var jsSHA=require('jssha');
exports.index = function(req, res) {
    var baseUrl=req.protocol + '://' + req.get('Host');
	res.render('index', {
		title: '阳光优乐杯报名系统',
        userInfo:req.session.userInfo,
        webRoot : baseUrl
	});
};
exports.weixin = function(req, res) {
	var signature=req.query.signature; //微信加密签名
	var token=whw720school;
	var timestamp=req.query.timestamp; //时间
	var nonce=req.query.nonce;//随机数
	var echostr=req.query.echostr; //随机字符串
	console.log('signature:'+signature+' time:'+timeStamp+' nonce:'+nonce+' echostr:'+echostr);
	var oriArray = new Array();
	oriArray[0] = nonce;
	oriArray[1] = timestamp;
	oriArray[2] = token;
	oriArray.sort();
	var original = oriArray.join('');
	var shaObj = new jsSHA(original, 'TEXT');
	var scyptoString=shaObj.getHash('SHA-1', 'HEX'); 
	if(signature == scyptoString){
 	//验证成功
	 res.end(echostr);  
	} else {
	 //  //验证失败
	 	 res.sendResult('fail');
	    }
}
