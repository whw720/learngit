var controllers = require('./controllers'),
   // login   = require('./controllers/login-controller'),
    webchat = require('./controllers/webchat-controller');
module.exports = function (app) {

	var i=0;
    //首页
    app.get('/',function(req,res){
	res.render('hello',{
		title:'welcome here'+(i++)
	});
	});
    app.get('/weixin', controllers.weixin);
    app.get('/get_access_toker',webchat.getAccessToken);
    app.post('/weixin',webchat.receiveMsg);
}
