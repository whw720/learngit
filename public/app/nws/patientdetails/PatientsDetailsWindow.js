/**
 * 功能说明:  患者详情 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.patientdetails.PatientsDetailsWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.patientdetails.PatientsDetailsForm',
        'com.dfsoft.icu.nws.patientdetails.PatientsEntity',
        'com.dfsoft.icu.nws.patientdetails.surgeryStore',
        'Ext.grid.*',
		'Ext.data.*'
    ],
    initComponent :function(){
        var me = this;
        me.patientInfo=me.getPatientInfo(me.patientInfo.REGISTER_ID);
        Ext.util.Cookies.set("patientInfo", Ext.encode(me.patientInfo));
        me.patientsDetailsForm = new com.dfsoft.icu.nws.patientdetails.PatientsDetailsForm();
        var record = Ext.create('com.dfsoft.icu.nws.patientdetails.PatientsEntity', me.patientInfo);
        me.patientsDetailsForm.loadRecord(record);
        var form = me.patientsDetailsForm.getForm();
        form.findField('NURSE_ID').getStore().loadData([{"value": record.get('NURSE_ID'), "text": record.get('NURSE_NAME')}]);
        form.findField('NURSE_ID').setValue(record.get('NURSE_ID'));
        //form.findField('NURSE_ID').getStore().load();
        form.findField('AGE').setValue(record.get('AGE'));
        //form.findField('NURSE_ID').setValue(record.get('NURSE_NAME'));
        //form.findField('HIDDEN_NURSE_ID').setValue(record.get('NURSE_ID'));
        //form.findField('ICU_ID').setDefaultValue(record.get('ICU_ID'), record.get('ICU_NAME'));
        //form.findField('IN_DEPT_ID').setDefaultValue(record.get('IN_DEPT_ID'), record.get('OUT_DEPT_NAME'));
        form.findField('ICU_ID').setValue(record.get('ICU_ID'));
        form.findField('IN_DEPT_ID').setDefaultValue(record.get('IN_DEPT_ID'), record.get('IN_DEPT_NAME'));
        //form.findField('OUT_DEPT_ID').setDefaultValue(record.get('OUT_DEPT_ID'), record.get('OUT_DEPT_NAME'));
        //form.findField('OUT_CODE').setDefaultValue(record.get('OUT_CODE'), record.get('OUT_CODE_NAME'));
        form.findField('OUT_CODE').getStore().loadData([{"value": record.get('OUT_CODE')}]);
        Ext.apply(me, {
            title: '患者详情',
            iconCls: 'patients-details',
            tbar: ['->',
//                   {
//                xtype: 'button',
//                tooltip: '刷新',
//                iconCls: 'refresh-button',
//                handler: function() {
//                	me.patientsDetailsForm.loadRecord(record);
//                	var form = me.patientsDetailsForm.getForm();
//                    form.findField('ICU_ID').setDefaultValue(record.get('ICU_ID'), record.get('ICU_NAME'));
//                    form.findField('IN_DEPT_ID').setDefaultValue(record.get('IN_DEPT_ID'), record.get('OUT_DEPT_NAME'));
//                }
//            }, '-', 
            {
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
            height: 640,
            //height: 460,
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
        form.findField('IN_DEPT_ID').setRawValue(form.findField('IN_DEPT_ID').getRawValue());
        form.findField('IN_DEPT_ID').setValue(form.findField('IN_DEPT_ID').getValue());
        form.findField('AGE').setValue(document.getElementById('AGE').value);
        var values = form.getValues();
        //values.IN_DEPT_ID=form.findField('IN_DEPT_ID').getRawValue();
        if (form.isValid()) {
            var myMask = new Ext.LoadMask(me, {
                msg: "保存中..."
            });
//            if(form.findField('SURGERY_NAME').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '手术名称最多输入200个字符!');
//            	return false;
//            }
            //if(form.findField('SURGERY_LEVEL').getRawValue().length>200){
            //	Ext.MessageBox.alert('提示', '级别最多输入200个字符!');
            //	return false;
            //}
//            if(form.findField('DIAGNOSIS').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '诊断最多输入200个字符!');
//            	return false;
//            }
            if(form.findField('AGE').getValue().length>10){
            	Ext.MessageBox.alert('提示', '年龄最多输入20个字符!');
            	return false;
            }
            if(form.findField('DESCRIPTION').getValue().length>4000){
            	Ext.MessageBox.alert('提示', '备注最多输入4000个字符!');
            	return false;
            }
            if(form.findField('NURSE_ID').getRawValue()!=null&&form.findField('NURSE_ID').getRawValue()!=""){
            	var nursestore =form.findField('NURSE_ID').getStore();
            	var record=nursestore.findRecord("text",form.findField('NURSE_ID').getRawValue());
            	if(record!=null){
            		form.findField('NURSE_ID').setValue(record.get("value"));
            	}
            	if(form.findField('NURSE_ID').getValue().length!=32){
                	Ext.MessageBox.alert('提示', '主管护士不存在!');
                	return false;
                }
            }
            
//            if(form.findField('DOCTOR').getRawValue().length>200){
//            	Ext.MessageBox.alert('提示', '医生姓名最多输入200个字符!');
//            	return false;
//            }
            //OUT_TIME 出科
            //IN_TIME  入科
            //HOSPITAL_DATE 入院
            //SURGERY_DATE  手术日期
            if(form.findField('OUT_TIME').getRawValue().length>0&&form.findField('IN_TIME').getRawValue().length>0){
            	var OUT_TIME=new Date(form.findField('OUT_TIME').getRawValue()).Format("yyyy-MM-dd");
            	var IN_TIME=new Date(form.findField('IN_TIME').getRawValue()).Format("yyyy-MM-dd");
            	var NOW=new Date().Format("yyyy-MM-dd hh:mm:ss");
            	if(IN_TIME!=OUT_TIME){
            		if(form.findField('OUT_TIME').getRawValue()<form.findField('IN_TIME').getRawValue()){
                		Ext.MessageBox.alert('提示', '出科时间不能小于入科时间!');
                    	return false;
                	}
            	}
            	if(OUT_TIME>NOW){
            		Ext.MessageBox.alert('提示', '出科时间不能大于当前时间!');
                	return false;
        	}
            }
            if(form.findField('IN_TIME').getRawValue().length>0&&form.findField('HOSPITAL_DATE').getRawValue().length>0){
            	var IN_TIME=new Date(form.findField('IN_TIME').getRawValue()).Format("yyyy-MM-dd hh:mm:ss");
            	var HOSPITAL_DATE=new Date(form.findField('HOSPITAL_DATE').getRawValue()).Format("yyyy-MM-dd hh:mm:ss");
            	var NOW=new Date().Format("yyyy-MM-dd hh:mm:ss");
            	if(IN_TIME!=HOSPITAL_DATE){
            		if(IN_TIME<HOSPITAL_DATE){
                		Ext.MessageBox.alert('提示', '入科时间不能小于入院时间!');
                    	return false;
                	}
            	}
            	if(IN_TIME>NOW){
                		Ext.MessageBox.alert('提示', '入科时间不能大于当前时间!');
                    	return false;
            	}
            	if(HOSPITAL_DATE>NOW){
            		Ext.MessageBox.alert('提示', '入院时间不能大于当前时间!');
                	return false;
        	}
            }
//            if(form.findField('SURGERY_DATE').getRawValue().length>0&&form.findField('HOSPITAL_DATE').getRawValue().length>0){
//            	var SURGERY_DATE=new Date(form.findField('SURGERY_DATE').getRawValue()).Format("yyyy-MM-dd hh:mm:ss");
//            	var HOSPITAL_DATE=new Date(form.findField('HOSPITAL_DATE').getRawValue()).Format("yyyy-MM-dd hh:mm:ss");
//            	if(SURGERY_DATE!=HOSPITAL_DATE){
//            		if(SURGERY_DATE<HOSPITAL_DATE){
//                		Ext.MessageBox.alert('提示', '手术时间不能小于入院时间!');
//                    	return false;
//                	}
//            	}
//            }
//            if(form.findField('BIRTHDAY').getRawValue().length==0){
//            		Ext.MessageBox.alert('提示', '出生日期不能为空!');
//                	return false;
//            }
            //var date=form.findField('BIRTHDAY').getRawValue();
            //form.findField('AGE').setValue(computeAge(date));
            //values.AGE=computeAge(date);
            myMask.show();
            form.submit({
                url: webRoot + '/nws/icu_patient/' + values.REGISTER_ID,
                method: 'PUT',
                params: {
                    IN_DEPT_NAME: form.findField('IN_DEPT_ID').getRawValue()
                },
                success: function(form, action) {
                    myMask.hide();
                    values.ICU_ID = me.patientInfo.ICU_ID;
                    //values.IN_DEPT_ID = me.patientInfo.IN_DEPT_ID;
                    values.ICU_NAME = me.patientInfo.ICU_NAME;
                    values.IN_DEPT_NAME = form.findField('IN_DEPT_ID').getRawValue();
                    values.OUT_CODE = form.findField('OUT_CODE').getValue();
                    //values.OUT_DEPT_NAME = form.findField('OUT_DEPT_ID').getDisplayValue();
                    values.NURSE_NAME = form.findField('NURSE_ID').getRawValue();
                    values.NURSE_ID = form.findField('NURSE_ID').getValue();
                    values.CARE_LEVEL = form.findField('CARE_LEVEL_CODE').getRawValue();
                    var HOSPITAL_DATE=new Date(values.HOSPITAL_DATE).Format("yyyy-MM-dd hh:mm");
                    var NEW_TIME=new Date(values.IN_TIME).Format("yyyy-MM-dd hh:mm");
                    var CARE_START_TIME=new Date(me.patientInfo.CARE_START_TIME).Format("yyyy-MM-dd hh:mm");
                    if(values.IN_DEPT_NAME.indexOf('急诊')==0)NEW_TIME=HOSPITAL_DATE;
                    if(NEW_TIME==CARE_START_TIME){
                      Ext.Ajax.request({
                		url: webRoot + '/nws/icu_beds/changNurseItem/' + me.patientInfo.BED_ID,
                		method: 'PUT',
                		params: {
                            REGISTER_ID: me.patientInfo.REGISTER_ID,
                            PATIENT_ID: me.patientInfo.PATIENT_ID,
                            BED_ID: me.patientInfo.BED_ID,
                            patientName: me.patientInfo.NAME,
                            CARE_INTERVAL:me.patientInfo.CARE_INTERVAL,
                            CARE_START_TIME:NEW_TIME
                        },
                        success: function(response) {},
                        failure: function(response, options) {
                        }
                    });
                    }else {
                    	Ext.Ajax.request({
                    		url: webRoot + '/nws/icu_beds/changNurseHaveTime/' + me.patientInfo.BED_ID,
                    		method: 'PUT',
                    		params: {
                    		REGISTER_ID: me.patientInfo.REGISTER_ID,
                            PATIENT_ID: me.patientInfo.PATIENT_ID,
                            BED_ID: me.patientInfo.BED_ID,
                            patientName: me.patientInfo.NAME,
                            CARE_INTERVAL:me.patientInfo.CARE_INTERVAL,
                            changFrontTime:CARE_START_TIME,
                            changBackTime:NEW_TIME
                            },
                            success: function(response) {},
                            failure: function(response, options) {
                            }
                        });
                    }
                    me.patientInfo=me.getPatientInfo(values.REGISTER_ID);
                    values.SURGERY_NAME=me.patientInfo.SURGERY_NAME;
                    values.SURGERY_DATE=me.patientInfo.SURGERY_DATE;
                    me.selectPatientInfo(values);
                    var mes=Ext.getCmp('AlreadyDeptPanel');
                    try{
                    	if(mes.down('portalpanel')!=undefined){
                        	var portal = mes.down('portalpanel');
                        	if(portal.getWidth()!=0){
                        		mes.initBedInfo(portal, portal.getWidth());
                                // 床位添加成功后更新下方床位总数
                                var label = mes.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                                Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台';
                                var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                                if (bedNoCombo != undefined) {
                                    bedNoCombo.getStore().reload();
                                }
                        	}
                        }
                    }catch(e){}
                    me.close();
                },
                failure: function(form, action) {
                     myMask.hide();
                     Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
                }
            });
        }
    },
    // 获取病人信息
    getPatientInfo: function(registerId) {
        var patientInfo = null;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_patient/' + registerId,
            method: 'GET',
            async: false,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                patientInfo = respText[0];
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
            }
        });
        return patientInfo;
    }
});