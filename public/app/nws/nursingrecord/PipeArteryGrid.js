
/**
 * 动脉管道
 * Created by whw on 14-6-24.
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.PipeArteryGrid',{
    extend 	: 'Ext.grid.Panel',
    alias	: 'widget.pipearterygrid',

    requires	: 'com.dfsoft.icu.nws.nursingrecord.PipelineStore',

    initComponent	: function(){
        var me=this;
        var store=Ext.create('com.dfsoft.icu.nws.nursingrecord.PipelineStore',{
            pipeType:'动脉管'
        });
        var wStore=new Ext.data.Store({
            fields: ['item_value', 'display_name']
        });//[{NAME:'动脉1'},{NAME:'动脉2'},{NAME:'PAC'},{NAME:'PICCO'},{NAME:'IABP'}];
        var pipeStore=new Ext.data.SimpleStore({
            fields: ['item_value', 'display_name','HELPER_CODE'],
            data: [
                ['动脉1', '动脉1','DM1'],
                ['动脉2', '动脉2','CVC2'],
                ['PAC', 'PAC','PAC'],

                ['PICCO', 'PICCO','PICCO'],
                ['IABP', 'IABP','IABP']
            ]
        });
        Ext.apply(this, {
            region 	: 'center',
            border	: true,
            margin  : '0 0 10 0',
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
            store	: store,
            columns: [{
                text     : '名称',
                width    : 80,
                align    : 'center',
                sortable : false,
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
            },{
                text     : '位置',
                width    : 70,
                align    : 'center',
                sortable : false,
                dataIndex: 'INTUBATION_WAY',
                editor   : {
                    xtype:'combo',
                    editable    : true,
                    maxLength:20,
                    maxLengthText:'最长允许输入20个字符',
                    queryMode: 'local',
                    typeAhead: true,
                    valueField  : 'item_value',
                    displayField: 'display_name',
                    store: wStore
                }
            },{
                text     : '置管深度(CM)',
                width    : 80,
                align    : 'center',
                sortable : false,
                dataIndex: 'INTUBATION_DEPTH',
                editor   : {
                    xtype:'textfield',
                    maxLength:6,
                    maxLengthText:'最长允许输入6个字符'
                }
            }, {
                text     : '置管时间',
                width    : 121,
                align    : 'center',
                sortable : false,
                dataIndex: 'INTUBATION_TIME',
                renderer : this.formatTime,
                editor: {
                    xtype  : 'datetimefield',
                    editable:false,
                    format : 'Y-m-d H:i'
                }
            }, {
                text     : '更换时间',
                width    : 121,
                align    : 'center',
                sortable : false,
                dataIndex: 'CHANGE_TIME',
                hidden:true,
                renderer : this.formatTime,
                editor: {
                    xtype  : 'datetimefield',
                    editable:false,
                    format : 'Y-m-d H:i'
                }
            }, {
                text     : '拔管时间',
                width    : 121,
                align    : 'center',
                sortable : false,
                dataIndex: 'EXTUBATION_TIME',
                renderer : this.formatTime,
                editor: {
                    xtype  : 'datetimefield',
                    editable:false,
                    format : 'Y-m-d H:i'
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
            ],
            listeners:{
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(modifiedFieldNames=='INTUBATION_WAY'){
                        column.setEditor({
                            xtype:'combo',
                            editable    : true,
                            maxLength:20,
                            maxLengthText:'最长允许输入20个字符',
                            queryMode: 'local',
                            typeAhead: true,
                            valueField  : 'item_value',
                            displayField: 'display_name',
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
                    if(record.get('NAME')=='IABP'){
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            column.getEditor().store.loadData([['FV','股动脉']]);
                        }
                    }else if(record.get('NAME')=='PICCO'){
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            column.getEditor().store.loadData([['SCV','锁骨下'],[' IJV',' 颈内'],['腹股沟','腹股沟']]);
                        }
                    }else if(record.get('NAME').indexOf('动脉')>-1){
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            column.getEditor().store.loadData([['LH','左手腕'],['RH','右手腕'],['FV','股动脉']]);
                        }
                    }else{
                        if(modifiedFieldNames=='INTUBATION_WAY'){
                            column.getEditor().store.loadData([['LH','左手'],['RH','右手'],['LF','左脚'],['RF','右脚']]);
                        }
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    formatTime : function (value){
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
