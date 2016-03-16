Ext.define('com.dfsoft.lancet.sys.settings.App', {
    extend: 'Ext.window.Window',
    title: '系统设置',
    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',
        'com.dfsoft.lancet.sys.desktop.Wallpaper',
        'com.dfsoft.lancet.sys.settings.WallpaperModel',
        'com.dfsoft.lancet.sys.settings.DepartmentModel',
        'com.dfsoft.lancet.sys.settings.AdapterModel',
        'com.dfsoft.lancet.sys.settings.UserModel',
        'com.dfsoft.lancet.sys.settings.DrugModel',
        'com.dfsoft.lancet.sys.settings.DrugRouteModel',
        'com.dfsoft.lancet.sys.settings.LinkModel',
        'com.dfsoft.lancet.sys.settings.CareItemTreeModel',
        'com.dfsoft.lancet.sys.settings.CareTemplateTreeModel',
        'com.dfsoft.lancet.sys.settings.ConsumablesModel'
    ],
    modal: true,
    width: 760,
    height: 460,
    minWidth:760,
    minHeight:460,
    border: false,
    layout: 'fit',
    bodyPadding: '5',
    maximizable: true,
    iconCls: 'settings',
    initComponent: function() {
        var me = this;
    
        me.depttree = me.createDeptTree();
        me.user = me.createUser();
        me.client = me.createClient();
        me.dictionary = me.createDictionary();
        me.options = me.createOptions();
        me.items = [{
            xtype: 'tabpanel',
            id: 'parent-tab',
            activeTab: 0,
            plain: true,
            tabBar: {
                defaults: {
                    width: 90
                }
            },
            items: [{
                    title: '权限',
                    layout: 'border',
                    border: false,
                    id: 'settings_a10836d0265111e3a7c623368e524294',
                    disabled: true,
                    bodyStyle: 'background: white',
                    items: [
                        me.depttree, me.user
                    ]
                }, me.dictionary, me.client, {
                    title: '选项',
                    border: 1,
                    id: 'settings_a40836d0265111e3a7c623368e524291',
                    disabled: true,
                    layout: 'fit',
                    items: [me.options]
                }
            ]
        }];

        me.callParent();

        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp('settings_' + resourceData[i].id);
            if (currButton != undefined) {
                currButton.setDisabled(false);
            }
        }
        Ext.getCmp('parent-tab').setActiveTab('settings_a40836d0265111e3a7c623368e524291');
        //常规
        Ext.getCmp('parent-tab').setActiveTab('settings_a10836d0265111e3a7c623368e524294');

        //护理字典
        Ext.getCmp('settings_a20836d0265111e3a7c623368e524293').setActiveTab('settings_34415e7041de11e3b5bcdd145cb30083');
        //系统字典
        Ext.getCmp('settings_a20836d0265111e3a7c623368e524293').setActiveTab('settings_23315e7041de11e3b5bcdd145cb30972');

        //用药途径
        Ext.getCmp('settings_23315e7041de11e3b5bcdd145cb30972').setActiveTab('settings_b236e2b078fd11e39fd9cb7044fb0468');
        //药品
        Ext.getCmp('settings_23315e7041de11e3b5bcdd145cb30972').setActiveTab('settings_a125e2b078fd11e39fd9cb7044fb9357');
    },

    createDeptTree: function() {
        var depttree = Ext.create('com.dfsoft.lancet.sys.settings.DeptTree', {});

        return depttree;
    },
    createUser: function() {
        var user = Ext.create('com.dfsoft.lancet.sys.settings.User', {});

        return user;
    },
    createClient: function() {
        var adapter = Ext.create('com.dfsoft.lancet.sys.settings.Client', {

        });
        return adapter;
    },
    createDictionary: function() {
        var dictionary = Ext.create('com.dfsoft.lancet.sys.settings.Dictionary', {

        });
        return dictionary;
    },
    createOptions: function() {
        var options = Ext.create('com.dfsoft.lancet.sys.settings.Options', {

        });
        return options;
    }
});


//桌面背景设置窗口
function settingsDesktop(id, type, name, code) {
    var dlg = Ext.create('com.dfsoft.lancet.sys.settings.DesktopSetting', {
        desktop: myDesktopApp.desktop,
        settingsId: id,
        settingsType: type,
        settingsName: name,
        settingsCode: code
    });
    dlg.show();
};




function getChecked(rowIdx) {
    var rangeGrid = Ext.getCmp('care-item-range-grid'),
        rangeStore = rangeGrid.getStore(),
        records = rangeGrid.getSelectionModel().getSelection()[0];
    records.data.IS_DEFAULT = true;
    for(var i=0;i<rangeStore.getCount();i++) {
        var curr = rangeStore.getAt(i);
        if((i+'') != rowIdx) {
            curr.data.IS_DEFAULT = false;
        }
    }
}