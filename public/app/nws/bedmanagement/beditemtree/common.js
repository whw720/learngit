/**
  * 执行基本ajax请求,返回XMLHttpRequest
  * Ajax.request(url,{
 *      async   是否异步 true(默认)
 *      method  请求方式 POST or GET(默认)
 *      data    请求参数 (键值对字符串)
 *      success 请求成功后响应函数，参数为xhr
 *      failure 请求失败后响应函数，参数为xhr
 * });
  *
  */
window.Ajax = function(){
    function request(url,opt){
        function fn(){}
        var async   = opt.async !== false,
            method  = opt.method    || 'GET',
            data    = opt.data      || null,
            success = opt.success   || fn,
            failure = opt.failure   || fn;
        method  = method.toUpperCase();
        if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
            data = null;
        }
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onreadystatechange = function(){
            _onStateChange(xhr,success,failure);
        };
        xhr.open(method,url,async);
        if(method == 'POST'){
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
        }
        try{
            xhr.send(data);
        }catch(e){
            failure(false);
        }
        return xhr;
    }
    function _onStateChange(xhr,success,failure){
        if(xhr.readyState == 4){
            var s = xhr.status;
            if(s>= 200 && s < 300){
                success(xhr);
            }else{
                failure(xhr);
            }
        }else{
        }
    }
    return {request:request};
}();

/**
* 重写Date，不传参则获取服务器当前时间
* */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
window.oDate = Date;
window.Date = function(){
    this.getServerDate=function(){
        var currentTime = '',isGet = true,checkTime = 1000*10;
        if(localStorage.timeOffset){
            var localTime = new oDate().getTime();
            if(Math.abs(localTime - parseInt(localStorage.lastGetTime)) <checkTime){
                return new oDate(localTime - parseInt(localStorage.timeOffset));
            }
        }
        Ajax.request('/sys/now',{
            method: 'GET',
            async: false, //同步请求数据
            success: function(response) {
                var result = JSON.parse(response.responseText);
                if (result.success === true) {
                    currentTime = result.data;
                    localStorage.timeOffset=new oDate().getTime()-new Date(result.data).getTime();
                    localStorage.lastGetTime = new oDate().getTime();
                }
            },
            failure:function(){
                var localTime = new oDate().getTime();
                currentTime = localTime - parseInt(localStorage.timeOffset);
                localStorage.lastGetTime = localTime;
            }
        });
        return currentTime;
    }
    switch(arguments.length){
        case 0:
            return new oDate(this.getServerDate());
            break;
        case 1:
            return new oDate(arguments[0]);
            break;
        case 2:
            return new oDate(arguments[0],arguments[1]);
            break;
        case 3:
            return new oDate(arguments[0],arguments[1],arguments[2]);
            break;
        case 4:
            return new oDate(arguments[0],arguments[1],arguments[2],arguments[3]);
            break;
        case 5:
            return new oDate(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
            break;
        case 6:
            return new oDate(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
            break;
        case 7:
            return new oDate(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
            break;
        default:
            return new oDate(this.getServerDate());
    }
}
Date.parse = oDate.parse;
Date.UTC = oDate.UTC;
Date.now = function(){
    return new Date().getTime();
}
Date.prototype = new oDate();


//封装选择器
var $ = function(selector,context){

    var elems = [];
    context = context||document;
    if(context.nodeName){

        elems = context.querySelectorAll(selector);
        elems = makeArray(elems);

    }else{
        context = makeArray(context);
        var prevElem = context[0],
            curElem;
        for(var i = 0, len = context.length; i < len; i++){
            curElem = context[i];
            if(!contains(prevElem,curElem)){
                prevElem = curElem;
                elems = makeArray(curElem.querySelectorAll(selector),elems);
            }

        }
    }
    return elems;

}

//简单地将array-like转换为真正的数组
function makeArray(source,target){
    target = target || [];
    for(var i = 0,len = source.length; i < len; i++){
        target[target.length] = source[i];
    }
    return target;
}

function contains( root, el ){
    // 按照原则，先判断标准浏览器
    if( root.compareDocumentPosition ){
        return !!( root.compareDocumentPosition(el) & 16 );
    }else if( root.contains ){
        return root !== el && root.contains( el );
    }
    return false;
}