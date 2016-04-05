/**
 * 用于获得天气信息
 * Created by whw on 2016/4/5.
 */
var sourceURL='https://www.baidu.com/home/other/data/weatherInfo?city=%E9%83%91%E5%B7%9E&indextype=manht&_req_seqid=0xca933f4700004e2c&asyn=1&t=1459837939557&sid=18881_1443_18205_19558_17000_14968_11777_19152';
var node = {
    async: require('async'),
    cheerio: require('cheerio'),
    request: require('request')
};
var msg={
    city:'',
    week:'',
    today:{
        name:"今天",
        time:'',
        date:'',
        condition:'',
        wind:'',
        temp:'',
        pm25:'',
        pollution:''
    },
    tomorrow:{
        name:"明天",
        time:'',
        date:'',
        condition:'',
        wind:'',
        temp:'',
        pm25:'',
        pollution:''
    },
    thirdday:{
        name:"后天",
        time:'',
        date:'',
        condition:'',
        wind:'',
        temp:'',
        pm25:'',
        pollution:''
    },
    fourthday:{
        name:"大后天",
        time:'',
        date:'',
        condition:'',
        wind:'',
        temp:'',
        pm25:'',
        pollution:''
    },
    fifthday:{
        time:'',
        date:'',
        condition:'',
        wind:'',
        temp:'',
        pm25:'',
        pollution:''
    }
};

exports.getWeather=function(req,res){
    reptile.start(function(info){
        res.sendResult(info);
    });
};
exports.getWeatherInfo=function(city,callback){
    reptile.start(function(msg){
        callback(packMsg(msg))
    });
};
function packMsg(info){
    var msg="城市："+info.city+"\n";
    msg+="日期："+info.week+"\n";
    msg+=packToday(info,'today')+"\n";
    msg+=packToday(info,'tomorrow')+"\n";
    msg+=packToday(info,'thirdday')+"\n";
    msg+=packToday(info,'fourthday')+"\n";
    msg+=packToday(info,'fifthday')+"\n";
    return msg;
};
function packToday(info,item){
    var str="";
    str=(info[item].name||info[item].time)+
        "天气："+info[item].condition+
        " 风："+info[item].wind+
        " 温度："+info[item].temp+
        " pm2.5："+info[item].pm25+
        " 污染指数："+info[item].pollution;
    return str;
}
var reptile={
    /**
     * 开始下载（程序入口函数）
     */
    start: function(callback) {
        var self = this;
        var async = node.async;
        console.log('string------------------');
        self.downPage(sourceURL,function(err,result){
            callback(result);
        });

    },
    /**
     * 下载单个页面
     */
    downPage: function(uri, callback) {
        var self = this;
        node.request(uri, function(err, res, body) {

            if (!err) console.log('下载页面成功：%s', uri);
            var page = {uri: uri, html: body};
            var weather=JSON.parse(page.html);
            console.log(weather);
            self.copyValue(weather.data.weather.content||null);
            callback(false,msg);
        });
    },
    //从源头获得值，放到已经设定的值中
    copyValue:function(content){
        var self = this;
        if(content){
            for(var item in content){
                    for(var it in msg){
                        if(it==item){
                            msg[it]=content[item];
                        }
                    }
            }
        }
    }
}