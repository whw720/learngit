/**
 * 医嘱管理中间页面
 * @author: whw
 * @date: 2014-3-4.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderCenter', {
    extend: 'Ext.tree.Panel',

    require:[
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderStore',
        'com.dfsoft.icu.dws.doctorordermanagement.PageTreeStore'
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            height:28,
            items: [ '已提取医嘱: ', '->', '执行状态: ', {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-black.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '未执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-red.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '开始执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-blue.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '完成执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-green.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '交班执行'
            }
            ]
        }
    ],
    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        var colors={0:'black',1:'red',2:'blue',3:'green'};
        me.store = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderStore',{
        });

        me.col = [
            {
                text: '序号',
                //xtype: 'rownumberer',
                dataIndex:'NUM',
                width: 38,
                sortable: false,
                cls: 'dws-doctor-order-column',
                align: 'center'
            }, {
                text: '选择',
                xtype:'checkcolumn',
                width: 38,
                cls:'dws-doctor-order-column',
                dataIndex:'IS_SELECTED',
                sortable: false,
                renderer:function(value,metaData ,record ) {
                    if (record.data.PARENT_ID==null){
                        return (new Ext.grid.column.CheckColumn).renderer(value);
                    } else{
                        return '';
                    }
                }
            }, {
                text: '进度',
                width: 38,
                cls:'dws-doctor-order-column',
                tdCls:'dws-doctor-order-td',
                align: 'center',
                //sortable: false,
                dataIndex: 'COMPLETED_PROCESS',
                renderer:function(value,metaData ,record ){
                    if(record.data.PARENT_ID==null){
                        var str='完成进度'+((value>=30?30:value)/0.3).toFixed(2)+"%";
                        if(value>30){
                            value=30;
                            //return '<div class="dws-archives-process-red" title="'+str+'" ><div class="dws-archives-process-inner-red" style="width: 30px;"></div></div>';
                        }
                        return '<div class="dws-archives-process-green" title="'+str+'"><div class="dws-archives-process-inner-green" style="width: '+value+'px;"></div></div>';
                    }else{
                        return '';
                    }
                }
            },
            {
                text: '医嘱内容',
                xtype: 'treecolumn',
                dataIndex: 'CONTENT',
                align: 'left',
                minWidth: 200,
                maxWidth: 395,
                flex: 1,
                autoSizeColumn: true,
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                renderer: function (val, meta, record) {
                    var addLine=false;
                    var beginDate=me.parent.getForm().findField('doctor-order-start-time').getValue().Format('yyyy-MM-dd');
                    if(record.data.PARENT_ID==null){
                        if(record.get('COMPLETION_TIME')!=null&&record.get('TYPE')=='L'){
                            var str=new Date(record.get('COMPLETION_TIME')).Format('yyyy-MM-dd');
                            if(str==beginDate){
                                addLine=true;
                            }
                        }
                        var text = '<span class="dws-content_a"  title="查看详细医嘱" style="'+(addLine?'text-decoration:line-through':'')+';color:'+colors[record.get('EXECUTION_STATE')]+'">' + val+'</span>' ;
                        return text;
                    }else{
                        if(record.parentNode.get('COMPLETION_TIME')!=null&&record.get('TYPE')=='L'){
                            var str=new Date(record.parentNode.get('COMPLETION_TIME')).Format('yyyy-MM-dd');
                            if(str==beginDate){
                                addLine=true;
                            }
                        }
                        var text = '<span class="dws-content_a"  title="查看详细医嘱" style="'+(addLine?'text-decoration:line-through':'')+';color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + val+'</span>' ;
                        return text;
                    }
                }
            },
            {
                text: '提取日期',
                width: 75,
                dataIndex: 'EXTRACT_TIME',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                align: 'center',
                renderer: function (value, meta, record) {
                    if(record.data.PARENT_ID==null){
                        if(value.indexOf('0000')>-1){
                            return '';
                        }
                        if(value==null||value==''){
                            return '';
                        }
                        var dates=String(Ext.Date.format(new Date(value), 'm-d H:i'));
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' +dates+ '</span>';
                    }else{
                        if(value.indexOf('0000')>-1){
                            return '';
                        }
                        if(value==null||value==''){
                            return '';
                        }
                        var dates=String(Ext.Date.format(new Date(value), 'm-d H:i'));
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' +dates+ '</span>';
                    }
                }
            },
            {
                text: '患者姓名',
                dataIndex: 'NAME',
                width: 70,
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                renderer: function (val, meta, record) {
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + val + '</span>';
                    }else{
                        return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + val + '</span>';
                    }

                }
            },
            {
                text: '医嘱类型',
                dataIndex: 'TYPE',
                style: {
                    'text-align': 'center'
                },
                width: 70,
                align: 'center',
                tdCls: 'dws-doctor-order-td',
                renderer: function (value, meta, record) {
                    if(record.data.PARENT_ID==null){
                        if (value == 'L') {
                            return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">长期医嘱</span>';
                        } else {
                            return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">临时医嘱</span>';
                        }
                    }else{
                        if (value == 'L') {
                            return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">长期医嘱</span>';
                        } else {
                            return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">临时医嘱</span>';
                        }
                    }
                }
            },
            {
                text: '总剂量',
                dataIndex: 'DOSAGE_ALL',
                width: 45,
                align: 'right',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                renderer: function (value, metaData, record) {
                    if (record.data.PARENT_ID == null) {
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + value + '</span>';
                    } else {
                        return '';
                    }
                }
            },
            {
                text: '完成量',
                dataIndex: 'DOSAGE_COMPLETED',
                width: 45,
                align: 'right',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                renderer: function (value, metaData, record) {
                    if (record.data.PARENT_ID == null) {
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + (value == null ? '' : value) + '</span>';
                    } else {
                        return '';
                    }
                }
            },
            {
                text: '单位',
                dataIndex: 'UNIT_CODE',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                width: 38,
                renderer: function (val, meta, record) {
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }else{
                        return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }
                }
            },
            {
                text: '途径',
                dataIndex: 'ROUTE',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                width: 70,
                renderer: function (val, meta, record) {
                    if (record.data.PARENT_ID == null) {
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + (val == null ? '' : val) + '</span>';
                    } else {
                        return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + (val == null ? '' : val) + '</span>';
                    }
                }
            },
            {
                text: '频次',
                dataIndex: 'FREQUENCY_NAME',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                width: 50,
                renderer: function (val, meta, record) {
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }else{
                        return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }
                }
            },
            {
                text: '开嘱医师',
                dataIndex: 'DOCTOR',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                width: 70,
                renderer: function (val, meta, record) {
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }else{
                        return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + (val==null?'':val) + '</span>';
                    }
                }
            },
            {
                text: '开嘱时间',
                dataIndex: 'COLLECT_TIME',
                cls: 'dws-doctor-order-column',
                tdCls: 'dws-doctor-order-td',
                width: 60,
                align: 'center',
                renderer: function (val, meta, record) {
                    if(record.data.PARENT_ID==null){
                        if(val!=''){
                            return '<span style="color:' + colors[record.get('EXECUTION_STATE')] + '">' + Ext.Date.format(new Date(val), 'm-d') + '</span>';
                        }else{
                            return '';
                        }
                    }else{
                        if(val!=''){
                            return '<span style="color:' + colors[record.parentNode.get('EXECUTION_STATE')] + '">' + Ext.Date.format(new Date(val), 'm-d') + '</span>';
                        }else{
                            return '';
                        }
                    }
                }
            }
        ];

        Ext.apply(me, {
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            columnLines: true,
            rowLines: true,
            viewConfig: {
                stripeRows: true
            },
            padding:0,
            border:false,
            autoHeight:true,
            loadMask:false,
            store: me.store,
            defaultAlign:'left',
            columns: me.col,
            animate:false,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayMsg: '共{2}条',
                displayInfo: true,
                emptyMsg: '无数据',
                style: 'border-top: 1px solid #157fcc !important'
            }),
            listeners:{
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var btn = e.getTarget('.dws-content_a');
                    if(btn){
                        me.createDetail(record);
                    }
                    return;
                },
                itemclick:function(_this, record, item, index, e, eOpts ){
                    var rightStore=me.parent.rightOptions.getStore();
                    rightStore.on('beforeload', function (store, options) {
                        Ext.apply(store.proxy.extraParams, {
                            orderId:record.get('ID')
                        });
                    });
                    rightStore.load();
                }
            }
        });
        me.callParent();
    },
    //详细医嘱弹出提示框
    createDetail:function(record){
        var me=this;
        me.parent.dwsApp.showModalWindowDws(Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailWindow', {
            'record':record.data,
            parent:me.parent,
            modal:false
        }));
        /*var options1 = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailWindow', {
            'record':record.data,
            parent:me.parent,
            modal:false
        });
        options1.show();*/
    }
})