/**
 * 功能说明: Demo窗口
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.demo.DemoFormWindow', {
    extend: 'Ext.window.Window',
    requires: ['com.dfsoft.icu.demo.DemoForm'],
    initComponent 	: function(){
        var proxy = this;
        proxy.demoForm = new com.dfsoft.icu.demo.DemoForm({win: proxy});

        Ext.apply(this, {
            title 	  : 'Demo窗口',
            height 	  : 400,
            width 	  : 400,
            modal 	  : true,
            closeAction : 'hide',
            items	  : [
                proxy.demoForm
            ]
        });
        this.callParent();
    }
});