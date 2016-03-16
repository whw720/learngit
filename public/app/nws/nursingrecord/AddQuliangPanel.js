/**
 * Created by whw on 14-12-30.
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.AddQuliangPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.addquliangpanel',
    columnLines: true,
    initComponent: function () {
        var me = this;
        var store=new Ext.data.Store({
            fields: ['ID', 'PARENT_ID','BED_ID','PRESET_CODE','NAME','ALIAS','UNIT_CODE','DATASOURCE_CODE','DATASOURCE_VALUE','WIDTH','DISPLAY_TO_RECORDS','DISPLAY_TO_CENTRAL'],
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                extraParams:{
                    register_id :me.registerId
                },
                url: webRoot + '/icu/nursingRecord/conventional/queryChuliang',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        Ext.apply(me, {
            border: true,
            autoScroll: true,
            enableColumnHide: false,
            //forceFit: true,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            region:'center',
            store:store,
            columns: [
                {
                    xtype: 'rownumberer',
                    text: '序号',
                    width: 40,
                    align: 'center'
                },{
                    text: '选择',
                    width: 40,
                    dataIndex:'DISPLAY_TO_RECORDS',
                    sortable: false,
                    renderer:function(value,metaData ,record,rowIndex,colIndex ) {
                        return (new Ext.grid.column.CheckColumn).renderer(value);
                    }
                },
                {
                    text: '监护项目',
                    dataIndex: 'ALIAS',
                    width: 240,
                    sortable: false,
                    align: 'left',
                    editor:{
                        xtype:'textfield',
                        maxLength:20,
                        maxLengthText:'最长允许输入20个字符'
                    }
                }
            ],
            listeners:{
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    //console.log(modifiedFieldNames);
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(modifiedFieldNames=='DISPLAY_TO_RECORDS'){
                        var dosage=(record.get('DISPLAY_TO_RECORDS')?0:1);
                        Ext.Ajax.request({
                            url: '/icu/nursingRecord/conventional/changeShowCareRecords',
                            method: 'POST',
                            scope: this,
                            params: {
                                id:record.get('ID'),
                                show:dosage
                            },
                            success: function(response) {
                                var resJson = Ext.decode(response.responseText);
                                if(resJson.success){
                                    record.set('DISPLAY_TO_RECORDS',(dosage==1?true:false));
                                    record.commit();
                                    me.parent.isRefresh=true;
                                    if(dosage==1){
                                        me.parent.parent.conventionalToolbar.bedItemTree.addItem(record.get('ID'));
                                    }else{
                                        me.parent.parent.conventionalToolbar.bedItemTree.subItem(record.get('ID'));
                                    }
                                }
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '获取护理记录常规表头失败,请求超时或网络故障!');
                            }
                        });
                    }

                },
                beforeedit:function(editor, e){
                    me.parent.isRefresh=true;
                },
                edit:function(editor, e){
                    if(e.value==e.originalValue){
                        e.record.commit();
                        return;
                    }
                    if(e.value==null||e.value==""){
                        Ext.MessageBox.alert('提示', '监护项目不能为空！');
                        e.record.set('ALIAS', e.originalValue);
                        return;
                        e.record.commit();
                        return;
                    }
                    if(e.value.length>20){
                        return;
                    }
                    var store=me.getStore();
                    var len=store.getCount(),flag=false;
                    for(var i=0;i<len;i++){
                        var s=store.getAt(i);
                        if(s.get('ALIAS')==e.value&& s.get("ID")!= e.record.get('ID')){
                            flag=true;
                            break;
                        }
                    }
                    if(flag){
                        Ext.MessageBox.alert('提示', '监护项目已经存在！');
                        e.record.set('ALIAS', e.originalValue);
                        return;
                    }else{
                        Ext.Ajax.request({
                            url: '/icu/nursingRecord/conventional/updateBedItem',
                            method: 'POST',
                            scope: this,
                            params: {
                                id:e.record.get("ID"),
                                name:e.value
                            },
                            success: function(response) {
                                var resJson = Ext.decode(response.responseText);
                                if(resJson.success){
                                    me.parent.isRefresh=true;
                                    store.load();
                                    //me.parent.parent.conventionalToolbar.bedItemTree.reloadItem();
                                    //me.parent.conventionalToolbar.bedItemTree.addItem(resJson.data);
                                }
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '获取护理记录常规表头失败,请求超时或网络故障!');
                            }
                        });
                    }

                }
            }
        });
        me.callParent();
    }
});