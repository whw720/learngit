/**
 * 监控项目的树。
 * @author:whw
 * @date:2014-3-28.
 */
Ext.define('com.dfsoft.icu.dtm.accessibility.CareItemTreesStore', {
    extend: 'Ext.data.TreeStore',

    fields: [{
        name: 'text',
        type: 'string'
    }, {
        name: 'id',
        type: 'string'
    },{
        name:'type',
        type:'string'
    }],
    proxy	: {
        type: 'ajax',
        url: webRoot + '/dtm/accessibility/query_item_tree',
        reader: {
            type: 'json',
            root: 'children'
        }
    },
    autoLoad: true,
    listeners:{
        load: function(_this, node, records, successful, eOpts) {
            //查找所有节点
            var getChild = function(node) {
                var childNodes = node.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].hasChildNodes()) {
                        getChild(childNodes[i]);
                    }else {
                        childNodes[i].data.leaf = true;
                    }
                }
            }
            // 将没有子节点的设为叶子节点
            getChild(_this.getRootNode());
        }
    }
});
