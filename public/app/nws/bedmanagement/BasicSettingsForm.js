/**
 * 功能说明:  基本设置 form
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.BasicSettingsForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.EquipmentGrid'
    ],
    initComponent: function() {
        var me = this;
        me.equipmentGrid = new com.dfsoft.icu.nws.bedmanagement.EquipmentGrid();
        //me.BedItemComboBoxTree=Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemComboBoxTrees',{bed_id:"45d67040f53511e3b62c4396bef4885b"});
        Ext.apply(me, {
            title: '基本设置',
            items: [{
                xtype: 'fieldset',
                title: '患者信息',
                collapsible: true,
                margin: '0 5 5 5',
                defaults: {
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 5,
                            bottom: 3,
                            left: 0
                        }
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'PATIENT_NAME',
                        width: 153,
                        fieldLabel: '姓名',
                        allowBlank: false,
                        disabled: true
                    }, {
                        xtype: 'textfield',
                        name: 'HEIGHT',
                        labelWidth: 34,
                        width: 100,
                        fieldLabel: '身高',
                        disabled: true
                    }, {
                        xtype: 'textfield',
                        name: 'WEIGHT',
                        labelWidth: 34,
                        width: 100,
                        fieldLabel: '体重',
                        disabled: true
                    }, {
                        xtype: 'combo',
                        width: 210,
                        name: 'CONDITION_CODE',
                        queryMode: 'local',
                        fieldLabel: '危重程度',
                        valueField: 'value',
                        displayField: 'text',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.Store({
                            fields: ['value', 'text', 'icon'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/nws/patient_condition',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listConfig: {
                            getInnerTpl: function() {
                                // here you place the images in your combo
                                var tpl = '<div>' +
                                    '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                                    '<span style="padding-left: 18px;">{text}</span></div>';
                                return tpl;
                            }
                        },
                        listeners: {
                            select: function(combo, records, eOpts) {
                                var careLevel = me.getForm().findField('CARE_LEVEL');
                                if (records[0].data.value == '69c5bdc078fe11e39fd9cb7044fb795e') { //病危
                                    careLevel.select(careLevel.getStore().getAt(0));
                                } else if (records[0].data.value == '78a42dc078fe11e39fd9cb7044fc45h2') { //病重
                                    careLevel.select(careLevel.getStore().getAt(0));
                                } else if (records[0].data.value == '23eg46i078fe11e39fd9cb7044fcx23t') { //病轻
                                    careLevel.select(careLevel.getStore().getAt(0));
                                }
                            }
                        }
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'ALLERGIC_HISTORY',
                        fieldLabel: '过敏史',
                        width: 578,
                        disabled: true
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'DIAGNOSIS',
                        fieldLabel: '诊断',
                        width: 578,
                        disabled: true
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: '监护人员',
                collapsible: true,
                margin: '0 5 5 5',
                defaults: {
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 5,
                            bottom: 3,
                            left: 0
                        }
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'hidden',
                        name: 'HIDDEN_NURSE_ID'
                    },{
						xtype: 'combo',
						name: 'NURSE_ID',
						fieldLabel : '主管护士',
						hideTrigger: true,
						width:283,
                        labelWidth:58,
                        grow: true,
                        labelAlign:'right',
						typeAhead: false,
						queryDelay: 1000,
						valueField: 'value',
						displayField: 'text',
						pageSize: 10,
						minChars: 0,
                    store: new Ext.data.Store({
    					pageSize: 10,
    					fields: ['value', 'text'],
    					proxy: {
    						type: 'ajax',
    						url: webRoot + '/sys/searchUser/' + 'all/nurse/'+userInfo.deptId,
    						reader: {
    							type: 'json',
    							root: 'data.data',
    							totalProperty: 'data.totalCount'
    						}
    					}
    				}),
    				listeners: {
    					select: function(combo, records, eOpts) {
                            var NURSE_ID = me.getForm().findField('NURSE_ID');
                            NURSE_ID.setValue(records[0].data.value);
                        },
    					beforerender: function(_this, eg) {
    						var PagTar = _this.getPicker().pagingToolbar;
    						PagTar.baseCls = 'my-toolbar';
    						PagTar.itemCls = 'my-toolbar-item';
    						PagTar.afterPageText = '页/{0}';
    					}
    					
    				}
					}, {
                        xtype: 'combo',
                        width: 290,
                        name: 'CARE_LEVEL',
                        editable: false,
                        fieldLabel: '监护级别',
                        valueField: 'value',
                        displayField: 'text',
                        //value: 'bt64f80078fd11e39fd9cb7044fca582',
                        store: new Ext.data.Store({
                            fields: ['value', 'text'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dics/dic_care_level',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        })
                    }]
                }]
            }, {
                xtype: 'fieldcontainer',
                border: false,
                layout: 'column',
                margin: '0 5 0 5',
                items: [{
                    xtype: 'fieldset',
                    title: '仪器设备',
                    collapsible: true,
                    columnWidth: 0.74,
                    padding: '0 5 5 5',
                    margin: '0 5 0 0',
                    items: [me.equipmentGrid]
                }, {
                    xtype: 'fieldset',
                    title: '护理时间',
                    collapsible: true,
                    columnWidth: 0.26,
                    padding: '0 5 5 5',
                    items: [{
                        xtype: 'form',
                        border: false,
                        height: 135,
                        defaults: {
                            layout: {
                                type: 'hbox'
                            }
                        },
                        items: [{
                            xtype: 'fieldcontainer',
                            items: [{
                                xtype: 'label',
                                text: '开始时间:',
                                margin: '7 0 0 3'
                            }]
                        }, {
                            xtype: 'fieldcontainer',
                            items: [{
                                xtype: 'datetimefield',
                                name: 'CARE_START_TIME',
                                width: 135,
                                hideLabel: true,
                                allowBlank: false,
                                margin: '3 0 0 3',
                                value: new Date(),
                                format: 'Y-m-d H:i',
                            }]
                        }, {
                            xtype: 'fieldcontainer',
                            items: [{
                                xtype: 'numberfield',
                                name: 'CARE_INTERVAL',
                                width: 118,
                                labelWidth: 32,
                                fieldLabel: '间隔',
                                margin: '0 0 0 5',
                                regex: /^([0-9.]+)$/,
            					regexText: '只能输入正数',
                                maxLength: 11,
            					maxLengthText: '最多可输入11个字符',
                            }, {
                                xtype: 'label',
                                text: '秒',
                                margin: '5 0 0 5'
                            }]
                        }, {
                            xtype: 'fieldcontainer',
                            items: [{
                                xtype: 'numberfield',
                                name: 'CARE_FREQUENCY',
                                width: 118,
                                labelWidth: 32,
                                fieldLabel: '监护',
                                margin: '0 0 0 5',
                                regex: /^([0-9.]+)$/,
                                regexText: '只能输入正数',
                                maxLength: 11,
            					maxLengthText: '最多可输入11个字符',
                            }, {
                                xtype: 'label',
                                text: '次',
                                margin: '5 0 0 5'
                            }]
                        }]
                    }]
                }]
            }]
        });
        me.callParent();
    }
});