/**
* 功能说明: 护理评分 treestore
* @author: 杨祖文
*/
Ext.define('com.dfsoft.icu.nws.nursingscores.NursingScoresTreeStore', {
	extend		: 'Ext.data.TreeStore',
    requires	: ['com.dfsoft.icu.nws.nursingscores.NursingScoresTreeModel'],
    model		: 'com.dfsoft.icu.nws.nursingscores.NursingScoresTreeModel',
    autoLoad	:  true,
    proxy	: {
        type: 'ajax',
        url: webRoot + '/nws/icu/care_scores/getScores',
        reader: {
            type: 'json',
            root: 'children'
        }
    }
});