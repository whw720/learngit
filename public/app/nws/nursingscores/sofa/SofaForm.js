/**
 * sofa评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.sofa.SofaForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sofaform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.sofa.SofaGrid',
    'com.dfsoft.icu.nws.nursingscores.sofa.ValueCount',
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
    itemVerification: function (sofaitem) {
        var me = this;

        if (sofaitem.sofa.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (sofaitem.sofa.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (sofaitem.sofa.Motor == "") {
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
        me.sofaGrid = new com.dfsoft.icu.nws.nursingscores.sofa.SofaGrid();
        me.chartdataT = [{"scores":0,"scoretime":"0","no":"0"}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','scores','no'],
            data:me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            width: '100%',
            height: '100%',
            insetPadding:3,
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
                fields: ['scores'],//,
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
            }]
        });
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.sofa.ValueCount();
        Ext.apply(this, {
            title: 'SOFA',
            closable: true,
            tooltip: '序贯器官衰竭评估',
            id: me.mod + 'sofaform',
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

                                var scoreCode = "sofa"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'sofatoppanel');
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
                                var scoreCode = "sofa"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'sofatoppanel');
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
                                var sofaItem = "";
                                var ChangeScores = '';//分值系数对应对象
                                var veri = false;
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var toppanel = Ext.getCmp(me.mod + 'sofatoppanel');

                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }

                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"sofa":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var sofaItem = Ext.JSON.decode(me.itemscore);
                                veri = me.itemVerification(sofaItem);
                                if (!veri) {
                                    return;
                                }
                               // 获取系数规则
                                Ext.Ajax.request({
                                    url: parent.webRoot + '/app/nws/nursingscores/sofa/ChangeScores.json',
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
                                scores = me.changCalc.scoresCount(ChangeScores,sofaItem);
                                contentStr = me.itemscore;
                                me.itemscore = "";
                                //显示计算结果窗口
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.sofa.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'sofa'});
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
                    id:me.mod + 'sofatoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
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
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 115,
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
                                                    xtype: 'numberfield',
                                                    name: 'resp1',
                                                    columnWidth: 0.50,
                                                    labelWidth: 97,
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
                                                    name: 'resp2',
                                                    columnWidth: 0.50,
                                                    labelWidth: 135,
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
                                                    xtype: 'combo',
                                                    name: 'pas',
                                                    fieldLabel: '升压药',
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    columnWidth: 0.50,
                                                    editable: false,
                                                    labelWidth: 97,
                                                    value: '',
                                                    valueField: 'value',
                                                    displayField: 'text',
                                                    store: new Ext.data.SimpleStore({
                                                        fields: ['value', 'text'],
                                                        data: [
                                                            ['1', '平均动脉压 < 70mmHg'],
                                                            ['2', '多巴酚丁胺或多巴胺用量 <= 5umol/min'],
                                                            ['3', '多巴酚丁胺或多巴胺用量 > 5umol/min'],
                                                            ['4', '肾上腺素或去甲肾上腺素 >= 0.1'],
                                                            ['3', '肾上腺素或去甲肾上腺素 < 0.1']
                                                        ]
                                                    })
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'coag',
                                                    columnWidth: 0.50,
                                                    labelWidth: 135,
                                                    fieldLabel: '血小板计数(X10^9/L)',
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
                                                    name: 'foie',
                                                    columnWidth: 0.50,
                                                    labelWidth: 97,
                                                    fieldLabel: '胆红素(umol/L)',
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
                                                    name: 'uree',
                                                    fieldLabel: '肌酐或尿量（umol/L）',
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    columnWidth: 0.50,
                                                    editable: false,
                                                    labelWidth: 135,
                                                    value: '',
                                                    valueField: 'value',
                                                    displayField: 'text',
                                                    store: new Ext.data.SimpleStore({
                                                        fields: ['value', 'text'],
                                                        data: [
                                                            ['1', '110-170'],
                                                            ['2', '171-299'],
                                                            ['3', '300-440 or <500 mL/24h'],
                                                            ['4', '>440 or <200 mL/24h']
                                                        ]
                                                    })
                                                }//,
//                                                {
//                                                    xtype: 'numberfield',
//                                                    name: 'uree',
//                                                    columnWidth: 0.50,
//                                                    labelWidth: 135,
//                                                    fieldLabel: '肌酐或尿量（umol/L）',
//                                                    allowBlank: false,
//                                                    margin: '2 1 2 1',
//                                                    labelAlign: 'right',
//                                                    minValue:0,
//                                                    decimalPrecision:4,
//                                                    maxValue:9999,
//                                                    nanText:'输入必需为数值',
//                                                    negativeText:'输入数据不能小于0'
//                                                }
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
                                                                me.sofaGrid

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
        var scoreCode = "9a26be97b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'sofatoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a26be97b18811e3aa8800271396a820";
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
                scoreItemStr = scoreItemStr + '{' + scoreItem.SCORE.substring(1,scoreItem.SCORE.length - 1) + ',"scoretime":"' + subTime + '"},';

                chartItemStr = chartItemStr + '{' + scoreItem.SCORE.substring(1,scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 2,scoreItem.SCORE.length - 2) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + (i + 1) +'"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0,chartItemStr.length - 1) + ']';
            var chartdata = Ext.JSON.decode(chartItemStr);
            //图表加载数据
            me.chartstoreT.loadData(chartdata);
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0,scoreItemStr.length - 1) + ']}';
            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);
            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name:'ITEM',mapping:'scoretime'},
                    {name:'SCORES',mapping:'scores'}
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
            me.sofaGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.sofaGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});