/**
 * Created by dfsoft on 14-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorExtractWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: false,
    //header:false,
    title:'提取医嘱',
    iconCls:'doctor-ask-small',
    width: 900,
    height: 418,

    border: false,
    initComponent: function() {
        var me = this;
        me.requestForm=me.createRequestForm();

        Ext.apply(me,{dockedItems:[{
            xtype: 'toolbar',
            dock: 'top',
            style:{
                'padding-bottom':'0px'
            },
            items:['待提取医嘱', '->',{
                xtype : 'datefield',
                id : me.id+'extract',
                fieldLabel : '日期',
                format: 'Y-m-d',
                width:180,
                value:new Date(),
                editable:false,
                msgTarget:'none',
                preventMark:true,
                labelWidth:58,
                labelAlign:'right'
            },{
                action : 'refresh_button',
                iconCls : 'order-refresh',
                labelAlign:'right',
                tooltip:'提取所有床位医嘱',
                handler:function(btn){
                    btn.setDisabled(true);
                    var selDate=Ext.getCmp(me.id+'extract').getValue();
                    var timeStamp=new Date(Ext.Date.format(selDate,'Y-m-d')).getTime();
                    Ext.Ajax.request({
                        url: webRoot + '/link/drug/requestSyncOrders' ,
                        timeout: 60000,
                        params: {
                            provider    : 'medical-orders-icu',
                            timestamp: timeStamp,
                            identifier  : 'null',
                            timestampEnd : 'null',
                            model : 'HIS'
                        },
                        method: 'GET',
                        scope: this,
                        success: function(response) {
                            btn.setDisabled(false);
                            var result = Ext.decode(response.responseText);
                            if (result.data.success) {
                                console.log(result.data);
                            }else{
                                if(result.data.msg!="返回数据为空"){
                                    Ext.MessageBox.alert('提取所有床位医嘱失败',result.data.msg);
                                }
                            }

                        },
                        failure: function(response, options) {
                            btn.setDisabled(false);
                            Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                        }
                    });
                }
            },{
                action : 'down_button',
                iconCls : 'order-down',
                labelAlign:'right',
                hidden:true,
                tooltip:'提取选中的医嘱'
            }
            ]
        }],
            items:[me.requestForm
            ]
        });
        me.callParent();
    },
    createRequestForm:function(){
        var form = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorExtractPanel', {
            parent: this
        });
        return form;
    }
})