/**
 * 定义护理记录插管统计图store
 *
 * @author chm
 * @version 2014-3-3
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.IntubateChartStore', {
    extend	: 'Ext.data.Store',

    fields  : ['DAY', 'NAME'],

    autoLoad :  true,

    proxy	: {
        type   : 'ajax',
        url    : webRoot + '/icu/nursingRecord/pipeline/chart/'+'intubate_chart',
        reader : {
            type : 'json',
            root : 'data'
        }
    },
    listeners : {
        beforeload : function(store, records, successful, eOpts){
            Ext.apply(store.proxy.extraParams, {
                registerId : this.patientInfo.REGISTER_ID
            });
        }
    }
});