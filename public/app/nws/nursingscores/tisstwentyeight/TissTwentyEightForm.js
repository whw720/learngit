/**
 * Tiss28评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tisstwentyeightform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwoGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.BasicTreatmentGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.VentilatorySupportGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.CardiovascularSupportGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.KidneySupportGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.NervousSystemSupportGrid',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.SpecialInterventionsGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'
    ],
    operType: 'edit',
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.TissTwoGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwoGrid();
        me.chartdataT = [{"scores":0,"scoretime":"0","no":"0"}];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime','scores','no'],
            data:me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            width: '100%',
            height: '100%',
            //columnWidth: 0.5,
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
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.basictreatmentgrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.BasicTreatmentGrid();
        me.ventilatorySupportGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.VentilatorySupportGrid();
        me.cardiovascularSupportGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.CardiovascularSupportGrid();
        me.kidneySupportGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.KidneySupportGrid();
        me.nervousSystemSupportGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.NervousSystemSupportGrid();
        me.specialInterventionsGrid = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.SpecialInterventionsGrid();

        me.basictreatmentgrid.addListener('itemclick', basicitemclick);
        me.ventilatorySupportGrid.addListener('itemclick', carditemclick);
        me.cardiovascularSupportGrid.addListener('itemclick', carditemclickVas);
        me.kidneySupportGrid.addListener('itemclick', itemclick);
        me.nervousSystemSupportGrid.addListener('itemclick', itemclickNer);
        me.specialInterventionsGrid.addListener('itemclick', carditemclickSpe);

        function itemclick(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            var rc = grid.getStore().getCount();
            var sc = 0;

            if (index != 3) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(3);
                countRow.set('SCORE', sc);
                countRow.commit();
            }


        };
        function itemclickNer(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            var rc = grid.getStore().getCount();
            var sc = 0;
            if (index != 1) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(1);
                countRow.set('SCORE', sc);
                countRow.commit();
            }


        };
        function basicitemclick(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            var rc = grid.getStore().getCount();
            var sc = 0;

            if (index != 7) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    if (index == 2) { // 选择第三项，第四项取消
                        var re = grid.getStore().getAt(3);
                        re.set("SEL", false);
                        re.commit();
                    } else if (index == 3) {//选择第四项，第三项取消。
                        var re = grid.getStore().getAt(2);
                        re.set("SEL", false);
                        re.commit();
                    }
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(7);
                countRow.set('SCORE', sc);
                countRow.commit();
            }

        };
        function carditemclick(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            var rc = grid.getStore().getCount();
            var sc = 0;
            if (index != 4) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    if (index == 0) {
                        var re = grid.getStore().getAt(1);
                        re.set("SEL", false);
                        re.commit();
                    } else if (index == 1) {
                        var re = grid.getStore().getAt(0);
                        re.set("SEL", false);
                        re.commit();
                    }
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(4);
                countRow.set('SCORE', sc);
                countRow.commit();
            }
        };
        function carditemclickSpe(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            debugger;
            //alert(2344);
            var rc = grid.getStore().getCount();
            var sc = 0;
            if (index != 3) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    if (index == 0) {
                        var re = grid.getStore().getAt(1);
                        re.set("SEL", false);
                        re.set('SCORE', '');
                        re.commit();
                    } else if (index == 1) {
                        var re = grid.getStore().getAt(0);
                        re.set("SEL", false);
                        re.set('SCORE', '');
                        re.commit();
                    }
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(3);
                countRow.set('SCORE', sc);
                countRow.commit();
            }
        };
        function carditemclickVas(grid, record, item, index, e, eOpts) {
            // 计算得分合计
            var rc = grid.getStore().getCount();
            var sc = 0;
            if (index != 7) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.set('SCORE', '');
                    record.commit();
                } else {
                    if (index == 0) {
                        var re = grid.getStore().getAt(1);
                        re.set("SEL", false);
                        re.commit();
                    } else if (index == 1) {
                        var re = grid.getStore().getAt(0);
                        re.set("SEL", false);
                        re.commit();
                    }
                    record.set('SEL', true);
                    record.set('SCORE', record.get('SCORES'));
                    record.commit();
                }
                for (var h = 0; h < rc - 1; h++) {
                    var re = grid.getStore().getAt(h);
                    if (re.get('SCORE') != '') {
                        sc = sc + Number(re.get('SCORE'));
                    }
                }
                var countRow = grid.getStore().getAt(7);
                countRow.set('SCORE', sc);
                countRow.commit();
            }
        };


        Ext.apply(this, {
            title: 'TISS 28',
            border: false,
            closable: true,
            tooltip: '简易治疗干预评分系统',
            id: me.mod + 'tisstwentyeight_from',
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
                                var contentStr = '';
                                if (me.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                for (var i = 0; i < 6; i++) {
                                    if (i == 0) {
                                        var rowCon = me.basictreatmentgrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.basictreatmentgrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"basictreatment_score' + j + '":"' + scoreValue + '",';

                                        }
                                    }
                                    if (i == 1) {
                                        var rowCon = me.ventilatorySupportGrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.ventilatorySupportGrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"ventilatorySupport_score' + j + '":"' + scoreValue + '",';
                                        }

                                    }
                                    if (i == 2) {
                                        var rowCon = me.cardiovascularSupportGrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.cardiovascularSupportGrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"cardiovascularSupport_score' + j + '":"' + scoreValue + '",';
                                        }
                                    }
                                    if (i == 3) {
                                        var rowCon = me.kidneySupportGrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.kidneySupportGrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"kidneySupport_score' + j + '":"' + scoreValue + '",';
                                        }
                                    }
                                    if (i == 4) {
                                        var rowCon = me.nervousSystemSupportGrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.nervousSystemSupportGrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"nervousSystemSupport_score' + j + '":"' + scoreValue + '",';
                                        }

                                    }
                                    if (i == 5) {
                                        var rowCon = me.specialInterventionsGrid.getStore().getCount();
                                        for (var j = 0; j < rowCon - 1; j++) {
                                            var scoreValue = me.specialInterventionsGrid.getStore().getAt(j).get('SCORE');
                                            if (scoreValue != "") {
                                                scores = scores + scoreValue;
                                            }
                                            contentStr = contentStr + '"specialInterventions_score' + j + '":"' + scoreValue + '",';
                                        }
                                    }
                                }
                                contentStr = "{" + contentStr.substr(0, contentStr.length - 1) + "}";
                                contentStr = '{"TISS28":' + contentStr + '}';

                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me

                                    });

                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod, me, cw);

                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '帮助',
                            iconCls: 'ico-help',
                            handler: function (btn) {
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'tisstwentyeight'});
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod, me, hw);
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'form',
                    border: false,
                    autoScroll: true,
                    style: {
                        borderTop: '1px solid silver'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '基础治疗',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            height: 270,
                            layout: 'fit',
                            items: [
                                me.basictreatmentgrid
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '通气支持',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            layout: 'fit',
                            height: 190,
                            items: [me.ventilatorySupportGrid]
                        },
                        {
                            xtype: 'fieldset',
                            title: '心血管支持',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            height: 270,
                            layout: 'fit',
                            items: [me.cardiovascularSupportGrid]
                        },
                        {
                            xtype: 'fieldset',
                            title: '肾脏支持',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            height: 165,
                            layout: 'fit',
                            items: [me.kidneySupportGrid ]},
                        {
                            xtype: 'fieldset',
                            title: '神经系统支持',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            height: 115,
                            layout: 'fit',
                            items: [me.nervousSystemSupportGrid]},
                        {
                            xtype: 'fieldset',
                            title: '特殊干预措施',
                            collapsible: true,
                            margin: '3 3 3 3',
                            padding: '3 3 3 3',
                            height: 190,
                            layout: 'fit',
                            items: [me.specialInterventionsGrid]},
                        {
                            xtype: 'fieldset',
                            title: '趋势',
                            // collapsible: true,
                            margin: '0 5 5 3',
                            padding: '0 5 5 5',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'panel',
                                    layout: 'border',
                                    height:200,
                                    bodyStyle: 'background: white',
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            region: 'center',
                                            // width: '70%',
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
                                            width:300,
                                            margin: '1 1 1 5',
                                            padding: '0',
                                            layout: 'fit',
                                            items: [
                                                me.TissTwoGrid
                                            ]

                                        }
                                    ]
                                }
                            ]


                        }
                    ]}
            ]
        });

        this.callParent(arguments);
        var scoreCode = "5ef78370228711e3b33cadce3eaap78c";
        if (this.patientInfo != null) {
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo: function (patientInfo) {

       // proxy.nwsApp.careCenterPanel.loadMask.show();

        var me = this;
        me.elm.show();
        me.patientInfo = patientInfo;
        var scoreCode = "5ef78370228711e3b33cadce3eaap78c";
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
            me.TissTwoGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.TissTwoGrid.getStore().loadData("");
        }
        me.elm.hide();
        //没加趋势前数据还原
//        if (Ext.isArray(data) && data.length > 0) { //如果不是空则填充页面数据
//            me.operType = 'edit';
//            me.cleanSel();
//            var scoreItem = Ext.JSON.decode(data[0].CONTENT);
//            for (var i = 0; i < 6; i++) {
//                if (i == 0) {
//                    var rowCon = me.basictreatmentgrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.basictreatmentgrid.getStore().getAt(7);
//                    for (var j = 0; j < rowCon - 1; j++) {
//                        var scorevalue = eval("scoreItem.TISS28.basictreatment_score" + j);
//                        var recordtt = me.basictreatmentgrid.getStore().getAt(j);
//
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//                }
//                if (i == 1) {
//                    var rowCon = me.ventilatorySupportGrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.ventilatorySupportGrid.getStore().getAt(4);
//
//                    for (var j = 0; j < rowCon - 1; j++) {
//
//                        var scorevalue = eval("scoreItem.TISS28.ventilatorySupport_score" + j);
//                        var recordtt = me.ventilatorySupportGrid.getStore().getAt(j);
//
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//
//                }
//                if (i == 2) {
//                    var rowCon = me.cardiovascularSupportGrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.cardiovascularSupportGrid.getStore().getAt(7);
//
//                    for (var j = 0; j < rowCon - 1; j++) {
//
//                        var scorevalue = eval("scoreItem.TISS28.cardiovascularSupport_score" + j);
//                        var recordtt = me.cardiovascularSupportGrid.getStore().getAt(j);
//
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//
//                }
//
//                if (i == 3) {
//                    var rowCon = me.kidneySupportGrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.kidneySupportGrid.getStore().getAt(3);
//                    for (var j = 0; j < rowCon - 1; j++) {
//                        var scorevalue = eval("scoreItem.TISS28.kidneySupport_score" + j);
//                        var recordtt = me.kidneySupportGrid.getStore().getAt(j);
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//
//                }
//
//                if (i == 4) {
//                    var rowCon = me.nervousSystemSupportGrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.nervousSystemSupportGrid.getStore().getAt(1);
//                    for (var j = 0; j < rowCon - 1; j++) {
//                        var scorevalue = eval("scoreItem.TISS28.nervousSystemSupport_score" + j);
//                        var recordtt = me.nervousSystemSupportGrid.getStore().getAt(j);
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//
//                }
//
//                if (i == 5) {
//                    var rowCon = me.specialInterventionsGrid.getStore().getCount();
//                    // 计算得分合计
//                    var sc = 0;
//                    var countRow = me.specialInterventionsGrid.getStore().getAt(3);
//                    for (var j = 0; j < rowCon - 1; j++) {
//
//                        var scorevalue = eval("scoreItem.TISS28.specialInterventions_score" + j);
//                        var recordtt = me.specialInterventionsGrid.getStore().getAt(j);
//
//                        if (scorevalue != '') {
//                            recordtt.set('SEL', true);
//                            recordtt.set('SCORE', Number(scorevalue));
//                            sc = sc + Number(scorevalue);
//                        }
//                        recordtt.commit();
//                    }
//                    countRow.set('SCORE', sc);
//                    countRow.commit();
//
//                }
//
//            }
//        } else {
//            me.operType = 'add';
//            me.cleanSel();
//        }
//        me.elm.hide();
    },
    cleanSel:function(){
        var me = this;
        for (var i = 0; i < 6; i++) {
            if (i == 0) {
                var rowCon = me.basictreatmentgrid.getStore().getCount();
                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.basictreatmentgrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }
            }
            if (i == 1) {
                var rowCon = me.ventilatorySupportGrid.getStore().getCount();
                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.ventilatorySupportGrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }
            }
            if (i == 2) {
                var rowCon = me.cardiovascularSupportGrid.getStore().getCount();

                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.cardiovascularSupportGrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }

            }
            if (i == 3) {
                var rowCon = me.kidneySupportGrid.getStore().getCount();
                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.kidneySupportGrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }

            }
            if (i == 4) {
                var rowCon = me.nervousSystemSupportGrid.getStore().getCount();
                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.nervousSystemSupportGrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }
            }
            if (i == 5) {
                var rowCon = me.specialInterventionsGrid.getStore().getCount();
                for (var j = 0; j < rowCon; j++) {
                    var recordtt = me.specialInterventionsGrid.getStore().getAt(j);
                    recordtt.set('SEL', false);
                    recordtt.set('SCORE', "");
                    recordtt.commit();
                }
            }
        }
    }
});