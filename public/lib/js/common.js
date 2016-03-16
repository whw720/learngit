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