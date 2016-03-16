/**
 * 功能说明:  跌倒/坠床因素评估表 panel
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingevaluation.EvalFallRiskPanel', {
    extend: 'Ext.panel.Panel',

    uses: [

    ],
    //id: this.mod +'EvalFallRiskPanel',
   // layout: 'fit',
    title: '跌倒/坠床因素评估',
    closable: true,
    width: 500,
    border: false,
    maximizable: true,
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;
        this.id = this.mod +'EvalFallRiskPanel';
        this.evalToolbar = new com.dfsoft.icu.nws.nursingevaluation.EvalToolbar({region: 'north'});
        var patientId = "4";
        var registerId = "4";
        if(this.patientInfo != null){
            // this.patientInfo = "";
            patientId = this.patientInfo.PATIENT_ID;
            registerId = this.patientInfo.REGISTER_ID;
        }
        this.callParent([{
            layout: {
                type: 'border',
                padding: 0
            },
            items: [this.evalToolbar,{
                xtype: 'panel',
                region: 'center',
                html: '<iframe id="'+this.mod+'evalFallRiskIframe" frameborder="0" src="/templates/' + templates + '/nws_eval_fall_risk.html?REGISTER_ID=' + registerId + '&PATIENT_ID=' + patientId + '&MOD=' + this.mod + '" width="100%" height="100%"></iframe>'
            }]
        }]);


    },
         //       html: '<iframe id="agreementIframe" frameborder="0" src="/templates/' + templates + '/nws_eval_fall_risk.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID + '&ROLE_ID=' + me.ROLE_ID + '" width="100%" height="100%"></iframe>'
// 切换患者setPatientInfo
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.elm.show();
        me.patientInfo = patientInfo;
        var aframe = document.getElementById(this.mod+'evalFallRiskIframe').contentWindow;
        aframe.changePatient(me.patientInfo.PATIENT_ID);
        me.evalToolbar.patientInfo=me.patientInfo;
        me.elm.hide();
    },
    onOK: function() {
        var me = this;
        var aframe = document.getElementById('agreementIframe').contentWindow;
        aframe.saveData(function(type) {
            if (type != 'error') {
                // 保存成功关闭窗口
                me.destroy();
                var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                if (type == 'add') {
                    msg.popup('提示：', '跌倒/坠床因素评估表保存成功！');
                } else if (type == 'edit') {
                    msg.popup('提示：', '跌倒/坠床因素评估表修改成功！');
                }
            }
        });
    },

    onPrint: function() {
        var me = this;
        var aframe = document.getElementById('agreementIframe').contentWindow;
        aframe.saveData(function(type) {
            if (type != 'error') {
                aframe.print();
                //保存打印次数
                Ext.Ajax.request({
                    url: webRoot + '/mbs/consent/print/' + me.PATIENT_ID,
                    success: function(response) {
                        var reqmsg = Ext.decode(response.responseText);
                        if (reqmsg.success === true) {
                            aframe.changeOperType(type);
                        } else {
                            Ext.Msg.show({
                                title: '错误',
                                msg: '数据修改失败：' + reqmsg.errors,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                        }
                    }
                });
            }
        });
    }
});