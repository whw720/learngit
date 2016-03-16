/**
 * ARDS评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.ards.ArdsForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ardsform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.ards.ArdsGrid',
    'com.dfsoft.icu.nws.nursingscores.ards.ValueCount',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
    'Ext.chart.Chart'],
    itemscore:"",
    operType:"",
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
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.ardsGrid = new com.dfsoft.icu.nws.nursingscores.ards.ArdsGrid();
        me.changCalc = new com.dfsoft.icu.nws.nursingscores.ards.ValueCount();
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

        Ext.apply(this, {
            title: 'ARDS',
            closable: true,
            tooltip: '急性呼吸窘迫综合征评分',
            id: me.mod + 'ardsform',
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
                                var scoreCode = "ards"; //当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'ardstoppanel');
                                var intervalTime = 24;
                                var lm = new Ext.LoadMask(me.ownerCt,{
                                    msg: "数据加载中。。。"
                                });
                                lm.show();
                                me.ppubfun.getApsData(registerId,pickDate,scoreCode,intervalTime,function(apsData){
                                    //创建遮罩效果

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
                                var scoreCode = "ards"; //  当前评分项
                                if(this.ownerCt.ownerCt.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
                                var toppanel = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'ardstoppanel');
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
                                var scores = 0;
                                var ChangeScores = "";

                                var toppanel = Ext.getCmp(me.mod + 'ardstoppanel');

                                //表单验证.
                                if(!me.ppubfun.veriPower(toppanel.isValid())){
                                    Ext.Msg.alert("提示", "请完善数据信息！");
                                    return;
                                }
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"ards":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var ardsitem = Ext.JSON.decode(me.itemscore);
                                console.log(ardsitem);
                                if(ardsitem.ards.fio == "0"){
                                    Ext.Msg.alert("提示", "FiO2项目值不能为 0 ，请重新录入！");
                                    me.itemscore = "";
                                    return;
                                }

                                // 获取系数规则
                                Ext.Ajax.request({
                                    url: parent.webRoot + '/app/nws/nursingscores/ards/ChangeScores.json',
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
                                scores = me.changCalc.scoresCount(ChangeScores, ardsitem);

                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.ards.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: me.itemscore,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'ards'});
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
                    id:me.mod + 'ardstoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'center',
                            margin: '0 0 0 0',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 110,
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
                                                    name: 'pao',
                                                    columnWidth: 0.50,
                                                    labelWidth: 150,
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
                                                    style:'border:red 0px solid',
                                                    labelWidth: 130,
                                                    fieldLabel: 'FiO2（%）',
                                                    allowBlank: false,
                                                    margin: '2 1 2 1',
                                                    labelAlign: 'right',
                                                    minValue:0.01,
                                                    decimalPrecision:2,
                                                    maxValue:99,
                                                    nanText:'输入必需为数值',
                                                    negativeText:'输入数据不能小于0'//,
//                                                    listeners: {
//                                                        change: function(thiso,newValue,oldValue,eOpts){
//                                                            if(newValue == 0){
//                                                                console.log(newValue);
//                                                               // thiso.setBorder(1);
//                                                                thiso.focus(true,100);
//                                                                //alert(value);
//                                                            }
//
//                                                        }
//                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    name: 'lm',
                                                    columnWidth: 0.50,
                                                    labelWidth: 150,
                                                    fieldLabel: '分钟通气量（L/min）',
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
                                                    name: 'peep',
                                                    columnWidth: 0.50,
                                                    labelWidth: 130,
                                                    fieldLabel: 'PEEP（cmHO2）',
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
                                                    name: 'mc',
                                                    columnWidth: 0.50,
                                                    labelWidth: 150,
                                                    fieldLabel: '肺顺应性（ml/cmHO2）',
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
                                                    columnWidth: 0.50,
                                                    name: 'foie',
                                                    labelWidth: 130,
                                                    labelAlign: 'right',
                                                    margin: '2 1 2 1',
                                                    fieldLabel: '胸片检查',
                                                    editable: false,
                                                    valueField: 'value',
                                                    displayField: 'text',
                                                    store: new Ext.data.SimpleStore({
                                                        fields: ['value','text'],
                                                        data: [
                                                            ['0','正常'],
                                                            ['1','轻度弥漫性肺间质浸润'],
                                                            ['2','弥漫性肺间质和肺泡浸润'],
                                                            ['3','重度弥漫性肺泡浸润']
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
                                                            margin: '1 5 1 1',
                                                            padding: '1 1 1 1',
                                                            layout: 'border',
                                                            items: [
                                                                me.chartT
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldset',
                                                            region: 'center',
                                                            margin: '1 1 1 1',
                                                            padding: '0',
                                                            layout: 'fit',
                                                            items: [
                                                                me.ardsGrid

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
        var scoreCode = "9a4bcbb4b18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'ardstoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a4bcbb4b18811e3aa8800271396a820";
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
            me.ardsGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.ardsGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});