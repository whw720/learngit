Ext.define('com.dfsoft.icu.medicalrecord.MedicalWindow', {
    extend: 'Ext.window.Window',
    requires:['Ext.ux.IFrame'],
    uses: [

    ],

    layout: 'fit',
    title: '医嘱信息',
    modal: true,
    width: 1080,
    height: 600,
    border: false,
    iconCls: 'doctor-ask',
    maximizable: true,
    initComponent: function() {
        var me = this;
        var routeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                {
                    name: 'text',
                    type: 'string'
                },
                {
                    name: 'id',
                    type: 'string'
                },
                {
                    name: 'HELPER_CODE',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/doctorordermanagement/route_tree',
                actionMethods: { read: 'POST' },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        me.isClick = false;
        routeStore.load();
        me.dockedItems=[{
            xtype: 'toolbar',
            dock: 'top',
            // height:30,
            border:false,
            //padding:'0 0 0 3',
            padding:'5 0 0 0',
            //margin:'0 0 -5 0',
            items : ['->',
                {
                    xtype : 'datefield',
                    name : 'doctor-order-extract-time',
                    fieldLabel : '提取日期',
                    format: 'Y-m-d',
                    value:me.EXTRACT_TIME?me.EXTRACT_TIME:new Date(),
                    width:170,
                    editable:false,
                    labelWidth:58,
                    labelAlign:'right'
                },{
                    xtype : 'combo',
                    name : 'doctor-order-status',
                    fieldLabel : '状态',
                    width:125,
                    editable:false,
                    allowBlank : false,

                    blankText : '请输入执行状态',
                    valueField: 'selValue',
                    value:(me.ORDER_STATUS||me.ORDER_STATUS==-1)?(me.ORDER_STATUS==2||me.ORDER_STATUS==3||me.ORDER_STATUS==1?'1':(me.ORDER_STATUS=='-1'?'-1':'0')):'-1',
                    displayField: 'disValue',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['disValue','selValue','icon'],
                        data:[{'disValue':'全部','selValue':'-1','icon':'mei'},{'disValue':'未执行','selValue':'0'},{'disValue':'已执行','selValue':'1'}]
                    }),
                    msgTarget:'none',
                    preventMark:true,
                    labelWidth:30,
                    labelAlign:'right'
                }, {
                    xtype: 'hidden',
                    name: 'doctor-order-way-hidden',
                    value: me.ORDER_WAY
                }, {
                    xtype: 'comboboxtree',
                    name: 'doctor-order-way1',
                    fieldLabel: '途径',
                    labelWidth: 38,
                    //width: 250,
                    rootVisible: false,
                    displayField: 'text',
                    valueField: 'id',
                    value: me.ORDER_NAME,
                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    trigger2Cls: Ext.baseCSSPrefix,
                    onTrigger1Click: function () {
                        this.setRawValue('');
                        this.setValue('');
                        var toolbar = me.dockedItems.items[1];
                        toolbar.down('hidden[name=doctor-order-way-hidden]').setValue("");
                    },
                    editable: true,
                    allowBlank: true,
                    store: routeStore,
                    listeners: {
                        nodeclick: function (combo, records, item, index, e, eOpts) {
                            var toolbar = me.dockedItems.items[1];
                            toolbar.down('hidden[name=doctor-order-way-hidden]').setValue(records.get('id'));
                            me.isClick = true;
                        },
                        change: function (_this, newValue, oldValue, eOpts) {
                            var toolbar = me.dockedItems.items[1];
                            if ("" == newValue) {
                                toolbar.down('hidden[name=doctor-order-way-hidden]').setValue(newValue);
                            }
                            routeStore.on('beforeload', function (_store, options) {
                                var toolbar = me.dockedItems;
                                if (toolbar) {
                                    toolbar = toolbar.items[1]
                                    Ext.apply(_store.proxy.extraParams, {
                                        help_code: helperCode
                                    });
                                }
                            });
                            if (me.isClick != true) {
                                var helperCode = toolbar.down('comboboxtree[name=doctor-order-way1]').getValue();
                                routeStore.load({param: {help_code: helperCode}});
                                _this.expand();
                            } else {
                                me.isClick = false;
                                routeStore.load();
                                _this.expand()
                            }
                        }
                    }
                },{
                    xtype:'button',
                    // iconCls: 'order-refresh',
                    text:'查询',
                    id: 'doctor-order-query',
                    scale: 'small',
                    tooltip: '查询',
                    handler:function(btn){
                        var medicalTabPanel = Ext.getCmp('medicalTabPanel').getActiveTab();
                        if (medicalTabPanel.title == "临时医嘱单") {
                            document.getElementById('shortTermIFrame').firstChild.contentWindow.win_fillingDate();
                        } else if (medicalTabPanel.title == "长期医嘱单") {
                            document.getElementById('longTermIFrame').firstChild.contentWindow.win_fillingDate();
                        }
                    }
                }
            ]
        }];
        me.buttons = [{
            xtype: 'splitbutton',
            text: '打印',
            hidden: true,
            iconCls: 'print',
            handler: me.onPrint,
            scope: me,
            menu: [{
                text: '直接打印',
                iconCls: 'print',
                handler: me.onPrint,
                scope: me
            }, {
                text: '打印预览',
                iconCls: 'print-preview',
                handler: me.onPrint,
                scope: me
            }]
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];
        me.items = [{
            anchor: '100%',
            border: false,
            layout: 'fit',
            items: [
                me.createTabs()
            ]
        }];
        me.callParent();
        //this.on('afterrender', me.onFillingShortTerm);
    },

    createTabs: function() {
        var me = this;
        var shortTermIFrame=new Ext.ux.IFrame({
            id:"shortTermIFrame",
            width:'100%',
            height:'100%',
            border: false,
            src:'/templates/zzszxyy/doctorder/adm-patient-medical-short-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID + '&EXTRACT_TIME' + me.EXTRACT_TIME+ '&ORDER_STATUS' + me.ORDER_STATUS+ '&ORDER_WAY' + me.ORDER_WAY+ '&ORDER_TYPE' + me.ORDER_TYPE
            //src:/templates/' + templates + '/medicalrecord/adm-patient-medical-short-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID,
        });
        var longTermIFrame=new Ext.ux.IFrame({
            id:"longTermIFrame",
            width:'100%',
            height:'100%',
            border: false,
            src:'/templates/zzszxyy/doctorder/adm-patient-medical-long-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID + '&EXTRACT_TIME' + me.EXTRACT_TIME+ '&ORDER_STATUS' + me.ORDER_STATUS+ '&ORDER_WAY' + me.ORDER_WAY+ '&ORDER_TYPE' + me.ORDER_TYPE
            //src:/templates/' + templates + '/medicalrecord/adm-patient-medical-short-term-order-list.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID,
        });
        var tabs = Ext.createWidget('tabpanel', {
            id: 'medicalTabPanel',
            activeTab: 0,
            plain: true,
            padding: 5,
            layout: 'fit',
            items: [{
                title: '临时医嘱单',
                layout: 'border',
                items: [
                    Ext.createWidget('panel', {
                        activeTab: 0,
                        border: true,
                        region: 'center',
                        margin: '-1 0 0 0',
                        items: [shortTermIFrame],
                        listeners: {
                            render: function() {
                            }
                        }
                    })
                ]
            }, {
                title: '长期医嘱单',
                layout: 'fit',
                items: [
                    Ext.createWidget('panel', {
                        activeTab: 0,
                        border: true,
                        region: 'center',
                        margin: '-1 0 0 0',
                        items: [longTermIFrame],
                        listeners: {
                            render: function() {

                            }
                        }
                    })
                ]
            }]
        });
        return tabs;
    },

    onPrint: function() {
        var medicalTabPanel = Ext.getCmp('medicalTabPanel').getActiveTab();
        if (medicalTabPanel.title == "临时医嘱单") {
            document.getElementById('shortTermIFrame').firstChild.contentWindow.win_fillingDate();
        } else if (medicalTabPanel.title == "长期医嘱单") {
            document.getElementById('longTermIFrame').firstChild.contentWindow.win_fillingDate();
        }
    }

    // getShortTermPath: function() {
    //     var path = '/templates/' + templates + '/adm-patient-medical-short-term-order.html';
    //     return path;
    // },

    // getLongTermPath: function() {
    //     var path = '/templates/' + templates + '/adm-patient-medical-long-term-order.html';
    //     return path;
    // }
});