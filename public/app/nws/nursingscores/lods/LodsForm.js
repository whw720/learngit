/**
 * LODS评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.lods.LodsForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.lodsform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.lods.LodsGrid',
    'com.dfsoft.icu.nws.nursingscores.lods.ValueCount',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],
    itemscore: "",
    operType:"",
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
    itemVerification: function (lodsitem) {
        var me = this;

        if (lodsitem.lods.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (lodsitem.lods.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (lodsitem.lods.Motor == "") {
            Ext.Msg.alert("提示", "请选择运动反应");
            me.itemscore = "";
            return false;
        }
        if (lodsitem.lods.fio == "null") {
            Ext.Msg.alert("提示", "请输入APS下FiO2(%)!");
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
        me.lodsGrid = new com.dfsoft.icu.nws.nursingscores.lods.LodsGrid();
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.lods.ValueCount();
        me.chartdataT = [{"mr":0,"sumAll":0,"scoretime":"0","no":"0","car":"","blo":"","liv":"","ner":"","ren":"","bre":""}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','mr','sumAll','no','car','blo','liv','ner','ren','bre'],
            data:me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            animate: true,
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
                title:'得分',
                minimum: 0,
                position: 'left',
               // fields: ['car','blo','liv','ner','ren','bre'],
                fields: ['sumAll'],
                grid: true
            },{
                type: 'Numeric',
                minimum: 0,
                position: 'right',
                fields: ['mr'],
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['no']
            }],
            /*
            *  ['心血管分值', me.scores.car + '分'],
             ['血液学分值',  me.scores.blo + '分'],
             ['肝功能分值',  me.scores.liv + '分'],
             ['神经学分值',  me.scores.ner + '分'],
             ['肾功能分值',  me.scores.ren + '分'],
             ['呼吸分值',  me.scores.bre + '分'],
            *
            *
            * */
            series: [
//                {
//                    type: 'line',
//                    title :'心血管',
//                    highlight: {
//                        size: 5,
//                        radius: 5
//                    },
//                    tips: {
//                        trackMouse: true,
//                        width: 158,
//                        height: 36,
//                        renderer: function(storeItem, item) {
//                            console.log("---123---");
//                            console.log(storeItem);
//                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>心血管分值:' + storeItem.get('car') + '</span>');
//                        }
//                    },
//                    axis: 'left',
//                    xField: 'no',
//                    yField: 'car',
//                    markerCfg: {
//                        type: 'cross',
//                        size: 4,
//                        radius: 4,
//                        'stroke-width': 0
//                    }
//                },
//                {
//                    type: 'line',
//                    title :'血液学',
//                    highlight: {
//                        size: 5,
//                        radius: 5
//                    },
//                    tips: {
//                        trackMouse: true,
//                        width: 158,
//                        height: 36,
//                        renderer: function(storeItem, item) {
//                            console.log("---123---");
//                            console.log(storeItem);
//                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>心血管分值:' + storeItem.get('blo') + '</span>');
//                        }
//                    },
//                    axis: 'left',
//                    xField: 'no',
//                    yField: 'blo',
//                    markerCfg: {
//                        type: 'cross',
//                        size: 4,
//                        radius: 4,
//                        'stroke-width': 0
//                    }
//                },
//                {
//                    type: 'line',
//                    title :'肝功能',
//                    highlight: {
//                        size: 5,
//                        radius: 5
//                    },
//                    tips: {
//                        trackMouse: true,
//                        width: 158,
//                        height: 36,
//                        renderer: function(storeItem, item) {
//                            console.log("---123---");
//                            console.log(storeItem);
//                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>肝功能分值:' + storeItem.get('liv') + '</span>');
//                        }
//                    },
//                    axis: 'left',
//                    xField: 'no',
//                    yField: 'liv',
//                    markerCfg: {
//                        type: 'cross',
//                        size: 4,
//                        radius: 4,
//                        'stroke-width': 0
//                    }
//                },
//                {
//                    type: 'line',
//                    title :'神经学',
//                    highlight: {
//                        size: 5,
//                        radius: 5
//                    },
//                    tips: {
//                        trackMouse: true,
//                        width: 158,
//                        height: 36,
//                        renderer: function(storeItem, item) {
//                            console.log("---123---");
//                            console.log(storeItem);
//                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>心血管分值:' + storeItem.get('ner') + '</span>');
//                        }
//                    },
//                    axis: 'left',
//                    xField: 'no',
//                    yField: 'ner',
//                    markerCfg: {
//                        type: 'cross',
//                        size: 4,
//                        radius: 4,
//                        'stroke-width': 0
//                    }
//                },
//                {
//                    type: 'line',
//                    title :'肾功能',
//                    highlight: {
//                        size: 5,
//                        radius: 5
//                    },
//                    tips: {
//                        trackMouse: true,
//                        width: 158,
//                        height: 36,
//                        renderer: function(storeItem, item) {
//                            console.log("---123---");
//                            console.log(storeItem);
//                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>心血管分值:' + storeItem.get('ren') + '</span>');
//                        }
//                    },
//                    axis: 'left',
//                    xField: 'no',
//                    yField: 'ren',
//                    markerCfg: {
//                        type: 'cross',
//                        size: 4,
//                        radius: 4,
//                        'stroke-width': 0
//                    }
//                },
                {
                type: 'line',
                title :'得分',
                highlight: {
                    size: 5,
                    radius: 5
                },
                tips: {
                    trackMouse: true,
                    width: 158,
                    height: 36,
                    renderer: function(storeItem, item) {
                        this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>分值:' + storeItem.get('sumAll') + '</span>');
                    }
                },
                axis: 'left',
                xField: 'no',
                yField: 'sumAll',
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
                            console.log(storeItem);
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
            title: 'LODS',
            closable: true,
            tooltip: 'Logistic脏器功能不全评分',
            id: me.mod + 'lodsform',
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
                            hidden:true,
                            iconCls: 'order-refresh',
                            handler: function (btn) {
                                var scoreCode = "lods"; //当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'lodstoppanel');
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
                                var scoreCode = "lods"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'lodstoppanel');
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
                                var scores = "";//得分
                                var contentStr = '';//项目明细json串
                                var ChangeScores = '';//分值系数对应对象
                                var mr = "";//死亡率
                                var veri = false;
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var toppanel = Ext.getCmp(me.mod + 'lodstoppanel');
                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }

                                me.itemscore = "";
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"lods":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                contentStr =  me.itemscore;
                                //转换为对象
                                var lodsitem = Ext.JSON.decode(me.itemscore);
                                //各种验证
                                veri = me.itemVerification(lodsitem);
                                if (!veri) {
                                    return;
                                }
                                // 获取系数规则
                                Ext.Ajax.request({
                                    url: parent.webRoot + '/app/nws/nursingscores/lods/ChangeScores.json',
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
                                scores = me.changCalc.scoresCount(ChangeScores, lodsitem);
                                mr = scores.sumAll;
                                mr = me.changCalc.CalcMort(mr);
                                //显示计算结果窗口
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.lods.CountWindow',
                                    {
                                        scores: scores,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'lods'});
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
                    id:me.mod + 'lodstoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    autoScroll:true,
                    items:[
                        {
                            xtype:'panel',
                            minHeight:390,
                            region:'center',
                            layout:'border',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'west',
                            width: 200,
                            margin: '0 0 0 0',
                            layout: 'border',
                            items: [
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
                                                    items: [
                                                        {
                                                            xtype: 'combo',
                                                            name: 'Eyes',
                                                            fieldLabel: '睁眼反应',
                                                            allowBlank: false,
                                                            width: 173,
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
                                                            allowBlank: false,
                                                            width: 173,
                                                            editable: false,
                                                            margin: '4 1 4 1',
                                                            padding: '0 3 0 3',
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
                                                            fieldLabel: '运动反应',
                                                            allowBlank: false,
                                                            margin: '5 1 2 1',
                                                            padding: '0 3 0 3',
                                                            width: 173,
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
                                                    ]}
                                                ,
                                                {xtype: 'panel',
                                                    region: 'center',
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'textarea',
                                                            name: 'cd',
                                                            width: '97%',
                                                            height: '100%',
                                                            maxLength:me.ppubfun.cdLength,
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
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 200,
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            title: 'APS',
                                            collapsible: true,
                                            margin: '0 20 0 3',
                                            padding: '0 5 0 5',
                                            height: '100%',
                                            layout: 'column',
                                            columns: 2,
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'hr',
                                                    columnWidth: 0.50,
                                                    labelWidth: 110,
                                                    fieldLabel: '心率（次/分）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'bps',
                                                    columnWidth: 0.50,
                                                    labelWidth: 120,
                                                    fieldLabel: '收缩压（mmHg）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'wbc',
                                                    columnWidth: 0.50,
                                                    labelWidth: 110,
                                                    fieldLabel: 'WBC（x10^9/L）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'

                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'plt',
                                                    columnWidth: 0.50,
                                                    labelWidth: 120,
                                                    fieldLabel: '血小板（x10^9/L）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.50,
                                                    name:'pao',
                                                    labelWidth: 110,
                                                    fieldLabel: 'PaO2（mmHg）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'fio',
                                                    columnWidth: 0.50,
                                                    labelWidth: 120,
                                                    fieldLabel: 'FiO2（mmHg）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0.01,
                                                    decimalPrecision:2,
                                                    maxValue:99,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'su',
                                                    columnWidth: 0.50,
                                                    labelWidth: 110,
                                                    fieldLabel: '尿素(mmol/L)',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'sun',
                                                    columnWidth: 0.50,
                                                    labelWidth: 120,
                                                    fieldLabel: '尿素氮(mmol/L)',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.50,
                                                    name:'cr',
                                                    labelWidth: 110,
                                                    fieldLabel: '肌酐(umol/L)',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'ur',
                                                    columnWidth: 0.50,
                                                    labelWidth: 120,
                                                    fieldLabel: '尿量(L / 24 H)',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'bil',
                                                    columnWidth: 0.50,
                                                    labelWidth: 110,
                                                    fieldLabel: '胆红素( umol/L)',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0,
                                                    decimalPrecision:4,
                                                    maxValue:9999,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'
                                                },
                                                {
                                                    xtype: 'combo',
                                                    name: 'pt',
                                                    columnWidth: 0.50,
                                                    fieldLabel: '凝血酶原时间',
                                                    allowBlank: false,
                                                    editable: false,
                                                    labelWidth: 120,
                                                    labelAlign: 'right',
                                                    value: '',
                                                    valueField: 'value',
                                                    displayField: 'text',
                                                    store: new Ext.data.SimpleStore({
                                                        fields: ['value', 'text'],
                                                        data: [
                                                            ['1', '0~24%'],
                                                            ['2', '≥ 25%'],
                                                            ['3', 'N + 0 到 +2.9秒'],
                                                            ['4', 'N + 3秒']
                                                        ]
                                                    })
                                                }
                                            ]}
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    region: 'center',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            title: '趋势',
                                            margin: '0 20 5 3',
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
                                                                me.lodsGrid

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
        var scoreCode = "9a3b1800b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
        var toppanel = Ext.getCmp(me.mod + 'lodstoppanel');
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a3b1800b18811e3aa8800271396a820";
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
                scoreItemStr = scoreItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.length - 1) + ',' + scoreItem.SCORE.substring(1,scoreItem.SCORE.length - 1) + ',"scoretime":"' + subTime + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.indexOf(":") + 1) + scoreItem.PHM.substring(scoreItem.PHM.indexOf(":") + 2,scoreItem.PHM.lastIndexOf("%")) + ',' + scoreItem.SCORE.substring(1,scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 1,scoreItem.SCORE.length - 1) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0,chartItemStr.length - 1) + ']';

           // console.log(chartItemStr);

            var chartdata = Ext.JSON.decode(chartItemStr);

            var cd = [];
            for(var h = 0;h<chartdata.length;h++){
                var cis = chartdata[h];
                var blo = {"blo":Number(cis.blo),"bre":Number(cis.bre),"car":Number(cis.car),"liv":Number(cis.liv),"mr":cis.mr,"ner":Number(cis.ner),"no":Number(cis.no),"ren":Number(cis.ren),"scoretime":cis.scoretime,"sumAll":Number(cis.sumAll)};
                cd.push(blo);
            };
           // console.log(chartdata);
          //  console.log(cd);
            me.chartstoreT.loadData(cd);
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0,scoreItemStr.length - 1) + ']}';
            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);
            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name:'ITEM',mapping:'scoretime'},
                    {name:'SCORES',mapping:'sumAll'},
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
            me.lodsGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.lodsGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});