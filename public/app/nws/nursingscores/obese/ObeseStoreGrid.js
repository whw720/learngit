/**
 * 功能说明: lemonstore grid
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.obese.ObeseStoreGrid', {
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
                width: 40,
                align: 'center'
            }, {
                text: '评分时间',
                dataIndex: 'ITEM',
                width: 60,
                sortable: false,
                align: 'left'

            }, {
                text: '得分',
                dataIndex: 'SCORES',
                width: 40,
                sortable: false,
                align: 'center'
            }]
		});
		me.callParent();
	}

});