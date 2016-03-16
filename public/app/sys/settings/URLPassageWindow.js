/*
    URL 的数据通道窗口
    @author:杨祖文
*/
Ext.define('com.dfsoft.lancet.sys.settings.URLPassageWindow', {
    extend: 'Ext.window.Window',
    layout: 'anchor',
    title: '数据通道: URL',
    modal: true,
    width: 280,
    height: 260,
    border: false,
    iconCls: 'data-passage',
    initComponent: function() {
        var me = this;
        me.buttons = [{
            text: '确定',
            iconCls: 'save',
            handler: me.onOK,
            scope: me
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];

        me.items = [{
            xtype: 'form',
            id: 'url-passage-form',
            anchor: '100%',
            border: false,
            bodyPadding: 5,
            defaults: {
                labelWidth: 32,
                labelAlign: 'right',
                width: 258
            },
            defaultType: 'textfield',
            items: [{
                fieldLabel: '地址',
                name: 'URL',
                allowBlank: false,
                blankText: 'URL地址不能为空'
            }],
            listeners: {
                afterrender: function() {
                    if (!me.parent.isModifyChannel) {
                        if (me.CHANNEL_SETTING != '' && me.CHANNEL_SETTING != null) {
                            var setting = Ext.decode(me.CHANNEL_SETTING);
                            Ext.getCmp('url-passage-form').getForm().setValues({
                                'URL': setting.url
                            });
                        }
                    }
                }
            }
        }];

        me.callParent();
    },

    onOK: function() {
        var me = this;
        var form = Ext.getCmp('url-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'url': formValue.URL
            }
            var json = JSON.stringify(channel_setting);
            //CHANNEL_SETTING = json;
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            me.close();
        }
    }
});