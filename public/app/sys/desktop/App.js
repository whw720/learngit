Ext.define('MyDesktop.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.App',

    requires: [
        'com.dfsoft.lancet.sys.desktop.ShortcutModel',
        'com.dfsoft.lancet.sim.App',
        //此处如何动态引入模块js todo
        'com.dfsoft.icu.demo.App',
        'com.dfsoft.icu.nws.App',
        'com.dfsoft.icu.dws.App',
        'com.dfsoft.icu.cms.App',
        'com.dfsoft.icu.dtm.App',
        'com.dfsoft.icu.sta.App',
        'com.dfsoft.icu.dmi.App',
        'com.dfsoft.icu.gas.App',
        'com.dfsoft.lancet.sys.settings.App',
        'com.dfsoft.lancet.sys.desktop.Timing'
    ],
    init: function() {
        var me = this;
        //模块定义
        me.moduleArray = [{
                id: '5be5e8ffa2c911e3a934002713c9dd0a',
                name: '重症监护站',
                module: 'nws',
                classType: com.dfsoft.icu.nws.App,
                isShortcut: true, //是否桌面显示
                isToolbar: false, //是否工具栏显示
                iconCls: 'nws-shortcut'
            },{
                id: 'd12e3e72a2c911e3a934002713c9dd0a',
                name: '医生工作站',
                module: 'dws',
                classType: com.dfsoft.icu.dws.App,
                isShortcut: true, //是否桌面显示
                isToolbar: false, //是否工具栏显示
                iconCls: 'dws-shortcut'
            },{
                id: 'f24667b2a2c911e3a934002713c9dd0a',
                name: '中央监护站',
                module: 'cms',
                classType: com.dfsoft.icu.cms.App,
                isShortcut: true, //是否桌面显示
                isToolbar: false, //是否工具栏显示
                iconCls: 'cms-shortcut'
            },{
                id: 'fcf7b409a2c911e3a934002713c9dd0a',
                name: '科室事务管理',
                module: 'dtm',
                classType: com.dfsoft.icu.dtm.App,
                isShortcut: true, //是否桌面显示
                isToolbar: false, //是否工具栏显示
                iconCls: 'dtm-shortcut'
            },{
                id: '02c889b6a2ca11e3a934002713c9dd0a',
                name: '查询统计',
                module: 'sta',
                classType: com.dfsoft.icu.sta.App,
                isShortcut: true, //是否桌面显示
                isToolbar: false, //是否工具栏显示
                iconCls: 'sta-shortcut'
            },
//            {
//                id: 'f6c9bb68403f11e3b095bd66e3b8ba32',
//                name: '监护仪模拟器',
//                module: 'sim',
//                classType: com.dfsoft.lancet.sim.App,
//                isShortcut: false,
//                isToolbar: true,
//                iconCls: 'sim-small'
//            },
            {
                id: 'c2391376e18911e38be7002556cd3b93',
                name: '设备监护控制',
                module: 'dmi',
                classType: com.dfsoft.icu.dmi.App,
                isShortcut: false,
                isToolbar: true,
                iconCls: 'dmi-small',
                iconToolbarCls: 'dmi-small-toolbar'
            },
            {
                id: 'cc688e02971411e4b55840f2e9ff01b4',
                name: '血气分析',
                module: 'gas',
                classType: com.dfsoft.icu.gas.App,
                isShortcut: false, //是否桌面显示
                isToolbar: true, //是否工具栏显示
                iconCls: 'gas-small',
                iconToolbarCls: 'gas-small-toolbar'
            }
        ];
        //右键菜单
        me.contextMenuArray = [{
            id: 'ad0836d0265111e3a7c623368e524295',
            text: '系统设置',
            iconCls: 'settings',
            handler: me.onSettings,
            scope: me
        }];
        //权限判断
        me.moduleResourceArray = [];
        me.contextMenuResourceArray = [];
        for (var i = 0; i < userInfo.resource.length; i++) {
            for (var j = 0; j < me.moduleArray.length; j++) {
                if (userInfo.resource[i].id === me.moduleArray[j].id) {
                    me.moduleResourceArray.push(me.moduleArray[j]);
                }
            }
            for (var k = 0; k < me.contextMenuArray.length; k++) {
                if (userInfo.resource[i].id === me.contextMenuArray[k].id) {
                    // 删除系统设置id,否则会与开始menu的系统设置id重复
                    delete me.contextMenuArray[k].id;
                    me.contextMenuResourceArray.push(me.contextMenuArray[k]);
                }
            }
        }

        this.callParent();
//不再检查时间差，重写js自动取服务器时间
//        Ext.create('com.dfsoft.lancet.sys.desktop.Timing').timing();
        this.gloabal_mask = new Ext.LoadMask(myDesktopApp.getDesktop(), {
            msg: "数据加载中..."
        });
    },
    loadMask: function(state, msg) {
        if (state) {
            if (msg) {
                this.gloabal_mask.msg = msg;
            }
            this.gloabal_mask.show();
        } else {
            this.gloabal_mask.hide();
        }
    },
    //模块类名，用于创建窗口内容，注意对象的module值必须和getDesktopConfig中的module保持一致
    getModules: function() {
        //用户权限检查
        var modules = [];
        for (var i = 0; i < this.moduleResourceArray.length; i++) {
            modules.push(new this.moduleResourceArray[i].classType());
        }
        //血气分析
        modules.push(new this.moduleArray[this.moduleArray.length - 1].classType());
        //监护项设置
        modules.push(new this.moduleArray[this.moduleArray.length - 2].classType());
        return modules;
    },
    //桌面配置，背景、快捷方式、右键菜单
    getDesktopConfig: function() {
        var me = this,
            ret = me.callParent(),
            currWallpaper;

        //获取配置项中设置的背景
        Ext.Ajax.request({
            url: webRoot + '/sys/options',
            async: false,
            method: 'GET',
            scope: this,
            success: function(response) {
                var respText = Ext.decode(response.responseText);
                for (var i = 0; i < respText.data.length; i++) {
                    if (respText.data[i].name == '桌面背景') {
                        currWallpaper = respText.data[i].settings;
                    }
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取桌面背景失败,请求超时或网络故障!');
            }
        });

        var currData = [];
        for (var i=0; i<me.moduleResourceArray.length; i++) {
            if (me.moduleResourceArray[i].isShortcut==true) {
                currData.push(me.moduleResourceArray[i]);
            }
        }
        var shortcutsStore = Ext.create('Ext.data.Store', {
            model: 'com.dfsoft.lancet.sys.desktop.ShortcutModel'
        });
        shortcutsStore.loadData(currData);
        return Ext.apply(ret, {
            contextMenuItems: me.contextMenuResourceArray,
            shortcuts: shortcutsStore,
            wallpaper: currWallpaper,
            wallpaperStretch: true,
            html:'<a href="#" target="_blank" alt="Powered by DCSoft" id="copyright"><div></div></a><a id="company_logo"><div></div></a>'
        });
    },
    //开始菜单配置
    getStartConfig: function() {
        var me = this,
            setItems = [],
            ret = me.callParent();
        var flag=false;
        for (var i = 0; i < userInfo.resource.length; i++) {
        	if(userInfo.resource[i].id=='ad0836d0265111e3a7c623368e524295')flag=true;
        }
        if(flag){
        	setItems.push({
                id: 'ad0836d0265111e3a7c623368e524295',
                text: '系统设置',
                iconCls: 'settings',
                cls:'bar-set-button-style',
                handler: me.onSettings,
                scope: me
        	});
        }
        if (mode != 'lite') {
            setItems.push({
                text: '退出',
                iconCls: 'logout',
                cls:'bar-set-button-style',
                handler: me.onLogout,
                scope: me
            });
        }
        var title = '欢迎您，' + userInfo.name;
        if (mode == 'full') {
            title += '(' + userInfo.role_name + ')';
        }
        if (lancetVersion && lancetVersion !== 'undefined') {
            var vText = [
                '<div style="color:rgb(153, 153, 153); position:absolute; bottom:2px;top:5px">',
                '<span>',
                '版本：' + lancetVersion,
                '</span>',
                '</div>'
            ].join('');

            setItems.push({
                xtype: 'tbtext',
                style:{
                    left:"184px",
                    top:"5px"
                },
                text: vText,
                flex: 1
            });
        }
        return Ext.apply(ret, {
            title: title,
            iconCls: 'user',
            style:{
                borderWidth: "0px",
                backgroundImage:"url(../app/sys/desktop/images/start-background.jpg)"
            },
            height: 356,
            toolConfig: {
                width: 100,
                items: setItems
            }
        });
    },
    //任务栏配置
    getTaskbarConfig: function() {
        var ret = this.callParent();
        var setItems = [], me=this;
        for (var i = 0; i < me.moduleResourceArray.length; i++) {
            if (me.moduleResourceArray[i].isToolbar == true) {
                setItems.push(me.moduleResourceArray[i]);
            }
        }
        //监护项设置
        setItems.push(this.moduleArray[this.moduleArray.length - 2]);
        //血气分析
        setItems.push(this.moduleArray[this.moduleArray.length - 1]);
        return Ext.apply(ret, {
            quickStart: setItems,
            trayItems: [{
                xtype: 'trayclock',
                flex: 1
            }]
        });
    },
    //退出
    onLogout: function() {
        Ext.Msg.confirm('退出', '确认要退出吗？', function(btn) {
            if (btn === 'yes') {
                window.location.href = webRoot + '/sys/logout/';
            }
        });
    },
    //系统设置
    onSettings: function() {
        //时间差大于60秒
        if (myDesktopApp.diffTime) {
            Ext.MessageBox.alert('提示', myDesktopApp.diffContent);
        } else {
            var dlg = Ext.create('com.dfsoft.lancet.sys.settings.App', {
                desktop: this.desktop
            });
            dlg.show();
        }
    }
});