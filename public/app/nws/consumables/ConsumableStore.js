/**
 * 一次性材料Stor
 * @author:zag
 * @date:2014-9-12.
 */
Ext.define('com.dfsoft.icu.nws.consumables.ConsumableStore', {
    extend: 'Ext.data.Store',
    model: 'com.dfsoft.icu.nws.consumables.ConsumableModel',
    autoLoad :true,
    proxy: {
        type: 'ajax',
        url: webRoot + '/nws/getConsumable',
        actionMethods:{read:'POST'},
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        'beforeload': function (store, op, options) {
            var params = {
                registerId: this.registerId,
                startTime: this.startTime,
                orderType: this.orderType
            };
            Ext.apply(store.proxy.extraParams, params);
        }
    }
});


