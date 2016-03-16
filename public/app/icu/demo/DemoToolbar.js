/**
 * 功能说明: Demo工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.DemoToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['com.dfsoft.icu.demo.DemoFormWindow'],
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        this.userNameField = new Ext.form.field.Text({
            fieldLabel	: '姓名',
            name : 'userName'
        });

        this.queryButton = new Ext.button.Button({
            text	: '查询',
            handler : function() {
                var store = proxy.demoApp.demoGrid.getStore();
                Ext.apply(store.proxy.extraParams, {
                    userName: proxy.userNameField.getValue()
                });
                store.loadPage(1);
            }
        });

        this.addButton = new Ext.button.Button({
            text 	: '新增',
            handler : function() {
                if (! proxy.demoApp.demoFormWindow) {
                    proxy.demoApp.demoFormWindow = new com.dfsoft.icu.demo.DemoFormWindow({demoApp: proxy.demoApp, userId: null});
                }
                proxy.demoApp.demoFormWindow.demoForm.userId = null;
                proxy.demoApp.demoFormWindow.demoForm.getForm().reset();
                proxy.demoApp.demoFormWindow.show();
            }
        });

        this.editButton = new Ext.button.Button({
            text	: '修改',
            handler : function() {
                var grid = proxy.demoApp.demoGrid;
                var records = grid.getSelectionModel().getSelection();
                if (records.length <= 0) {
                    Ext.MessageBox.show({
                        title : '提示',
                        width : 200,
                        scope : this,
                        msg : '请选择需要编辑的记录！',
                        modal : true,
                        buttons : Ext.Msg.OK,
                        icon : Ext.Msg.WARNING
                    });
                    return;
                }
                if (! proxy.demoApp.demoFormWindow) {
                    proxy.demoApp.demoFormWindow = new com.dfsoft.icu.demo.DemoFormWindow({demoApp: proxy.demoApp});
                }
                proxy.demoApp.demoFormWindow.demoForm.userId = records[0].get('id');
                proxy.demoApp.demoFormWindow.demoForm.getForm().reset();
                proxy.demoApp.demoFormWindow.demoForm.load({
                    url: webRoot + '/icu/demo/' + proxy.demoApp.demoFormWindow.demoForm.userId,
                    method: 'get',
                    success: function(form, action) {

                    }

                });
                proxy.demoApp.demoFormWindow.show();
            }
        });

        this.delButton = new Ext.button.Button({
            text 	: '删除',
            handler : function() {
                var grid = proxy.demoApp.demoGrid;
                var records = grid.getSelectionModel().getSelection();
                if (records.length <= 0) {
                    Ext.MessageBox.show({
                        title : '提示',
                        width : 200,
                        scope : this,
                        msg : '请选择需要删除的记录！',
                        modal : true,
                        buttons : Ext.Msg.OK,
                        icon : Ext.Msg.WARNING
                    });
                    return;
                }
                var id = records[0].get('id');
                Ext.MessageBox.confirm("确认", "您确定要删除此记录吗？", function(button, text) {
                    if (button == "yes") {
                        Ext.Ajax.request({
                            url: webRoot + '/icu/demo/' + id,
                            method: 'delete',
                                success : function(response) {
                                    var result = Ext.decode(response.responseText);
                                    if (result.success) {
                                        var store = proxy.demoApp.demoGrid.getStore();
                                        store.loadPage(1);
                                    }
                                }
                        });
                    }
                });
            }
        });

        this.transactionButton = new Ext.button.Button({
            text 	: '事务测试',
            handler : function() {
                Ext.Ajax.request({
                    url: webRoot + '/icu/demotransaction',
                    method: 'post',
                    success : function(response) {
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            var store = proxy.demoApp.demoGrid.getStore();
                            store.loadPage(1);
                        }
                    }
                });
            }
        });

        this.callParent([{
            items : [this.userNameField, this.queryButton, this.addButton, this.editButton, this.delButton, this.transactionButton]
        }]);
    }


});
