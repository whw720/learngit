var appid="wx697f2616c2fb16db",password="3a1b0ee329d13e8d546c0320a35924a9";
var xml=require('node-xml');
exports.getAccessToken=function(req,res){
	
}
exports.receiveMsg=function(req,res){
	console.log(req.body);
	console.log(req.body.data);
	var post_data="";
	req.on('data',function(data){post_data=data;});
	req.on('end',function(){
	parseXML(post_data.toString('utf-8',0,post_data.length),function(msg){
                var receiveMsg=sendMsg(msg);
                console.log(msg);
                console.log(receiveMsg);
                res.end(receiveMsg);

        });

	});
}
function test(){
var str=" <xml>"+
            "<ToUserName><![CDATA[toUser]]></ToUserName>"+
            "<FromUserName><![CDATA[fromUser]]></FromUserName>"+
            "<CreateTime>1348831860</CreateTime>"+
            " <MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA[this is a test]]></Content>"+
            " <MsgId>1234567890123456</MsgId>"+
            " </xml>";
   parseXML(str,function(msg){
	console.log(msg);
	});
}
test();
function sendMsg(rece){
	var CreateTime=parseInt(new Date().getTime() / 1000);
	var msg="";
	if(rece.MsgType=="text"){
		msg="谢谢关注,你说的是:"+rece.Content;
		var sendMessage='<xml> <ToUserName><![CDATA['+rece.FromUserName+']]></ToUserName><FromUserName><![CDATA['+rece.ToUserName+']]></FromUserName>'+
			'<CreateTime>'+CreateTime+'</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA['+rece.msg+']]></Content></xml>';
		return sendMessage;
	}
}
function parseXML(xmlstr,callback){
	// 定义解析存储变量
	var msgJson={
	  ToUserName:"",
	  FromUserName:"",
	  CreateTime:"",
	  MsgType:"",
	  Content:""
	}
	var tempName="";
	// //开始解析消息
	 var parse=new xml.SaxParser(function(cb){
	     cb.onStartElementNS(function(elem,attra,prefix,uri,namespaces){
	              tempName=elem;	     
	     });
	     cb.onCharacters(function(chars){
	              chars=chars.replace(/(^\s*)|(\s*$)/g, "")
	              if(tempName=="CreateTime"){
	                      msgJson.CreateTime=chars;
	              }
	     });
	     cb.onCdata(function(cdata){
	              if(tempName=="ToUserName"){
	                     msgJson.ToUserName=cdata;
	             }else if(tempName=="FromUserName"){
	                      msgJson.FromUserName=cdata;
	            }else if(tempName=="MsgType"){
	                     msgJson.MsgType=cdata;
	            }else if(tempName=="Content"){
	                    msgJson.Content=cdata;
	            }
	            console.log(tempName+":"+cdata);
	     });
	     cb.onEndElementNS(function(elem,prefix,uri){
	           tempName="";
            });
	      cb.onEndDocument(function(){
	     //按收到的消息格式回复消息
	     callback(msgJson);
	      });
	  });
	  parse.parseString(xmlstr);
}
