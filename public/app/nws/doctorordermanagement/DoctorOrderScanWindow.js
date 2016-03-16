/**
 * 医嘱扫描window
 * @author:whw
 * @date:2014-3-21.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderScanWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: false,
    //header:false,
    title:'医嘱扫描',
    iconCls:'doctor-scan',
    width: 780,
    height: 418,

    border: false,
    initComponent: function() {
        var me = this;
        me.scanGridPanel=me.createScanForm();
        me.cp = new Ext.state.CookieProvider();
        Ext.state.Manager.setProvider(me.cp);
        if(me.cp.get('scanauto')==null){
            me.cp.set('scanauto',true);
        }
        me.indexNum=0;
        me.buttons = [
            {
                text: '执行',
                iconCls: 'save',
                scope: me,
                handler:function(){
                    me.saveOrders();
                }
            },
            {
                text: '取消',
                iconCls: 'cancel',
                handler: me.close,
                scope: me
            }
        ];
        Ext.apply(me,{

            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                style:{
                    'padding-bottom':'0px'
                },
                items:[ '->',
                    /*{
                    xtype : 'datefield',
                    id : me.id+'-scan-colltime',
                    fieldLabel : '日期',
                    format: 'Y-m-d',
                    width:220,
                    editable:false,
                    value:this.colltime,
                    msgTarget:'none',
                    preventMark:true,
                    labelWidth:58,
                    labelAlign:'right'
                },*/{
                    xtype : 'textfield',
                    id:me.id+'-scan-code',
                    maxLength:15,
                    maxLengthText:'只输入15位数',
                    fieldLabel : '条码',
                    editable:false,
                    width:350,
                    msgTarget:'none',
                    labelWidth:58,
                    labelAlign:'right'
                },{
                    xtype : 'button',
                    text : '查询',
                    labelAlign:'right',
                    handler:function(){
                        me.queryBarCode();
                    }
                },{
                    xtype:'checkboxfield',
                    style:{
                        'padding-left':'10px'
                    },
                        id:me.id+'-scan-auto',
                        checked:me.cp.get('scanauto'),
                    boxLabel : '自动执行医嘱',
                    labelAlign:'right',
                        listeners:{
                            change:function(_this, newValue, oldValue, eOpts ){
                                me.cp.set('scanauto',newValue);
                            }
                        }
                }
                ]
            }],
            items :[me.scanGridPanel]
        });
        me.callParent();
    },
    createScanForm:function(){
        var form = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderScanPanel', {
            parent: this
        });
        return form;
    },
    queryBarCode:function(){
        var me=this;
        var treePanel=me.scanGridPanel;
        var code=Ext.getCmp(me.id+'-scan-code').getValue();
        var colltime=new Date().Format('yyyy-MM-dd');//Ext.getCmp(me.id+'-scan-colltime').getValue();

        var store=treePanel.getStore();
        var root=treePanel.getRootNode();
        var patientId=null;
        if(me.patientInfo!=null){
            patientId=me.patientInfo.PATIENT_ID;
        }
        Ext.Ajax.request({
            url : webRoot + '/nws/doctorordermanagement/doctor_orders',
            method: 'POST',
            params:{
                type:'scan',
                extractDate : colltime,
                patientId:patientId,
                barcode:code
            },
            success : function(response){
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    if(result.data.length>0){
                        var isHave=true;
                        for(var m=0;m<root.childNodes.length;m++){
                            if(root.childNodes[m].get('ID')==result.data[0].ID){
                                isHave=false;
                                break;
                            }
                        }
                        if(isHave){
                            //console.log(result.data[0]);
                            //result.data[0].data=null;
                            me.indexNum++;
                            result.data[0].NUM=me.indexNum;
                            var child =root.appendChild(result.data[0]);
                            if(result.data[0].child_count!=0){
                                Ext.Ajax.request({
                                    url: webRoot + '/nws/doctorordermanagement/doctor_orders',
                                    method: 'POST',
                                    params: {
                                        type: 'scan',
                                        resourceId:result.data[0].ID,
                                        extractDate: colltime,
                                        patientId: patientId,
                                        barcode: code
                                    },
                                    success: function (response) {
                                        var result1 = Ext.decode(response.responseText);
                                        if (result1.success) {
                                            if (result1.data.length > 0) {
                                                for(var j=0;j<result1.data.length;j++){
                                                    child.appendChild(result1.data[j]);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });


    },
    saveOrders:function(){
        var me=this;
        var auto=Ext.getCmp(me.id+'-scan-auto').getValue();
        if(auto){
            var treePanel=me.scanGridPanel;
            var childnodes=treePanel.getRootNode().childNodes;
            var str='',names='',select=false;
            for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
                var nd = childnodes[i];
                if(nd.get('IS_SELECTED')){
                    select=true;
                    if(nd.get('EXECUTION_STATE')!=2&&(nd.get('DOSAGE_ALL')-nd.get('DOSAGE_COMPLETED_ALL'))>0){
                        str+='"'+nd.get('ID')+'*'+(nd.get('DOSAGE_ALL')-nd.get('DOSAGE_COMPLETED_ALL'))+'*'+nd.get('PUMPS_SPEED')+'*'+nd.get('CONTENT_TYPE')+'",';
                        names+=nd.get('SHORT_NAME')+',';
                    }
                }
            }
            if(str.length>1){
                str=str.substr(0,str.length-1);
                Ext.Ajax.request({
                    url : webRoot + '/nws/doctorordermanagement/auto_orders',
                    method: 'POST',
                    params:{
                        ids:str,
                        userId:userInfo.userId,
                        flag:1
                    },
                    success : function(response){
                        me.close();
                    }
                });
                me.close();
                me.parent.queryOrder();
            }else{
                if(!select){
                    Ext.MessageBox.show({
                        title:'提示',
                        msg:'请选择需要自动执行的医嘱!',
                        width:200,
                        modal:true,
                        buttons:Ext.MessageBox.OK,
                        icon:Ext.MessageBox.INFO
                    });
                    return;
                }
                me.close();
            }
        }else{
            /*Ext.MessageBox.show({
                title:'提示',
                msg:'请勾选自动执行医嘱复选框!',
                width:200,
                modal:true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });*/
            me.close();
        }
    }

})
