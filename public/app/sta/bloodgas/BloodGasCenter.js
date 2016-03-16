/**
 * 医嘱管理中间页面
 * @author: whw
 * @date: 2014-3-4.
 */
Ext.define('com.dfsoft.icu.sta.bloodgas.BloodGasCenter', {
    extend: 'Ext.grid.Panel',

    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['ID','SAMPLING_TIME','SIMPLE_CODE', 'NAME', 'HOSPITAL_NUMBER', 'P_TYPE','GENDER',
                'AGE', 'BED_NUMBER', 'DEPT_NAME','SUBMIT_DOCTOR','SUBMIT_DATE','EXAMINE_DATE','CHECKER',
            'OPERATER','REPORT_TIME','SIMPLE_TYPE','REVIEWER','DESCRIPTION','DIAGNOSIS','FEE_TYPE','TYPE'],
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                url: webRoot + '/sta/bloodgas/queryBloodgas',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty:'totalCount'
                }
            },
            listeners: {
                beforeload: function (_store, opration, eOpts) {
                    var nowStr=new Date().Format("yyyy-MM-dd");
                    Ext.apply(_store.proxy.extraParams, {
                        beginDate: nowStr,
                        endDate: nowStr
                    });
                }
            },
            autoLoad: false
        });
        me.col = [
            {
                text: '检验日期',
                dataIndex:'SAMPLING_TIME',
                width:90,
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'center'
            },
            {
                text: '标本号',
                dataIndex:'SIMPLE_CODE',
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                width:70,
                align: 'left'
            },
            {
                text: '姓名',
                dataIndex:'NAME',
                width:80,
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'left'
            },
            {
                text: '病历号',
                dataIndex:'HOSPITAL_NUMBER',
                width:80,
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'right'
            },
            {
                text: '病人类型',
                dataIndex:'P_TYPE',
                width:40,
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'center'
            },
            {
                text: '性别',
                dataIndex:'GENDER',
                width:40,
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'center'
            },
            {
                text: '年龄',
                dataIndex:'AGE',
                width:40,
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                align: 'right'
            },
            {
                text: '科室',
                dataIndex:'DEPT_NAME',
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                width:60,
                align: 'left'
            },
            {
                text: '床号',
                dataIndex:'BED_NUMBER',
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                tdCls:'sta-blood-td',
                width:40,
                align: 'left'
            },
            {
                text: '送检医生',
                dataIndex:'SUBMIT_DOCTOR',
                width:80,
                sortable: false,
                style: {
                    'text-align': 'center'
                },
                tdCls:'sta-blood-td',
                align: 'center'
            },
            {
                text: '送检时间',
                dataIndex:'SUBMIT_DATE',
                tdCls:'sta-blood-td',
                align: 'center',
                sortable: false,
                renderer	: 	function(value){
                    if(value){
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                    }else{
                        return "";
                    }
                }
            },
            {
                text: '采样时间',
                dataIndex:'EXAMINE_DATE',
                tdCls:'sta-blood-td',
                align: 'center',
                sortable: false,
                renderer	: 	function(value){
                    if(value){
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                    }else{
                        return "";
                    }
                }
            },
            {
                text: '检验医师',
                dataIndex:'CHECKER',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            },
            {
                text: '报告日期',
                dataIndex:'REPORT_TIME',
                tdCls:'sta-blood-td',
                align: 'center',
                sortable: false,
                renderer	: 	function(value){

                    if(value){
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                    }else{
                        return "";
                    }
                }
            },
            {
                text: '标本',
                dataIndex:'SIMPLE_TYPE',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            },
            {
                text: '费别',
                dataIndex:'FEE_TYPE',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            },
            {
                text: '核对医师',
                dataIndex:'REVIEWER',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            },
            {
                text: '临床诊断',
                dataIndex:'DIAGNOSIS',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            },
            {
                text: '备注',
                dataIndex:'DESCRIPTION',
                tdCls:'sta-blood-td',
                width:60,
                sortable: false,
                align: 'center'
            }
        ];

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide:false,
            border:false,
            store: me.store,
            columns: me.col,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayMsg: '共{2}条',
                displayInfo: true,
                emptyMsg: '无数据',
                style: 'border-top: 1px solid #157fcc !important'
            }),
            listeners:{
                itemclick:function(_this, record, item, index, e, eOpts ){
                    var rightStore=me.parent.rightOptions.getStore();
                    rightStore.on('beforeload', function (store, options) {
                        Ext.apply(store.proxy.extraParams, {
                            pid:record.get('ID')
                        });
                    });
                    rightStore.load();
                }
            }
        });
        me.callParent();
    }
})