/**
 * 功能说明: 护理记录模板 tree model
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareTemplateTreeModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'text',
		type: 'string'
	}, {
		name: 'id',
		type: 'string'
	}, {
		name: 'type',
		type: 'int'
	}, {
		name: 'sort',
		type: 'int'
	}, {
		name: 'iconCls',
		type: 'string'
	}, {
		name: 'content',
		type: 'string'
	},{
		name: 'conclusion_type',
		type: 'string'
	}]
});