/**
 * 医嘱管理的treeStore
 * @author:whw
 * @date:2014-3-12.
 */
Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderStore', {
    extend: 'com.dfsoft.icu.dws.doctorordermanagement.PageTreeStore',
    model: 'com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderModel',
    autoLoad: false,
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'ajax',
        url: webRoot + '/dws/doctorordermanagement/doctor_orders',
        actionMethods: { read: 'POST' },
        extraParams: {
            extractDate: Ext.Date.format(new Date(), 'Y-m-d'),
            userId: userInfo.userId,
            type: 'init'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    },
    listeners: {
        beforeload: function (_store, opration, eOpts) {
            Ext.apply(_store.proxy.extraParams, {
                extractDate :Ext.Date.format(new Date(),'Y-m-d'),
                userId: userInfo.userId,
                type:'init'
            });
            opration.params.resourceId = opration.node.data.ID;
        },
        load:function(){
            if(this.queryBtnId!=null){
                Ext.getCmp(this.queryBtnId).setDisabled(false);
            }
        }
    }
})
