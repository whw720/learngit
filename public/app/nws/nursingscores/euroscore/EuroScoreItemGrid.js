/**
 * 功能说明: 基础治疗 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreItemGrid', {
	extend: 'Ext.grid.Panel',

    columnLines:true,
    border:true,
    enableColumnHide:false,
    dockedItems:[{
        xtype: 'toolbar',
        height: 35,
        items: ['->',
            {
                xtype: 'numberfield',
                name: 'age',
                columnWidth: 0.9,
                labelWidth: 32,
                fieldLabel: '年龄',
                margin: '0 0 0 5',
                minValue:0,
                decimalPrecision:1,
                maxValue:200
            },
            {
                xtype: 'label',
                columnWidth: 0.10,
                text: '岁',
                margin: '5 10 0 5'
            }
        ]
    }],
    columns: [{
        xtype: 'rownumberer',
        text: '序号',
        width: 50,
        align: 'center'
    },{
        xtype: 'checkcolumn',
        text: '选择',
        sortable: false,
        dataIndex: 'SEL',
        width:50,
        listeners:{'checkchange':function(aa, rowIndex, checked, eOpts){
            var re = aa.ownerCt.grid.getStore().getAt(rowIndex);
            re.commit();
        }}
    },{
        text: '项目',
        dataIndex: 'ITEM',
        width:269,
        sortable: false,
        align: 'left'

    }, {
        text: '分值',
        dataIndex: 'SCORES',
        width:0,
        sortable: false,
        align: 'left',
        hidden:true
    }, {
        text: '系数',
        dataIndex: 'COE',
        width:0,
        sortable: false,
        align: 'left',
        hidden:true
    }],
	initComponent: function() {
        var me = this;
//alert(me.mod);
          var myData =
            [
            [false,'女性吗？',1,0.3304052],
            [false,'急诊手术吗？',2,0.7127953],
            [false,'肌酐> 200 µmol/ L ？',2,0.6521653],
            [false,'左室射血分数L.V.E.F &nbsp;&nbsp;&nbsp;&nbsp;<select name="eurolvefsel" id="'+me.mod+'eurolvefsel" onchange="Ext.getCmp(\''+me.mod+'euroscoreform\').euroLvefSel(this)"><option>请选择...</option><option  value="3">&lt; 30%</option><option  value="1">30%-50%</option><option  value="0">&gt; 50%</option></select>',-1,0],
               // [false,'左室射血分数L.V.E.F &nbsp;&nbsp;&nbsp;&nbsp;' + zssx,-1,0],
           [false,'有慢性阻塞性肺疾患吗（C.O.P.D.）？',1,0.4931341],
            [false,'胸主动脉手术？',3,1.159787],
            [false,'有心脏外动脉疾病吗？',2,0.6558917],
            [false,'有神经学功能不全吗？',2,0.841626],
            [false,'有活动性心内膜炎吗？',3,1.101265],
            [false,'术前出现险情吗？',3,0.9058132],
            [false,'有不稳定性心绞痛吗？',2,0.5677075],
            [false,'在近3个月内发生心肌梗塞吗？',2,0.5460218],
            [false,'肺动脉收缩压>60 mmHg吗？',2,0.7676924],
            [false,'有心脏手术史吗？',3,1.002625],
            [false,'梗塞后室间隔破裂手术吗？',4,1.462009],
            [false,'心脏大手术[冠状动脉移植术除外]？',2,0.5420364]
        ];
        me.store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'SEL',type:'boolean'},
                {name: 'ITEM'},
                {name: 'SCORES',type: 'float'},
                {name: 'COE',type: 'float'}
            ],
            data:myData
        });
        me.callParent();
	}

});