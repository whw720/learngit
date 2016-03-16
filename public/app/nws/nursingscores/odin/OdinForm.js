/**
 * Tiss28评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.odin.OdinForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.odinform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.odin.OdinGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],
    itemscore: "",
    operType:"",
    Fmt:function(x){
        var v;
        if(x>=0) { v=''+(x+0.05) } else { v=''+(x-0.05) }
        return v.substring(0,v.indexOf('.')+3);
    },
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
            if (itemobj.xtype == "radiogroup") {
                var itemSel = itemobj.getValue();

                var itemValue = eval("itemSel." + itemobj.name + "_auto");

                me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemValue + '",';

            } else {

                me.itemscore = me.itemscore + '"' + itemobj.name + '":"' + itemobj.getValue() + '",';
            }
        }
    },
    countCore:function(odinItems){

        console.log(odinItems);

        var me = this;
        var sumcore = 0;
        var sumValue = 0;
        var objItems = odinItems;
        for(var o in objItems.odin){
            if(o != "Eyes" && o != "Language" && o != "Motor"  && o != "cd"){

                if(eval("objItems.odin." + o) != "undefined"){
                    if(eval("objItems.odin." + o) > 0){
                        sumcore = sumcore + 1;
                    }
                    sumValue = sumValue + Number(eval("objItems.odin." + o));

                }
            };
        }
        sumValue = sumValue - 3.59;
        sumValue = Math.exp(sumValue)/(1 + Math.exp(sumValue));
        sumValue = me.Fmt(100 * sumValue) + " %";
        return sumcore + ";" + sumValue;
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.odinGrid = new com.dfsoft.icu.nws.nursingscores.odin.OdinGrid();

        me.chartdataT = [{"mr":0,"scores":0,"scoretime":"0","no":"0"}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','mr','scores','no'],
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
                title:'得分',
                minimum: 0,
                position: 'left',
                fields: ['scores'],//,
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
            title: 'ODIN',
            closable: true,
            tooltip: '器官功能障碍伴或不伴感染评分系统',
            id: me.mod + 'odinform',
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
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var toppanel = Ext.getCmp(me.mod + 'odintoppanel');
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var startTime=new Date(pickDate).Format("yyyy-MM-dd 00:00:00");
                                var endTime=new Date(pickDate).Format("yyyy-MM-dd 23:59:59");
                                me.ppubfun.setGcsValue(toppanel,registerId,startTime,endTime);
//                                var scoreCode = "odin"; //  当前评分项
//                                if(this.ownerCt.ownerCt.patientInfo == null){
//                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
//                                    return;
//                                }
//                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
//                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
//                                var toppanel = Ext.getCmp(me.mod + 'odintoppanel');
//                                var intervalTime = 24;
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
//                                        if(itemStr == "pao"){
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue < 60){
//                                                Ext.getCmp(me.mod + 'Respiration').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'Respiration').items.items[1].setValue(true);
//                                            }
//                                        }
//
//                                        if(itemStr == "SBP"){
////                                            itemValue = eval("apsData."+itemStr);
////                                            if(itemValue < 90){
////                                                Ext.getCmp('urg').items.items[1].checked = true;
////                                                Ext.getCmp('urg').items.items[1].setValue(true);
////                                            }
//                                        }
//                                        if(itemStr == "ure"){//  肾脏
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue > 300){
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].setValue(true);
//                                            }
//
//                                        }
//                                        if(itemStr == "uop"){//  肾脏
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue < 500){
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].setValue(true);
//                                            }
//                                        }
//
//                                        if(itemStr == "hc"){//  肾脏－－血压积球
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue < 500){
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].setValue(true);
//                                            }
//                                        }
//                                        if(itemStr == "gb"){//  肾脏 －－WBC
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue < 500){
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].setValue(true);
//                                            }
//                                        }
//                                        if(itemStr == "coag"){//  肾脏－－血小板计数
//                                            itemValue = eval("apsData."+itemStr);
//                                            if(itemValue < 500){
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].checked = true;
//                                                Ext.getCmp(me.mod + 'creat').items.items[1].setValue(true);
//                                            }
//                                        }
//                                    }
//
///*
// 呼吸  sex_auto   －－－－Respiration
// 心血管 urg_auto－－－－urg
// 肾脏 creat_auto－－－－creat
// 中枢 lvef_auto－－－－－GCSlvef
// 肝脏 copd_auto－－－－Liver
// 血液 tho_auto－－－－tho
// 感染 arterio_auto－－－－arterio
//* */
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
                                var scores = 0;//得分
                                var contentStr = '';//项目明细json串
                                var ChangeScores = '';//分值系数对应对象
                                var mr = "";//死亡率
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var toppanel = Ext.getCmp(me.mod + 'odintoppanel');
                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善全部项目判断信息！");
                                    return;
                                }
                                if(!me.down('textarea').isValid()){
                                    me.itemscore="";
                                    return false;
                                }
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"odin":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                 var odinItems = Ext.JSON.decode(me.itemscore);
                                scores = me.countCore(odinItems);
                                mr = scores.substring(scores.indexOf(";") + 1, scores.length);
                                scores = scores.substring(0, scores.indexOf(";"));
                                contentStr =  me.itemscore;
                                //显示计算结果窗口
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.odin.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me,
                                        mr: mr
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'odin'});
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
                    id: me.mod + 'odintoppanel',

                    style: {
                        borderTop: '1px solid silver'
                    },
                    autoScroll: true,
                    padding: '0',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'panel',
                            minHeight: 850,
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'west',
                                    width: 240,
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
                                                                    width: 213,
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
                                                                    }),
                                                                    listeners: {
                                                                        'change': function (obj, newValue, oldValue, eOpts) {
                                                                            var eyesCore = 0;
                                                                            var LangCore = 0;
                                                                            var coreCount = 0; //GCS总得分
                                                                            var gcsLanguage = obj.nextSibling();
                                                                            var gcsEyes = gcsLanguage.nextSibling();
                                                                            if(gcsLanguage.getValue() != ""){
                                                                                LangCore = gcsLanguage.getValue();
                                                                            }
                                                                            if(gcsEyes.getValue() != ""){
                                                                                eyesCore = gcsEyes.getValue();
                                                                            }
                                                                            coreCount = Number(eyesCore) + Number(LangCore) + Number(newValue);

                                                                            if(coreCount < 6){
                                                                                Ext.getCmp(me.mod + 'GCSlvef').disable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = true;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(true);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);

                                                                            }else{
                                                                                Ext.getCmp(me.mod + 'GCSlvef').enable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(false);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);
                                                                            }


                                                                        }
                                                                    }

                                                                },
                                                                {
                                                                    xtype: 'combo',
                                                                    name: 'Language',
                                                                    fieldLabel: '语言反应',
                                                                    allowBlank: false,
                                                                    width: 213,
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
                                                                    }),
                                                                    listeners: {
                                                                        'change': function (obj, newValue, oldValue, eOpts) {
                                                                            var eyesCore = 0;
                                                                            var LangCore = 0;
                                                                            var coreCount = 0; //GCS总得分
                                                                            var gcsLanguage = obj.previousSibling();
                                                                            var gcsEyes = obj.nextSibling();

                                                                            if(gcsLanguage.getValue() != ""){
                                                                                LangCore = gcsLanguage.getValue();
                                                                            }
                                                                            if(gcsEyes.getValue() != ""){
                                                                                eyesCore = gcsEyes.getValue();
                                                                            }
                                                                            coreCount = Number(eyesCore) + Number(LangCore) + Number(newValue);

                                                                            if(coreCount < 6){
                                                                                Ext.getCmp(me.mod + 'GCSlvef').disable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = true;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(true);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);

                                                                            }else{
                                                                                Ext.getCmp(me.mod + 'GCSlvef').enable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(false);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);
                                                                            }


                                                                        }
                                                                    }

                                                                },
                                                                {
                                                                    xtype: 'combo',
                                                                    name: 'Motor',
                                                                    fieldLabel: '运动反应',
                                                                    allowBlank: false,
                                                                    margin: '5 1 2 1',
                                                                    padding: '0 3 0 3',
                                                                    width: 213,
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
                                                                        }
                                                                    ),
                                                                    listeners: {
                                                                        'change': function (obj, newValue, oldValue, eOpts) {
                                                                            var eyesCore = 0;
                                                                            var LangCore = 0;
                                                                            var coreCount = 0; //GCS总得分
                                                                            var gcsLanguage = obj.previousSibling();
                                                                            var gcsEyes = gcsLanguage.previousSibling();
                                                                         if(gcsLanguage.getValue() != ""){
                                                                             LangCore = gcsLanguage.getValue();
                                                                         }
                                                                            if(gcsEyes.getValue() != ""){
                                                                                eyesCore = gcsEyes.getValue();
                                                                            }
                                                                            coreCount = Number(eyesCore) + Number(LangCore) + Number(newValue);

                                                                            if(coreCount < 6){
                                                                                Ext.getCmp(me.mod + 'GCSlvef').disable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = true;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(true);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);

                                                                            }else{
                                                                                Ext.getCmp(me.mod + 'GCSlvef').enable();
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[1].setValue(false);
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].checked = false;
                                                                                Ext.getCmp(me.mod + 'GCSlvef').items.items[2].setValue(false);
                                                                            }

                                                                        }
                                                                    }
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
                                    margin: '0 15 0 0',
                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            region: 'north',
                                            layout: 'column',
                                            columns: 2,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: '呼吸',
                                                    height: 80,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: 'PaO2 < 60mmHg（FiO2=0.21）',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '需要呼吸支持',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//呼吸
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                             columns: 1,
                                                            id:me.mod + 'Respiration',
                                                            name: 'sex',
                                                            blankText:'请选择是或否',
                                                            vertical: true,
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    // checked: true,
                                                                    name: 'sex_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 1.09
                                                                },
                                                                {
                                                                    name: 'sex_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '心血管（无低容量,CVP< 5 mmH）',
                                                    height: 80,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: 'SBP < 90 mmHg 有外周低灌注体征',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '持续输注升压药或正肌力药物维持 SBP > 90 mmHg',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//心血管
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            columns: 1,
                                                            name: 'urg',
                                                            id:me.mod + 'urg',
                                                            blankText:'请选择是或否',
                                                            vertical: true,
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    //  checked: true,
                                                                    name: 'urg_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 1.19
                                                                },
                                                                {
                                                                    name: 'urg_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '肾脏',
                                                    height: 120,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: '血肌酐> 300 umol /L',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '尿量< 500mL/24 h or <180 mL/8 h',
                                                            margin: '1 1 5 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '需要血透或腹透',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//肾脏
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    height: 111,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            columns: 1,
                                                            name: 'creat',
                                                            id:me.mod + 'creat',
                                                            blankText:'请选择是或否',
                                                            vertical: true,
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    //  checked: true,
                                                                    name: 'creat_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 1.18
                                                                },
                                                                {
                                                                    name: 'creat_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',

                                                    title: '中枢',
                                                    height: 80,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: 'GCS < 6',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '突然发生精神错乱等',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//中枢
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    // height:70,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',

                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            columns: 1,
                                                           // disabled: true,
                                                            id:me.mod + 'GCSlvef',
                                                            name: 'lvef',
                                                            vertical: true,
                                                            blankText:'请选择是或否',
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    //  checked: true,
                                                                    name: 'lvef_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 0.99
                                                                },
                                                                {
                                                                    name: 'lvef_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '肝脏',
                                                    height: 80,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: '胆红素 > 100 umol /L',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '碱性磷酸酶 > 3 x N',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//肝脏
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    // height:70,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            id:me.mod + 'Liver',
                                                            name:'copd',
                                                            columns: 1,
                                                            //name: 'copd',
                                                            blankText:'请选择是或否',
                                                            vertical: true,
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    // checked: true,
                                                                    name: 'copd_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 0.57
                                                                },
                                                                {
                                                                    name: 'copd_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '血液',
                                                    height: 120,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: '血球压积 < = 20%',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: 'WBC < 2X10^9/L',
                                                            margin: '1 1 5 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '血小板计数 < 40X10^9/L',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//血液
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    height: 111,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            name: 'tho',
                                                            id:me.mod + 'tho',
                                                            columns: 1,
                                                            vertical: true,
                                                            blankText:'请选择是或否',
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    //  checked: true,
                                                                    name: 'tho_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 0.86
                                                                },
                                                                {
                                                                    name: 'tho_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '感染',
                                                    height: 120,
                                                    columnWidth: 0.8,
                                                    padding: '3',
                                                    collapsible: true,
                                                    margin: '0 0 0 3',
                                                    layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: '2 次血培养阳性',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '在封闭体腔脓液的存在',
                                                            margin: '1 1 5 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '或：',
                                                            margin: '1 5 1 1'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: '住院期间或死亡24h内尸检发现感染灶',
                                                            margin: '1 1 5 1'
                                                        }

                                                    ]

                                                },//感染
                                                {
                                                    xtype: 'fieldset',
                                                    columnWidth: 0.2,
                                                    height: 111,
                                                    style: {
                                                        borderLeft: '0px'
                                                    },
                                                    margin: '9 5 0 0',
                                                    padding: '0',
                                                    items: [
                                                        {
                                                            xtype: 'radiogroup',
                                                            allowBlank: false,
                                                            name: 'arterio',
                                                            id:me.mod + 'arterio',
                                                            columns: 1,
                                                            vertical: true,
                                                            blankText:'请选择是或否',
                                                            items: [
                                                                {xtype: 'label',
                                                                    text: '判断：'},
                                                                {
                                                                    // checked: true,
                                                                    name: 'arterio_auto',
                                                                    boxLabel: '是',
                                                                    inputValue: 0.53
                                                                },
                                                                {
                                                                    name: 'arterio_auto',
                                                                    boxLabel: '否',
                                                                    inputValue: 0,
                                                                    padding: '0 0 0 0'
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
                                                                        me.odinGrid

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

                        }
                    ]

                }
            ]

        });

        this.callParent(arguments);
        var scoreCode = "9a304f24b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'odintoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a304f24b18811e3aa8800271396a820";
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
                chartItemStr = chartItemStr + '{' + scoreItem.PHM.substring(1,scoreItem.PHM.indexOf(":") + 1) + scoreItem.PHM.substring(scoreItem.PHM.indexOf(":") + 2,scoreItem.PHM.lastIndexOf("%") - 1) + ',' + scoreItem.SCORE.substring(1,scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 2,scoreItem.SCORE.length - 2) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
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
                    {name:'SCORES',mapping:'scores'},
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
            me.odinGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.odinGrid.getStore().loadData("");
        }
        me.elm.hide();
    }

});