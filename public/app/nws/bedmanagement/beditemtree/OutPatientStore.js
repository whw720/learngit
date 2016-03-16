/**
 * 功能说明: 待入科患者 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientStore', {
	extend		: 'Ext.data.Store',
    requires	: ['com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientModel'],
    model		: 'com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    }
});