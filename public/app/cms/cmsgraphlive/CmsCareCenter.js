/**
 * 中央监护站床位监护中心对象
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

var request = getRequestParam();
var REGISTER_ID = request['REGISTER_ID'];
com.dfsoft.icu.CmsCareCenter = function(config) {
    this.bedId = REGISTER_ID;//"be3ta2b078fd11e39fd9cb7044fb824h";//window.parent.Ext.getCmp("nws").nwsApp.bedPanel.patientInfo.REGISTER_ID;//改为REGISTER_ID，适应病人换床处理

    Ext.apply(this, config);
    var proxy = this;

    //改变窗口大小
    proxy.onresize = function() {
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.reset();
        var firstCanvasWidth = proxy.careCenterSerialGraphLive.vitalSignGraphLive.onresize([]);
        setTimeout(function(){
            proxy.setTime();
        }, 200);
    }

    //初始化
    proxy.init = function() {
        /***************************************Serial数据******************************************/
        proxy.careCenterSerialGraphLive = new com.dfsoft.icu.CmsCareCenterSerialGraphLive();
        proxy.careCenterSerialGraphLive.init(proxy.bedId);
        //重新计算宽度
        //proxy.onresize();
        var firstCanvasWidth = proxy.careCenterSerialGraphLive.vitalSignGraphLive.onresize([]);
        proxy.setTime();
    }


    //设置时间
    proxy.setTime = function() {
        if (proxy.bedId==null) {
            return null;
        }
        //清除菜单
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.clearContextMenu();

        //计算执行时间
        var startTime,endTime;
        var d=new Date();
        startTime=d.getTime();

        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderStart();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.reset();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.setXAxis();
        //根据图例加载序列
        proxy.careCenterSerialGraphLive.addVitalSignSerials(proxy.careCenterSerialGraphLive.legendDefineArray);
        //添加序列数据
        proxy.careCenterSerialGraphLive.addVitalSignData(proxy.careCenterSerialGraphLive.legendDefineArray,
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.beginDateTime.Format("yyyy-MM-dd hh:mm:ss"),
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.endDateTime.Format("yyyy-MM-dd hh:mm:ss"));

        //屏蔽冲突项
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.hideConflict();
        proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive.batchRenderEnd();

        //计算执行时间
        d=new Date();
        endTime=d.getTime();
        console.log("CmsCareCenter重绘画布执行时间：" + ((endTime-startTime)/1000));

        //重绘时间轴，延迟执行，防止由于div没有加载完而导致坐标位置错误
        setTimeout(function() {
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.time(proxy.careCenterSerialGraphLive.vitalSignGraphLive.graphlive,
                proxy.careCenterSerialGraphLive.vitalSignGraphLive.canvasDiv);
        },500);

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
        data.ganttBedItemIdArray = [];
        return data;
    }

    //定时接收数据
    this.receiveDataByTime = function() {
        window.setInterval(function() {
            proxy.careCenterSerialGraphLive.vitalSignGraphLive.computerBeginEndDateTime();
            proxy.setTime();
        }, 60000);
    }

    com.dfsoft.icu.CmsCareCenter.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.CmsCareCenter, com.dfsoft.icu.PublicFunction, {

});