/**
 * 管道调整GRID页面
 * Created by whw on 2015-03-04.
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.pipeAdjustGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pipeadjustpanel',
    columnLines: true,
    initComponent: function () {
        var me = this;
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            autoCancel: false,
            listeners: {
                beforeedit:function (editor, context) {
                    var conRecode = context.grid.getSelectionModel().lastSelected;
                    if(conRecode&&conRecode.data){
                        conRecode.data.ADJUST_TIME=new Date(conRecode.data.ADJUST_TIME);
                    }
                },
                edit: function (editor, context) {

                    var conRecode = context.grid.getSelectionModel().lastSelected;
                    if(conRecode.data.ADJUST_TIME==null||conRecode.data.ADJUST_TIME==""){
                        conRecode.data.ADJUST_TIME=new Date();
                        Ext.MessageBox.alert('提示', '调整时间不能为空！');
                        return ;
                    }
                    var useConParams = {
                        ID: conRecode.data.ID,//耗材使用唯一标识
                        CATHETER_ID :me.CATHETER_ID,//管道标识
                        ADJUST_TIME: conRecode.data.ADJUST_TIME,//调整日期
                        userId: userInfo.userId,
                        INTUBATION_DEPTH: conRecode.data.INTUBATION_DEPTH//深度
                    };
                    Ext.Ajax.request({
                        url: webRoot + '/icu/nursingRecord/pipeline/addPipeAdjust',
                        method: 'POST',
                        params: useConParams,
                        success: function (response) {
                            var reqmsg = Ext.decode(response.responseText);
                            if (reqmsg.success) {
                                me.store.load();
                            }
                        }
                    });
                }
            }
        });
        me.store=new Ext.data.Store({
            fields: ['ID', 'CATHETER_ID','ADJUST_TIME','INTUBATION_DEPTH'],
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                extraParams:{
                    CATHETER_ID :me.CATHETER_ID
                },
                url: webRoot + '/icu/nursingRecord/pipeline/queryAdjust',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        Ext.apply(me, {
            border: true,
            autoScroll: true,
            enableColumnHide: false,
            region:'center',
            store:me.store,
            plugins:[me.rowEditing],
            columns: [
                {
                    xtype: 'rownumberer',
                    text: '序号',
                    width: 45,
                    align: 'center'
                },
                {
                    text: '调整时间',
                    width: 122,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'ADJUST_TIME',
                    renderer: me.formatTime,
                    editor: {
                        xtype: 'datetimefield',
                        editable:false,
                        format: 'Y-m-d H:i'
                    }
                },
                {
                    text: '置管深度(CM)',
                    width: 120,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'INTUBATION_DEPTH',
                    editor: {
                        xtype: 'textfield',
                        maxLength:6,
                        maxLengthText:'最长允许输入6个字符'
                    }
                }
            ]
        });
        me.callParent();
    },
    formatTime: function (value) {
        return value ? Ext.Date.format(new Date(value), 'Y-m-d H:i') : '';
    }
});