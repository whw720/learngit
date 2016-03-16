/**
 * 回收站
 * @author:whw
 * date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorRecyclePanel', {
    extend: 'Ext.tree.Panel',
    require:[
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderStore'
    ],
    padding: '5 5 5 5',
    border:1,
    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();

        var store = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderStore');
        store.on('beforeload', function (store, options) {
            Ext.apply(store.proxy.extraParams, {
                type:'recycle',
                userId:userInfo.userId,
                valid:0
            });
        });
        Ext.apply(me, {
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            columnLines: true,
            rowLines: true,
            store: store,
            style: { // defaults are applied to items, not the container
                'text-align': 'left'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: store,
                displayMsg: '共{2}条',
                displayInfo: true,
                emptyMsg: '无数据',
                style: 'border-top: 1px solid #157fcc !important'
            }),
            columns: [{
                text: '序号',
                //xtype:'rownumberer',
                dataIndex:'NUM',
                width:38,
                sortable: false,
                cls:'dws-doctor-order-column',
                align:'center'
            }, {
                text: '选择',
                xtype:'checkcolumn',
                width: 38,
                cls:'dws-doctor-order-column',
                dataIndex:'IS_SELECTED',
                sortable: false,
                renderer:function(value,metaData ,record ) {
                    if (record.get('PARENT_ID')==null||record.get('PARENT_ID')=='null'){
                        return (new Ext.grid.column.CheckColumn).renderer(value);
                    }else{
                        return '';
                    }
                }
            },
                {
                    text: '医嘱内容',
                    xtype: 'treecolumn',
                    dataIndex: 'SHORT_NAME',
                    align: 'left',
                    width: 140,
                    style:{
                        'text-align':'center'
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
                }, {
                    text: '医嘱类型',
                    dataIndex: 'TYPE',
                    align: 'center',
                    style:{
                        'text-align':'center'
                    },
                    width: 70,
                    sortable: false,
                    renderer	: 	function(value){
                        if(value=='L'){
                            return '长期医嘱';
                        }else{
                            return '临时医嘱';
                        }
                    }
                }, {
                    text: '剂量',
                    dataIndex: 'DOSAGE',
                    tdCls:'dws-doctor-order-td',
                    cls:'dws-doctor-order-column',
                    align:'right',
                    width: 38,
                    sortable: false
                }, {
                    text: '单位',
                    dataIndex: 'UNIT_CODE',
                    tdCls:'dws-doctor-order-td',
                    cls:'dws-doctor-order-column',
                    width: 38,
                    sortable: false
                }, {
                    text: '途径',
                    dataIndex: 'ROUTE',
                    style:{
                        'text-align':'center'
                    },
                    align:'left',
                    width: 90,
                    sortable: false
                }, {
                    text: '提取日期',
                    dataIndex: 'COLLECT_TIME',
                    cls:'dws-doctor-order-column',
                    tdCls:'dws-doctor-order-td',
                    style:{
                        'text-align':'center'
                    },
                    align: 'center',
                    width: 75,
                    renderer	: 	function(value){
                        return Ext.Date.format(new Date(value), 'm-d H:i')
                    },
                    sortable: false
                }, {
                    text: '频次',
                    dataIndex: 'FREQUENCY_NAME',
                    tdCls:'dws-doctor-order-td',
                    style:{
                        'text-align':'center'
                    },
                    width: 65,
                    sortable: false
                }]
        });
        me.callParent();
    }
});