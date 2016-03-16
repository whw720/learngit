/**
 * Tiss28评分页面  Twenty-eight
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tiss.TissForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tissform',
    requires: ['com.dfsoft.icu.nws.nursingscores.tiss.TissGrid',
        'com.dfsoft.icu.nws.nursingscores.ScorePubFun',
        'Ext.chart.Chart'],
    operType: 'edit',

    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.ppubfun = new com.dfsoft.icu.nws.nursingscores.ScorePubFun();
        me.TissGrid = new com.dfsoft.icu.nws.nursingscores.tiss.TissGrid();

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
        Ext.apply(this, {
            title: 'TISS',
            border: false,
            maskDiabled: true,
            closable: true,
            tooltip: '治疗干预评分项目',
            id: me.mod + 'tiss_form',
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
                            text: me.ppubfun.scoreTime()  },
                        '->',
                        {
                            xtype: 'button',
                            tooltip: '计算',
                            iconCls: 'ico-count',
                            handler: function (btn) {
                                var scores = 0;
                                var contentStr = '';
                                var myForm = Ext.getCmp(btn.ownerCt.ownerCt.mod + 'levelform');
                                if (me.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请先选择患者，再进行评分！");
                                    return;
                                }

                                Ext.each(myForm.items.items, function (item) {
                                    Ext.each(item.items.items, function (item) {
                                        //console.log(item);
                                        if(item.xtype == 'checkboxfield'){
                                            if (item.getValue()) {
                                                scores = scores + Number(item.inputValue);
                                            }

                                            contentStr = contentStr + '"' + item.name + '":"' + item.getValue() + '",';

                                        }

                                    })
                                });
                                contentStr = "{" + contentStr.substr(0, contentStr.length - 1) + "}";
                                contentStr = '{"TISS":' + contentStr + '}';
                                if (scores == 0) {
                                    Ext.Msg.alert("提示", "请先选择评分项！");
                                    return;

                                }
                                var cw = Ext.create('com.dfsoft.icu.nws.nursingscores.tiss.CountWindow', {
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
                                var hw = Ext.create('com.dfsoft.icu.nws.nursingscores.HelpWindow', {itempath: 'tiss'});
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
                    border: false,
                    id: me.mod + 'levelform',
                    // name:'levelform',
                    autoScroll: true,
                    style: {
                        borderTop: '1px solid silver'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '4分项目',
                            name: '4分项目',
                            collapsible: true,
                            margin: '0 5 5 5',
                            layout: 'column',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT41',
                                    boxLabel: '1. 心搏骤停或电除颤后48h内',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT42',
                                    boxLabel: '2. 控制呼吸，用或不要PEEP',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT43',
                                    boxLabel: '3. 控制呼吸，间断或持续用肌松药',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT44',
                                    boxLabel: '4. 持续动脉内输液',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT45',
                                    boxLabel: '5.  放置动脉漂浮导管',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT46',
                                    boxLabel: '6.  心房和（或）心室起搏',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT47',
                                    boxLabel: '7. 食道静脉出血，三腔管压迫止血',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT48',
                                    boxLabel: '8.  病情不稳定者行血液透析',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT49',
                                    boxLabel: '9.  腹膜透析',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT410',
                                    boxLabel: '10. 人工低温',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT411',
                                    boxLabel: '11.  加压输液',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT412',
                                    boxLabel: '12.  抗休克裤（MAST）',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                                ,
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT413',
                                    boxLabel: '13. 检测颅内压',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT414',
                                    boxLabel: '14.  输血小板',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT415',
                                    boxLabel: '15.  主动脉球囊反博术（IABP）',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT416',
                                    boxLabel: '16. 急诊手术（24h内）',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT417',
                                    boxLabel: '17.  急性消化道出血灌洗',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT418',
                                    boxLabel: '18.  急诊行内镜或纤维支气管镜检查',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'FOURPOINT419',
                                    boxLabel: '19. 应用血管活性药物（大于1种）',
                                    inputValue: '4',
                                    checked: false,
                                    columnWidth: 0.5}
                            ]


                        },
                        {
                            xtype: 'fieldset',
                            title: '3分项目',
                            name: '3分项目',
                            collapsible: true,
                            margin: '0 5 5 5',
                            layout: 'column',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT31',
                                    boxLabel: '1. 静脉营养（包括肾心肝衰营养液）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT32',
                                    boxLabel: '2. 备用起搏器',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT33',
                                    boxLabel: '3. 胸腔引流',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT34',
                                    boxLabel: '4. 应用血管活性药物（大于1种）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT35',
                                    boxLabel: '5. 应用CPAP治疗',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT36',
                                    boxLabel: '6. 经中心静脉输高营养浓度钾',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},

                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT39',
                                    boxLabel: '7. 无人工气道者行气管内吸引',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT310',
                                    boxLabel: '8. 频繁或急查动脉血气，出凝血指标（>4次/班）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},

                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT312',
                                    boxLabel: '9. 频繁成分输血（>5L/24h）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT313',
                                    boxLabel: '10. 静脉一种血管活性药物',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT314',
                                    boxLabel: '11. 持续静脉滴注抗心律失常药',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT315',
                                    boxLabel: '12. 电转复治疗心律失常',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT316',
                                    boxLabel: '13. 应用降温毯',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT318',
                                    boxLabel: '14. 48h内快速洋地黄化',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT319',
                                    boxLabel: '15. 测定心排出量',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT320',
                                    boxLabel: '16. 快速利尿治疗体液超负荷或脑水肿',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT321',
                                    boxLabel: '17. 积极纠正代谢性碱中毒',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT322',
                                    boxLabel: '18. 积极纠正代谢性酸中毒',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT323',
                                    boxLabel: '19. 紧急行胸穿，腹膜后或心包穿刺',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT324',
                                    boxLabel: '20. 积极抗凝治疗（最初48h）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT325',
                                    boxLabel: '21. 因容量超负荷行静脉放血',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT326',
                                    boxLabel: '22. 静脉应用2种以上抗生素',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT327',
                                    boxLabel: '23. 药物治疗惊厥或代谢性脑病（发作24h内）',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'THREEPOINT328',
                                    boxLabel: '24. 复杂性骨牵引',
                                    inputValue: '3',
                                    checked: false,
                                    columnWidth: 0.5}
                            ]},
                        {
                            xtype: 'fieldset',
                            title: '2分项目',
                            name: '2分项目',
                            collapsible: true,
                            margin: '0 5 5 5',
                            layout: 'column',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT21',
                                    boxLabel: '1. 监测CVP',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT22',
                                    boxLabel: '2. 同时开放2条静脉输液',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT23',
                                    boxLabel: '3. 病情稳定者行血液透析',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT24',
                                    boxLabel: '4. 48h内的气管切开',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT25',
                                    boxLabel: '5. 气管内插管或气管切开者接T形管或面罩自主呼吸',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT26',
                                    boxLabel: '6. 鼻饲',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT27',
                                    boxLabel: '7. 因体液丢失过多行补液治疗',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT28',
                                    boxLabel: '8. 静脉化疗',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT29',
                                    boxLabel: '9. 每小时记录神经生命体征',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT210',
                                    boxLabel: '10. 频繁更换敷料',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'TWOPOINT211',
                                    boxLabel: '11. 静滴垂体后叶素',
                                    inputValue: '2',
                                    checked: false,
                                    columnWidth: 0.5}
                            ]},
                        {
                            xtype: 'fieldset',
                            title: '1分项目',
                            name: '1分项目',
                            collapsible: true,
                            margin: '0 5 5 5',
                            layout: 'column',
                            columns: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT11',
                                    boxLabel: '1. 监测ECG',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT12',
                                    boxLabel: '2. 每小时记录生命体征',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT13',
                                    boxLabel: '3. 开放1条静脉输液',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT14',
                                    boxLabel: '4. 慢性抗凝治疗',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT15',
                                    boxLabel: '5. 常规记录24h出入量',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT16',
                                    boxLabel: '6. 急查血常规',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT17',
                                    boxLabel: '7. 对按计划间歇静脉用药',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT18',
                                    boxLabel: '8. 常规更换敷料',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT19',
                                    boxLabel: '9. 常规骨牵引',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT110',
                                    boxLabel: '10. 气管切开护理',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT111',
                                    boxLabel: '11. 褥疮',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT112',
                                    boxLabel: '12. 留置导尿管',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT113',
                                    boxLabel: '13. 吸氧治疗',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT114',
                                    boxLabel: '14. 静脉应用抗生素（小于2种）',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT115',
                                    boxLabel: '15. 胸部物理治疗',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT116',
                                    boxLabel: '16. 伤口、瘘管或肠瘘需加强冲洗包扎或清创',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT117',
                                    boxLabel: '17. 胃肠减压',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5},
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ONEPOINT118',
                                    boxLabel: '18. 外周静脉营养或脂肪乳剂输入',
                                    inputValue: '1',
                                    checked: false,
                                    columnWidth: 0.5}
                            ]},
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
                                                me.TissGrid
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
        var scoreCode = "4bc78370228711e3b33cadce3eaap45a";
        if (this.patientInfo != null) {
            this.loadPageData(this.patientInfo.PATIENT_ID, scoreCode);
        }
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        var toppanel = Ext.getCmp(me.mod + 'levelform');
        me.elm.show();
        toppanel.getForm().reset();
        me.patientInfo = patientInfo;
        var scoreCode = "4bc78370228711e3b33cadce3eaap45a";
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
            me.TissGrid.reconfigure(tablestore);
        }else{
            // 清空数据
            me.chartstoreT.loadData("");
            me.TissGrid.getStore().loadData("");
        }
        me.elm.hide();


//没有添加趋势前数据还原
//        if (Ext.isArray(data) && data.length > 0) { //如果不是空则填充页面数据
//            me.operType = 'edit';
//            var scoreItem = Ext.JSON.decode(data[0].CONTENT);
//            var scoreForm = Ext.getCmp(me.mod + 'levelform');
//            Ext.each(scoreForm.items.items, function (item) {
//                Ext.each(item.items.items, function (item) {
//                    eval('item.setValue(scoreItem.TISS.' + item.getName() + ');');
//                })
//            });
//        } else {
//            me.operType = 'add';
//        }
//        me.elm.hide();
    }
});