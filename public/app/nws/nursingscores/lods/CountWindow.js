/**
 * 功能说明:  评分 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.lods.CountWindow', {
    extend: 'Ext.window.Window',
    requires: [
    ],
    saveData: function(callback) {
        var me = this;
        var currentDate = new Date();
        if(me.parent.careTime){
            currentDate = new Date(me.parent.careTime);
        }
        var patientScore = Ext.JSON.encode(me.scores);
        var CONTENT = me.contentStr;
        var REGISTER_ID = me.patientInfo.REGISTER_ID;     //ICU登记ID
        var PATIENT_ID = me.patientInfo.PATIENT_ID;      //患者ID
        var CATEGORY_CODE = "9a3b1800b18811e3aa8800271396a820";   //评分类型ID（２８种评分 对应数据库 dic_scores_category表 code）
        var SCORE = patientScore;                       // 分值
        var SCORES_TIME = currentDate;    //评分时间
        var RATERS_ID = userInfo.userId;      //评分人（操作员ID)
        var PHM = '{"mr":"' + this.mr + '"}'; //死亡率
        var ICU_DAYS ="";//ICU天数。
       // console.log(me.scores.sumAll);
        var routeItems = "得分:" + me.scores.sumAll + ",死亡率:" + this.mr;
        me.parent.operType = "add";
        if (SCORE != '') {
            Ext.Ajax.request({
                url: me.parent.operType === "add" ? (parent.webRoot + '/nws/nursingscores') : (parent.webRoot + '/nws/updateCores/' + PATIENT_ID  + '/' + CATEGORY_CODE),
                method: me.parent.operType === "add" ? 'POST' : 'PUT',
                params: {
                    CATEGORY_CODE:CATEGORY_CODE,
                    REGISTER_ID: REGISTER_ID,
                    PATIENT_ID: PATIENT_ID,
                    CONTENT:CONTENT,
                    SCORE:SCORE,
                    PHM:PHM,
                    ICU_DAYS:ICU_DAYS,
                    SCORES_TIME:SCORES_TIME,
                    RATERS_ID: RATERS_ID
                },
                success: function(response) {
                    var reqmsg = Ext.decode(response.responseText);
                    var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                    if (reqmsg.success === true) {
                        Ext.getCmp('saveScore').setDisabled(true);
                        me.parent.loadPageData(me.parent.patientInfo.PATIENT_ID, CATEGORY_CODE);
                        // 保存评分项 护理记录
                        if(me.parent.mod.indexOf("care_record") != -1) {
                            me.parent.popw.saveRecordScore(me.scores.sumAll,routeItems,reqmsg.data,2);
                            SCORES_TIME =  me.parent.popw.careTime;
                        }
                        msg.popup('提示：','LODS评分保存成功！');
                        me.close();
                    } else {
                        request.showErr(reqmsg.errors,'保存');
                    }
                }
            });
        } else {
            callback('error');
        }
    },
    initComponent: function () {
        var me = this;
        var myData = [
            ['心血管分值', me.scores.car + '分'],
            ['血液学分值',  me.scores.blo + '分'],
            ['肝功能分值',  me.scores.liv + '分'],
            ['神经学分值',  me.scores.ner + '分'],
            ['肾功能分值',  me.scores.ren + '分'],
            ['呼吸分值',  me.scores.bre + '分'],
            ['<b>合计分值</b>', '<b>' + me.scores.sumAll + '分</b>']
        ];
        var store = Ext.create('Ext.data.ArrayStore',{
            fields: [
                {name: 'ITEM'},
                {name: 'SCORE'}
            ],
            data: myData
        });
        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            stateId: 'lodsItemGrid',
            hideHeaders:true,
            forceFit: true,
            columns: [
                {
                    dataIndex: 'ITEM',
                    sortable: true,
                    align:'left'
                },
                {
                    dataIndex: 'SCORE',
                    width: 40,
                    sortable: true,
                    align:'left'
                }
            ]
        });
        Ext.apply(me, {
            title: '评分结果',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: ['->', {
                        xtype: 'button',
                        tooltip: '保存',
                        id:'saveScore',
                        iconCls: 'save',
                        scope: me,
                        handler: me.saveData
                    }]
                }
            ],
            header: true,
            iconCls: 'ico-count',
            layout: 'fit',
            width: 460,
            height: 304,
            items: [
                {xtype: 'panel',
                    style: {
                        borderTop: '1px solid #3892d3'
                    },
                    layout: 'border',
                    bodyStyle: 'background: white',
                    items: [
                        {xtype: 'panel',
                            region: 'west',
                            width: 200,
                            margin:'5 0 5 5',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    margin: '0',
                                    height: 30,
                                    layout:'fit',
                                    style: {
                                        borderBottom: '0px'
                                    },
                                    Style:'back-color:#F5F5F5;',
                                    padding:'0',
                                    items: [
                                        {
                                            xtype:'textfield',
                                            fieldStyle:'text-align:center;font-size:20px;border:0px;font-weight:bold;background:#F5F5F5;',
                                            readOnly:true,
                                            value:'得分'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    height: 183,
                                    style: {
                                        borderTop: '0px'
                                    },
                                    margin: '0',
                                    padding:'0',
                                    layout:'fit',
                                    items: [
                                        grid
                                    ]
                                }
                            ]
                        },
                        {xtype: 'panel',
                            region: 'center',
                            margin:'5 5 5 0',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    margin: '0',
                                    height: 31,
                                    layout:'fit',
                                    style: {
                                        borderLeft: '0px'
                                    },
                                    Style:'back-color:#F5F5F5;',
                                    padding:'0',
                                    items: [
                                        {
                                            xtype:'textfield',
                                            fieldStyle:'text-align:center;font-size:20px;border:0px;font-weight:bold;background:#F5F5F5;',
                                            readOnly:true,
                                            value:'死亡率'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    height: 182,
                                    style: {
                                        borderTop: '0px',
                                        borderLeft: '0px'
                                    },
                                    margin: '0',
                                    padding:'0',
                                    layout:'fit',
                                    items: [
                                        {
                                            xtype:'textfield',
                                            id:'mortalityRate',
                                            height:50,
                                            fieldStyle:'text-align:center;font-size:40px;border:0px;color:#009900;font-weight:bold;',
                                            readOnly:true,
                                            value:this.mr
                                        }
                                    ]
                                }
                            ]
                        }


                    ]
                }
            ]
        });
        me.callParent();
    }
});