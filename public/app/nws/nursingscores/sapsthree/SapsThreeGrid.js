/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeGrid', {
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
                text: '得分',
                dataIndex: 'SCORES',
                width: 40,
                sortable: false,
                align: 'center',
                renderer:function(val,meta,records){
                    if(val == 0){
                        return "";
                    }else{
                        return val;
                    }

                }
            }, {
                text: '死亡率',
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