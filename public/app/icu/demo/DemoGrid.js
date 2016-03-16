/**
 * 功能说明: Demo Grid
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.DemoGrid', {
    extend : 'Ext.grid.Panel',
    requires: ['com.dfsoft.icu.demo.DemoStore'],
    initComponent : function() {
        var demoStore = new com.dfsoft.icu.demo.DemoStore();
        Ext.apply(this, {
            store	: demoStore,
            columns	: [{
                header		: 'ID',
                dataIndex	: 'id',
                width		:  100
            },{
                header		: '名称',
                dataIndex	: 'name',
                width		: 150
            }],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: demoStore,
                displayMsg: '共{2}条',
                style: 'border: 1px solid #157fcc !important',
                displayInfo: true,
                emptyMsg: '无数据'
            })
        });
        this.callParent(arguments);
    }
});