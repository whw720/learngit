/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'内科疾病或急诊手术入住ICU？',0.83404],
            [false,'转移性肿瘤？',1.16109],
            [false,'肝硬化？',1.08745],
            [false,'肌酐> 177 umol/L？',0.72283],
            [false,'尿量< 150 mL / 8 h？',0.82286],
            [false,'明确感染？',0.49742],
            [false,'颅内占位？',0.91314],
            [false,'机械通气？',0.80845],
            [false,'血管活性药物使用 > = 1 h？',0.71628],
            [false,'PaO2 < 60 mmHg？',0.46677],
            [false,'凝血酶原时间 > 正常值 3 sec？',0.55352]
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
            forceFit: true,
            enableHdMenu:false,
            enableColumnHide:false,
            columns: [{
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

            }]
		});
		me.callParent();
	}

});