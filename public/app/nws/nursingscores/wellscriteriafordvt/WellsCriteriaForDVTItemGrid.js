/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.wellscriteriafordvt.WellsCriteriaForDVTItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'活动性癌症吗？',1],
            [false,'卧床>3天或近4周内行大手术吗？',1],
            [false,'两腿比较，相差>3cm吗？',1],
            [false,'有下肢静脉曲张吗？',1],
            [false,'整条腿肿胀吗？',1],
            [false,'沿深静脉走行有压痛吗？',1],
            [false,'有症状的腿有凹陷性水肿吗？',1],
            [false,'下肢麻痹、瘫痪或固定吗？',1],
            [false,'曾经发生过 DVT吗（诊断明确的）？',1],
            [false,'除 DVT的诊断，还有其他可能的诊断吗？',-2]
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