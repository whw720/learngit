/**
 * 功能说明:  评分 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.CountWindow', {
    extend: 'Ext.window.Window',
    requires: [
    ],
    /*
     * rtsCorse RTS得分
     * issCorse ISS 得分
     * trsissCorse TRSISS 得分
     * Contusion 钝挫伤死亡率
     * pi  贯穿伤 死亡率
     *allScorse 总得分
     * */
    saveData: function(callback) {
        var me = this;
        var currentDate = new Date();
        var patientScore = '{"allScorse":"' + me.allScorse + '","rtsCorse":"' + me.rtsCorse + '","issCorse":"' + me.issCorse + '","trsissCorse":"' + me.trsissCorse + '","Contusion":"' + me.Contusion + '","pi":"' + me.pi + '"}';
        var CONTENT = me.contentStr;
        var REGISTER_ID = me.patientInfo.REGISTER_ID;     //ICU登记ID
        var PATIENT_ID = me.patientInfo.PATIENT_ID;      //患者ID
        var CATEGORY_CODE = "ac3b17f0af4811e387589951d960470f";   //评分类型ID（２８种评分 对应数据库 dic_scores_category表 code）
        var SCORE = patientScore;                       // 分值
        var SCORES_TIME = currentDate;    //评分时间
        if(me.parent.careTime){
            SCORES_TIME=me.parent.careTime;
        }
        var RATERS_ID = userInfo.userId;      //评分人（操作员ID)
        var PHM = ''; //死亡率
        var ICU_DAYS ="";//ICU天数。
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
                    debugger;
                    var reqmsg = Ext.decode(response.responseText);
                    var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                    if (reqmsg.success === true) {
                        Ext.getCmp('saveScore').setDisabled(true);
                       // me.parent.operType = 'edit';
                        me.parent.loadPageData(me.parent.patientInfo.PATIENT_ID, CATEGORY_CODE);
                        // 保存评分项 护理记录
                        if(me.parent.mod.indexOf("care_record") != -1) {
                            me.parent.popw.saveRecordScore("0","RTS : " + me.rtsCorse + " , ISS : " + me.issCorse + " , TRISS : " + me.trsissCorse+" , 死亡率(钝挫伤) : "+me.Contusion+" , 死亡率(贯穿伤) : "+me.pi,reqmsg.data,2);
                            SCORES_TIME =  me.parent.popw.careTime;
                        }
                        msg.popup('提示：','ISS-RTS-TRISS评分保存成功！');
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
            id:'issRtsScroeWindow',
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
            padding:'0',
            width: 458,
            height: 247,
            items: [
                {
                    xtype: 'panel',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    margin: '0',
                    padding: '0',
                    layout: 'fit',
                    html:'<iframe id="issScoreframe" frameborder="0" src="../app/nws/nursingscores/issrtstriss/iss_score.html"  width="100%" height="100%"></iframe>'
                }
            ]

        });
        me.callParent();
    }
});