/**
 * 绘图实例父类
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.GraphLiveParent = function(config) {
    //X轴线个数
    this.X_AXIS_FIELDS_LENGTH = 60;
    //X轴间隔像素
    this.X_AXIS_STEP = 15;
    //X轴最小间隔像素
    this.MIN_X_AXIS_STEP = null;
    //甘特图网格Y间距
    this.GANTT_GRID_Y = 22;
    //序列图网格Y间距
    this.SERIAL_GRID_Y = 22;
    //时间轴高度
    this.TIME_HEIGHT = 20;
    //开始时间, 参数传入
    this.beginDateTime = new Date();
    this.beginDateTime.setHours(0);
    this.beginDateTime.setMinutes(0);
    //开始时间, 参数传入
    this.endDateTime = new Date();
    this.endDateTime.setHours(23);
    this.endDateTime.setMinutes(59);
    //X轴时间间隔分钟，默认为null
    this.xAxisTimeInterval = null;
    //每多少个轴值显示一次轴标签值
    this.xAxisInterval = 5;

    Ext.apply(this, config);
    var proxy = this;

    /**
     * 初始化绘图编辑器对象
     */
    this.initGraphlive = function (){
        // 初始化绘图编辑器，进行网格、轴、序列等元素的创建和初始配置。
        this.graphlive.initialize();
    }


    /**************************************************画布公共方法****************************************************************/

    //得到时间轴数组
    this.getTimeArray = function() {
        var startDate05 = proxy.minuteTo05(this.beginDateTime);
        var endDate05 = proxy.minuteTo05(this.endDateTime);

        var timeDiff = endDate05.getTime()-startDate05.getTime();//相差毫秒数
        var minutesDiff = Math.floor(timeDiff/(60*1000));//相差分钟数
        var step = Math.round(minutesDiff/proxy.X_AXIS_FIELDS_LENGTH);//间隔分钟数

        var timeObj = proxy.getTimesByMinuteStep(startDate05, step, proxy.X_AXIS_FIELDS_LENGTH);
        var timeArray = [timeObj.times];
        return timeArray;
    }


    //根据固定间隔时间得到时间轴数组，参数为间隔分钟
    this.getTimeArrayByStep = function(step) {
        var startDate05 = proxy.minuteTo05(this.beginDateTime);
        var endDate05 = proxy.minuteTo05(this.endDateTime);

        var timeObj = proxy.getTimesByMinuteStep(startDate05, step, proxy.X_AXIS_FIELDS_LENGTH);
        var timeArray = [timeObj.times];
        return timeArray;
    }

    //重设时间
    this.setXAxis = function() {
        // 时间数组
        var timeArray;
        if (proxy.xAxisTimeInterval==null) {
            timeArray = proxy.getTimeArray();
        } else {
            timeArray = proxy.getTimeArrayByStep(proxy.xAxisTimeInterval);
        }
        this.graphlive.setAxisFields(timeArray, 'H0');
    }

    //更改Y轴，目前不支持动态新增删除Y轴，只支持更改
    this.setYAxis = function(yAxisFieldsArray) {
        var yAxisFieldsArray = [{
            name: 'V1',
            fields: [60, 80, 100, 120, 140, 160]
        }, {
            name: 'V2',
            fields: [10, 20, 30, 40, 50, 60]
        }];

        for(var i=0; i<yAxisFieldsArray.length; i++) {
            this.graphlive.setAxisFields([yAxisFieldsArray[i].fields.reverse()], yAxisFieldsArray[i].name);
        }
    }

    //删除温度时同时删除降温连线
    this.delCoolingConnectingLine = function(legend) {
        if (this.coolingConnectingLineArray && this.coolingConnectingLineArray.length>0
            && legend.owner!=null && legend.owner.legendTypeUnit=='°C' ) {
            for (var i=0; i<this.coolingConnectingLineArray.length; i++) {
                var coolingConnectingLine = this.coolingConnectingLineArray[i];
                var fromLegend = coolingConnectingLine.legends[0];
                var toLegend = coolingConnectingLine.legends[1];
                //放大缩小后时间会发生变化
                //var date = new Date(fromLegend.xField)
                //date.setSeconds(0);
                //date.setMilliseconds(0);
                if (coolingConnectingLine.xField[0]==legend.xField) {
                    coolingConnectingLine.hide();
                    this.coolingConnectingLineArray.splice(i, 1);
                    break;
                }
            }
        }
    }

    //删除心率脉搏时同时删除连线
    this.delHeartPlusConnectingLine = function(legend) {
        if (this.heartPlusLineArray && this.heartPlusLineArray.length>0
            && legend.owner!=null
            && (legend.owner.legendTypeAliasName=='心率' || legend.owner.legendTypeAliasName=='脉搏') ) {
            for (var i=0; i<this.heartPlusLineArray.length; i++) {
                var heartPlusConnectingLine = this.heartPlusLineArray[i];
                var heartLegend = heartPlusConnectingLine.legends[0];
                var plusLegend = heartPlusConnectingLine.legends[1];
                //放大缩小后时间会发生变化
                //var date = new Date(heartLegend.xField)
                //date.setSeconds(0);
                //date.setMilliseconds(0);
                if (heartPlusConnectingLine.xField[0]==legend.xField) {
                    heartPlusConnectingLine.hide();
                    this.heartPlusLineArray.splice(i, 1);
                    break;
                }
            }
        }
    }

    //降温连线移动
    this.moveCoolingConnectingLine = function(legend) {
        if (this.coolingConnectingLineArray && this.coolingConnectingLineArray.length>0
            && legend.owner!=null && legend.owner.legendTypeUnit=='°C' ) {
            for (var i=0; i<this.coolingConnectingLineArray.length; i++) {
                var coolingConnectingLine = this.coolingConnectingLineArray[i];
                var fromLegend = coolingConnectingLine.legends[0];
                var toLegend = coolingConnectingLine.legends[1];
                //放大缩小后时间会发生变化
                //var date = new Date(fromLegend.xField);
                //date.setSeconds(0);
                //date.setMilliseconds(0);
                if (coolingConnectingLine.xField[0]==legend.xField) {
                    if (legend.owner==null) {
                        toLegend.setAxisLocation(legend.xField, legend.yField);
                    } else {
                        fromLegend.setAxisLocation(legend.xField, legend.yField);
                    }
                    break;
                }
            }
        }
    }

    //心率脉搏连线移动
    this.moveHeartPlusConnectingLine = function(legend) {
        if (this.heartPlusLineArray && this.heartPlusLineArray.length>0
            && legend.owner!=null
            && (legend.owner.legendTypeAliasName=='心率' || legend.owner.legendTypeAliasName=='脉搏') ) {
            for (var i=0; i<this.heartPlusLineArray.length; i++) {
                var heartPlusConnectingLine = this.heartPlusLineArray[i];
                var heartLegend = heartPlusConnectingLine.legends[0];
                var plusLegend = heartPlusConnectingLine.legends[1];
                //放大缩小后时间会发生变化
                //var date = new Date(heartLegend.xField);
                //date.setSeconds(0);
                //date.setMilliseconds(0);
                if (heartPlusConnectingLine.xField[0]==legend.xField) {
                    if (legend.owner.legendTypeAliasName=='心率') {
                        heartLegend.setAxisLocation(legend.xField, legend.yField);
                    } else {
                        plusLegend.setAxisLocation(legend.xField, legend.yField);
                    }
                    break;
                }
            }
        }
    }

    //增加画布提示
    this.addTip = function() {
        var V1 = 0;
        //画布提示
        this.tip = Ext.create('Ext.tip.ToolTip', {
            target: '',
            style: {
                "white-space": "nowrap"
            },
            trackMouse: true
        });

        //显示tip
        this.showTip = function(e, isMove) {
//            var time = proxy.getTime(new Date(e.axisValues['H0']));
            var time;
            //serials和legend的e.target.xField对象类型不一致，serials是Date类型，legend是数值类型
            try {
                time = new Date(e.target.extData.initialData.realXField).Format("hh:mm");
            } catch(exception) {
                time = new Date(e.target.xField).Format("hh:mm");
            }
            var tipInfo = "时间：" + time;

            if (e.target.customICUValue) {
                tipInfo = e.target.customICUValue;
            } else if (e.axisValues[e.target.bindYAxisName]) {
                var currV1;
                try {
                    currV1 = proxy.getAfterEditValue(e.target);
                } catch(error) {
                    currV1 = e.target.extData.initialData.yField;//Math.round(e.axisValues[e.target.bindYAxisName] * 10) / 10;//e.target.yField;
                }
                //如果未被修改，取原始值
                if (e.target.extData.isDirty===false && isMove===false) {
                    currV1 = e.target.extData.initialData.yField;
                }
                //判断图例别名是否存在，如果不存在就不提示。用于过滤图形，只显示降温时，竖线顶端会提示体温信息，王小伟，2014-09-16
                if (e.target.owner==null || typeof(e.target.owner.legendTypeAliasName) == "undefined") {
                    return;
                }
                tipInfo += "<br>" + e.target.owner.legendTypeAliasName + "：" + currV1 + (e.target.owner.legendTypeUnit==null?"":e.target.owner.legendTypeUnit);
            }
            proxy.tip.setTarget(proxy.canvasDivId);
            proxy.tip.update(tipInfo);
            proxy.tip.show();
        };

        //图例拖动提示
        this.showLegendMoveTip = function(e) {
            proxy.showTip(e, true);
            proxy.moveCoolingConnectingLine(e.target);
            proxy.moveHeartPlusConnectingLine(e.target);
        };

        //图例Over提示
        this.showLegendOverTip = function(e) {
            proxy.showTip(e, false);
        };

        //当鼠标拖动图例
        this.graphlive.on(GraphliveConstants.LEGEND_MOVE, this.showLegendMoveTip);

        //当鼠标移动到图例上
        this.graphlive.on(GraphliveConstants.LEGEND_OVER, this.showLegendOverTip);

        //当鼠标移动到图例外
        this.graphlive.on(GraphliveConstants.LEGEND_OUT, function(e) {
            proxy.tip.hide();
            proxy.tip.setTarget("");
        });

        //当鼠标拖动结束
        this.graphlive.on(GraphliveConstants.LEGEND_UP, function(e) {
            if (typeof(e.target.extData.initialData)=="undefined") {
                return;
            }
            var id = e.target.id;
            var newValue = proxy.getAfterEditValue(e.target);
            var orgValue = e.target.extData.initialData.orgValue;
            //根据原始值和新值，判断是否需要闪烁
            if (typeof(orgValue) != "undefined" && orgValue!=null && orgValue+""!="" && orgValue!=newValue) {
                e.target.startBreath();
            } else {
                e.target.endBreath();
            }
            //更新数据库
            proxy.updateCareRecordValue(id, newValue);
            //判断原值和新值是否一致
            e.target.extData.isDirty = e.target.extData.initialData.yField!=newValue;
        });

        //双击编辑数值
        this.graphlive.on(GraphliveConstants.LEGEND_DB_CLICK, function(e) {
            if (proxy.isAllowEdit!=true) {
                return;
            }
            if (typeof(e.legend.extData.initialData)=="undefined") {
                return;
            }
            var id = e.legend.id;
            var currValue = proxy.getAfterEditValue(e.legend);
            var orgValue = e.legend.extData.initialData.orgValue;
            var allowDecimals = (e.legend.owner.legendTypeUnit=='°C'); //是否允许录入小数
            proxy.showEditWindow(e.pageX, e.pageY, id, currValue, orgValue, allowDecimals, e.legend);
        });
    }

    //取得编辑后的值
    this.getAfterEditValue = function(legend) {
        //体温保留一位小数，其他取整
        if (legend.owner!=null && legend.owner.legendTypeUnit=='°C') {
            try {
                return parseFloat(legend.yField).toFixed(1);
            } catch(e) {
                return Math.round(legend.yField);
            }
        } else {
            return Math.round(legend.yField);
        }
    }

    //更新护理记录值
    this.updateCareRecordValue = function(id, value) {
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/updateCareRecordValue',
            method: 'post',
//                async: false,
            params : {
                id: id,
                newValue: value,
                recorder: window.parent.userInfo.userId
            },
            success : function(response) {

            }
        });
    }

    //删除护理记录值
    this.delCareRecordValue = function(id) {
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/delCareRecordValue',
            method: 'post',
//                async: false,
            params : {
                id: id
            },
            success : function(response) {

            }
        });
    }

    /*
     监测项编辑弹出框
     */
    this.showEditWindow = function(pageX, pageY, id, currValue, orgValue, allowDecimals, legend) {
        var maxValue = 200;
        var minValue = 0;

        if (Ext.getCmp('monitorMenuPanel')) {
            Ext.getCmp('monitorMenuPanel').close();
        }
        var menuItem = [];

        menuItem[menuItem.length] = {
            xtype: 'radiogroup',
            layout: 'column',
            defaultType: 'container',
            height: 20,
            width: 150,
            items: [{
                width: 120,
                items: [{
                    xtype: 'numberfield',
                    id: 'legendMenuVal',
                    fieldLabel: '监测值',
                    labelAlign: 'right',
                    allowBlank: false,
                    enableKeyEvents: true,
                    allowDecimals: allowDecimals,
                    labelWidth: 45,
                    width: 118,
                    maxValue: maxValue,
                    minValue: minValue,
                    value: currValue,
                    listeners: {
                        specialkey: function(_this, e, eOpts) {
                            if (Ext.getCmp('legendMenuVal').isValid()==false) {
                                return;
                            }
                            //如果是回车键
                            if (e.button == 12) {
                                //如果修改可用
                                if (!Ext.getCmp('legendMenuSingleEditBtn').isDisabled()) {
                                    //监测值
                                    var legendValueVal = Ext.getCmp('legendMenuVal').getValue();
                                    proxy.updateCareRecordValue(id, legendValueVal);
                                    legend.setAxisLocation(legend.xField, legendValueVal);
                                    if (typeof(orgValue) != "undefined" && orgValue!=null && orgValue+""!="" && orgValue!=legendValueVal) {
                                        legend.startBreath();
                                    } else {
                                        legend.endBreath();
                                    }
                                    //判断原值和新值是否一致
                                    legend.extData.isDirty = legend.extData.initialData.yField!=legendValueVal;
                                    currMenuPanel.close();
                                    //重绘连线
                                    proxy.moveCoolingConnectingLine(legend);
                                    proxy.moveHeartPlusConnectingLine(legend);
                                }
                            }
                        },
                        change: function(_this, newValue, oldValue, eOpts) {
                            //设置修改按钮是否可用
                            if (newValue !== null) {
                                Ext.getCmp('legendMenuSingleEditBtn').setDisabled(false);
                            } else {
                                Ext.getCmp('legendMenuSingleEditBtn').setDisabled(true);
                            }
                        }
                    }
                }]
            }, {
                width: 20,
                items: [{
                    xtype: 'button',
                    id: 'legendMenuSingleEditBtn',
                    iconCls: 'edit',
                    tooltipType: 'title',
                    tooltip: '修改',
                    handler: function(_this) {
                        if (Ext.getCmp('legendMenuVal').isValid()==false) {
                            return;
                        }
                        //监测值
                        var legendValueVal = Ext.getCmp('legendMenuVal').getValue();
                        proxy.updateCareRecordValue(id, legendValueVal);
                        legend.setAxisLocation(legend.xField, legendValueVal);
                        if (typeof(orgValue) != "undefined" && orgValue!=null && orgValue!="" && orgValue!=legendValueVal) {
                            legend.startBreath();
                        } else {
                            legend.endBreath();
                        }
                        //判断原值和新值是否一致
                        legend.extData.isDirty = legend.extData.initialData.yField!=legendValueVal;
                        currMenuPanel.close();
                        //重绘连线
                        proxy.moveCoolingConnectingLine(legend);
                        proxy.moveHeartPlusConnectingLine(legend);
                    }
                }]
            }]
        };
        menuItem[menuItem.length] = '-';

        //是否需要还原，注意js中typeof("orgValue")=="string"，但是orgValue!=""却是false，orgValue="0"
        if (typeof(orgValue) != "undefined" && orgValue!=null
            && orgValue+""!=""
            && orgValue!=currValue) {
            menuItem[menuItem.length] = {
                text: '还原为：' + orgValue, //还原原始值
                iconCls: 'back',
                handler: function(_this) {
                    legend.setAxisLocation(legend.xField, orgValue);
                    legend.endBreath();
                    legend.extData.isDirty = false;
                    proxy.updateCareRecordValue(id, orgValue);
                    proxy.moveCoolingConnectingLine(legend);
                    proxy.moveHeartPlusConnectingLine(legend);
                }
            };
        }

        menuItem[menuItem.length] = {
            text: '删除',
            iconCls: 'delete',
            handler: function(_this) {
                proxy.delCoolingConnectingLine(legend);
                proxy.delHeartPlusConnectingLine(legend);
                proxy.graphlive.removeChild(legend);
                proxy.delCareRecordValue(id);
            }
        };

        var currMenuPanel = Ext.create('Ext.menu.Menu', {
            id: 'monitorMenuPanel',
            border: false,
            //minWidth: 200,
            items: menuItem
        }).showAt(pageX + 20, pageY + 10);

        Ext.getCmp('legendMenuVal').focus(true);
    }

    //添加甘特图序列，同一行会存在多个甘特序列
    this.addGanttSerial = function(ganttSerialData) {
        if (typeof(ganttSerialData) == "undefined") {
            ganttSerialData = {
                id: Math.uuid(),
                rowNum: 1, //行号，从1开始
                startValue: new Date("2014/03/05 00:00:00"), //开始时间
                medianValue: new Date("2014/03/05 00:05:00"), //中间时间
                endValue: new Date("2014/03/05 00:05:00"),  //结束时间
                label: '标签值'
            }
        }

        proxy.graphlive.addSerial({
            id: ganttSerialData.id,
            type: 'gantt', //序列类型，支持两种渲染方式，一种是甘特图(gantt)类型，另一种是折线图(line)类型
            bindXAxisName: 'H0', //绑定到的轴位置
            xField: [], //x轴时间段
            yField: proxy.GANTT_GRID_Y * ganttSerialData.rowNum - 5, //y轴位置，即起始点的Y轴坐标值
            startValue: ganttSerialData.startValue,
            medianValue: ganttSerialData.medianValue,
            endValue: ganttSerialData.endValue,
            //minSeriesValue: false,
            //maxSeriesValue: false,
            name: ganttSerialData.id,
            label: {
                field: ganttSerialData.label,
                color: 'black',
                position: 'center'
            },
            style: {
                color: 'red',
                opacity: 1
            }
        });
    }


    com.dfsoft.icu.GraphLiveParent.superclass.constructor.call(this, config);
};

Ext.extend(com.dfsoft.icu.GraphLiveParent, com.dfsoft.icu.TimeLabel, {

});
