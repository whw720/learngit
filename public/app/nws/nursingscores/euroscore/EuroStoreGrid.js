/**
 * 功能说明: lemonstore grid
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.euroscore.EuroStoreGrid', {
	extend: 'Ext.grid.Panel',
    columnLines:true,
    forceFit: true,
    autoScroll:true,
        initComponent: function() {
		var me = this;
		Ext.apply(me, {
			border: false,
            enableColumnHide:false,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 50,
                align: 'center'
            }, {
                text: '评分时间',
                dataIndex: 'ITEM',
                width: 50,
                sortable: false,
                align: 'left'

            }, {
                text: '得分',
                dataIndex: 'SCORES',
                width: 50,
                sortable: false,
                align: 'center'
            }]
		});
		me.callParent();
	}

});