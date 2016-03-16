Ext.define('com.dfsoft.lancet.sys.settings.DrugModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'CODE', // 药品ID
		type: 'string'
	}, {
		name: 'CATEGORY_CODE', // 药品分类CODE
		type: 'string',
		defaultValue: '701d8234a90311e3a45400271396a820'
	}, {
		name: 'CATEGORY', // 分类
		type: 'string',
		defaultValue: '静脉注射/泵入液体'
	}, {
		name: 'COMMON_NAME', // 药品名
		type: 'string',
		defaultValue: '新药品'
	}, {
		name: 'PRODUCT_NAME', // 商品名
		type: 'string'
	}, {
        name: 'DISPLAY_NAME', // 显示名称
        type: 'string'
    }, {
        name: 'SYNCID', // 原系统编码
        type: 'string'
    }, {
		name: 'HELPER_CODE', //助记码
		type: 'string'
	}, {
		name: 'SPECIFICATION_QUALITY', //规格  质量
		type: 'string'
	}, {
		name: 'UNIT_QUALITY_CODE', //规格  质量单位
		type: 'string'
	}, {
		name: 'SPECIFICATION_VOLUME', //规格  容积
		type: 'string'
	}, {
		name: 'UNIT_VOLUME_CODE', //规格  容积单位
		type: 'string'
	}, {
		name: 'DOSAGE_DEFAULT', //默认剂量
		type: 'string'
	}, {
		name: 'UNIT_DEFAULT_CODE', //默认剂量 单位
		type: 'string'
	}, {
		name: 'ROUTE_DEFAULE_CODE', //用药途径代码
		type: 'string'
	}, {
		name: 'ROUTE_DEFAULE_NAME', //用药途径名称
		type: 'string'
	}, {
		name: 'IS_COMMON', // 是否常用药
		type: 'boolean'
	}, {
		name: 'IS_ENABLED', // 是否启用
		type: 'boolean',
		defaultValue: true
	},{
        name: 'PRICE', // 药品单价
        type: 'string'
    },{
        name: 'MANUFACTURER', // 药品厂商
        type: 'string'
    },{
        name: 'MEDICARE_TYPE', // 医保类型
        type: 'string'
    }, {
        name: 'IS_BASED_MEDICINE', // 是否基药
        type: 'boolean'
    }]
})