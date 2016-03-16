/**
 * 功能说明: 待入科患者 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.specialevent.SpecialEventStore', {
	extend		: 'Ext.data.Store',
    requires	: ['com.dfsoft.icu.nws.specialevent.SpecialEventModel'],
    model		: 'com.dfsoft.icu.nws.specialevent.SpecialEventModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});