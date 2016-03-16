/**
 * 功能说明: Demo编辑页面
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.DemoForm', {
    extend : 'Ext.form.Panel',
    initComponent : function(){
        var proxy = this;

        Ext.apply(this, {
            items		: [{
                xtype: 'textfield',
                fieldLabel: 'ID',
                name: 'id'
            }, {
                xtype: 'textfield',
                fieldLabel: '姓名',
                name: 'name'
            }],
            buttons : [{
                text 	: '确定',
                handler : function() {
                    var id = proxy.getForm().findField('id').getValue();
                    var url = webRoot + '/icu/demo';
                    var method = 'post';
                    if (id!="") {
                        var url = webRoot + '/icu/demo/' + id;
                        method = 'put';
                    }

                    proxy.getForm().submit({
                        url: url,
                        method: method,
                        success: function(form, action) {
                            var result = Ext.decode(action.response.responseText);
                            if (result.success) {
                                Ext.MessageBox.show({
                                    title 	: '提示',
                                    width 	: 200,
                                    scope	: this,
                                    msg 	: '保存成功！',
                                    fn      : function(btn, text){
                                        if (btn == 'ok') {
                                            proxy.win.close();
                                            var store = proxy.win.demoApp.demoGrid.getStore();
                                            store.loadPage(1);
                                        }
                                    },
                                    modal 	: true,
                                    buttons : Ext.Msg.OK,
                                    icon 	: Ext.MessageBox.INFO
                                });
                            }
                        }
                    });
                }
            }, {
                text 	: '取消',
                handler : function() {
                    proxy.win.close();
                }
            }]
        });

        this.callParent();
    }
});