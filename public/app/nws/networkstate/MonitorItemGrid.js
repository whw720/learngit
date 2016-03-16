/**
 * 功能说明: 监护项目查询
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.networkstate.MonitorItemGrid', {
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
                text: '监护项目',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '值',
                dataIndex: 'SCORES',
                width: 40,
                sortable: false,
                align: 'center'

            }, {
                text: '监护时间',
                dataIndex: 'SCORE',
                width: 60,
                sortable: false,
                align: 'center',
                renderer:function(val,meta,records){
                    if(val == 0){
                        return "";
                    }else{
                        return val;
                    }
                }
            }]
		});
		me.callParent();
	}
});