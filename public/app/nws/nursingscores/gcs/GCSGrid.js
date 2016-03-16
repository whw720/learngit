/**
 * 功能说明: gcs grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.gcs.GCSGrid', {
	extend: 'Ext.grid.Panel',
    columnLines:true,

	initComponent: function() {

		var me = this;
		Ext.apply(me, {
			border: false,
            autoScroll: true,
            enableColumnHide:false,
            forceFit:true,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 50,
                align: 'center'
            }, {
                text: '评分时间',
                dataIndex: 'ITEM',
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