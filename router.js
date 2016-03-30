/**
 * 功能说明: 路由配置
 * @author: 王小伟
 */
var controllers = require('./controllers'),
    login   = require('./controllers/login-controller');
/* restful support
 GET     /forums              ->  index
 GET     /forums/new          ->  new
 POST    /forums              ->  create
 GET     /forums/:forum       ->  show
 GET     /forums/:forum/edit  ->  edit
 PUT     /forums/:forum       ->  update
 DELETE  /forums/:forum       ->  destroy
 */

module.exports = function (app) {

    //首页
    app.get('/',function(req,res){
	res.render('hello',{
		title:'welcome here'
		
	});
	});
    app.get('/weixin', controllers.weixin);
    app.get('/startsign', controllers.index);
    app.post('/sign',login.insertStudent);

    app.get('/startupdate', function(req, res) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        res.render('update', {
            title: '阳光优乐杯报名系统',
            userInfo:req.session.userInfo,
            webRoot : baseUrl
        });
    });
    app.post('/update',login.updateStudentInfo);
    app.get('/startupdatePassword', function(req, res) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        res.render('updatePassword', {
            title: '阳光优乐杯报名系统',
            userInfo:req.session.userInfo,
            webRoot : baseUrl
        });
    });
    app.post('/updatePassword',login.updatePassword);

    app.get('/welcome',  function(req, res, next) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        req.session.baseUrl=baseUrl;
        res.render('welcome', { title: '阳光优乐杯报名系统',
            userInfo:req.session.userInfo,
            webRoot:req.session.baseUrl
        });
    });

    app.post('/login',login.login);
    app.get('/logout',login.logout);
    app.get('/startloginother', function(req, res) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        res.render('loginother', {
            title: '阳光优乐杯报名系统',
            webRoot : baseUrl
        });
    });
    app.post('/loginother',login.loginother);

    app.get('/queryscore',login.queryscore);
    app.get('/startloginlog', function(req, res) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        res.render('loginlog', {
            title: '阳光优乐杯报名系统',
            webRoot : baseUrl
        });
    });
    app.post('/queryloginlog',login.queryloginlog);
    app.get('/startstudent', function(req, res) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        res.render('student', {
            title: '阳光优乐杯报名系统',
            webRoot : baseUrl
        });
    });
    app.post('/querystudent',login.querystudent);
    app.all('/index', function(req, res, next) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        req.session.baseUrl=baseUrl;
        res.render('login', { title: '阳光优乐杯报名系统',webRoot:baseUrl });
    });
    app.all('/admin', function(req, res, next) {
        var baseUrl=req.protocol + '://' + req.get('Host');
        req.session.baseUrl=baseUrl;
        res.render('loginadmin', { title: '阳光优乐杯报名系统',webRoot:baseUrl });
    });
    app.post('/loginadmin',login.loginadmin);
    app.get('/upload', function(req, res, next) {
        var baseUrl=req.protocol + '://' + req.get('Host');

        res.render('upload', { title: '阳光优乐杯报名系统',
            adminInfo:req.session.adminInfo,
            webRoot : baseUrl });
    });
    app.post('/uploadFile',login.uploadFile);
    app.get('/download',login.downloadExcel);

};
