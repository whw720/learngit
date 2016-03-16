/**
 * 一次性材料Stor
 * @author:zag
 * @date:2014-9-12.
 */
Ext.define('com.dfsoft.icu.nws.consumables.ConsumableTemplateStore',{
    extend: 'Ext.data.Store',
    model: 'com.dfsoft.icu.nws.consumables.ConsumableTemplateDetailModel',
    autoLoad :false,
    proxy: {
        type: 'ajax',
        url: webRoot + '/nws/getConsumableTemplateDetail',
        actionMethods:{read:'POST'},
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        'beforeload': function (store, op, options) {
            var params = {
                templateCode: this.templateCode
            };
            Ext.apply(store.proxy.extraParams, params);
        }
    }
});


