Ext.define('com.dfsoft.lancet.sys.settings.DrugRouteModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'CODE', // 用药途径代码
		type: 'string'
	}, {
		name: 'CATEGORY', // 用药途径分类
		type: 'string',
        defaultValue:'用药途径'
	}, {
		name: 'NAME', // 用药途径名称
		type: 'string',
		defaultValue: '新用药途径'
    },
        {
            name: 'HELPER_CODE',
            type: 'string'
        },
        {
		name: 'DESCRIPTION', // 用药途径描述
		type: 'string'
	}, {
		name: 'IS_INTAKE', // 是否计入入量
		type: 'boolean'
	}, {
		name: 'IS_PRINT', // 打印时是否显示
		type: 'boolean'
	}, {
		name: 'IS_EXTRACT', // 是否从HIS等系统中提取该途径的医嘱
		type: 'boolean'
	},{
        name:'SORT_NUMBER',
        type:'int'
    },{
        name:'CARE_ITEM_CODE',//说明医嘱用
        type:'string'
    },{
        name:'CARE_ITEM_NAME',//说明医嘱用
        type:'string'
    }]
})