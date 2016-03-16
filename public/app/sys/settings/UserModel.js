Ext.define('com.dfsoft.lancet.sys.settings.UserModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string'
	}, {
		name: 'dept_id',
		type: 'string'
	}, {
		name: 'dept_name',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'password',
		type: 'string',
		defaultValue: '********'
	}, {
		name: 'phone',
		type: 'string'
	}, {
		name: 'practitioner_qualification',
		type: 'string'
	}, {
		name: 'years_qualification',
		type: 'string'
	},{
		name: 'helpercode',
		type: 'string'
	}]
})