/**
 * 定义入院评估面板
 *
 * @author zag
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalTab',{
    extend 	: 'Ext.tab.Panel',
    alias : 'widget.evalintohospitaltab',
    initComponent : function(){
        var me = this;
        //Ext.util.CSS.swapStyleSheet('nursingrecord.css', '/app/nws/nursingrecord/css/nursingrecord.css');
        var proxy = this;
        if(!proxy.patientInfo)proxy.patientInfo={};
        var front=new Ext.ux.IFrame({
            id:this.mod+'_front',
            width:'100%',
            height:'100%',
            border: false,
            src:'/templates/' + templates + '/nws_eval_into_hospital_front.html?SURGERY_ID=' + proxy.patientInfo.SURGERY_ID + '&PATIENT_ID=' + proxy.patientInfo.PATIENT_ID + '&ROLE_ID=' + proxy.patientInfo.ROLE_ID + '&mod='+proxy.mod
            //src:/templates/' + templates + '/medicalrecord/adm-patient-medical-short-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID,
        });
        var back=new Ext.ux.IFrame({
            id:this.mod+'_back',
            width:'100%',
            height:'100%',
            border: false,
            src:'/templates/' + templates + '/nws_eval_into_hospital_back.html?SURGERY_ID=' + proxy.patientInfo.SURGERY_ID + '&PATIENT_ID=' + proxy.patientInfo.PATIENT_ID + '&ROLE_ID=' + proxy.patientInfo.ROLE_ID+ '&mod='+proxy.mod
            //src:/templates/' + templates + '/medicalrecord/adm-patient-medical-short-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID,
        });
        Ext.apply(this, {
            // id			: 'into_hospital_tab',
            //name		: 'into_hospital_tabname',
            title       : '',
            region 		: 'center',
            activeTab	: 0,
            tabPosition : 'bottom',
            plain       : true,
            deferredRender:false,
            items:[
                new Ext.Panel({
                    title:"正面",
                    height:30,
                    items:[front]
                }),
                new Ext.Panel({
                    title:"反面",
                    height:30,
                    items:[back]
                })
            ],
            listeners:{
                tabchange:function(tp,p){
                    //点击切换标签页时执行。
                }
            }
        });
        this.callParent(arguments);
    }
});