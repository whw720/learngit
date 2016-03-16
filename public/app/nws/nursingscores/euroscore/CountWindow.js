/**
 * 功能说明:  评分 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.euroscore.CountWindow', {
    extend: 'Ext.window.Window',
    requires: [
    ],
    saveData: function(callback) {
        var me = this;
        var patientScore = '{"scores":"' + me.scores + '"}';
        var CONTENT = me.contentStr;
        var REGISTER_ID = me.patientInfo.REGISTER_ID;     //ICU登记ID
        var PATIENT_ID = me.patientInfo.PATIENT_ID;      //患者ID
        var CATEGORY_CODE = "64245769b18711e3aa8800271396a820";   //评分类型ID（２８种评分 对应数据库 dic_scores_category表 code）
        var SCORE = patientScore;                       // 分值
        var SCORES_TIME = new Date();    //评分时间
        if(me.parent.careTime){
            SCORES_TIME=me.parent.careTime;
        }
        var RATERS_ID = userInfo.userId;      //评分人（操作员ID)
        var PHM = "";          //死亡率
        var ICU_DAYS ="";//ICU天数。

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
                        me.parent.operType = 'edit';
                        me.parent.loadPageData(me.parent.patientInfo.PATIENT_ID, CATEGORY_CODE);
                        // 保存评分项 护理记录
                        if(me.parent.mod.indexOf("care_record") != -1) {
                            me.parent.popw.saveRecordScore(me.scores,"",reqmsg.data,1);
                            SCORES_TIME =  me.parent.popw.careTime;
                        }
                        msg.popup('提示：','EuroSCORE评分保存成功！');
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
                            region: 'center',
                            width: 150,
                            margin:'5 5 5 5',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    margin: '0',
                                    height: 30,
                                    layout:'fit',
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
                                    height: 103,
                                    style: {
                                        borderTop: '0px'
                                    },
                                    margin: '0',
                                    padding:'0',
                                    layout:'fit',
                                    items: [
                                        {

                                            xtype:'textfield',
                                            id:'point',
                                            height:50,
                                            fieldStyle:'text-align:center;font-size:50px;border:0px;color:#009900;font-weight:bold;',
                                            readOnly:true,
                                            value:this.scores + '分'
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