/**
 * 功能说明:  评分 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.tiss.CountWindow', {
    extend: 'Ext.window.Window',
    requires: [
    ],

    setLevel: function (value, metaData, record, rowIdx, colIdx, store, view) {

        var strLevel = "";

        if (record.data.SCORE >= 0 && record.data.SCORE < 10) {

            strLevel = 'Ⅰ级';
        } else if (record.data.SCORE >= 10 && record.data.SCORE < 20) {
            strLevel = 'Ⅱ级';
        } else if (record.data.SCORE >= 20 && record.data.SCORE < 30) {
            strLevel = 'Ⅲ级';
        } else if (record.data.SCORE >= 30) {
            strLevel = 'Ⅳ级';
        }

        if (strLevel == record.get('TISSCLASS')) {
            return '<img src="/app/nws/nursingscores/images/sel.png" style="margin-bottom: -1px;margin-right: -5px;" align="right" />';
        } else {

            return '';
        }
        //保存
    },

    saveData: function (callback) {
        var me = this;
        var currentDate = new Date();
        if(me.parent.careTime){
            currentDate = new Date(me.parent.careTime);
        }
        var patientScore = '{"scores":"' + me.scores + '"}';
        var CONTENT = me.contentStr;
        var REGISTER_ID = me.patientInfo.REGISTER_ID;     //ICU登记ID
        var PATIENT_ID = me.patientInfo.PATIENT_ID;      //患者ID
        var CATEGORY_CODE = "4bc78370228711e3b33cadce3eaap45a";   //评分类型ID（２８种评分 对应数据库 dic_scores_category表 code）
        var SCORE = patientScore;                       // 分值
        var SCORES_TIME = currentDate;    //评分时间
        var RATERS_ID = userInfo.userId;      //评分人（操作员ID)
        var PHM = "";          //死亡率
        var ICU_DAYS = "";//ICU天数。
        me.parent.operType = "add";

        if (SCORE != '') {
            Ext.Ajax.request({
                url: me.parent.operType === "add" ? (parent.webRoot + '/nws/nursingscores') : (parent.webRoot + '/nws/updateCores/' + PATIENT_ID + '/' + CATEGORY_CODE),
                method: me.parent.operType === "add" ? 'POST' : 'PUT',
                params: {
                    CATEGORY_CODE: CATEGORY_CODE,
                    REGISTER_ID: REGISTER_ID,
                    PATIENT_ID: PATIENT_ID,
                    CONTENT: CONTENT,
                    SCORE: SCORE,
                    PHM: PHM,
                    ICU_DAYS: ICU_DAYS,
                    SCORES_TIME: SCORES_TIME,
                    RATERS_ID: RATERS_ID
                },
                success: function (response) {
                    var reqmsg = Ext.decode(response.responseText);
                    var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                    if (reqmsg.success === true) {
                        Ext.getCmp('saveScore').setDisabled(true);
                        me.parent.operType = 'edit';
                        me.parent.loadPageData(me.parent.patientInfo.PATIENT_ID, CATEGORY_CODE);
                        // 保存评分项 护理记录
                        if(me.parent.mod.indexOf("care_record") != -1) {
                            me.parent.popw.saveRecordScore(me.scores, "",reqmsg.data,1);
                            SCORES_TIME =  me.parent.popw.careTime;
                        }
                        msg.popup('提示：', 'TISS评分保存成功！');
                        me.close();
                    } else {
                        request.showErr(reqmsg.errors, '保存');
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
            [this.scores, 'Ⅰ级', '0~9分', '0.25'],
            [this.scores, 'Ⅱ级', '10~19分', '0.5'],
            [this.scores, 'Ⅲ级', '20~29分', '0.5' ],
            [this.scores, 'Ⅳ级', '≥30分', '≥1']
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SCORE'},
                {name: 'TISSCLASS'},
                {name: 'TISSScores'},
                {name: 'peoples'}
            ],
            data: myData
        });
        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            stateful: true,
            stateId: 'stateGrid',
            enableHdMenu:false,
            enableColumnHide:false,
            border: true,
            columns: [
                {
                    dataIndex: 'SCORE',
                    text: '',
                    hidden: true

                },
                {
                    dataIndex: 'Level',
                    text: '',
                    width: '10%',
                    sortable: false,
                    align: 'right',
                    renderer: me.setLevel
                },
                {
                    dataIndex: 'TISSCLASS',
                    text: 'TISS分级',
                    width: '25%',
                    sortable: false,
                    align: 'center'
                },
                {
                    dataIndex: 'TISSScores',
                    text: 'TISS分值',
                    width: '25%',
                    sortable: false,
                    align: 'center',
                    renderer: function (v,m){
                        if (v == '≥30分') {
                            m.css = 'font';
                        }
                        return v;
                    }
                },
                {
                    dataIndex: 'peoples',
                    text: '需要护士人数',
                    width: '40%',
                    sortable: false,
                    align: 'center',
                    renderer: function (v, m) {
                        m.css = 'font';
                        return v;
                    }
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
                        id: 'saveScore',
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
            height: 224,
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
                            width: 150,
                            margin: '5 5 5 5',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    margin: '0',
                                    height: 30,
                                    layout: 'fit',
                                    Style: 'back-color:#F5F5F5;',
                                    padding: '0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldStyle: 'text-align:center;font-size:20px;border:0px;font-weight:bold;background:#F5F5F5;',
                                            readOnly: true,
                                            value: '得分'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    height: 103,
                                    style: {
                                        borderTop: '0px'
                                    },
                                    margin: '0',
                                    padding: '0',
                                    layout: 'fit',
                                    items: [
                                        {

                                            xtype: 'textfield',
                                            id: 'point',
                                            height: 50,
                                            fieldStyle: 'text-align:center;font-size:50px;border:0px;color:#009900;font-weight:bold;',
                                            readOnly: true,
                                            value: this.scores + '分'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            region: 'center',
                            bodyStyle: 'background: white',
                            height: 135,
                            margin: '5 5 5 0',
                            items: [grid]
                        }


                    ]
                }
            ]
        });
        me.callParent();
    }
});