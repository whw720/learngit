/**
 * 血气分析Panel
 * Created by whw on 14-5-21.
 */
Ext.define('com.dfsoft.icu.gas.BloodGasPanel', {
    extend: 'Ext.grid.Panel',
    region:'center',
    border:true,
    margin:'-1 0 -1 0',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype:'label',
                html:'<div style="line-height:24px;">分析结果</div>'
            }, '->']
    }],
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['ID', 'RECORDER_DATE', 'RECORD_TIME', 'CARE_VALUE', 'NAME','CODE','NORMAL_RANGE', 'EXAMINE_ID', 'ALIAS'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/gas/getExamineDetail',
                actionMethods:{read:'POST'},
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide:false,
            forceFit: true,
            store: me.store,
          /*  plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],*/
            columns: [
                { header: '检测代码',
                    dataIndex: 'CODE',
                  hidden:true},
                { header: '检验项目',
                    dataIndex: 'NAME',
                   // width: 130,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left' }, { header: '别名',
                    dataIndex: 'ALIAS',
                     width: 60,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left' },
                { header: '参考值',
                    dataIndex: 'NORMAL_RANGE',
                    fixed:true,
                    width: '98px',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right' },
                { header: '检验值',
                    dataIndex: 'CARE_VALUE',
                    fixed:true,
                    width: '75px',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right'
                }
            ],
            listeners: {
            }
        });
        me.callParent();
    }
});