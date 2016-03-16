Ext.define('com.dfsoft.lancet.sys.settings.SerialPortPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'serial-passage-window',
    layout: 'anchor',
    title: '数据通道: 串口',
    modal: true,
    width: 280,
    height: 300,
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
            id: 'serial-passage-form',
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
                    value: 'RS232',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['RS232', 'RS232'],
                            ['RS485', 'RS485']
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
                    xtype: 'combo',
                    fieldLabel: '设备名称',
                    name: 'DEVICE',
                    width: '100%',
                    editable: true,
                    allowBlank: false,
                    valueField: 'value',
                    displayField: 'text',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['COM1', 'COM1'],
                            ['COM2', 'COM2'],
                            ['COM3', 'COM3']
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
                    xtype: 'combo',
                    fieldLabel: '波特率',
                    name: 'BAUD_RATE',
                    width: '100%',
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: '9600',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['115200','115200'],
                            ['57600','57600'],
                            ['38400','38400'],
                            ['19200','19200'],
                            ['9600','9600'],
                            ['4800','4800'],
                            ['2400','2400'],
                            ['1800','1800'],
                            ['1200','1200'],
                            ['600','600']
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
                    xtype: 'combo',
                    fieldLabel: '数据位',
                    name: 'DATA_BITS',
                    width: '100%',
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: '8',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['8', '8'],
                            ['7', '7'],
                            ['6', '6'],
                            ['5', '5']
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
                    xtype: 'combo',
                    fieldLabel: '停止位',
                    name: 'STOP_BITS',
                    width: '100%',
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: '1',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['1', '1'],
                            ['1.5', '1.5'],
                            ['2', '2']
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
                    xtype: 'combo',
                    fieldLabel: '奇偶校验',
                    name: 'PARITY',
                    width: '100%',
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: 'none',
                    store: new Ext.data.SimpleStore({
                        fields: ['value', 'text'],
                        data: [
                            ['none', 'none'],
                            ['even', 'even'],
                            ['mark', 'mark'],
                            ['odd', 'odd'],
                            ['space', 'space']
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
                            Ext.getCmp('serial-passage-form').getForm().setValues({
                                'PROTOCOL': setting.protocol,
                                'DEVICE': setting.device,
                                'BAUD_RATE': setting.baudrate,
                                'DATA_BITS': setting.databits,
                                'STOP_BITS': setting.stopbits,
                                'PARITY': setting.parity,
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
        var form = Ext.getCmp('serial-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'protocol': formValue.PROTOCOL,
                'device': formValue.DEVICE,
                'baudrate': formValue.BAUD_RATE,
                'databits': formValue.DATA_BITS,
                'stopbits': formValue.STOP_BITS,
                'parity': formValue.PARITY,
                'buffersize': formValue.BUFFERSIZE
            }
            var json = JSON.stringify(channel_setting);
            //CHANNEL_SETTING = json;
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('serial-passage-window').close();
        }
    }
});