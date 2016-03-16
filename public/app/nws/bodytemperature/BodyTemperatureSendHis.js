/**
 * 功能说明: 体温单工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.bodytemperature.BodyTemperatureSendHis', {
    extend: 'Ext.window.Window',
    title: '同步体温单',
    closeAction: "hide",
    width: 400,
    height: 150,
    modal:true,
    initComponent:function(config){
        Ext.apply(this,config);
       var me=this;
       this.items=[
            {xtype: 'form', items: [
                {
                    xtype: 'fieldset',
                    border: false,
                    items: [
                        {
                            xtype: 'radiogroup',
                            fieldLabel: '',
                            name: 'syncType',  //后台返回的JSON格式，直接赋值；
                            items: [
                                {boxLabel: '当前患者', name: 'syncType', inputValue: 'current',checked: true},
                                {boxLabel: '本科室全部患者', name: 'syncType', inputValue: 'all'}
                            ]
                        },
                        {
                            xtype: 'datefield',
                            name: 'syncDate',
                            format: 'Y-m-d',
                            editable:false,
                            value:new Date(new Date().getTime()-1000*60*60*24),
                            width: 100
                        },
                        {
                            xtype: 'button',
                            text: '确定',
                            handler: function () {
                                var form = this.up('form').getForm();
                                var type = form.findField('syncType').getValue().syncType,
                                    date = form.findField('syncDate').getRawValue(),
                                    bedId = '';
                                if(me.patientInfo.STATUS_CODE!="tbge380078fd11e39fd9cb7044fb7954"&&type!='all'){
                                    Ext.MessageBox.alert('提示', '只能同步在科病人！');
                                    return false;
                                }
                                if(type=='all'){
                                    bedId=userInfo.deptId;
                                }else{
                                    if( !me.patientInfo.SID){
                                        Ext.MessageBox.alert('提示', '该患者无HIS信息！');
                                        return false;
                                    };
                                    bedId = me.patientInfo.REGISTER_ID;
                                }
                                //drug.el.mask('数据同步中...');
                                Ext.Ajax.request({
                                    url: webRoot + '/sync/bodytemperature/requestSyncTemperature',
                                    method: 'post',
                                    params: {
                                        bedId: bedId,
                                        type: type,
                                        queryDays: date
                                    },
                                    scope: this,
                                    success: function (response) {
                                        //drug.el.unmask();
                                         var respText = Ext.decode(response.responseText);
                                         if (respText["success"] == true) {
                                             if(respText.data) {
                                                 try{
                                                     JSON.parse(respText.data);
                                                     Ext.MessageBox.alert('提示', '数据同步成功！');
                                                 }catch(e){
                                                     Ext.MessageBox.alert('提示', respText.data);
                                                 }
                                             }else{
                                                 Ext.MessageBox.alert('提示', '数据同步成功！');
                                             }
                                         } else {
                                            Ext.MessageBox.alert('提示', '数据同步失败！');
                                         }
                                    },
                                    failure: function (response, options) {
                                        // drug.el.unmask();
                                        Ext.MessageBox.alert('提示', '同步数据失败,请求超时或网络故障!');
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
            }
        ];
        me.callParent();
    }

});
