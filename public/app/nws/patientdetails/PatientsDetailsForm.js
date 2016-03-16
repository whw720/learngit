/**
 * 功能说明:  患者详情  form
 * @author: 杨祖文
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
        //url: webRoot + '/sys/tree/dept',
        url: webRoot + '/sys/tree/dept/icu/all',
        reader: {
            type: 'json',
            root: 'children'
        }
    }
});
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
Ext.define('com.dfsoft.icu.nws.patientdetails.PatientsDetailsForm', {
    extend: 'Ext.form.Panel',
    requires: [

    ],
    initComponent: function() {
        var me = this;
        me.user = me.createUserPanel();
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
                        name: 'EXCHANGE_BED_INFO'
                    },{
                        xtype: 'hidden',
                        name: 'BED_ID'
                    }, {
                        xtype: 'hidden',
                        name: 'PATIENT_ID'
                    }, {
                        xtype: 'hidden',
                        name: 'ICU_ID'
                    },{
                        xtype: 'hidden',
                        name: 'SURGERY_DATE'
                    },{
                        xtype: 'hidden',
                        name: 'SURGERY_NAME'
                    },{
                        xtype: 'datetimefield',
                        name: 'HOSPITAL_DATE',
                        fieldLabel: '入院时间',
                        allowBlank: false,
                        format: 'Y-m-d H:i',
                        width: 204
                    }, {
                        xtype: 'datetimefield',
                        name: 'IN_TIME',
                        allowBlank: false,
                        fieldLabel: '入科日期',
                        width: 204,
                        value: new Date(),
                        format: 'Y-m-d H:i',
                    }, {
                        xtype: 'datetimefield',
                        name: 'OUT_TIME',
                        fieldLabel: '出科日期',
                        width: 204,
                        value: new Date(),
                        format: 'Y-m-d H:i'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'comboboxtree',
                        name: 'IN_DEPT_ID',
                        fieldLabel: '转入科室',
                        width: 297,
                        //pickerWidth: 240,
                        rootVisible: false,
                        displayField: 'text',
                        editable: false,
                        allowBlank: false,
                        store: deptStore
                    },
                    {
                        xtype: 'combo',
                        name: 'OUT_CODE',
                        editable: false,
                        valueField: 'value',
                        displayField: 'text',
                        fieldLabel: '归转情况',
                        //allowBlank: false,
                        width: 315,
                        store: new Ext.data.SimpleStore({
                            fields: ['value', 'text'],
                            data: [
                                ['c3cf2625ff0811e2b69eef705ed7331d','病房'],
                                ['d2be1525ff0811e2b69eef705ed7220c','门/急诊观察室'],
                                ['e4be1525ff0811e2b69eef705ed7442d','出院'],
                                ['e4be1525ff0811e2b69eef705ed7442c','转院'],
                                ['f5dg1525ff0811e2b69eef705ed7553e','死亡']
                            ]
                        }),
                        listeners: {
	                    	render : function(p) {
	                        p.getEl().on('keydown', function(e){ 
	                        	if (e.getKey() == 46) { 
	                        		me.getForm().findField('OUT_CODE').setRawValue('');
	                            	me.getForm().findField('OUT_CODE').setValue('');
	                                } 
	                        }); 
	                    	}
                    	}
                    }
//                    , {
//                        xtype: 'comboboxtree',
//                        name: 'OUT_DEPT_ID',
//                        fieldLabel: '转出科室',
//                        width: 315,
//                        rootVisible: false,
//                        displayField: 'text',
//
//                        editable: false,
//                        //allowBlank: false,
//                        store: deptStore
//                    }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [
						{
						    xtype: 'textfield',
						    name: 'NAME',
						    fieldLabel: '患者姓名',
						    allowBlank: false,
						    maxLength: 100,
	    					maxLengthText: '最多可输入100个字符',
						    width: 197
						},{
	                        xtype: 'datefield',
	                        name: 'BIRTHDAY',
	                        fieldLabel: '出生日期',
	                        width: 200,
	                        value: new Date(),
	                        format: 'Y-m-d'
	                    },{
	                        xtype: 'datetimefield',
	                        name: 'DIE_DATE',
	                        fieldLabel: '死亡时间',
	                        //allowBlank: false,
	                        format: 'Y-m-d H:i',
	                        value: new Date(),
	                        width: 215
	                    }
//                    {
//                        xtype: 'textfield',
//                        name: 'SURGERY_LEVEL',
//                        fieldLabel: '级别',
//                        width: 205
//                    }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'label',
                        id:'agelabel',
                        html:'<div id="agediv" style="margin-left:33px">年龄:<input class="x-form-field x-form-required-field x-form-text" style="margin-left:6px;width:128px;" type="text" onclick="ageOnclick(event,this.id)" onblur=removeFolatDiv("boundListPanel",event) id="AGE"/></div>',
                    },{
                        xtype: 'combo',
                        name: 'GENDER',
                        editable: false,
                        valueField: 'value',
                        displayField: 'text',
                        fieldLabel: '性别',
                        allowBlank: false,
                        width: 134,
                        store: new Ext.data.SimpleStore({
                            fields: ['value', 'text'],
                            data: [
                                ['男', '男'],
                                ['女', '女']
                            ]
                        })
                    },{
                        xtype: 'numberfield',
                        name: 'HEIGHT',
                        fieldLabel: '身高',
                        labelWidth: 40,
                        width: 120,
                        regex: /^[0-9]*$/,
    					regexText: '不能输入负数',
						maxLength: 3,
						maxLengthText: '最大输入3位长度'
                    }, {
                        xtype: 'label',
                        text: 'CM',
                        margin: '5 0 0 5'
                    },{
                        xtype: 'numberfield',
                        name: 'WEIGHT',
                        fieldLabel: '体重',
                        labelWidth: 40,
                        width: 120,
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
                },{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'HOSPITAL_NUMBER',
                        fieldLabel: '住院号',
                        regex: /^[0-9]*$/,
    					regexText: '只能输入正整数',
                        maxLength: 100,
    					maxLengthText: '最多可输入100个字符',
                        width: 197
                    },{
                        xtype: 'textfield',
                        name: 'DIAGNOSIS',
                        fieldLabel: '诊断',
                        maxLength: 200,
    					maxLengthText: '最多可输入200个字符',
                        width: 413
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaultType: 'checkboxfield',
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
                    },{
                        xtype: 'textfield',
                        name: 'ALLERGIC_HISTORY',
                        fieldLabel: '过敏史',
                        width: 415,
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
                        width: 215,
                        editable: false,
                        valueField: 'value',
                        displayField: 'text',
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
                        width: 167,
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
                        width: 613,
                        height: 100
                    }]
                }
                ,{
                	xtype: 'fieldset',
                    title: '手术内容',
                    collapsible: true,
                    items: [me.user]
                }
                ]
            }]
        });
        this.listeners={
            afterrender: function(_this, eOpts) {
    			document.getElementById('AGE').value=me.getForm().findField('AGE').getValue();
    		}
    	}
        me.callParent();
    },
  //创建人员面板
	createUserPanel: function() {
    	var patientInfo=Ext.util.Cookies.get("patientInfo");
    	patientInfo = Ext.decode(patientInfo);
//    	var userStore = new com.dfsoft.icu.nws.patientdetails.surgeryStore();
//    	userStore.proxy.url=webRoot + '/nws/icu_patient/getsurgery_record/'+patientInfo.REGISTER_ID;
//    	userStore.load();
    	
    	 var userStore = Ext.create('Ext.data.Store', {
             model: 'com.dfsoft.icu.nws.patientdetails.surgeryModel',
             proxy: {
                 type: 'ajax',
                 url: webRoot + '/nws/icu_patient/getsurgery_record/'+patientInfo.REGISTER_ID,
                 method: 'GET',
                 reader: {
                     type: 'json',
                     root: 'data'
                 }
             }
         });
    	 userStore.loadPage(1);
    	 var deptstore=new Ext.data.TreeStore({
         	fields: [{
                 name: 'text',
                 type: 'string'
             }, {
                 name: 'id',
                 type: 'string'
             }],
             proxy: {
                 type: 'ajax',
                 url: webRoot + '/sys/tree/dept/all',
                 reader: {
                     type: 'json',
                     root: 'children'
                 }
             },
             autoLoad: true
         })
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit: 2,
			errorsText: '提示',
			autoCancel: false,
			listeners: {
				canceledit: function(editor, context) {
					var grid = context.grid;
					var items = grid.getSelectionModel().getSelection();
					Ext.each(items, function(item) {
						if (item.data.ID.length == 0) {
							userStore.remove(item);
						}
					});
				},
				edit: function(editor, context) {
					var newRecord = context.record;
					//检查用户是否存在
					if (newRecord.data.ID.length == 0) {
						Ext.Ajax.request({
							url: webRoot + '/nws/icu_patient/addsurgery_record/',
							method: 'POST',
							scope: this,
							params: {
								SYNCID:patientInfo.SID,
								DEPT_NAME:newRecord.data.DEPT_NAME,
								REGISTER_ID: patientInfo.REGISTER_ID,
								IN_DATE:newRecord.data.IN_DATE,
								SURGERY_DATE: newRecord.data.SURGERY_DATE,
								SURGERY_NAME: newRecord.data.SURGERY_NAME
							},
							success: function(response) {
								var respText = Ext.decode(response.responseText).data;
								userStore.reload();
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
							}
						});
					} else {
						//修改
						Ext.Ajax.request({
							url: webRoot + '/nws/icu_patient/updatesurgery_record/',
							method: 'POST',
							scope: this,
							params: {
								ID:newRecord.data.ID,
								DEPT_NAME:newRecord.data.DEPT_NAME,
								IN_DATE:newRecord.data.IN_DATE,
								SURGERY_DATE: newRecord.data.SURGERY_DATE,
								SURGERY_NAME: newRecord.data.SURGERY_NAME
							},
							success: function(response) {
								var respText = Ext.decode(response.responseText).data;
								userStore.reload();
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
							}
						});
					}
				}
			}
		});


		var userColumn = [{
			text: '手术名称',
			dataIndex: 'SURGERY_NAME',
			sortable: false,
			align: 'left',
			width:'25%',
			editor: {
				xtype: 'textfield',
				allowBlank: false,
				maxLength: 200,
				maxLengthText: '最多可输入200个字符',
			}
		},
		{
			text: '手术科室',
			dataIndex: 'DEPT_NAME',
			sortable: false,
			align: 'left',
			width:'20%',
			editor: {
				xtype: 'textfield',
				allowBlank: false,
				maxLength: 200,
				maxLengthText: '最多可输入200个字符',
				listeners:{
                  nodeclick: function(combo, records, eOpts) {
                      var selectRecord = usergrid.getSelectionModel().getSelection();
                      if(usergrid.plugins[0].editor.down('button').disabled == true){
                      	usergrid.plugins[0].editor.down('button').setDisabled(false);
                      }
                  }
              }
			}
		},
//		{
//            text: '手术科室',
//            width: '33%',
//            dataIndex: 'DEPTNAME',
//            sortable: false,
//            align: 'left',
//            editor: {
//                xtype: 'comboboxtree',
//                displayField: 'text',
//                valueField: 'id',
//                allowBlank: false,
//                queryMode: 'remote',
//                editable: false,
//                store:deptstore,
//                listeners:{
//                    nodeclick: function(combo, records, eOpts) {
//                        var selectRecord = usergrid.getSelectionModel().getSelection();
//                        if(usergrid.plugins[0].editor.down('button').disabled == true){
//                        	usergrid.plugins[0].editor.down('button').setDisabled(false);
//                        }
//                        selectRecord[0].set('DEPTID', records.get('id'));
//                    }
//                }
//            }
//        },
		{
			text: '手术日期',
			dataIndex: 'SURGERY_DATE',
			sortable: false,
			align: 'left',
			width:'26%',
			editor: {
				xtype: 'datetimefield',
				allowBlank: false,
				maxLength: 200,
				value:new Date(),
				format: 'Y-m-d H:i'
			}
		},
		{
			text: '转入日期',
			dataIndex: 'IN_DATE',
			sortable: false,
			align: 'left',
			width:'26%',
			editor: {
				xtype: 'datetimefield',
				//allowBlank: false,
				maxLength: 200,
				value:new Date(),
				format: 'Y-m-d H:i'
			}
		}];
		var usergrid = Ext.create('Ext.grid.Panel', {
			id: 'surgery-grid',
			border: true,
			padding: '0 0 5 0',
			selType: 'rowmodel',
			lbar: [{
				xtype: 'button',
				id: 'add-sugerey',
				tooltip: '添加',
				iconCls: 'add',
				handler: function() {
					var patientInfo=Ext.util.Cookies.get("patientInfo");
			    	patientInfo = Ext.decode(patientInfo);
						var surgeryModel = Ext.create('com.dfsoft.icu.nws.patientdetails.surgeryModel', {
							SURGERY_DATE: new Date(),
							IN_DATE:new Date(),
							SURGERY_NAME: '新手术',
							DEPT_NAME:patientInfo.ICU_NAME,
							REGISTER_ID: patientInfo.REGISTER_ID
						});
						userStore.insert(0, surgeryModel);
						rowEditing.startEdit(0, 0);
				}
			}, {
				xtype: 'button',
				tooltip: '删除',
				id: 'delete-sugerey',
				iconCls: 'delete',
				handler: function() {
					var records = usergrid.getSelectionModel().getSelection();
					if (records.length < 1) {
						Ext.MessageBox.alert('提示', '请选择手术内容');
						return;
					}
					Ext.Msg.confirm('删除', '确定删除?', function(btn) {
			            if (btn == 'yes') {
			            	Ext.Ajax.request({
								url: webRoot + '/nws/icu_patient/deletesurgery_record/' + records[0].data.ID,
								params:{
									ID:records[0].data.ID
								},
								method: 'PUT',
								scope: this,
								success: function(response) {
									var respText = Ext.decode(response.responseText).data;
									userStore.reload();
								},
								failure: function(response, options) {
									Ext.MessageBox.alert('提示', '删除失败,请求超时或网络故障!');
								}
							});
			            }
			        });
				}
			}], 
			plugins: [rowEditing],
			store: userStore,
			columnLines: true,
			columns: userColumn
		});
		usergrid.width = '100%';
		usergrid.height=170;
		return usergrid;
	}
});
}