/**
 * 医嘱管理的treeStore
 * @author:whw
 * @date:2014-3-12.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderStore', {
    //extend: 'Ext.data.TreeStore',
    extend: 'com.dfsoft.icu.dws.doctorordermanagement.PageTreeStore',
    model: 'com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderModel',
    autoLoad :false,
    isCenter:false,
    pageSize: 25,
    patientId:null,
    proxy: {
        type: 'ajax',
        url: webRoot + '/nws/doctorordermanagement/doctor_orders',
        actionMethods: { read: 'POST' },
        extraParams:{
            extractDate :Ext.Date.format(new Date(),'Y-m-d'),
            patientId:this.patientId,
            type:'init'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'

        },
        root:{
            expanded: true,
            ID:'0',
            CONTENT:'root',
            draggable : false
        }
    },
    listeners:{
        beforeload:function(_store, opration, eOpts ){
            if(this.locationDate!=undefined&&this.locationDate!=''){
                Ext.apply(_store.proxy.extraParams, {
                    extractDate :Ext.Date.format(new Date(this.locationDate),'Y-m-d'),
                    patientId:this.patientId,
                    currentPage:this.locationPage,
                    //start:this.locationStart,
                    //page:this.locationPage,
                    findId:this.findId,
                    type:'init'
                });
                opration.params.page=this.locationPage;
                opration.params.start=this.locationStart;
                //_store.currentPage=this.locationPage;
            }else{
                Ext.apply(_store.proxy.extraParams, {
                    extractDate :Ext.Date.format(new Date(),'Y-m-d'),
                    patientId:this.patientId,
                    type:'init'
                });
            }
            opration.params.resourceId = opration.node.data.ID;
            if(this.centerPanel){
                this.centerPanel.selectPath('/root');
            }
        },
        load:function(_this, node, records, successful, eOpts){


            if(this.queryBtnId!=null){
                Ext.getCmp(this.queryBtnId).setDisabled(false);
            }
            if(this.centerPanel&&this.centerPanel.parent.findExecuteOrderById!=null){
               // this.centerPanel.parent.nwsApp.nwsToolbar.overLoad();
                this.centerPanel.parent.locationOrdersById();
            }
            this.locationDate='';
        }
    }
})
