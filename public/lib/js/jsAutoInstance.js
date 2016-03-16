var jsAutoInstance = null;
var currentPageNum = 0;
var _mouseIndex = 0;
var activeElementId = null;
var eventElementId = null;
function jsAuto(instanceName,objID){
	this._msg = [];
	this._x = null;
	this._o = document.getElementById( objID );
	if (!this._o) return;
	this._f = null;
	this._i = instanceName;
	this._r = null;
	this._c = 0;
	this._s = false;
	this._v = null;
	this._e = null;//传入的事件
	this._value = null;//传入搜索的值
	this._url = null;//请求的url
	this._limit = 0;//请求每页的条数
	this._totalCount = 0;//数据的总页数
	this._o.style.overflow = "auto";
	this._o.style.height = "100px";
	return this;
};
jsAuto.prototype.directionKey=function() {
	with (this){
		elementlistDirectionKey(_e);
	}
}

function elementlistDirectionKey(event){
	eventElementId = 'divclist';
	var e = event.keyCode ? event.keyCode : event.which;
	var _msg = jsAutoInstance._msg;
	var l = _msg.length;
	var _s = jsAutoInstance._s;
	var _o = jsAutoInstance._o;
	var _r = jsAutoInstance._r;
	(_mouseIndex>l-1 || _mouseIndex<0) ? _s=false : _s=true;
	if( e==40  &&  _s ){
		_o.childNodes[_mouseIndex].className="mouseout";
		(_mouseIndex >= l-1) ? _mouseIndex=0 : _mouseIndex++;
		_o.childNodes[_mouseIndex].className="mouseover";
	}
	if( e==38  &&  _s ){
		_o.childNodes[_mouseIndex].className="mouseout";
		_mouseIndex--<=0 ? _mouseIndex = _o.childNodes.length-1 : "";
		_o.childNodes[_mouseIndex].className="mouseover";
	}
	if( e==13 ){
		eventElementId = null;
		if(_o.childNodes[_mouseIndex]  &&  _o.style.visibility=="visible"){
			if(_r.value.lastIndexOf(',')>0){
				_r.value = (_r.value).substring(0,_r.value.lastIndexOf(',') + 1 ) + _msg[_mouseIndex] + ',';
			}else{
				_r.value = _msg[_mouseIndex] + ',';
			}
			clearjsAutoInstance();
			divcHiddent();
			removeDiv('divc');
    	}
	}
	if(!_s){
		_mouseIndex = 0;
		_o.childNodes[_mouseIndex].className="mouseover";
		_s = true;
	}
}

// mouseEvent.
jsAuto.prototype.domouseover=function(obj) {
	with (this){
		_o.childNodes[_mouseIndex].className = "mouseout";
		obj.tagName=="DIV" ? obj.className="mouseover" : obj.parentElement.className="mouseover";
		_mouseIndex = obj.id.substring(4,5);
	}
};

jsAuto.prototype.domouseout=function(obj){
	//obj.tagName=="DIV" ? obj.className="mouseout" : obj.parentElement.className="mouseout";
};

jsAuto.prototype.doclick=function(msg) {
	activeElementId = "divc";//逃避onblur事件
	with (this){
	if(_r){
		if(_r.value.lastIndexOf(',')>0){
			_r.value = (_r.value).substring(0,_r.value.lastIndexOf(',') + 1 ) + msg + ',';
		}else{
			_r.value = msg + ',';
		}
		clearjsAutoInstance();
        divcHiddent();
        removeDiv('divc')
	}else{
		alert("javascript autocomplete ERROR :\n\n can not get return object.");
		return;
	}
}};

jsAuto.prototype.item=function(msg){
	for(var i=0;i<msg.length;i++){
		this._msg.push(msg[i].text);
	}
};
jsAuto.prototype.append=function(msg,i) { 
	with (this){
		_i ? "" : _i = eval(_i);
		_x.push(msg);
		var div = document.createElement("DIV");
		div.id = 'divc'+i;
		div.onmouseover = function(){_i.domouseover(this)};
		div.onmouseout = function(){_i.domouseout(this)};
		div.onclick = function(){_i.doclick(msg)};
		div.onblur = function(){removeFolatDiv()};
		var re  = new RegExp("(" + _v + ")","i");
		div.style.lineHeight="140%";
		div.className = "mouseout";
		if (_v) div.innerHTML = msg.replace(re , "<strong>$1</strong>");
		div.style.fontFamily = "verdana";

		_o.appendChild(div);
	}
};
//设定div显示的位置和宽度
jsAuto.prototype.display=function() {
	with(this){
		if(_f && _v!=""){//需要加上px后才能起作用
			//_o.style.width = "250px";
			//_o.style.left = _element.offsetLeft + "px";//(_r.offsetLeft + _v.length*20)+'px';
			_o.style.visibility = "visible";
		}else{
			this._o.style.visibility="hidden";
		}
	}
};

jsAuto.prototype.handleEvent=function(fValue,fID,event) {
	with (this){
		var re;
		_e = event;
		var e = _e.keyCode ? _e.keyCode : _e.which;
		_x = [];
		_f = false;
		_r = document.getElementById( fID );
		_v = fValue;
		_i = eval(_i);
		re = new RegExp("^" + fValue + "", "i");
		_o.innerHTML="";

		for(var i=0; i<_msg.length; i++){
			_i.append(_msg[i],i);
			_f = true;
		}
		//增加翻页按钮
		if(_f){
			var pageToolbar = createPageToolbar(_i);
			var elementDiv = document.getElementById('divc');
			elementDiv.appendChild(pageToolbar);
		}

		_i ? _i.display() : alert("can not get instance");
		if(_f){
			if((e==38 || e==40 || e==13)){
				_i.directionKey();
			}else{
				_c=0;
				_mouseIndex = 0;
				_o.childNodes[_c].className = "mouseover";
				_s=true;
			}
		}
	}
};

//创建翻页块
function createPageToolbar(obj){
	var centerElement = document.getElementById("toolBar");
	if(centerElement){
		var theFirstPage = document.getElementById("theFirstPage");
		var thePrePage = document.getElementById("thePrePage");
		theFirstPage.innerHTML="<a href=\"javascript:setActiveElementId()\" title=\"上一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-first.png\"></a>&nbsp;&nbsp;"; 
        thePrePage.innerHTML="<a href=\"javascript:setActiveElementId()\" title=\"上一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-prev.png\"></a>&nbsp;&nbsp;"; 
		var currentPage = document.getElementById("currentPage");
		currentPage.innerHTML = '1 / ' + getPageNum();
		return centerElement;
	}
	centerElement = document.createElement("center");
	centerElement.id = "toolBar";
	centerElement.className = "toolBar";

	var theFirstPage = document.createElement("span");
	theFirstPage.id = "theFirstPage";
	theFirstPage.innerHTML="<a href=\"javascript:setActiveElementId()\" title=\"第一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-first.png\"></a>&nbsp;&nbsp;";
	centerElement.appendChild(theFirstPage);

	var thePrePage = document.createElement("span");
	thePrePage.id = "thePrePage";
	thePrePage.innerHTML="<a href=\"javascript:setActiveElementId()\" title=\"上一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-prev.png\"></a>&nbsp;&nbsp;";
	centerElement.appendChild(thePrePage);

	var currentPageElement = document.createElement("span");
	currentPageElement.id = "currentPage";
	currentPageElement.innerHTML = '1 / ' + getPageNum();
	centerElement.appendChild(currentPageElement);

	var theNextPage = document.createElement("span");
	theNextPage.id = "theNextPage";
	theNextPage.innerHTML="<a href=\"javascript:nextPage()\" title=\"下一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-next.png\"></a>&nbsp;&nbsp;";
	centerElement.appendChild(theNextPage);

	var theLastPage = document.createElement("span");
	theLastPage.id = "theLastPage";
	theLastPage.innerHTML="<a href=\"javascript:lastPage()\" title=\"最后一页\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-last.png\"></a>";
	centerElement.appendChild(theLastPage);
	return centerElement;
};

/**
	方法说明：调用此方法弹出搜索浮动层
	参数说明：obj:当前节点即this;value:当前节点的值;id:当前节点的id;url:当前节点查询数据的url
*/
function elementOnChange(value,id,event,url,limit,width){
	var e = event.keyCode ? event.keyCode : event.which;
	if((e==38 || e==40 || e==13)){
		if(eventElementId){
			eventElementId = null;
			elementlistDirectionKey(event);
			return;
		}
	}
	
	var divId = "divc";
    var paramStr = 'all';
    if (value != null) {
        if (Ext.util.Format.trim(value) != '') {
            paramStr = Ext.util.Format.trim(value);
        }else {
            clearjsAutoInstance();
            divcHiddent();
            removeDiv(divId);
            return;
        }
        if(paramStr.indexOf(",")>0){
	        var valueArr = paramStr.split(',');
	        paramStr = valueArr[valueArr.length-1];
	        if(paramStr === null||Ext.util.Format.trim(paramStr) === ''){
	        	clearjsAutoInstance();
            	divcHiddent();
            	removeDiv(divId);
            	return;
	        }
	    }
    }else{
    	clearjsAutoInstance();
        divcHiddent();
        removeDiv(divId);
    	return;
    }
    var reg = /[\u4E00-\u9FA5]/g;
    if (!reg.test(paramStr)) {
        paramStr = paramStr;
    }else{
    	clearjsAutoInstance();
        divcHiddent();
        removeDiv(divId);
        return;
    }    
    Ext.Ajax.request({
        // 定义后台url映射。参数为选择行的任务id。
        url: url + paramStr + '?start='+0+'&limit='+limit,
        method : 'GET',
        success : function(response, opts) {
        	/*var elementDiv = document.getElementById(divId);
        	var elementList = document.getElementById('divclist');
			if(elementDiv){
				if(elementList){
					return;
				}else{
					removeDiv(divId);
					elementDiv = null;
				}
			}*/
        	createDiv(divId);
        	elementDiv = document.getElementById(divId);
        	var elementlist = document.getElementById('divclist');
        	if(!elementlist){
        		elementlist = document.createElement("DIV");
				elementlist.id = 'divclist';
				elementDiv.appendChild(elementlist);
        	}
            var data = Ext.decode(response.responseText).data.data;
            var totalCount = Ext.decode(response.responseText).data.totalCount;
            jsAutoInstance = null;
    		currentPageNum = 0;//清空对象中的全局变量
            jsAutoInstance = new jsAuto("jsAutoInstance","divclist");
            jsAutoInstance.item(data);
            jsAutoInstance._i = jsAutoInstance;
            var height = data.length * 19 + 28;
            setDivBaseStyle(divId,height);
            var left = document.getElementById(id).offsetLeft + getLeft(value);
        	setDivDisplayStyle(divId,id,width,left);
        	jsAutoInstance._o.style.width = width + "px";
            jsAutoInstance._o.style.height = data.length * 19 + "px";
            jsAutoInstance._value = paramStr;
            jsAutoInstance._url = url;
            jsAutoInstance._limit = limit;
            jsAutoInstance._totalCount = totalCount;
            jsAutoInstance.handleEvent(value,id,event);
        },
        failure : function(response, opts){
        }
    });
};

function getLeft(value){
	var newvalue = value.replace(/[^\x00-\xff]/g, "**");
	if(newvalue.length > 0 && newvalue.length<10){
		return 0;
	}else {
		return newvalue.length * 6 + 20;
	}
}

function setActiveElementId(){
	activeElementId = "divc";//逃避onblur事件
}

function nextPage(){
	activeElementId = "divc";//逃避onblur事件
	eventElementId = 'divclist';//逃避input触发onkeyup事件时重建jsAutoInstance对象
	jsAutoInstance._r.focus();
	currentPageNum++;
	getData();
	showhiddenRecord(currentPageNum);
}

function firstPage(){
	activeElementId = "divc";//逃避onblur事件
	eventElementId = 'divclist';//逃避input触发onkeyup事件时重建jsAutoInstance对象
	jsAutoInstance._r.focus();
	currentPageNum = 0;
	getData();
	showhiddenRecord(currentPageNum);
}

function lastPage(){
	activeElementId = "divc";//逃避onblur事件
	eventElementId = 'divclist';//逃避input触发onkeyup事件时重建jsAutoInstance对象
	jsAutoInstance._r.focus();
	currentPageNum = getPageNum()-1;
	getData();
	showhiddenRecord(currentPageNum);
}

function prePage(){
	activeElementId = "divc";//逃避onblur事件
	eventElementId = 'divclist';//逃避input触发onkeyup事件时重建jsAutoInstance对象
	jsAutoInstance._r.focus();
	currentPageNum--;
	getData();
	showhiddenRecord(currentPageNum);
}

function getPageNum(){
	var limit = jsAutoInstance._limit;
	var num = jsAutoInstance._totalCount%limit;
	var totalNum = 0;
	if(num>0){
		totalNum = parseInt(jsAutoInstance._totalCount/limit) + 1;
	}else{
		totalNum = jsAutoInstance._totalCount/limit;
	}
	return totalNum;
}

function showhiddenRecord(pagenum){
	var currentPageElement = document.getElementById("currentPage");
	currentPageElement.innerHTML = (pagenum+1) +' / ' + getPageNum();
	var theFirstPage = document.getElementById("theFirstPage");
	var thePrePage = document.getElementById("thePrePage");
	var theNextPage = document.getElementById("theNextPage");
	var theLastPage = document.getElementById("theLastPage");
	if(pagenum<=0){
        theFirstPage.innerHTML="<a href=\"javascript:setActiveElementId()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-first.png\"></a>&nbsp;&nbsp;"; 
        thePrePage.innerHTML="<a href=\"javascript:setActiveElementId()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-prev.png\"></a>&nbsp;&nbsp;"; 
    }else{ 
        theFirstPage.innerHTML="<a href=\"javascript:firstPage()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-first.png\"></a>&nbsp;&nbsp;"; 
        thePrePage.innerHTML="<a href=\"javascript:prePage()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-prev.png\"></a>&nbsp;&nbsp;"; 
    } 
    if(pagenum>=(getPageNum()-1)){ 
        theNextPage.innerHTML="<a href=\"javascript:setActiveElementId()\" ><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-next.png\"></a>&nbsp;&nbsp;";
        theLastPage.innerHTML="<a href=\"javascript:setActiveElementId()\" ><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-last.png\"></a>&nbsp;&nbsp;";
    }else{ 
        theNextPage.innerHTML="<a href=\"javascript:nextPage()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-next.png\"></a>&nbsp;&nbsp;";
        theLastPage.innerHTML="<a href=\"javascript:lastPage()\"><img src=\"/lib/extjs/resources/ext-theme-neptune/images/grid/page-last.png\"></a>&nbsp;&nbsp;";
    }
}

function getData(){
	var url = jsAutoInstance._url;
	var paramStr = jsAutoInstance._value;
	var limit = jsAutoInstance._limit;
	var div = document.getElementById("divc");
	var start = currentPageNum*limit;
	Ext.Ajax.request({
        // 定义后台url映射。参数为选择行的任务id。
        url: url + paramStr + '?start='+start+'&limit='+limit,
        method : 'GET',
        success : function(response, opts) {
            var data = Ext.decode(response.responseText).data.data;
            var totalCount = Ext.decode(response.responseText).data.totalCount;
            jsAutoInstance._msg = [];
            jsAutoInstance.item(data);
            var height = data.length * 19 + 28;
            jsAutoInstance._o.style.height = data.length * 19 + "px";
            div.style.height = height + "px";
            var msgArr = jsAutoInstance._msg;
            for(var i=0;i<msgArr.length;i++){
            	var temp = msgArr[i];
            	var divc = document.getElementById("divc"+i);
            	divc.innerHTML = temp;
            	divc.onclick = function (){jsAutoInstance._i.doclick(this.innerHTML)};
            }
            if(msgArr.length<10){
            	for(var i = msgArr.length ; i<10 ; i++){
            		var divc = document.getElementById("divc"+i);
            		if(divc){
            			divc.innerHTML = '';
            			divc.innerText = '';
            		}
            	}
            }
        },
        failure : function(response, opts){
        }
    });
}

//清空jsAutoInstance对象中的全局变量
function clearjsAutoInstance(){
	jsAutoInstance = null;
    currentPageNum = 0;
    _mouseIndex = 0;
}
//隐藏浮动窗口
function divcHiddent(){
	var div = document.getElementById("divc");
	if(div){
		div.style.visibility = "hidden";
	}
}

window.onerror=new Function("return true;");