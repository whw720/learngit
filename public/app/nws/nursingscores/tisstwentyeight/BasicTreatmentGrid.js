/**
 * 功能说明: tiss28评分 grid
 * @author:　zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.BasicTreatmentGrid', {
	extend: 'Ext.grid.Panel',
	requires: [
		//'com.dfsoft.icu.nws.bedmanagement.AlertStore'
	],
    columnLines:true,
	initComponent: function() {
        var me = this;
        var myData = [
            [false,'标准监测：每小时生命体征、液体平衡的常规记录和计算。',5,""],
            [false,'实验室检查：生化和微生物检查。',1,""],
            [false,'单一药物：静脉、肌内、皮下注射和（或）口服（例如经胃管给药）。',2,""],
            [false,'静脉使用多种药物：单次静脉或持续输注1种以上药物（*3与4只能选择一项）。',3,""],
            [false,'常规更换敷料：压疮的护理和预防，每日更换一次敷料。',1,""],
            [false,'频繁更换敷料：（每个护理班至少更换一次）和（或）大面积伤口护理。',1,""],
            [false,'引流管的护理：除胃管以外的所有导管的护理。',3,""],
            [false,'<span style="float:right;">得分合计：</span>',16,""]
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
         //  autoSync: true,
                fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'},
                {name: 'SCORE'}
            ],
            data: myData//,
        });
		Ext.apply(me, {
			border: true,
            store: store,
            forceFit: true,
            enableColumnHide:false,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width:40,
                align: 'center'
            },
                {
                    xtype: 'checkcolumn',
                    text: '选择',
                    sortable: false,
                    dataIndex: 'SEL',
                    width:6,
                    listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){

//                        var count = aa.ownerCt.grid.getStore().getAt(6).get("SCORE");
//                        alert(count.get('SEL'));
                     // alert(123);
                       var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                        if (rowIndex == 2) { // 选择第三项，第四项取消
                            var rn = aa.ownerCt.grid.getStore().getAt(3);
                            rn.set("SEL", false);
                            rn.commit();
                        }
                        if (rowIndex == 3) { // 选择第三项，第四项取消
                            var rn = aa.ownerCt.grid.getStore().getAt(2);
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
                text: '<div style="text-align:center">项目</div>',
                header:'<div style="text-align:center">项目</div>',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'//,
             //   summaryType: 'count'
//                    renderer:function(val,meta,records,rowIndex, columnIndex, store){
//                        if(rowIndex ==7){
//                          return '<span style="float:right;">得分合计：</span>';
//                        }else{
//                            return val;
//                        }
//                    }

            },{
                text: '分值',
                dataIndex: 'SCORES',
                width:10,
                sortable: false,
 //               summaryType: 'sum',
                align: 'center'
            }, {
                text: '得分',
                dataIndex: 'SCORE',
                width:10,
                sortable: false,
               // summaryType: 'sum',
                align: 'center'

            }]
		});
		me.callParent();
	}
});