/**
 * 详细信息window
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorDetailWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    width: 520,
    height: 380,
    resizable: false,
    border: false,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            title: me.addOrderTitle,
            items: [Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorDetailPanel', {
                parent: me,
                PARENT_ORDER_ID: me.PARENT_ORDER_ID
            })]
        });
        me.callParent();
    }
})