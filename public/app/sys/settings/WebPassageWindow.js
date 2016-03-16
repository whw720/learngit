Ext.define('com.dfsoft.lancet.sys.settings.WebPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'web-passage-window',
    layout: 'anchor',
    title: '数据通道: Web服务',
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
            id: 'web-passage-form',
            anchor: '100%',
            border: false,
            bodyPadding: 5,
            defaults: {
                labelWidth: 60,
                labelAlign: 'right',
                width: 258
            },
            defaultType: 'textfield',
            items: [{
                xtype: 'combo',
                fieldLabel: '类型',
                name: 'TYPE',
                editable: false,
                valueField: 'value',
                displayField: 'text',
                value: 'SOAP',
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [
                        ['SOAP', 'SOAP'],
                        ['REST', 'REST']
                    ]
                })
            }, {
                fieldLabel: '调用地址',
                name: 'CALL_URL',
                allowBlank: false,
                blankText: '调用地址不能为空'
            }],
            listeners: {
                afterrender: function() {
                    if (!me.parent.isModifyChannel) {
                        if (me.CHANNEL_SETTING != '' && me.CHANNEL_SETTING != null) {
                            var setting = Ext.decode(me.CHANNEL_SETTING);
                            Ext.getCmp('web-passage-form').getForm().setValues({
                                'TYPE': setting.type,
                                'CALL_URL': setting.url
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
        var form = Ext.getCmp('web-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'type': formValue.TYPE,
                'url': formValue.CALL_URL
            }
            var json = JSON.stringify(channel_setting);
            //CHANNEL_SETTING = json;
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('web-passage-window').close();
        }
    }
});