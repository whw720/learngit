/**
 * 医嘱管理页面treeModel
 * @author:whw
 * @date:2014-3-13.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderModel', {
    extend: 'Ext.data.Model',
    fields: ['NUM',
        'ID',
        'PARENT_ID',
        'PATIENT_ID',
        'NAME', 'TYPE','CONTENT_TYPE',
        'CONTENT',
        'SHORT_NAME',
        'DOSAGE',
        'DOSAGE_ALL',
        'DOSAGE_COMPLETED',
        'COMPLETED_PROCESS',
        'UNIT_CODE',
        'INSTRUCTION',
        'CAVITY_CODE',
        'CAVITY',
        'ROUTE_CODE',
        'STOP_DOCTOR',
        'STOP_NURSE',
        'ROUTE',
        'DRUGS_CATEGORY_CODE',
        'DRUGS_ID',
        'FREQUENCY_CODE',
        'FREQUENCY_NAME',
        'IS_PUMPS',
         'PUMPS_SPEED',
        'EXECUTION_TIME',
        'COMPLETION_TIME',
        'EXECUTION_STATE',
        'COLLECT_TIME',
        'EXTRACT_TIME',
        'DOCTOR',
        'IS_SELECTED'
    ]
})