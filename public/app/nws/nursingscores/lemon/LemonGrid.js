/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.lemon.LemonGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            ['<strong style="color:#F00">L</strong>ook at anatomy',false,'<strong>看解剖：</strong>肥胖，颌面部畸形，长须，牙齿残缺、畸形、前咬合、后咬合 ，尖下颏，小口，感染，短颈，疤痕，外伤，假牙，具其中一项以上，下同。',10],
            ['<strong style="color:#F00">E</strong>xamine airway',false,'<strong>评估3-3-2 规则：</strong>张口容不下3指,，颏至舌骨距离<3指，口底至甲状软骨距离<2指。',10],
            ['<strong style="color:#F00">M</strong>allampati',false,'<strong>Mallampati分级：</strong>Class III，Class IV。',10],
            ['<strong style="color:#F00">O</strong>bstructions',false,'<strong>梗阻症状：</strong> 打鼾，血肿，脓肿，扁桃体炎，喉炎，肿瘤，异物，包扎。',10],
            ['<strong style="color:#F00">N</strong>eck mobility',false,'<strong>颈活动受限：</strong>颈椎骨折，颈椎强直，固定，手术，烧伤。',10]
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
            store: store,
            forceFit: true,
            enableHdMenu:false,
            enableColumnHide:false,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                align: 'center'
            }, {
                text: 'LEMON',
                dataIndex: 'OBESE',
                width: 130,
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
            },
                {dataIndex:'ITEM',
                    text:'项目',
                    width:200,
                    sortable: false,
                    renderer: function(value, meta, record) {
                    meta.style = 'overflow:auto;padding: 3px 6px;text-overflow: ellipsis;white-space: nowrap;white-space:normal;line-height:20px;';
                    return value;
                }}, {
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