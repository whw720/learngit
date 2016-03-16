/**
 * 通讯状态页面
 * @author:whw
 * @date:2014-3-24.
 */
Ext.define('com.dfsoft.icu.nws.networkstate.AdapterDetailWindow', {
    extend: 'Ext.window.Window',
    requires:['com.dfsoft.icu.nws.networkstate.MonitorItemGrid'],
    layout: 'border',
    iconCls: 'network-state-small',
    title: '设备详细',
    width: 500,
    height: 418,
    border: false,
    bodyStyle: 'background: white',
    initComponent: function (){
        Ext.util.CSS.swapStyleSheet('networkstate.css', webRoot + '/app/nws/networkstate/css/networkstate.css');
        var me = this;
        me.monitorItemGrid = new com.dfsoft.icu.nws.networkstate.MonitorItemGrid();
        if (me.REGISTER_ID == ""){
            me.REGISTER_ID = "null";
        }
        //获取设备信息
        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: '详细信息',
                    region:'north',
                    height: 135,
                    collapsible: true,
                    margin: '0 3 0 3',
                    padding: '0 5 0 5',
                    layout: 'column',
                    columns: 2,
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'temp',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '设备名称',
                            allowBlank: false,
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'pam',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '开始时间',
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'fc',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '末采时间',
                            margin: '2 1 2 1',
                            labelAlign: 'right'

                        },
                        {
                            xtype: 'textfield',
                            name: 'fr',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '采集次数',
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'pao',
                            id:me.mod + 'paooo',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '出错时间',
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'aa',
                            columnWidth: 0.50,
                            labelWidth: 70,
                            fieldLabel: '错误次数',
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'pio',
                            columnWidth: 1,
                            labelWidth: 70,
                            fieldLabel: '错误日志',
                            margin: '2 1 2 1',
                            labelAlign: 'right'
                        }
                    ]},
                {
                    xtype: 'fieldset',
                    title: '监护项目',
                    region:'center',
                    collapsible: true,
                    margin: '0 3 3 3',
                    padding: '0 5 3 5',
                    height: '100%',
                    layout: 'fit',
                    items: [
                        me.monitorItemGrid
                    ]}


            ],
            buttons: [ {
                text: '关闭',
                iconCls: 'cancel',
                scope: me,
                handler: function() {
                    me.close();
                }
            }]
        });
        me.callParent();
    }
});