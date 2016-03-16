/**
 * 功能说明: 监护中心工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.CareCenterToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['com.dfsoft.icu.nws.HourMinuteSpinner'],
    height: 35,
    border: "0 0 1 0",
    margin: "-1 0 0 0",
    constructor: function(config) {
        this.careCenterPanel = null;//监护中心面板，由参数传入
        this.scheduling = null;//班次对象，由参数传入
        this.currentScheduling = null;//当前班次值，由参数传入

        Ext.apply(this, config);
        var proxy = this;

        this.isFirst = true;//第一次打开页面
        this.initSechedulingTypeName = null;//初始化时的班次信息

        //班次值
        this.setSchedulingField = function() {
            proxy.beginDatefield.setValue(proxy.currentScheduling.beginDate);
            proxy.beginHourSpinner.setValue(proxy.currentScheduling.beginHour);
            proxy.beginMinuteSpinner.setValue(proxy.currentScheduling.beginMinute);
            proxy.endDatefield.setValue(proxy.currentScheduling.endDate);
            proxy.endHourSpinner.setValue(proxy.currentScheduling.endHour);
            proxy.endMinuteSpinner.setValue(proxy.currentScheduling.endMinute);

            if (proxy.currentScheduling.sechedulingTypeName!="日班" && proxy.currentScheduling.sechedulingTypeName!="夜班") {
                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次");
            } else {
                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次(" + proxy.currentScheduling.sechedulingTypeName + ")");
            }
        }

        //开始日期
        this.beginDatefield = new Ext.form.field.Date({
            width: 220,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '从',
            value: new Date()
        });

        //开始小时
        this.beginHourSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 23,
            value: 0
        });

        //开始分钟
        this.beginMinuteSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 59,
            value: 0
        });

        //结束日期
        this.endDatefield = new Ext.form.field.Date({
            width: 135,
            labelWidth: 15,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '到',
            value: new Date()
        });

        //结束小时
        this.endHourSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 23,
            value: 23
        });

        //结束分钟
        this.endMinuteSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 59,
            value: 59
        });

        //得到开始时间
        this.getBeginDateTime = function() {
            if (! proxy.beginDatefield.isValid()) {
                Ext.MessageBox.alert('提示', '开始日期无效！');
                return null;
            }
            var beginDate = proxy.beginDatefield.getValue();
            var beginHour = proxy.beginHourSpinner.getValue();
            var beginMinute = proxy.beginMinuteSpinner.getValue();
            if (beginDate==null) {
                Ext.MessageBox.alert('提示', '请选择开始日期！');
                return null;
            }
            if (beginHour==null) {
                Ext.MessageBox.alert('提示', '请选择开始时间！');
                return null;
            }
            if (beginMinute==null) {
                Ext.MessageBox.alert('提示', '请选择开始时间！');
                return null;
            }
            beginDate.setHours(beginHour);
            beginDate.setMinutes(beginMinute);
            return beginDate;
        }

        //得到开始时间
        this.getEndDateTime = function() {
            if (! proxy.endDatefield.isValid()) {
                Ext.MessageBox.alert('提示', '结束日期无效！');
                return null;
            }
            var endDate = proxy.endDatefield.getValue();
            var endHour = proxy.endHourSpinner.getValue();
            var endMinute = proxy.endMinuteSpinner.getValue();
            if (endDate==null) {
                Ext.MessageBox.alert('提示', '请选择结束日期！');
                return null;
            }
            if (endHour==null) {
                Ext.MessageBox.alert('提示', '请选择结束时间！');
                return null;
            }
            if (endMinute==null) {
                Ext.MessageBox.alert('提示', '请选择结束时间！');
                return null;
            }
            endDate.setHours(endHour);
            endDate.setMinutes(endMinute);
            return endDate;
        }

        //查询前设置开始结束时间
        this.refreshBefore = function() {
            var beginDateTime = proxy.getBeginDateTime();
            var endDateTime = proxy.getEndDateTime();
            if (beginDateTime==null || endDateTime==null) {
                return null;
            }
            if (beginDateTime > endDateTime) {
                Ext.MessageBox.alert('提示', '开始时间不能大于结束时间！');
                return null;
            }
            //定制分页
            if (proxy.currentScheduling.sechedulingTypeName=="定制") {
                proxy.pageCustomDate();
                if (proxy.pageCustomDateArray.length>0) {
                    beginDateTime = proxy.pageCustomDateArray[0].beginDateTime;
                    endDateTime = proxy.pageCustomDateArray[0].endDateTime;
                }
            }
            return {beginDateTime: beginDateTime, endDateTime: endDateTime};
        }

        //刷新
        this.refreshButton = new Ext.button.Button({
            iconCls: 'refresh-button',
            handler: function() {
                var beginEndDateTime = proxy.refreshBefore();
                if (beginEndDateTime==null) {
                    return;
                }
                //遮罩效果
                proxy.careCenterPanel.loadMask.show();
                proxy.careCenterPanel.iframePanel.iframe.contentWindow.careCenter.setTime(beginEndDateTime.beginDateTime, beginEndDateTime.endDateTime);
                if (proxy.currentScheduling.sechedulingTypeName=="日班" || proxy.currentScheduling.sechedulingTypeName=="夜班") {
                    //判断上下班次是否存在
                    proxy.isPrevNextSchedulingValid();
                }
            }
        });

        //判断是否跨天
        this.isCrossDay = function(time) {
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
            return beginTime>endTime;
        }

        //取上一班次
        this.findPrevScheduling = function(currDate) {
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/carecenter/findprevnexttimescheduling',
                method: 'post',
                async: false,
                params : {
                    schedulingTypeId: proxy.currentScheduling.sechedulingTypeId
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            if (proxy.isCrossDay(result.data[0])) {
                                currDate = new Date((new Date(currDate)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                            }
                            proxy.careCenterPanel.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id, null, 1);
                            proxy.currentScheduling = proxy.careCenterPanel.currentScheduling;
                            proxy.setSchedulingField();
                            setTimeout(function(){proxy.refreshButton.handler();}, 500);
                        } else {
//                            Ext.MessageBox.alert('提示', '已经到第一班次！');//不在提示
                        }
                    }
                }
            });
        }

        //取下一班次
        this.findNextScheduling = function(currDate) {
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/carecenter/findprevnexttimescheduling',
                method: 'post',
                async: false,
                params : {
                    schedulingTypeId: proxy.currentScheduling.sechedulingTypeId
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            if (proxy.isCrossDay(result.data[0])) {
                                currDate = new Date((new Date(currDate)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                            }
                            proxy.careCenterPanel.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id, null, 2);
                            proxy.currentScheduling = proxy.careCenterPanel.currentScheduling;
                            proxy.setSchedulingField();
                            setTimeout(function(){proxy.refreshButton.handler();}, 500);
                        } else {
//                            Ext.MessageBox.alert('提示', '已经到最后一班次！');//不再提示
                        }
                    }
                }
            });
        }

        //上一班次
        this.beforeButton = new Ext.button.Button({
            iconCls: 'day-before-button',
            tooltip: '上一班次',
            handler: function() {
                var currDate = proxy.beginDatefield.getValue().Format("yyyy-MM-dd");
                //取上一班次
                proxy.findPrevScheduling(currDate);
                //判断上下班次是否存在
                proxy.isPrevNextSchedulingValid();
            }
        });

        //下一班次
        this.afterButton = new Ext.button.Button({
            iconCls: 'day-after-button',
            tooltip: '下一班次',
            handler: function() {
                var currDate = proxy.endDatefield.getValue().Format("yyyy-MM-dd");
                //取下一班次
                proxy.findNextScheduling(currDate);
                //判断上下班次是否存在
                proxy.isPrevNextSchedulingValid();
            }
        });

        //上一天
        this.beforeDayButton = new Ext.button.Button({
            iconCls: 'day-before-button',
            tooltip: '上一天',
            hidden: true,
            handler: function() {
                proxy.pageCustomDateIndex = proxy.pageCustomDateIndex - 1;
                var beginDateTime = proxy.pageCustomDateArray[proxy.pageCustomDateIndex].beginDateTime;
                var endDateTime = proxy.pageCustomDateArray[proxy.pageCustomDateIndex].endDateTime;
                proxy.careCenterPanel.loadMask.show();
                proxy.careCenterPanel.iframePanel.iframe.contentWindow.careCenter.setTime(beginDateTime, endDateTime);
                proxy.beforeDayButton.setDisabled(proxy.pageCustomDateIndex==0);
                proxy.afterDayButton.setDisabled(false);
            }
        });

        //下一天
        this.afterDayButton = new Ext.button.Button({
            iconCls: 'day-after-button',
            tooltip: '下一天',
            hidden: true,
            handler: function() {
                proxy.pageCustomDateIndex = proxy.pageCustomDateIndex + 1;
                var beginDateTime = proxy.pageCustomDateArray[proxy.pageCustomDateIndex].beginDateTime;
                var endDateTime = proxy.pageCustomDateArray[proxy.pageCustomDateIndex].endDateTime;
                proxy.careCenterPanel.loadMask.show();
                proxy.careCenterPanel.iframePanel.iframe.contentWindow.careCenter.setTime(beginDateTime, endDateTime);
                proxy.beforeDayButton.setDisabled(false);
                proxy.afterDayButton.setDisabled(proxy.pageCustomDateIndex==proxy.pageCustomDateArray.length-1);
            }
        });

        //根据定制开始时间和结束时间，产生分页时间数组
        this.pageCustomDate = function() {
            var beginDate = proxy.beginDatefield.getValue();
            var beginHour = proxy.beginHourSpinner.getValue();
            var beginMinute = proxy.beginMinuteSpinner.getValue();

            var endDate = proxy.endDatefield.getValue();
            var endHour = proxy.endHourSpinner.getValue();
            var endMinute = proxy.endMinuteSpinner.getValue();

            this.pageCustomDateArray = [];
            this.pageCustomDateIndex = 0;
            //如果结束日期和开始日期时间间隔超过一天，产生分页数据；按24小时产生分页数据，王小伟2014-08-06
            var beginDateTime = new Date(beginDate.getTime())
            beginDateTime.setHours(beginHour);
            beginDateTime.setMinutes(0);
            var endDateTime = new Date(endDate.getTime())
            endDateTime.setHours(endHour);
            endDateTime.setMinutes(endMinute);
            if (beginDateTime.getTime()<endDateTime.getTime() && endDateTime.getTime()-beginDateTime.getTime()>24*60*60*1000) {
                var currDate = new Date(beginDateTime.getTime());
                while(currDate.getTime()<=endDateTime.getTime()) {
                    this.pageCustomDateArray.push({beginDateTime: currDate, endDateTime: new Date(currDate.getTime() + 24*60*60*1000)});
                    currDate = new Date(currDate.getTime() + 24*60*60*1000);
                }

                proxy.beforeDayButton.setDisabled(true);
                proxy.afterDayButton.setDisabled(proxy.pageCustomDateArray.length<=1);
            } else {
                proxy.beforeDayButton.setDisabled(true);
                proxy.afterDayButton.setDisabled(true);
            }
        }

        //上一班次是否有效，用于设置按钮
        this.isPrevSchedulingValid = function(currDate) {
            var isValid = false;
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/carecenter/findprevdatescheduling',
                method: 'post',
                async: false,
                params : {
                    userId: userInfo.userId,
                    date: currDate
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            isValid = true;
                        }
                    }
                }
            });
            return isValid;
        }

        //下一班次是否有效，用于设置按钮
        this.isNextSchedulingValid = function(currDate) {
            var isValid = false;
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/carecenter/findnextdatescheduling',
                method: 'post',
                async: false,
                params : {
                    userId: userInfo.userId,
                    date: currDate
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            isValid = true;
                        }
                    }
                }
            });
            return isValid;
        }

        //判断当前班次时间的上一班次或下一班次是否有效，用于设置按钮
        this.isPrevNextSchedulingValid = function() {
            var beginDate = proxy.beginDatefield.getValue();
            var beginHour = proxy.beginHourSpinner.getValue();
            var beginMinute = proxy.beginMinuteSpinner.getValue();

            var endDate = proxy.endDatefield.getValue();
            var endHour = proxy.endHourSpinner.getValue();
            var endMinute = proxy.endMinuteSpinner.getValue();

            var beginDateTime = new Date(beginDate.getTime())
            beginDateTime.setHours(beginHour);
            beginDateTime.setMinutes(beginMinute);

            var endDateTime = new Date(endDate.getTime())
            endDateTime.setHours(endHour);
            endDateTime.setMinutes(endMinute);

            //判断上一班次是否有效
            var patientInfo = proxy.careCenterPanel.nwsApp.bedPanel.patientInfo;
            if (typeof(patientInfo)!="undefined" && patientInfo != null && typeof(patientInfo.IN_TIME)!="undefined") {
                proxy.beforeButton.setDisabled(beginDateTime.getTime()<=(new Date(patientInfo.IN_TIME)).getTime());
            } else {
                proxy.beforeButton.setDisabled(false);
            }

            //判断下一班次是否有效
            proxy.afterButton.setDisabled(endDateTime.getTime()>=(new Date()).getTime());
        }

        //班次信息
        this.schedulingLabel = new Ext.form.Label({
            xtype: 'label',
            text: '班次'
        });

        //根据数据期间类型，更改按钮状态
        this.dateRadioGroupChange = function(newValue, isRefresh) {
            if (newValue=="custom") {
                proxy.beginDatefield.setDisabled(false);
                proxy.beginHourSpinner.setDisabled(false);
                proxy.beginMinuteSpinner.setDisabled(false);

                proxy.endDatefield.setDisabled(false);
                proxy.endHourSpinner.setDisabled(false);
                proxy.endMinuteSpinner.setDisabled(false);

                proxy.beforeButton.setVisible(false);
                proxy.afterButton.setVisible(false);
                proxy.refreshButton.setDisabled(false);

                proxy.beforeDayButton.setVisible(true);
                proxy.afterDayButton.setVisible(true);

                proxy.currentScheduling.sechedulingTypeName = "定制";
                proxy.beforeDayButton.setDisabled(true);
                proxy.afterDayButton.setDisabled(true);

                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次");
                //根据患者入科时间和当前时间设置开始结束时间
                var patientInfo = proxy.careCenterPanel.nwsApp.bedPanel.patientInfo;
                if (typeof(patientInfo)!="undefined" && patientInfo != null) {
                    if (typeof(patientInfo.IN_TIME)!="undefined"
                        && patientInfo.IN_TIME!=null && patientInfo.IN_TIME.length>=16) {
                        proxy.beginDatefield.setValue(patientInfo.IN_TIME.substring(0,10));
                        proxy.beginHourSpinner.setValue(patientInfo.IN_TIME.substring(11,13));
                        proxy.beginMinuteSpinner.setValue(patientInfo.IN_TIME.substring(14,16));
                    }
                    proxy.endDatefield.setValue((new Date()).Format("yyyy-MM-dd"));
                    proxy.endHourSpinner.setValue((new Date()).Format("hh"));
                    proxy.endMinuteSpinner.setValue((new Date()).Format("mm"));
                }
                if (isRefresh==true) {
                    setTimeout(function(){proxy.refreshButton.handler();}, 500);
                }
            } else if (newValue=="day") {
                proxy.beginDatefield.setDisabled(true);
                proxy.beginHourSpinner.setDisabled(true);
                proxy.beginMinuteSpinner.setDisabled(true);

                proxy.endDatefield.setDisabled(true);
                proxy.endHourSpinner.setDisabled(true);
                proxy.endMinuteSpinner.setDisabled(true);

                proxy.beforeButton.setVisible(true);
                proxy.afterButton.setVisible(true);
                proxy.beforeButton.setDisabled(true);
                proxy.afterButton.setDisabled(true);
//                proxy.refreshButton.setDisabled(true);

                proxy.beforeDayButton.setVisible(false);
                proxy.afterDayButton.setVisible(false);

                proxy.currentScheduling.beginDate = new Date().Format("yyyy-MM-dd");
                proxy.currentScheduling.beginHour = globalBeginTime.substring(0, 2);
                proxy.currentScheduling.beginMinute = globalBeginTime.substring(3, 5);
                proxy.currentScheduling.endDate = new Date().Format("yyyy-MM-dd");
                proxy.currentScheduling.endHour = globalEndTime.substring(0, 2);
                proxy.currentScheduling.endMinute = globalEndTime.substring(3, 5);
                proxy.currentScheduling.sechedulingTypeName = "全天";
                //判断是否跨天
                if (globalBeginTime>globalEndTime) {
                    //判断当前时间是否小于开始时间，开始日期减一
                    if ((new Date()).Format("hh:mm")<globalBeginTime) {
                        proxy.currentScheduling.beginDate = new Date((new Date()).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                    } else {
                        proxy.currentScheduling.endDate = new Date((new Date()).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                    }
                }

                //设置按钮值
                proxy.setSchedulingField();

                //执行刷新按钮，首次页面打开时不用执行，防止重复执行
                if (proxy.isFirst==true) {
                    proxy.isFirst = false;
                } else {
                    if (isRefresh==true) {
                        proxy.refreshButton.handler();
                    }
                }
            } else {
                proxy.beginDatefield.setDisabled(true);
                proxy.beginHourSpinner.setDisabled(true);
                proxy.beginMinuteSpinner.setDisabled(true);

                proxy.endDatefield.setDisabled(true);
                proxy.endHourSpinner.setDisabled(true);
                proxy.endMinuteSpinner.setDisabled(true);

                proxy.beforeButton.setVisible(true);
                proxy.afterButton.setVisible(true);
                proxy.beforeButton.setDisabled(false);
                proxy.afterButton.setDisabled(false);
//                proxy.refreshButton.setDisabled(true);

                proxy.beforeDayButton.setVisible(false);
                proxy.afterDayButton.setVisible(false);

                //执行刷新按钮，首次页面打开时不用执行，防止重复执行
                if (proxy.isFirst==true) {
                    proxy.setSchedulingField();
                    //判断上下班次是否存在
                    proxy.isPrevNextSchedulingValid();
                    proxy.isFirst = false;
                } else {
                    //检索当前班次信息
                    proxy.careCenterPanel.findcurrdatescheduling();
                    proxy.currentScheduling = proxy.careCenterPanel.currentScheduling;
                    proxy.setSchedulingField();
                    //判断上下班次是否存在
                    proxy.isPrevNextSchedulingValid();
                    //取明天之前的班次信息
//                    var nextDay = new Date( (new Date).getTime() + (24*60*60*1000) );
//                    proxy.currentScheduling.beginDate = nextDay.Format("yyyy-MM-dd");
//                    proxy.currentScheduling.beginHour = 0;
//                    proxy.currentScheduling.beginMinute = 0;
//                    proxy.currentScheduling.endDate = nextDay.Format("yyyy-MM-dd");
//                    proxy.currentScheduling.endHour = 23;
//                    proxy.currentScheduling.endMinute = 59;
//                    proxy.currentScheduling.sechedulingTypeName = "全天";
//                    proxy.setSchedulingField();
                    if (isRefresh==true) {
                        proxy.refreshButton.handler();
                    }
                }
            }
        }

        this.dateRadioGroupName = "rb" + (new Date()).getTime();

        //数据期间类型
        this.dateRadioGroup = new Ext.form.RadioGroup({
            fieldLabel: '数据',
            labelWidth: 30,
            columns: [50, 50, 80],
            items: [
                { boxLabel: '定制', name: proxy.dateRadioGroupName, inputValue: 'custom'},
                { boxLabel: '全天', name: proxy.dateRadioGroupName, inputValue: 'day'},
                { boxLabel: '班次(日班)', name: proxy.dateRadioGroupName, inputValue: 'scheduling'}
            ],
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    proxy.dateRadioGroupChange(newValue[proxy.dateRadioGroupName], true);
                }
            }
        });

        this.callParent([{
            items: [proxy.dateRadioGroup, '->',{
                    xtype		: 'container',
                    layout		: 'hbox',
                    items	    : [proxy.beginDatefield, proxy.beginHourSpinner, proxy.beginMinuteSpinner]
                },{
                    xtype		: 'container',
                    layout		: 'hbox',
                    items	    : [proxy.endDatefield, proxy.endHourSpinner, proxy.endMinuteSpinner]
                },
                proxy.refreshButton, '-',
                proxy.beforeButton, proxy.afterButton, this.beforeDayButton, this.afterDayButton],
            listeners: {
                afterRender: function(component, eOpts) {
                    //设置按钮状态
                    proxy.initSechedulingTypeName = proxy.currentScheduling.sechedulingTypeName;
                    if (proxy.initSechedulingTypeName=="全天") {
                        proxy.dateRadioGroup.items.items[1].setValue(true);
                    } else {
                        proxy.dateRadioGroup.items.items[2].setValue(true);
                    }
                }
            }
        }]);
    }

});
