/**
 * Tiss28评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.timiriskustform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstGrid',
    'com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstItemGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],

    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.timiriskusteGrid = new com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstGrid();
        me.timiriskustItmeGrid = new com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstItemGrid();
        me.timiriskustItmeGrid.addListener('itemclick', itemclick);
        function itemclick(grid, record, item, index, e, eOpts) {
            if (record.get('SEL')) {
                record.set('SEL', false);
                record.commit();
            } else {
                record.set('SEL', true);
                record.commit();
            }
        };

        me.chartdataT = [{"scores":0,"scoretime":"0","no":"0"}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','scores','no'],
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
                position: 'right'
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
            title: 'TIMI Risk-UST',
            closable: true,
            tooltip: '急性心肌梗死溶栓风险评分-非ST抬高型',
            id: me.mod + 'timiriskustform',
            layout: 'fit',
            bodyStyle: 'background: white',
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
                            iconCls: 'order-refresh',
                            handler: function (btn) {
//                                var scoreCode = "timiust"; //  当前评分项
//                                if(this.ownerCt.ownerCt.patientInfo == null){
//                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
//                                    return;
//                                }
//                                var registerId = this.ownerCt.ownerCt.patientInfo.REGISTER_ID;
//                                var pickDate = btn.up('panel').down('[name=apsDate]').getValue();
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
//                                    var fc = apsData.hr;
//                                    var recordtt = me.timiriskustItmeGrid.getStore().getAt(4);
//                                    if(fc > 100){
//                                        recordtt.set('SEL', true);
//                                    }else{
//                                        recordtt.set('SEL', false);
//                                    }
//                                    recordtt.commit();
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
                                var scores = 0;
                                var contentStr = "";
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }


                                var rowCon = me.timiriskustItmeGrid.getStore().getCount();
                                for (var j = 0; j < rowCon; j++) {
                                    var scoreValue = me.timiriskustItmeGrid.getStore().getAt(j).get('SCORES');
                                    var sel = me.timiriskustItmeGrid.getStore().getAt(j).get('SEL');
                                    if (sel) {
                                        scores = scores + scoreValue;
                                        contentStr = contentStr + '"timiriskust_item' + j + '":"' + scoreValue + '",';
                                    }else{
                                        contentStr = contentStr + '"timiriskust_item' + j + '":"",';
                                    }
                                }
                                contentStr = "{" + contentStr.substr(0, contentStr.length - 1) + "}";
                                contentStr = '{"timiriskust":' + contentStr + '}';
                                if(scores == 0){
                                    Ext.Msg.alert("提示", "请先选择评分项！");
                                    return;
                                }

                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.timiriskust.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me

                                    });
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,cw);
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '帮助',
                            iconCls: 'ico-help',
                            handler: function (btn) {
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'timiriskust'});
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
                    bodyStyle: 'background: white',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    items: [
                        {xtype:'panel',
                        bodyStyle: 'background: white',
                         region:'center',
                            height:360,
                        layout:'border',
                        items:[
                            {
                            xtype: 'panel',
                            region: 'west',
                                bodyStyle: 'background: white',
                            width: 400,
                            margin: '0 0 0 0',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '评分项目',
                                    region:'center',
                                    bodyStyle: 'background: white',
                                    collapsible: true,
                                    margin: '0 5 5 3',
                                    padding: '0 5 5 5',
                                    height: '100%',
                                    layout: 'fit',
                                    items:[
                                        me.timiriskustItmeGrid
                                    ]}
                            ]
                        },{
                                xtype: 'panel',
                                region: 'center',
                                bodyStyle: 'background: white',
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
                                                bodyStyle: 'background: white',
                                                layout: 'border',
                                                items: [
                                                    {
                                                        xtype: 'fieldset',
                                                        region: 'north',
                                                        width: '50%',
                                                        height:200,
                                                        margin: '1 1 1 1',
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
                                                        padding: '3',
                                                        layout: 'fit',
                                                        items: [
                                                            me.timiriskusteGrid

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
        var scoreCode = "9a9a62eab18811e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
//        var toppanel = Ext.getCmp(me.mod + 'gcstoppanel');
//        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "9a9a62eab18811e3aa8800271396a820";
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
                scoreItemStr = scoreItemStr + '{' + scoreItem.SCORE.substring(1,scoreItem.SCORE.length - 1) + ',"scoretime":"' + scoreItem.SCORES_TIME + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.SCORE.substring(1,scoreItem.SCORE.indexOf(":") + 1) + scoreItem.SCORE.substring(scoreItem.SCORE.indexOf(":") + 2,scoreItem.SCORE.length - 2) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0,scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0,chartItemStr.length - 1) + ']';

            var chartdata = Ext.JSON.decode(chartItemStr);

            me.chartstoreT.loadData(chartdata);

            // return;
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0,scoreItemStr.length - 1) + ']}';
            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);
            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name:'ITEM',mapping:'scoretime'},
                    {name:'SCORE',mapping:'scores'}

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
            me.timiriskusteGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.timiriskusteGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});