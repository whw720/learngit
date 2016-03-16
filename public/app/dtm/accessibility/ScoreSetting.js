/**
 * 分值设置GRID页面
 * @author:whw
 * @date:2014-3-24.
 */
Ext.define('com.dfsoft.icu.dtm.accessibility.ScoreSetting', {
    extend: 'Ext.grid.Panel',
    initComponent: function () {
        var me = this;
            me.owner = (me.owner && me.owner == 'D' ? 'D' : 'N');
        Ext.define('ScoreSettingModel',{
            extend : 'Ext.data.Model',
           fields: ['ID', 'TYPE', 'ITEM_ID','NAME', 'SCORES', 'CATEGORY']
        });

        me.itemTreesStore=Ext.create('com.dfsoft.icu.dtm.accessibility.CareItemTreesStore');
        me.categoryStore=Ext.create('Ext.data.Store',{
            fields:['category'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/dtm/accessibility/query_category/' + (me.owner && me.owner == 'D' ? 'D' : 'N'),
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        me.myStore = Ext.create('Ext.data.Store', {
            model:'ScoreSettingModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dtm/accessibility/query_score/' + me.owner,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true,
            listeners:{
                beforeload:function(){
                    me.categoryStore.reload();
                }
            }
        });
        Ext.QuickTips.init();
        Ext.apply(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [ '->',{
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
                                    var exist=false;
                                    var itemIds="";
                                    var itemArray=[];
                                    for(var i=0;i<store.getCount();i++) {
                                        itemIds=itemIds+"'"+store.getAt(i).data.NAME+"',";
                                    }
                                    itemIds=(itemIds==""?"''":itemIds.substring(0,itemIds.length-1));
                                    itemArray=itemIds.split(',').sort();
                                    for(var i=0;i<itemArray.length;i++) {
                                        if (itemArray[i] == itemArray[i + 1]&&(itemArray[i + 1]!="''"&&itemArray[i]!="''")) {
                                            exist=true;
                                            break;
                                        }
                                    }
                                    if(exist){
                                        Ext.MessageBox.alert('提示',"存在重复监护项，请去除重复数据后保存！");
                                        return;
                                    }
                                    for(var i=0;i<modifiedRecords.length;i++){
                                        var record = modifiedRecords[i];
                                        if((record.get('SCORES')==''||record.get('CATEGORY')==''||record.get('ITEM_ID')=='')&&(record.get('SCORES')+'')!='0'){
                                            Ext.MessageBox.alert('提示', '录入数据不能为空');
                                            return;
                                        }
                                        var item = {
                                            ID: record.get('ID'),
                                            TYPE: record.get('TYPE'),
                                            ITEM_ID: record.get('ITEM_ID'),
                                            SCORES:(record.get('SCORES')+'')=='0'?'0':record.get('SCORES'),
                                            CATEGORY : record.get('CATEGORY'),
                                            IS_ITEM_CHANGE: record.modified['ITEM_ID'] ? '1' : '0',
                                            OWNER: me.owner
                                        };
                                        modify.push(item);
                                    }
                                }
                                schedulTypes.push(modify);
                                schedulTypes.push(remove);
                                Ext.Ajax.request({
                                    url: webRoot + '/dtm/accessibility/save_score',
                                    method: 'POST',
                                    params:{saveRecords : Ext.encode(schedulTypes), OWNER: me.owner},
                                    success: function(response) {
                                        res=Ext.decode(response.responseText);
                                        if(res.data){
                                            schedulTypes.length=0;
                                        }else{
                                            store.load();
                                        }
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
                                var row = Ext.create('ScoreSettingModel', {
                                    ID: null,
                                    TYPE:'',
                                    ITEM_ID: '',
                                    NAME: '',
                                    SCORES : '',
                                    CATEGORY:'',
                                    OWNER:me.owner
                                });
                                store.insert(count, row);
                                gridPanle.getSelectionModel().select(store.getCount()-1);
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
                                        msg:'请选中一条分值设置进行删除!',
                                        width:200,
                                        modal: true,
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
                                        Ext.MessageBox.confirm('提示', '确定删除选中的分值设置信息吗?', function(_btn) {
                                            if (_btn == 'yes') {
                                                var grid = me.up().up();
                                                var records = grid.getSelectionModel().getSelection();
                                                Ext.each(records,function(records){
                                                    grid.getStore().remove(records);
                                                });

                                                Ext.Ajax.request({
                                                    url: webRoot + '/dtm/accessibility/delete_score',
                                                    method: 'POST',
                                                    params:{removeRecords : Ext.encode(removeArr)},
                                                    success: function(response) {
                                                        grid.getStore().reload();
                                                       /* Ext.MessageBox.show({
                                                            title:'提示',
                                                            msg:'删除成功!',
                                                            width:200,
                                                            modal:false,
                                                            buttons:Ext.MessageBox.OK,
                                                            icon:Ext.MessageBox.INFO
                                                        });*/
                                                    },
                                                    failure: function(response, options) {
                                                        Ext.MessageBox.show({
                                                            title:'提示',
                                                            msg:'删除失败!',
                                                            width:200,
                                                            modal: true,
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
                                        Ext.MessageBox.confirm('提示', '确定删除选中的分值设置信息吗?', function(_btn) {
                                            if (_btn == 'yes') {
                                                Ext.each(records,function(records){
                                                    grid.getStore().remove(records);
                                                });
                                               /* Ext.MessageBox.show({
                                                    title:'提示',
                                                    msg:'删除成功!',
                                                    width:200,
                                                    modal:false,
                                                    buttons:Ext.MessageBox.OK,
                                                    icon:Ext.MessageBox.INFO
                                                });*/
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
                                var index = records[0]?records[0].index:0;
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
                                var index = records[0]?records[0].index:store.getCount()+1;
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
            border: false,
            store: me.myStore,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [
                { header: '护理项目',
                    dataIndex: 'NAME',
                    style:{
                        'text-align':'center'
                    },
                    flex:1,
                    align:'left',
                    editor: {
                        xtype: 'comboboxtree',
                        editable: false,
                        allowBlank:false,
                        store:me.itemTreesStore,
                        valueField: 'id',
                        displayField: 'text',
                        listeners:{
                            nodeclick: function(combo, records, eOpts) {
                                var selectRecord = me.getSelectionModel().getSelection();
                                if(records.get('id')!='careitemtree'&&records.get('id')!='scoretree'&&records.get('id')!='pipetree'){
                                    var ty=records.get('type')=='S'?'S':records.get('type')=='D'?'D':(records.get('type')=='P'?'P':records.get('type'));
                                    selectRecord[0].set('TYPE', ty);
                                    selectRecord[0].set('ITEM_ID', records.get('id'));
                                }else{
                                    Ext.MessageBox.show({
                                        title:'提示',
                                        msg:'请不要选择护理项目、管道或评分项目!',
                                        width:200,
                                        modal: true,
                                        buttons:Ext.MessageBox.OK,
                                        icon:Ext.MessageBox.WARNING
                                    });
                                    selectRecord[0].set('TYPE', '');
                                    selectRecord[0].set('ITEM_ID', '');
                                    selectRecord[0].set('NAME', '');
                                    return;
                                }
                            }
                        }
                    }
                },
                {
                    header: '分值',
                    dataIndex: 'SCORES',
                    style:{
                        'text-align':'center'
                    },
                    flex:1,
                    align:'right',
                    editor: {
                        xtype:'numberfield',
                        allowBlank:false,
                        maxValue:99999,
                        minValue:0,
                        hideTrigger:true
                    }
                },
                { header: '所属分组',
                    style:{
                        'text-align':'center'
                    },
                    flex:1,
                    align:'left',
                    dataIndex: 'CATEGORY' ,
                    editor: {
                        xtype: 'combo',
                        queryMode: 'remote',
                        allowBlank:false,
                        valueField: 'category',
                        displayField: 'category',
                        store:me.categoryStore,
                        maxLength:200,
                        listConfig: {
                            cls: 'border-list',
                            getInnerTpl: function() {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{category}</span>';
                            }
                        }
                    }
                }
            ],
            listeners:{
                beforedestroy:function(_this, eOpts ){
                    /*var modifiedRecords = me.myStore.getModifiedRecords();
                    if(modifiedRecords.length >0){
                        Ext.MessageBox.alert('提示', '页面存在未保存数据');
                        return false;
                    }else{
                        return true;
                    }*/
                }
            }
        });
        me.callParent();
    },
    getFields:function(childs){
        var fileds = [];

        for (var i = 0; i < childs.length; i++) {
            if (childs[i].columns!=undefined&& childs[i].columns.length>0) {
                fileds=fileds.concat(this.getFields(childs[i].columns));
            }else{
                fileds.push(childs[i]);
            }
        }

        return fileds;
    }
});
