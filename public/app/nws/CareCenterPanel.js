/**
 * 功能说明: 监护中心panel
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.CareCenterPanel', {
    extend: 'Ext.Panel',
    requires: ['com.dfsoft.icu.nws.CareCenterToolbar'],
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        //当前班次对象
        proxy.currentScheduling = {};

        //设置班次
        this.setScheduling = function(date, time, sechedulingTypeName, sechedulingTypeId, currTime, isPrevNext) {
            var beginTime, endTime;
            //设置开始时间
            if (time.TIME_1ST_BEGIN!=null && time.TIME_1ST_BEGIN!="") {
                beginTime = time.TIME_1ST_BEGIN;
            } else {
                beginTime = time.TIME_2ND_BEGIN;
            }
            //设置结束时间
            if (time.TIME_2ND_END!=null && time.TIME_2ND_END!="") {
                endTime = time.TIME_2ND_END;
            } else {
                endTime = time.TIME_1ST_END;
            }
            //设置班次值
            proxy.currentScheduling.beginDate = date;
            proxy.currentScheduling.beginHour = beginTime.substring(0,2);
            proxy.currentScheduling.beginMinute = beginTime.substring(3,5);
            proxy.currentScheduling.endDate = date;
            proxy.currentScheduling.endHour = endTime.substring(0,2);
            proxy.currentScheduling.endMinute = endTime.substring(3,5);
            proxy.currentScheduling.sechedulingTypeName = sechedulingTypeName;
            proxy.currentScheduling.sechedulingTypeId = sechedulingTypeId;
            proxy.currentScheduling.currSechedulingNo = 1;
            //判断是否跨天
            if (beginTime>endTime) {
                //判断当前时间是否小于开始时间，开始日期减一
                if (typeof(currTime)!="undefined" && currTime!=null) {
                    if (currTime<globalBeginTime) {
                        proxy.currentScheduling.beginDate = new Date((new Date(date)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                    } else {
                        proxy.currentScheduling.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                    }
                //向上翻页
                } else if (isPrevNext==1) {
                    proxy.currentScheduling.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                //向下翻页
                } else if (isPrevNext==2) {
                    proxy.currentScheduling.beginDate = new Date((new Date(date)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                }
            }
        }

        //设置为全天
        this.setWholeDateScheduling = function() {
            proxy.currentScheduling.beginDate = new Date().Format("yyyy-MM-dd");
            proxy.currentScheduling.beginHour = globalBeginTime.substring(0, 2);
            proxy.currentScheduling.beginMinute = globalBeginTime.substring(3, 5);
            proxy.currentScheduling.endDate = new Date().Format("yyyy-MM-dd");
            proxy.currentScheduling.endHour = globalEndTime.substring(0, 2);
            proxy.currentScheduling.endMinute = globalEndTime.substring(3, 5);
            proxy.currentScheduling.sechedulingTypeName = "全天";
            proxy.currentScheduling.currSechedulingNo = 1;
            //判断是否跨天
            if (globalBeginTime>globalEndTime) {
                //判断当前时间是否小于开始时间，开始日期减一
                if ((new Date()).Format("hh:mm")<globalBeginTime) {
                    proxy.currentScheduling.beginDate = new Date((new Date()).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                } else {
                    proxy.currentScheduling.endDate = new Date((new Date()).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                }
            }
        }

        //当前班次信息
        this.findcurrdatescheduling = function() {
            var currDate = (new Date()).Format("yyyy-MM-dd");
            var currTime = (new Date()).Format("hh:mm:ss");
            Ext.Ajax.request({
                url: webRoot + '/nws/carecenter/findcurrtimescheduling',
                method: 'post',
                async: false,
                params : {
                    time: currTime
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        var currTime = (new Date()).Format("hh:mm");
                        if (result.data.length>0) {
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            proxy.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id, currTime);
                        } else {
                            proxy.setWholeDateScheduling();
                        }
                    }
                }
            });
        }

        //初始化查询班次信息
        this.findcurrdatescheduling();

        //出入量信息
        this.infoLabel = new Ext.form.Label({
            xtype: 'label',
            text: '汇总：日班（入量：xx，出量：xx，平衡：xx），夜班（入量：xx，出量：xx，平衡：xx），全天（入量：xx，出量：xx，平衡：xx）'
        });

        //设置入量出量信息
        this.setInputOutputInfo = function(dayInput, dayOutput, nightInput, nightOutput, allInput, allOutput) {
            if (dayInput==null) {
                dayInput = 0;
            }
            if (dayOutput==null) {
                dayOutput = 0;
            }
            var dayBalance = numSub(dayInput, dayOutput);
            if (nightInput==null) {
                nightInput = 0;
            }
            if (nightOutput==null) {
                nightOutput = 0;
            }
            var nightBalance = numSub(nightInput, nightOutput);
            if (allInput==null) {
                allInput = 0;
            }
            if (allOutput==null) {
                allOutput = 0;
            }
            var allBalance = numSub(allInput, allOutput);
            var inputOutInfo = '汇总：日班（入量：' + dayInput + '，出量：' + dayOutput + '，平衡：' + dayBalance
                + '），夜班（入量：' + nightInput + '，出量：' + nightOutput + '，平衡：' + nightBalance
                + '），全天（入量：' + allInput + '，出量：' + allOutput + '，平衡：' + allBalance + '）';
            this.infoLabel.setText(inputOutInfo);
        }

        this.careCenterToolbar = new com.dfsoft.icu.nws.CareCenterToolbar({
            region: 'north',
            careCenterPanel: proxy,
            scheduling: proxy.scheduling, //当前班次对象
            currentScheduling: proxy.currentScheduling //当前班次值
        });

        var urlParam = "?bedPanelId=" + proxy.nwsApp.bedPanel.getId()
            + "&nwsAppId=" + proxy.nwsApp.id
            + "&careCenterPanelId=" + proxy.getId();
        this.iframePanel = new Ext.Panel({
            xtype: 'panel',
            region: 'center',
            html: '<iframe src="/app/nws/CareCenter.html' + urlParam + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        });

        //创建遮罩效果对象
        this.loadMask = new Ext.LoadMask(proxy.iframePanel, {
            msg: "数据加载中..."
        });

        this.callParent([{
            layout: {
                type: 'border',
                padding: 0
            },
            items: [proxy.careCenterToolbar, proxy.iframePanel,{
                xtype: 'toolbar',
                region: 'south',
                height: 22,
                border: "1 0 0 0",
                padding: "0 0 2 0",
                style: {
                    background: '#F2F2F2'
                },
                items: [proxy.infoLabel]
            }],
            listeners: {
                afterrender: function(panel, eOpts) {
                    //定义iframe对象，不再固定id调用
                    proxy.iframePanel.iframe = getCmpIframe(proxy.iframePanel.el.dom);
                }
            }
        }]);
    }
});
