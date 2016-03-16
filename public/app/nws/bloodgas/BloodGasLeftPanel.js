/**
 * Created by whw on 14-6-16.
 */
Ext.define('com.dfsoft.icu.nws.bloodgas.BloodGasLeftPanel', {
    extend: 'Ext.grid.Panel',
    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        me.store=Ext.create('Ext.data.Store',{
            fields:['associate_id','bloodId','blood_type','blood_date'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/bloodgas/query-blood-left',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners:{
                beforeload:function(_store){
                   // console.log(me.parent.patientInfo);
                    if(me.parent.patientInfo == null){
                        Ext.MessageBox.alert('提示', '请选择一位患者！');
                    }else{
                        Ext.apply(_store.proxy.extraParams, {

                            pid :me.parent.patientInfo.PATIENT_ID
                        });
                    }


                }
            },
            autoLoad: true
        });
        Ext.apply(me,{
            columnLines: true,
            store:me.store,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [
                { header: '序号',  xtype: 'rownumberer',width:40,align:'center' },
                { header: '检验时间',
                    dataIndex: 'blood_date',
                    align:'center',
                    width:122
                },
                { header: '标本号', dataIndex: 'associate_id',width:110,
                    style:{
                        'text-align':'center'
                    },
                    align:'right',
                    editor:{
                        xtype:'textfield',
                        maxlength:4000
                    }
                }
            ],
            listeners:{
                edit:function(editor,e){
                        Ext.Ajax.request({
                            url : webRoot +'/nws/bloodgas/save-simple-code',
                            method: 'POST',
                            params:{
                                simpleCode:e.value,
                                id:e.record.get('bloodId')
                            },
                            success : function(response){
                                me.getStore().load();
                            }
                        });
                },
                itemclick:function(_this, record, item, index, e, eOpts ){
                    var rightStore=me.parent.bloodPanel.getStore();
                    rightStore.on('beforeload', function (store, options) {
                        Ext.apply(store.proxy.extraParams, {
                            pid:record.get('bloodId')
                        });
                    });
                    rightStore.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            for(var i = 0;i<records.length;i++){
                                var itemcodes = records[i].data.code;
                                for(var di = 0;di < me.parent.defaultItems.length;di++){
                                    var defaultCode = me.parent.defaultItems[di];
                                    if(itemcodes == defaultCode){
                                        records[i].set("SEL",true);
                                        records[i].commit();
                                    }
                                }
                            }


                        }
                    });
                }
            }
        });
        me.callParent();
    }
});