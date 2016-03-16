/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.wellscriteriaforpe.WellsCriteriaForPEItemGrid', {
	extend: 'Ext.grid.Panel',
    columnLines:true,
	initComponent: function() {
        var myData = [
            [false,'有深静脉（DVT?）症状和体征吗？',3],
            [false,'首先考虑PE吗？',3],
            [false,'心率>100？',1.5],
            [false,'制动超过3天或4周内有手术史吗？',1.5],
            [false,'整条腿肿胀吗？',1],
            [false,'曾经有过PE或DVT吗？',1.5],
            [false,'有咯血现象吗？',1],
            [false,'恶性肿瘤，在6个月内接受任何形式治疗或姑息性吗？',1]
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
            forceFit: true,
            enableHdMenu:false,
            enableColumnHide:false,
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