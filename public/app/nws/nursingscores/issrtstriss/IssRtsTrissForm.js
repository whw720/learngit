/**
 * ISS评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.issrtstrissform',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissGrid',
        'com.dfsoft.icu.nws.nursingscores.issrtstriss.IssIssGrid',
        'com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrsGrid',
        'com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrissGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun'],
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
    },
    itemVerification: function (issitem) {
        var me = this;
        if (issitem.issItem.rtsItem.Rr == "") {
            Ext.Msg.alert("提示", "请选择RTS项目呼吸频率选项！");
            me.itemscore = "";
            return false;
        }
        if (issitem.issItem.rtsItem.Sbp == "") {
            Ext.Msg.alert("提示", "请选择RTS项目收缩压选项！");
            me.itemscore = "";
            return false;
        }

        if (issitem.issItem.trsissItem.age == "") {
            Ext.Msg.alert("提示", "请选择TRISS项目下年龄选项！");
            me.itemscore = "";
            return false;
        }
        if (issitem.issItem.gcs.Eyes == "") {
            Ext.Msg.alert("提示", "请选择睁眼反应");
            me.itemscore = "";
            return false;
        }
        if (issitem.issItem.gcs.Language == "") {
            Ext.Msg.alert("提示", "请选择语言反应");
            me.itemscore = "";
            return false;
        }
        if (issitem.issItem.gcs.Motor == "") {
            Ext.Msg.alert("提示", "请选择运动反应");
            me.itemscore = "";
            return false;
        }
        return true;
    },
    Comparaison: function (a, b) {
        if ((a) < (b)) return -1;
        else if ((b) == (a)) return 0;
        return 1;
    },
    Fmt: function (x) {
        var v = "";
        if (x >= 0) {
            v = '' + (x + 0.05)
        } else {
            v = '' + (x - 0.05)
        }
        return v.substring(0, v.indexOf('.') + 2);
    },
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.issrtstrissformGrid = new com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissGrid();
        me.issIssGrid = new com.dfsoft.icu.nws.nursingscores.issrtstriss.IssIssGrid();
        me.issTrsGrid = new com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrsGrid();
        me.issTrissGrid = new com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrissGrid();
        me.issTrissGrid.getView().getHeaderCt().getHeaderAtIndex(0).setText('项目');
        me.issIssGrid.getView().getHeaderCt().getHeaderAtIndex(0).setText('损伤部位');
        me.issTrsGrid.getView().getHeaderCt().getHeaderAtIndex(0).setText('项目');
        /*
         *     {
         "allScorse": "20.1",
         "rtsCorse": "3.1",
         "issCorse": "17",
         "trsissCorse": "0",
         "Contusion": "34.6 %",
         "pi": "63.7 %",
         "scoretime": "2014-05-04 11:28",
         "no": "2"
         }
         * */
        me.chartdataT = [
            {"allScorse": 0, "rtsCorse": 0, "issCorse": "0", "trsissCorse": "0", "Contusion": "0", "pi": "0", "scoretime": "", "no": "0"}
        ];
        me.chartstoreT = new Ext.data.JsonStore({
            fields: ['scoretime', 'rtsCorse', 'issCorse', 'trsissCorse', 'Contusion', 'pi', 'no'],
            data: me.chartdataT
        });
        me.chartT = new Ext.chart.Chart({
            animate: true,
            insetPadding: 4,
            store: me.chartstoreT,
            style: {
                background: '#fff',
                marginBottom: '0px'
            },
            shadow: true,
            theme: 'Category1',
            legend: {
                position: 'top'
            },

            axes: [
                {
                    type: 'Numeric',
                    title: '得分',
                    minimum: 0,
                    position: 'left',
                    fields: ['issCorse', 'rtsCorse', 'trsissCorse'],//,
                    grid: true
                },
                {
                    type: 'Numeric',
                    minimum: 0,
                    position: 'right',
                    fields: ['Contusion', 'pi'],//,
                    //   minimum: 0,
                    // maxmum:100,
                    grid: true
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['no']
                }
            ],
            series: [
                {
                    type: 'line',
                    title: 'ISS',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>ISS分值:' + storeItem.get('issCorse') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'issCorse',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'RTS',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>RTS分值:' + storeItem.get('rtsCorse') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'rtsCorse',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: 'TRISS',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>TRISS分值:' + storeItem.get('trsissCorse') + '</span>');
                        }
                    },
                    axis: 'left',
                    xField: 'no',
                    yField: 'trsissCorse',
                    markerCfg: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: '顿挫伤',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>顿挫伤死亡率:' + storeItem.get('Contusion') + '%</span>');
                        }
                    },
                    axis: 'right',
                    xField: 'no',
                    yField: 'Contusion',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    title: '贯穿伤',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    tips: {
                        trackMouse: true,
                        width: 158,
                        height: 36,
                        renderer: function (storeItem, item) {
                            this.setTitle('<span style = "font-weight: normal;">时间:' + storeItem.get('scoretime') + ' </br>贯穿伤死亡率:' + storeItem.get('pi') + '%</span>');
                        }
                    },
                    axis: 'right',
                    xField: 'no',
                    yField: 'pi',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                }
            ]
        });

        Ext.apply(this, {
            title: 'ISS-RTS-TRISS',
            closable: true,
            tooltip: '创伤三联评分法',
            id: me.mod + 'issrtstrissform',
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
                        {
                            xtype: 'button',
                            tooltip: '计算',
                            iconCls: 'ico-count',
                            handler: function (btn) {
                                var scores = "";
                                var issCorse = 0;// iss 得分
                                var rtsCorse = 0; // rts得分
                                var trsissCorse = 0;//trsiss得分
                                var contentStr = "";
                                var mr = "";
                                var veri = false;
                                var gcsCorse = 0;//GCS得分
                                var allScorse = 0;
                                me.itemscore = "";
                                var toppanel = Ext.getCmp(me.mod + 'isstoppanel');
                                if (me.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }

                                // 获取所有评分项
                                me.findItem(toppanel);
                                me.itemscore = '"gcs":{' + me.itemscore.substr(0, me.itemscore.length - 1) + '}';
                                //转换为对象
                                var gcsitem = Ext.JSON.decode("{" + me.itemscore + "}");

                                //GCS 得分计算
                                if (gcsitem.gcs.Eyes != "") {
                                    gcsCorse = gcsCorse + Number(gcsitem.gcs.Eyes);
                                }
                                if (gcsitem.gcs.Language != "") {
                                    gcsCorse = gcsCorse + Number(gcsitem.gcs.Language);
                                }
                                if (gcsitem.gcs.Motor != "") {
                                    gcsCorse = gcsCorse + Number(gcsitem.gcs.Motor);
                                }
                                if (gcsCorse <= 3) {
                                    gcsCorse = 0;
                                } else if (gcsCorse >= 4 && gcsCorse <= 5) {
                                    gcsCorse = 1;
                                } else if (gcsCorse >= 6 && gcsCorse <= 8) {
                                    gcsCorse = 2;
                                } else if (gcsCorse >= 9 && gcsCorse <= 12) {
                                    gcsCorse = 3;
                                } else if (gcsCorse >= 13 && gcsCorse <= 15) {
                                    gcsCorse = 4;
                                }//GCS得分计算结束
                                //各种验证

                                // iss 得分计算开始
                                var issItem = "";
                                var organe = new Array(6);
                                issItem = Ext.JSON.encode(me.issIssGrid.getSource());//iss 项目
                                issItem = '"issItem":' + issItem;
                                var issItemObj = Ext.JSON.decode("{" + issItem + "}");
                                organe[0] = issItemObj.issItem.Head;
                                organe[1] = issItemObj.issItem.Facial;
                                organe[2] = issItemObj.issItem.Chestt;
                                organe[3] = issItemObj.issItem.Aap;
                                organe[4] = issItemObj.issItem.Lapf;
                                organe[5] = issItemObj.issItem.Sur;
                                var valeur = organe.sort(me.Comparaison);
                                var organe3 = Math.pow(valeur[3], 2);
                                var organe4 = Math.pow(valeur[4], 2);
                                var organe5 = Math.pow(valeur[5], 2);
                                if (organe5 == 36) {
                                    issCorse = 75
                                }
                                else {
                                    issCorse = organe3 + organe4 + organe5
                                }// iss 得分计算完成 issCorse


                                //rts得分计算开始
                                var rtsItem = "";
                                rtsItem = Ext.JSON.encode(me.issTrsGrid.getSource());//rts 项目
                                rtsItem = '"rtsItem":' + rtsItem;
                                var rtsItemObj = Ext.JSON.decode("{" + rtsItem + "}");
                                var rr = rtsItemObj.rtsItem.Rr;
                                var sbp = rtsItemObj.rtsItem.Sbp;
                                var rtsTemp = 0;
                                var rtsTemp2 = 0;
                                var rtsTemp3 = 0;
                                if (rr != "") {
                                    rtsTemp = rr;
                                    rtsTemp = rtsTemp * 0.2351;//0.2351//0.2889
                                }
                                if (sbp != "") {
                                    rtsTemp2 = sbp;
                                    rtsTemp2 = rtsTemp2 * 0.5923;//0.5923//0.7278
                                }
                                rtsTemp = rtsTemp + rtsTemp2;
                                if (gcsCorse != 0) {//GCS得分
                                    rtsTemp3 = gcsCorse;
                                    rtsTemp3 = rtsTemp3 * 0.7574;//0.7574// 0.93
                                }
                                rtsTemp = rtsTemp + rtsTemp3;
                                rtsCorse = Math.round(1000 * rtsTemp) / 1000; //rts得分计算结束  rtsCorse

                                //trsiss项目 得分计算
                                var trsissItem = "";
                                trsissItem = Ext.JSON.encode(me.issTrissGrid.getSource());//trsiss项目
                                trsissItem = '"trsissItem":' + trsissItem;
                                var ageType = 0;
                                var trsissItemObj = Ext.JSON.decode("{" + trsissItem + "}");
                                if (trsissItemObj.trsissItem.age == "3") {
                                    trsissCorse = 1;
                                } else if (trsissItemObj.trsissItem.age == "1") {
                                    ageType = -1;
                                }

                                me.itemscore = '{"issItem":{' + me.itemscore + ',' + issItem + ',' + rtsItem + ',' + trsissItem + '}}';
                                var issItemAll = Ext.JSON.decode(me.itemscore);
                                //各种验证
                                veri = me.itemVerification(issItemAll);
                                if (!veri) {
                                    return;
                                }

                                //trsissCorse
                                contentStr = me.itemscore;//所有项目明细 json串
                                //钝挫伤计算
                                var Contusion = 0;//钝挫伤
                                Contusion = -0.4499;
                                Contusion = Contusion + rtsCorse * 0.8085;
                                Contusion = Contusion + (-issCorse * 0.0835);
                                Contusion = Contusion + (-trsissCorse * 1.7430);
                                Contusion = 1 / (1 + Math.exp(Contusion));
                                Contusion = me.Fmt(100 * Contusion) + " %";

                                //贯穿伤计算 如果age小于15岁   贯穿伤  = 钝挫伤  如果大于 15 岁  重算 rts 分值。
                                var pi = "";
                                if (ageType == -1) {
                                    pi = Contusion;
                                } else {
//                                    debugger; // 以下公式暂留 ，以应算法改变。
//                                    if (rr != "") {
//                                        rtsTemp = rr;
//                                        rtsTemp = rtsTemp * 0.2889;//0.2351//0.2889
//                                    }
//                                    if (sbp != "") {
//                                        rtsTemp2 = sbp;
//                                        rtsTemp2 = rtsTemp2 * 0.7278;//0.5923//0.7278
//                                    }
//                                    rtsTemp = rtsTemp + rtsTemp2;
//                                    if (gcsCorse != 0) {//GCS得分
//                                        rtsTemp3 = gcsCorse;
//                                        rtsTemp3 = rtsTemp3 * 0.93;//0.7574// 0.93
//                                    }
//                                    rtsTemp = rtsTemp + rtsTemp3;
//                                    rtsCorse = Math.round(1000 * rtsTemp) / 1000; //rts得分重新计算结束  rtsCorse
//// 计算 钝挫伤死亡率
//                                    alert(rtsCorse);
                                    pi = Number(-2.5355);
                                    pi = pi + rtsCorse * 0.9934;
                                    pi = pi + (-issCorse * 0.0651);
                                    pi = pi + (-trsissCorse * 1.1360);
                                    pi = 1 / (1 + Math.exp(pi));
                                    pi = me.Fmt(100 * pi) + " %";
                                }
                                /*
                                 *
                                 *
                                 * rtsCorse RTS得分
                                 * issCorse ISS 得分
                                 * trsissCorse TRSISS 得分
                                 * Contusion 钝挫伤死亡率
                                 * pi  贯穿伤 死亡率
                                 *allScorse 总得分
                                 * */
                                allScorse = rtsCorse + issCorse + trsissCorse;//总得分

                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.issrtstriss.CountWindow',
                                    {
                                        allScorse: allScorse,
                                        rtsCorse: rtsCorse,
                                        issCorse: issCorse,
                                        trsissCorse: trsissCorse,
                                        Contusion: Contusion,
                                        pi: pi,
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'issrtstriss'});
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
                    style: {
                        borderTop: '1px solid silver'
                    },
                    layout: 'fit',
                    id: me.mod + 'isstoppanel',
                    autoScroll: true,
                    items: [
                        {
                            xtype: 'panel',
                            minHeight: 400,
                            region: 'center',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    height: 230,
                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            region: 'west',
                                            width: 650,
                                            layout: 'column',
                                            columns: 2,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'ISS',
                                                    collapsible: true,
                                                    columnWidth: 0.5,
                                                    margin: '0 5 0 5',
                                                    padding: '0 3 3 3',
                                                    height: 230,
                                                    layout: 'fit',
                                                    items: [me.issIssGrid]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'RTS',
                                                    columnWidth: 0.5,
                                                    collapsible: true,
                                                    margin: '0 5 0 5',
                                                    padding: '0 5 0 5',
                                                    height: 230,
                                                    layout: 'border',
                                                    items: [
                                                        {xtype: 'panel',
                                                            region: 'north',
                                                            height: 100,
                                                            layout: 'fit',
                                                            items: [me.issTrsGrid]
                                                        },
                                                        {
                                                            xtype: 'panel',
                                                            region: 'center',
                                                            items: [
                                                                {
                                                                    xtype: 'fieldset',
                                                                    title: 'GCS',
                                                                    collapsible: true,
                                                                    margin: '0 0 2 0',
                                                                    padding: '0 5 0 5',
                                                                    items: [
                                                                        {
                                                                            xtype: 'combo',
                                                                            name: 'Eyes',
                                                                            fieldLabel: '睁眼反应',
                                                                            width: 280,
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
                                                                            width: 280,
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
                                                                            width: 280,
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
                                                                        }

                                                                    ]
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
                                                    title: 'TRISS',
                                                    collapsible: true,
                                                    margin: '0 20 0 5',
                                                    padding: '0 5 2 5',
                                                    layout: 'fit',
                                                    items: [me.issTrissGrid]
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
                                                                me.issrtstrissformGrid

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
        var scoreCode = "ac3b17f0af4811e387589951d960470f";
        if (this.patientInfo != null) {
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo: function (patientInfo) {
        var me = this;
        me.elm.show();
        var toppanel = Ext.getCmp(me.mod + 'isstoppanel');
        toppanel.getForm().reset();

        me.patientInfo = patientInfo;
        var scoreCode = "ac3b17f0af4811e387589951d960470f";
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
            for (var i = 0; i < data.length; i++) {
                var scoreItem = data[i];
                var subTime = me.ppubfun.formatTimeToGrid(scoreItem.SCORES_TIME);
                scoreItemStr = scoreItemStr + '{' + scoreItem.SCORE.substring(1, scoreItem.SCORE.length - 1) + ',"scoretime":"' + subTime + '"},';
                chartItemStr = chartItemStr + '{' + scoreItem.SCORE.substring(1, scoreItem.SCORE.length - 1) + ',"scoretime":"' + scoreItem.SCORES_TIME.substring(0, scoreItem.SCORES_TIME.length - 3) + '","no":"' + ( i + 1 ) + '"},';
            }
            chartItemStr = '[' + chartItemStr.substring(0, chartItemStr.length - 1) + ']';
            var chartdata = Ext.JSON.decode(chartItemStr);
            var charStr = '[{"';
            for (var i=0;i< chartdata.length;i++) {
                var cd = chartdata[i];
                for (var ctd in cd) {
                    if (ctd == "scoretime") {
                        charStr = charStr + ctd + '":"' + eval("cd." + ctd) + '","';
                    } else if (ctd == "Contusion" || ctd == "pi") {
                        var v = eval("cd." + ctd);
                        charStr = charStr + ctd + '":' + v.substring(0, v.length - 1) + ',"';
                    } else {
                        charStr = charStr + ctd + '":' + eval("cd." + ctd) + ',"';
                    }
                }
                charStr = charStr.substring(0, charStr.length - 2) + '},{"'
            }
            charStr = charStr.substring(0, charStr.length - 3) + ']';
            chartdata = Ext.JSON.decode(charStr);
            me.chartstoreT.loadData(chartdata);
            //表格使用json
            scoreItemStr = '{"scoreItemStr":[' + scoreItemStr.substring(0, scoreItemStr.length - 1) + ']}';

            //表格json对象
            var datatable = Ext.JSON.decode(scoreItemStr);

            //表格store
            var tablestore = new Ext.data.Store({
                fields: [
                    {name: 'ITEM', mapping: 'scoretime'},
                    {name: 'ISSSCORES', mapping: 'issCorse'},
                    {name: 'RTSSCORES', mapping: 'rtsCorse'},
                    {name: 'TRISSSCORES', mapping: 'trsissCorse'},
                    {name: 'CONSCORES', mapping: 'Contusion'},
                    {name: 'PISCORES', mapping: 'pi'}
                ],
                proxy: {
                    type: 'memory',
                    data: datatable,
                    reader: {
                        totalProperty: 'totalRecord',
                        type: 'json',
                        root: 'scoreItemStr'
                    }
                },
                autoLoad: true//自动加载
            });
            me.issrtstrissformGrid.reconfigure(tablestore);
        }
        else {
            // 清空数据
            me.chartstoreT.loadData("");
            me.issrtstrissformGrid.getStore().loadData("");
        }
        me.elm.hide();
    }

});