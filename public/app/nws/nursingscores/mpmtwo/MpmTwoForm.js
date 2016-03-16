/**
 * Tiss28评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mpmtwoform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoGrid',
        'com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoItemGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],
    itemscore: "",
    findItem: function (itemobj) {
        var me = this;
        if (itemobj.name === undefined) {
            if (itemobj.items === undefined) {
                return '';
            }
            Ext.each(itemobj.items.items, function (item) {
                return me.findItem(item);
            })
        } else {
            if (itemobj.xtype == "radiofield") {
                if (itemobj.getValue()) {
                    me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemobj.inputValue + '",';
                }
            } else {

                me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemobj.getValue() + '",';
            }
        }
    },
    Fmt: function (x) {
        var v
        if (x >= 0) {
            v = '' + (x + 0.001)
        } else {
            v = '' + (x - 0.001)
        }
        return v.substring(0, v.indexOf('.') + 3)
    },
    /*分值项目录入验证*/
    itemVerification: function (mpmtwoitem) {
        var me = this;
        debugger;
        if (mpmtwoitem.mpmtwo.age == "null") {
            Ext.Msg.alert("提示", "请输入年龄!");
            me.itemscore = "";
            return false;
        }
        if (mpmtwoitem.mpmtwo.dataTime == undefined) {
            Ext.Msg.alert("提示", "请选择数据采集时间!");
            me.itemscore = "";
            return false;
        }

        if (mpmtwoitem.mpmtwo.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (mpmtwoitem.mpmtwo.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (mpmtwoitem.mpmtwo.Motor == "") {
            Ext.Msg.alert("提示", "请选择运动反应");
            me.itemscore = "";
            return false;
        }
        if(!me.down('textarea').isValid()){
            me.itemscore="";
            return false;
        }
        return true;
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.mpmOneGrid = new com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoGrid();
        me.mpmOneItmeGrid = new com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoItemGrid();
        me.chartdataT = [
            {"mr": 0, "scoretime": "0", "no": "0"}
        ];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime', 'mr', 'no'],
            data: me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            animate: true,
            store: me.chartstoreT,
            insetPadding:3,
            style: {
                background: '#fff',
                marginBottom: '0px'
            },
            shadow: true,
            theme: 'Category1',
            legend: {
                position: 'right'
            },

            axes: [
                {
                    type: 'Numeric',
                    title: '死亡率',
                    minimum: 0,
                    position: 'left',
                    fields: ['mr'],//,
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
                    title: '死亡率',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>死亡率:' + storeItem.get('mr') + '%</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'mr',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                }
            ]
        });

        me.mpmOneItmeGrid.addListener('itemclick', itemclick);

        function itemclick(grid, record, item, index, e, eOpts) {
            if (record.get('SEL')) {
                record.set('SEL', false);
                record.set('SCORE', '');
                record.commit();
            } else {
                record.set('SEL', true);
                record.set('SCORE', record.get('SCORES'));
                record.commit();
            }
        };

        Ext.apply(this, {
            title: 'MPM Ⅱ-24-72',
            closable: true,
            tooltip: '入ICU24~72小时死亡概率预测模型',
            id: me.mod + 'mpmtwoform',
            layout: 'fit',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    margin: '-1 -1 0 -1',
                    border: true,
                    items: [
                        {
                            xtype: 'tbtext',
                            text: me.ppubfun.scoreTime()

                        },
                        '->',
                        me.ppubfun.apsDatefield()
                        ,
                        {
                            xtype: 'button',
                            tooltip: '提取数据',
                            iconCls: 'order-refresh',
                            handler: function (btn) {

                                var age = this.ownerCt.ownerCt.patientInfo.AGE;
                                var toppanel =Ext.getCmp(btn.ownerCt.ownerCt.mod + 'mpmtowPanel');
                                me.ppubfun.setNameValue(toppanel,age);
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var intervalTime = 24;
                                var startTime = "";
                                var endTime = new Date(pickDate).Format("yyyy-MM-dd 23:59:59");
                                if(intervalTime == 24){
                                    startTime = new Date(pickDate).Format("yyyy-MM-dd 00:00:00");
                                }else if(intervalTime == 48){
                                    startTime = this.DateAdd('h',-48,(new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
                                }else if(intervalTime == 72){
                                    startTime = this.DateAdd('h',-72,(new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
                                }
                                me.ppubfun.setGcsValue(toppanel,registerId,startTime,endTime);
//                                var scoreCode = "mpm3"; //  当前评分项
//                                if(this.ownerCt.ownerCt.patientInfo == null){
//                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
//                                    return;
//                                }
//                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
//                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
//                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'mpmtowPanel');
//                                var intervalTime = 24;
//                                var dateObj = toppanel.down("radiogroup",5);
//                                if(dateObj.getValue().dataTime == -5.64592){
//                                    intervalTime = 24;
//                                }else if(dateObj.getValue().dataTime == -5.392){
//                                    intervalTime = 48;
//                                }else if(dateObj.getValue().dataTime == -5.238){
//                                    intervalTime = 72;
//                                }
//                                //创建遮罩效果
//                                var lm = new Ext.LoadMask(me.ownerCt,{
//                                    msg: "数据加载中。。。"
//                                });
//                                lm.show();
//                                me.ppubfun.getApsData(registerId,pickDate,scoreCode,intervalTime,function(apsData){
//
//                                    if(apsData == undefined){
//                                        Ext.Msg.alert("提示", "未获取到任何数据，请在护理记录核对要提取日期数据！");
//                                        lm.hide();
//                                        return;
//                                    }
//                                    // 处理页面业务逻辑
//                                    for(var itemStr in apsData){
//                                        var itemValue = 0;
//                                        if(itemStr == "ure"){
//                                            itemValue = eval("apsData."+itemStr);
//                                     var recordtt = me.mpmOneItmeGrid.getStore().getAt(3);
//                                    if(itemValue > 177){
//                                        recordtt.set('SEL', true);
//                                    }else{
//                                        recordtt.set('SEL', false);
//                                    }
//                                    recordtt.commit();
//                                            }
//                                        if(itemStr == "Urine"){
//                                            itemValue = eval("apsData."+itemStr);
//                                            var recordtt = me.mpmOneItmeGrid.getStore().getAt(4);
//                                            if(itemValue < 150){
//                                                recordtt.set('SEL', true);
//                                            }else{
//                                                recordtt.set('SEL', false);
//                                            }
//                                            recordtt.commit();
//                                        }
//                                        if(itemStr == "pao"){
//                                            itemValue = eval("apsData."+itemStr);
//                                            var recordtt = me.mpmOneItmeGrid.getStore().getAt(9);
//                                            if(itemValue < 60){
//                                                recordtt.set('SEL', true);
//                                            }else{
//                                                recordtt.set('SEL', false);
//                                            }
//                                            recordtt.commit();
//                                        }
//                                    }
//                                    lm.hide();
//                                });
                            }

                        },
                        '-',

                        {
                            xtype: 'button',
                            tooltip: '计算',
                            iconCls: 'ico-count',
                            handler: function (btn) {
                                var contentStr = '';
                                var mr = "";
                                var coefficients = 0;//系数
                                var age = 0;
                                var tiemCoe = 0; // 数据采集时间系数
                                var gcsCoe = 0;
                                var veri = false;
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var rowCon = me.mpmOneItmeGrid.getStore().getCount();
                                //获取评分项目系数
                                for (var i = 0; i < rowCon; i++) {
                                    var sel = me.mpmOneItmeGrid.getStore().getAt(i).get('SEL');
                                    var coe = "";
                                    if (sel) {
                                        coe = me.mpmOneItmeGrid.getStore().getAt(i).get('Coefficient');
                                        coefficients = coefficients + Number(coe);
                                    }
                                    contentStr = contentStr + '"Grading' + i + '":"' + coe + '",';
                                }
                                //获取年龄系数
                                var toppanel = Ext.getCmp(me.mod + 'mpmtowPanel');
                                me.findItem(toppanel);

                                contentStr = '"Grading":{' + contentStr.substr(0, contentStr.length - 1) + '}';
                                me.itemscore = me.itemscore + contentStr;
                                me.itemscore = '{"mpmtwo":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}}';
                                contentStr = me.itemscore;
                                //转换为对象
                                var mpmTwoitem = Ext.JSON.decode(me.itemscore);
                                //各种验证
                                veri = me.itemVerification(mpmTwoitem);
                                if (!veri) {
                                    return;
                                }
                                age = mpmTwoitem.mpmtwo.age;
                                age = age * 0.03268;//计算年龄系数
                                tiemCoe = mpmTwoitem.mpmtwo.dataTime;//获取时间采集系数
                                gcsCoe = Number(mpmTwoitem.mpmtwo.Eyes) + Number(mpmTwoitem.mpmtwo.Language) + Number(mpmTwoitem.mpmtwo.Motor);
                                if (gcsCoe <= 5) {
                                    gcsCoe = 1.68790;
                                } else {
                                    gcsCoe = 0;
                                }
                                coefficients = coefficients + age + gcsCoe + Number(tiemCoe);//总系数
                                coefficients = Math.exp(coefficients) / (1 + Math.exp(coefficients));
                                mr = me.Fmt(100 * coefficients) + "%";
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.mpmtwo.CountWindow',
                                    {
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me,
                                        mr: mr
                                    });
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,cw);
                                cw.on('close', function(){
                                    //项目明细json串置空，下次打开窗口从新拼装
                                    me.itemscore = "";
                                });
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '帮助',
                            iconCls: 'ico-help',
                            handler: function (btn) {
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'mpmone'});
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,hw);
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'panel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    autoScroll: true,

                    layout: 'fit',
                    items: [
                        {xtype: 'form',
                            layout: 'border',
                            id: me.mod + 'mpmtowPanel',
                            minHeight: 500,
                            items: [
                                {xtype: 'panel',
                                    region: 'north',
                                    height: 360,
                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            region: 'west',
                                            width: 260,
                                            margin: '0 0 0 0',
                                            layout: 'border',
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    region: 'north',
                                                    height: 100,
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            title: '年龄',
                                                            collapsible: true,
                                                            margin: '0 5 0 5',
                                                            padding: '0 5 0 5',
                                                            height: 50,
                                                            layout: 'column',
                                                            items: [
                                                                {
                                                                    xtype: 'numberfield',
                                                                    name: 'age',
                                                                    columnWidth: 0.90,
                                                                    labelWidth: 32,
                                                                    fieldLabel: '年龄',
                                                                    margin: '0 0 0 5',
                                                                    maxValue:200,
                                                                    minValue:0,
                                                                    decimalPrecision:1,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {
                                                                    xtype: 'label',
                                                                    columnWidth: 0.10,
                                                                    text: '岁',
                                                                    margin: '5 0 0 5'
                                                                }
                                                            ]

                                                        },
                                                        {
                                                            xtype: 'fieldset',
                                                            title: '数据采集时间',
                                                            columnWidth: 0.45,
                                                            collapsible: true,
                                                            margin: '0 5 0 5',
                                                            padding: '0 5 0 5',
                                                            items: [
                                                                {
                                                                    xtype: 'radiogroup',
                                                                    vertical: true,
                                                                    layout: 'column',
                                                                    columns: 3,
                                                                    items: [
                                                                        {
                                                                            columnWidth: 0.3,
                                                                            name: 'dataTime',
                                                                            boxLabel: '24小时',
                                                                            checked:true,
                                                                            inputValue: -5.64592
                                                                        },
                                                                        {
                                                                            name: 'dataTime',
                                                                            columnWidth: 0.3,
                                                                            boxLabel: '48小时',
                                                                            inputValue: -5.392
                                                                        },
                                                                        {
                                                                            name: 'dataTime',
                                                                            columnWidth: 0.3,
                                                                            boxLabel: '72小时',
                                                                            inputValue: -5.238
                                                                        }
                                                                    ]}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'panel',
                                                    region: 'center',
                                                    margin: '0',
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            title: 'GCS',
                                                            collapsible: true,
                                                            margin: '0 5 5 5',
                                                            padding: '0 5 0 5',
                                                            layout: 'border',
                                                            items: [
                                                                {xtype: 'panel',
                                                                    region: 'north',
                                                                    // width:150,
                                                                    // layout: 'form',
                                                                    items: [
                                                                        {
                                                                            xtype: 'combo',
                                                                            name: 'Eyes',
                                                                            fieldLabel: '睁眼反应',
                                                                            width: 233,
                                                                            editable: false,
                                                                            labelWidth: 60,
                                                                            padding: '0 3 0 3',
                                                                            margin: '0 1 5 1',
                                                                            value: '',
                                                                            valueField: 'value',
                                                                            displayField: 'text',
                                                                            store: new Ext.data.SimpleStore({
                                                                                fields: ['value', 'text'],
                                                                                data: [
                                                                                    ['4', '4自动睁眼'],
                                                                                    ['3', '3呼唤睁眼'],
                                                                                    ['2', '2刺痛睁眼'],
                                                                                    ['1', '1不能睁眼'],
                                                                                    ['0', 'C肿到睁不开']
                                                                                ]
                                                                            })

                                                                        },
                                                                        {
                                                                            xtype: 'combo',
                                                                            name: 'Language',
                                                                            fieldLabel: '语言反应',
                                                                            width: 233,
                                                                            editable: false,
                                                                            margin: '4 1 4 1',
                                                                            padding: '0 3 0 3',
                                                                            labelWidth: 60,
                                                                            value: '',
                                                                            valueField: 'value',
                                                                            displayField: 'text',
                                                                            store: new Ext.data.SimpleStore({
                                                                                fields: ['value', 'text'],
                                                                                data: [
                                                                                    ['5', '5回答切题'],
                                                                                    ['4', '4回答不切题'],
                                                                                    ['3', '3答非所问'],
                                                                                    ['2', '2只能发音'],
                                                                                    ['1', '1不能言语'],
                                                                                    ['0', 'T插管或气切无法发声']
                                                                                ]
                                                                            })

                                                                        },
                                                                        {
                                                                            xtype: 'combo',
                                                                            name: 'Motor',
                                                                            fieldLabel: '运动反应',
                                                                            margin: '5 1 2 1',
                                                                            padding: '0 3 0 3',
                                                                            width: 233,
                                                                            editable: false,
                                                                            labelWidth: 60,
                                                                            value: '',
                                                                            valueField: 'value',
                                                                            displayField: 'text',
                                                                            store: new Ext.data.SimpleStore({
                                                                                fields: ['value', 'text'],
                                                                                data: [
                                                                                    ['6', '6按吩咐动作'],
                                                                                    ['5', '5刺痛能定位'],
                                                                                    ['4', '4刺痛能躲避'],
                                                                                    ['3', '3刺痛肢体屈曲'],
                                                                                    ['2', '2刺痛肢体伸展'],
                                                                                    ['1', '1不能活动']
                                                                                ]
                                                                            })
                                                                        },
                                                                        {
                                                                            xtype: 'label',
                                                                            text: '病情描述：',
                                                                            margin: '2 1 5 1'
                                                                        }
                                                                    ]} ,
                                                                {xtype: 'panel',
                                                                    region: 'center',
                                                                    layout: 'fit',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textarea',
                                                                            name: 'cd',
                                                                            width: '97%',
                                                                            maxLength:me.ppubfun.cdLength,
                                                                            height: '100%',
                                                                            margin: '0 0 5 0'
                                                                        }
                                                                    ]}
                                                            ]

                                                        }


                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            region: 'center',
                                            margin: '0 0 0 0',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: '评分项目',
                                                    collapsible: true,
                                                    margin: '0 20 5 3',
                                                    padding: '0 5 5 5',
                                                    layout: 'fit',
                                                    items: [
                                                        me.mpmOneItmeGrid
                                                    ]}
                                            ]}

                                    ]},
                                {
                                    xtype: 'panel',
                                    region: 'center',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            title: '趋势',
                                            margin: '0 20 5 5',
                                            padding: '0 5 5 5',
                                            layout: 'fit',
                                            items: [

                                                {
                                                    xtype: 'panel',
                                                    layout: 'border',
                                                    bodyStyle: 'background: white',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            region: 'west',
                                                            width: '50%',
                                                            margin: '1 1 1 1',
                                                            style: {
                                                                padding: '0'
                                                            },
                                                            layout: 'fit',
                                                            items: [
                                                                me.chartT
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldset',
                                                            region: 'center',
                                                            margin: '1 1 1 5',
                                                            padding: '0',
                                                            layout: 'fit',
                                                            items: [
                                                                me.mpmOneGrid

                                                            ]

                                                        }
                                                    ]
                                                }

                                            ]

                                        }
                                    ]
                                }
                            ]}


                    ]
                }
            ]

        });

        this.callParent(arguments);
        var scoreCode = "9a7e2868b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
        var toppanel = Ext.getCmp(me.mod + 'mpmtowPanel');
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a7e2868b18811e3aa8800271396a820";
        me.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
    },
    loadPageData: function (patientId, scoreCode) {
        var me = this;
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getCores/' + patientId + '/' + scoreCode,
            method: 'GET',
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    me.load(reqmsg.data, patientId, scoreCode);
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
    },
    // 填充页面数据
    load: function (data, patientId) {
        var me = this;
        if (Ext.isArray(data) && data.length > 0) { //如果不是空则填充页面数据
            var scoreItemStr = "";
            var chartItemStr = "";
            for(var i = 0;i < data.length; i++){
                var scoreItem = data[i];

                var subTime = me.ppubfun.formatTimeToGrid(scoreItem.SCORES_TIME);
                scoreItemStr = scoreItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.length - 1) + ',"scoretime":"' + subTime + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.indexOf(":") + 1) + scoreItem.PHM.substring(scoreItem.PHM.indexOf(":") + 2,scoreItem.PHM.lastIndexOf("%")) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0,chartItemStr.length - 1) + ']';
            var chartdata = Ext.JSON.decode(chartItemStr);
            me.chartstoreT.loadData(chartdata);
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0,scoreItemStr.length - 1) + ']}';
            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);
            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name:'ITEM',mapping:'scoretime'},
                    {name:'SCORE',mapping:'mr'}
                ],
                proxy: {
                    type: 'memory',
                    data : datatable,
                    reader: {
                        totalProperty:'totalRecord',
                        type: 'json',
                        root: 'scoreItemStr'
                    }
                },
                autoLoad: true//自动加载
            });
            me.mpmOneGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.mpmOneGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});