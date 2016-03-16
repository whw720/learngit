/**
 * 医嘱管理面板
 * @author:whw
 * @date:2014-3-21.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderScanPanel', {
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
        me.store.on('beforeload', function (store, options) {
            Ext.apply(store.proxy.extraParams, {
                type:'scan',
                extractDate : me.parent.colltime,
                barcode:null
            });
        });
        me.scanCol=[
            {
                text: '序号',
                //xtype: 'rownumberer',
                dataIndex: 'NUM',
                cls:'doctor-order-column',
                width: 38,
                align: 'center'
            },
            {
                text: '选择',
                xtype: 'checkcolumn',
                width: 38,
                cls:'doctor-order-column',
                dataIndex: 'IS_SELECTED',
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
                width: 360,
                xtype: 'treecolumn',
                dataIndex: 'CONTENT',
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
                text: '提取日期',
                dataIndex: 'COLLECT_TIME',
                style: {
                    'text-align': 'center'
                },
                tdCls:'doctor-order-td',
                width: 90,
                align: 'center',
                renderer: function (value) {
                    return Ext.Date.format(new Date(value), 'Y-m-d')
                },
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
            }
        ];
        Ext.apply(me, {
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            columnLines: true,
            rowLines: true,
            store: me.store,
            style: { // defaults are applied to items, not the container
                'text-align': 'left'
            },
            columns:me.scanCol
        });
        me.callParent();
    }
});
