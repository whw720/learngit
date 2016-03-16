/**
 * 功能说明:  添加待入科患者 window
 * @author: 姬魁
 */
Ext.define('com.dfsoft.icu.nws.patientdetails.PatientsAddWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.patientdetails.PatientsAddForm',
        'com.dfsoft.icu.nws.patientdetails.PatientsNewEntity'
    ],
    initComponent :function(){
        var me = this;
        me.patientsDetailsForm = new com.dfsoft.icu.nws.patientdetails.PatientsAddForm();
        var record = Ext.create('com.dfsoft.icu.nws.patientdetails.PatientsNewEntity', me.patientInfo);
        me.patientsDetailsForm.loadRecord(record);
        var form = me.patientsDetailsForm.getForm();
        form.isValid();
        Ext.apply(me, {
            title: '添加待入科患者',
            iconCls: 'patients-details',
            tbar: ['->',{
                xtype: 'button',
                id: me.id + '_3fe45c90089d11e396021b9f5cdf5i21',
                //disabled: true,
                tooltip: '保存',
                scope: me,
                iconCls: 'save',
                handler: me.savePatientInfo
            }],
            padding: '0 5 5 5',
            layout: 'fit',
            width: 650,
            height: 460,
            items:[me.patientsDetailsForm]
        });
        me.callParent();
        // 权限控制保存患者详情
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp(me.id + '_' + resourceData[i].id);
            if (currButton != undefined) {
                currButton.setDisabled(false);
            }
        }
    },


    //修改病人信息
    savePatientInfo: function() {
        var me = this,
            form = me.patientsDetailsForm.getForm();
        form.findField('AGE').setValue(document.getElementById('AGE').value);
        var values = form.getValues();
        if (form.isValid()) {
            var myMask = new Ext.LoadMask(me, {
                msg: "保存中..."
            });
//            if(form.findField('SURGERY_NAME').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '手术名称最多输入200个字符!');
//            	return false;
//            }
//            if(form.findField('SURGERY_LEVEL').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '手术级别最多输入200个字符!');
//            	return false;
//            }
//            if(form.findField('DIAGNOSIS').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '诊断最多输入200个字符!');
//            	return false;
//            }
            if(form.findField('AGE').getValue().length>10){
            	Ext.MessageBox.alert('提示', '年龄最多输入20个字符!');
            	return false;
            }
            if(form.findField('NURSE_ID').getRawValue()!=null&&form.findField('NURSE_ID').getRawValue()!=""){
            	var nursestore =form.findField('NURSE_ID').getStore();
            	var record=nursestore.findRecord("text",form.findField('NURSE_ID').getRawValue());
            	if(record!=null){
            		form.findField('NURSE_ID').setValue(record.get("value"));
            		values.NURSE_ID=record.get("value");
            	}
            	if(form.findField('NURSE_ID').getValue().length!=32){
                	Ext.MessageBox.alert('提示', '主管护士不存在!');
                	return false;
                }
            }
            if(form.findField('DESCRIPTION').getValue().length>4000){
            	Ext.MessageBox.alert('提示', '备注最多输入4000个字符!');
            	return false;
            }
//            if(form.findField('DOCTOR').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '医生姓名最多输入200个字符!');
//            	return false;
//            }
            myMask.show();
            Ext.Ajax.request({
                url: webRoot + '/nws/icu_patient',
                method: 'POST',
                params: {
                    NAME: values.NAME,//患者姓名
                    GENDER:values.GENDER,//性别
                    HOSPITAL_NUMBER:values.HOSPITAL_NUMBER,//病人住院号 
                    DOCTOR:values.DOCTOR,//医生姓名
                    NURSE_ID:values.NURSE_ID,//护士id
                    BIRTHDAY:values.BIRTHDAY,//病人出生日期 
                    AGE:values.AGE,//病人年龄
                    BLOODTYPE:values.BLOODTYPE,//血型
                    ICU_ID:userInfo.deptId,//添加患者，默认赋ICU_ID
                    IN_DEPT_ID: values.IN_DEPT_ID,//病人所在科室唯一标识
                    DIAGNOSIS:values.DIAGNOSIS,//诊断
                    ALLERGIC_HISTORY:values.ALLERGIC_HISTORY,//过敏史
                    SURGERY_NAME:values.SURGERY_NAME,//手术名称
                    //SURGERY_LEVEL:values.SURGERY_LEVEL,//手术级别
                    SURGERY_DATE:values.SURGERY_DATE,//手术日期
                    CONDITION_CODE:values.CONDITION_CODE,//病情代码
                    CARE_LEVEL_CODE:values.CARE_LEVEL_CODE,
                    //IN_TIME:values.IN_TIME,
                    WEIGHT:values.WEIGHT,//体重
                    HEIGHT:values.HEIGHT,//身高
                    FOREGIFT:values.FOREGIFT,  //押金
                    TOTAL_COST:values.TOTAL_COST,  //累计费用,
                    FEE_LEVEL_CODE:'6b8935a0fdad11e2a4825301b41c99d9',
                    DESCRIPTION:values.DESCRIPTION
                },
                success: function(response) {
                    me.close();
                    Ext.getCmp('waitdeptgrid').getStore().reload({params:{deptId:userInfo.deptId}});
                },
                failure: function(response, options) {
                    myMask.hide();
                    Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                }
            });
        }
    }
});