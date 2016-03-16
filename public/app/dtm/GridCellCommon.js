Ext.define('com.dfsoft.lancet.dtm.GridCellCommon', {
    extend: 'Ext.Component',
    getTemplate: function(id,schedulType,schedulingInfoArr,activeTabId) {
        return Ext.create('Ext.XTemplate',
            '<table><tr><td>',
                '<select name="'+id+'sel" id="'+id+'sel" style="width:100%;" onchange="javascript:selChange(id,\''+activeTabId+'\');">'+schedulType,
            '</select></td></tr>' ,
            '<tr><td>' ,
                '<input id = "'+id+'1begmin" type="text" style="width:20px" disabled="true" onchange="javascript:verifyHourInput(id,value,\''+activeTabId+'\')"/>' ,
                '<input id = "'+id+'1begsed" type="text" style="width:20px" disabled="true" onchange="javascript:verifyMinInput(id,value,\''+activeTabId+'\')"/>' ,
                '<input id = "'+id+'id" type="hidden"/>' ,
                '<input id = "'+id+'workTime" type="hidden"/>' ,
            '<label>~</label>' ,
                '<input id = "'+id+'1endmin" type="text" style="width:20px" disabled="true" onchange="javascript:verifyHourInput(id,value,\''+activeTabId+'\')"/>' ,
                '<input id = "'+id+'1endsed" type="text" style="width:20px" disabled="true" onchange="javascript:verifyMinInput(id,value,\''+activeTabId+'\')"/>' ,
            '</td></tr>' ,
            '<tr><td>' ,
                '<input id = "'+id+'2begmin" type="text" style="width:20px" disabled="true" onchange="javascript:verifyHourInput(id,value,\''+activeTabId+'\')"/>' ,
                '<input id = "'+id+'2begsed" type="text" style="width:20px" disabled="true" onchange="javascript:verifyMinInput(id,value,\''+activeTabId+'\')"/>' ,
            '<label>~</label>' ,
                '<input id = "'+id+'2endmin" type="text" style="width:20px" disabled="true" onchange="javascript:verifyHourInput(id,value,\''+activeTabId+'\')"/>' ,
                '<input id = "'+id+'2endsed" type="text" style="width:20px" disabled="true" onchange="javascript:verifyMinInput(id,value,\''+activeTabId+'\')"/>' ,
            '</td></tr>',
            '</table>'
        )
    }
});
//当选择排班类型后执行的操作 1,给时间框复制 2,合计工时
function selChange(selId,activeTabId){
    var sel = document.getElementById(selId);
    var index = sel.selectedIndex;
    var value = sel.options[index].value;
    var arr = value.split('_');
    var beg1 = arr[1];
    var end1 = arr[2];
    var beg2 = arr[3];
    var end2 = arr[4];
    var idStr = selId.substring(0,selId.length-3);
    var beg1minObj = document.getElementById(idStr+'1begmin');
    var beg1sedObj = document.getElementById(idStr+'1begsed');
    var end1minObj = document.getElementById(idStr+'1endmin');
    var end1sedObj = document.getElementById(idStr+'1endsed');
    var beg2minObj = document.getElementById(idStr+'2begmin');
    var beg2sedObj = document.getElementById(idStr+'2begsed');
    var end2minObj = document.getElementById(idStr+'2endmin');
    var end2sedObj = document.getElementById(idStr+'2endsed');

    if(index === 0 || index === '0'){
        beg1minObj.value = '';
        beg1sedObj.value = '';
        end1minObj.value = '';
        end1sedObj.value = '';
        beg2minObj.value = '';
        beg2sedObj.value = '';
        end2minObj.value = '';
        end2sedObj.value = '';

        beg1minObj.disabled = true;
        beg1sedObj.disabled = true;
        end1minObj.disabled = true;
        end1sedObj.disabled = true;
        beg2minObj.disabled = true;
        beg2sedObj.disabled = true;
        end2minObj.disabled = true;
        end2sedObj.disabled = true;

        refreshDayWeekMonthWorkTime(idStr,0,activeTabId);
        return;
    }

    var worktime = 0;
    var time1 = 0;
    var time2 = 0;
    if(beg1!='null'&&beg1.length>0){
        beg1minObj.value = beg1.split(':')[0];
        beg1sedObj.value = beg1.split(':')[1];
        beg1minObj.disabled = false;
        beg1sedObj.disabled = false;
    }else{
        beg1minObj.value = '';
        beg1sedObj.value = '';
        beg1minObj.disabled = true;
        beg1sedObj.disabled = true;
    }

    if(end1!='null'&&end1.length>0){
        end1minObj.value = end1.split(':')[0];
        end1sedObj.value = end1.split(':')[1];
        end1minObj.disabled = false;
        end1sedObj.disabled = false;
        time1 = getHoursBetweenTwoTime(beg1.split(':')[0],beg1.split(':')[1],end1.split(':')[0],end1.split(':')[1]);
    }else{
        end1minObj.value = '';
        end1sedObj.value = '';
        end1minObj.disabled = true;
        end1sedObj.disabled = true;
    }

    if(beg2!='null'&&beg2.length>0){
        beg2minObj.value = beg2.split(':')[0];
        beg2sedObj.value = beg2.split(':')[1];
        beg2minObj.disabled = false;
        beg2sedObj.disabled = false;
    }else{
        beg2minObj.value = '';
        beg2sedObj.value = '';
        beg2minObj.disabled = true;
        beg2sedObj.disabled = true;
    }

    if(end2!='null'&&end2.length>0){
        end2minObj.value = end2.split(':')[0];
        end2sedObj.value = end2.split(':')[1];
        end2minObj.disabled = false;
        end2sedObj.disabled = false;
        time2 = getHoursBetweenTwoTime(beg2.split(':')[0],beg2.split(':')[1],end2.split(':')[0],end2.split(':')[1]);
    }else{
        end2minObj.value = '';
        end2sedObj.value = '';
        end2minObj.disabled = true;
        end2sedObj.disabled = true;
    }
    //选择后新的当日工时
    worktime = time1 + time2;
    refreshDayWeekMonthWorkTime(idStr,worktime,activeTabId);
}
//获取新的当天工时
function getDayWorkTime(idStr){
    var beg1minObj = document.getElementById(idStr+'1begmin');
    var beg1sedObj = document.getElementById(idStr+'1begsed');
    var end1minObj = document.getElementById(idStr+'1endmin');
    var end1sedObj = document.getElementById(idStr+'1endsed');
    var beg2minObj = document.getElementById(idStr+'2begmin');
    var beg2sedObj = document.getElementById(idStr+'2begsed');
    var end2minObj = document.getElementById(idStr+'2endmin');
    var end2sedObj = document.getElementById(idStr+'2endsed');

    var beg1min = beg1minObj.value;
    var beg1sed = beg1sedObj.value;
    var end1min = end1minObj.value;
    var end1sed = end1sedObj.value;
    var beg2min = beg2minObj.value;
    var beg2sed = beg2sedObj.value;
    var end2min = end2minObj.value;
    var end2sed = end2sedObj.value;

    var time1 = getHoursBetweenTwoTime(beg1min,beg1sed,end1min,end1sed);
    var time2 = getHoursBetweenTwoTime(beg2min,beg2sed,end2min,end2sed);
    var worktime = time1 + time2;
    return worktime;
}

//更新本周、本月工时
function refreshDayWeekMonthWorkTime(idStr,currDayworktime,activeTabId){
    var dayWorkTimeObj = document.getElementById(idStr+'workTime');
    //选择前的当日工时
    var dayWorkTime = Number(dayWorkTimeObj.value);
    var temp = currDayworktime - dayWorkTime;

    var userId = idStr.split('_')[0];
    var weekWorkTimeObj = document.getElementById(userId + 'weekWorkTime');
    var monthWorkTimeObj = document.getElementById(userId + 'workTime');
    var weekWorkTime = Number(weekWorkTimeObj.value);
    var monthWorkTime = Number(monthWorkTimeObj.value);
    weekWorkTimeObj.value = (weekWorkTime + temp).toFixed(1);
    dayWorkTimeObj.value = Math.round(currDayworktime*10)/10;
    //如果是本月的日期，更新本月工时，否则不更新
    if(verifyCurrDayIsCurrMonth(idStr,activeTabId)){
        monthWorkTimeObj.value = (monthWorkTime + temp).toFixed(1);
    }
}

//判断当前修改的工时的日期是否是本月日期
function verifyCurrDayIsCurrMonth(idStr,activeTabId){
    var grid = Ext.getCmp('schedulingGrid'+activeTabId);
    var currentDateArr = grid.currentDateArr;
    var index = getWeekDayIndex(idStr.split('_')[1]);
    var currentDay = currentDateArr[index];
    var currentMonth = currentDay.substring(0,7);
    var monMonth = currentDateArr[0].substring(0,7);
    if(currentMonth === monMonth){
        return true;
    }else{
        return false;
    }
}
//根据是第几天获取星期字符串,获取是第几天，例如mon是第一天(n=0)
function getWeekDayIndex(str){
    if(str == 'mon'){
        return 0;
    }else if(str == 'tue'){
        return 1;
    }else if(str == 'wed'){
        return 2;
    }else if(str == 'thu'){
        return 3;
    }else if(str == 'fri'){
        return 4;
    }else if(str == 'sta'){
        return 5;
    }else if(str == 'sun'){
        return 6;
    }
}

//验证小时输入框是否输入正确
function verifyHourInput(id,value,activeTabId){
    if(value!=null&&value.length>0){
        if(value.length > 2){
            document.getElementById(id).value = '';
            return;
        }
        var _reg = /^[0-9]*$/;
        if(_reg.test(value)){
            if(parseInt(value)>=0&&parseInt(value)<=24){
                var currDayWorkTime = getDayWorkTime(id.substring(0,id.length - 7));
                refreshDayWeekMonthWorkTime(id.substring(0,id.length - 7),currDayWorkTime,activeTabId);
            }else{
                document.getElementById(id).value = '';
            }
        }else{
            document.getElementById(id).value = '';
        }
    }
}

//验证分钟输入框是否输入正确
function verifyMinInput(id,value,activeTabId){
    if(value!=null&&value.length>0){
        if(value.length > 2){
            document.getElementById(id).value = '';
            return;
        }
        var _reg = /^[0-9]*$/;
        if(_reg.test(value)){
            if(parseInt(value)>=0&&parseInt(value)<=60){
                var currDayWorkTime = getDayWorkTime(id.substring(0,id.length - 7));
                refreshDayWeekMonthWorkTime(id.substring(0,id.length - 7),currDayWorkTime,activeTabId);
            }else{
                document.getElementById(id).value = '';
            }
        }else{
            document.getElementById(id).value = '';
        }
    }
}