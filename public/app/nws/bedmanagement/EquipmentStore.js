/**
 * 功能说明: 基本设置中的 仪器设备 store
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.EquipmentStore', {
	extend		: 'Ext.data.Store',
    fields: ['USE', {
        name: 'USE',
        type: 'boolean',
        defaultValue: true
    }, 'ID','NAME', 'MANUFACTURER', 'PRODUCT_TYPE'],
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