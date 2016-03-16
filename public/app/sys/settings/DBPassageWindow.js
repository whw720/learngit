Ext.define('com.dfsoft.lancet.sys.settings.DBPassageWindow', {
    extend: 'Ext.window.Window',
    id: 'db-passage-window',
    layout: 'anchor',
    title: '数据通道: 数据库',
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
            id: 'db-passage-form',
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
                value:'MySQL',
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [
                        ['Oracle', 'Oracle'],
                        ['MS SQL Server', 'MS SQL Server'],
                        ['Sybase', 'Sybase'],
                        ['MySQL', 'MySQL']
                    ]
                })
            }, {
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
                fieldLabel: '数据库名',
                name: 'DATABASE',
                allowBlank: false,
                blankText: '数据库名不能为空'
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
                            if (setting.type === 'Oracle') {
                                Ext.getCmp('db-passage-form').getForm().setValues({
                                    'TYPE': setting.type,
                                    'HOST': setting.host,
                                    'PORT': setting.port,
                                    'DATABASE': setting.sid,
                                    'USERNAME': setting.username,
                                    'PASSWORD': setting.password
                                });
                            } else {
                                Ext.getCmp('db-passage-form').getForm().setValues({
                                    'TYPE': setting.type,
                                    'HOST': setting.host,
                                    'PORT': setting.port,
                                    'DATABASE': setting.database,
                                    'USERNAME': setting.username,
                                    'PASSWORD': setting.password
                                });
                            }
                        }
                    }
                }
            }
        }];

        me.callParent();
    },
    onOK: function() {
        var me = this;
        var form = Ext.getCmp('db-passage-form').getForm(),
            formValue = form.getValues();
        if (form.isValid()) {
            if (formValue.TYPE === 'Oracle') {
                var channel_setting = {
                    'type': formValue.TYPE,
                    'host': formValue.HOST,
                    'port': formValue.PORT,
                    'sid': formValue.DATABASE,
                    'username': formValue.USERNAME,
                    'password': formValue.PASSWORD
                }
            } else {
                var channel_setting = {
                    'type': formValue.TYPE,
                    'host': formValue.HOST,
                    'port': formValue.PORT,
                    'database': formValue.DATABASE,
                    'username': formValue.USERNAME,
                    'password': formValue.PASSWORD
                }
            }
            var json = JSON.stringify(channel_setting);
            infoForm = Ext.getCmp('adapter-info-form').getForm();
            infoForm.findField('CHANNEL_SETTING').setValue(json);
            me.parent.isModifyChannel = false;
            me.parent.initialChannel = infoForm.findField('CHANNEL').getValue();
            me.parent.initialChannelSetting = json;
            Ext.getCmp('db-passage-window').close();
        }
    }
});