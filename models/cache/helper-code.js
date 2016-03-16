/**
*作用：助记码的缓存文件，用于生成助记码
*作者：whw
*时间: 2014-01-08
*/

var helperCodes=[];  //助词码缓存列表
var db = require('../../db');  //数据库查询组件
var isLoad=false;

exports.getHelperCode=function(str){
	var resultStr="";
	if(str!=null&&str.length>0){
		for(var i=0;i<str.length;i++){
			var temp=findStr(str.charAt(i));
			var acode=str.charCodeAt(i);
			if(temp.length==1){
				resultStr+=temp;
			}else if((acode>=48&&acode<=57) || (acode>=65&&acode<=90) || (acode>=97&&acode<=122)){
				resultStr+=str.charAt(i);
			}
		}
		if(resultStr.length<1){
			return str.toUpperCase();
		}		
	}
	if(resultStr.length>10){
		return resultStr.substr(0,10).toUpperCase();
	}
	return resultStr.toUpperCase();
};
exports.load=function(){
	if(isLoad){
		return;
	}
	var sql='SELECT content,spell FROM dic_helper_code';
	db.query(sql, function(req) {
		helperCodes=req;
		isLoad=true;
	});
};
function findStr(index){
	if(isLoad){
		for(var i=0;i<helperCodes.length;i++){
			if(helperCodes[i].content==index){
				return helperCodes[i].spell;
			}
		}
		return "";
	}
}