/**
 * 功能说明: Demo Store
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.DemoStore', {
    extend		: 'Ext.data.Store',
    requires	: ['com.dfsoft.icu.demo.DemoModel'],
    model		: 'com.dfsoft.icu.demo.DemoModel',
    autoLoad	:  true,
    proxy	: {
        type: 'ajax',
        url: webRoot + '/icu/demo',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    }
});