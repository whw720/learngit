/**
 * 功能说明: 监护项目维护 警示 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AlertStore', {
	extend		: 'Ext.data.Store',
    fields: ['ID', 'ITEM_ID', 'FORMULA', 'COLOR', 'DESCRIPTION'],
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        url: '',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});