/**
 *时间选择window
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DateSelectWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: true,
    //header:false,
    width: 270,
    height: 112,
    border: false,
    initComponent: function () {
        var me = this;
        me.buttons = [
            {
                text: '确定',
                iconCls: 'order-submit',
                handler: me.onOK,
                scope: me
            },
            {
                text: '取消',
                iconCls: 'order-remove',
                handler: me.close,
                scope: me
            }
        ];

        me.items = [
            {
                xtype: 'panel',
                padding:'5 5 5 5',
                items: [
                    {
                        xtype: 'datetimefield',
                        name: 'REQUEST_DATE',
                        id: me.id+'REQUEST_DATE',
                        fieldLabel: '<span style="display:block;color:red;font-size:21px;float:left;padding-top:4px;">*</span>执行时间',
                        format: 'Y-m-d H:i',
                        width: 250,
                        labelWidth: 78,
                        allowBlank: false,
                        editable: false,
                        value: new Date(),
                        trigger1Cls: Ext.baseCSSPrefix + 'form-date-trigger'
                    }
                ]

            }
        ];

        me.callParent();
    },
    listeners: {
        beforeclose: function (_panel, eOpts) {
            this.parent.isOpen = false;
        },
        afterrender:function(_this, eOpts ){
            var me=this;
            if(me.flag!=undefined&&me.flag=='upd'){
                var last=Ext.Date.parse(me.current.tooltip, "Y-m-d H:i", true);
                Ext.getCmp(me.id+'REQUEST_DATE').setValue(last);
            }
        }
    },
    onOK: function () {
        var me = this;
        var selDateO = Ext.getCmp(me.id+'REQUEST_DATE');
        if(!selDateO.isValid()){
            Ext.MessageBox.show({
                title: '提示',
                msg: '执行时间不能为空！',
                width: 200,
                modal: true,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var selDate=selDateO.getValue();
        if(selDate.getTime()>new Date().getTime()){
            Ext.MessageBox.show({
                title: '提示',
                msg: '执行时间不能大于当前时间！',
                width: 200,
                modal: true,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var heardColumn = Ext.Date.format(selDate, 'H:i');
        var tooltip = Ext.Date.format(selDate, 'Y-m-d H:i');
        var col,first=-1;
        for (var i = 12; i < me.cols.length; i++) {
            var heard = me.cols[i];
            if (heard.dataIndex == me.current.dataIndex) {
                col = heard;
                if(first!=-1&&first<i){
                    Ext.MessageBox.show({
                        title: '提示',
                        msg: '当前时间列之前还存在空的时间列<br/>请按顺序录入！',
                        width: 200,
                        modal: true,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    return;
                }
            }
            if(first==-1&&heard.tooltip=='时间'){
                first=i;
            }
            if (heard.tooltip == tooltip) {
                Ext.MessageBox.show({
                    title: '提示',
                    msg: '当前时间：' + tooltip + '已经存在，<br/>时间点之间最少间隔1分钟。',
                    width: 200,
                    modal: false,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                return;
            }
        }
        if(me.flag!=undefined&&me.flag=='upd'){
            Ext.Ajax.request({
                url : webRoot + '/nws/doctorordermanagement/del_orderslog',
                method: 'POST',
                params:{
                    exceteDate:me.current.tooltip,
                    newexceteDate:tooltip,
                    flag:'upd',
                    orderId:null
                },
                success : function(response){
                }
            });
            var root=me.parent.getRootNode();
            var childs=root.childNodes;
            if(childs.length>0){
                debugger;
                for(var i=0;i<childs.length;i++){
                    var nd=childs[i];
                    var record=me.parent.getView().getRecord(nd);
                    var logss=record.get('logs');
                    for(var j=0;j<logss.length;j++){
                        var log=logss[j];
                        if(Ext.Date.format(new Date(log.EXECUTION_TIME), 'Y-m-d H:i')==me.current.tooltip){
                            log.EXECUTION_TIME=tooltip+":00";
                        }
                    }
                }
            }
        }
        col.text = heardColumn;
        col.tooltip = tooltip;
        me.current.setText(heardColumn);
        me.current.tooltip = tooltip;
        me.parent.reconfigure(me.parent.store, me.cols);
        me.parent.setStateWarning(true);
        me.close();
    },
})