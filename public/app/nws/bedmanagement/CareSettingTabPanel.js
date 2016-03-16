/**
 * 功能说明:  监护设置 tab
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareSettingTabPanel', {
    extend: 'Ext.tab.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.BasicSettingsForm',
        'com.dfsoft.icu.nws.bedmanagement.CareProjectTreeGrid'
    ],
    initComponent 	: function(){
        var me = this;
        me.basicSettingsForm = new com.dfsoft.icu.nws.bedmanagement.BasicSettingsForm();
        me.careProjectTreeGrid = new com.dfsoft.icu.nws.bedmanagement.CareProjectTreeGrid({
            parent: me.parent
        });
        Ext.apply(me, {
            activeTab: 0,
            plain: true,
            layout: 'fit',
            padding: 5,
            tabBar: {
                defaults: {
                    width: 90
                }
            },
            items:[me.basicSettingsForm, me.careProjectTreeGrid]
        });
        me.callParent();
    }
});