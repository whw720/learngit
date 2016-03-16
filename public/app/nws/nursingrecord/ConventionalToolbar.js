/**
 * 功能说明: 护理记录-常规工具栏
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['com.dfsoft.icu.nws.nursingrecord.ConventionalWindow',
        'com.dfsoft.icu.nws.HourMinuteSpinner',
        'com.dfsoft.icu.nws.nursingscores.NursingScoresWindow'],

    constructor: function(config) {
        this.scheduling = null;//班次对象，由参数传入

        Ext.apply(this, config);
        var proxy = this;

        //增加cookie 用于记录监控项目的选择项
        proxy.cookieCol = new Ext.state.CookieProvider();
        Ext.state.Manager.setProvider(proxy.cookieCol);


        this.isFirst = true;//第一次打开页面
        this.initSechedulingTypeName = null;//初始化时的班次信息
        proxy.lastTimeBySechedul=null;  //当前班次的最后时间
        proxy.currentTimeLastSechedul=null;//当前时间所在的班次
        proxy.currentTimeLastSechedulName=null;

        //创建遮罩效果对象
        this.loadMask = new Ext.LoadMask(proxy.nursingRecordApp, {
            msg: "数据加载中..."
        });


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
            proxy.beginDate = date;
            proxy.beginHour = beginTime.substring(0,2);
            proxy.beginMinute = beginTime.substring(3,5);
            proxy.endDate = date;
            proxy.endHour = endTime.substring(0,2);
            proxy.endMinute = endTime.substring(3,5);
            proxy.sechedulingTypeName = sechedulingTypeName;
            proxy.sechedulingTypeId = sechedulingTypeId;
            proxy.currSechedulingNo = 1;
            //判断是否跨天
            if (beginTime>endTime) {
                //判断当前时间是否小于开始时间，开始日期减一
                if (typeof(currTime)!="undefined" && currTime!=null) {
                    if (currTime<globalBeginTime) {
                        proxy.beginDate = new Date((new Date(date)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                    } else {
                        proxy.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                    }
                    //向上翻页
                } else if (isPrevNext==1) {
                    proxy.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                    //向下翻页
                } else if (isPrevNext==2) {
                    proxy.beginDate = new Date((new Date(date)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                }
                //console.log('end:'+proxy.endDate+' start:'+proxy.beginDate);
                //判断当前时间是否小于开始时间，开始日期减一
                /*if ((new Date()).Format("hh:mm")<globalBeginTime) {
                    proxy.beginDate = new Date((new Date(date)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                } else {
                    proxy.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                }*/
                //proxy.endDate = new Date((new Date(date)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
            }
            proxy.lastTimeBySechedul=proxy.endDate+' '+endTime;
        };


        //设置为全天
        this.setWholeDateScheduling = function() {
            proxy.beginDate = new Date().Format("yyyy-MM-dd");
            proxy.beginHour = globalBeginTime.substring(0, 2);
            proxy.beginMinute = globalBeginTime.substring(3, 5);
            proxy.endDate = new Date().Format("yyyy-MM-dd");
            proxy.endHour = globalEndTime.substring(0, 2);
            proxy.endMinute = globalEndTime.substring(3, 5);
            proxy.sechedulingTypeName = "全天";
            proxy.currSechedulingNo = 1;
            //判断是否跨天
            if (globalBeginTime>globalEndTime) {
                //proxy.endDate = new Date((new Date()).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                //判断当前时间是否小于开始时间，开始日期减一
                if ((new Date()).Format("hh:mm")<globalBeginTime) {
                    proxy.beginDate = new Date((new Date()).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                } else {
                    proxy.endDate = new Date((new Date()).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                }
            }
        };

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
                            proxy.currentTimeLastSechedul = result.data[0];
                            proxy.currentTimeLastSechedulName=result.data[0].TYPE_NAME;
                            proxy.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id,currTime,null);
                        } else {
                            proxy.setWholeDateScheduling();
                        }
                    }
                }
            });
        };

        //初始化查询班次信息
        this.findcurrdatescheduling();

        //班次值
        this.setSchedulingField = function() {
            proxy.beginDatefield.setValue(proxy.beginDate);
            proxy.beginHourSpinner.setValue(proxy.beginHour);
            proxy.beginMinuteSpinner.setValue(proxy.beginMinute);
            proxy.endDatefield.setValue(proxy.endDate);
            proxy.endHourSpinner.setValue(proxy.endHour);
            proxy.endMinuteSpinner.setValue(proxy.endMinute);

            if (proxy.sechedulingTypeName!="日班" && proxy.sechedulingTypeName!="夜班") {
                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次");
            } else {
                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次(" + proxy.sechedulingTypeName + ")");
            }
        };
        //下拉树，用来选择显示的列
        this.bedItemTree=Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemComboBoxTrees',{
            bed_id:proxy.nursingRecordApp.patientInfo.BED_ID
        });
        this.bedItemTree.createPicker();

        //开始日期
        this.beginDatefield = new Ext.form.field.Date({
            width: 119,
            labelWidth: 15,
            format: 'Y-m-d',
            editable:false,
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
            width: 119,
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
        };

        //得到结束时间
        this.getEndDateTime = function() {
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
        };
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
                    schedulingTypeId: proxy.sechedulingTypeId
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            if (proxy.isCrossDay(result.data[0])) {
                                currDate = new Date((new Date(currDate)).getTime() - (24*60*60*1000)).Format("yyyy-MM-dd");
                            }
                            proxy.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id, null, 1);
                            //proxy.currentScheduling = proxy.careCenterPanel.currentScheduling;
                            proxy.setSchedulingField();
                            proxy.refreshButton.handler();
                        } else {
//                            Ext.MessageBox.alert('提示', '已经到第一班次！');//不在提示
                        }
                    }
                }
            });
        };

        //取下一班次
        this.findNextScheduling = function(currDate) {
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/carecenter/findprevnexttimescheduling',
                method: 'post',
                async: false,
                params : {
                    schedulingTypeId: proxy.sechedulingTypeId
                },
                success : function(response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data.length>0) {
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            if (proxy.isCrossDay(result.data[0])) {
                                currDate = new Date((new Date(currDate)).getTime() + (24*60*60*1000)).Format("yyyy-MM-dd");
                            }
                            proxy.setScheduling(currDate, result.data[0], result.data[0].TYPE_NAME, result.data[0].id, null, 2);
                            proxy.setSchedulingField();
                            proxy.refreshButton.handler();
                        } else {
                        }
                    }
                }
            });
            /*Ext.Ajax.request({
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
                            proxy.scheduling = result.data[0]; //当前班次信息赋值
                            proxy.setScheduling(result.data[0].DATE, result.data[0], result.data[0].TYPE_NAME);
                            proxy.setSchedulingField();
                            proxy.refreshButton.handler();
                        } else {
//                            Ext.MessageBox.alert('提示', '已经到最后一班次！');//不再提示
                        }
                    }
                }
            });*/
        };

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
                proxy.loadMask.show();
                proxy.nursingRecordApp.beginDateTime = beginDateTime;
                proxy.nursingRecordApp.endDateTime = endDateTime;
                // 重新加载grid
                var grid = proxy.nursingRecordApp;
                grid.fireEvent('beforerender', grid);

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
                proxy.loadMask.show();
                proxy.nursingRecordApp.beginDateTime = beginDateTime;
                proxy.nursingRecordApp.endDateTime = endDateTime;
                // 重新加载grid
                var grid = proxy.nursingRecordApp;
                grid.fireEvent('beforerender', grid);

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
            //如果结束日期和开始日期时间间隔超过一天，产生分页数据
            if (beginDate<endDate && endDate.getTime()-beginDate.getTime()>24*60*60*1000) {
                var currDate = new Date(beginDate.getTime());
                var beginDateTime, endDateTime;
                while(currDate<=endDate) {
                    if (currDate.getTime()==beginDate.getTime()) {
                        beginDateTime = new Date(currDate.getTime());
                        beginDateTime.setHours(beginHour);
                        beginDateTime.setMinutes(beginMinute);

                        endDateTime = new Date(currDate.getTime());
                        endDateTime.setHours(23);
                        endDateTime.setMinutes(59);
                    } else if (currDate.getTime()==endDate.getTime()) {
                        beginDateTime = new Date(currDate.getTime());
                        beginDateTime.setHours(0);
                        beginDateTime.setMinutes(0);

                        endDateTime = new Date(currDate.getTime());
                        endDateTime.setHours(endHour);
                        endDateTime.setMinutes(endMinute);
                    } else {
                        beginDateTime = new Date(currDate.getTime());
                        beginDateTime.setHours(0);
                        beginDateTime.setMinutes(0);

                        endDateTime = new Date(currDate.getTime());
                        endDateTime.setHours(23);
                        endDateTime.setMinutes(59);
                    }
                    this.pageCustomDateArray.push({beginDateTime: beginDateTime, endDateTime: endDateTime});
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
            /*var currDate = proxy.beginDatefield.getValue().Format("yyyy-MM-dd");
            //判断上一班次是否有效
            proxy.beforeButton.setDisabled(false);
            //判断下一班次是否有效
            proxy.afterButton.setDisabled(false);*/

            var beginDate = proxy.beginDatefield.getValue();
            var beginHour = proxy.beginHourSpinner.getValue();
            var beginMinute = proxy.beginMinuteSpinner.getValue();

            var endDate = proxy.endDatefield.getValue();
            var endHour = proxy.endHourSpinner.getValue();
            var endMinute = proxy.endMinuteSpinner.getValue();

            var beginDateTime = new Date(beginDate.getTime());
            beginDateTime.setHours(beginHour);
            beginDateTime.setMinutes(beginMinute);

            var endDateTime = new Date(endDate.getTime());
            endDateTime.setHours(endHour);
            endDateTime.setMinutes(endMinute);

            //判断上一班次是否有效
            var patientInfo = proxy.nursingRecordApp.nwsApp.bedPanel.patientInfo;
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
        this.dateRadioGroupChange = function(newValue) {
            if (newValue=="custom") {
                proxy.beginDatefield.setDisabled(false);
                proxy.beginHourSpinner.setDisabled(false);
                proxy.beginMinuteSpinner.setDisabled(false);

                proxy.endDatefield.setDisabled(false);
                proxy.endHourSpinner.setDisabled(false);
                proxy.endMinuteSpinner.setDisabled(false);


                proxy.beforeButton.setDisabled(true);
                proxy.afterButton.setDisabled(true);

                proxy.sechedulingTypeName = "定制";
                proxy.dateRadioGroup.items.items[2].getEl().down('.x-form-cb-label').update("班次");
                //根据患者入科时间和当前时间设置开始结束时间
                var patientInfo = proxy.nursingRecordApp.patientInfo;
                if (typeof(patientInfo)!="undefined" && patientInfo != null) {
                    Ext.Ajax.request({
                        url: '/icu/nursingRecord/conventional/get/getCaretime',
                        scope: this,
                        method: 'POST',
                        params: {
                            register_id: proxy.nursingRecordApp.patientInfo.REGISTER_ID
                        },
                        success: function (response) {
                            var result = Ext.decode(response.responseText);
                            if(result.data!=null&&result.data.length>0) {
                                var re = result.data[0];
                                if (typeof(re.IN_TIME)!="undefined"
                                    && re.IN_TIME!=null && re.IN_TIME.length==19) {
                                    proxy.beginDatefield.setValue(re.IN_TIME.substring(0,10));
                                    proxy.beginHourSpinner.setValue(re.IN_TIME.substring(11,13));
                                    proxy.beginMinuteSpinner.setValue(re.IN_TIME.substring(14,16));
                                }
                                proxy.endDatefield.setValue((new Date()).Format("yyyy-MM-dd"));
                                proxy.endHourSpinner.setValue((new Date()).Format("hh"));
                                proxy.endMinuteSpinner.setValue((new Date()).Format("mm"));
                                //执行刷新按钮，首次页面打开时不用执行，防止重复执行
                                if (proxy.isFirst==true) {
                                    proxy.isFirst = false;
                                } else {
                                    proxy.refreshButton.handler();
                                }
                            }
                        }
                    });
                }
            } else if (newValue=="day") {
                proxy.beginDatefield.setDisabled(true);
                proxy.beginHourSpinner.setDisabled(true);
                proxy.beginMinuteSpinner.setDisabled(true);

                proxy.endDatefield.setDisabled(true);
                proxy.endHourSpinner.setDisabled(true);
                proxy.endMinuteSpinner.setDisabled(true);

                proxy.beforeButton.setDisabled(true);
                proxy.afterButton.setDisabled(true);

                proxy.setWholeDateScheduling();
                /*proxy.beginDate = new Date().Format("yyyy-MM-dd");
                proxy.beginHour = 0;
                proxy.beginMinute = 0;
                proxy.endDate = new Date().Format("yyyy-MM-dd");
                proxy.endHour = 23;
                proxy.endMinute = 59;
                proxy.sechedulingTypeName = "全天";*/

                //设置按钮值
                proxy.setSchedulingField();

                //执行刷新按钮，首次页面打开时不用执行，防止重复执行
                if (proxy.isFirst==true) {
                    proxy.isFirst = false;
                } else {
                    proxy.refreshButton.handler();
                }
            } else {
                proxy.beginDatefield.setDisabled(true);
                proxy.beginHourSpinner.setDisabled(true);
                proxy.beginMinuteSpinner.setDisabled(true);

                proxy.endDatefield.setDisabled(true);
                proxy.endHourSpinner.setDisabled(true);
                proxy.endMinuteSpinner.setDisabled(true);

                proxy.beforeButton.setDisabled(false);
                proxy.afterButton.setDisabled(false);


                //执行刷新按钮，首次页面打开时不用执行，防止重复执行
                if (proxy.isFirst==true) {
                    proxy.setSchedulingField();
                    proxy.isPrevNextSchedulingValid();
                    proxy.isFirst = false;
                } else {
                    //检索当前班次信息
                    proxy.findcurrdatescheduling();
                    //proxy.currentScheduling = proxy.careCenterPanel.currentScheduling;
                    proxy.setSchedulingField();
                    proxy.refreshButton.handler();
                    //取明天之前的班次信息
                    /*var nextDay = new Date( (new Date).getTime() + (24*60*60*1000) );
                    proxy.beginDate = nextDay.Format("yyyy-MM-dd");
                    proxy.beginHour = 0;
                    proxy.beginMinute = 0;
                    proxy.endDate = nextDay.Format("yyyy-MM-dd");
                    proxy.endHour = 23;
                    proxy.endMinute = 59;
                    proxy.sechedulingTypeName = "全天";
                    proxy.setSchedulingField();
                    proxy.beforeButton.handler();*/
                }
            }
        }

        //数据期间类型
        this.dateRadioGroup = new Ext.form.RadioGroup({
            fieldLabel: '数据',
            labelWidth: 30,
            columns: [50, 50, 80],
            items: [
                { boxLabel: '定制', name: proxy.nursingRecordApp.nwsApp.id+'careRadio', inputValue: 'custom'},
                { boxLabel: '全天', name: proxy.nursingRecordApp.nwsApp.id+'careRadio', inputValue: 'day'},
                { boxLabel: '班次(日班)', name: proxy.nursingRecordApp.nwsApp.id+'careRadio', inputValue: 'scheduling'}
            ],
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    proxy.dateRadioGroupChange(newValue[proxy.nursingRecordApp.nwsApp.id+'careRadio']);
                }
            }
        });


        //刷新
        this.refreshButton = new Ext.button.Button({
            iconCls: 'icon-refresh',
            tooltip: '刷新',
            handler: function(btn,temp,f) {
                var beginDateTime = proxy.getBeginDateTime();
                var endDateTime = proxy.getEndDateTime();
                if (beginDateTime==null || endDateTime==null) {
                    return;
                }
                if (beginDateTime > endDateTime) {
                    Ext.MessageBox.alert('提示', '开始时间不能大于结束时间！');
                    return;
                }


                if (proxy.sechedulingTypeName=="日班" || proxy.sechedulingTypeName=="夜班") {
                    //判断上下班次是否存在
                    proxy.isPrevNextSchedulingValid();
                }

                //遮罩效果
                //proxy.loadMask.show();
                // 重新加载grid
                var grid = proxy.nursingRecordApp;
                //换床  //'/nws/criticalcare/query/bed_itme'
                if(f!=undefined&&f){
                    //定制分页
                    if (proxy.sechedulingTypeName=="定制") {
                        var re=proxy.nursingRecordApp.patientInfo;
                         if (typeof(re.IN_TIME)!="undefined"
                         && re.IN_TIME!=null && re.IN_TIME.length==19) {
                         proxy.beginDatefield.setValue(re.IN_TIME.substring(0,10));
                         proxy.beginHourSpinner.setValue(re.IN_TIME.substring(11,13));
                         proxy.beginMinuteSpinner.setValue(re.IN_TIME.substring(14,16));
                         }
                         proxy.endDatefield.setValue((new Date()).Format("yyyy-MM-dd"));
                         proxy.endHourSpinner.setValue((new Date()).Format("hh"));
                         proxy.endMinuteSpinner.setValue((new Date()).Format("mm"));
                        proxy.pageCustomDate();
                         if (proxy.pageCustomDateArray.length>0) {
                         beginDateTime = proxy.pageCustomDateArray[0].beginDateTime;
                         endDateTime = proxy.pageCustomDateArray[0].endDateTime;
                         }
                         proxy.nursingRecordApp.beginDateTime = beginDateTime;
                         proxy.nursingRecordApp.endDateTime = endDateTime;
                    }

                    if(Ext.util.Cookies.get("monitorItemStr")!=null){
                        Ext.Ajax.request({
                            url: '/nws/nursingRecord/conventional/beditem',
                            scope: this,
                            method: 'POST',
                            params: {
                                json:proxy.getMonitorCookie(),
                                register_id: proxy.nursingRecordApp.patientInfo.REGISTER_ID
                            },
                            success: function (response) {
                                var result = Ext.decode(response.responseText);
                                if(result.data!=null&&result.data!="") {
                                    proxy.bedItemTree.selectCode(result.data,proxy.nursingRecordApp.patientInfo.BED_ID);
                                    grid.queryGrid(result.data);
                                }else{
                                    proxy.bedItemTree.changebedid(proxy.nursingRecordApp.patientInfo.BED_ID);
                                    grid.queryGrid();
                                }
                            }
                        });
                    }else{
                        proxy.bedItemTree.changebedid(proxy.nursingRecordApp.patientInfo.BED_ID);
                        grid.queryGrid();
                    }
                }else{

                    var showColumn=proxy.bedItemTree.getSelsJson();
                    //储存到cookie里面去
                    proxy.saveMonitorCookie(showColumn);
                    grid.queryGrid(showColumn);
                }

            }
        });
        //储存因为cookie数目过大，使用方法储存
        this.saveMonitorCookie=function(showColumn){
            var columns=Ext.decode(showColumn);
            var cookieColumns=[],columnLength=columns.length;
            var cookieCommonName="monitorItem",cookieIndex= 1,cookieStr="";
            for(var i=0;i<columnLength;i++){
                var obj={};
                obj.name=columns[i].name;
                cookieColumns.push(obj);
                if((i+1)%10==0){
                    Ext.util.Cookies.set(cookieCommonName+cookieIndex, Ext.encode(cookieColumns));
                    cookieStr+=cookieCommonName+cookieIndex+",";
                    cookieIndex++;
                    cookieColumns=[];
                }
            }
            if(cookieColumns.length>0){
                Ext.util.Cookies.set(cookieCommonName+cookieIndex, Ext.encode(cookieColumns));
                cookieStr+=cookieCommonName+cookieIndex;
            }else{
                cookieStr=cookieStr.substr(0,cookieStr.length-1);
            }
            Ext.util.Cookies.set("monitorItemStr",cookieStr);
        };
        //取得里面的医嘱，并进行更新
        this.getMonitorCookie=function(){
            var cookieStr=Ext.util.Cookies.get("monitorItemStr");
            var cookieArray=cookieStr.split(',');
            var cookieColumns=[];
            for(var i=0;i<cookieArray.length;i++){
                var cookie=Ext.decode(Ext.util.Cookies.get(cookieArray[i]));
                if(cookie!=null){
                    cookieColumns=cookieColumns.concat(cookie);
                }
            }
            return Ext.encode(cookieColumns);

        };
        //复制
        this.copyButton = new Ext.button.Button({
            iconCls: 'icon-copy',
            tooltip: '新增或复制',
            handler : function(btn){
                /*if (!proxy.nursingRecordApp.ConventionalWindow) {
                    proxy.nursingRecordApp.ConventionalWindow =
                        new com.dfsoft.icu.nws.nursingrecord.ConventionalWindow(
                            {nowDate:new Date(),nursingRecordApp: proxy.nursingRecordApp, patientInfo: proxy.nursingRecordApp.patientInfo,treeSelect:proxy.bedItemTree}
                        );
                }else{
                    proxy.nursingRecordApp.ConventionalWindow.patientInfo=proxy.nursingRecordApp.patientInfo;
                    proxy.nursingRecordApp.ConventionalWindow.nursingRecordApp=proxy.nursingRecordApp;
                }*/
                proxy.nursingRecordApp.ConventionalWindow =
                    new com.dfsoft.icu.nws.nursingrecord.ConventionalWindow(
                        {nursingRecordApp: proxy.nursingRecordApp, patientInfo: proxy.nursingRecordApp.patientInfo,treeSelect:proxy.bedItemTree}
                    );
                proxy.nursingRecordApp.ConventionalWindow.down('form').getForm().reset();
                //proxy.nursingRecordApp.ConventionalWindow.show();
                proxy.nursingRecordApp.nwsApp.showModalWindow(proxy.nursingRecordApp.ConventionalWindow);
            }
        });

        //自制单元格向下copyCelltoDown
        this.copyCellButton=new Ext.button.Button({
            iconCls: 'icon-consent',
            tooltip: '复制选中单元格内容到以下单元格',
            handler : function(btn){
                var records = proxy.nursingRecordApp.gridpanel.getSelectionModel().getSelection();
                if (records.length <= 0) {
                    Ext.MessageBox.alert('提示', '请选择要复制的单元格!');
                    return;
                }
                proxy.nursingRecordApp.copyCelltoDown(records[0]);
            }
        });
        // 护理内容
        this.careContentButton = new Ext.button.Button({
            iconCls: 'icon-care-content',
            tooltip: '护理内容',
            handler: function(btn) {
                var grid = proxy.nursingRecordApp.gridpanel;
                var records = grid.getSelectionModel().getSelection();
                if (records.length <= 0) {
                    //Ext.MessageBox.alert('提示','请选择一条记录！');
                    //return;
                    var care_time='',caredate;
                    var nowDate=new Date();
                    var endTime=proxy.getEndDateTime().getTime();
                    if(proxy.sechedulingTypeName!='夜班'&&proxy.sechedulingTypeName!='日班'){
                        var currDate = nowDate.Format("yyyy-MM-dd");
                        if(proxy.currentTimeLastSechedul.TIME_2ND_END!=null){
                            care_time=currDate+' '+proxy.currentTimeLastSechedul.TIME_2ND_END;
                        }else if(proxy.currentTimeLastSechedul.TIME_1ST_END!=null){
                            care_time=currDate+' '+proxy.currentTimeLastSechedul.TIME_1ST_END;
                        }else{
                            care_time=currDate+' 00:00:00';
                        }
                        caredate=new Date(care_time);
                    }else{
                        if(proxy.scheduling==null||proxy.scheduling==''){
                            care_time=Ext.Date.format(new Date(),'Y-m-d')+' 00:00:00';
                        }else{
                            if(proxy.lastTimeBySechedul!=null){
                                care_time=proxy.lastTimeBySechedul;
                            }else{
                                var currDate = proxy.endDatefield.getValue().Format("yyyy-MM-dd");
                                if(proxy.scheduling.TIME_2ND_END!=null){
                                    care_time=currDate+' '+proxy.scheduling.TIME_2ND_END;
                                }else if(proxy.scheduling.TIME_1ST_END!=null){
                                    care_time=currDate+' '+proxy.scheduling.TIME_1ST_END;
                                }else{
                                    care_time=currDate+' 00:00:00';
                                }
                            }
                        }
                        caredate=new Date(care_time);
                    }
                    Ext.Ajax.request({
                        url: '/icu/nursingRecord/conventional/get/getCaretime',
                        scope: this,
                        method: 'POST',
                        params: {
                            register_id: proxy.nursingRecordApp.patientInfo.REGISTER_ID
                        },
                        success: function (response) {
                            var result = Ext.decode(response.responseText);
                            if(result.data!=null&&result.data.length>0) {
                                var re = result.data[0];

                                if(re.CARE_INTERVAL==null||re.CARE_FREQUENCY==null){
                                    Ext.MessageBox.alert('提示', '请设置病人的护理间隔!');
                                    return;
                                }
                                /*var internum = re.CARE_INTERVAL / re.CARE_FREQUENCY/60;
                                var newMinute=caredate.getMinutes()+internum-caredate.getMinutes()%internum;

                                caredate.setMinutes(newMinute);
                                caredate.setSeconds(0);*/
                                care_time=Ext.Date.format(new Date(caredate), 'Y-m-d H:i:s');
                                if(proxy.sechedulingTypeName!='夜班'&&proxy.sechedulingTypeName!='日班'){
                                    grid.showCareRecordWin("",care_time,proxy.currentTimeLastSechedulName);
                                }else{
                                    grid.showCareRecordWin("",care_time,proxy.sechedulingTypeName);
                                }

                            }
                        }
                    });
                    /*if(proxy.nursingRecordApp.patientInfo.CARE_INTERVAL==null||proxy.nursingRecordApp.patientInfo.CARE_FREQUENCY==null){
                        Ext.MessageBox.alert('提示', '请设置病人的护理间隔!');
                        return;
                    }
                    var internum=proxy.nursingRecordApp.patientInfo.CARE_INTERVAL/proxy.nursingRecordApp.patientInfo.CARE_FREQUENCY/60;
                    var newMinute=0;
                    newMinute=caredate.getMinutes()+internum-caredate.getMinutes()%internum;
                    *//*if(caredate.getMinutes()%internum<=internum/2){
                        newMinute=caredate.getMinutes()-caredate.getMinutes()%internum;
                    }else{
                        newMinute=caredate.getMinutes()+internum-caredate.getMinutes()%internum;
                    }*//*
                    caredate.setMinutes(newMinute);
                    caredate.setSeconds(0);
                    care_time=Ext.Date.format(new Date(caredate), 'Y-m-d H:i:s');
                    grid.showCareRecordWin("",care_time);*/
                }else{
                    grid.showCareRecordWin(records[0].get(proxy.nursingRecordApp.careContentPreset),Ext.Date.format(new Date(records[0].get('CARE_TIME')), 'Y-m-d H:i:s'));
                }
            }
        });

        this.callParent([{
            style: {
                'border-bottom': '1px solid #C0C0C0 !important'
            },
            items	: [proxy.dateRadioGroup,'->',this.bedItemTree, {
                xtype		: 'container',
                layout		: 'hbox',

                items	    : [this.beginDatefield, this.beginHourSpinner, this.beginMinuteSpinner]
            },{
                xtype		: 'container',
                layout		: 'hbox',

                items	    : [this.endDatefield,this.endHourSpinner, this.endMinuteSpinner]
            }, this.refreshButton, '-', this.copyButton,this.copyCellButton//, this.careContentButton
                , '-',
                proxy.beforeButton, proxy.afterButton//, this.beforeDayButton, this.afterDayButton
            ],
            listeners : {
                afterRender: function(component, eOpts) {
                    //设置按钮状态
                    proxy.initSechedulingTypeName = proxy.sechedulingTypeName;
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
