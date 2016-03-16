/**
 * 功能说明: Demo模块
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View',
        'com.dfsoft.icu.demo.DemoToolbar',
        'com.dfsoft.icu.demo.DemoGrid'
    ],

    id: 'demo',//注意id一定要与yDesktop.App.getModules 的module保持一致，否则无法通过快捷方式打开 todo

    init: function() {
        Ext.util.CSS.swapStyleSheet('aam.css', '/app/icu/demo/css/aam.css');

        this.launcher = {
            text: 'DEMO',
            iconCls: 'aam-small'
        }
    },

    //必须实现此方法
    createNewWindow: function() {
        var me = this,
            desktop = me.app.getDesktop();

        me.demoGrid = new com.dfsoft.icu.demo.DemoGrid({region: 'center'});
        me.demoToolbar = new com.dfsoft.icu.demo.DemoToolbar({region: 'north', demoApp: me});

        return desktop.createWindow({
            id: me.id,
            title: 'DEMO',
            iconCls: 'aam-small',
            width: 940,
            height: 600,
            animCollapse: false,
            constrainHeader: false,
            layout: {
                type: 'border',
                padding: 0
            },
            defaults: {
                split: false
            },
            items: [me.demoToolbar, me.demoGrid]
        });
    },

    //必须实现此方法
    createWindow: function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    }
});