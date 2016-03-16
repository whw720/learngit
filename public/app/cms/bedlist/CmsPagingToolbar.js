/**
 * 功能说明: 中央监护站分页栏
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.cms.bedlist.CmsPagingToolbar', {
    extend: 'Ext.PagingToolbar',
    requires: [],
    constructor: function(config) {

        Ext.apply(this, config);
        var proxy = this;

        this.callParent([{
            store: proxy.store,
            displayMsg: '共{2}条',
            displayInfo: true,
            emptyMsg: '无数据',
            style: 'border: 1px solid #157fcc !important'
        }]);
    }
});
