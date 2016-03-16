Ext.define('com.dfsoft.lancet.sys.settings.DepartmentModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'text',
		type: 'string'
	}, {
		name: 'id',
		type: 'string'
	}, {
		name: 'path_name',
		type: 'string'
	}, {
		name: 'sort',
		type: 'int'
	}, {
		name: 'iconCls',
		type: 'string',
		defaultValue: 'settings-dept',
		persist: true
	}]
});