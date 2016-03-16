/**
 * 功能说明:  帮助 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.HelpWindow', {
    extend: 'Ext.window.Window',
    requires: [
    ],
    width: 460,
    height: 300,
    initComponent:function(){
        var me = this;
        Ext.apply(me, {
            title: '评分说明',
            header: true,
            iconCls: 'ico-help',
            layout: 'fit',
            items: [
                {xtype: 'panel',
                    laout: 'fit',
                    border:true,
                    margin:'5 5 5 5',
                    html: '<iframe id="help" frameborder="0" src="../app/nws/nursingscores/' + me.itempath + '/help.html" width="100%" height="100%"></iframe>'
                }
            ]
        });
        me.callParent();
    }
});