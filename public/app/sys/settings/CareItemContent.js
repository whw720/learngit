/**
 * 功能说明: 护理字典 项目内容 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareItemContent', {
	extend: 'Ext.form.Panel',
	requires: [
		'com.dfsoft.lancet.sys.settings.CareItemRangeGrid'
	],
	initComponent: function() {
		var me = this;
		me.rangeGrid = new com.dfsoft.lancet.sys.settings.CareItemRangeGrid();
		Ext.apply(me, {
			border: false,
			layout: 'border',
			disabled: true,
			bodyStyle: 'background: white',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: ['项目内容', '->', {
					xtype: 'button',
					tooltip: '保存',
					iconCls: 'save',
					scope: me,
					handler: me.savaItemContent
				}]
			}],
			items: [{
				xtype: 'fieldset',
				border: '1 0 0 0',
				padding: '5 10 0 5',
				region: 'north',
				height: 92,
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
						name: 'CODE'
					}, {
						xtype: 'hidden',
						name: 'CATEGORY_CODE'
					}, {
						xtype: 'textfield',
						name: 'CATEGORY',
						disabled: true,
						fieldLabel: '分类名称',
						width: '100%'
					}]
				}, {
					xtype: 'fieldcontainer',
					defaults: {
						labelWidth: 64,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'textfield',
						name: 'NAME',
						fieldLabel: '项目名称',
						allowBlank: false,
						regex: /^[a-zA-Z0-9-_.-\\)\(\s\%\u4e00-\u9fa5]+$/,
						regexText: '可以输入中文、英文、数字、横线、斜杠、括号、空格、%、下划线或点',
						maxLength: 20,
						maxLengthText: '最多可输入20个字符',
						width: '74%'
					}, {
						xtype: 'combo',
						name: 'UNIT_CODE',
						labelWidth: 38,
						fieldLabel: '单位',
						width: '26%',
						margin: '0 1 0 0',
						valueField: 'value',
                        editable:false,
						displayField: 'value',
						queryMode: 'remote',
						store: new Ext.data.Store({
							fields: ['value', 'text'],
							proxy: {
								type: 'ajax',
								url: webRoot + '/dics/dic_unit',
								method: 'GET',
								reader: {
									type: 'json',
									root: 'data'
								}
							},
							autoLoad: true
						}),
                        enableKeyEvents: true,
						listConfig: {
							cls: 'border-list',
							getInnerTpl: function() {
								return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}</span>';
							}
                        },
                        listeners: {
                            'keyup': function (combo, e, eOpts) {
                                if (e.button == 45) {
                                    combo.setValue(null);
                                }
                                ;
                            }
                        }
					}]
				}, {
					xtype: 'fieldcontainer',
					margin: '5 0 0 0',
					defaults: {
						labelWidth: 64,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'combo',
						name: 'DATA_FORMAT',
						fieldLabel: '数据格式',
						width: '32%',
						editable: false,
						allowBlank: false,
						valueField: 'value',
						displayField: 'text',
						value: '1',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data: [
								['0', '字符串'],
								['1', '数值'],
								['2', '日期']
							]
						})
					}, {
						xtype: 'combo',
						name: 'INPUT_TYPE',
						fieldLabel: '录入方式',
						width: '42%',
						editable: false,
						allowBlank: false,
						valueField: 'value',
						displayField: 'text',
						value: '1',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data: [
								['0', '文本框'],
								['1', '下拉框'],
								['2', '复选框']
							]
						}),
						listeners: {
							select: function(combo, records, eOpts) {
								// 扩展定义面板
								var panel = Ext.getCmp('extended-definition-panel');
								if (records[0].data.value == 1) {
									panel.setDisabled(false);
								} else {
									panel.setDisabled(true);
								}
							}
						}
					}, {
						xtype: 'textfield',
						name: 'NULL_VALUE',
						fieldLabel: '空值',
						labelWidth: 38,
						width: '26%',
                        maxLength:200,
						margin: '0 2 0 0'
					}]
				}]
			}, {
				xtype: 'fieldset',
				title: '扩展定义',
				region: 'center',
				collapsible: true,
				margin: '0 10 5 10',
				padding: '0 10 5 5',
				layout: 'fit',
				items: [{
					xtype: 'panel',
					id: 'extended-definition-panel',
					disabled: true,
					layout: 'border',
					bodyStyle: 'background: white',
					items: [{
						xtype: 'fieldcontainer',
						region: 'north',
						height: 26,
						defaults: {
							labelWidth: 64,
							labelAlign: 'right'
						},
						layout: 'hbox',
						items: [{
							xtype: 'combo',
							name: 'ALLOW_EDITING',
							fieldLabel: '允许编辑',
							width: '50%',
							editable: false,
							allowBlank: false,
							valueField: 'value',
							displayField: 'text',
							value: 0,
							store: new Ext.data.SimpleStore({
								fields: ['value', 'text'],
								data: [
									[1, '是'],
									[0, '否']
								]
							})
						}, {
							xtype: 'combo',
							name: 'ALLOW_MULTI',
							fieldLabel: '允许多选',
							width: '50%',
							editable: false,
							allowBlank: false,
							valueField: 'value',
							displayField: 'text',
							value: 0,
							store: new Ext.data.SimpleStore({
								fields: ['value', 'text'],
								data: [
									[1, '是'],
									[0, '否']
								]
							})
						}]
					}, {
						xtype: 'panel',
						region: 'center',
						layout: 'border',
						border: true,
						margin: '3 0 0 5',
						bodyStyle: 'background: white',
						items: [{
								xtype: 'toolbar',
								region: 'north',
								height: 30,
								items: [{
									xtype: 'combo',
									name: 'RANGE_TYPE',
									fieldLabel: '取值范围&nbsp;&nbsp;类型',
									labelWidth: 90,
									width: 182,
									labelAlign: 'right',
									editable: false,
									allowBlank: false,
									valueField: 'value',
									displayField: 'text',
									store: new Ext.data.SimpleStore({
										fields: ['value', 'text'],
										data: [
											['M', '手工维护'],
											['S', '系统字典']
										]
									}),
									listeners: {
										select: function(_this, records) {
											var rangeSource = me.getForm().findField('RANGE_SOURCE');
											//系统字典，隐藏新增和删除按钮
											if (records[0].data.value == 'S') {
												me.rangeGrid.setDisabled(true);
                                                rangeSource.setDisabled(false);
												Ext.getCmp('care_item_add').setDisabled(true);
												Ext.getCmp('care_item_delete').setDisabled(true);
												rangeSource.allowBlank = true;
											}else {
												me.rangeGrid.setDisabled(false);
                                                rangeSource.setDisabled(true);
												Ext.getCmp('care_item_add').setDisabled(false);
												Ext.getCmp('care_item_delete').setDisabled(false);
												rangeSource.allowBlank = true;
											}
											rangeSource.setValue(null);
										}
									}
								}, {
									xtype: 'combo',
									name: 'RANGE_SOURCE',
									fieldLabel: '来源',
									labelWidth: 30,
									width: 162,
									labelAlign: 'right',
									editable: false,
									allowBlank: true,
									valueField: 'value',
									displayField: 'text',
									store: new Ext.data.SimpleStore({
										fields: ['value', 'text'],
										data: [
											['dic_drugs_route', '用药途径']
										]
									})
								}, '->', {
									xtype: 'button',
									tooltip: '添加',
									id:'care_item_add',
									iconCls: 'add',
									scope: me,
									handler: function() {
										// var model = me.rangeStore.getProxy().getModel();
										// me.rowEditing.cancelEdit();
										var rangeModel = [{
											'CODE': '',
											'DISPLAY_NAME': '请输入名称',
											'HELPER_CODE': '',
											'ITEM_VALUE': '请输入值',
											'IS_DEFAULT': false
										}];
										me.rangeGrid.rangeStore.loadData(rangeModel, true);
										//me.rowEditing.startEdit(rangeModel, 0);
									}
								}, '-', {
									xtype: 'button',
									tooltip: '删除',
									id:'care_item_delete',
									iconCls: 'delete',
									scope: me,
									handler: function() {
										var currRecord = me.rangeGrid.getSelectionModel().getSelection();
										if (currRecord.length == 0) {
											Ext.MessageBox.alert('提示', '请选择一条记录!');
											return;
										}
										me.rangeGrid.rangeStore.remove(currRecord[0]);
										me.rangeGrid.getView().refresh();
									}
								}]
							},
							me.rangeGrid
						]
					}]
				}]
			}]
		});
		me.callParent();
	},

	// 保存项目内容
	savaItemContent: function() {
		var me = this,
			rangeStore = me.rangeGrid.getStore(),
			//defaultValues = document.getElementsByName('default'),
			rangeStr = '';
		for (var i = 0; i < rangeStore.getCount(); i++) {
			var curr = rangeStore.getAt(i);
			if (rangeStr.length > 0) {
                rangeStr += '{|@|}';
			}
			if (curr.data.DISPLAY_NAME.length > 0) {
                rangeStr += curr.data.IS_DEFAULT + '{|}' + curr.data.DISPLAY_NAME + '{|}' + curr.data.HELPER_CODE + '{|}' + curr.data.ITEM_VALUE;
			}
		}
		if (me.getForm().isValid()) {
			//遮罩效果
			var myMask = new Ext.LoadMask(me, {
				msg: "保存中..."
			});
			myMask.show();
			me.getForm().submit({
				url: webRoot + '/dic/dic_care_item/opera/itemContent',
				method: 'PUT',
				params: {
					rangeStr: rangeStr
				},
				success: function(form, action) {
					myMask.hide();
					//Ext.getCmp('extended-definition-panel').setDisabled(true);
					me.parent.careItemTreeStore.proxy.url = webRoot + '/dic/dic_care_item/tree/all';
                    var currentNode = me.parent.getSelectionModel().getSelection()[0];
                    var name = form.findField('NAME').getValue();
                    if(name!=currentNode.raw.text){
                        currentNode.raw.text=name;
                        currentNode.data.text=name;
                        document.getElementById(me.parent.getView().id+"-record-"+currentNode.raw.id).lastChild.lastChild.lastChild.innerHTML=name;
                    }
                    if(me.getValues()['CODE']==''){
                        me.getForm().findField('CODE').setValue(me.getValues()['CATEGORY_CODE']);
                    }
                    me.rangeGrid.rangeStore.reload();
				},
				failure: function(form, action) {
					myMask.hide();
					Ext.MessageBox.alert('提示', '项目内容保存失败,请求超时或网络故障!');
				}
			});
		}
	}
});