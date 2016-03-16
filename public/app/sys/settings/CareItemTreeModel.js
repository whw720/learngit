/**
 * 功能说明: 护理项目 tree model
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareItemTreeModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'text',
		type: 'string'
	}, {
		name: 'id',
		type: 'string'
	}, {
		name: 'sort',
		type: 'int'
	}, {
		name: 'iconCls',
		type: 'string'
	}]
});