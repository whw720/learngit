Ext.define('com.dfsoft.icu.nws.consumables.ConsumableTemplateModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'ID',//材料模板唯一标示
		type: 'string'
	}, {
		name: 'NAME',//材料模板名称
		type: 'string'
	}, {
		name: 'CONTENT'//材料模板内容json
	}, {
		name: 'CREATOR_ID'//创建者
	}, {
        name: 'CREATE_TIME'//创建时间
    }]
})