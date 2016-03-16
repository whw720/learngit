/**
 * 功能说明: 评估工具栏
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingevaluation.EvalToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    height: 35,
    //autowidth:true,
    border: "0 0 1 0",
    margin: "0 0 0 0",
    constructor: function(config) {
        Ext.util.CSS.swapStyleSheet('criticalcare.css', '/app/nws/criticalcare/css/criticalcare.css');
        Ext.apply(this, config);
        var proxy = this;
        this.customButton = new Ext.button.Button({
            iconCls: 'save',
            width:25,
            tooltip: '保存',
            enableToggle: false,
            labelAlign: 'right',
            handler: function() {
                var me = this;
                var mod = this.ownerCt.ownerCt.mod;
                var parenttitle = this.ownerCt.ownerCt.title;
                if(!this.ownerCt.ownerCt.patientInfo){
                    Ext.MessageBox.alert('提示', '请选择床号！');
                    return false;
                };
                var aframe = '';
                var evalItem = "";
                if (parenttitle === "入院护理评估" ){
                    evalItem = "入院护理";
                    var parenttitle = this.ownerCt.ownerCt.title;
                    aframe = this.ownerCt.ownerCt.down('tabpanel').items.items[0].items.items[0].getEl().dom.firstChild.contentWindow;
                }else if(parenttitle === "住院护理评估" ){
                    evalItem = "住院护理";
                   // alert(this.mod);
                    aframe = document.getElementById(mod+'inHospitalIframe').contentWindow;
                }else if (parenttitle === "疼痛评估"){
                    evalItem = "疼痛";
                    aframe = document.getElementById(mod+'evalPainIframe').contentWindow;
                }else if (parenttitle === "导管滑脱危险因素评估"){
                    evalItem = "导管滑脱危险因素";
                    aframe = document.getElementById(mod+'evalCatheterRiskIframe').contentWindow;
                }else if (parenttitle === "跌倒/坠床因素评估"){
                    evalItem = "跌倒/坠床因素";
                    aframe = document.getElementById(mod+'evalFallRiskIframe').contentWindow;
                }else if(parenttitle === "waterlow's危险因素评估"){
                    evalItem = "waterlow's危险因素评估";
                    aframe = document.getElementById(mod+'evalWaterlowsRisk').contentWindow;
                }
                me.disable();
                aframe.saveData(function(type) {
                    if (type != 'error') {
                        // 保存成功关闭窗口
                        //me.destroy();
                        me.enable();
                        var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                        if (type == 'add') {
                            msg.popup('提示：',evalItem + '评估表保存成功！');
                        } else if (type == 'edit') {
                            msg.popup('提示：', evalItem + '评估表修改成功！');
                        }
                    }
                });
            }
        });

        this.classesButton = new Ext.button.Button({
            width:25,
            tooltip: '打印',
            iconCls: 'print-button',
            enableToggle: false,
            labelAlign: 'right',
            handler: function(){
                var parentpanel = this.up("tabpanel").getActiveTab();
                var parenttitle=parentpanel.title;
                var mod = this.ownerCt.ownerCt.mod;
                if(!this.ownerCt.ownerCt.patientInfo){
                    Ext.MessageBox.alert('提示', '请选择床号！');
                    return false;
                };
                var aframe = '';
                var evalItem = "";
                if (parenttitle === "入院护理评估" ){
                    evalItem = "入院护理评估";
                   if(parentpanel.down('tabpanel').getActiveTab().title == "正面"){
                       console.log(parentpanel.down('tabpanel').items.items[0].items.items[0].getEl());
                       aframe = parentpanel.down('tabpanel').items.items[0].items.items[0].getEl().dom.firstChild.contentWindow;
                       aframe.mod=proxy.mod;
                   }else{
                       aframe = parentpanel.down('tabpanel').items.items[1].items.items[0].getEl().dom.firstChild.contentWindow;
                       aframe.mod=proxy.mod;
                   }
                }else if(parenttitle === "住院护理评估" ){
                    evalItem = "住院护理";
                    aframe = document.getElementById(mod+'inHospitalIframe').contentWindow;
                }else if (parenttitle === "疼痛评估"){
                    evalItem = "疼痛";
                    aframe = document.getElementById(mod+'evalPainIframe').contentWindow;
                }else if (parenttitle === "导管滑脱危险因素评估"){
                    evalItem = "导管滑脱危险因素";
                    aframe = document.getElementById(mod+'evalCatheterRiskIframe').contentWindow;
                }else if (parenttitle === "跌倒/坠床因素评估"){
                    evalItem = "跌倒/坠床因素";
                    aframe = document.getElementById(mod+'evalFallRiskIframe').contentWindow;
                } if(parenttitle === "waterlow's危险因素评估"){
                    evalItem = "waterlow's危险因素评估";
                    aframe = document.getElementById(mod+'evalWaterlowsRisk').contentWindow;
                }
                aframe.saveData(function(type) {
                    if (type != 'error') {
                        // 保存成功关闭窗口
                        //me.destroy();
                        aframe.print();
                       /* var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                        if (type == 'add') {
                            msg.popup('提示：',evalItem + '评估表保存成功！');
                        } else if (type == 'edit') {
                            msg.popup('提示：', evalItem + '评估表修改成功！');
                        }*/
                    }
                });
            }//,
//            menu: [{
//                text: '直接打印',
//                iconCls: 'print',
//                handler: function(){
//                    debugger;
//                  var parenttitle = this.up("tabpanel").getActiveTab().title
//                    var aframe = '';
//                    var evalItem = "";
//                    if (parenttitle === "入院护理评估" ){
//                        evalItem = "入院护理评估";
//                        aframe = document.getElementById('intoHospitalIframeFont').contentWindow;
//                    }else if(parenttitle === "住院护理评估" ){
//                        evalItem = "住院护理";
//                        aframe = document.getElementById('inHospitalIframe').contentWindow;
//                    }else if (parenttitle === "疼痛评估"){
//                        evalItem = "疼痛";
//                        aframe = document.getElementById('evalPainIframe').contentWindow;
//                    }else if (parenttitle === "导管滑脱危险因素评估"){
//                        evalItem = "导管滑脱危险因素";
//                        aframe = document.getElementById('evalCatheterRiskIframe').contentWindow;
//                    }else if (parenttitle === "跌倒/坠床因素评估"){
//                        evalItem = "跌倒/坠床因素";
//                        aframe = document.getElementById('evalFallRiskIframe').contentWindow;
//                    }
//                    aframe.saveData(function(type) {
//                        if (type != 'error') {
//                            // 保存成功关闭窗口
//                            //me.destroy();
//                            aframe.print();
//                            var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
//                            if (type == 'add') {
//                                msg.popup('提示：',evalItem + '评估表保存成功！');
//                            } else if (type == 'edit') {
//                                msg.popup('提示：', evalItem + '评估表修改成功！');
//                            }
//                        }
//                    });
//
//                }
//            },
//                {
//                text: '打印预览',
//                iconCls: 'print-preview',
//                handler:  function(){
//                    debugger;
//                   // var me = this;
//                    var parenttitle = this.up("tabpanel").getActiveTab().title
//                    var aframe = '';
//                    var evalItem = "";
//                    if (parenttitle === "入院护理评估" ){
//                        evalItem = "入院护理评估";
//                        aframe = document.getElementById('intoHospitalIframeFont').contentWindow;
//                    }else if(parenttitle === "住院护理评估" ){
//                        evalItem = "住院护理";
//                        aframe = document.getElementById('inHospitalIframe').contentWindow;
//
//                    }else if (parenttitle === "疼痛评估"){
//                        evalItem = "疼痛";
//                        aframe = document.getElementById('evalPainIframe').contentWindow;
//                    }else if (parenttitle === "导管滑脱危险因素评估"){
//                        evalItem = "导管滑脱危险因素";
//                        aframe = document.getElementById('evalCatheterRiskIframe').contentWindow;
//                    }else if (parenttitle === "跌倒/坠床因素评估"){
//                        evalItem = "跌倒/坠床因素";
//                        aframe = document.getElementById('evalFallRiskIframe').contentWindow;
//                    }
//                    aframe.saveData(function(type) {
//                        if (type != 'error') {
//                            aframe.print();
//                        }
//                    });
//
//                }
//            }]
        });
        this.listeners={
            afterrender:function(){
                console.log(this.ownerCt.title);
                if(this.ownerCt.title=="waterlow's危险因素评估"||this.ownerCt.title=='住院护理评估'){
                   this.items.items[2].setVisible(false) ;
                }
            }
        }
        this.callParent([{
            items: [{
                xtype: 'label',
                text: ''
                },'->',proxy.customButton,'',proxy.classesButton,'','']
        }]);
    }

});
