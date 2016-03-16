/**
 * 医嘱详情
 * @author:whw
 * @date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorDetailPanel', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.ux.form.field.BoxSelect'],
    padding: '0 5 5 5',
    border: false,


    initComponent: function () {
        var me = this;
        Ext.util.CSS.swapStyleSheet('boxselect', '../../../lib/js/BoxSelect/BoxSelect.css');// 动态加载css文件
        var detailcontent = "";
        var DRUGS_ID = "";
        if (me.parent.record.CONTENT != '' && me.parent.record.CONTENT != undefined) {
            detailcontent = me.parent.record.CONTENT;
        }
        if (me.parent.record.DRUGS_ID != '' && me.parent.record.DRUGS_ID != undefined) {
        	DRUGS_ID=me.parent.record.DRUGS_ID;
        }
        Ext.QuickTips.init();
        var colltime = me.parent.parent.getForm().findField('doctor-order-extract-time').getValue();
        var nowTime = new Date();
        colltime.setHours(nowTime.getHours());
        colltime.setMinutes(nowTime.getMinutes());
        Ext.apply(me, {
            layout: 'border',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    style: {
                        'border-bottom': '1px solid #C0C0C0 !important'
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/nws/doctorordermanagement/images/doctor-ask-small.png" />',
                            width: '10px'},
                        {
                            xtype: 'label',
                            text: '医嘱详情'
                        },
                        '->',
                        {
                            action: 'refresh_button',
                            iconCls: 'save',
                            labelAlign: 'right',
                            handler: function () {
                                me.saveOrder();
                            }
                        }/*,
                         {
                         action : 'refresh_button',
                         iconCls : 'order-refresh',
                         labelAlign:'right'
                         }*/
                    ]
                }
            ],
            items: [
                {
                    region: 'center',
                    xtype: 'container',
                    layout: 'vbox',
                    style: {
                        'padding-top': '5px',
                        'background-color': '#FFF'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            //height:30,
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'label',
                                    width: '33.5%',
                                    style: {
                                        'padding-left': '2px',
                                        'padding-top': '5px'

                                    },
                                    text: ' 患者姓名: ' + me.parent.parent.patientInfo.NAME
                                },
                                {
                                    xtype: 'textfield',
                                    hidden: true,
                                    name: 'detail-name',
                                    value: me.parent.parent.patientInfo.PATIENT_ID
                                },
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    name: 'detail-ordertype',
                                    width: '30%',
                                    fieldLabel: '医嘱类型',
                                    labelWidth: 58,
                                    allowBlank: false,
                                    labelAlign: 'right',
                                    valueField: 'value',
                                    displayField: 'text',
                                    value: me.parent.record.TYPE,
                                    store: new Ext.data.SimpleStore({
                                        fields: ['value', 'text'],
                                        data: [
                                            ['L', '长期医嘱'],
                                            ['S', '临时医嘱']
                                        ]
                                    })
                                },
                                {
                                    xtype: 'datetimefield',
                                    name: 'detail-extract-time',
                                    fieldLabel: '提取日期',
                                    format: 'Y-m-d H:i',
                                    width: '36.4%',
                                    value: me.parent.record.COLLECT_TIME == null ? colltime : new Date(me.parent.record.COLLECT_TIME),//Ext.Date.parse( 'Y-m-d H:i:s', true),
                                    editable: false,
                                    allowBlank: false,
                                    //msgTarget:'none',
                                    //preventMark:true,
                                    labelWidth: 58,
                                    labelAlign: 'right',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-date-trigger'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            width: '100%',
                            //height:30,
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'boxselect',
                                    name: 'detail-content',
                                    fieldLabel: '医嘱内容',
                                    width: '100%',
                                    labelWidth: 58,
                                    multiSelect: false,
                                    delimiter: '+',//分隔符
                                    cls: 'mulitInput',//自定义class用来控制样式
                                    queryMode: 'remote',//筛选模式
                                    triggerOnClick: false,
                                    editData: true,
                                    editSelectData: true,
                                    pageSize: 20,
                                    minChars: 1,//最小触发筛选字符
                                    valueField: 'value',
                                    displayField: 'text',
                                    autoSelect: false,//下拉列表出现后是否默认选择第一条
                                    focusOnClick: true,//点击后输入框获焦
                                    hideTrigger: true,//隐藏右侧下拉箭头
                                    pageSize: 10,
                                    growMax: 55,//插件最大高度
                                    growMin: 55,
                                    allowBlank: false,
                                    forceSelection: false,
                                    createNewOnEnter: true,
                                    createNewOnBlur: true,
                                    filterPickList: true,
                                    pinList: false,//下拉列表选择后是否自动关闭
                                    store: new Ext.data.Store({
                                        pageSize: 10,
                                        fields: ['value', 'text'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/dic/drugs/searchListByName',
                                            reader: {
                                                type: 'json',
                                                root: 'data.data',
                                                totalProperty: 'data.totalCount'
                                            }
                                        }
                                    }),
                                    listeners: {
                                        select: function (combo, records, eOpts) {
                                            var drugsid = me.getForm().findField('detail-content').getValue();
                                            me.getForm().findField('detail-drugsId').setValue(drugsid);
                                            var detail_content = me.getForm().findField('detail-content').getRawValue();
                                            me.getForm().findField('detail-shortname').setValue(detail_content.substr(0,100));
                                        },
                                        expand: function (combo) {
                                            combo.picker.getEl().applyStyles({
                                                backgroundColor: '#A4D3EE'
                                            });
                                        },
                                      change:function(_this, newValue, oldValue, eOpts ){
                                        	if(detailcontent!=newValue){
                                        		DRUGS_ID="";
                                        		me.getForm().findField('detail-drugsId').setValue(DRUGS_ID);
                                        	}
                                        	var detail_content = me.getForm().findField('detail-content').getRawValue();
                                        	me.getForm().findField('detail-shortname').setValue(detail_content.substr(0,100));
                                      }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            width: '100%',
                            layout: 'hbox',
                            items: [{
                                xtype: 'textfield',
                                name: 'detail-shortname',
                                width: '100%',
                                editable: false,
                                maxLength:100,
                                maxLengthText:"最长允许输入100个字符",
                                value: me.parent.record.SHORT_NAME,
                                fieldLabel: '医嘱简称',
                                labelWidth: 58,
                                labelAlign: 'right'
                            }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            width: '100%',
                            layout: 'hbox',
                            items: [{
                                xtype: 'textfield',
                                name: 'detail-instruction',
                                width: '100%',
                                editable: false,
                                value: me.parent.record.INSTRUCTION,
                                fieldLabel: '执行说明',
                                maxLength:100,
                                maxLengthText:"最长允许输入100个字符",
                                labelWidth: 58,
                                labelAlign: 'right'
                            }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'detail-dosage',
                                    maxLength: 10,
                                    maxLengthText: '只输入10位数',
                                    allowDecimals: true,
                                    decimalPrecision:4,
                                    fieldLabel: '剂量',
                                    value: me.parent.record.DOSAGE,
                                    width: '40%',
                                    hideTrigger: true,
                                    /*maxValue: 9999,
                                    minValue: 0,*/
                                    //allowBlank: false,
                                    blankText: '请输入剂量',
                                    labelWidth: 58,
                                    labelAlign: 'right'
                                },
                                {
                                    name: 'detail-route',
                                    width: '35%',
                                    fieldLabel: '途径',
                                    value: me.parent.record.ROUTE_CODE,
                                    labelWidth: 38,
                                    labelAlign: 'right',
                                    xtype: 'combo',
                                    queryMode: 'remote',
                                    //allowBlank: false,
                                    editable: false,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keydown: function (_this, e) {
                                            if (e.getKey() == 46) {
                                                _this.setRawValue("");
                                                _this.setValue("");
                                            }
                                        }
                                    },
                                    blankText: '请输入用药途径',
                                    valueField: 'code',
                                    displayField: 'name',
                                    matchFieldWidth: false,
                                    defaultListConfig: {loadingHeight: 70, minWidth: 140, maxHeight: 300, shadow: 'sides'},
                                    store: new Ext.data.Store({
                                        fields: ['code', 'name'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/nws/doctorordermanagement/drugs_rote?dic=ROUTE',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        autoLoad: true
                                    })
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-orderId',
                                    value: me.parent.record.ID
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-parentId',
                                    value: me.parent.record.PARENT_ID
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-userId',
                                    value: userInfo.userId
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-drugsId',
                                    value: me.parent.record.DRUGS_ID
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-oldContentType',
                                    value: me.parent.record.CONTENT_TYPE
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'detail-parent-order-id',
                                    value: me.PARENT_ORDER_ID
                                },
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keydown: function (_this, e) {
                                            if (e.getKey() == 46) {
                                                _this.setRawValue("");
                                                _this.setValue("");
                                            }
                                        }
                                    },
                                    name: 'detail-frequency',
                                    width: '25%',
                                    fieldLabel: '频次',
                                    value: me.parent.record.FREQUENCY_CODE,
                                    labelWidth: 38,
                                    labelAlign: 'right',
                                    matchFieldWidth: false,
                                    defaultListConfig: {loadingHeight: 70, minWidth: 120, maxHeight: 300, shadow: 'sides'},
                                    valueField: 'code',
                                    displayField: 'name',
                                    store: new Ext.data.Store({
                                        fields: ['code', 'name'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/nws/doctorordermanagement/drugs_rote?dic=FREQUENCY',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        autoLoad: true
                                    })
                                }
                            ]
                        }
                        ,
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keydown: function (_this, e) {
                                            if (e.getKey() == 46) {
                                                _this.setRawValue("");
                                                _this.setValue("");
                                            }
                                        }
                                    },
                                    queryMode: 'remote',
                                    name: 'detail-category',
                                    width: '40%',
                                    fieldLabel: '药品分类',
                                    value: me.parent.record.DRUGS_CATEGORY_CODE,
                                    labelWidth: 58,
                                    labelAlign: 'right',
                                    valueField: 'code',
                                    displayField: 'name',
                                    store: new Ext.data.Store({
                                        fields: ['code', 'name'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/nws/doctorordermanagement/drugs_rote?dic=DRUGS_CATEGORY',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        autoLoad: true
                                    })
                                },
                                {
                                    xtype: 'combo',
                                    name: 'detail-pump',
                                    fieldLabel: '泵入',
                                    editable: false,
                                    width: '35%',
                                    value: me.parent.record.IS_PUMPS,
                                    valueField: 'value',
                                    displayField: 'text',
                                    store: new Ext.data.SimpleStore({
                                        fields: ['value', 'text'],
                                        data: [
                                            [1, '是'],
                                            [0, '否']
                                        ]
                                    }),
                                    labelWidth: 38,
                                    labelAlign: 'right',
                                    listeners: {
                                        change: function (_this, newValue, oldValue, eOpts) {
                                            if (newValue == 0) {
                                                me.getForm().findField('detail-speed').setDisabled(true);
                                            } else {
                                                me.getForm().findField('detail-speed').setDisabled(false);
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'detail-speed',
                                    maxLength: 10,
                                    maxLengthText: '只输入10位数',
                                    fieldLabel: '流速',
                                    value: me.parent.record.PUMPS_SPEED,
                                    width: '20%',
                                    allowDecimals: true,
                                    /*maxValue: 9999,*/
                                    minValue: 0,
                                    hideTrigger: true,
                                    msgTarget: 'none',
                                    labelWidth: 38,
                                    labelAlign: 'right',
                                    listeners: {
                                        afterrender: function () {
                                            if (me.getForm().findField('detail-pump').getValue() == 0) {
                                                me.getForm().findField('detail-speed').setDisabled(true);
                                            } else {
                                                me.getForm().findField('detail-speed').setDisabled(false);
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    text: 'ml/h',
                                    style: {
                                        'padding-top': '4px'
                                    },
                                    width: '5%'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            //height:30,
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    name: 'detail-contenttype',
                                    width: '40%',
                                    fieldLabel: '类型',
                                    labelWidth: 58,
                                    allowBlank: false,
                                    labelAlign: 'right',
                                    valueField: 'value',
                                    displayField: 'text',
                                    value: me.parent.record.CONTENT_TYPE,
                                    store: new Ext.data.SimpleStore({
                                        fields: ['value', 'text'],
                                        data: [
                                            [1, '药嘱'],
                                            [2, '说明医嘱']
                                        ]
                                    })
                                },
                                {
                                    xtype: 'combo',
                                    name: 'detail-unit',
                                    width: '35%',
                                    fieldLabel: '单位',
                                    value: me.parent.record.UNIT_CODE,
                                    labelWidth: 36,
                                    labelAlign: 'right',
                                    queryMode: 'remote',
                                    //allowBlank: false,
                                    blankText: '请选择单位',
                                    editable: false,
                                    valueField: 'code',
                                    enableKeyEvents: true,
                                    listeners: {
                                        keydown: function (_this, e) {
                                            if (e.getKey() == 46) {
                                                _this.setRawValue("");
                                                _this.setValue("");
                                            }
                                        }
                                    },
                                    displayField: 'code',
                                    store: new Ext.data.Store({
                                        fields: ['code', 'name'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/nws/doctorordermanagement/drugs_rote?dic=UNIT',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        autoLoad: true
                                    })
                                },
                                {
                                    xtype: 'combo',
                                    name: 'detail-cavity',
                                    width: '25%',
                                    fieldLabel: '腔体',
                                    value: me.parent.record.CAVITY_CODE,
                                    labelWidth: 36,
                                    labelAlign: 'right',
                                    queryMode: 'remote',
                                    //allowBlank: false,
                                    blankText: '请选择腔体',
                                    editable: false,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keydown: function (_this, e) {
                                            if (e.getKey() == 46) {
                                                _this.setRawValue("");
                                                _this.setValue("");
                                            }
                                        }
                                    },
                                    valueField: 'code',
                                    displayField: 'name',
                                    store: new Ext.data.Store({
                                        fields: ['code', 'name'],
                                        proxy: {
                                            type: 'ajax',
                                            url: webRoot + '/nws/doctorordermanagement/drugs_rote?dic=CAVITY',
                                            reader: {
                                                type: 'json',
                                                root: 'data'
                                            }
                                        },
                                        autoLoad: true
                                    })
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            //height:30,
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'datetimefield',
                                    name: 'detail-stop-time',
                                    fieldLabel: '停止日期',
                                    format: 'Y-m-d H:i',
                                    width: '40%',
                                    value: me.parent.record.COMPLETION_TIME == null ? null : new Date(me.parent.record.COMPLETION_TIME),//Ext.Date.parse( 'Y-m-d H:i:s', true),
                                    editable: false,
                                    //allowBlank: false,
                                    labelWidth: 58,
                                    labelAlign: 'right',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-date-trigger'
                                },
                                {
                                    xtype: 'textfield',
                                    name : 'detail-stop-doctor',
                                    maxLength: 10,
                                    maxLengthText: '只输入10个字符',
                                    fieldLabel: '停止医师',
                                    value: me.parent.record.STOP_DOCTOR,
                                    width: '30%',
                                    hideTrigger: true,
                                    blankText: '请输入停止医师',
                                    labelWidth: 58,
                                    labelAlign: 'right'
                                },
                                {
                                    xtype: 'textfield',
                                    name : 'detail-stop-nurse',
                                    maxLength: 10,
                                    maxLengthText: '只输入10个字符',
                                    fieldLabel: '停止护士',
                                    value: me.parent.record.STOP_NURSE,
                                    width: '30%',
                                    hideTrigger: true,
                                    blankText: '请输入停止护士',
                                    labelWidth: 58,
                                    labelAlign: 'right'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            //height:30,
                            width: '100%',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name : 'detail-dosage-all',
                                    maxLength: 10,
                                    maxLengthText: '只输入10位数',
                                    allowDecimals : true,
                                    decimalPrecision:4,
                                    fieldLabel: '总剂量',
                                    value: me.parent.record.DOSAGE_ALL,
                                    width: '40%',
                                    hideTrigger: true,
                                    /*maxValue: 9999,
                                     minValue: 0,*/
                                    blankText: '请输入总剂量',
                                    labelWidth: 58,
                                    labelAlign: 'right'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        me.callParent();
        me.getForm().findField('detail-content').setValue(detailcontent);
        me.getForm().findField('detail-drugsId').setValue(DRUGS_ID);
        me.getForm().findField('detail-shortname').setValue(me.parent.record.SHORT_NAME);
    },
    saveOrder: function () {
        var me = this;
        var orderForm = me.getForm();
        if (orderForm.isValid()) {
            var detail_content = orderForm.findField('detail-content').getRawValue();
            if (detail_content != '') {
                orderForm.findField('detail-content').setRawValue(detail_content);
                //orderForm.findField('detail-content').setValue(detail_content);
            }
            /*if(me.parent.record.EXECUTION_STATE==2){
             Ext.MessageBox.show({
             title:'提示',
             msg:'已经完成的医嘱禁止修改',
             width:200,
             modal:false,
             buttons:Ext.MessageBox.OK,
             icon:Ext.MessageBox.WARNING
             });
             return;
             }*/
            var contentT=orderForm.findField('detail-contenttype').getValue();
            var contentR=orderForm.findField('detail-route').getValue();
            if(contentT==1&&(contentR==null||contentR=="")){
                Ext.MessageBox.show({
                    title:'提示',
                    msg:'药品途径不能为空',
                    width:200,
                    modal:true,
                    buttons:Ext.MessageBox.OK,
                    icon:Ext.MessageBox.WARNING
                });
                return;
            }
            orderForm.submit({
                url: webRoot + '/dws/doctorordermanagement/add_doctor_orders',
                params: {
                    content: detail_content
                },
                success: function (response) {
                    me.parent.close();
                    //me.parent.parent.queryOrder();
                    var treePanel=me.parent.parent.centerOptions;
                    var store=treePanel.getStore();
                    if(me.parent.record.ID!=undefined&&me.parent.record.ID!=null){
                        if(me.parent.record.PARENT_ID!=null){
                            me.parent.parent.findExecuteOrderById=me.parent.record.PARENT_ID;
                        }else{
                            me.parent.parent.findExecuteOrderById=me.parent.record.ID;
                        }
                    }
                    store.load();

                }
            });
        }
    },
});