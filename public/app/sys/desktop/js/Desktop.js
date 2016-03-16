Ext.define('com.dfsoft.lancet.sys.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', // dataview
        'Ext.window.Window',
        'com.dfsoft.lancet.sys.desktop.TaskBar',
        'com.dfsoft.lancet.sys.desktop.Wallpaper',
        'Ext.ux.DataView.DragSelector'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    shortcuts: null,

    shortcutItemSelector: 'div.ux-desktop-shortcut',

    shortcutTpl: [
        '<tpl for=".">',
        '<div class="ux-desktop-shortcut" id="{name}-shortcut">',
        '<div class="ux-desktop-shortcut-icon {iconCls}">',
        '<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',
        '</div>',
        '<span class="ux-desktop-shortcut-text">{name}</span>',
        '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],

    taskbarConfig: null,

    windowMenu: null,

    initComponent: function() {
        var me = this;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.bbar = me.taskbar = new com.dfsoft.lancet.sys.desktop.TaskBar(me.taskbarConfig);
        me.taskbar.windowMenu = me.windowMenu;

        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [{
                xtype: 'wallpaper',
                id: me.id + '_wallpaper'
            },
            me.createDataView()
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }
    },

    afterRender: function() {
        var me = this;
        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);
        //渲染结束时执行快捷方式重排
        Ext.Function.defer(me.initShortcut, 1);
    },

    //计算快捷方式所占用的空间，超过可见区域后进行折行显示
    initShortcut: function() {
        var btnHeight = 98;
        var btnWidth = 64;
        var btnPadding = 4;
        var col = {
            index: 1,
            x: btnPadding
        };
        var row = {
            index: 1,
            y: btnPadding
        };
        var botm;
        var numberOfItems = 0;
        var taskBarHeight = Ext.query(".ux-taskbar")[0].clientHeight + 10;
        var bodyHeight = Ext.getBody().getHeight() - taskBarHeight;
        var items = Ext.query(".ux-desktop-shortcut");
        for (var i = 0, len = items.length; i < len; i++) {
            numberOfItems += 1;
            bottom = row.y + btnHeight;
            if (((bodyHeight < bottom) ? true : false) && bottom > (btnHeight + btnPadding)) {
                numberOfItems = 0;
                col = {
                    index: col.index++,
                    x: col.x + btnWidth + btnPadding
                };
                row = {
                    index: 1,
                    y: btnPadding
                };
            }
            Ext.fly(items[i]).setXY([col.x, row.y]);
            row.index++;
            row.y = row.y + btnHeight + btnPadding;
        }
    },

    createDataView: function() {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            multiSelect: true,
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0,
            y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl),
            listeners: {
                //监听resize事件进行快捷方式折行显示
                resize: me.initShortcut
            },
            plugins: [
                Ext.create('Ext.ux.DataView.DragSelector', {})
            ]
        };
    },

    createDesktopMenu: function() {
        var me = this,
            ret = {
                items: me.contextMenuItems || []
            };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push({
            text: '平铺',
            handler: me.tileWindows,
            scope: me,
            minWindows: 1
        }, {
            text: '层叠',
            handler: me.cascadeWindows,
            scope: me,
            minWindows: 1
        })

        return ret;
    },

    createWindowMenu: function() {
        var me = this,
            items = [];
        if (mode === 'lite') {
            items = [{
                text: '还原',
                handler: me.onWindowMenuRestore,
                scope: me
            }, {
                text: '最小化',
                handler: me.onWindowMenuMinimize,
                scope: me
            }, {
                text: '最大化',
                handler: me.onWindowMenuMaximize,
                scope: me
            }];
        } else {
            items = [{
                    text: '还原',
                    handler: me.onWindowMenuRestore,
                    scope: me
                }, {
                    text: '最小化',
                    handler: me.onWindowMenuMinimize,
                    scope: me
                }, {
                    text: '最大化',
                    handler: me.onWindowMenuMaximize,
                    scope: me
                },
                '-', {
                    text: '关闭',
                    handler: me.onWindowMenuClose,
                    scope: me
                }
            ];
        }
        return {
            defaultAlign: 'br-tr',
            items: items,
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    onDesktopMenu: function(e) {
        var me = this,
            menu = me.contextMenu;
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function(menu) {
        var me = this,
            count = me.windows.getCount();

        menu.items.each(function(item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function(dataView, record) {
        var me = this;
        //与服务器时间差大于60秒
        if (myDesktopApp.diffTime) {
            Ext.MessageBox.alert('提示', myDesktopApp.diffContent);
        } else {
            var module = me.app.getModule(record.data.module),
                win = module && module.createWindow();

            if (win) {
                me.restoreWindow(win);
            }
        }
    },

    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    onWindowMenuBeforeShow: function(menu) {
        var items = menu.items.items,
            win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function(menu) {
        Ext.defer(function() {
            menu.theWin = null;
        }, 1);
    },

    onWindowMenuMaximize: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();
    },

    onWindowMenuMinimize: function() {
        var me = this,
            win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function() {
        var me = this,
            win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    getWallpaper: function() {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd,
                resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function(wallpaper, stretch) {

        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    cascadeWindows: function() {
        var x = 0,
            y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },

    createWindow: function(config, cls) {
        var me = this,
            win, cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true
            });

        cls = cls || Ext.window.Window;
        win = me.add(new cls(cfg));

        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;

        win.on({
            activate: me.updateActiveWindow,
            beforeshow: me.updateActiveWindow,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            boxready: function() {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });

        win.doClose = function() {
            win.doClose = Ext.emptyFn;
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function() {
                        win.destroy();
                    }
                }
            });
        };

        return win;
    },

    getActiveWindow: function() {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            zmgr.eachTopDown(function(comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function() {
        var windows = this.windows;
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function(win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this,
            availWidth = me.body.getWidth(true);
        var x = me.xTickSize,
            y = me.yTickSize,
            nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function() {
        var me = this,
            activeWindow = me.getActiveWindow(),
            last = me.lastActiveWindow;
        if (activeWindow === last) {
            return;
        }

        if (last && last.el) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    }
});