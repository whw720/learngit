/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.timiriskst.TimiriskStItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,

	initComponent: function() {
        var me = this;
        var nwsData = [
            [false,'年龄 :<input id="' + me.mod + 'timage1" type="checkbox" value="false" onClick="Ext.getCmp(\''+me.mod+'timiriskstform\').gettimirisage(this);" /><65<input id="' + me.mod + 'timage2" type="checkbox" value="false" onClick="Ext.getCmp(\'' + me.mod + 'timiriskstform\').gettimirisage(this);" />65~74 <input id="' + me.mod + 'timage3" type="checkbox" value="false" onClick="Ext.getCmp(\''+me.mod+'timiriskstform\').gettimirisage(this);"/>≥75？',0],
            [false,'DM or HTN or 心绞痛？',1],
            [false,'SBP < 100 mmHg？',3],
            [false,'HR > 100 bpm？',2],
            [false,'Killip Class II-IV？',2],
            [false,'体重 < 67 kg？',1],
            [false,'前壁 ST 抬高 or LBBB？',1],
            [false,'发病至治疗时间 > 4 hrs？',1],
            [false,'血管活性药物使用 > = 1 h？',1],
            [false,'PaO2 < 60 mmHg？',1],
            [false,'凝血酶原时间 > 正常值 3 sec？',1]
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'}
            ],
            data: nwsData
        });

		Ext.apply(me, {
			border: true,
            store: store,
            forceFit: true,
            enableColumnHide:false,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                align: 'center'
            },{
                xtype: 'checkcolumn',
                text: '选择',
                sortable: false,
                dataIndex: 'SEL',
                width:20,
                listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
                    var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
                    re.commit();
                }},
                renderer:function(data, cell, record, rowIndex,columnIndex, store){
                    if(rowIndex != 0){
                        return (new Ext.grid.column.CheckColumn()).renderer(data);
                    }
                }
            },{
                text: '项目',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '分值',
                dataIndex: 'SCORES',
                width:1,
                sortable: false,
                align: 'left',
                hidden:true
            }]
		});
		me.callParent();
	}

});