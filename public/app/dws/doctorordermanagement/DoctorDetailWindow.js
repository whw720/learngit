/**
 * 详细信息window
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    width: 520,
    height: 380,
    resizable:false,
    border: false,
    initComponent: function() {
        var me = this;
        Ext.apply(me,{
            items : [Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailPanel', {
             parent: me
             })]
        });
        me.callParent();
    }
})