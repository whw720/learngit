/**
 * RASS评分页面
 *
 * @author zag
 * @version 2014-08-27
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.rass.RASSForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.rassform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.rass.RASSGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun'],
    itemscore:"",
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
    itemVerification: function (rassitem) {
        var me = this;
        if (rassitem.rass.status == "") {
            Ext.Msg.alert("提示", "请选择患者状态!");
            me.itemscore = "";
            return false;
        }
        if(!me.down('textarea').isValid()){
            me.itemscore = "";
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
        me.RASSGrid = new com.dfsoft.icu.nws.nursingscores.rass.RASSGrid();
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
            title: 'RASS',
            closable: true,
            tooltip: '镇静指数',
            id: me.mod + 'rassform',
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
                        {
                            xtype: 'button',
                            tooltip: '计算',
                            iconCls: 'ico-count',
                            handler: function (btn) {
                                var scores = 0;
                                var rcItem = "";//分值另外一种表示方法，如：'E3V2M5'
                                var veri = false;
                                //获取最上层panel
                                var toppanel = Ext.getCmp(me.mod + 'rasstoppanel');
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"rass":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var rassitem = Ext.JSON.decode(me.itemscore);
                                //各种验证
                                veri = me.itemVerification(rassitem);
                                if (!veri) {
                                    return;
                                }

                                var rassScore = Number(eval("rassitem.rass.status"));
                                rcItem=rassScore;
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.rass.CountWindow',
                                    {
                                        scores: rassScore,
                                        contentStr: me.itemscore,
                                        patientInfo: me.patientInfo,
                                        parent: me,
                                        rcItem:rcItem
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
                                console.log(me.mod);
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'rass',height:340,width:620});
                                var pmod = btn.ownerCt.ownerCt.mod;
                                // hw.show();
                                me.ppubfun.popWindow(pmod,me,hw);
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'form',
                    id:me.mod + 'rasstoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'west',
                            width: 250,
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
                                            title: 'RASS',
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
                                                            name: 'status',
                                                            fieldLabel: '状态',
                                                            width: 223,
                                                            editable: false,
                                                            labelWidth: 30,
                                                            padding: '0 3 0 3',
                                                            margin: '0 1 5 1',
                                                            value: '',
                                                            valueField: 'value',
                                                            displayField: 'text',
                                                            store: new Ext.data.SimpleStore({
                                                                fields: ['value', 'text'],
                                                                data: [
                                                                    ['1', '1焦虑或躁动或两者都有'],
                                                                    ['2', '2合作，有定向力且安静'],
                                                                    ['3', '3对指令有反应'],
                                                                    ['4', '4对刺激反应敏捷'],
                                                                    ['5', '5对刺激反应迟钝'],
                                                                    ['6', '6对刺激无反应']
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
                            layout: 'fit',
                            items: [
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
                                                    width:200,
                                                    margin: '1 1 1 5',
                                                    padding: '0',
                                                    layout: 'fit',
                                                    items: [
                                                        me.RASSGrid

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
        var scoreCode = "e93438952db211e4bb7c5cff350ba2ff";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'rasstoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "e93438952db211e4bb7c5cff350ba2ff";
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
            me.RASSGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.RASSGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});