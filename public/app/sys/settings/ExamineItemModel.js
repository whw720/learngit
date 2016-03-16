Ext.define('com.dfsoft.lancet.sys.settings.ExamineItemModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'CODE',
            type: 'string'
        },
        {
            name: 'CATEGORY', // 分类
            type: 'string'
        },
        {
            name: 'ORDER_NAME',
            type: 'string'
        },
        {
            name: 'NAME',
            type: 'string'
        },
        {
            name: 'DESCRIPTION',
            type: 'string'
        },
        {
            name: 'SORT_NUMBER',
            type: 'int'
        },
        {
            name: 'SYNCID', // 原系统编码
            type: 'string'
        },
        {
            name: 'HELPER_CODE', //助记码
            type: 'string'
        },
        {
            name: 'VALID',
            type: 'int'
        }
    ]
})