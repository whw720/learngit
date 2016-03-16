/**
 * 定义护理记录管道store
 *
 * @author chm
 * @version 2014-3-3
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.PipelineStore', {
    extend		: 'Ext.data.Store',

    fields: ['ID', 'NAME', 'INTUBATION_WAY', 'OXYGEN_MODE', 'GRADUATION','ADJUST_TIME', 'INTUBATION_DEPTH', 'INTUBATION_TIME', 'CHANGE_TIME', 'EXTUBATION_TIME'],

    autoLoad : false ,
    proxy	: {
        type: 'ajax',
        url: webRoot + '/icu/nursingRecord/pipeline/type/data/'+'引流管',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});