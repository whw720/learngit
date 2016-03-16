Ext.define('com.dfsoft.lancet.sys.settings.SocketPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'socket-passage-window',
    layout: 'anchor',
    title: '数据通道: Socket',
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
            id: 'socket-passage-form',
            defaults: {
                layout: {
                    type: 'hbox'
                }
            },
            bodyPadding: 5,
            items: [{
                xtype: 'fieldcontainer',
                defaults: {
                    labelWidth: 72,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'combo',
                    fieldLabel: '通讯协议',
                    name: 'PROTOCOL',
                    width: '100%',
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: 'TCP/IP',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['TCPIP', 'TCP/IP'],
                            ['UDP', 'UDP']
                        ]
                    })
                }]
            }, {
                xtype: 'fieldcontainer',
                defaults: {
                    labelWidth: 72,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '主机地址',
                    name: 'HOST',
                    width: '100%',
                    allowBlank: false,
                    blankText: '主机地址不能为空'
                }]
            }, {
                xtype: 'fieldcontainer',
                defaults: {
                    labelWidth: 72,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '端口',
                    name: 'PORT',
                    width: '100%',
                    allowBlank: false,
                    blankText: '端口不能为空'
                }]
            }, {
                xtype: 'fieldcontainer',
                defaults: {
                    labelWidth: 72,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '缓冲区',
                    name: 'BUFFERSIZE',
                    allowBlank: false,
                    value: '1',
                    blankText: '缓冲区不能为空',
                    inputId: 'bufferId',
                    width: '90%'
                }, {
                    xtype: 'label',
                    forId: 'bufferId',
                    text: 'MB',
                    width: '10%',
                    margin: '5 0 0 5'
                }]
            }],
            listeners: {
                afterrender: function() {
                    if (!me.parent.isModifyChannel) {
                        if (me.CHANNEL_SETTING != '' && me.CHANNEL_SETTING != null) {
                            var setting = Ext.decode(me.CHANNEL_SETTING);
                            Ext.getCmp('socket-passage-form').getForm().setValues({
                                'PROTOCOL': setting.protocol,
                                'HOST': setting.host,
                                'PORT': setting.port,
                                'BUFFERSIZE': setting.buffersize
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
        var form = Ext.getCmp('socket-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'protocol': formValue.PROTOCOL,
                'host': formValue.HOST,
                'port': formValue.PORT,
                'buffersize': formValue.BUFFERSIZE
            }
            var json = JSON.stringify(channel_setting);
            //CHANNEL_SETTING = json;
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('socket-passage-window').close();
        }
    }
});