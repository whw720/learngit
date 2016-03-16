/**
 * 功能说明: 监护项目 treemodel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareProjectTreeModel', {
	extend : 'Ext.data.Model',
	fields: [{
            name: 'ID', 
            type: 'string' 
        }, {
            name: 'NAME', 
            type: 'string' 
        }, {
            name: 'PARENT_ID',
            type: 'string' 
        }, {
            name: 'PRESET_CODE',
            type: 'string'
        }, {
            name: 'ALIAS',
            type: 'string' 
        }, {
            name: 'UNIT_CODE',
            type: 'string' 
        }, {
            name: 'DATASOURCE_CODE',    
            type: 'string' 
        }, {
            name: 'DATASOURCE_VALUE',
            type: 'string' 
        }, {
            name: 'WIDTH',
            type: 'int'
        }, {
            name: 'DISPLAY_TO_CENTRAL',
            type: 'int'
        }, {
            name: 'DISPLAY_TO_RECORDS',
            type: 'int'
        },{
            name: 'IS_DAILY',
            type: 'int'
        }, {
            name: 'SUM_POSITION',
            type: 'string' 
        },{
            name: 'alertStr',
            type: 'string' 
        }
        
	]
});