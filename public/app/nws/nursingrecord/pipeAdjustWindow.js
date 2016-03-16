/**
 * 护理记录-管道页面-调整增加窗口
 * Created by whw on 2015-3-4.
 */
/**
 * 出量增加框
 * Created by whw on 2014-12-30.
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.pipeAdjustWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.pipeadjustwindow',
    layout: 'border',
    //modal: true,
    //header:false,
    iconCls:'doctor-scan',
    width: 340,
    height: 318,
    border: false,
    initComponent: function() {
        var me = this;
        me.quliangGridPanel=me.createQuliangPanel();
        Ext.apply(me,{

            title:me.pipeName+' 管道调整',
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                items:[ '->',{
                    action: 'refresh_button',
                    iconCls: 'add',
                    tooltip:'增加',
                    labelAlign: 'right',
                    handler: function () {
                        me.quliangGridPanel.rowEditing.cancelEdit();
                        var r = [
                            {
                                ID: '',
                                CATHETER_ID:me.CATHETER_ID,
                                INTUBATION_DEPTH:'',
                                ADJUST_TIME: new Date()
                            }
                        ];

                        me.quliangGridPanel.store.insert(0, r);
                        me.quliangGridPanel.rowEditing.startEdit(0, 0);
                    }
                },{
                    action: 'refresh_button',
                    iconCls: 'delete',
                    tooltip:'删除',
                    labelAlign: 'right',
                    handler: function () {
                        var grid = me.quliangGridPanel;
                        var records = grid.getSelectionModel().getSelection();
                        if (records.length <= 0) {
                            Ext.MessageBox.alert('提示', '请选择需要删除的记录！');
                            return;
                        }
                        Ext.Ajax.request({
                            url: webRoot + '/icu/nursingRecord/pipeline/delPipeAdjust',
                            method: 'POST',
                            params: {
                                ID:records[0].get('ID')
                            },
                            success: function (response) {
                                var reqmsg = Ext.decode(response.responseText);
                                if (reqmsg.success) {
                                    grid.store.load();
                                }
                            }
                        });
                        grid.store.remove(records[0]);
                    }
                }
                ]
            }],
            items :[me.quliangGridPanel]
        });
        me.callParent();
    },
    createQuliangPanel:function(){
        var me=this;
        var form = Ext.create('com.dfsoft.icu.nws.nursingrecord.pipeAdjustGridPanel', {
            parent: me,
            CATHETER_ID:me.CATHETER_ID
        });
        return form;
    }
});
