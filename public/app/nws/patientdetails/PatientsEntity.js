Ext.define('com.dfsoft.icu.nws.patientdetails.PatientsEntity', {
	extend: 'Ext.data.Model',
	fields: [{
			name: 'HOSPITAL_DATE',
			type: 'date'
		}, 'REGISTER_ID',
		'BED_ID', 'PATIENT_ID', {
			name: 'IN_TIME',
			type: 'date'
		}, {
			name: 'OUT_TIME',
			type: 'date'
		}, 'ICU_ID',
		'ICU_NAME',
		'IN_DEPT_ID',
		'IN_DEPT_NAME',
		'OUT_DEPT_ID',
		'OUT_DEPT_NAME',
		'SURGERY_NAME',
		'SURGERY_LEVEL', {
			name: 'SURGERY_DATE',
			type: 'date'
		}, 'HEIGHT',
		'WEIGHT',
		'BLOODTYPE',
		'BIRTHDAY',
		'DIAGNOSIS',
		'ALLERGIC_HISTORY',
		'DOCTOR',
		'CONDITION_CODE',
		'CARE_LEVEL_CODE',
		'NURSE_ID',
		'NURSE_NAME',
		'FOREGIFT',
		'TOTAL_COST',
		'DESCRIPTION',
		'HOSPITAL_NUMBER',
		'NAME',
		'AGE',
		'STATUS_CODE',
		'SID',
		'GENDER',
		'OUT_CODE',
		{
			name: 'DIE_DATE',
			type: 'date'
		}
	]
});