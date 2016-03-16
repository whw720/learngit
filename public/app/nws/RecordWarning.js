/**
 * 功能说明: 医嘱警示显示
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.RecordWarning', {
     recordWarning:{},
    //插入医嘱警示,
insertRecordWarning:function(divObj,data){
var me = this;
   // var recordWarningTimer = "";
    var crzxColor = "darkcyan";
    var otherColor = "darkgoldenrod";
    if(data.FREQUENCY_CODE == null){
        data.FREQUENCY_CODE = '';
    }
if(data.FREQUENCY_CODE == "st"){//立即执行
    divObj.innerHTML = divObj.innerHTML + '<div id= "' + data.ID + '"  style="height:19px;padding:0;margin:0;cursor:default;" onclick="Ext.getCmp(\'nws\').nwsApp.nwsToolbar.locationDa(this.id,document.getElementById(\''+ data.ID + 'nwsdaDate\').innerHTML);" style="color:#F00;text-decoration:underline;cursor:pointer;">' +
        '<span  class="recordWarningSt" style="color:#FF0000;padding:0;">【' + (data.TYPE == "L"?"长":"临") + '】</span><span  class="recordWarningSt" style="color:\'blue\';padding:0;display:none;" id="' + data.ID + 'nwsdaDate">' + data.EXTRACT_TIME +  '</span>' + '<span onmousemove="this.style.color=\'red\';" onmouseout="this.style.color=\'#FF0000\'"class="ys recordWarningSt" style="color:#FF0000;padding:0;" title = "' + data.CONTENT +'">' + new Date(data.EXTRACT_TIME).Format("MM-dd") + '【ST】'+ data.CONTENT + '</span></div>';


    // 立即医嘱闪烁暂时屏蔽，需要时放开。
    //var stSpans = document.getElementsByClassName("recordWarningSt");
//    if(me.recordWarning.recordWarningTimer != undefined){
//        clearInterval(me.recordWarning.recordWarningTimer);
//    }
//     me.recordWarning.recordWarningTimer =setInterval(function(){
//           for(var i = 0;i<(stSpans.length / 3);i++){
//                var cn = me.changeNum(i);
//               if(stSpans.item(i).style.color == "rgb(255, 0, 0)"){
//                   stSpans.item(cn[0]).style.color="#D7D718";
//                   stSpans.item(cn[1]).style.color="#D7D718";
//                   stSpans.item(cn[2]).style.color="#D7D718";
//               }else if(stSpans.item(i).style.color == "rgb(215, 215, 24)"){
//                   stSpans.item(cn[0]).style.color="#FF0000";
//                   stSpans.item(cn[1]).style.color="#FF0000";
//                   stSpans.item(cn[2]).style.color="#FF0000";
//               }
//           }
//    },1000);

}else if(data.FREQUENCY_CODE == "CRZX"||data.FREQUENCY_CODE == "次日执行"){//次日执行
    divObj.innerHTML = divObj.innerHTML + '<div id= "' + data.ID + '"  style="height:19px;padding:0;margin:0;cursor:default;" onclick="Ext.getCmp(\'nws\').nwsApp.nwsToolbar.locationDa(this.id,document.getElementById(\''+ data.ID + 'nwsdaDate\').innerHTML);" style="color:#F00;text-decoration:underline;cursor:pointer;">' +
        '<span style="color:'+crzxColor+';padding:0;">【' + (data.TYPE == "L"?"长":"临") + '】</span><span style="color:\'blue\';padding:0;display:none;" id="' + data.ID + 'nwsdaDate">' + data.EXTRACT_TIME + '</span>' + '<span onmousemove="this.style.color=\''+crzxColor+'\';" onmouseout="this.style.color=\''+crzxColor+'\'"class="ys" style="color:'+crzxColor+';padding:0;" title = "' + data.CONTENT +'">' + new Date(data.EXTRACT_TIME).Format("MM-dd") + '【CRZX】'+ data.CONTENT + '</span></div>';
    }else{ //其他
    divObj.innerHTML = divObj.innerHTML + '<div id= "' + data.ID + '"  style="height:19px;padding:0;margin:0;cursor:default;" onclick="Ext.getCmp(\'nws\').nwsApp.nwsToolbar.locationDa(this.id,document.getElementById(\''+ data.ID + 'nwsdaDate\').innerHTML);" style="color:#F00;text-decoration:underline;cursor:pointer;">' +
        '<span style="color:'+otherColor+';padding:0;">【' + (data.TYPE == "L"?"长":"临") + '】</span><span style="color:\'blue\';padding:0;display:none;" id="' + data.ID + 'nwsdaDate">' + new Date(data.EXTRACT_TIME).Format("yyyy-MM-dd") + '</span>' + '<span onmousemove="this.style.color=\''+otherColor+'\';" onmouseout="this.style.color=\''+otherColor+'\'"class="ys" style="color:'+otherColor+';padding:0;" title = "' + data.CONTENT +'">' + new Date(data.EXTRACT_TIME).Format("MM-dd") + '【'+data.FREQUENCY_CODE+'】'+ data.CONTENT + '</span></div>';
}


},
    //插入医嘱抽取日志,
    insertDoctorLog:function(divObj,data){
        divObj.innerHTML = divObj.innerHTML + '<div style="height:18px;padding:0;margin:0;cursor:default;"  style="text-decoration:underline;cursor:pointer;">' +
            '<span  class="recordWarningSt" style="padding:0;">抽取数量:</span>' + '<span style="padding:0;">' + data.EXTRACT_COUNT + '</span></div>';
        divObj.innerHTML = divObj.innerHTML + '<div style="height:18px;padding:0;margin:0;cursor:default;"  style="color:#F00;text-decoration:underline;cursor:pointer;">' +
            '<span  class="recordWarningSt" style="padding:0;">新增数量:</span>' + '<span style="padding:0;">' + data.UPDATE_COUNT + '</span></div>';
        divObj.innerHTML = divObj.innerHTML + '<div style="height:18px;padding:0;margin:0;cursor:default;"  style="color:#F00;text-decoration:underline;cursor:pointer;">' +
            '<span  class="recordWarningSt" style="padding:0;">抽取时间:</span>' + '<span style="padding:0;">' + new Date(data.EXTRACT_TIME).Format("MM-dd hh:mm") + '</span></div>';
    },




    //清除医嘱警示
    clearRecordWarning:function(){


    },

    //数字转换
    changeNum:function(x){
        var y = [];
        if(x == 0){
            y.push(0);
            y.push(1);
            y.push(2);
        }else{
            y.push(x*3);
            y.push(x*3 + 1);
            y.push(x*3 + 2);
        }
        return y;
    }
});
