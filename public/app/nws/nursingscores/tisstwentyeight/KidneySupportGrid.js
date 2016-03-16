/**
 * 功能说明: tiss28评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.KidneySupportGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var myData = [
            [false,'血液滤过 ，血液透析？',3,''],
            [false,'定量测定尿量（经导尿管测量）？',2,''],
            [false,'积极利尿【例如呋塞米>0.5mg/（kg.d）治疗液体超负荷】？',3,''],
            [false,'<span style="float:right;">得分合计：</span>',8,""]
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
            autoExpandColumn:3,
            enableColumnHide:false,
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
                    for(var i = 0;i<3;i++){
                        var count = aa.ownerCt.grid.getStore().getAt(i).get("SCORE");
                        countValue = countValue + Number(count);
                    }
                    aa.ownerCt.grid.getStore().getAt(3).set('SCORE',countValue);
                    aa.ownerCt.grid.getStore().getAt(3).commit();
                }},
                renderer:function(val,meta,records,rowIndex, columnIndex, store){
                    if(rowIndex ==3){
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
                forceFit:true,
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