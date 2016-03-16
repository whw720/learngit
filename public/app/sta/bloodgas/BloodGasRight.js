/**
 * 血气分析Panel
 * Created by whw on 14-5-21.
 */
Ext.define('com.dfsoft.icu.sta.bloodgas.BloodGasRight', {
    extend: 'Ext.grid.Panel',

    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['id', 'record_date', 'SEL', 'record_time', 'care_value', 'name', 'code', 'normal_range',
                'associate_id', 'alias', 'UNIT'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/bloodgas/query-blood',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide: false,
            store: me.store,
            columns: [

                { header: '项目代号',
                    dataIndex: 'alias',
                    width: 60,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left'
                },
                { header: '项目名称',
                    dataIndex: 'name',
                    width: 100,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left'
                },

                { header: '检验结果',
                    dataIndex: 'care_value',
                    width: 60,
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right'
                },
                { header: '参考值',
                    dataIndex: 'normal_range',
                    width: 60,
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right'
                },
                { header: '单位',
                    dataIndex: 'UNIT',
                    width: 60,
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right'
                }
            ]
        });
        me.callParent();
    }
});
