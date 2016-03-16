Ext.define('com.dfsoft.lancet.sys.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: [
        'Ext.container.Viewport',
        'com.dfsoft.lancet.sys.desktop.Desktop'
    ],
    id: 'sys-desktop-app',
    isReady: false,
    diffTime: false, //时间差
    diffContent: null,
    modules: null,
    useQuickTips: true,

    constructor: function(config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
        );

        me.mixins.observable.constructor.call(this, config);
        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },

    init: function() {
        var me = this,
            desktopCfg;
        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }
        desktopCfg = me.getDesktopConfig();
        me.desktop = new com.dfsoft.lancet.sys.desktop.Desktop(desktopCfg);
        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [me.desktop],
            listeners: {
                afterrender: me.onLocked
            }
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.diffTime = false;
        me.diffContent = "请校时后重新登录!";
        me.fireEvent('ready', me);

        //为lite模式时 直接显示术中管理
        if (mode === 'lite') {
            me.createWindow(me.modules[0]);
        }
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function() {
        var me = this,
            cfg = {
                app: me,
                taskbarConfig: me.getTaskbarConfig()
            };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    getStartConfig: function() {
        var me = this,
            cfg = {
                app: me,
                menu: []
            },
            launcher;

        Ext.apply(cfg, me.startConfig);
        Ext.each(me.modules, function(module) {
            launcher = module.launcher;
            if (launcher) {
                launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
                cfg.menu.push(module.launcher);
            }
        });
        return cfg;
    },

    createWindow: function(module) {
        if (myDesktopApp.diffTime) {
            Ext.MessageBox.alert('提示', myDesktopApp.diffContent);
        } else {
            var window = module.createWindow();
            try {
                window.show();
            } catch(e) {

            }
        }
    },

    getTaskbarConfig: function() {
        var me = this,
            cfg = {
                app: me,
                startConfig: me.getStartConfig()
            };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules: function(modules) {
        var me = this;
        Ext.each(modules, function(module) {
            module.app = me;
        });
    },

    getModule: function(name) {
        var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },

    onReady: function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop: function() {
        return this.desktop;
    },

    onUnload: function(e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    },

    //锁定
    onLocked: function(_this, eOpts) {
        var me = _this;
        me.getEl().on('keydown', function(e, t, eOpts) {
            if ((event.ctrlKey) && (event.keyCode == 76)) {
                e.preventDefault();
                e.stopEvent();
                locked();
            }
        });
    }
});

function locked() {
    if (myDesktopApp.diffTime) {
        Ext.MessageBox.alert('提示', myDesktopApp.diffContent);
    } else {
        var panel = Ext.getCmp('loginWindow');
        if (panel === undefined) {
            panel = createLockedWindow();
            Ext.Ajax.request({
                url: webRoot + '/sys/logout/',
                method: 'GET',
                async: false,
                scope: this,
                success: function(response) {

                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('提示', '锁定,请求超时或网络故障!');
                }
            });
            panel.show();
        }
    }
}
//锁定窗口
function createLockedWindow() {
    var dlg = Ext.create('com.dfsoft.lancet.sys.desktop.LoginWindow', {
    	modal: true,
        locked: true
    });
    return dlg;
}