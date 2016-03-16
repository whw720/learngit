/**
 * 批量增加耗材窗口
 * Created by whw720 on 2014/9/12.
 */
Ext.define('com.dfsoft.icu.nws.consumables.BatchAddConsumableWindow', {
    extend: 'Ext.window.Window',
    alias : 'widget.batchaddConsumableWindow',
    requires:['com.dfsoft.icu.nws.consumables.BatchAddConsumablePanel'],
    initComponent 	: function(){
        var proxy = this;
        proxy.batchPanel=proxy.createBatchAddConsumablePanel();
        Ext.apply(proxy, {
            layout: 'fit',
            title: '批量新增弹出窗口',
            modal: true,
            width: 760,
            height: 400,
            border: false,
            //resizable: false,
            //closeAction: 'hide',

            buttons: [ '->', {
                text: '确定',
                iconCls: 'save',
                handler: function() {
                    proxy.consumablePanel.fastAdd(proxy.batchPanel.getStore());
                    proxy.close();
                }
            }, {
                text: '取消',
                iconCls: 'cancel',
                handler: function() {
                    proxy.close();
                }
            }],
            items: [proxy.batchPanel],
            listeners: {
                close: function(_panel, eOpts) {
                    //var medicineBeforeAnaesthesiaDrugsInfoData = pageJsObj.beforeMedication.dataArray;
                    //proxy.batchPanel.getStore().loadData(medicineBeforeAnaesthesiaDrugsInfoData, false);
                }
            }
        });
        this.callParent();
    },
    createBatchAddConsumablePanel:function(){
        var panel = Ext.create('com.dfsoft.icu.nws.consumables.BatchAddConsumablePanel', {
            parent: this
        });
        return panel;
    }
});