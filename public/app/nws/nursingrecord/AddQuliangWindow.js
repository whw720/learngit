/**
 * 出量增加框
 * Created by whw on 2014-12-30.
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.AddQuliangWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.addquliangwindow',
    layout: 'border',
    //modal: true,
    //header:false,
    title:'出量监护项目',
    iconCls:'doctor-scan',
    width: 350,
    height: 318,

    border: false,
    initComponent: function() {
        var me = this;
        me.quliangGridPanel=me.createQuliangPanel();
        me.isRefresh=false;
        Ext.apply(me,{

            dockedItems:[{
                xtype: 'toolbar',
                dock: 'bottom',
                /*style:{
                    'padding-bottom':'0px'
                },*/
                items:[ '->',{
                    xtype : 'textfield',
                    id : me.id+'addname',
                    maxLength:25,
                    maxLengthText:'只输入25个字',
                    fieldLabel : '增加监护项目',
                    width:250,
                    msgTarget:'none',
                    labelWidth:88,
                    labelAlign:'right'
                },{
                    action: 'refresh_button',
                    iconCls: 'add',
                    tooltip:'增加监护项目',
                    labelAlign: 'right',
                    handler: function () {
                        var store=me.quliangGridPanel.getStore();
                        var len=store.getCount(),flag=false;
                        var value=Ext.getCmp(me.id+'addname').getValue().trim();
                        if(value==null||value==''){
                            Ext.MessageBox.alert('提示', '请输入监护项目！');
                            return ;
                        }
                        if(value.length>25){
                            Ext.MessageBox.alert('提示', '监护项目输入过长！');
                            return ;
                        }
                        for(var i=0;i<len;i++){
                            var s=store.getAt(i);
                            if(s.get('ALIAS')==value){
                                flag=true;
                                break;
                            }
                        }
                        if(flag){
                            Ext.MessageBox.alert('提示', '监护项目已经存在！');
                            return;
                        }else{
                            Ext.Ajax.request({
                                url: '/icu/nursingRecord/conventional/addBedItem',
                                method: 'POST',
                                scope: this,
                                params: {
                                    id:me.registerId,
                                    value:value
                                },
                                success: function(response) {
                                    var resJson = Ext.decode(response.responseText);
                                    if(resJson.success){
                                        me.isRefresh=true;
                                        store.load();
                                        //me.parent.conventionalToolbar.bedItemTree.reloadItem();
                                        me.parent.conventionalToolbar.bedItemTree.addItem(resJson.data);
                                    }
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '获取护理记录常规表头失败,请求超时或网络故障!');
                                }
                            });

                        }
                    }
                },'-',{
                    action: 'refresh_button',
                    iconCls: 'delete',
                    tooltip:'删除监护项目',
                    labelAlign: 'right',
                    handler: function (){
                        var grid = me.quliangGridPanel;
                        var records = grid.getSelectionModel().getSelection();
                        if (records.length <= 0) {
                            Ext.MessageBox.alert('提示', '请选择需要删除的记录！');
                            return;
                        }
                        Ext.Msg.confirm('提示', '确定要删除监护项目 '+records[0].get("ALIAS")+' 吗？', function(btn) {
                            if (btn === 'yes') {
                                Ext.Ajax.request({
                                    url: '/icu/nursingRecord/conventional/delBedItem',
                                    method: 'POST',
                                    scope: this,
                                    params: {
                                        id:records[0].get("ID")
                                    },
                                    success: function(response) {
                                        var resJson = Ext.decode(response.responseText);
                                        if(resJson.success){
                                            me.isRefresh=true;
                                            me.quliangGridPanel.getStore().load();
                                            //me.parent.conventionalToolbar.bedItemTree.reloadItem();
                                            me.parent.conventionalToolbar.bedItemTree.subItem(resJson.data);
                                        }
                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('提示', '获取护理记录常规表头失败,请求超时或网络故障!');
                                    }
                                });
                            }
                        });
                    }
                }
                ]
            }],
            items :[me.quliangGridPanel],
            listeners:{
                close:function(){
                    if(me.isRefresh){
                        var showColumn=me.parent.conventionalToolbar.bedItemTree.getSelsJson();
                        me.parent.queryGrid(showColumn);
                    }

                }
            }
        });
        me.callParent();
    },
    createQuliangPanel:function(){
        var me=this;
        var form = Ext.create('com.dfsoft.icu.nws.nursingrecord.AddQuliangPanel', {
            parent: me,
            registerId:me.registerId
        });
        return form;
    }
});