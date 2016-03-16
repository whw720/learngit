/**
 * 功能说明: 麻醉方法 treemodel
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
            mapping:'id'
        },
        {
            name: 'text',
            type: 'string',
            mapping:'text'
        },
        {
            name: 'datasource_value',
            type: 'string',
            mapping:'datasource_value'
        },
        {
            name: 'bed_id',
            type: 'string',
            mapping:'bed_id'
        }
    ]
});