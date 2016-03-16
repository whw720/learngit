/**
 * 功能说明: 麻醉方法 treemodel
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'CODE',
            type: 'string',
            mapping:'CODE'
        },
        {
            name: 'SYNCID',
            type: 'string',
            mapping:'SYNCID'
        },
        {
            name: 'NAME',
            type: 'string',
            mapping:'NAME'
        },
        {
            name: 'CATEGORY',
            type: 'string',
            mapping:'CATEGORY'
        }
    ]
});