var appid = "wx697f2616c2fb16db", password = "3a1b0ee329d13e8d546c0320a35924a9";
var xml = require('node-xml'),
    weather=require('./weatherInfo-controller');
exports.getAccessToken = function (req, res) {

}
exports.receiveMsg = function (req, res) {
    var post_data = "";
    req.on('data', function (data) {
        post_data = data;
    });
    req.on('end', function () {
        parseXML(post_data.toString('utf-8', 0, post_data.length), function (msg) {
            sendMsg(msg,function(receiveMsg){
                res.end(receiveMsg);
            });
        });

    });
}
function test() {
    var str = " <xml>" +
        "<ToUserName><![CDATA[toUser]]></ToUserName>" +
        "<FromUserName><![CDATA[fromUser]]></FromUserName>" +
        "<CreateTime>1348831860</CreateTime>" +
        " <MsgType><![CDATA[text]]></MsgType>" +
        "<Content><![CDATA[天气 郑州]]></Content>" +
        " <MsgId>1234567890123456</MsgId>" +
        " </xml>";
    parseXML(str, function (msg) {
        sendMsg(msg,function(receiveMsg){
            res.end(receiveMsg);
        });
    });
}
//被动接收消息后发送给用户消息
function sendMsg(rece,callback) {
    var msg = "";
    console.log('00000000000000000000000');
    console.log(rece);
    if (rece.MsgType == "text") {
        console.log('1111111111111111111');
        if(rece.Content.toString().indexOf('天气')==0){
            console.log('2222222222222222222');
            var city=rece.Content.toString().split(' ');
            weather.getWeatherInfo(city[1],function(info){
                console.log('333333333333333');
                callback(packMsgText(info,rece));
            });
        }else{
            msg = "谢谢关注,目前本微信仅支持天气功能，请尝试输入'天气'" ;
            callback(packMsgText(msg,rece));
        }
    }
}
function packMsgText(content,rece){
    var CreateTime = parseInt(new Date().getTime() / 1000);
    var sendMessage = '<xml> <ToUserName><![CDATA[' + rece.FromUserName + ']]></ToUserName><FromUserName><![CDATA[' + rece.ToUserName + ']]></FromUserName>' +
        '<CreateTime>' + CreateTime + '</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[' + content + ']]></Content></xml>';
    return sendMessage;
}
function parseXML(xmlstr, callback) {
    // 定义解析存储变量
    var msgJson = {
        ToUserName: "",
        FromUserName: "",
        CreateTime: "",
        MsgType: "",
        Content: ""
    };
    var tempName = "";
    // //开始解析消息
    var parse = new xml.SaxParser(function (cb) {
        cb.onStartElementNS(function (elem, attra, prefix, uri, namespaces) {
            tempName = elem;
        });
        cb.onCharacters(function (chars) {
            chars = chars.replace(/(^\s*)|(\s*$)/g, "");
            if (tempName == "CreateTime") {
                msgJson.CreateTime = chars;
            }
        });
        cb.onCdata(function (cdata) {
            if (tempName == "ToUserName") {
                msgJson.ToUserName = cdata;
            } else if (tempName == "FromUserName") {
                msgJson.FromUserName = cdata;
            } else if (tempName == "MsgType") {
                msgJson.MsgType = cdata;
            } else if (tempName == "Content") {
                msgJson.Content = cdata;
            }
        });
        cb.onEndElementNS(function (elem, prefix, uri) {
            tempName = "";
        });
        cb.onEndDocument(function () {
            //按收到的消息格式回复消息
            callback(msgJson);
        });
    });
    parse.parseString(xmlstr);
}

exports.test=test;