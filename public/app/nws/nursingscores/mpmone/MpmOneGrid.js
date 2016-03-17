/**
 * 功能说明: mpm grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.mpmone.MpmOneGrid', {
	extend: 'Ext.grid.Panel',
    columnLines:true,

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			border: true,
            autoScroll: true,
            enableColumnHide:false,
            forceFit: true,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                align: 'center'
            }, {
                text: '评分时间',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '死亡率',
                dataIndex: 'SCORE',
                width:60,
                sortable: false,
                align: 'center'
            }]
		});
		me.callParent();
	}

});