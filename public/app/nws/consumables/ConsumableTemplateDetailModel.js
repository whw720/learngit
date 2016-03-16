Ext.define('com.dfsoft.icu.nws.consumables.ConsumableTemplateDetailModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'CODE'//使用耗材代码
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
        name: 'TOTALPRICE'//总价
    },
        {
        name: 'AMOUNT'//用量
    },{
            name: 'IS_HIGHVALUE'// 是否高值耗材
        }]
});
/*
* { CODE: '1045',
 NAME: '一次性口罩',
 DESCRIPTION: '',
 SORT_NUMBER: 1,
 VALID: 1,
 LOCALITY: '',
 SPECIFICATION: '',
 USAGE: '',
 PRICE: null,
 HELP_CODE: 'YCXKZ',
 IS_HIGHVALUE: 0,
 DEFAULT_AMOUNT: 1,
 RECORD_CODE: '',
 amount: 4,
*
* */