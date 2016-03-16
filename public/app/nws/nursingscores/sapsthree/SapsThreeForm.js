/**
 * sapsThree评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sapsthreeform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeGrid',
    'com.dfsoft.icu.nws.nursingscores.sapsthree.ValueCount',
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
    itemVerification: function (sapsthreeitem) {
        var me = this;
        if (sapsthreeitem.sapsthree.age == "null") {
            alert("请输入年龄！");
            me.itemscore = "";
            return false;
        }
        if (sapsthreeitem.sapsthree.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (sapsthreeitem.sapsthree.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (sapsthreeitem.sapsthree.Motor == "") {
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
        me.apacheThreeGrid = new com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeGrid();
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.sapsthree.ValueCount();
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
            title: 'SAPS Ⅲ',
            closable: true,
            tooltip: '简化急性生理评分 Ⅲ',
            id: me.mod + 'sapsthreeform',
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

                                var scoreCode = "saps3"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'sapsthreetoppanel');
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
                                var scoreCode = "saps3"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'sapsthreetoppanel');
                                var intervalTime = 24;
                                var startTime = "";
                                var endTime = "";
                                endTime = new Date(pickDate).Format("yyyy-MM-dd 23:59:59");
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
                                var saps3Scores = 0;//扩展计算得分
                                var contentStr = '';//项目明细json串
                                var ChangeScores = '';//分值系数对应对象
                                var mr = "";//死亡率
                                var veri = false;
                                me.itemscore = "";
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var toppanel = Ext.getCmp(me.mod + 'sapsthreetoppanel');
                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"sapsthree":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var sapsthreeitem = Ext.JSON.decode(me.itemscore);
                                //各种验证
                              //  veri = me.itemVerification(sapsthreeitem);
                               // if (!veri) {
                              //      return;
                              //  }
                                // 获取系数规则
                                contentStr =  me.itemscore;
                                Ext.Ajax.request({
                                    url: parent.webRoot + '/app/nws/nursingscores/sapsthree/ChangeScores.json',
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
                                //计算总得分 saps2 得分，不包含扩展计算。
                                scores = me.changCalc.scoresCount(ChangeScores, sapsthreeitem);
                                saps3Scores = me.changCalc.scoresKzCount(ChangeScores, sapsthreeitem);// 扩展计算得分
                                saps3Scores = me.changCalc.scoresSaps3(scores,saps3Scores);
                               // mr = me.changCalc.calcDeath(6.219);
                               // console.log(saps3Scores);
                                saps3Scores = saps3Scores.toFixed(3);
                               // console.log(saps3Scores);
                                mr = me.changCalc.calcDeath(Number(saps3Scores));
                               // console.log(saps3Scores);

                                //显示计算结果窗口
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.sapsthree.CountWindow',
                                    {
                                        scores: saps3Scores,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'sapsthree'});
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
                    id:me.mod + 'sapsthreetoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'fit',
                    items:[
                        {
                            xtype:'panel',
                            minHeight:500,
                            region:'center',
                            layout:'border',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'west',
                            width: 252,
                            minHeight:500,
                            margin: '0 0 0 0',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 310,
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            title: '年龄',
                                            collapsible: true,
                                            margin: '0 5 0 5',
                                            padding: '0 5 0 5',
                                            height: 50,
                                            layout: 'column',
                                            columns:3,
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'age',
                                                    columnWidth: 0.50,
                                                    labelWidth: 32,
                                                    fieldLabel: '年龄',
                                                    allowBlank: false,
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
                                                }, {
                                                    xtype: 'combo',
                                                    columnWidth: 0.40,
                                                    name: 'sex',
                                                    fieldLabel: '性别',
                                                    allowBlank: false,
                                                    editable: false,
                                                    labelWidth: 30,
                                                    valueField: 'value',
                                                    displayField: 'text',
                                                    value: '',
                                                    labelAlign: 'left',
                                                    store: new Ext.data.SimpleStore({
                                                        fields: ['value', 'text'],
                                                        data: [
                                                            ['1', '男'],
                                                            ['2', '女']
                                                        ]
                                                    })
                                                }
                                            ]

                                        },
                                        {xtype:'panel',
                                        layout:'column',
                                        columns:2,
                                        items:[
                                            {
                                                xtype: 'fieldset',
                                                title: '入院种类',
                                                columnWidth:0.45,
                                                collapsible: true,
                                                margin: '0 5 0 5',
                                                padding: '0 5 0 5',
                                                items: [
                                                    {
                                                        xtype: 'radiogroup',
                                                        allowBlank: false,
                                                        blankText:'你必须选择一个项目',
                                                        columns: 1,
                                                        vertical: true,
                                                        items: [
                                                            {
                                                                name: 'as_item',
                                                                boxLabel: '内科疾病',
                                                                inputValue: 1
                                                            },
                                                            {
                                                                name: 'as_item',
                                                                boxLabel: '急诊手术',
                                                                inputValue: 2,
                                                                padding: '0 0 0 0'
                                                            },
                                                            {
                                                                name: 'as_item',
                                                                boxLabel: '择期手术',
                                                                inputValue: 3
                                                            },
                                                            {
                                                                name: 'as_item',
                                                                boxLabel: '无',
                                                                inputValue: 4
                                                            }
                                                        ]}
                                                ]
                                            },
                                            {
                                                xtype: 'fieldset',
                                                title: '慢性疾病',
                                                columnWidth:0.55,
                                                collapsible: true,
                                                margin: '0 5 0 5',
                                                padding: '0 5 0 5',
                                                items: [
                                                    {
                                                        xtype: 'radiogroup',
                                                        allowBlank: false,
                                                        blankText:'你必须选择一个项目',
                                                        columns: 1,
                                                        vertical: true,
                                                        items: [
                                                            {
                                                                name: 'chd_item',
                                                                boxLabel: 'AIDS',
                                                                inputValue: 1
                                                            },
                                                            {
                                                                name: 'chd_item',
                                                                boxLabel: '转移性肿瘤',
                                                                inputValue: 2,
                                                                padding: '0 0 0 0'
                                                            },
                                                            {
                                                                name: 'chd_item',
                                                                boxLabel: '恶性血液肿瘤',
                                                                inputValue: 3
                                                            },
                                                            {
                                                                name: 'chd_item',
                                                                boxLabel: '无',
                                                                inputValue: 4
                                                            }
                                                        ]}
                                                ]
                                            }


                                        ]},
                                        {
                                            xtype: 'fieldset',
                                            title: '扩展计算',
                                            collapsible: true,
                                            margin: '0 5 5 5',
                                            padding: '0 5 0 5',
                                                    items: [
                                                        {
                                                            xtype: 'combo',
                                                            name: 'icu',
                                                            fieldLabel: 'ICU前住院天数',
                                                            width: 222,
                                                            editable: false,
                                                            labelWidth: 100,
                                                            padding: '0 3 0 3',
                                                            margin: '0 1 5 1',
                                                            value: '',
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            labelAlign: 'right',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '< 24h'],
                                                                    ['2', '1d'],
                                                                    ['3', '2d'],
                                                                    ['4', '3-9d'],
                                                                    ['5', '>9d']
                                                                ]
                                                            })

                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            name: 'loc',
                                                            fieldLabel: 'ICU前场所',
                                                            width: 222,
                                                            editable: false,
                                                            margin: '4 1 4 1',
                                                            padding: '0 3 0 3',
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            labelWidth: 100,
                                                            value: '',
                                                            labelAlign: 'right',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '急诊室'],
                                                                    ['2', '本院病房'],
                                                                    ['3', '他院病房']
                                                                ]
                                                            })

                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            name: 'tox',
                                                            fieldLabel: '中毒',
                                                            allowBlank: false,
                                                            margin: '5 1 2 1',
                                                            padding: '0 3 0 3',
                                                            width: 222,
                                                            editable: false,
                                                            labelWidth: 100,
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            value: '',
                                                            labelAlign: 'right',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '是'],
                                                                    ['2', '否']
                                                                ]
                                                            })
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            name: 'cli',
                                                            fieldLabel: '临床归类',
                                                            allowBlank: false,
                                                            margin: '5 1 5 1',
                                                            padding: '0 3 0 3',
                                                            width: 222,
                                                            editable: false,
                                                            labelWidth: 100,
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            value: '',
                                                            labelAlign: 'right',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '内科'],
                                                                    ['2', '其他']
                                                                ]
                                                            })
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
                                                {xtype: 'panel',
                                                    region: 'north',
                                                    // width:150,
                                                    // layout: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'combo',
                                                            name: 'Eyes',
                                                            fieldLabel: '睁眼反应',
                                                            allowBlank: false,
                                                            width: 222,
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
                                                            width: 222,
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
                                                            allowBlank: false,
                                                            margin: '5 1 2 1',
                                                            padding: '0 3 0 3',
                                                            width: 222,
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
                            minHeight:500,
                            margin: '0 0 0 0',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 198,
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
                                                    name: 'fc',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: '心率（次/分）',
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
                                                    name: 'pas',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: '收缩压（mmHg）',
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
                                                    name: 'temp',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: '体温（腋下℃）',
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
                                                    name: 'diu',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: '尿量（mmol/L）',
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
                                                    name:'pao',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: 'PaO2（mmHg）',
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
                                                    name: 'fio',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: 'FiO2（%）',
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
                                                    name: 'gb',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: 'WBC（x10^9/L）',
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
                                                    name: 'uree',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: 'BUN（mmol/L）',
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
                                                    name: 'na',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: '血清Na（mmol/L）',
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
                                                    name: 'ka',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: '血清K（mmol/L）',
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
                                                    name: 'bili',
                                                    columnWidth: 0.50,
                                                    labelWidth: 115,
                                                    fieldLabel: '胆红素(μmol/L)',
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
                                                    name: 'hc',
                                                    columnWidth: 0.50,
                                                    labelWidth: 140,
                                                    fieldLabel: '血清HCO3-（mmol/L）',
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
                                                                me.apacheThreeGrid

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
        var scoreCode = "9a6890b1b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'sapsthreetoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a6890b1b18811e3aa8800271396a820";
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
            me.apacheThreeGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.apacheThreeGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});