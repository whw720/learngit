/**
 * 功能说明: iss评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissGrid', {
	extend: 'Ext.grid.Panel',
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			//border: false,
         //   autoScroll: true,
            forceFit: true,
            enableColumnHide:false,
           columnLines: true,
            viewConfig: {
                stripeRows: true
            },
            columns: [
                {
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                align: 'center'
            },
                {
                text: '评分时间',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'
            },
                {
                text: '得分',
                    columns:[
                        {
                            text: 'ISS',
                            dataIndex: 'ISSSCORES',
                            width: 50,
                            sortable: false,
                            align: 'center'
                        },{
                            text: 'RTS',
                            dataIndex: 'RTSSCORES',
                            width: 80,
                            sortable: false,
                            align: 'center'
                        },{
                            text: 'TRISS',
                            dataIndex: 'TRISSSCORES',
                            width: 60,
                            sortable: false,
                            align: 'center'
                        }
                    ]
            },
                {
                    text: '死亡率',
                    columns:[
                        {
                            text: '顿挫伤',
                            dataIndex: 'CONSCORES',
                            width: 80,
                            align: 'center'
                        },{
                            text: '贯穿伤',
                            dataIndex: 'PISCORES',
                            width: 80,
                            align: 'center'
                        }
                    ]
                }]
		});
		me.callParent();
	}

});