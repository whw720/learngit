/**
 * 功能说明: 麻醉方法 treemodel
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'PATIENT_ID',
            type: 'string',
            mapping:'PATIENT_ID'
        },
        {
            name: 'REGISTER_ID',
            type: 'string',
            mapping:'REGISTER_ID'
        },
        {
            name: 'NAME',
            type: 'string',
            mapping:'NAME'
        },
        {
            name: 'GENDER',
            type: 'string',
            mapping:'GENDER'
        },
        {
            name: 'AGE',
            type: 'string',
            mapping:'AGE'
        },
        {
            name: 'HOSPITAL_NUMBER',
            type: 'string',
            mapping:'HOSPITAL_NUMBER'
        },
        {
            name: 'IN_TIME',
            type: 'string',
            mapping:'IN_TIME'
        },
        {
            name: 'OUT_TIME',
            type: 'string',
            mapping:'OUT_TIME'
        },
        {
            name: 'BED_NUMBER',
            type: 'string',
            mapping:'BED_NUMBER'
        },
        {
            name: 'SID',
            type: 'string',
            mapping:'SID'
        }
    ]
});