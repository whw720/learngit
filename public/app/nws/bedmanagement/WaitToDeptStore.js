/**
 * 功能说明: 待入科患者 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.WaitToDeptStore', {
	extend		: 'Ext.data.Store',
    requires	: ['com.dfsoft.icu.nws.bedmanagement.WaitToDeptModel'],
    model		: 'com.dfsoft.icu.nws.bedmanagement.WaitToDeptModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        url: webRoot + '/nws/wait_to_dept',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});