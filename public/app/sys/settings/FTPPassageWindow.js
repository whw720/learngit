Ext.define('com.dfsoft.lancet.sys.settings.FTPPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'ftp-passage-window',
    layout: 'anchor',
    title: '数据通道: FTP',
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
            id: 'ftp-passage-form',
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
                fieldLabel: '主机地址',
                name: 'HOST',
                allowBlank: false,
                blankText: '主机地址不能为空'
            }, {
                fieldLabel: '端口',
                name: 'PORT',
                allowBlank: false,
                blankText: '端口不能为空'
            }, {
                fieldLabel: '路径',
                name: 'PATH',
                allowBlank: false,
                blankText: '路径不能为空'
            }, {
                xtype: 'combo',
                fieldLabel: '模式',
                name: 'MODE',
                editable: false,
                valueField: 'value',
                displayField: 'text',
                value:'passive',
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [
                        ['passive', '被动(Passive)'],
                        ['active', '主动(Active)']
                    ]
                })
            }, {
                fieldLabel: '用户名',
                name: 'USERNAME',
                allowBlank: false,
                blankText: '用户名不能为空'
            }, {
                fieldLabel: '密码',
                inputType: 'password',
                name: 'PASSWORD',
                allowBlank: false,
                blankText: '密码不能为空'
            }],
            listeners: {
                afterrender: function() {
                    if (!me.parent.isModifyChannel) {
                        if (me.CHANNEL_SETTING != '' && me.CHANNEL_SETTING != null) {
                            var setting = Ext.decode(me.CHANNEL_SETTING);
                            Ext.getCmp('ftp-passage-form').getForm().setValues({
                                'HOST': setting.host,
                                'PORT': setting.port,
                                'PATH': setting.path,
                                'MODE': setting.mode,
                                'USERNAME': setting.username,
                                'PASSWORD': setting.password
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
        var form = Ext.getCmp('ftp-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            var channel_setting = {
                'host': formValue.HOST,
                'port': formValue.PORT,
                'path': formValue.PATH,
                'encoding': 'utf8',
                'mode': formValue.MODE,
                'username': formValue.USERNAME,
                'password': formValue.PASSWORD
            }
            var json = JSON.stringify(channel_setting);
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('ftp-passage-window').close();
        }
    }
});