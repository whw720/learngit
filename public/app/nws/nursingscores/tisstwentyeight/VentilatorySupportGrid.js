/**
 * 功能说明: 基础治疗 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.VentilatorySupportGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,
    GridSum:function(grid){
        alert(grid);
    var sum = 12;
//    grid.store.each(function(record){
//        sum += Number(record.data.money);
//    });
    var n = grid.getStore().getCount();// 获得总行数
       // alert(n);
        debugger;
    var p = new Ext.data.Record({
        ITEM: '总计:',
        SCORES:123
    });
    grid.store.insert(n, p);// 插入到最后一行
},
	initComponent: function() {
        var myData = [
            [false,'机械通气：任何形式的机械通气/辅助通气，无论是否使用PEEP或肌松药；加用PEEP的自主呼吸？',5,''],
            [false,'经气管插管自主呼吸：不应用PEEP；除机械通气外，任何形式的氧疗？',2,''],
            [false,'人工气道的护理：气管插管或气管切开的护理？',1,''],
            [false,'肺部理疗：刺激性肺量计、吸入疗法、气管内吸痰（*1与2只能选一项）？',1,''],
            [false,'<span style="float:right;">得分合计：</span>',9,'']
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
            }, {
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
                    for(var i = 0;i<4;i++){
                        var count = aa.ownerCt.grid.getStore().getAt(i).get("SCORE");
                        countValue = countValue + Number(count);
                    }
                    aa.ownerCt.grid.getStore().getAt(4).set('SCORE',countValue);
                    aa.ownerCt.grid.getStore().getAt(4).commit();
                }},
                renderer:function(val,meta,records,rowIndex, columnIndex, store){
                    if(rowIndex ==4){
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
            }, {
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