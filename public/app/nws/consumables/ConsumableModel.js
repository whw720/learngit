Ext.define('com.dfsoft.icu.nws.consumables.ConsumableModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'ID',//耗材使用唯一标识
		type: 'string'
	}, {
		name: 'SCHEDULING_TYPE',//使用班次
		type: 'string'
	}, {
		name: 'USE_DATE'//使用日期
	}, {
		name: 'CONSUMABLES_CODE'//使用耗材代码
	},   {
        name: 'NAME'//名称
    },  {
        name: 'LOCALITY'//产地
    },  {
        name: 'SPECIFICATION'//规格
    },  {
        name: 'USAGE'//用途
    },  {
        name: 'PRICE'//单 价
    },  {
        name: 'RECORD_CODE'//备案
    },{
        name: 'totalPrice'//总价
    },
        {
        name: 'AMOUNT'//用量
    },{
            name: 'IS_HIGHVALUE'// 是否高值耗材
        }, {
        name: 'REGISTER_ID'//患者登记ID
    }, {
        name: 'CREATOR_ID'//创建者
    }, {
        name: 'CREATE_TIME'//创建时间
    }]
});