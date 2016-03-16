/**
 * Created by Max on 2015/1/10.
 */
/**
 * 一次性材料Stor
 * @author:zag
 * @date:2014-9-12.
 */
Ext.define('com.dfsoft.icu.gas.ExamineStore', {
    extend: 'Ext.data.Store',
    model: 'com.dfsoft.icu.gas.ExamineModel',
    autoLoad :true,
    proxy: {
        type: 'ajax',
        url: webRoot + '/gas/getExamineList',
        actionMethods:{read:'POST'},
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
    }
});


