/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.mpmone.MpmOneItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'内科疾病或急诊手术入住ICU？',1.19098],
            [false,'转移性肿瘤？',1.19979],
            [false,'肝硬化？',1.13681],
            [false,'慢性肾功能不全？',0.91906],
            [false,'入院前C.P.R.？',0.56995],
            [false,'心率 > = 150？',0.45603],
            [false,'收缩压？',1.06127],
            [false,'急性肾功能不全？',1.48210],
            [false,'心律失常？',0.28095],
            [false,'脑血管意外？',0.21338],
            [false,'消化道出血？',0.39653],
            [false,'颅内占位性病变？',0.86533],
            [false,'机械通气？',0.79105]
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'Coefficient',type: 'float'}
            ],
            data: myData
        });
		var me = this;
		Ext.apply(me, {
			border: true,
            store: store,
            width:'100%',
            enableHdMenu:false,
            enableColumnHide:false,
            forceFit: true,
            columns: [
                {
                    xtype: 'rownumberer',
                    text: '序号',
                    width:40,
                    align: 'center'
                }, {
                    xtype: 'checkcolumn',
                    text: '选择',
                    sortable: false,
                    dataIndex: 'SEL',
                    width:10,
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
                    text: '系数',
                    dataIndex: 'Coefficient',
                    sortable: false,
                    align: 'left',
                    hidden:true
                }


            ]
		});
		me.callParent();
	}

});