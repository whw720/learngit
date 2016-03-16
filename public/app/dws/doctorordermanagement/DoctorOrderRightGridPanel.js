/**
 * 通讯状态GRID页面
 * @author:whw
 * @date:2014-3-24.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderRightGridPanel', {
    extend: 'Ext.grid.Panel',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [ '医嘱执行情况: '
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        me.myStore = Ext.create('Ext.data.Store', {
            fields: ['ID', 'ORDERS_ID', 'EXECUTION_TIME', 'COMPLETION_TIME', 'DOSAGE', 'EXECUTOR'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/dws/doctorordermanagement/query_log',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });
        Ext.QuickTips.init();
        Ext.apply(me, {
            columnLines: true,
            border: false,
            store: me.myStore,
            columns: [
                { header: '开始时间',
                    dataIndex: 'EXECUTION_TIME',
                    width:80,
                    align:'center',
                    cls: 'dws-doctor-order-column',
                    tdCls: 'dws-doctor-order-td-right',
                    renderer: function (value) {
                        return Ext.Date.format(new Date(value), 'm-d H:i')
                    }
                },
                { header: '完成时间',
                    dataIndex: 'COMPLETION_TIME',
                    width:80,
                    align:'center',
                    cls: 'dws-doctor-order-column',
                    tdCls: 'dws-doctor-order-td-right',
                    renderer: function (value) {
                        return Ext.Date.format(new Date(value), 'm-d H:i')
                    }
                },
                { header: '执行量',
                    width:50,
                    cls: 'dws-doctor-order-column',
                    tdCls: 'dws-doctor-order-td-right',
                    align:'right',
                    dataIndex: 'DOSAGE' },
                { header: '执行人',
                    width:70,
                    cls: 'dws-doctor-order-column',
                    tdCls: 'dws-doctor-order-td-right',
                    dataIndex: 'EXECUTOR'
                }
            ]
        });
        me.callParent();
    }
});
