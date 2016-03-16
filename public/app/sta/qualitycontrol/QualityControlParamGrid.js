/**
 * Created by whw on 15-8-19.
 */
/**
 * Created by whw on 15-8-18.
 */

Ext.define('com.dfsoft.icu.sta.qualitycontrol.QualityControlParamGrid', {
    extend: 'Ext.grid.Panel',

    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['QUALITY_CONTROL_CODE',
                'QUALITY_CONTROL_NAME',
                'RESULT'],
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                url: webRoot + '/sta/qualitycontrol/queryQualitycontrolParam',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners: {
                beforeload: function (_store, opration, eOpts) {
                    var nowStr=new Date().Format("yyyy");
                    Ext.apply(_store.proxy.extraParams, {
                        year: nowStr
                    });
                }
            },
            autoLoad: true
        });
        me.col = [
            {
                text: '参数',
                dataIndex:'QUALITY_CONTROL_NAME',
                width:600,
                sortable: false,
                align: 'left'
            },
            {
                text: '值',
                dataIndex:'RESULT',
                width:180,
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                align: 'right',
                cls:'sta-border-rigth-css',
                editor:{
                    xtype: 'numberfield',
                    decimalPrecision: 3,
                    minValue:0,
                    negativeText:'不能输入负数',
                    maxLength:7,
                    maxLengthText:"最大不能超过7位数",
                    hideTrigger: true
                }
            }
        ];

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide:false,
            border:false,
            layout:'fit',
            store: me.store,
            columns: me.col,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            listeners:{
                itemclick:function(_this, record, item, index, e, eOpts ){
                },
                edit:function(editor, e){
                    if(e.value==''||e.value==e.originalValue){
                        e.record.commit();
                        return;
                    }
                    if(e.value.length>20){
                        return;
                    }
                    var orderForm = me.parent.getForm();
                    var year = Ext.getCmp(me.parent.id+'quality-year').getValue();
                    Ext.Ajax.request({
                        url: '/sta/qualitycontrol/updateQualitycontrolParam',
                        method: 'POST',
                        scope: this,
                        params: {
                            code:e.record.get("QUALITY_CONTROL_CODE"),
                            resultValue:e.value,
                            year:year
                        },
                        success: function(response) {
                            var resJson = Ext.decode(response.responseText);
                            if(resJson.success){
                                me.getStore().load();
                            }
                        },
                        failure: function(response, options) {
                            Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                        }
                    });
                }
            }
        });
        me.callParent();
    }
});