Ext.define('com.dfsoft.lancet.sys.settings.DesktopSetting', {
    extend: 'Ext.window.Window',
    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',
        'com.dfsoft.lancet.sys.desktop.Wallpaper',
        'com.dfsoft.lancet.sys.settings.WallpaperModel'
    ],

    layout: 'fit',
    title: '桌面设置',
    modal: true,
    width: 580,
    height: 380,
    border: false,

    initComponent: function() {
        var me = this;

        me.selected = me.desktop.getWallpaper();
        me.stretch = me.desktop.wallpaper.stretch;

        me.preview = Ext.create('widget.wallpaper');
        me.preview.setWallpaper(me.selected);
        me.tree = me.createTree();

        me.buttons = [{
            text: '确认',
            handler: me.onOK,
            scope: me
        }, {
            text: '取消',
            handler: me.close,
            scope: me
        }];

        me.items = [{
            layout: 'anchor',
            items: [{
                anchor: '0 -30',
                border: false,
                layout: 'border',
                items: [
                    me.tree, {
                        xtype: 'panel',
                        title: '预览',
                        region: 'center',
                        layout: 'fit',
                        items: [me.preview]
                    }
                ]
            }, {
                xtype: 'checkbox',
                boxLabel: '拉伸图片',
                checked: me.stretch,
                listeners: {
                    change: function(comp) {
                        me.stretch = comp.checked;
                    }
                }
            }]
        }];

        me.callParent();
    },

    createTree: function() {
        var me = this;

        function child(img) {
            return {
                img: img,
                text: me.getTextOfWallpaper(img),
                iconCls: '',
                leaf: true
            };
        }

        var tree = new Ext.tree.Panel({
            title: '桌面背景',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            width: 150,
            region: 'west',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: {
                    fn: this.setInitialSelection,
                    delay: 100
                },
                select: this.onSelect,
                scope: this
            },
            store: new Ext.data.TreeStore({
                model: 'com.dfsoft.lancet.sys.settings.WallpaperModel',
                root: {
                    text: 'Wallpaper',
                    expanded: true,
                    children: [{
                            text: "None",
                            iconCls: '',
                            leaf: true
                        },
                        child('1.jpg'),
                        child('2.jpg'),
                        child('3.jpg'),
                        child('4.jpg'),
                        child('5.jpg')
                    ]
                }
            })
        });

        return tree;
    },

    getTextOfWallpaper: function(path) {
        var text = path,
            slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash + 1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');
        return text;
    },

    onOK: function() {
        var me = this,
            options = Ext.getCmp('settings_options'),
            id = me.settingsId;
        if (id === 'undefined') {
            id = options.desktopId;
        }
        if (me.selected) {
            me.desktop.setWallpaper(me.selected, me.stretch);
        }
        if (id === undefined) {
            Ext.Ajax.request({
                url: webRoot + '/sys/options',
                params: {
                    TYPE: me.settingsType,
                    NAME: me.settingsName,
                    CODE: me.settingsCode,
                    VALUE: me.selected
                },
                method: 'POST',
                scope: this,
                success: function(response) {
                    var respText = Ext.decode(response.responseText);
                    if (respText.success == 'false') {
                        Ext.MessageBox.show({
                            title: '更新失败',
                            msg: respText.msg,
                            icon: Ext.Msg.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    } else {
                        options.desktopId = respText.data.id;
                    }
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('提示', '修改选项值失败,请求超时或网络故障!');
                    e.record.reject();
                }
            });
        } else {
            Ext.Ajax.request({
                url: webRoot + '/sys/options/' + id,
                params: {
                    ID: id,
                    VALUE: me.selected
                },
                method: 'PUT',
                scope: this,
                success: function(response) {
                    var respText = Ext.decode(response.responseText);
                    if (respText.success == 'false') {
                        Ext.MessageBox.show({
                            title: '更新失败',
                            msg: respText.msg,
                            icon: Ext.Msg.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('提示', '修改选项值失败,请求超时或网络故障!');
                    e.record.reject();
                }
            });
        }
        me.destroy();
    },

    onSelect: function(tree, record) {
        var me = this;

        if (record.data.img) {
            me.selected = '/app/sys/desktop/wallpapers/' + record.data.img;
        } else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }

        me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function() {
        var s = this.desktop.getWallpaper();
        if (s) {
            var path = '/app/sys/desktop/wallpaper/' + this.getTextOfWallpaper(s);
            this.tree.selectPath(path, 'text');
        }
    }
});