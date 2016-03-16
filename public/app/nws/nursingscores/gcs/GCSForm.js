/**
 * GCS评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.gcs.GCSForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gcsform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.gcs.GCSGrid',
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
    itemVerification: function (gcsitem) {
        var me = this;
        if (gcsitem.gcs.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应!");
            me.itemscore = "";
            return false;
        }
        if (gcsitem.gcs.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应!");
            me.itemscore = "";
            return false;
        }
        if (gcsitem.gcs.Motor == "") {
            Ext.Msg.alert("提示", "请选择运动反应!");
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
        me.GCSGrid = new com.dfsoft.icu.nws.nursingscores.gcs.GCSGrid();
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
            title: 'GCS',
            closable: true,
            tooltip: '昏迷指数',
            id: me.mod + 'gcsform',
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
                                var toppanel = Ext.getCmp(me.mod + 'gcstoppanel');
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                // 获取所有评分项
                                me.findItem(toppanel);
                                //拼装项目明细字串
                                me.itemscore = '{"gcs":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}}';
                                //转换为对象
                                var gcsitem = Ext.JSON.decode(me.itemscore);
                                //各种验证
                                veri = me.itemVerification(gcsitem);
                                if (!veri) {
                                    return;
                                }
                                for(var be in gcsitem.gcs){
                                    var itemtype = "";
                                    var itemscore = 0;
                                    itemtype = be;
                                    itemscore = eval("gcsitem.gcs."+be);
                                    if(itemtype == "Eyes" ||itemtype == "Language" || itemtype == "Motor"  ){
                                        scores = scores + Number(itemscore);
                                    }
                                    if(itemtype == "Eyes"){
                                        if(itemscore == '0') {
                                            rcItem = rcItem + 'EC';
                                        }else{
                                            rcItem = rcItem + 'E' + itemscore;
                                        }
                                    }
                                    if(itemtype == "Language"){
                                        if(itemscore == '0'){
                                            rcItem = rcItem + 'VT';
                                        }else{
                                            rcItem = rcItem + 'V' + itemscore;
                                        }

                                    }
                                    if(itemtype == "Motor"){
                                        rcItem = rcItem + 'M' + itemscore;
                                    }
                                }
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.gcs.CountWindow',
                                    {
                                        scores: scores,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow',{itempath:'gcs'});
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
                    id:me.mod + 'gcstoppanel',
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
                                                            width: 223,
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
                                                            width: 223,
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
                                                            margin: '5 1 2 1',
                                                            padding: '0 3 0 3',
                                                            width: 223,
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
                                                        me.GCSGrid

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
        var scoreCode = "b7dcf05cb18711e3aa8800271396a820";
        if(this.patientInfo != null){
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'gcstoppanel');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "b7dcf05cb18711e3aa8800271396a820";
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
            me.GCSGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.GCSGrid.getStore().loadData("");
        }
        me.elm.hide();
    }
});