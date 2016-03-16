/**
 * 血气分析界面
 * Created by whw on 14-5-21.
 */
Ext.define('com.dfsoft.icu.nws.bloodgas.BloodGasWindow', {
    extend: 'Ext.window.Window',
    iconCls: 'blood-gas-analy',
    title: '血气分析',
    width: 890,//670,
    height: 600,// 468,
    maximizable: true,
    style: {
       bodyStyle:'background:red',
        style:'background:red'
    },
    layout: 'border',
    border: false,
    defaultItems:[],
    initComponent: function () {
        // debugger;
        var me = this;

        Ext.util.CSS.swapStyleSheet('bloodgas.css', './app/nws/bloodgas/css/bloodgas.css');
//console.log("--"+me.patientInfo.AGE+"--");
        me.str = '姓名：' + (me.patientInfo != null ? me.patientInfo.NAME : '') + ' 住院号：' + (me.patientInfo != null ? me.patientInfo.HOSPITAL_NUMBER : '') + ' 床号：' + (me.patientInfo != null ? me.patientInfo.BED_NUMBER : '') +
            ' 性别：' + (me.patientInfo != null ? me.patientInfo.GENDER : '') +
            ' 年龄：' + ((me.patientInfo.AGE != null && me.patientInfo != ' null')? me.patientInfo.AGE : '');

        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.bloodPanel = Ext.create('com.dfsoft.icu.nws.bloodgas.BloodGasPanel', {
            parent: me
        });
        me.bloodLeftPanel = Ext.create('com.dfsoft.icu.nws.bloodgas.BloodGasLeftPanel', {
            parent: me
        });
        me.chartdataT = [
            {"XSpH": 0, "XFPCO2": 0, "XYPO2": "0", "XSABE": "0", "XBSBC": "0", "XNNa": "0", "XJK": "0", "XRLac": "0", "XPGlu": "0", "XBBS": "0", "scoretime": "", "no": "0"}
        ];
        /*
         * XBBS: 5.6
         XBSBC: 43
         XFPCO2: 4.3
         XJK: 4.5
         XNNa: 3.4
         XPGlu: 1.2
         XRLac: 3.2
         XSABE: 12
         XSpH: 3.4
         XYPO2: 23
         no: 2
         scoretime: "2014-08-19 10:51"
         * */
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['XSpH', 'XFPCO2', 'XYPO2', 'XSABE', 'XBSBC', 'XNNa', 'XJK', 'XRLac', 'XPGlu', 'XBBS', 'scoretime', 'no'],
            data: me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            animate: true,
            insetPadding: 4,
            store: me.chartstoreT,
            style: {
              //  background: '#fff',
                marginBottom: '0px'
            },
            shadow: true,
            theme: 'Category1',
            legend: {
                position: 'bottom'
            },
            axes: [
                {
                    type: 'Numeric',
                    title: '检验值',
                    //minimum: -10,
                    position: 'left',
                    fields: ['XSpH', 'XFPCO2', 'XYPO2', 'XSABE'],//,
                    grid: true
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['no']
                }
            ],
            series: [
                {
                    type: 'line',
                    title: 'PH',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>PH值:' + storeItem.get('XSpH') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'XSpH',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'PCO2',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>PCO2值:' + storeItem.get('XFPCO2') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'XFPCO2',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'PO2',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>PO2值:' + storeItem.get('XYPO2') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'XYPO2',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'ABE',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>ABE:' + storeItem.get('XSABE') + '%</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'XSABE',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'SBC',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>SBC:' + storeItem.get('XBSBC') + '%</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'XBSBC',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                }
            ]
        });

        Ext.apply(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    style: {
                        'padding-bottom': '0px'
                    },
                    items: [
                        {
                            xtype: 'label',
                            id: me.id + 'nwslabel',
                            text: me.str
                        },
                        '->'/*,{
                         action : 'back_button',
                         iconCls : 'save',
                         labelAlign:'right',
                         tooltip:'保存',
                         handler:function(){
                         me.saveBlood();
                         }
                         }*/,
                        {
                            action: 'back_button',
                            iconCls: 'print-button',
                            labelAlign: 'right',
                            tooltip: '打印',
                            handler: function () {
                                me.printBlood();
                            }
                        }
                    ]

                }
            ],
            items: [
                {
                    region: 'north',
                    height: 280,
                    layout: 'border',
                    style: {
                         'background':'red'
                    },
                    items: [
                        {
                            region: 'center',
                            padding: '5 5 5 0',
                            margin: '0 0 -1 0',
                            layout: 'fit',
                            style: {
                                'background-color': '#FFF'
                            },
                            border: 1,
                            items: [
                                me.bloodPanel
                            ]
                        },
                        {   region: 'west',
                            padding: '5 5 5 5',
                            width: 285,
                            margin: '0 0 -1 0',
                            layout: 'fit',
                            style: {
                                'background-color': '#FFF'
                            },
                            border: 1,
                            items: [
                                me.bloodLeftPanel
                            ]
                        }
                    ]},
                {
                     xtype:'panel',
                    region: 'center',
                    layout: 'border',
style:{
                    'background':'red'
                },
                border: 1,
                   // style: 'text-align:center;font-size:14px;font-weight:bold;color:#707070;'
                    margin: '0 5 5 5',
                    //  padding: '0 0 2 0',
                    items: [
                        {

                            xtype: 'label',
                            region: 'north',
                            text: '检验项目趋势图',
                            //  margin: '0 10 10 290',
                            style: 'text-align:center;font-size:14px;font-weight:bold;color:#707070;background-color:white;'
                        },

                        {
                            xtype: 'fieldset',
                            region: 'center',
                            style: {
                                'background-color': '#FFF'
                            },
                            margin:0,
                            padding: '0',
                            border: false,
                            layout: 'fit',
                            items: [
                                me.chartT
                            ]
                        }
                    ]}
            ]
        });
        me.callParent();
        if (me.patientInfo != null) {
            me.loadTrendData(me.patientInfo.PATIENT_ID, null);
        }
    },

    saveBlood: function () {
        var gridPanle = this.bloodPanel;
        var store = gridPanle.getStore();
        var modify = [];
        var remove = [];
        var schedulTypes = [];
        var modifiedRecords = store.getModifiedRecords();
        if (modifiedRecords.length <= 0) {
            Ext.MessageBox.alert('提示', '没有数据变化');
        } else {
            if (modifiedRecords.length > 0) {
                for (var i = 0; i < modifiedRecords.length; i++) {
                    var record = modifiedRecords[i];
                    var date = Ext.Date.format(record.get('record_date'), 'Y-m-d') == '' ? record.get('record_date') : Ext.Date.format(record.get('record_date'), 'Y-m-d');
                    var time = Ext.Date.format(record.get('record_time'), 'H:i') == '' ? Ext.Date.format(new Date(record.get('record_time')), 'H:i') : Ext.Date.format(record.get('record_time'), 'H:i');
                    var newDate = new Date(date + ' ' + time);
                    var item = {
                        ID: record.get('id'),
                        record_time: newDate,
                        associate_id: record.get('associate_id'),
                        bloodId: record.get('bloodId'),
                        care_value: record.get('care_value') == '' ? '0' : record.get('care_value')
                    };
                    modify.push(item);
                }
            }
            schedulTypes.push(modify);
            schedulTypes.push(remove);
            Ext.Ajax.request({
                url: webRoot + '/nws/bloodgas/save-care-blood',
                method: 'POST',
                params: {saveRecords: Ext.encode(schedulTypes)},
                success: function (response) {
                    store.load();
                }
            });
        }
    },
    printBlood: function () {
        var me = this;
        var records = me.bloodLeftPanel.getSelectionModel().getSelection();
        if (records.length <= 0) {
            Ext.MessageBox.alert('提示', '请选中需要打印的标本号');
        } else {
            printExamine(records[0].get('bloodId'),'ICU',me.getEl());
        }
    },
    loadTrendData: function (patientId, itemCodes) {
        var me = this;
        //me.down("fieldset").remove(me.chartT);


        if (itemCodes == null) {
            // 默认特护单显示项目。
            itemCodes = ["45219890e09311e39b39002186f90e51",
                "9eeae918e09311e39b39002186f90e51",
                "f4e482f4e09311e39b39002186f90e51",
                "d0b6bc07e09611e39b39002186f90e51",
                "f8b7409fe09511e39b39002186f90e51",
                "d1e26c63e09911e39b39002186f90e51",
                "dd9c1499e09811e39b39002186f90e51",
                "599e6182e0a911e39b39002186f90e51",
                "a4e35668e0a911e39b39002186f90e51",
                "636bd3dce4a211e39b39002186f90e51"];
        }
        if(itemCodes.length > 13){
            Ext.MessageBox.alert('提示', '你好！多选查看检验项目趋势最多支持13项哦！');
            return;
        }
            me.defaultItems = itemCodes;
       // console.log(itemCodes);
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getBloodTrend/' + patientId + '/' + itemCodes,
            method: 'GET',
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                var lineItem = [];
                if (reqmsg.success === true) {
                    var itemAll = [];
                    var itemValues = [];
                    for (var i = 0; i < reqmsg.data.bloodstr.length; i++) {
                        for (var itemKey in reqmsg.data.bloodstr[i]) {
                            itemAll.push(itemKey);
                            if (itemKey != 'scoretime' && itemKey != 'no') {
                                itemValues.push(itemKey);
                            }
                        }
                    }
                    itemValues = itemValues.distinct();
                    itemAll = itemAll.distinct();
                    for (var ia in reqmsg.data.itemAlias) {
                        var iaOne = eval("reqmsg.data.itemAlias." + ia);
                        iaOne.valueName = ia;
                        for (var iv = 0; iv < itemValues.length; iv++) {
                            if (ia == itemValues[iv]) {
                                lineItem.push(iaOne);
                            }
                        }
                    }
                    me.chartstoreT = new Ext.data.JsonStore({
                        // fields: ['XSpH','XFPCO2','XYPO2','XSABE','XBSBC','XNNa','XJK','XRLac','XPGlu','XBBS','scoretime', 'no'],
                        fields: itemAll,
                        data: me.chartdataT
                    });
                    me.chartstoreT.loadData(reqmsg.data.bloodstr);
                    me.down("fieldset").remove(me.chartT);
                    me.chartT = new Ext.chart.Chart({
                        animate: true,
                        insetPadding: 3,
                        margin: '0 2 0 0',
                        padding: '0 2 0 0',

                        //  text:"123",
                        store: me.chartstoreT,
                        style: {
                          //  background: '#fff',
                            marginBottom: '0px'
                        },
                        shadow: true,
                        theme: 'Category1',
                        legend: {
                            position: 'bottom'

                        },
                        axes: [
                            {
                                type: 'Numeric',
                                title: '检验值',
                                //minimum: -10,
                                position: 'left',
                                fields: itemValues,//,
                                grid: true
                            },
                            {
                                type: 'Category',
                                position: 'bottom',
                                fields: ['no']
                            }
                        ],
                        series: me.createSeries(lineItem)
                    });
                    me.down("fieldset").items.add(me.chartT);
                    me.down("fieldset").doLayout(true);

                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
    },
    createSeries: function (lineItem) {
       // console.log(lineItem[0]);

        var newSeries = [];
        for (var li = 0; li < lineItem.length; li++) {
            var lineOne = {
                type: 'line',
                title: lineItem[li].alias,
                valuename: lineItem[li].valueName,
                highlight: {
                    size: 5,
                    radius: 5
                },
                tips: {
                    trackMouse: true,
                    width: 158,
                    height: 36,
                    renderer: function (storeItem, item) {

                        this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>' + item.series.title + ':' + storeItem.get(item.series.valuename) + '</span>');
                    }
                },
                axis: 'left',
                xField: 'no',
                yField: lineItem[li].valueName,
                markerCfg: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            };
            newSeries.push(lineOne);
        }
        return newSeries;
    }


});
Array.prototype.distinct = function () {
    var newArr = [], obj = {};
    for (var i = 0, len = this.length; i < len; i++) {
        if (!obj[this[i]]) {
            newArr.push(this[i]);
            obj[this[i]] = 'new';
        }
    }
    return newArr;
}