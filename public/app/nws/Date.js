/**
 * Date对象格式化
 * @author 王小伟
 */
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

//得到url参数对象
function getRequestParam() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//得到当前当前对象下的第一个Ifram对象,iframePanel.el.dom
function getCmpIframe(dom) {
    for (var i=0; i<dom.children.length; i++) {
        if (dom.children[i].tagName=="IFRAME") {
            return dom.children[i];
        } else {
            var iframe = getCmpIframe(dom.children[i]);
            if (iframe!=null) {
                return iframe;
            }
        }
    }
    return null;
}

/*
 * 计算两个日期的间隔天数
 * BeginDate:起始日期的文本框，格式為：2012-01-01
 * EndDate:結束日期的文本框，格式為：2012-01-02
 * 返回兩個日期所差的天數
 * 調用方法：
 * alert("相差"+Computation("date1","date2")+"天");
 */
function GetDateRegion(BeginDate,EndDate) {
    if (BeginDate==null || EndDate==null) {
        return 0;
    }
    var aDate, oDate1, oDate2, iDays;
    var sDate1=BeginDate.substring(0, 10);   //sDate1和sDate2是2008-12-13格式
    var sDate2=EndDate.substring(0, 10);
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);   //转换为12/13/2008格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
    //iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24)+1;   //把相差的毫秒数转换为天数
    var i=(oDate2 - oDate1) / 1000 / 60 / 60 /24;
    if(i<0) {
        i+=1;
    } else {
        i+=1;
    }
    iDays = i - 1;   //把相差的毫秒数转换为天数
    //alert(iDays);
    return iDays;
}

/**
 * 计算年龄
 * @param birthday 格式為：2012-01-01
 */
function computeAge(birthday) {
    if (birthday==null) {
        return "";
    }
    var sDate1 = birthday;   //sDate1和sDate2是2008-12-13格式
    var sDate2 = new Date().Format("yyyy-MM-dd");

    var aDate = sDate1.split("-");
    var year1 = parseInt(aDate[0]);
    var month1 = parseInt(aDate[1]);
    var day1 = parseInt(aDate[2]);

    aDate = sDate2.split("-");
    var year2 = parseInt(aDate[0]);
    var month2 = parseInt(aDate[1]);
    var day2 = parseInt(aDate[2]);

    var age = year2-year1-1;
    if (month2>month1) {
        age += 1;
    } else if (month2==month1 && day2>=day1) {
        age += 1;
    }

    return age;
}

//设置window对象的toFont事件和toBack事件
(function(){

    // get the previous implementation of the toFront method
    var prevToFront = Ext.window.Window.prototype.toFront;

    Ext.override(Ext.window.Window, {

        toFront: function(){
            //get the window manager of this window, or Ext.WindowMgr if it doesn't have one
            var manager = Ext.WindowManager;
            //get the window which is currently to front
            var activeWindow = manager.getActive();

            prevToFront.apply(this, arguments);

            //only fire tofront and toback events if the current window was not already to front
            if (this != activeWindow){
                this.fireEvent('tofront');

                if (activeWindow){
                    activeWindow.fireEvent('toback');
                }
            }

            return this;
        }

    });
})();


//得到中文字符总数
function sb_strlen(str) {
    var i = 0;
    var c = 0.0;
    var unicode = 0;
    var len = 0;
    if (str == null || str == "") {
        return 0;
    }
    len = str.length;
    for(i = 0; i < len; i++) {
        unicode = str.charCodeAt(i);
        if (unicode < 127) { //判断是单字符还是双字符
            c += 1;
        } else {  //chinese
            c += 2;
        }
    }
    return c;
}

//截取中文字符
function sb_substr(str, startp, endp) {
    var i=0; c = 0; unicode=0; rstr = '';
    var len = str.length;
    var sblen = sb_strlen(str);
    if (startp < 0) {
        startp = sblen + startp;
    }
    if (endp < 1) {
        endp = sblen + endp;// - ((str.charCodeAt(len-1) < 127) ? 1 : 2);
    }
    // 寻找起点
    for(i = 0; i < len; i++) {
        if (c >= startp) {
            break;
        }
        var unicode = str.charCodeAt(i);
        if (unicode < 127) {
            c += 1;
        } else {
            c += 2;
        }
    }
    // 开始取
    for(i = i; i < len; i++) {
        var unicode = str.charCodeAt(i);
        if (unicode < 127) {
            c += 1;
        } else {
            c += 2;
        }
        rstr += str.charAt(i);
        if (c >= endp) {
            break;
        }
    }
    return rstr;
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
function numAdd(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
 * 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数  |  num2减数
 */
function numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMulti(num1, num2) {
    var baseNum = 0;
    try {
        baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
function numDiv(num1, num2) {
    var baseNum1 = 0, baseNum2 = 0;
    var baseNum3, baseNum4;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    with (Math) {
        baseNum3 = Number(num1.toString().replace(".", ""));
        baseNum4 = Number(num2.toString().replace(".", ""));
        return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
    }
};

//时分转换为中文，只支持两位数
function hourMinuteToChinese(number) {
    var result = "";
    var chinese = ["零","一","二","三","四","五","六","七","八","九"];
    var numberStr = number + "";
    if (numberStr.length>2 || numberStr.length<1) {
        return "";
    }
    if (numberStr.length==2) {
        var char = numberStr.charAt(0);
        var charNumber = Number(char);
        if (charNumber!=1) {
            result += chinese[charNumber];
        }
        result += "十";
    }
    char = numberStr.charAt(numberStr.length-1);
    charNumber = Number(char);
    if (! (charNumber==0 && numberStr.length==2) ) {
        result += chinese[charNumber];
    }
    return result;
}

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format= function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,function(s,i){
        return args[i];
    });
}

/**
 * 解析Url参数
 * @param url
 * @returns {Object}
 */
function parseUrl(url){
    var i=url.indexOf('?');
    if(i==-1) return {};
    var querystr=url.substr(i+1);
    var arr1=querystr.split('&');
    var arr2=new Object();
    for  (var j=0; j<arr1.length; j++){
        var ta=arr1[j].split('=');
        arr2[ta[0]]=ta[1];
    }
    return arr2;
}

//重写Date构造函数，自动取服务器时间，王小伟 2014-08-05
window.oDate = Date;
var localStorage;//本地时间存储，记录时间差额
window.Date = function(){
    this.getServerDate=function(){
        var currentTime = '',isGet = true,checkTime = 1000*60;
        if(localStorage.timeOffset){
            var localTime = new oDate().getTime();
            if(Math.abs(localTime - parseInt(localStorage.lastGetTime))<checkTime){
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


Ext.grid.column.CheckColumn.prototype.processEvent = function(type, view, cell, recordIndex, cellIndex, e, record, row) {
//    取消鼠标右键事件
    if (window.event && window.event.button && window.event.button==2) {
        return;
    }
    var me = this,
        key = type === 'keydown' && e.getKey(),
        mousedown = type == 'mousedown';

    if (!me.disabled && (mousedown || (key == e.ENTER || key == e.SPACE))) {
        var dataIndex = me.dataIndex,
            checked = !record.get(dataIndex);


        if (me.fireEvent('beforecheckchange', me, recordIndex, checked) !== false) {
            record.set(dataIndex, checked);
            me.fireEvent('checkchange', me, recordIndex, checked);


            if (mousedown) {
                e.stopEvent();
            }



            if (!me.stopSelection) {
                view.selModel.selectByPosition({
                    row: recordIndex,
                    column: cellIndex
                });
            }


            return false;
        } else {

            return !me.stopSelection;
        }
    } else {
        //return me.callParent(arguments);
    }
}
Ext.selection.CellModel.prototype.onViewRefresh=function(view) {
    var me = this,
        pos = me.getCurrentPosition(),
        headerCt = view.headerCt,
        record, columnHeader;



    if (pos && pos.view === view) {
        record = pos.record;
        columnHeader = pos.columnHeader;


        if (!columnHeader.isDescendantOf(headerCt)) {



            columnHeader = headerCt.queryById(columnHeader.id) ||
                headerCt.down('[text="' + columnHeader.text + '"]') ||
                headerCt.down('[dataIndex="' + columnHeader.dataIndex + '"]');
        }





        if (columnHeader &&record && (view.store.indexOfId(record.getId()) !== -1)) {
            me.setCurrentPosition({
                row: record,
                column: columnHeader,
                view: view
            });
        }
    }
}
//处理护理记录有时保存不了数据的问题，王小伟 2014-08-21
Ext.view.Table.prototype.updateColumns = function(record, oldRowDom, newRowDom, columns, changedFieldNames) {
    var me = this,
        newAttrs, attLen, attName, attrIndex,
        colCount = columns.length,
        colIndex,
        column,
        oldCell, newCell,
        row,




        editingPlugin = me.editingPlugin || (me.lockingPartner && me.ownerCt.ownerLockable.view.editingPlugin),


        isEditing = editingPlugin && editingPlugin.editing,
        cellSelector = me.getCellSelector();



    if (oldRowDom.mergeAttributes) {
        oldRowDom.mergeAttributes(newRowDom, true);
    } else {
        newAttrs = newRowDom.attributes;
        attLen = newAttrs.length;
        for (attrIndex = 0; attrIndex < attLen; attrIndex++) {
            attName = newAttrs[attrIndex].name;
            if (attName !== 'id') {
                oldRowDom.setAttribute(attName, newAttrs[attrIndex].value);
            }
        }
    }


    for (colIndex = 0; colIndex < colCount; colIndex++) {
        column = columns[colIndex];



        if (me.shouldUpdateCell(record, column, changedFieldNames)) {



            cellSelector = me.getCellSelector(column);
            oldCell = Ext.DomQuery.selectNode(cellSelector, oldRowDom);
            newCell = Ext.DomQuery.selectNode(cellSelector, newRowDom);

            try {
                if (isEditing) {

                    Ext.fly(oldCell).syncContent(newCell);

                }

                else {

                    row = oldCell.parentNode;
                    row.insertBefore(newCell, oldCell);
                    row.removeChild(oldCell);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}
function base64_decode (data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>16 & 0xff;
        o2 = bits>>8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');
    dec = utf8_decode(dec);

    return dec;
}

function base64_encode (data) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    data = utf8_encode(data+'');

    do {
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;


        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
}

function utf8_decode ( str_data ) {

    var tmp_arr = [], i = ac = c1 = c2 = c3 = 0;

    str_data += '';

    while ( i < str_data.length ) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str_data.charCodeAt(i+1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i+1);
            c3 = str_data.charCodeAt(i+2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join('');
}

function utf8_encode (argString) {
    // Encodes an ISO-8859-1 string to UTF-8
    //
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/utf8_encode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

Ext.data.Connection.prototype.request = function(options) {
    options = options || {};
    var me = this,
        scope = options.scope || window,
        username = options.username || me.username,
        password = options.password || me.password || '',
        async,
        requestOptions,
        request,
        headers,
        xhr;
    if (me.fireEvent('beforerequest', me, options) !== false) {

        requestOptions = me.setOptions(options, scope);

        if (me.isFormUpload(options)) {
            me.upload(options.form, requestOptions.url, requestOptions.data, options);
            return null;
        }


        if (options.autoAbort || me.autoAbort) {
            me.abort();
        }


        async = options.async !== false ? (options.async || me.async) : false;
        xhr = me.openRequest(options, requestOptions, async, username, password);


        if (!me.isXdr) {
            headers = me.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
        }


        request = {
            id: ++Ext.data.Connection.requestId,
            xhr: xhr,
            headers: headers,
            options: options,
            async: async,
            binary: options.binary || me.binary,
            timeout: setTimeout(function() {
                request.timedout = true;
                me.abort(request);
            }, options.timeout || me.timeout)
        };

        me.requests[request.id] = request;
        me.latestId = request.id;

        if (async) {
            if (!me.isXdr) {
                xhr.onreadystatechange = Ext.Function.bind(me.onStateChange, me, [request]);
            }
        }

        if (me.isXdr) {
            me.processXdrRequest(request, xhr);
        }


        try {
            xhr.send(requestOptions.data);
        } catch(e) {;
            alert("网络异常!\n" + e.message);
        }
        if (!async) {
            return me.onComplete(request);
        }
        return request;
    } else {
        Ext.callback(options.callback, options.scope, [options, undefined, undefined]);
        return null;
    }
}

//处理防止浏览器缩放Ctrl+鼠标滚轮
var scrollFunc=function(e){
    e=e || window.event;
    if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome
        event.returnValue=false;
    }else if(e.detail){//Firefox
        event.returnValue=false;
    }
}

/*注册事件*/
if(document.addEventListener){
    document.addEventListener('DOMMouseScroll',scrollFunc,false);
}//W3C
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari