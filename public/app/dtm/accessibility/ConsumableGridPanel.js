/**
 * Created by dfsoft on 14-3-29.
 */

Ext.define('com.dfsoft.icu.dtm.accessibility.ConsumableGridPanel', {
    extend: 'Ext.grid.Panel',
    id: 'accessibility-consumable-grid',
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        Ext.define('ConsumableModel',{
            extend : 'Ext.data.Model',
            fields: ['ID', 'SCHEDULING_TYPE', 'USE_DATE','CONSUMABLES_CODE', 'AMOUNT', 'NAME']
        });
        me.myStore = Ext.create('Ext.data.Store', {
            model:'ConsumableModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dtm/accessibility/query_consumable',
                actionMethods: { read: 'POST' },
                extraParams:{
                    useDate :Ext.Date.format(new Date(),'Y-m-d'),
                    schedul:'be0df177abf011e396e800271396a820'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        Ext.apply(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [ '->',
                        {
                        xtype : 'datefield',
                        fieldLabel : '日期',
                        id:'dtm-accessibility-useDate',
                        format: 'Y-m-d',
                        width:180,
                        value:new Date(),
                        editable:false,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:38,
                        labelAlign:'right'
                    },{
                        xtype : 'combo',
                        width:150,
                        fieldLabel : '班次',
                        id:'dtm-accessibility-schedul',
                        labelWidth:38,
                        labelAlign:'right',
                            editable:false,
                        value:'be0df177abf011e396e800271396a820',
                        valueField: 'code',
                        displayField: 'name',
                        store: new Ext.data.Store({
                            fields: ['code', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot+'/nws/doctorordermanagement/drugs_rote?dic=SCHEDULTYPE',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad:true
                        })
                    },{
                        xtype:'button',
                        iconCls: 'dtm-accessibility-refresh',
                        tooltip: '刷新',
                        handler:function(){
                            var schedul=Ext.getCmp('dtm-accessibility-schedul').getValue();
                            var useDate=Ext.getCmp('dtm-accessibility-useDate').getValue();
                            me.myStore.on('beforeload', function (_store, options) {
                                Ext.apply(_store.proxy.extraParams, {
                                    useDate : useDate,
                                    schedul:schedul
                                });
                            });
                            me.myStore.load();
                        }
                    },'-',{
                        xtype:'button',
                        iconCls: 'dtm-accessibility-save',
                        tooltip: '保存',
                        handler:function(){
                            var gridPanle = this.up().up();
                            var store = gridPanle.getStore();
                            var modify = [];
                            var remove = [];
                            var schedulTypes = [];

                            var modifiedRecords = store.getModifiedRecords();
                            if(modifiedRecords.length <=0){
                                Ext.MessageBox.alert('提示', '没有数据变化');
                            }else{
                                if(modifiedRecords.length>0){

                                    var schedul=Ext.getCmp('dtm-accessibility-schedul').getValue();
                                    var useDate=Ext.getCmp('dtm-accessibility-useDate').getValue();
                                    for(var i=0;i<modifiedRecords.length;i++){
                                        var record = modifiedRecords[i];
                                        if(record.get('AMOUNT')==''||record.get('CONSUMABLES_CODE')==''){
                                            Ext.MessageBox.alert('提示', '录入数据不能为空');
                                            return;
                                        }
                                        var item = {
                                            ID: record.get('ID'),
                                            CONSUMABLES_CODE: record.get('CONSUMABLES_CODE'),
                                            AMOUNT: record.get('AMOUNT'),
                                            SCHEDULING_TYPE: schedul,
                                            USE_DATE :useDate
                                        };
                                        modify.push(item);
                                    }
                                }
                                schedulTypes.push(modify);
                                schedulTypes.push(remove);
                                Ext.Ajax.request({
                                    url: webRoot + '/dtm/accessibility/save_consumable',
                                    method: 'POST',
                                    params:{saveRecords : Ext.encode(schedulTypes)},
                                    success: function(response) {
                                        store.load();
                                    }
                                });
                            }
                        }
                    }
                        ,{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-add',
                            tooltip: '增加',
                            handler : function(){
                                var gridPanle = this.up().up();
                                var store = gridPanle.getStore();
                                var count = store.getCount();
                                var row = Ext.create('ConsumableModel', {
                                    ID: null,
                                    TYPE:'',
                                    ITEM_ID: '',
                                    NAME: '',
                                    SCORES : '',
                                    CATEGORY:''
                                });
                                store.insert(count, row);
                            }
                        },{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-delete',
                            tooltip: '删除',
                            handler : function(){
                                var me = this;
                                var grid = me.up().up();
                                var records = grid.getSelectionModel().getSelection();
                                var store = this.up().up().store;
                                if(records.length <= 0){
                                    Ext.MessageBox.show({
                                        title:'提示',
                                        msg:'请选中一条耗材使用信息进行删除!',
                                        width:200,
                                        modal:false,
                                        buttons:Ext.MessageBox.OK,
                                        icon:Ext.MessageBox.WARNING
                                    });
                                }else{
                                    var removeArr = [];
                                    for(var i=0;i<records.length;i++){
                                        if(records[i].get('ID') != null && records[i].get('ID').length>0){
                                            removeArr.push(records[i].get('ID'));
                                        }
                                    }
                                    //判断删除的排班类型是否在排班日历中使用
                                    if(removeArr!=null&&removeArr.length>0){
                                        Ext.MessageBox.confirm('提示', '确定删除选中的耗材使用信息吗?', function(_btn) {
                                            if (_btn == 'yes') {
                                                var grid = me.up().up();
                                                var records = grid.getSelectionModel().getSelection();
                                                Ext.each(records,function(records){
                                                    grid.getStore().remove(records);
                                                });

                                                Ext.Ajax.request({
                                                    url: webRoot + '/dtm/accessibility/delete_consumable',
                                                    method: 'POST',
                                                    params:{removeRecords : Ext.encode(removeArr)},
                                                    success: function(response) {
                                                        Ext.MessageBox.show({
                                                            title:'提示',
                                                            msg:'删除成功!',
                                                            width:200,
                                                            modal:false,
                                                            buttons:Ext.MessageBox.OK,
                                                            icon:Ext.MessageBox.INFO
                                                        });
                                                    }
                                                });
                                            } else {
                                                return false;
                                            }
                                        });
                                    }else{
                                        Ext.MessageBox.confirm('提示', '确定删除选中的耗材使用信息吗?', function(_btn) {
                                            if (_btn == 'yes') {
                                                Ext.each(records,function(records){
                                                    grid.getStore().remove(records);
                                                });
                                                Ext.MessageBox.show({
                                                    title:'提示',
                                                    msg:'删除成功!',
                                                    width:200,
                                                    modal:false,
                                                    buttons:Ext.MessageBox.OK,
                                                    icon:Ext.MessageBox.INFO
                                                });
                                            } else {
                                                return false;
                                            }
                                        });
                                    }
                                }
                            }
                        },'-',{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-up',
                            tooltip: '向上',
                            handler : function(){
                                var gridPanle = this.up().up();
                                var store = gridPanle.getStore();
                                var records = gridPanle.getSelectionModel().getSelection();
                                var index = records[0].index;
                                if(index>0){
                                    Ext.each(records,function(records){
                                        store.remove(records);
                                    });
                                    store.insert(index-1 , records);
                                    store.getAt(index-1).index = index-1;
                                    store.getAt(index).index = index;
                                }
                                gridPanle.getSelectionModel().select(store.getAt(index-1));
                            }
                        },{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-down',
                            tooltip: '向下',
                            handler : function(){
                                var gridPanle = this.up().up();
                                var store = gridPanle.getStore();
                                var records = gridPanle.getSelectionModel().getSelection();
                                var index = records[0].index;
                                if(index<store.getCount()-1){
                                    Ext.each(records,function(records){
                                        store.remove(records);
                                    });
                                    store.insert(index+1 , records);
                                    store.getAt(index).index = index;
                                    store.getAt(index+1).index = index + 1;
                                }
                                gridPanle.getSelectionModel().select(store.getAt(index+1));
                            }
                        }
                    ]
                }
            ],
            columnLines: true,
            border: true,
            store: me.myStore,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [
                { header: '耗材',
                    dataIndex: 'NAME',
                    style:{
                        'text-align':'center'
                    },
                    width:200,
                    align:'left',
                    editor: {
                        xtype : 'combo',
                        editable: false,
                        allowBlank:false,
                        queryMode: 'remote',
                        valueField: 'name',
                        displayField: 'name',
                        store: new Ext.data.Store({
                            fields: ['code', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot+'/nws/doctorordermanagement/drugs_rote?dic=CONSUMABLE',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad:true
                        }),
                        listeners:{
                            select: function(combo, records, eOpts) {
                                var selectRecord = me.getSelectionModel().getSelection();
                                //combo.setValue(String(records[0].data.surgery_user_code).replace('.',''));
                                selectRecord[0].set('CONSUMABLES_CODE', records[0].data.code);
                            }
                        }
                    }
                },
                {
                    header: '使用量',
                    dataIndex: 'AMOUNT',
                    cls:'dtm-consumable-column-css',
                    style:{
                        'text-align':'center'
                    },
                    width:100,
                    align:'right',
                    editor: {
                        xtype:'numberfield',
                        allowBlank:false,
                        hideTrigger:true
                    }
                }
            ]
        });
        me.callParent();
    }
});

