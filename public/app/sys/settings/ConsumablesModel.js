Ext.define('com.dfsoft.lancet.sys.settings.ConsumablesModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'CODE',
		type: 'string'
	}, {
		name: 'NAME',
		type: 'string'
	}, {
		name: 'DESCRIPTION',
		type: 'string'
	}, {
        name: 'LOCALITY',
        type: 'string'
    }, {
        name: 'SPECIFICATION',
        type: 'string'
    }, {
        name: 'USAGE',
        type: 'string'
    }, {
        name: 'PRICE',
        type: 'string'
    }, {
        name: 'HELP_CODE',
        type: 'string'
    }, {
        name: 'IS_HIGHVALUE',
        type: 'string'
    }, {
        name: 'DEFAULT_AMOUNT',
        type: 'string',
        defaultValue:1
    }, {
        name: 'RECORD_CODE',
        type: 'string'
    }]
})
