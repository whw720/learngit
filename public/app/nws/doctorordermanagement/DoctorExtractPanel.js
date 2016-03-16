/**
 * 提取医嘱
 * @author:whw
 * date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorExtractPanel', {
    extend: 'Ext.tree.Panel',
    require: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderStore'
    ],
    padding: '5 5 5 5',
    border: 1,
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderStore');
        Ext.apply(me, {
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            columnLines: true,
            rowLines: true,
            store: me.store,
            defaultAlign:'left',
            columns: [
                {
                    text: '序号',
                    xtype: 'rownumberer',
                    width: 38,
                    cls:'doctor-order-column',
                    align: 'center',
                    dataIndex: 'sortNumber'
                },
                {
                    text: '选择',
                    xtype: 'checkcolumn',
                    width: 38,
                    cls:'doctor-order-column',
                    dataIndex: 'select-order',
                    sortable: false,
                    renderer: function (value, metaData, record) {
                        if (record.get('PARENT_ID') == null || record.get('PARENT_ID') == 'null') {
                            return (new Ext.grid.column.CheckColumn).renderer(value);
                        } else {
                            return '';
                        }
                    }
                },
                {
                    text: '医嘱内容',
                    width: 200,
                    xtype: 'treecolumn',
                    dataIndex: 'SHORT_NAME',
                    style: {
                        'text-align': 'center'
                    },
                    sortable: false
                },
                {
                    text: '姓名',
                    dataIndex: 'NAME',
                    width: 100,
                    style: {
                        'text-align': 'center'
                    },
                    sortable: false
                },
                {
                    text: '医嘱类型',
                    dataIndex: 'TYPE',
                    style: {
                        'text-align': 'center'
                    },
                    width: 70,
                    align: 'center',
                    tdCls:'doctor-order-td',
                    sortable: false,
                    renderer: function (value) {
                        if (value == 'L') {
                            return '长期医嘱';
                        } else {
                            return '短期医嘱';
                        }
                    }
                },
                {
                    text: '提取日期',
                    dataIndex: 'COLLECT_TIME',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'center',
                    tdCls:'doctor-order-td',
                    width: 80,
                    sortable: false,
                    renderer: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d')
                    }
                },
                {
                    text: '剂量',
                    dataIndex: 'DOSAGE',
                    width: 38,
                    align: 'right',
                    cls:'doctor-order-column',
                    tdCls:'doctor-order-td',
                    sortable: false
                },
                {
                    text: '单位',
                    dataIndex: 'UNIT_CODE',
                    cls:'doctor-order-column',
                    tdCls:'doctor-order-td',
                    width: 38,
                    sortable: false
                },
                {
                    text: '途径',
                    dataIndex: 'ROUTE',
                    style: {
                        'text-align': 'center'
                    },
                    tdCls:'doctor-order-td',
                    width: 90,
                    sortable: false
                },
                {
                    text: '频次',
                    dataIndex: 'FREQUENCY_NAME',
                    style: {
                        'text-align': 'center'
                    },
                    tdCls:'doctor-order-td',
                    width: 65,
                    sortable: false
                },
                {
                    text: '执行日期',
                    dataIndex: 'EXECUTION_TIME',
                    tdCls:'doctor-order-td',
                    style: {
                        'text-align': 'center'
                    },
                    width: 110,
                    align: 'center',
                    renderer: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                    },
                    sortable: false
                },
                {
                    text: '结束日期',
                    dataIndex: 'COMPLETION_TIME',
                    tdCls:'doctor-order-td',
                    style: {
                        'text-align': 'center'
                    },
                    width: 110,
                    align: 'center',
                    renderer: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                    },
                    sortable: false
                }
            ]
        });
        me.callParent();
    }
});