/**
 * 功能说明:  选择床位 window
 * @author: 杨祖文
 */

Ext.define('com.dfsoft.icu.nws.bedmanagement.SelectBedWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.SelectBedPanel'
    ],
    //patientInfo: null, // 回调获取当前床位上的病人信息
    initComponent 	: function(){
        var me = this;
        me.selectBedPanel = new com.dfsoft.icu.nws.bedmanagement.SelectBedPanel({
            parent: me
        });
        Ext.apply(me, {
            //title: '选择床位',
            header: false,
            iconCls: 'select-bed',
            layout: 'fit',
            width: 920,
            height: 210,
            items:[me.selectBedPanel]
        });
        me.callParent();
        //添加自定义事件
        me.addEvents({
            "toback": true
        });
        me.on("toback", function() {
            me.close();
        });
    }
});