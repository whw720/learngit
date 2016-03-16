/**
 * obese评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.obese.ObeseForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.obeseform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.obese.ObeseGrid',
        'com.dfsoft.icu.nws.nursingscores.obese.ObeseStoreGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun'
    ],
    operType: 'add',
    GridSum: function (gridobj) {
        var sum = 0;
        gridobj.store.each(function (record) {
            sum += Number(record.data.SCORES);
        });

        var n = gridobj.getStore().getCount();// 获得总行数
        var p = new Ext.data.Record({
            ITEM: '总计:',
            SCORES: sum
        });

        gridobj.store.insert(n, p);// 插入到最后一行
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.obesegrid = new com.dfsoft.icu.nws.nursingscores.obese.ObeseGrid();
        me.obesestoregrid = new com.dfsoft.icu.nws.nursingscores.obese.ObeseStoreGrid();
        me.obesegrid.addListener('itemclick', itemclick);
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
            width: '100%',
            height: '100%',
            // animate: true,
            // autoScroll:true,
            // autoSize:true,
            //  autoShow:true,
            columnWidth:100,
            componentLayout:200,
            overflowX:'auto',
            insetPadding:3,
            store: me.chartstoreT,
            style: {
                background:'#fff',
                marginBottom: '0px'
            },
            shadow: true,
            theme: 'Category1',
            //   autoSize:true,
            legend: {
                position: 'top'
            },
            axes: [{
                type: 'Numeric',
                title:'得分',
                position: 'left',
                fields: ['scores'],//,
                grid: true
            }, {
                type: 'Category',
                minWidth:500,
                // minorTickSteps:0,
                position: 'bottom',
                fields: ['no'],
                label: {
                    renderer: Ext.util.Format.numberRenderer('5,5')
                }
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

            title: 'OBESE',
            border: false,
            closable: true,
            tooltip: '面罩通气困难',
            id:me.mod + 'obeseform',
            layout: 'fit',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    height: '35',
                    border: "0 0 1 0",
                    margin: "-1 0 0 0",
                    items: [
                        {
                            xtype: 'tbtext',
                            text: me.ppubfun.scoreTime()
                        },
                        '->',

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
                            var rowCon = me.obesegrid.getStore().getCount();
                                for (var j = 0; j < rowCon; j++) {
                                    var scoreValue = me.obesegrid.getStore().getAt(j).get('SCORES');
                                    var sel = me.obesegrid.getStore().getAt(j).get('SEL');
                                    if (sel) {
                                        scores = scores + scoreValue;
                                        contentStr = contentStr + '"obese_item' + j + '":"' + scoreValue + '",';
                                    }else{
                                    contentStr = contentStr + '"obese_item' + j + '":"",';
                                    }
                                }
                                contentStr = "{" + contentStr.substr(0, contentStr.length - 1) + "}";
                                contentStr = '{"obese":' + contentStr + '}';
                                if(scores == 0){
                                    Ext.Msg.alert("提示", "请选择项目！");
                                    return;
                                }
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.obese.CountWindow',
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'obese'});
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,hw);
                            }
                        }
                    ]
                }
            ],
            items:[
                {
                    xtype: 'form',
                    border: false,
                    region: 'center',
                    layout: 'border',
                    bodyStyle: 'background: white',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '评分项目',
                            region: 'west',
                            width: '45%',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '0 5 5 5',
                            layout: 'fit',
                            items: [me.obesegrid]
                        },
                        {
                            xtype: 'panel',
                            region: 'center',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '趋势',
                                    // collapsible: true,
                                    margin: '3 5 3 3',
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
                                                    region: 'center',
                                                     width: '60%',
                                                    style: {
                                                        padding: '0'
                                                    },
                                                    margin: '1 1 1 1',
                                                    padding: '1 1 0 1',
                                                    layout: 'fit',
                                                    items: [
                                                        me.chartT
                                                    ]


                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    region: 'east',
                                                    width: '40%',
                                                    margin: '1 1 1 5',
                                                    padding: '0',
                                                    layout: 'fit',
                                                    items: [
                                                        me.obesestoregrid
                                                    ]

                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }]
        });
        this.callParent(arguments);
        var scoreCode = "63f0a832b18711e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
        me.patientInfo = patientInfo;
        var scoreCode = "63f0a832b18711e3aa8800271396a820";
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
      /*      var scoreItem = Ext.JSON.decode(data[0].CONTENT);
            var rowCon = me.obesegrid.getStore().getCount();
            for (var j = 0; j < rowCon; j++) {

                var scorevalue = eval("scoreItem.obese.obese_item" + j);
                var recordtt = me.obesegrid.getStore().getAt(j);
                if (scorevalue != '') {
                    recordtt.set('SEL', true);
                    recordtt.set('SCORES', Number(scorevalue));
                    recordtt.commit();
                }else{
                    recordtt.set('SEL', false);
                   // recordtt.set('SCORES', Number(scorevalue));
                    recordtt.commit();

                }
            }*/
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
            me.obesestoregrid.reconfigure(tablestore);
        } else {
            me.operType = 'add';
            me.chartstoreT.loadData("");
            me.obesestoregrid.getStore().loadData("");
            //取消选择项
            me.ppubfun.gridCancelSel(me.obesegrid);
        }
        me.elm.hide();
    }
});