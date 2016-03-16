Ext.define('com.dfsoft.lancet.sys.settings.UsbPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'usb-passage-window',
    layout: 'anchor',
    title: '数据通道: USB',
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
            id: 'usb-passage-form',
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
                fieldLabel: '设备名称',
                name: 'DEVICE',
                editable: false,
                valueField: 'value',
                displayField: 'text',
                value: 'USB1'
            }, {
                fieldLabel: '接收端点',
                name: 'RECEIVE_ENDPOINT',
                allowBlank: false,
                blankText: '接收端点不能为空'
            }, {
                fieldLabel: '接收端点大小',
                name: 'RECEIVE_PIPE_SIZE',
                allowBlank: false,
                blankText: '接收端点大小不能为空'
            }, {
                fieldLabel: '发送端点',
                name: 'SEND_ENDPOINT',
                allowBlank: false,
                blankText: '发送端点不能为空'
            }, {
                fieldLabel: '发送端点',
                name: 'SEND_PIPE_SIZE',
                allowBlank: false,
                blankText: '发送端点大小不能为空'
            }],
            listeners: {
                afterrender: function() {
                    if (!me.parent.isModifyChannel) {
                        if (me.CHANNEL_SETTING != '' && me.CHANNEL_SETTING != null) {
                            var setting = Ext.decode(me.CHANNEL_SETTING);
                            Ext.getCmp('usb-passage-form').getForm().setValues({
                                'DEVICE': setting.device,
                                'RECEIVE_ENDPOINT': setting.receiveendpoint,
                                'RECEIVE_PIPE_SIZE': setting.receivepipesize,
                                'SEND_ENDPOINT': setting.sendendpoint,
                                'SEND_PIPE_SIZE': setting.sendpipesize
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
        var form = Ext.getCmp('usb-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'device': formValue.DEVICE,
                'receiveendpoint': formValue.RECEIVE_ENDPOINT,
                'receivepipesize': formValue.RECEIVE_PIPE_SIZE + 'Mb',
                'sendendpoint': formValue.SEND_ENDPOINT,
                'sendpipesize': formValue.SEND_PIPE_SIZE + 'Mb'
            }
            var json = JSON.stringify(channel_setting);
            //CHANNEL_SETTING = json;
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('usb-passage-window').close();
        }
    }
});