/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.CardiovascularSupportGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'单一血管活性药物：使用任何血管活性药物？',3,''],
            [false,'多种血管活性药物：使用一种以上的血管活性药物，不论种类和剂量？',4,''],
            [false,'静脉补充丢失的大量液体：输液量>3L/（m2.d），不论液体种类和剂量？',4,''],
            [false,'放置外周静脉导管？',5,''],
            [false,'左心房监测：放置肺动脉漂浮导管，不论是否测量心排出量？',8,''],
            [false,'中心静脉置管？',2 ,''],
            [false,'在过去24小时内进行过心跳骤停后心肺复苏：（单次心前区叩外）（*1与2只能 选一项）？',3,''],
            [false,'<span style="float:right;">得分合计：</span>',29,'']
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'},
                {name: 'SCORE'}
            ],
            data: myData
        });
		var me = this;
		Ext.apply(me, {
			border: true,
            store: store,
            forceFit: true,
            enableColumnHide:false,
            autoExpandColumn:3,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width:40,
                align: 'center'
            },{
                xtype: 'checkcolumn',
                text: '选择',
                sortable: false,
                dataIndex: 'SEL',
                width:6,
                listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
                    var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                    if (rowIndex == 0) { // 选择第三项，第四项取消
                        var rn = aa.ownerCt.grid.getStore().getAt(1);
                        rn.set("SEL", false);
                        rn.commit();
                    }
                    if (rowIndex == 1) { // 选择第三项，第四项取消
                        var rn = aa.ownerCt.grid.getStore().getAt(0);
                        rn.set("SEL", false);
                        rn.commit();
                    }

                    re.commit();
                    var countValue = 0;
                    for(var i = 0;i<7;i++){
                        var count = aa.ownerCt.grid.getStore().getAt(i).get("SCORE");
                        countValue = countValue + Number(count);
                    }
                    aa.ownerCt.grid.getStore().getAt(7).set('SCORE',countValue);
                    aa.ownerCt.grid.getStore().getAt(7).commit();
                }},
                renderer:function(val,meta,records,rowIndex, columnIndex, store){
                    if(rowIndex ==7){
                        return "";
                    }else{
                        if(val){
                            records.set('SCORE',records.get('SCORES'));
                        }else{
                            records.set('SCORE','');
                        }
                        return (new Ext.grid.column.CheckColumn()).renderer(val);
                    }
                }
            },

                {
                text: '项目',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '分值',
                dataIndex: 'SCORES',
                width:10,
                sortable: false,
                align: 'center'
            }, {
                text: '得分',
                dataIndex: 'SCORE',
                width:10,
                sortable: false,
                align: 'center'
            }]
		});
		me.callParent();
	}

});