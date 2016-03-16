/**
 * 监护中心对象
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

var request = getRequestParam();
var bedPanelId = request['bedPanelId'];
var nwsAppId = request['nwsAppId'];
var careCenterPanelId = request['careCenterPanelId'];

com.dfsoft.icu.CareCenter = function(config) {
    if (typeof(window.parent.Ext.getCmp(bedPanelId).patientInfo)=="undefined" ||
        window.parent.Ext.getCmp(bedPanelId).patientInfo == null) {
        this.bedId = null;
    } else {
        this.bedId = window.parent.Ext.getCmp(bedPanelId).patientInfo.REGISTER_ID;//"69c5bdc078fe11e39fd9cb7044fb795e", 改为REGISTER_ID，适应病人换床处理
    }

    Ext.apply(this, config);
    var proxy = this;

    //改变窗口大小
    proxy.onresize = function() {
        //检查是否选择床号
        if (proxy.bedId==null) {
            return;
        }

        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.reset();
        var firstCanvasWidth = proxy.careCenterSerialGraphLive.vitalSignGraphLive.onresize(proxy.careCenterLegendGraphLive.graphLiveArray);
        for(var i=0; i<proxy.careCenterLegendGraphLive.graphLiveArray.length; i++) {
            proxy.careCenterLegendGraphLive.graphLiveArray[i].graphlive.reset();
            proxy.careCenterLegendGraphLive.graphLiveArray[i].onresize(firstCanvasWidth);
        }
        //重绘画布
        setTimeout(function(){
            //防止数据修改，重新读取数据
            proxy.initResult = proxy.initAll(proxy.bedId, proxy.beginDateTime.Format("yyyy-MM-dd hh:mm:ss"),
                proxy.endDateTime.Format("yyyy-MM-dd hh:mm:ss"));
            proxy.resetGraphLive(proxy.beginDateTime, proxy.endDateTime, proxy.initResult);
        }, 500);
    }

    //初始化
    proxy.init = function() {
        var careCenterPanel = window.parent.Ext.getCmp(careCenterPanelId);

        //获取当前班次时间，为了保证开始时间轴为整点，修改开始时间分钟为0,2015-02-04
        var currentScheduling = careCenterPanel.currentScheduling;
        var beginDateTime = currentScheduling.beginDate + " " + currentScheduling.beginHour +
            ":00:00";
        var endDateTime = currentScheduling.endDate + " " + currentScheduling.endHour +
            ":" + currentScheduling.endMinute + ":00";
        //判断toolbar是否已经加载，切换床位后按查询条件显示时间
        if (careCenterPanel.careCenterToolbar) {
            var beginEndDateTime = careCenterPanel.careCenterToolbar.refreshBefore();
            if (beginEndDateTime!=null) {
                beginEndDateTime.beginDateTime.setMinutes(0);
                beginDateTime = beginEndDateTime.beginDateTime.Format("yyyy-MM-dd hh:mm:ss");
                endDateTime = beginEndDateTime.endDateTime.Format("yyyy-MM-dd hh:mm:ss");
            }
        }

        //初始化全部数据，一次初始化所有结果集，王小伟，2014-08-25
        var initResult = null;
        if (proxy.bedId!=null) {
            initResult = proxy.initAll(proxy.bedId, beginDateTime, endDateTime);
        }
        proxy.beginDateTime = new Date(beginDateTime.replace(/-/,"/"));
        proxy.endDateTime = new Date(endDateTime.replace(/-/,"/"));
        proxy.initResult = initResult;

        //设置护理间隔，最小间隔15分钟，支持15、30、60分钟三种时间间隔，每个轴线2个小时
        var careInterval = proxy.findInterval(initResult)/(60*1000);//传入参数，分钟
        var X_AXIS_FIELDS_LENGTH = 24;//X轴总间隔数
        var xAxisInterval = 2;//轴线间隔
        if (careInterval<=15) {
            X_AXIS_FIELDS_LENGTH = 96;
            careInterval = 15;
            xAxisInterval = 8;
        } else if (careInterval>15 && careInterval<=30) {
            X_AXIS_FIELDS_LENGTH = 48;
            careInterval = 30;
            xAxisInterval = 4;
        }

        /***************************************Serial数据******************************************/
        proxy.careCenterSerialGraphLive = new com.dfsoft.icu.CareCenterSerialGraphLive();
        proxy.careCenterSerialGraphLive.init(proxy.bedId, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH,
            careInterval, xAxisInterval, initResult);
        /***************************************Legend数据******************************************/
        proxy.careCenterLegendGraphLive = new com.dfsoft.icu.CareCenterLegendGraphLive();
        proxy.careCenterLegendGraphLive.init(proxy.bedId, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH,
            careInterval, xAxisInterval, initResult);
        //检查是否选择床号
        if (proxy.bedId==null) {
            return;
        }
        //计算出量入量合计
        if (proxy.bedId!=null) {
            window.parent.Ext.getCmp(careCenterPanelId).setInputOutputInfo(
                initResult.inputOutputSumData.dayInput, initResult.inputOutputSumData.dayOutput,
                initResult.inputOutputSumData.nightInput, initResult.inputOutputSumData.nightOutput,
                initResult.inputOutputSumData.input, initResult.inputOutputSumData.output);
        }
        //初始化当前日期div
        this.initCurrBeginDate(beginDateTime);
        //重新计算宽度
        //proxy.onresize();
        var firstCanvasWidth = proxy.careCenterSerialGraphLive.vitalSignGraphLive.onresize(proxy.careCenterLegendGraphLive.graphLiveArray);
        //重绘时间轴
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.time(proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive, proxy.careCenterSerialGraphLive.vitalSignGraphLive.canvasDiv);
        //重绘滚动时间轴，重设时间后，需要手工调用。
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.moveTimelabels(proxy.careCenterSerialGraphLive.vitalSignGraphLive.scrollY,
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.timelineDIV.offsetTop);
        for(var i=0; i<proxy.careCenterLegendGraphLive.graphLiveArray.length; i++) {
            proxy.careCenterLegendGraphLive.graphLiveArray[i].onresize(firstCanvasWidth);
        }
    }

    //初始化全部信息
    proxy.initAll = function(bedId, beginDateTime, endDateTime) {
        var resultAll;
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/initAll',
            method: 'post',
            async: false,
            params : {
                bedId: bedId,
                beginDateTime: beginDateTime,
                endDateTime: endDateTime
            },
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    resultAll = result.data;
                }
            }
        });
        return resultAll;
    }

    //按时间查询数据，不再查询图例信息
    proxy.initTime = function(bedId, beginDateTime, endDateTime) {
        var resultAll;
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/initTime',
            method: 'post',
            async: false,
            params : {
                bedId: bedId,
                beginDateTime: beginDateTime,
                endDateTime: endDateTime,
                vitalSignLegendData: Ext.encode(proxy.careCenterSerialGraphLive.legendDefineArray),
                otherLegendData: Ext.encode(proxy.careCenterLegendGraphLive.legendDefineArray)
            },
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    resultAll = result.data;
                }
            }
        });
        return resultAll;
    }

    //检索间隔时间，毫秒
    proxy.findInterval = function(initResult) {
        var intervalTime = 60*1000;
        if (proxy.bedId==null) {
            return intervalTime;
        }
        return initResult.vitalSignLegendData.interval;
    }

    //设置时间
    proxy.setTime = function(beginDateTime, endDateTime) {
        if (proxy.bedId==null) {
            //隐藏loadmask
            window.parent.Ext.getCmp(careCenterPanelId).loadMask.hide();
            return null;
        }
        //检索所有数据，王小伟，2014-08-25，为了保证开始时间轴为整点，修改开始时间分钟为0,2015-02-04
        beginDateTime.setMinutes(0);
        var initResult = proxy.initTime(proxy.bedId, beginDateTime.Format("yyyy-MM-dd hh:mm:ss"), endDateTime.Format("yyyy-MM-dd hh:mm:ss"));

        proxy.initResult = initResult;
        proxy.beginDateTime = beginDateTime;
        proxy.endDateTime = endDateTime;
        //清除数据
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderStart();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.reset();
        for(var i=0; i<proxy.careCenterLegendGraphLive.graphLiveArray.length; i++) {
            proxy.careCenterLegendGraphLive.graphLiveArray[i].graphlive.batchRenderStart();
            proxy.careCenterLegendGraphLive.graphLiveArray[i].graphlive.reset();
        }
        //重绘画布
        proxy.resetGraphLive(beginDateTime, endDateTime, initResult);
        //计算入量出量合计值
        window.parent.Ext.getCmp(careCenterPanelId).setInputOutputInfo(
            initResult.inputOutputSumData.dayInput, initResult.inputOutputSumData.dayOutput,
            initResult.inputOutputSumData.nightInput, initResult.inputOutputSumData.nightOutput,
            initResult.inputOutputSumData.input, initResult.inputOutputSumData.output);
        //初始化当前日期div
        this.initCurrBeginDate(beginDateTime.Format("yyyy-MM-dd hh:mm:ss"));
        //隐藏loadmask
        window.parent.Ext.getCmp(careCenterPanelId).loadMask.hide();
    }

    //重绘画布
    proxy.resetGraphLive = function(beginDateTime, endDateTime, initResult) {
        //计算执行时间
        var startTime,endTime;
        var d=new Date();
        startTime=d.getTime();

        //图形批量开始
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.clearContextMenu();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderStart();

        //proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.reset();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.beginDateTime = beginDateTime;
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.endDateTime = endDateTime;
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.setXAxis();
        //重绘时间轴
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.time(proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive, proxy.careCenterSerialGraphLive.vitalSignGraphLive.canvasDiv);
        //重绘滚动时间轴，重设时间后，需要手工调用。
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.moveTimelabels(proxy.careCenterSerialGraphLive.vitalSignGraphLive.scrollY,
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.timelineDIV.offsetTop);
        //根据图例加载序列
        proxy.careCenterSerialGraphLive.addVitalSignSerials(proxy.careCenterSerialGraphLive.legendDefineArray);
        //添加序列数据
        proxy.careCenterSerialGraphLive.doAddVitalSignData(initResult.vitalSignLegendCareCenterData);
        for(var i=0; i<proxy.careCenterLegendGraphLive.graphLiveArray.length; i++) {
            //proxy.careCenterLegendGraphLive.graphLiveArray[i].graphlive.reset();
            proxy.careCenterLegendGraphLive.graphLiveArray[i].beginDateTime = beginDateTime;
            proxy.careCenterLegendGraphLive.graphLiveArray[i].endDateTime = endDateTime;
            proxy.careCenterLegendGraphLive.graphLiveArray[i].setXAxis();
        }
        //添加血气序列数据
        proxy.careCenterSerialGraphLive.doAddBloodVitalSignData(initResult.bloodCareCenterData);
        //添加降温数据
        proxy.careCenterSerialGraphLive.doAddCoolingVitalSignData(initResult.coolingCareCenterData);

        //屏蔽冲突项
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.hideConflict();
        //图形批量开始
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderEnd();

        //计算执行时间
        d=new Date();
        endTime=d.getTime();
        console.log("CareCenter.careCenterSerialGraphLive重绘画布执行时间：" + ((endTime-startTime)/1000));

        //计算执行时间
        d=new Date();
        startTime=d.getTime();

        //添加甘特数据
        for (var i=0; i<proxy.careCenterLegendGraphLive.ganttRowArray.length; i++) {
            proxy.careCenterLegendGraphLive.doAddVitalSignData(proxy.careCenterLegendGraphLive.ganttRowArray[i], initResult.otherLegendData[i].otherLegendCareCenterData);
        }

        //计算执行时间
        d=new Date();
        endTime=d.getTime();
        console.log("CareCenter.careCenterLegendGraphLive重绘画布执行时间：" + ((endTime-startTime)/1000));
    }

    //得到发送请求数据消息对象
    proxy.findRequestDateMessage = function() {
        var data = {};
        data.bedId = proxy.bedId; //床号
        //折线序列需要的监护项
        var serialBedItemIdArray = [];
        for (var k=0; k<proxy.careCenterSerialGraphLive.legendDefineArray.length; k++) {
            serialBedItemIdArray.push(proxy.careCenterSerialGraphLive.legendDefineArray[k].id);
        }
        data.serialBedItemIdArray = serialBedItemIdArray;
        //甘特图需要的监护项
        var ganttBedItemIdArray = [];
        for (var i=0; i<proxy.careCenterLegendGraphLive.ganttRowArray.length; i++) {
            var bedItemIdArray = [];//需要查询的序列ID
            for (var k=0; k<proxy.careCenterLegendGraphLive.ganttRowArray[i].data.length; k++) {
                bedItemIdArray.push(proxy.careCenterLegendGraphLive.ganttRowArray[i].data[k].id);
            }
            ganttBedItemIdArray.push(bedItemIdArray);
        }
        data.ganttBedItemIdArray = ganttBedItemIdArray;
        return data;
    }

    //定时接收数据
    this.receiveDataByTime = function(iosocket) {
        iosocket.on('connect', function () {
            console.log("连接上socket服务器了！！！！");
            iosocket.on('disconnect', function() {
                console.log("断开socket服务器了！");
            });
            iosocket.on('incrementData', function(data) {
                //结束时间大于当前时间再增加节点
                if (proxy.careCenterSerialGraphLive.vitalSignGraphLive.endDateTime.getTime() >
                    (new Date()).getTime()) {
                    //图形批量开始
                    proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderStart();

                    proxy.careCenterSerialGraphLive.doAddVitalSignData(data.serialdata);
                    proxy.careCenterSerialGraphLive.doAddBloodVitalSignData(data.blooddata);
                    proxy.careCenterSerialGraphLive.doAddCoolingVitalSignData(data.coolingdata);

                    //图形批量结束
                    proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderEnd();

                    for (var i=0; i<data.ganttdata.length; i++) {
                        var legendRowRelation = proxy.careCenterLegendGraphLive.ganttRowArray[data.ganttdata[i].graphliveNo];

                        //图形批量开始
                        proxy.careCenterLegendGraphLive[legendRowRelation.graphLiveId].graphlive.batchRenderStart();

                        proxy.careCenterLegendGraphLive.doAddVitalSignData(legendRowRelation, data.ganttdata[i].data);

                        //图形批量结束
                        proxy.careCenterLegendGraphLive[legendRowRelation.graphLiveId].graphlive.batchRenderEnd();
                    }
                }
            });
            //判断是否选择床号
            if (proxy.bedId!=null) {
                var data = proxy.findRequestDateMessage();
                setTimeout(function(){
                    iosocket.emit('carecenterstart', data);
                },1000);
            }
        });

    }

    //初始化当前日期显示
    this.initCurrBeginDate = function(beginDateTime) {
        //创建div
        var currBeginDateDiv = document.getElementById("currBeginDateDiv");
        if (!currBeginDateDiv) {
            var currBeginDateDiv = document.createElement("div");
            currBeginDateDiv.className = "currBeginDateDiv";
            currBeginDateDiv.id = "currBeginDateDiv";
            document.body.appendChild(currBeginDateDiv);
        }

        var beginDateTimeObj = new Date(beginDateTime.replace(/-/g,"/"));
        currBeginDateDiv.innerHTML = (beginDateTimeObj).Format("yyyy-MM-dd");
        //调整位置
        proxy.currBeginDateDivOnResize();
    }

    //改变窗口大小时调整当前日期位置
    this.currBeginDateDivOnResize = function() {
        var currBeginDateDiv = document.getElementById("currBeginDateDiv");

        //判断具体位置，向上取整
        var vitalSignLegendTable = document.getElementById("vitalSignLegendTable");
        var top = 2;//vitalSignLegendTable.getBoundingClientRect().top;
        var left = vitalSignLegendTable.getBoundingClientRect().left;

        currBeginDateDiv.style.top = top;
        currBeginDateDiv.style.left = left;
    }

    com.dfsoft.icu.CareCenter.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.CareCenter, com.dfsoft.icu.PublicFunction, {

});