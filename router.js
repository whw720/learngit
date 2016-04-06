var controllers = require('./controllers'),
   // login   = require('./controllers/login-controller'),
    webchat = require('./controllers/webchat-controller'),
	weather = require('./controllers/weatherInfo-controller');
module.exports = function (app) {

    //首页
    app.get('/',function(req,res){
	res.render('hello',{
		title:'welcome here'
	});
	});
    app.get('/weixin', controllers.weixin);
    app.get('/get_access_toker',webchat.getAccessToken);
    app.post('/weixin',webchat.receiveMsg);

	app.get('/weather',weather.getWeather);
	app.get('/test',webchat.test);
}
