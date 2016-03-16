/**
 * EuroScore评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.euroscoreform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreItemGrid',
        'com.dfsoft.icu.nws.nursingscores.euroscore.EuroStoreGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun'],
    eurolvefscore: -1,
    operType:'edit',
    itemscore: "",
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
        if(itemobj.down("gridpanel")&&itemobj.down("gridpanel").down("toolbar")){
            var tage =  itemobj.down("gridpanel").down("toolbar").down("numberfield");
            me.itemscore = me.itemscore + '"' + tage.name + '":"' + tage.getValue() + '",';
        }
    },
    euroLvefSel: function (lvefSel) {
        //判断选择，评分赋值。左室射血分数L.V.E.F    选择 1  分值 3 ，选择 2 分值  1 选择 3 分值 0
        // 不选择分值   0.
        var me = this;
        var record = me.euroscoreGrid.getStore().getAt(3);
      //  console.log(lvefSel.selectedIndex);

        record.set('SEL', true);
        record.commit();
        if (lvefSel.selectedIndex == 0) {
            me.eurolvefscore = 9;
            record.set('SEL', false);
            record.commit();
        }else if (lvefSel.selectedIndex == 1) {
            me.eurolvefscore = 3;
            document.getElementById(me.mod + "eurolvefsel")[1].selected = true;
        } else if (lvefSel.selectedIndex == 2) {
            me.eurolvefscore = 1;
            document.getElementById(me.mod + "eurolvefsel")[2].selected = true;
        } else if (lvefSel.selectedIndex == 3) {
            me.eurolvefscore = 0;
            document.getElementById(me.mod + "eurolvefsel")[3].selected = true;
        }
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.euroscoreGrid = new com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreItemGrid({mod:me.mod});
        me.eurostoregrid = new com.dfsoft.icu.nws.nursingscores.euroscore.EuroStoreGrid();
        me.euroscoreGrid.addListener('itemclick', itemclick);
        function itemclick(grid, record, item, index, e, eOpts) {
            if (index != 3) {
                if (record.get('SEL')) {
                    record.set('SEL', false);
                    record.commit();
                } else {
                    record.set('SEL', true);
                    record.commit();
                }
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
            title: 'EuroSCORE',
            closable: true,
            tooltip: '欧洲心脏手术风险预测',
            id: me.mod + 'euroscoreform',
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
                                var scores = 0;//得分
                                var ageScore = 0;
                                var contentStr = "";
                                var eusoItem = "";
                                var toppanel = Ext.getCmp(me.mod + 'euroscoretoppanel');
                                if(me.patientInfo == null){
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }
                                //获取年龄
                                me.findItem(toppanel);
                                var rowCon = me.euroscoreGrid.getStore().getCount();
                                for (var j = 0; j < rowCon; j++) {
                                    var scoreValue = me.euroscoreGrid.getStore().getAt(j).get('SCORES');
                                    var sel = me.euroscoreGrid.getStore().getAt(j).get('SEL');
                                    if (j != 3) {
                                        if (sel) {
                                            scores = scores + scoreValue;
                                            contentStr = contentStr + '"euro_item' + j + '":"' + scoreValue + '",';
                                        } else {
                                            contentStr = contentStr + '"euro_item' + j + '":"",';
                                        }
                                    }else{
                                        contentStr = contentStr + '"euro_item' + j + '":"' + me.eurolvefscore + '",';
                                    }
                                }
                               // alert(scores);
                                contentStr = me.itemscore + contentStr;
                                contentStr = '{"euro":{' + contentStr.substr(0, contentStr.length - 1) + '}}';
                                eusoItem = Ext.JSON.decode(contentStr);
                                if (eusoItem.euro.age == "null") {
                                    var tage = btn.up('panel').down("gridpanel").down("toolbar").down("numberfield");
                                    tage.setActiveError("请输入年龄!");
                                    Ext.Msg.alert("提示", "请输入患者年龄!");
                                    return;
                                }
                                ageScore = eusoItem.euro.age;
                                if (ageScore < 60){
                                    ageScore = 0;
                                }else if(ageScore >= 60 && ageScore < 65){
                                    ageScore = 1;
                                }else if(ageScore >= 65 && ageScore < 70){
                                    ageScore = 2;
                                }else if(ageScore >= 70 && ageScore < 75){
                                    ageScore = 3;
                                }else if(ageScore >= 75 && ageScore < 80){
                                    ageScore = 4;
                                }else if(ageScore >= 80 && ageScore < 85){
                                    ageScore = 5;
                                }else if(ageScore >= 85 && ageScore < 90){
                                    ageScore = 6;
                                }else if(ageScore >= 90 && ageScore < 95){
                                    ageScore = 7;
                                }else if(ageScore >= 95 && ageScore < 100){
                                    ageScore = 8;
                                }else if(ageScore >= 100){
                                    ageScore = 9;
                                }
                                if(me.eurolvefscore == 9){

                                    scores = scores + ageScore;
                                }else{
                                    if(me.eurolvefscore == -1){
                                        scores = scores + ageScore;
                                    }else{
                                        scores = scores + ageScore + me.eurolvefscore;
                                    }

                                }
                                if(scores == -1){
                                    Ext.Msg.alert("提示", "评分项目请至少选择一项！");
                                    return;
                                }
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.euroscore.CountWindow',
                                    {
                                        scores: scores,
                                        contentStr: contentStr,
                                        patientInfo: me.patientInfo,
                                        parent: me
                                    });
                                var pmod = btn.ownerCt.ownerCt.mod;
                                me.ppubfun.popWindow(pmod,me,cw);
                                cw.on('close', function(){
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'euroscore'});
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
                    id: me.mod + 'euroscoretoppanel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'border',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '评分项目',
                            region: 'west',
                            width: 400,
                            collapsible: true,
                            autoScroll:false,
                            margin: '3 3 3 3',
                            padding: '0 5 5 5',
                            layout: 'fit',
                            items: [me.euroscoreGrid]
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
                                    margin: '3 3 3 3',
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
                                                        me.eurostoregrid
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
        var scoreCode = "64245769b18711e3aa8800271396a820";
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
        var scoreCode = "64245769b18711e3aa8800271396a820";
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
   /*         var scoreItem = Ext.JSON.decode(data[0].CONTENT);
            var rowCon = me.euroscoreGrid.getStore().getCount();
            var sAge = scoreItem.euro.age;
            var toppanel = Ext.getCmp(me.mod + 'euroscoretoppanel');
            var tage = toppanel.down("gridpanel").down("toolbar").down("numberfield");
            tage.setValue(sAge)

            for (var j = 0; j < rowCon; j++) {

                var scorevalue = eval("scoreItem.euro.euro_item" + j);
                var recordtt = me.euroscoreGrid.getStore().getAt(j);
            if (j != 3){
                if (scorevalue != '') {
                    recordtt.set('SEL', true);
                }
              }else{// 处理左室射血分数L.V.E.F

                if (scorevalue != '' && scorevalue != 9 && scorevalue != '-1') {
                    recordtt.set('SEL', true);
                }
                if(scorevalue == 9){
                    document.getElementById("eurolvefsel")[0].selected = true;
                    me.eurolvefscore = 0;
                }else if (scorevalue == 0) {
                    document.getElementById("eurolvefsel")[3].selected = true;
                    me.eurolvefscore = 0;
                } else if (scorevalue == 1) {
                    document.getElementById("eurolvefsel")[2].selected = true;
                    me.eurolvefscore = 2;
                } else if (scorevalue == 3) {
                    document.getElementById("eurolvefsel")[1].selected = true;
                    me.eurolvefscore = 3;
                }
            }
                   recordtt.commit();
            }
            for (var k = 0; k < rowCon; k++) {

                var scorevalue = eval("scoreItem.euro.euro_item" + k);
                if (k == 3){// 处理左室射血分数L.V.E.F

                    if(scorevalue == 9){
                        document.getElementById("eurolvefsel")[0].selected = true;
                        me.eurolvefscore = 0;
                    }else if (scorevalue == 0) {
                        document.getElementById("eurolvefsel")[3].selected = true;
                        me.eurolvefscore = 0;
                    } else if (scorevalue == 1) {
                        document.getElementById("eurolvefsel")[2].selected = true;
                        me.eurolvefscore = 2;
                    } else if (scorevalue == 3) {
                        document.getElementById("eurolvefsel")[1].selected = true;
                        me.eurolvefscore = 3;
                    }
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
            me.eurostoregrid.reconfigure(tablestore);
        } else {
            me.operType = 'add';
            //取消选择项
            me.chartstoreT.loadData("");
            me.eurostoregrid.getStore().loadData("");
            me.ppubfun.gridCancelSel(me.euroscoreGrid);
            var toppanel = Ext.getCmp(me.mod + 'euroscoretoppanel');
            var tage = toppanel.down("gridpanel").down("toolbar").down("numberfield");
            tage.setValue('')
        }
        me.elm.hide();
    }
});