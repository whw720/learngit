/**
* 功能说明: 麻醉方法 treestore
* @author: jikui
*/
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore', {
	extend		: 'Ext.data.TreeStore',
    requires	: ['com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeModel'],
    model		: 'com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'children'
        }
    }
});