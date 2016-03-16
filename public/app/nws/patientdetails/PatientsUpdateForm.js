/**
 * 功能说明:  修改待入科患者  form
 * @author: 姬魁
 */
{
	function ageOnclick(e,id) {
	    e.stopPropagation();
	    var ageElement = document.getElementById(id);
	    var value = ageElement.value;
	    value = parseInt(value);
	    var localArray = [{
	        text: '常规',
	        value: '  岁'
	    }, {
	        text: '幼儿及学龄前儿童',
	        value: ' 岁 月'
	    }, {
	        text: '婴儿',
	        value: '  月'
	    }, {
	        text: '新生儿',
	        value: '  天'
	    }];
	    var rect = Ext.getCmp("agelabel").getBox();
	    createFloatDiv('boundListPanel', id, null, 130, rect.left+69, rect.top+24, 120, null, 0, 'localhost', localArray, '1', null, true,"33333");
	}
Ext.define('com.dfsoft.icu.nws.patientdetails.PatientsUpdateForm', {
    extend: 'Ext.form.Panel',
    requires: [

    ],
    initComponent: function() {
        var me = this;
        var icuStore = Ext.create('Ext.data.TreeStore', {
            // autoLoad: false,
            fields: [{
                name: 'text',
                type: 'string'
            }, {
                name: 'id',
                type: 'string'
            }, {
                name: 'iconCls',
                type: 'string',
                defaultValue: 'settings-dept',
                persist: true
            }],
            proxy: {
                type: 'ajax',
                url: webRoot + '/sys/tree/dept/icu/all',
                reader: {
                    type: 'json',
                    root: 'children'
                }
            }
        });
        var deptStore = Ext.create('Ext.data.TreeStore', {
            // autoLoad: false,
            fields: [{
                name: 'text',
                type: 'string'
            }, {
                name: 'id',
                type: 'string'
            }, {
                name: 'iconCls',
                type: 'string',
                defaultValue: 'settings-dept',
                persist: true
            }],
            proxy: {
                type: 'ajax',
                url: webRoot + '/sys/tree/dept/icu/all',
                reader: {
                    type: 'json',
                    root: 'children'
                }
            }
        });
        Ext.apply(me, {
            border: true,
            items: [{
                xtype: 'fieldset',
                border: false,
                padding: '5 0 0 0',
                margin: '0 5 0 5',
                defaults: {
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'hidden',
                        name: 'AGE'
                    },{
                        xtype: 'hidden',
                        name: 'REGISTER_ID'
                    }, {
                        xtype: 'hidden',
                        name: 'BED_ID'
                    }, {
                        xtype: 'hidden',
                        name: 'PATIENT_ID'
                    },{
                        xtype: 'hidden',
                        name: 'ICU_ID'
                    },{
                        xtype: 'hidden',
                        name: 'SURGERY_DATE'
                    },{
                        xtype: 'hidden',
                        name: 'SURGERY_NAME'
                    },
//                    {
//                        xtype: 'datetimefield',
//                        name: 'HOSPITAL_DATE',
//                        fieldLabel: '入院时间',
//                        allowBlank: false,
//                        value: new Date(),
//                        format: 'Y-m-d H:i',
//                        width: 217
//                    }, {
//                        xtype: 'label',
//                        text: '',
//                        margin: '30 0 0 30'
//                    },{
//                        xtype: 'datetimefield',
//                        name: 'IN_TIME',
//                        allowBlank: false,
//                        fieldLabel: '入科日期',
//                        width: 217,
//                        value: new Date(),
//                        format: 'Y-m-d H:i'
//                    }
//                    , {
//                        xtype: 'datefield',
//                        name: 'OUT_TIME',
//                        fieldLabel: '出科日期',
//                        width: 190,
//                        format: 'Y-m-d'
//                    }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'NAME',
                        fieldLabel: '患者姓名',
                        allowBlank: false,
                        maxLength: 100,
    					maxLengthText: '最多可输入100个字符',
                        width: 250
                    }, {
                        xtype: 'combo',
                        name: 'GENDER',
                        editable: false,
                        valueField: 'value',
                        displayField: 'text',
                        fieldLabel: '性别',
                        allowBlank: false,
                        width: 150,
                        store: new Ext.data.SimpleStore({
                            fields: ['value', 'text'],
                            data: [
                                ['男', '男'],
                                ['女', '女']
                            ]
                        })
                    }, {
                        xtype: 'textfield',
                        name: 'HOSPITAL_NUMBER',
                        fieldLabel: '住院号',
                        regex: /^[0-9]*$/,
    					regexText: '只能输入正整数',
                        maxLength: 100,
    					maxLengthText: '最多可输入100个字符',
                        width: 214
                    }
//                    {
//                        xtype: 'comboboxtree',
//                        name: 'ICU_IDs',
//                        fieldLabel: '转入科室',
//                        width: 250,
//                        disabled: true,
//                        hideTrigger: true,
//                        //pickerWidth: 240,
//                        rootVisible: false,
//                        displayField: 'text',
//                        editable: false,
//                        allowBlank: false,
//                        store: icuStore
//                    }
//                    {
//                        xtype: 'datetimefield',
//                        name: 'IN_TIME',
//                        allowBlank: false,
//                        fieldLabel: '入科日期',
//                        width: 230,
//                        value: new Date(),
//                        format: 'Y-m-d H:i'
//                    }
                    ]
                },
//                {
//                    xtype: 'fieldcontainer',
//                    defaults: {
//                        labelWidth: 64,
//                        labelAlign: 'right'
//                    },
//                    items: [{
//                        xtype: 'textfield',
//                        name: 'SURGERY_NAME',
//                        fieldLabel: '手术名称',
//                        maxLength: 200,
//    					maxLengthText: '最多可输入200个字符',
//                        width: 614
//                    }
////                    ,
////                    {
////                        xtype: 'textfield',
////                        name: 'SURGERY_LEVEL',
////                        fieldLabel: '手术级别',
////                        width: 300
////                    }
//                    ]
//                },
                {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [
//                    {
//                        xtype: 'datetimefield',
//                        name: 'SURGERY_DATE',
//                        fieldLabel: '手术时间',
//                        width: 210,
//                        value: new Date(),
//                        format: 'Y-m-d H:i'
//                    }, 
					{
                        xtype: 'label',
                        id:'agelabel',
                        html:'<div id="agediv" style="margin-left:33px">年龄:<input class="x-form-field x-form-required-field x-form-text" style="margin-left:6px;width:128px;" type="text" onclick="ageOnclick(event,this.id)" onblur=removeFolatDiv("boundListPanel",event) id="AGE"/></div>',
                    },
                    {
                        xtype: 'numberfield',
                        name: 'HEIGHT',
                        fieldLabel: '身高',
                        width: 180,
                        regex: /^[0-9]*$/,
    					regexText: '不能输入负数',
						maxLength: 3,
						maxLengthText: '最大输入3位长度'
                    }, {
                        xtype: 'label',
                        text: 'CM',
                        margin: '5 0 0 5'
                    }, {
                        xtype: 'numberfield',
                        name: 'WEIGHT',
                        fieldLabel: '体重',
                        width: 183,
                        regex:  /^([1-9][\d]{0,2}|0)(\.[\d]{1,2})?$/,
    					regexText: '不能输入负数',
						maxLength: 5,
						maxLengthText: '最大输入5位长度',
                        listeners: {
                            focus: function(_this, _the, eOpts) {
                                _this.selectText();
                            }
                        }
                    },{
                        xtype: 'label',
                        text: 'Kg',
                        margin: '5 0 0 5'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'combo',
                        name: 'BLOODTYPE',
                        fieldLabel: '血型',
                        width: 197,
                        valueField: 'text',
                        displayField: 'text',
                        maxLength: 7,
    					maxLengthText: '最多可输入7个字符',
                        store: new Ext.data.Store({
                            fields: ['text'],
                            data: [{
                                'text': 'A+'
                            }, {
                                'text': 'B+'
                            }, {
                                'text': 'AB+'
                            }, {
                                'text': 'O+'
                            }, {
                                'text': 'A-'
                            }, {
                                'text': 'B-'
                            }, {
                                'text': 'AB-'
                            }, {
                                'text': 'O-'
                            }]
                        })
                    }, {
                        xtype: 'datefield',
                        name: 'BIRTHDAY',
                        fieldLabel: '出生日期',
                        width: 180,
                        value: new Date(),
                        format: 'Y-m-d'
                    }, {
                        xtype: 'textfield',
                        name: 'EXCHANGE_BED_INFO',
                        fieldLabel: '换床信息',
                        width:235,
                        hidden: true
                    }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'DIAGNOSIS',
                        fieldLabel: '诊断',
                        maxLength: 200,
    					maxLengthText: '最多可输入200个字符',
                        width: 614
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaultType: 'checkboxfield',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [
                            {
                        xtype: 'comboboxtree',
                        name: 'IN_DEPT_ID',
                        fieldLabel: '转入科室',
                        width: 250,
                        //pickerWidth: 240,
                        rootVisible: false,
                        displayField: 'text',
                        editable: false,
                        allowBlank: false,
                        store: deptStore
                    },{
                          xtype: 'textfield',
                          name: 'ALLERGIC_HISTORY',
                          fieldLabel: '过敏史',
                          width: 364,
                          maxLength: 4000,
      					maxLengthText: '最多可输入4000个字符',
                      }]
                }]
            }, {
                xtype: 'fieldset',
                border: '1 0 0 0',
                padding: '5 0 0 0',
                margin: '0 5 0 5',
                defaults: {
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaultType: 'checkboxfield',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'DOCTOR',
                        fieldLabel: '医生',
                        width: 197,
                        maxLength: 200,
    					maxLengthText: '最多可输入200个字符',
                    }, {
                        xtype: 'combo',
                        name: 'CONDITION_CODE',
                        fieldLabel: '危重程度',
                        width: 200,
                        editable: false,
                        allowBlank: false,
                        valueField: 'value',
                        displayField: 'text',
                        value: '69c5bdc078fe11e39fd9cb7044fb795e',
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
                                var careLevel = me.getForm().findField('CARE_LEVEL_CODE');
                                if (records[0].data.value == '69c5bdc078fe11e39fd9cb7044fb795e') { //病危
                                    careLevel.select(careLevel.getStore().getAt(0));
                                } else if (records[0].data.value == '78a42dc078fe11e39fd9cb7044fc45h2') { //病重
                                    careLevel.select(careLevel.getStore().getAt(0));
                                } else if (records[0].data.value == '23eg46i078fe11e39fd9cb7044fcx23t') { //病轻
                                    careLevel.select(careLevel.getStore().getAt(0));
                                }
                            }
                        }
                    }, {
                        xtype: 'combo',
                        name: 'CARE_LEVEL_CODE',
                        fieldLabel: '护理等级',
                        width: 217,
                        editable: false,
                        valueField: 'value',
                        displayField: 'text',
                        allowBlank: false,
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
                }, {
                    xtype: 'fieldcontainer',
                    defaultType: 'checkboxfield',
                    defaults: {
                        labelWidth: 64,
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
						width:280,
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
                        change: function (_this, newValue, oldValue, eOpts) {
                        	var NURSE_ID = me.getForm().findField('NURSE_ID');
                            NURSE_ID.setValue(newValue);
                        },
    					beforerender: function(_this, eg) {
    						var PagTar = _this.getPicker().pagingToolbar;
    						PagTar.baseCls = 'my-toolbar';
    						PagTar.itemCls = 'my-toolbar-item';
    						PagTar.afterPageText = '页/{0}';
    					}
    					
    				}
					}, {
                        xtype: 'numberfield',
                        name: 'FOREGIFT',
                        fieldLabel: '预交押金',
                        width: 165,
                        maxLength: 10,
        				maxLengthText: '最多可输入10位数',
        				regex: /^([0-9][0-9]*[.]?[0-9]{0,2})|([0][.][0-9]{1,2})$/,
        				regexText: '只能输入正整数和0',
                        listeners: {
                            focus: function(_this, _the, eOpts) {
                                _this.selectText();
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        name: 'TOTAL_COST',
                        fieldLabel: '累计费用',
                        width: 169,
                        maxLength: 10,
        				maxLengthText: '最多可输入10位数',
        				regex: /^([0-9][0-9]*[.]?[0-9]{0,2})|([0][.][0-9]{1,2})$/,
        				regexText: '只能输入正整数和0',
                        listeners: {
                            focus: function(_this, _the, eOpts) {
                                _this.selectText();
                            }
                        }
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaultType: 'checkboxfield',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'htmleditor',
                        enableFont: false,
                        enableLinks: false,
                        enableSourceEdit: false,
                        name: 'DESCRIPTION',
                        fieldLabel: '备注',
                        width: 615,
                        height: 100
                    }]
                }]
            }]
        });
        this.listeners={
                afterrender: function(_this, eOpts) {
        			document.getElementById('AGE').value=me.getForm().findField('AGE').getValue();
        		}
        	}
        me.callParent();
    }
});
}