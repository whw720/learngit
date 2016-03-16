/**
 * 功能说明: 体温单分页栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.CriticalCarePagingToolbar', {
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
