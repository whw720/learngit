/**
 * 功能说明: tiss28评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.tisstwentyeight.SpecialInterventionsGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {

        var myData = [
            [false,'ICU内单一特殊干预：经鼻或口气管插管，放置起博器，心脏转复，内窥镜，过去24小时内急诊手术，胃灌洗。</br>对患者临床状况不产生直接影响的常规干预，如X线检查，超声检查，心电图，敷料，或置入静脉或动脉插管等不包括在内。',3,''],
            [false,'ICU内多种特殊干扰措施：上述项目中一种以上的干预措施？',5,''],
            [false,'ICU外的特殊干预措施：手术或诊断性操作（*1与2只能选择一项）？',5,''],
            [false,'<span style="float:right;">得分合计：</span>',13,'']
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
           // autoSync: true,
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
                width:6,
                listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
                    var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                    if (rowIndex == 0) { // 选择第三项，第四项取消
                        var rn = aa.ownerCt.grid.getStore().getAt(1);
                        rn.set("SEL", false);
                        rn.set('SCORE','');
                        rn.commit();
                    }
                    if (rowIndex == 1) { // 选择第三项，第四项取消
                        var rn = aa.ownerCt.grid.getStore().getAt(0);
                        //   alert(rowIndex);
                        rn.set("SEL", false);
                        rn.set('SCORE','');
                        rn.commit();
                    }

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
                   // alert(2);
                   if(rowIndex ==3){
                        return "";
                    }else{
                        if(val){
                            records.set('SCORE',records.get('SCORES'));
                            //records.commit();
                        }else{
                            records.set('SCORE','');
                            //records.commit();
                        }
                        return (new Ext.grid.column.CheckColumn()).renderer(val);
                    }
                }
            },{
                text: '<div style="text-align:center">项目</div>',
                dataIndex: 'ITEM',
                sortable: false,
                style:'white-space:normal;line-height:20px;',
                align: 'left'//,
//                renderer: function (value, meta, record) {
//                    var max = 15;
//                    meta.tdAttr = 'data-qtip="' + value + '"';
//                    return value.length < max ? value : value.substring(0, max - 3) + '...';
//                }
//                renderer: function(value, meta, record) {
//                    meta.style ="white-space:normal;";
//                    return value;
//                }
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