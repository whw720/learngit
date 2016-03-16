/**
 * Tiss28评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.crpossum.CrPossumForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.crpossumform',
    requires: ['com.dfsoft.icu.nws.nursingscores.crpossum.ValueCount',
        'com.dfsoft.icu.nws.nursingscores.crpossum.CrPossumStoreGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun'],
    itemscore: "",
    operType:'edit',
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
    /*分值项目录入验证*/
    itemVerification: function (crpossumitem) {
        var me = this;
        if (crpossumitem.crpossum.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (crpossumitem.crpossum.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (crpossumitem.crpossum.Motor == "") {
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
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.crpossum.ValueCount();
        me.crpossumstoregrid = new com.dfsoft.icu.nws.nursingscores.crpossum.CrPossumStoreGrid();
        me.chartdataT = [{"mr":0,"morta":0,"scoretime":"0","no":"0"}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','mr','morta','no'],
            data:me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            animate: true,
            insetPadding:3,
            store: me.chartstoreT,
            style: {
                background:'#fff',
                marginBottom: '0px'
            },
            shadow: true,
            theme: 'Category1',
            legend: {
                position: 'top'
            },

            axes: [{
                type: 'Numeric',
                title:'并发症发生率',
                minimum: 0,
                position: 'left',
                fields: ['morta'],//,
                grid: true
            },{
                type: 'Numeric',
                minimum: 0,
                position: 'right',
                fields: ['mr'],//,
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['no']
            }],
            series: [{
                type: 'line',
                title :'并发症发生率',
                highlight: {
                    size: 5,
                    radius: 5
                },
                tips: {
                    trackMouse: true,
                    width: 158,
                    height: 36,
                    renderer: function(storeItem, item) {
                        this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>并发症发生率:' + storeItem.get('morta') + '%</span>');
                    }
                },
                axis: 'left',
                xField: 'no',
                yField: 'morta',
                markerCfg: {
                    type: 'cross',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            },
                {
                    type: 'line',
                    title :'死亡率',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function(storeItem, item) {
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
                }]
        });
        Ext.apply(this, {
            title: 'Cr-POSSUM',
            closable: true,
            tooltip: '手术死亡和并发症生理学和手术参数评分（结直肠）',
            id: me.mod + 'crpossumform',
            layout: 'fit',
            autoScroll: true,
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
                            hidden:true,
                            iconCls: 'order-refresh',
                            handler: function (btn) {


                                var scoreCode = "crpossum"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'crpossumtoppanel');
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
                        },{
                            xtype: 'button',
                            tooltip: '获取数据',
                            iconCls: 'order-refresh',
                            handler: function (btn){
                                var scoreCode = "crpossum"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'crpossumtoppanel');
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
                                var scores = 0;//得分
                                var contentStr = '';//项目明细json串
                                var ChangeScores = '';//分值系数对应对象
                                var mr = "";//死亡率
                                var morta = "";
                                var veri = false;
                                var toppanel = Ext.getCmp(me.mod + 'crpossumtoppanel');
                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"crpossum":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                var crpossumItem = Ext.JSON.decode(me.itemscore);
                                veri = me.itemVerification(crpossumItem);
                                if (!veri) {
                                    return;
                                }
                                // 获取系数规则
                                Ext.Ajax.request({
                                    url: parent.webRoot + '/app/nws/nursingscores/crpossum/ChangeScores.json',
                                    async: false,
                                    success: function (response) {
                                        var reqmsg = response.responseText;
                                        if (reqmsg != '') {
                                            ChangeScores = Ext.JSON.decode(reqmsg);
                                        } else {
                                            request.showErr(reqmsg.errors, '加载');
                                        }
                                    }
                                });
                                //计算总得分
                                scores = me.changCalc.scoresCount(ChangeScores,crpossumItem);
                                contentStr = me.itemscore;
                                me.itemscore = "";
                                var zapa = 0;//生理分值
                                var zapaa = 0;//手术分值
                                zapa = scores.substring(0, scores.indexOf(";"));
                                zapaa = scores.substring(scores.indexOf(";") + 1, scores.length);
                                morta = me.changCalc.CalcMorta(zapa, zapaa);
                                mr = me.changCalc.CalcMort(zapa, zapaa);
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.crpossum.CountWindow',
                                    {
                                        morta: morta,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'crpossum'});
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
                    id:me.mod + 'crpossumtoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'north',
                            margin: '0 0 0 0',
                            layout: 'border',
                            height:190,
                            items:[
                                {xtype:'panel',
                                    region:'west',
                                    width:260,
                                    items:[
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
                                                    allowBlank: false,
                                                    columnWidth: 0.90,
                                                    labelWidth: 32,
                                                    fieldLabel: '年龄',
                                                    margin: '0 0 0 5',
                                                    minValue:0,
                                                    maxValue:9999,
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
                                            title: '手术情况',
                                            collapsible: true,
                                            margin: '0 5 0 5',
                                            padding: '0 5 0 5',
                                            items: [
                                                {
                                                    xtype: 'combo',
                                                    name: 'opetype',
                                                    fieldLabel: '手术类型',
                                                    allowBlank: false,
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
                                                            ['1', '小'],
                                                            ['2', '中'],
                                                            ['4', '大'],
                                                            ['8', '特大']
                                                        ]
                                                    })

                                                },
                                                {
                                                    xtype: 'combo',
                                                    name: 'surg',
                                                    fieldLabel: '手术性质',
                                                    allowBlank: false,
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
                                                            ['1', '择期手术'],
                                                            ['3', '亚急诊手术'],
                                                            ['8', '急诊手术（<2H）']
                                                        ]
                                                    })

                                                },
                                                {
                                                    xtype: 'combo',
                                                    name: 'mali',
                                                    fieldLabel: '癌症分期',
                                                    allowBlank: false,
                                                    margin: '4 1 4 1',
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
                                                            ['1', '无'],
                                                            ['1', 'Duke A'],
                                                            ['1', 'Duke B'],
                                                            ['2', 'Duke C'],
                                                            ['3', 'Duke D']
                                                        ]
                                                    })
                                                },
                                                {
                                                    xtype: 'combo',
                                                    name: 'perit',
                                                    fieldLabel: '腹腔污染',
                                                    allowBlank: false,
                                                    margin: '5 1 8 1',
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
                                                            ['1', '无'],
                                                            ['1', '少量血性液体'],
                                                            ['2', '局部脓肿'],
                                                            ['3', '肠内容污染'],
                                                            ['3', '腹腔脓液']
                                                        ]
                                                    })
                                                }
                                            ]
                                        }
                                    ]},
                                {xtype:'panel',
                                    region:'center',
                                    layout:'border',
                                    height:190,
                                    items:[
                                        {
                                            xtype:'panel',
                                            region:'west',
                                            width:'70%',
                                            items:[
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'GCS',
                                                    height:188,
                                                    collapsible: true,
                                                    margin: '0 5 2 5',
                                                    padding: '0 5 0 5',
                                                    layout: 'border',
                                                    items: [
                                                        {xtype: 'panel',
                                                            region: 'north',
                                                            /*height:50,*/
                                                            layout:'column',
                                                            columns:3,
                                                            // width:150,
                                                            // layout: 'form',
                                                            items: [
                                                                {
                                                                    xtype: 'combo',
                                                                    name: 'Eyes',
                                                                    columnWidth:0.33,
                                                                    fieldLabel: '睁眼反应',
                                                                    allowBlank: false,
                                                                    // width: 173,
                                                                    editable: false,
                                                                    labelWidth: 60,
                                                                    // padding: '0 3 0 3',
                                                                    margin: '0 5 5 5',
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
                                                                    columnWidth:0.33,
                                                                    fieldLabel: '语言反应',
                                                                    allowBlank: false,
                                                                    // width: 173,
                                                                    editable: false,
                                                                    margin: '0 5 5 5',
                                                                    // padding: '0 3 0 3',
                                                                    labelWidth: 60,
                                                                    value: '',
                                                                    valueField: 'value',
                                                                    displayField: 'text',
                                                                    listConfig: {
                                                                        minWidth: 150
                                                                    },
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
                                                                    columnWidth:0.33,
                                                                    fieldLabel: '运动反应',
                                                                    allowBlank: false,
                                                                    margin: '0 5 5 5',
                                                                    // padding: '0 3 0 3',
                                                                    // width: 173,
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
                                                                    xtype:'label',
                                                                    margin: '0 0 0 4',
                                                                    text:'病情描述:',
                                                                    columnWidth:0.33
                                                                }
                                                            ]}
                                                        ,
                                                        {xtype: 'panel',
                                                            region: 'center',
                                                            layout: 'fit',
                                                            bodyStyle: 'background: white',
                                                            items: [
                                                                {
                                                                    xtype: 'textarea',
                                                                    margin: '3 3 7 3',
                                                                    name: 'cd',
                                                                    width: '97%',
                                                                    maxLength:me.ppubfun.cdLength,
                                                                    height: '100%'

                                                                }
                                                            ]}

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
                                                    title: 'APS',
                                                    collapsible: true,
                                                    margin: '0 5 2 5',
                                                    padding: '0 5 0 5',
                                                    layout: 'column',
                                                    columns: 1,
                                                    items: [
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'ur',
                                                            columnWidth: 1,
                                                            labelWidth: 108,
                                                            fieldLabel: '尿素（mmol/L）',
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
                                                            name: 'hb',
                                                            columnWidth:1,
                                                            labelWidth: 108,
                                                            fieldLabel: '血色素（g/L）',
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
                                                            name: 'fc',
                                                            columnWidth: 1,
                                                            labelWidth: 108,
                                                            fieldLabel: '脉搏（bpm）',
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
                                                            xtype: 'combo',
                                                            name: 'cardio',
                                                            columnWidth: 1,
                                                            fieldLabel: '心衰',
                                                            allowBlank: false,
                                                            editable: false,
                                                            margin: '2 1 2 1',
                                                            labelWidth: 108,
                                                            labelAlign: 'right',
                                                            value: '',
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '无心衰'],
                                                                    ['1', '轻度'],
                                                                    ['2', '中度'],
                                                                    ['3', '重度']
                                                                ]
                                                            })

                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'pao',
                                                            columnWidth: 1,
                                                            labelWidth: 108,
                                                            fieldLabel: '收缩压（mmHg）',
                                                            allowBlank: false,
                                                            margin: '2 1 2 1',
                                                            labelAlign: 'right',
                                                            minValue:0,
                                                            maxValue:9999,
                                                            decimalPrecision:4,
                                                            nanText:'输入必需为数值',
                                                            negativeText:'输入数据不能小于0'
                                                        }
                                                    ]}
                                            ]}
                                    ]}
                            ]
                        },
                        {
                            xtype: 'panel',
                            region: 'center',
                            layout:'fit',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '趋势',
                                    // collapsible: true,
                                    margin: '0 3 1 5',
                                    padding: '0 3 2 3',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            layout: 'border',
                                            bodyStyle: 'background: white',
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    region: 'center',
                                                    width: '50%',
                                                    style: {
                                                        padding: '0'
                                                    },
                                                    margin: '0 5 3 2',
                                                    padding: '1 1 0 1',
                                                    layout: 'fit',
                                                    items: [
                                                        me.chartT
                                                    ]


                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    region: 'east',
                                                    width: '50%',
                                                    margin: '0 3 3 5',
                                                    padding: '0',
                                                    layout: 'fit',
                                                    items: [
                                                        me.crpossumstoregrid
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]

        });

        this.callParent(arguments);
        var scoreCode = "64145b42b18711e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    // 切换患者调用
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
        var toppanel = Ext.getCmp(me.mod + 'crpossumtoppanel');
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "64145b42b18711e3aa8800271396a820";
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
            me.operType = 'add';
      /*      var scoreItemStr = "";
            var possumitem = data[data.length-1].CONTENT;
            var posssumdataobj = Ext.JSON.decode(possumitem);
            var toppanel = Ext.getCmp(me.mod + 'crpossumtoppanel');

            me.setItemValue(toppanel,posssumdataobj);*/

            var scoreItemStr = "";
            var chartItemStr = "";
            for(var i = 0;i < data.length; i++){
                var scoreItem = data[i];
                var subTime = me.ppubfun.formatTimeToGrid(scoreItem.SCORES_TIME);
                scoreItemStr = scoreItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.length - 1) + ',' + scoreItem.SCORE.substring(1,scoreItem.SCORE.length - 1) + ',"scoretime":"' + subTime + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.indexOf(":") + 1) + scoreItem.PHM.substring(scoreItem.PHM.indexOf(":") + 2,scoreItem.PHM.lastIndexOf("%") - 1) + ',' + scoreItem.SCORE.substring(1,scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 2,scoreItem.SCORE.lastIndexOf("%") - 1) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
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
                    {name:'SCORES',mapping:'morta'},
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
            me.crpossumstoregrid.reconfigure(tablestore);

        }else{
            me.operType = 'add';
            me.chartstoreT.loadData("");
            me.crpossumstoregrid.getStore().loadData("");
        }
        me.elm.hide();
    },
// 控件赋值
    setItemValue:function(itemobj,crposssumdataobj){
        var me = this;
        if (itemobj.name === undefined) {
            if (itemobj.items === undefined) {
                return '';
            }
            Ext.each(itemobj.items.items, function (item) {
                return me.setItemValue(item,crposssumdataobj);
            })
        } else {
            if (itemobj.xtype == "radiofield") {
            } else {
                for (var p in crposssumdataobj.crpossum){
                    if(itemobj.name == p){
                        if(eval("crposssumdataobj.crpossum."+p) != "null" && eval("crposssumdataobj.crpossum."+p) != ""){
                            itemobj.setValue(eval("crposssumdataobj.crpossum."+p));
                        }
                    }
                }
            }
        }
    }
});