/**
 * 功能说明:  入院护理评估表 panel
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['com.dfsoft.icu.nws.nursingevaluation.EvalToolbar',
        'com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalTab'
    ],
    layout: 'border',
    title: '入院护理评估',
    closable: true,
   // width: 500,
    border: false,
    maximizable: true,
    initComponent: function() {
        this.id=this.mod+'_EvalIntoHospitalPanel';
        var me = this;
        this.evalToolbar = new com.dfsoft.icu.nws.nursingevaluation.EvalToolbar({region: 'north',mod:this.mod,patientInfo:this.patientInfo});
        this.createTabView1 = new com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalTab({mod:this.mod,patientInfo:this.patientInfo});
        me.items = [this.evalToolbar,this.createTabView1
            ];
        me.callParent();
    },
    // 切换患者setPatientInfo
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        me.elm.show();
        me.patientInfo = patientInfo;
        var aframe = this.createTabView1.items.items[0].items.items[0].getEl().dom.firstChild.contentWindow;
        me.evalToolbar.patientInfo=me.patientInfo;
        aframe.changePatient(me.patientInfo.PATIENT_ID);
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
                    msg.popup('提示：', '入院护理评估表保存成功！');
                } else if (type == 'edit') {
                    msg.popup('提示：', '入院护理评估表修改成功！');
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