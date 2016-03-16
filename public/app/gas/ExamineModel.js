/**
 * Created by Max on 2015/1/10.
 */
Ext.define('com.dfsoft.icu.gas.ExamineModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'ID',
        type: 'string'
    },{
        name:'EXAMINE_DATE'
    },{
        name: 'SAMPLE_CODE',
        type: 'string'
    }, {
        name: 'PATIENT_TYPE'
    }, {
        name: 'HOSPITAL_NUMBER'
    },{
        name: 'PATIENT_NAME',
        type: 'string'
    },{
        name:'AGE'
    },{
        name:'GENDER'
    },{
       name:'FEE_TYPE'
    },{
        name: 'IN_DEPT'
    },{
        name: 'BED_NUMBER'
    },{
        name:'SAMPLE_TYPE'
    },{
        name:'SUBMIT_DOCTOR'
    },{
        name:'REQUEST_NUMBER'
    },{
        name:'SUBMIT_DATE'
    },{
        name:'SAMPLING_TIME'
    },{
        name:'REPORT_DATE'
    },{
        name:'CHECKER'
    },{
        name:'REVIEWER'
    },{
        name:'DIAGNOSIS'
    },{
        name:'DESCRIPTION'
    },{
        name:'TYPE'
    }]
})