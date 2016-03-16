/**
* 功能说明: 监护项目 treemodel
* @author: 杨祖文
*/
Ext.define('com.dfsoft.icu.nws.nursingscores.NursingScoresTreeModel', {
	extend : 'Ext.data.Model',
	fields: [{
            name: 'id',
            type: 'string'
        }, {
            name: 'pid',
            type: 'string'
        }, {
            name: 'text',
            type: 'string'
        }, {
            name: 'sort',
            type: 'string'
        }
	]
});