/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'年龄≥65岁？',1],
            [false,'CAD风险因子≥3？',1],
            [false,'已明确 CAD (狭窄 ≥ 50%)？',1],
            [false,'过去7天内使用了ASA？',1],
            [false,'严重心绞痛 (≥ 2 次/24 hrs)？',1],
            [false,'ST 改变 ≥ 0.5mm？',1],
            [false,'心肌标志物阳性？',1]
        ];

        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'}
            ],
            data: myData
        });
		var me = this;
		Ext.apply(me, {
			border: true,
            store: store,
            enableColumnHide:false,
            forceFit: true,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                resizable:false,
                align: 'center'
            },{
                xtype: 'checkcolumn',
                text: '选择',
                sortable: false,
                dataIndex: 'SEL',
                width:20,
                listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
                    var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                    re.commit();
                }}

            }, {
                text: '项目',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '分值',
                dataIndex: 'SCORES',
                width:1,
                sortable: false,
                align: 'left',
                hidden:true
            }]
		});
		me.callParent();
	}

});