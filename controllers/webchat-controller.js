var appid="wx697f2616c2fb16db",password="3a1b0ee329d13e8d546c0320a35924a9";
var xml=require('node-xml');
exports.getAccessToken=function(req,res){
	
}
exports.receiveMsg=function(req,res){
	console.log(req.body);
	parseXML(req.body.data,function(msg){
		var receiveMsg=sendMsg(msg);
	        console.log(msg);
        	console.log(receiveMsg);
        	res.end(receiveMsg);

	});
}
function sendMsg(rece){
	var CreateTime=parseInt(new Date().getTime() / 1000);
	var msg="";
	if(MsgType=="text"){
		msg="谢谢关注,你说的是:"+rece.Content;
		var sendMessage='<xml> <ToUserName><![CDATA['+rece.FromUserName+']]></ToUserName><FromUserName><![CDATA['+rece.ToUserName+']]></FromUserName>'+
			'<CreateTime>'+CreateTime+'</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA['+rece.msg+']]></Content></xml>';
		return sendMessage;
	}
}
function parseXML(xml,callback){
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
	  parse.parseString(xml);
}
