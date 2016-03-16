/**
 * 功能说明: 监护项目 treestore
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareProjectTreeStore', {
	extend		: 'Ext.data.TreeStore',
    requires	: ['com.dfsoft.icu.nws.bedmanagement.CareProjectTreeModel'],
    model		: 'com.dfsoft.icu.nws.bedmanagement.CareProjectTreeModel',
    autoLoad	:  false,
    proxy	: {
        type: 'ajax',
        url: '',
        reader: {
            type: 'json',
            root: 'children'
        }
    },
    listeners: {
        load: function(_this, node, records, successful, eOpts) {
            //查找所有节点
            var getChild = function(node) {
                var childs = [];
                var childNodes = node.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    childs.push(childNodes[i]);
                    if (childNodes[i].hasChildNodes()) {
                        childs = childs.concat(getChild(childNodes[i]));
                    }
                }
                return childs;
            }
            var recordsAll = getChild(_this.getRootNode());
            // 将父节点为预置项生命体征的全都设为叶子节点
            for(var i=0;i<recordsAll.length;i++) {
                if(recordsAll[i].parentNode.data.PRESET_CODE == 'bt64f80078fd11e39fd9cb7044fca582') {
                    recordsAll[i].data.leaf = true;
                }
                if(recordsAll[i].data.NAME == '护理内容') {
                    recordsAll[i].remove();
                }
            }
        }
    }
});