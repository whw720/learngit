Ext.define('com.dfsoft.lancet.sys.settings.User', {
	extend: 'Ext.panel.Panel',
	requires: [
		'Ext.grid.*',
		'Ext.data.*',
		'com.dfsoft.lancet.sys.desktop.SlideMessage'
	],
	region: 'center',
	id: 'user-role-panel', 
	border: false,
	layout: 'border',
	split: {
		size: 5
	},
	bodyStyle: 'background: white',
	initComponent: function() {
		var me = this;
		me.user = me.createUserPanel();
		if (mode === 'lite') {
			me.items = [me.user];
		} else {
			me.role = me.createRolePanel();
			me.resource = me.createResourcePanel();
			me.items = [me.user, {
				xtype: 'panel',
				border: 1,
				region: 'center',
				split: {
					size: 5
				},
				layout: 'border',
				bodyStyle: 'background: white',
				items: [me.role, me.resource]
			}];
		}

		me.on('beforerender', me.onBeforeRender);
		me.callParent();
	},

	//创建人员面板
	createUserPanel: function() {
		var userStore = Ext.create('Ext.data.Store', {
			model: 'com.dfsoft.lancet.sys.settings.UserModel',
			proxy: {
				type: 'ajax',
				url: '',
				method: 'GET',
				reader: {
					type: 'json',
					root: 'data'
				}
			}
		});

		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit: 2,
			autoCancel: false,
			listeners: {
				canceledit: function(editor, context) {
			        Ext.getCmp('delete-user').setDisabled(false);
					var grid = context.grid;
					var items = grid.getSelectionModel().getSelection();
					Ext.each(items, function(item) {
						if (item.data.id.length == 0) {
							userStore.remove(item);
						}
					});
				},
				edit: function(editor, context) {
					var newRecord = context.record;
					if (newRecord.data.name.length == 0 || newRecord.data.password.length == 0) {
						userStore.remove(newRecord);
						return;
					}
					Ext.getCmp('delete-user').setDisabled(false);
					//检查用户是否存在
					if (newRecord.data.id.length == 0) {
						Ext.Ajax.request({
                    		url: webRoot + '/sys/user/queryUser/' + newRecord.data.name + '/null',
                    		method: 'PUT',
                    		params: {
                    		name: newRecord.data.name
                            },
                            success: function(response) {
                            	var respText = Ext.decode(response.responseText).data;
                    			if(respText.flag==false){
                    				Ext.MessageBox.alert('提示',respText.msg);
                    				userStore.reload();
                    				return false;
                    			}else{
                    				Ext.Ajax.request({
            							url: webRoot + '/sys/user',
            							method: 'POST',
            							scope: this,
            							params: {
            								DEPT_ID: newRecord.data.dept_id,
            								NAME: newRecord.data.name,
            								HELPER_CODE:newRecord.data.helpercode,
            								PASSWORD: newRecord.data.password,
            								PHONE: newRecord.data.phone,
            								PRACTITIONER_QUALIFICATION: newRecord.data.practitioner_qualification,
            								QUALIFICATION_YEAR: newRecord.data.years_qualification
            							},
            							success: function(response) {
            								var respText = Ext.decode(response.responseText).data;
            								userStore.reload();
            							},
            							failure: function(response, options) {
            								Ext.MessageBox.alert('提示', '添加人员失败,请求超时或网络故障!');
            							}
            						});
                    			}
                            },
                            failure: function(response, options) {
                            }
                        });
					} else {
						//修改
						if (newRecord.data.password === '********') {
							newRecord.data.password = null;
						}
						Ext.Ajax.request({
							url: webRoot + '/sys/user/queryUser/' + newRecord.data.name + '/'+newRecord.data.id,
                    		method: 'PUT',
                    		params: {
                    		name: newRecord.data.name,
                    		id:newRecord.data.id
                            },
                            success: function(response) {
                            	var respText = Ext.decode(response.responseText).data;
                            		if(respText.flag==false){
                        				Ext.MessageBox.alert('提示',respText.msg);
                        				userStore.reload();
                        				return false;
                        			}
                    			else{
                    				Ext.Ajax.request({
            							url: webRoot + '/sys/user/' + newRecord.data.id,
            							method: 'PUT',
            							scope: this,
            							params: {
            								NAME: newRecord.data.name,
            								HELPER_CODE:newRecord.data.helpercode,
            								PASSWORD: newRecord.data.password,
            								PHONE: newRecord.data.phone,
            								PRACTITIONER_QUALIFICATION: newRecord.data.practitioner_qualification,
            								QUALIFICATION_YEAR: newRecord.data.years_qualification
            							},
            							success: function(response) {
            								var respText = Ext.decode(response.responseText).data;
            								userStore.reload();
            							},
            							failure: function(response, options) {
            								Ext.MessageBox.alert('提示', '修改人员失败,请求超时或网络故障!');
            							}
            						});
                    			}
                            },
                            failure: function(response, options) {
                            }
                        });
					}
				}
			}
		});


		var userColumn = [{
			text: '所属科室',
			dataIndex: 'dept_name',
			sortable: false,
			align: 'left'
		}, {
			text: '姓名',
			dataIndex: 'name',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'textfield',
				allowBlank: false,
                maxLength: 20,
                maxLengthText: '最多可输入20个字符'
			}
		},{
			text: '助记码',
			dataIndex: 'helpercode',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'textfield',
                maxLength: 7,
                maxLengthText: '最多可输入7个字符'
			}
		}, {
			text: '登录密码',
			dataIndex: 'password',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'textfield',
				inputType: 'password',
				allowBlank: false
			}
		}, {
			text: '手机号码',
			dataIndex: 'phone',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'textfield',
				//regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
				regex: /^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/,
				regexText: '手机号码格式不正确',
				maxLength: 11,
				maxLengthText: '最多可输入11个数字',
			}
		}, {
			text: '执业医师资格',
			dataIndex: 'practitioner_qualification',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'combobox',
				editable: false,
				queryMode: 'local',
				//allowBlank: false,
				valueField: 'value',
				displayField: 'text',
				maxLength: 7,
				maxLengthText: '最多可输入7个字符',
				store: new Ext.data.SimpleStore({
					fields: ['value', 'text'],
					data: [
						['住院医师', '住院医师'],
						['主治医师', '主治医师'],
						['副主任医师', '副主任医师'],
						['主任医师', '主任医师']
					]
				}),
				listeners: {
                    render : function(p) {//渲染后给el添加mouseover事件
                        p.getEl().on('keydown', function (e) {
                            if (e.getKey() == 46) {
                                p.setRawValue('');
                                p.setValue('');
                            }
                        });
                    }
                }
			}
		}, {
			text: '年资',
			dataIndex: 'years_qualification',
			sortable: false,
			align: 'left',
			editor: {
				xtype: 'combobox',
				editable: false,
				queryMode: 'local',
				//allowBlank: false,
				valueField: 'value',
				displayField: 'text',
				maxLength: 7,
				maxLengthText: '最多可输入7个字符',
				store: new Ext.data.SimpleStore({
					fields: ['value', 'text'],
					data: [
						['高', '高'],
						['低', '低']
					]
				}),
				listeners: {
                    render : function(p) {//渲染后给el添加mouseover事件
                        p.getEl().on('keydown', function (e) {
                            if (e.getKey() == 46) {
                                p.setRawValue('');
                                p.setValue('');
                            }
                        });
                    }
                }
			}
		}];
		if (mode === 'lite') {
			var flex = [1.5, 1, 1.5, 1.5, 2, 1];
			for (var i = 0; i < userColumn.length; i++) {
				userColumn[i].flex = flex[i];
			}
		} else {
			var width = ['35%', '28%', '30%', '40%', '40%', '20%'];
			for (var i = 0; i < userColumn.length; i++) {
				userColumn[i].width = width[i];
			}
		}
		var usergrid = Ext.create('Ext.grid.Panel', {
			id: 'user-grid',
			border: 1,
			region: 'west',
			split: {
				size: 5
			},
			records: [],
			selType: 'rowmodel',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/user.png" />',
					width: '10px'
				}, '人员',"->",{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/search.png" />',
					width: '10px',
					margin: '0 10 0 0'
				}, {
					xtype: 'textfield',
					hideLabel: true,
					width: 120,
					listeners: {
						change: function(_this, newValue, oldValue, eOpts) {
							var newValue = String(Ext.util.Format.trim(newValue)).toUpperCase(),
							userStore = usergrid.getStore();
							var result = [];
							for (var i = 0; i < usergrid.records.length; i++) {
								var helpercode = String(usergrid.records[i].data.helpercode).toUpperCase();
								var name = String(usergrid.records[i].data.name).toUpperCase();
								var str=name.replace(newValue,'test');
								
								if (!newValue || name.indexOf(newValue) == 0 || helpercode.indexOf(newValue) == 0) {
									result.push(usergrid.records[i]);
								}else{
									//模糊匹配
									if(str!=name){
										result.push(usergrid.records[i]);
									}
								}
							}
							userStore.loadData(result);
						}
					}
				},{
					xtype: 'button',
					id: 'add-user',
					tooltip: '添加',
					disabled: true,
					iconCls: 'add',
					handler: function() {
						Ext.getCmp('delete-user').setDisabled(true);
						rowEditing.cancelEdit();
						var currDept = Ext.getCmp('dept-tree-panel').getSelectionModel().getSelection();
						if (currDept.length > 0) {
							var userModel = Ext.create('com.dfsoft.lancet.sys.settings.UserModel', {
								dept_name: currDept[0].data.text,
								dept_id: currDept[0].data.id,
								name: '新人员',
								password: '123'
							});
							userStore.insert(0, userModel);
							rowEditing.startEdit(0, 0);
						} else {
							Ext.MessageBox.alert('提示', '请先选择科室!');
						}
					}
				}, {
					xtype: 'button',
					tooltip: '删除',
					id: 'delete-user',
					iconCls: 'delete',
					handler: function() {
						var records = usergrid.getSelectionModel().getSelection();
						if (records.length < 1) {
							Ext.MessageBox.alert('提示', '请选择要删除的人员!');
							return;
						}
						if (records[0].data.name === 'lite') {
							Ext.MessageBox.alert('提示', '不能删除初始化用来登录的人员!');
							return;
						}
						Ext.Msg.confirm('删除用户', '确定删除用户?', function(btn) {
				            if (btn == 'yes') {
				            	Ext.Ajax.request({
									url: webRoot + '/dic/sys_user/cancel/' + records[0].data.id,
									method: 'PUT',
									scope: this,
									success: function(response) {
										var respText = Ext.decode(response.responseText).data;

										if (mode != 'lite') {
											var role_store = Ext.getCmp('role-grid').getStore();
											var records = role_store.getRange(0, role_store.getCount());
											for (var i = 0; i < records.length; i++) {
												records[i].data.OK = false;
											}
											role_store.loadData(records, false);
											Ext.getCmp('role-grid').setDisabled(true);
											Ext.getCmp('resource-tree-panel').setDisabled(true);
										}
										var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
										msg.popup('提示：', '删除人员成功！');
										userStore.reload();
									},
									failure: function(response, options) {
										Ext.MessageBox.alert('提示', '删除人员失败,请求超时或网络故障!');
									}
								});
				            }
				        });
					}
				}]
			}],
			plugins: [rowEditing],
			store: userStore,
			columnLines: true,
			columns: userColumn,
			minWidth: 225,
			listeners: {
				itemclick: function(_this, record, item, index, e, eOpts) {
					//根据当前人员取得其对应的所有角色并勾选
					if (mode != 'lite') {
						Ext.Ajax.request({
							url: webRoot + '/sys/roleByUserID/' + record.data.id,
							method: 'GET',
							scope: this,
							success: function(response) {
								var respText = Ext.decode(response.responseText).data;
								var role_panel = Ext.getCmp('role-grid'),
									role_store = role_panel.getStore();
								role_panel.setDisabled(false);
								var roleRecords = role_store.getRange(0, role_store.getCount());
								for (var i = 0; i < roleRecords.length; i++) {
									roleRecords[i].data.OK = false;
								}
								for (var i = 0; i < roleRecords.length; i++) {
									for (var j = 0; j < respText.length; j++) {
										if (respText[j].ROLE_ID === roleRecords[i].data.id) {
											roleRecords[i].data.OK = true;
										}
									}
								}
								role_store.loadData(roleRecords, false);
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '获取人员权限失败,请求超时或网络故障!');
							}
						});
					}
				}
			}
		});
		if (mode != 'lite') {
			usergrid.width = '55%';
		}
		return usergrid;
	},

	//创建角色面板
	createRolePanel: function() {
		var roleStore = Ext.create('Ext.data.Store', {
			fields: [{
				name: 'id',
				type: 'string'
			}, {
				name: 'name',
				type: 'string'
			}, {
				name: 'OK',
				type: 'boolean',
				defaultValue: 'false'
			}],
			proxy: {
				type: 'ajax',
				url: webRoot + '/sys/role',
				reader: {
					type: 'json',
					root: 'data'
				}
			},
			autoLoad: true
		});
		var role = Ext.create('Ext.grid.Panel', {
			id: 'role-grid',
			height: '50%',
			region: 'north',
			border: false,
			hideHeaders: true,
			autoScroll: true,
			disabled: true,
			style: {
				borderBottom: '1px solid #99BCE8'
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				height: 36,
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/role.png" />',
					width: '10px'
				}, '角色']
			}],
			split: {
				size: 5
			},
			store: roleStore,
			columns: [{
				xtype: 'checkcolumn',
				sortable: false,
				dataIndex: 'OK',
				width: '21%',
				listeners: {
					checkchange: function(_this, rowIndex, checked) {
						var usergrid = Ext.getCmp('user-grid');
						var currUser = usergrid.getSelectionModel().getSelection();

						// //判断是否单选
						// var currRecord = roleStore.getAt(rowIndex);
						// var records = roleStore.getRange(0, roleStore.getCount());
						// if (currRecord.data.OK === true) {
						// 	for (var i = 0; i < records.length; i++) {
						// 		if (currRecord.data.id != records[i].data.id) {
						// 			records[i].data.OK = false;
						// 		}
						// 	}
						// }
						// roleStore.loadData(records, false);
						console.log(currUser);
						var currRecord = roleStore.getAt(rowIndex);
						//选中即将当前角色赋给当前人员
						if (checked) {
							Ext.Ajax.request({
								url: webRoot + '/sys/user_role',
								method: 'POST',
								scope: this,
								params: {
									ROLE_ID: currRecord.data.id,
									USER_ID: currUser[0].data.id
								},
								success: function(response) {
									Ext.getCmp('user-grid').getStore().reload();
									var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
									msg.popup('提示：', '人员修改角色成功！');
									currRecord.commit();
								},
								failure: function(response, options) {
									Ext.MessageBox.alert('提示', '人员修改角色失败,请求超时或网络故障!');
								}
							});
						} else {
							Ext.Ajax.request({
								url: webRoot + '/sys/user_role/' + currRecord.data.id,
								method: 'DELETE',
								scope: this,
								params: {
									USER_ID: currUser[0].data.id
								},
								success: function(response) {
									Ext.getCmp('user-grid').getStore().reload();
									Ext.getCmp('resource-tree-panel').setDisabled(true);
									var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
									msg.popup('提示：', '人员删除角色成功！');
									currRecord.commit();
								},
								failure: function(response, options) {
									Ext.MessageBox.alert('提示', '人员删除角色失败,请求超时或网络故障!');
								}
							});
						}
						currRecord.commit();
					}
				}
			}, {
				width: '78%',
				dataIndex: 'name',
				align: 'left',
				sortable: false
			}],
			listeners: {
				//点击当前角色选中其对应的权限
				itemclick: function(_this, record, item, index, e, eOpts) {
					var resourcePanel = Ext.getCmp('resource-tree-panel'),
						resourceData, //权限树的所有节点
						resourceRoot = resourcePanel.getRootNode();

					//遮罩效果
					var myMask = new Ext.LoadMask(resourcePanel, {
						msg: "数据加载中..."
					});
					myMask.show();

					//查找所有节点
					var getChild = function(node) {
						var childs = [];
						var childNodes = node.childNodes;
						for (var i = 0; i < childNodes.length; i++) {
							childs.push(childNodes[i]);
							if (childNodes[i].hasChildNodes()) {
								childs = childs.concat(getChild(childNodes[i]));
							}
						}
						return childs;
					}

					resourceData = getChild(resourceRoot);
					resourcePanel.setDisabled(false);
					Ext.Ajax.request({
						url: webRoot + '/sys/role_resource/' + record.data.id,
						method: 'GET',
						scope: this,
						success: function(response) {
							var respText = Ext.decode(response.responseText).data;
							//每次勾选权限之前先清空上次的勾选
							for (var i = 0; i < resourceData.length; i++) {
								resourceData[i].data.checked = false;
								resourceData[i].triggerUIUpdate();
							}

							//找到当前角色对应的权限节点
							for (var i = 0; i < respText.length; i++) {
								var currResource = resourcePanel.getStore().getNodeById(respText[i].resource_id);
								if (currResource != undefined) {
									currResource.data.checked = true;
									currResource.triggerUIUpdate();
								}
							}
							myMask.hide();
						},
						failure: function(response, options) {
							Ext.MessageBox.alert('提示', '获取角色权限失败,请求超时或网络故障!');
						}
					});
				}
			}
		});

		return role;
	},

	//创建权限面板
	createResourcePanel: function() {

		//权限树节点数据
		var resourceData;
		Ext.Ajax.request({
			url: webRoot + '/sys/resource/role/',
			method: 'GET',
			async: false,
			scope: this,
			success: function(response) {
				var respText = Ext.decode(response.responseText).data;
				resourceData = respText[0];
			},
			failure: function(response, options) {
				Ext.MessageBox.alert('提示', '获取权限列表失败,请求超时或网络故障!');
			}
		});


		var resource = Ext.create('Ext.tree.Panel', {
			id: 'resource-tree-panel',
			region: 'center',
			border: false,
			disabled: true,
			style: {
				borderTop: '1px solid #99BCE8'
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/privilege.png" />',
					width: '10px'
				}, '权限']
			}],
			useArrows: true,
			//store: resourceStore,
			rootVisible: false,
			listeners: {
				checkchange: function(node, checked, eOpts) {

					var checkChild = function(node) {
						var childNodes = node.childNodes;
						if (childNodes || childNodes.length > 0) {
							for (var i = 0; i < childNodes.length; i++) {
								childNodes[i].data.checked = checked;
								childNodes[i].triggerUIUpdate();
								if (childNodes[i].hasChildNodes()) {
									checkChild(childNodes[i]);
								}
							}
						}
					}

					var checkParent = function(node) {
						var parentNode = node.parentNode;
						var childNodes = parentNode.childNodes;
						if (parentNode) {
							parentNode.data.checked = true;
							parentNode.triggerUIUpdate();
							if (parentNode.parentNode && node.parentNode.data.id != 'root') {
								checkParent(parentNode);
							}
						}
					}
					checkChild(node);
					if (node.parentNode && node.parentNode.data.id != 'root' && node.parentNode.data.checked != true) {
						checkParent(node);
					}
					var rolegrid = Ext.getCmp('role-grid'),
						currRole = rolegrid.getSelectionModel().getSelection(),
						resources = resource.getChecked();
					var RESOURCE_IDS = [];

					for (var i = 0; i < resources.length; i++) {
						if (resources[i].data.id != 'root') {
							RESOURCE_IDS.push(resources[i].data.id);
						}
					}
					Ext.Ajax.request({
						url: webRoot + '/sys/role_resource',
						method: 'POST',
						scope: this,
						params: {
							ROLE_ID: currRole[0].data.id,
							RESOURCE_IDS: RESOURCE_IDS
						},
						success: function(response) {
							var respText = Ext.decode(response.responseText).data;
							var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
							msg.popup('提示：', '角色修改权限成功！');
						},
						failure: function(response, options) {
							Ext.MessageBox.alert('提示', '添加权限失败,请求超时或网络故障!');
						}
					});
				}
			}
		});
		resource.setRootNode(resourceData);
		return resource;
	},

	//lite模式下隐藏角色和权限面板
	onBeforeRender: function(_this, eOpts) {
		if (mode === 'lite') {
			_this.layout = 'fit';
		}
	}
});