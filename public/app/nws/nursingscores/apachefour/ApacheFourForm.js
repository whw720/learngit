/**
 * apache4评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.apachefour.ApacheFourForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.apachetwoform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.apachefour.ApacheFourGrid',
        'com.dfsoft.icu.nws.nursingscores.apachefour.ValueCount',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],
    itemscore: "",
    operType:"",
    scores:"",
    mr:"",
    icuDay:"",
/*获取所有分值项目*/
    findItem: function (itemobj) {
        var me = this;
        if (itemobj.name === undefined) {
            if (itemobj.items === undefined) {
                return '';
            }
            Ext.each(itemobj.items.items, function (item) {
                return me.findItem(item);
            })
        } else {//checkbox
            if (itemobj.xtype == "checkbox") {
                if (itemobj.getValue()) {
                    me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemobj.inputValue + '",';
                }else{
                    me.itemscore = me.itemscore + '"' + itemobj.name + '":"0",';
                }
            } else {

                me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemobj.getValue() + '",';
            }
        }
    },
    /*分值项目录入验证*/
    itemVerification: function (apache4item){
         //pco2设默认值5.3       PH(acid)设默认值7.4
        var me = this;
        var topform = Ext.getCmp(me.mod + 'apache4toppanel');
        var pco2Obj = Ext.ComponentQuery.query('numberfield[name=pco2]',topform);
        var PHObj = Ext.ComponentQuery.query('numberfield[name=acid]',topform);
        if(apache4item.apache4.pco2 == 'null' && apache4item.apache4.acid == 'null'){
            Ext.Msg.alert("提示", "pco2、PH项没有输入数值，APACHE4评分系统将设默认值为5.3 、 7.4 ！");
            pco2Obj[0].setValue(5.3);
            PHObj[0].setValue(7.4);
        }else if(apache4item.apache4.pco2 == 'null'){
            Ext.Msg.alert("提示", "pco2项没有输入数值，APACHE4评分系统将设默认值为 5.3 ！");
            pco2Obj[0].setValue(5.3);
        }else if(apache4item.apache4.acid == 'null'){
            Ext.Msg.alert("提示", "PH项没有输入数值，APACHE4评分系统将设默认值为 7.4 ！");
            PHObj[0].setValue(7.4);
        }
        if (apache4item.apache4.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (apache4item.apache4.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (apache4item.apache4.Motor == "") {
            Ext.Msg.alert("提示", "请选择运动反应");
            me.itemscore = "";
            return false;
        }
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.apacheFourGrid = new com.dfsoft.icu.nws.nursingscores.apachefour.ApacheFourGrid();
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.apachefour.ValueCount();
        me.chartdataT = [
            {"mr": 0, "scores": 0, "scoretime": "0", "no": "0"}
        ];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime', 'mr', 'scores', 'no'],
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
                position: 'top'
            },

            axes: [
                {
                    type: 'Numeric',
                    title: '得分',
                    minimum: 0,
                    position: 'left',
                    fields: ['scores'],//,
                    grid: true
                },
                {
                    type: 'Numeric',
                    minimum: 0,
                    position: 'right',
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
                    title: '得分',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>分值:' + storeItem.get('scores') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'scores',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
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
                    axis: 'right',
                    xField: 'no',
                    yField: 'mr',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                }
            ]
        });
        Ext.apply(this, {
            title: 'APACHE Ⅳ',
            closable: true,
            tooltip: '急性生理学及慢性健康状况评分 Ⅳ',
            id: me.mod + 'apachefourform',
            overflow: true,
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
                            text:me.ppubfun.scoreTime()
                        },
                        '->',
                        me.ppubfun.apsDatefield(),
                        {
                            xtype: 'button',
                            tooltip: '提取数据',
                            hidden:true,
                            iconCls: 'order-refresh',
                            handler: function (btn) {
                                var scoreCode = "apache4"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'apache4toppanel');
                                var intervalTime = 24;
                                //创建遮罩效果
                                var lm = new Ext.LoadMask(me.ownerCt,{
                                    msg: "数据加载中。。。"
                                });
                                lm.show();
                                me.ppubfun.getApsData(registerId,pickDate,scoreCode,intervalTime,function(apsData){

                                    if(apsData == undefined){
                                        Ext.Msg.alert("提示", "未获取到任何数据，请在护理记录核对要提取日期数据！");
                                        lm.hide();
                                        return;
                                    }

                                    me.ppubfun.setApsValue(toppanel,apsData);
                                    lm.hide();
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '获取数据',
                            iconCls: 'order-refresh',
                            handler: function (btn){
                                var scoreCode = "apache4"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'apache4toppanel');
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
                                if(me.nwsApp.showModalWindow){
                                    me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetWindow', {
                                        registerId:registerId,
                                        startTime:startTime,
                                        scoreCode:scoreCode,
                                        endTime:endTime,
                                        parent:me,
                                        toppanel:toppanel
                                    }));
                                }else{
                                    me.nwsApp.showModalWindowDws(Ext.create('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetWindow', {
                                        registerId:registerId,
                                        startTime:startTime,
                                        scoreCode:scoreCode,
                                        endTime:endTime,
                                        parent:me,
                                        toppanel:toppanel
                                    }));
                                }


                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '计算',
                            iconCls: 'ico-count',
                            handler: function (btn) {
                                var contentStr = "";
                                var veri = false;
                                var mrAndIcuDay = "";
                                var toppanel = Ext.getCmp(me.mod + 'apache4toppanel');
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }
                                me.itemscore = "";
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"apache4":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var apache4item = Ext.JSON.decode(me.itemscore);
                                me.itemVerification(apache4item);
                               var calcbo =  me.changCalc.apacheIV(apache4item,me.mod);
                               if(!calcbo){
                                   return;
                                }
                                if(!me.down('textarea').isValid()){
                                    me.itemscore="";
                                    return false;
                                }
                                contentStr = me.itemscore;
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.apachefour.CountWindow',
                                    {
                                        scores: me.scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me,
                                        mr: me.mr,
                                        icuDay: me.icuDay
                                    });

                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,cw);
                                cw.on('close', function () {
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'apachefour'});
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,hw);
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'form',
                    autoScroll: true,
                    id:me.mod + 'apache4toppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'panel',
                            minHeight: 500,
                            region: 'center',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'west',
                                    width: 300,
                                    margin: '0',
                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            region: 'north',
                                            height: 303,
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
                                                            allowBlank: false,
                                                            decimalPrecision:1,
                                                            //value:55,
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
                                                    title: '慢性健康情况',
                                                    collapsible: true,
                                                    margin: '0 5 0 5',
                                                    padding: '0 5 0 5',
                                                    height: 125,
                                                    layout: 'column',
                                                    column: 2,
                                                    items: [
                                                        {
                                                            xtype: 'checkbox',
                                                            name: 'chc1',
                                                           // checked:true,
                                                            columnWidth: 0.60,
                                                            boxLabel: '慢性肾衰/透析',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'9'
                                                        },
                                                        {

                                                            xtype: 'checkbox',
                                                            name: 'chc5',
                                                            columnWidth: 0.40,
                                                            boxLabel: '转移性癌症',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'11'
                                                        },
                                                        {
                                                            xtype: 'checkbox',
                                                            name: 'chc2',
                                                           // checked:true,
                                                            columnWidth: 0.60,
                                                            boxLabel: 'AIDS',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'23'
                                                        },
                                                        {

                                                            xtype: 'checkbox',
                                                            name: 'chc3',
                                                            columnWidth: 0.40,
                                                            boxLabel: '肝功能衰竭',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'16'
                                                        },
                                                        {

                                                            xtype: 'checkbox',
                                                            name: 'chc7',
                                                            columnWidth: 0.60,
                                                            boxLabel: '免疫抑制',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'10'
                                                        },
                                                        {

                                                            xtype: 'checkbox',
                                                            name: 'chc4',
                                                            columnWidth: 0.40,
                                                            boxLabel: '淋巴瘤',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'13'
                                                        },
                                                        {

                                                            xtype: 'checkbox',
                                                            name: 'chc6',
                                                            columnWidth: 0.60,
                                                            boxLabel: '白血病/多发性骨髓瘤',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'10'
                                                        },
                                                        {
                                                            xtype: 'checkbox',
                                                            name: 'chc8',
                                                            columnWidth: 0.40,
                                                            boxLabel: '肝硬化',
                                                            labelAlign: 'right',
                                                            align: 'right',
                                                            inputValue:'4'
                                                        }

                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'ICU入住信息',
                                                    collapsible: true,
                                                    margin: '0 5 0 5',
                                                    padding: '0 5 0 5',
                                                    items: [
                                                        {
                                                            xtype: 'combo',
                                                            name: 'admitsource',
                                                            fieldLabel: 'ICU前场所',
                                                            width: 272,
                                                            editable: false,
                                                            labelWidth: 97,
                                                            value: '',
                                                            labelAlign: 'right',
                                                            allowBlank: false,
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['0','其他'],
                                                                    ['1','病房'],
                                                                    ['2','手术室/复苏室'],
                                                                    ['3','其他医院']
                                                                ]
                                                            })

                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'los',
                                                            width: 272,
                                                            labelAlign: 'right',
                                                            labelWidth: 97,
                                                            maxValue:200,
                                                            minValue:0,
                                                            decimalPrecision:1,
                                                            //value:55,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0',
                                                           // value:3,
                                                            fieldLabel: 'ICU前住院天数'

                                                        },
                                                        {xtype: 'panel',
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {
                                                                    xtype: 'checkbox',
                                                                    name: 'emergsurg',
                                                                   // checked:true,
                                                                    columnWidth: 0.50,
                                                                    boxLabel: '急诊手术',
                                                                    labelAlign: 'right',
                                                                    align: 'right',
                                                                    inputValue: '0.249073458'
                                                                },
                                                                {

                                                                    xtype: 'checkbox',
                                                                   // checked:true,
                                                                    name: 'readmit',
                                                                    columnWidth: 0.50,
                                                                    boxLabel: '再次入ICU',
                                                                    labelAlign: 'right',
                                                                    align: 'right',
                                                                    inputValue: '0.540368459'
                                                                },
                                                                {

                                                                    xtype: 'checkbox',
                                                                   // checked:true,
                                                                    name: 'vent',
                                                                    columnWidth: 0.50,
                                                                    boxLabel: '24小时内曾用呼吸机',
                                                                    labelAlign: 'right',
                                                                    align: 'right',
                                                                    inputValue: '1.835309541'
                                                                }

                                                            ]


                                                        }
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
                                                        {
                                                            xtype: 'panel',
                                                            region: 'north',
                                                            items: [
                                                                {
                                                                    xtype: 'combo',
                                                                    name: 'Eyes',
                                                                    fieldLabel: '睁眼反应',
                                                                    width: 270,
                                                                    editable: false,
                                                                    allowBlank: false,
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
                                                                    width: 270,
                                                                    editable: false,
                                                                    allowBlank: false,
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
                                                                    width: 270,
                                                                    editable: false,
                                                                    labelWidth: 60,
                                                                    allowBlank: false,
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
                                                            ]
                                                        }
                                                        ,
                                                        {
                                                            xtype: 'panel',
                                                            region: 'center',
                                                            layout: 'fit',
                                                            items: [
                                                                {
                                                                    xtype: 'textarea',
                                                                    name: 'cd',
                                                                    width: '97%',
                                                                    height: '100%',
                                                                    maxLength: me.ppubfun.cdLength,
                                                                    margin: '0 0 5 0'
                                                                }
                                                            ]
                                                        }

                                                    ]

                                                }


                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    region: 'center',

                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            region: 'north',
                                            margin: '0 15 0 0',
                                            height: 303,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'APS',
                                                    collapsible: true,
                                                    margin: '0 5 0 3',
                                                    padding: '0 5 0 5',
                                                    height: '100%',
                                                    layout: 'column',
                                                    columns: 2,
                                                    items: [
                                                        {
                                                            xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {
                                                                    xtype: 'numberfield',
                                                                    name: 'templ',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 140,
                                                                    fieldLabel: '体温（℃）',
                                                                    margin: '2 2 2 0',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:20,
                                                                    maxValue:45,
                                                                    decimalPrecision:1,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'

                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'temph',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 0 2 2',
                                                                    minValue:20,
                                                                    allowBlank: false,
                                                                    maxValue:45,
                                                                    decimalPrecision:1,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {xtype: 'numberfield',
                                                                    name: 'nal',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    fieldLabel: '血清Na（mmol/L）',
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'nah',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {
                                                            xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                { xtype: 'numberfield',
                                                                    name: 'sbpl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 140,
                                                                    fieldLabel: '收缩压（mmHg）',
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                { xtype: 'numberfield',
                                                                    name: 'sbph',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {xtype: 'numberfield',
                                                                    name: 'glucosel',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    allowBlank: false,
                                                                    fieldLabel: '血糖（mmol/L）',
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'glucoseh',
                                                                    columnWidth: 0.30,
                                                                    labelWidth: 160,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {xtype: 'numberfield',
                                                                    name: 'dbpl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 140,
                                                                    fieldLabel: '舒张压（mmHg）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'dbph',
                                                                    columnWidth: 0.30,
                                                                    labelWidth: 160,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {xtype: 'numberfield',
                                                                    name: 'creatl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    fieldLabel: '血清肌酐Cr（mmol/L）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'creath',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                {xtype: 'numberfield',
                                                                    name: 'hrl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 140,
                                                                    fieldLabel: '心率（次/分）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:1,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                {xtype: 'numberfield',
                                                                    name: 'hrh',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:1,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                { xtype: 'numberfield',
                                                                    name: 'bunl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    fieldLabel: '尿素氮BUN（mmol/L）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                { xtype: 'numberfield',
                                                                    name: 'bunh',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                { xtype: 'numberfield',
                                                                    name: 'rrl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 140,
                                                                    fieldLabel: '呼吸频率（次/分）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                { xtype: 'numberfield',
                                                                    name: 'rrh',
                                                                    columnWidth: 0.30,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'uop',
                                                            columnWidth: 0.50,
                                                            labelWidth: 142,
                                                            fieldLabel: '尿量（ml/24hrs）',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'alt',
                                                            columnWidth: 0.50,
                                                            labelWidth: 140,
                                                            fieldLabel: '当大气压（米）',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'alb',
                                                            columnWidth: 0.50,
                                                            labelWidth: 142,
                                                            fieldLabel: '白蛋白（mg/dl）',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'fio2',
                                                            columnWidth: 0.50,
                                                            labelWidth: 140,
                                                            fieldLabel: 'FiO2（%）',
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            allowBlank: false,
                                                            minValue:0.01,
                                                            decimalPrecision:2,
                                                            maxValue:99,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'bili',
                                                            columnWidth: 0.50,
                                                            labelWidth: 142,
                                                            fieldLabel: '总胆红素（mg/dl）',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'acid',
                                                            columnWidth: 0.50,
                                                            labelWidth: 140,
                                                            fieldLabel: '动脉血PH',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                { xtype: 'numberfield',
                                                                    name: 'hctl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    fieldLabel: '血球压积（%）',
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    allowBlank: false,
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                { xtype: 'numberfield',
                                                                    name: 'hcth',
                                                                    columnWidth: 0.30,
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'po2',
                                                            columnWidth: 0.50,
                                                            labelWidth: 140,
                                                            fieldLabel: 'PO2（mmHg）',
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            allowBlank: false,
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        },
                                                        {xtype: 'container',
                                                            columnWidth: 0.50,
                                                            layout: 'column',
                                                            columns: 2,
                                                            items: [
                                                                { xtype: 'numberfield',
                                                                    name: 'wbcl',
                                                                    columnWidth: 0.70,
                                                                    labelWidth: 142,
                                                                    fieldLabel: '白细胞（x10^3/mm^3）',
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                },
                                                                { xtype: 'numberfield',
                                                                    name: 'wbch',
                                                                    columnWidth: 0.30,
                                                                    allowBlank: false,
                                                                    margin: '2 1 2 1',
                                                                    labelAlign: 'right',
                                                                    minValue:0,
                                                                    maxValue:9999,
                                                                    decimalPrecision:4,
                                                                    nanText:'输入必需为数值',
                                                                    negativeText:'输入数据不能小于0'
                                                                }
                                                            ]

                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'pco2',
                                                            columnWidth: 0.50,
                                                            labelWidth: 140,
                                                            fieldLabel: 'PCO2（mmHg）',
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            allowBlank: false,
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        }

                                                    ]}
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            region: 'center',
                                            margin: '0 15 0 0',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: '趋势',
                                                    margin: '0 5 5 3',
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
                                                                    layout: 'border',
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
                                                                        me.apacheFourGrid
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

                }
            ]

        });

        this.callParent(arguments);
        var scoreCode = "9a177b5db18811e3aa8800271396a820";

        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'apache4toppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a177b5db18811e3aa8800271396a820";
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
            for (var i = 0; i < data.length; i++) {
                var scoreItem = data[i];
                var subTime = me.ppubfun.formatTimeToGrid(scoreItem.SCORES_TIME);
                scoreItemStr = scoreItemStr + '{' + scoreItem.PHM.substring(1, scoreItem.PHM.length - 1) + ',' + scoreItem.SCORE.substring(1, scoreItem.SCORE.length - 1) + ',"scoretime":"' + subTime + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.PHM.substring(1, scoreItem.PHM.indexOf(":") + 1) + scoreItem.PHM.substring(scoreItem.PHM.indexOf(":") + 2, scoreItem.PHM.lastIndexOf("%")) + ',' + scoreItem.SCORE.substring(1, scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 2, scoreItem.SCORE.length - 2) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0, scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0, chartItemStr.length - 1) + ']';
            var chartdata = Ext.JSON.decode(chartItemStr);

            me.chartstoreT.loadData(chartdata);
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0, scoreItemStr.length - 1) + ']}';
            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);
            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name: 'ITEM', mapping: 'scoretime'},
                    {name: 'SCORES', mapping: 'scores'},
                    {name: 'SCORE', mapping: 'mr'}
                ],
                proxy: {
                    type: 'memory',
                    data: datatable,
                    reader: {
                        totalProperty: 'totalRecord',
                        type: 'json',
                        root: 'scoreItemStr'
                    }
                },
                autoLoad: true//自动加载
            });
            me.apacheFourGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.apacheFourGrid.getStore().loadData("");
        }
        me.elm.hide();
    }

});