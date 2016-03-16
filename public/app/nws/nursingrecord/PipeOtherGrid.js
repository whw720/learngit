/**
 * 静脉管道
 * Created by whw on 14-6-24.
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.PipeOtherGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pipeothergrid',

    requires: 'com.dfsoft.icu.nws.nursingrecord.PipelineStore',

    initComponent: function () {
        var me=this;
        var store = Ext.create('com.dfsoft.icu.nws.nursingrecord.PipelineStore', {
            pipeType: '静脉管'
        });
        var wStore = new Ext.data.Store({
            fields: ['item_value', 'display_name']

        });
        //[{NAME:'PICC'},{NAME:'外周1'},{NAME:'外周2'},{NAME:'外周3'},{NAME:'CVVH'}];
        var pipeStore=new Ext.data.SimpleStore({
            fields: ['item_value', 'display_name','HELPER_CODE'],
            data: [
                ['CVC1', 'CVC1','CVC1'],
                ['CVC2', 'CVC2','CVC2'],
                ['PICC', 'PICC','PICC'],

                ['外周1', '外周1','WZ1'],
                ['外周2', '外周2','WZ2'],
                ['外周3', '外周3','WZ3'],
                ['CVVH', 'CVVH','CVVH']
            ]
        });
        var wayColumn=[
            {
                text: '名称',
                width: 80,
                align: 'center',
                sortable: false,
                dataIndex: 'NAME',
                editor: {
                    xtype: 'combo',
                    editable: true,
                    maxLength: 20,
                    maxLengthText: '最长允许输入20个字符',
                    queryMode: 'local',
                    typeAhead: true,
                    valueField: 'item_value',
                    displayField: 'display_name',
                    store: pipeStore,
                    listeners : {
                        focus : function(_this){
                            _this.store.filterBy(function(record,id){
                                return true;
                            });
                        },
                        beforequery:function(e, eOpts ){
                            var combo = e.combo;
                            var value = e.query;
                            if(value!=''){
                                if(!e.forceAll){
                                    combo.store.filterBy(function(record,id){
                                        var text = record.get('display_name');
                                        var helpCode = record.get('HELPER_CODE');
                                        if(helpCode.length>0){
                                            return (text.indexOf(value.toUpperCase())==0)||(helpCode.indexOf(value.toUpperCase())==0);
                                        }
                                    });
                                }
                                value='';
                                combo.expand();
                                return false;
                            }else{
                                combo.store.filterBy(function(record,id){
                                    return true;
                                });
                                combo.expand();
                            }
                        }
                    }
                }
            },
            {
                text: '位置',
                width: 100,
                align: 'center',
                sortable: false,
                dataIndex: 'INTUBATION_WAY',
                editor: {
                    xtype: 'combobox',
                    editable: true,
                    maxLength:20,
                    maxLengthText:'最长允许输入20个字符',
                    queryMode: 'local',
                    typeAhead: true,
                    valueField: 'item_value',
                    displayField: 'display_name',
                    multiSelect: true,
                    store: wStore
                }
            },
            {
                text: '置管深度(CM)',
                width: 80,
                align: 'center',
                sortable: false,
                dataIndex: 'INTUBATION_DEPTH',
                editor: {
                    xtype: 'textfield',
                    maxLength:6,
                    maxLengthText:'最长允许输入6个字符'
                }
            },
            {
                text: '刻度(CM)',
                width: 70,
                align: 'center',
                sortable: false,
                dataIndex: 'GRADUATION',
                editor: {
                    xtype: 'textfield',
                    maxLength:10,
                    maxLengthText:'最长允许输入10个字符'
                }
            },
            {
                text: '置管时间',
                width: 121,
                align: 'center',
                sortable: false,
                dataIndex: 'INTUBATION_TIME',
                renderer: this.formatTime,
                editor: {
                    xtype: 'datetimefield',
                    editable:false,
                    format: 'Y-m-d H:i'
                }
            },
            {
                text: '更换时间',
                width: 121,
                align: 'center',
                sortable: false,
                dataIndex: 'CHANGE_TIME',
                hidden:true,
                renderer: this.formatTime,
                editor: {
                    xtype: 'datetimefield',
                    editable:false,
                    format: 'Y-m-d H:i'
                }
            },
            {
                text: '拔管时间',
                width: 121,
                align: 'center',
                sortable: false,
                dataIndex: 'EXTUBATION_TIME',
                renderer: this.formatTime,
                editor: {
                    xtype: 'datetimefield',
                    editable:false,
                    format: 'Y-m-d H:i'
                }
            },
            {
                text: '调整记录',
                width: 65,
                align: 'center',
                sortable: false,
                dataIndex: 'ADJUST_TIME',
                renderer: this.formatAdjust
            }
        ];
        Ext.apply(this, {
            region: 'center',
            border: true,
            margin: '0 0 10 0',
            columnLines: true,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'left',
                    items: [
                        {
                            xtype: 'button',
                            tooltip: '新增',
                            iconCls: 'add',
                            handler: function () {
                                var r = [
                                    {
                                        NAME: '',
                                        INTUBATION_WAY:'',
                                        INTUBATION_DEPTH:'',
                                        GRADUATION:'',
                                        INTUBATION_TIME: new Date(),
                                        CHANGE_TIME: null,
                                        EXTUBATION_TIME: null
                                    }
                                ];

                                var store = this.up('gridpanel').store;
                                store.add(r);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            iconCls: 'delete',
                            handler: function () {
                                var grid = this.up('gridpanel');
                                var records = grid.getSelectionModel().getSelection();
                                if (records.length <= 0) {
                                    Ext.MessageBox.alert('提示', '请选择需要删除的记录！');
                                    return;
                                }
                                grid.store.remove(records[0]);
                            }
                        }
                    ]
                }
            ],
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            selType: 'cellmodel',
            store: store,
            columns: wayColumn,
            listeners:{
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(modifiedFieldNames=='INTUBATION_WAY'){
                        column.setEditor({
                            xtype: 'combobox',
                            editable: true,
                            maxLength:20,
                            maxLengthText:'最长允许输入20个字符',
                            queryMode: 'local',
                            typeAhead: true,
                            valueField: 'item_value',
                            displayField: 'display_name',
                            multiSelect: true,
                            store: wStore
                        });
                    }else if(modifiedFieldNames=='NAME'){
                        column.setEditor({
                            xtype: 'combo',
                            editable: true,
                            maxLength: 20,
                            maxLengthText: '最长允许输入20个字符',
                            queryMode: 'local',
                            typeAhead: true,
                            valueField: 'item_value',
                            displayField: 'display_name',
                            store: pipeStore,
                            listeners : {
                                focus : function(_this){
                                    _this.store.filterBy(function(record,id){
                                        return true;
                                    });
                                },
                                beforequery:function(e, eOpts ){
                                    var combo = e.combo;
                                    var value = e.query;
                                    if(value!=''){
                                        if(!e.forceAll){
                                            combo.store.filterBy(function(record,id){
                                                var text = record.get('display_name');
                                                var helpCode = record.get('HELPER_CODE');
                                                if(helpCode.length>0){
                                                    return (text.indexOf(value.toUpperCase())==0)||(helpCode.indexOf(value.toUpperCase())==0);
                                                }
                                            });
                                        }
                                        value='';
                                        combo.expand();
                                        return false;
                                    }else{
                                        combo.store.filterBy(function(record,id){
                                            return true;
                                        });
                                        combo.expand();
                                    }
                                }
                            }
                        });
                    }else if(modifiedFieldNames=='INTUBATION_DEPTH'){
                        column.setEditor({
                            xtype: 'textfield',
                            maxLength:6,
                            maxLengthText:'最长允许输入6个字符'
                        });
                    }else if(modifiedFieldNames=='GRADUATION'){
                        column.setEditor({
                            xtype: 'textfield',
                            maxLength:10,
                            maxLengthText:'最长允许输入10个字符'
                        });
                    }else if(modifiedFieldNames=='INTUBATION_TIME'){
                        column.setEditor({
                            xtype: 'datetimefield',
                            editable:false,
                            format: 'Y-m-d H:i'
                        })
                    }else if(modifiedFieldNames=='CHANGE_TIME'){
                        column.setEditor({
                            xtype: 'datetimefield',
                            editable:false,
                            format: 'Y-m-d H:i'
                        })
                    }else if(modifiedFieldNames=='EXTUBATION_TIME'){
                        column.setEditor({
                            xtype: 'datetimefield',
                            editable:false,
                            format: 'Y-m-d H:i'
                        })
                    }else if(modifiedFieldNames=='ADJUST_TIME'){

                        me.showAddAdjustWin(record.get('ID'),record.get('NAME'));
                    }

                    if(record.get('NAME').indexOf('外周')==0){
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            column.getEditor().multiSelect=false;
                            column.getEditor().store.loadData([['LH','左上肢'],['RH','右上肢'],['LF','左下肢'],['RF','右下肢']]);
                        }
                    }else{
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            //e.column.getEditor().store.reload();
                            column.getEditor().multiSelect=true;
                            column.getEditor().store.loadData([["L","左"],["R","右"],["IJV","颈内静脉"],["FV","股静脉"],["SCV","锁骨下静脉"]]);

                        }
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    formatTime: function (value) {
        return value ? Ext.Date.format(new Date(value), 'Y-m-d H:i') : '';
    },
    formatAdjust: function(){
        var title = "设置调整记录";
        return '<a href="#">' +
            '<img src="/app/nws/nursingrecord/images/dot.png" ' +
            'title='+title+' style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
    },
    showAddAdjustWin:function(id,name){
        var me=this;
        if(id==null||id==""){
            Ext.MessageBox.alert('提示', '请先添加管道'+name+',然后再添加调整记录！');
            return;
        }
        var winEdit = Ext.create('com.dfsoft.icu.nws.nursingrecord.pipeAdjustWindow', {
            pipeName:name,
            CATHETER_ID:id
        });

        me.nwsApp.showModalWindow(winEdit);
    }
});
