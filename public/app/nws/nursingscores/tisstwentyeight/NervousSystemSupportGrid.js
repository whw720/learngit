/**
 * 功能说明: tiss28评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.NervousSystemSupportGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'颅内压监测？',4,''],
            [false,'<span style="float:right;">得分合计：</span>',4,""]

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
            height: 120,
            store: store,
            enableColumnHide:false,
            forceFit: true,
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
                    re.commit();
                    var countValue = 0;
                    for(var i = 0;i<1;i++){
                        var count = aa.ownerCt.grid.getStore().getAt(i).get("SCORE");
                        countValue = countValue + Number(count);
                    }
                    aa.ownerCt.grid.getStore().getAt(1).set('SCORE',countValue);
                    aa.ownerCt.grid.getStore().getAt(1).commit();
                }},
                renderer:function(val,meta,records,rowIndex, columnIndex, store){
                    if(rowIndex ==1){
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