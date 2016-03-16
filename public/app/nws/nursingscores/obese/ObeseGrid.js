/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.obese.ObeseGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            ['<strong style="color:#F00">O</strong>bese',false,'肥胖，体重超过正常20%以上或BMI>26？',10],
            ['<strong style="color:#F00">B</strong>earded',false,'颌面部畸形，长须？',10],
            ['<strong style="color:#F00">E</strong>lderly',false,'老年，年龄>55？',10],
            ['<strong style="color:#F00">S</strong>norer',false,'打鼾？',10],
            ['<strong style="color:#F00">E</strong>dentulous',false,'牙齿残缺、畸形、前咬合、后咬合？',10]
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'OBESE'},
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'}

            ],
            data: myData
        });
		var me = this;
		Ext.apply(me, {
			border: true,
            height: 110,
            store: store,
            forceFit: true,
            enableHdMenu:false,
            enableColumnHide:false,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 45,
                align: 'center'
            }, {
                text: 'OBESE',
                dataIndex: 'OBESE',
                width: 90,
                sortable: false,

                align: 'left'
            }, {
                xtype: 'checkcolumn',
                text: '选择',
                sortable: false,
                dataIndex: 'SEL',
                width:45,
                listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
                    var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                    re.commit();
                }}
            }, {
                text: '项目',
                dataIndex: 'ITEM',
                flex:1,
                sortable: false,
                align: 'left'
            }, {
                text: '分值',
                dataIndex: 'SCORES',
                width:1,
                sortable: false,
                align: 'left',
                hidden:true
            }
            ]
		});
		me.callParent();
	}

});