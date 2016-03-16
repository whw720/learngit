/**
 * 定义公司客户列表
 *
 * @author chm
 * @version 2013-9-27
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.PipelineGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pipelinegrid',
    requires: 'com.dfsoft.icu.nws.nursingrecord.PipelineStore',
    initComponent: function () {
        var me=this;
        var wStore=new Ext.data.SimpleStore({
            fields: ['item_value', 'display_name','HELPER_CODE'],
            data: [
                ['心包引流管', '心包引流管','XBYLG'],
                ['纵膈引流管', '纵膈引流管','ZGYLG'],
                ['胸腔引流管', '胸腔引流管','XQYLG'],

                ['皮下引流管', '皮下引流管','PXYLG'],
                ['左脑室引流管', '左脑室引流管','XNSYLG'],
                ['右脑室引流管', '右脑室引流管','YNSYLG'],
                ['血肿腔引流管', '血肿腔引流管','XZQYLG'],
                ['硬膜外引流管', '硬膜外引流管','YMWYLG'],
                ['硬膜下引流管', '硬膜下引流管','YMXYLG'],

                ['颈部皮下引流管', '颈部皮下引流管','JBPXYLG'],
                ['脾窝引流管', '脾窝引流管','PWYLG'],
                ['T管引流管', 'T管引流管','TGYLG'],
                ['肾窝引流管', '肾窝引流管','SWYLG'],
                ['胆囊窝引流管', '胆囊窝引流管','DNWYLG'],
                ['盆腔引流管', '盆腔引流管','PQYLG'],

                ['腹腔引流管', '腹腔引流管','FQYLG'],
                ['VSD引流管', 'VSD引流管','VCDYLG'],
                ['腿部切口引流管', '腿部切口引流管','TBQKYLG'],
                ['颈部切口引流管', '颈部切口引流管','JBQKYLG']
            ]
        });
        Ext.apply(me, {
            //name: 'PipelineGrid',
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

            store: Ext.create('com.dfsoft.icu.nws.nursingrecord.PipelineStore', {
                type: '引流管'
            }),

            columns: [
                {
                    text: '名称',
                    width: 125,
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
                        store: wStore,
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
                    width: 70,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'INTUBATION_WAY',
                    editor:{
                        xtype:'textfield',
                        maxLength:10,
                        maxLengthText:'最长允许输入10个字符'
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
                    width: 122,
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
                    width: 122,
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
            ],
            listeners:{
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(modifiedFieldNames=='NAME'){
                        column.setEditor({
                            xtype: 'combo',
                            editable: true,
                            maxLength: 20,
                            maxLengthText: '最长允许输入20个字符',
                            queryMode: 'local',
                            typeAhead: true,
                            valueField: 'item_value',
                            displayField: 'display_name',
                            store: wStore,
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
                    }else if(modifiedFieldNames=='INTUBATION_WAY'){
                        column.setEditor({
                            xtype:'textfield',
                            maxLength:10,
                            maxLengthText:'最长允许输入10个字符'
                        });
                    }else if(modifiedFieldNames=='INTUBATION_DEPTH'){
                        column.setEditor({
                            xtype:'textfield',
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
