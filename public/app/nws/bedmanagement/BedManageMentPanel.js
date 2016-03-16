/**
 * 功能说明: 床位管理panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.BedManageMentPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.WaitToDeptGrid',
        'com.dfsoft.icu.nws.bedmanagement.AlreadyToDeptPanel',
        'Ext.dd.DropTarget'
    ],
    initComponent: function() {
        Ext.QuickTips.init();
        var me = this;
        //对于异常数据进行特殊处理，床位状态是占用但没有在科患者，床位状态是未占用但存在在科患者。王小伟 2015-06-05
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/icu_beds/updateBedUsedStatus',
            method: 'post',
            async: false,
            params : {
            },
            success : function(response) {
            }
        });
        me.waitDept = new com.dfsoft.icu.nws.bedmanagement.WaitToDeptGrid({
            parent: me
        });
        me.alreadyDept = new com.dfsoft.icu.nws.bedmanagement.AlreadyToDeptPanel({
            parent: me
        });
        Ext.apply(me, {
            layout: 'border',
            title: '床位管理',
            closable: true,
            border: false,
            items: [me.waitDept, me.alreadyDept]
        });
        var resourceData = userInfo.resource;
        // 如果当前登录人员是ICU下才进行权限判断
        if (userInfo.deptType == 'I') {
            for (var i = 0; i < resourceData.length; i++) {
                var currButton = Ext.getCmp('bedmanager_' + resourceData[i].id);
                if (currButton != undefined) {
                    currButton.setDisabled(false);
                }
            }
            // 否则已入科患者操作全部disabled
        } else {
            var buttons = me.alreadyDept.getDockedItems('toolbar[dock="top"]')[0].items.items;
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].xtype == 'button') {
                    buttons[i].setDisabled(true);
                }
            }
        }
        me.callParent();
    },

    //设置当前病人信息
    setPatientInfo: function(patientInfo) {
        var me = this;
        me.patientInfo = patientInfo;
        //更改当前病人信息后，重新勾选默认
        if (me.nwsApp.tabPanel.getActiveTab().title === '床位管理') {
            var portal = me.alreadyDept.down('portalpanel');
            me.alreadyDept.locateTarget=null;
            me.alreadyDept.initBedInfo(portal, portal.getWidth());
        }
    },
});