/**
 * 功能说明: 待入科患者 model
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.WaitToDeptModel', {
	extend : 'Ext.data.Model',
	fields: [{
            name: 'REGISTER_ID', // 登记记录ID
            type: 'string' 
        }, {
            name: 'PATIENT_ID', // 病人ID
            type: 'string' 
        }, {
            name: 'BED_ID',
            type: 'string' 
        }, {
            name: 'select',
            type: 'boolean',
            defaultValue: false
        }, {
            name: 'bedNo'
        }, {
            name: 'hospitalNo' 
        }, {
            name: 'patientName' 
        }, {
            name: 'gender' 
        }, {
            name: 'department' 
        }, {
            name: 'birthday'
        }, {
            name: 'hospitalDate' //入院日期
        }, {
            name: 'diagnosis' //诊断
        }, {
            name: 'careLevel' //护理级别
        }, {
            name: 'conditionName' //病情
        }, {
            name: 'nurseName' //责任护士
        },
        {
        	name:'IN_DEPT_ID'
        }
	]
});