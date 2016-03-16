/*
	系统设置，组织机构树。
	可CRUD，可拖拽。
*/

Ext.define('com.dfsoft.lancet.sys.settings.DeptTree', {
	extend: 'Ext.tree.Panel',
	region: 'west',
	id: 'dept-tree-panel',
	width: '30%',
	minWidth: 204,
	border: 1,
	split: {
		size: 5
	},
	store: new Ext.data.TreeStore({
		id: 'dept-tree-store',
		model: 'com.dfsoft.lancet.sys.settings.DepartmentModel',
		proxy: {
			type: 'ajax',
			url: webRoot + '/sys/tree/dept/all',
			reader: {
				type: 'json',
				root: 'children'
			}
		},
		root: {
			id: 'root',
			text: '组织机构',
			expanded: true
		},
		listeners: {
			load: function(_this, node, records, successful, eOpts) {
				var getChild = function(n) {
					var childs = [];
					var childNodes = n.childNodes;
					for (var i = 0; i < childNodes.length; i++) {
						childs.push(childNodes[i]);
						if (childNodes[i].hasChildNodes()) {
							childs = childs.concat(getChild(childNodes[i]));
						}
					}
					return childs;
				}
				var collapseChild = function(n) {
					for (var i = 0; i < n.length; i++) {
						n[i].collapseChildren();
						if (n[i].hasChildNodes()) {
							collapseChild(n[i].childNodes);
						}
					}
				}
				//获取所有节点
				var nodes = getChild(node),
					depth = 2;

				//设置组织机构默认只展开到二级深度
				Ext.each(nodes, function(node, index, _this) {
					if (node.data.iconCls === 'settings-dept' && node.getDepth() == (depth - 1)) {
						node.collapseChildren();
						collapseChild(node.childNodes);
					}
				});
			}
		}
	}),
	hideHeaders: true,
	rootVisible: true,
	autoScroll: true,
	containerScroll: true,
	viewConfig: {
		toggleOnDblClick: false,
		plugins: {
			ptype: 'treeviewdragdrop'
		},
		listeners: {
			//拖拽之前判断	
			beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
				//节点拖动之前的父节点
				beforeNode = data.records[0].parentNode;
				//dropHandlers.cancelDrop();
			},
			drop: function(node, data, dropRec, dropPosition) {
				//当前拖动节点
				var currDropNode = data.records[0],
					//当前拖动节点ID
					currDropNodeId = currDropNode.data.id;
				var aimNode = currDropNode.parentNode;
				//如果父节点未展开，则拖动之前先展开
				if(!aimNode.isExpanded()) {
					aimNode.expand();
				}
				//节点拖动之后的父节点
				var	aimNodeId = aimNode.data.id,
					aimIconCls = aimNode.data.iconCls;
				if (aimIconCls === 'icu-small') {
					aimNode.removeChild(currDropNode);
					beforeNode.appendChild(currDropNode);
					Ext.Msg.alert("拖动节点", "不能拖动到重症监护室下！");
					return;
				} else {
					var aimPathName = aimNode.data.path_name;
					// 更新当前拖动节点的父关系
					//判断当前拖动节点是病区还是科室
					if (aimPathName.length == 0) {
						aimPathName = currDropNodeId;
					} else {
						aimPathName += '.' + currDropNodeId;
					}
					Ext.Ajax.request({
						url: webRoot + '/sys/dept/tree/' + currDropNodeId,
						params: {
							ID: currDropNodeId,
							PARENT: aimNodeId,
							PATH_NAME: aimPathName
						},
						method: 'PUT',
						scope: this,
						success: function(response) {

						},
						failure: function(response, options) {
							Ext.MessageBox.alert('提示', '拖动失败,请求超时或网络故障!');
						}
					});
						

					//拖动后目标节点子节点
					var afterDropAimChildren = data.records[0].parentNode.childNodes;
					var orderDeptIdArray = [],
						orderWardIdArray = [],
						orderIcuIdArray = [];
					for (var i = 0; i < afterDropAimChildren.length; i++) {
						if (afterDropAimChildren[i].data.iconCls === 'settings-dept') {
							orderDeptIdArray[orderDeptIdArray.length] = afterDropAimChildren[i].data.id;
						} else if (afterDropAimChildren[i].data.iconCls === 'ward') {
							orderWardIdArray[orderWardIdArray.length] = afterDropAimChildren[i].data.id;
						} else {
							orderIcuIdArray[orderIcuIdArray.length] = afterDropAimChildren[i].data.id;
						}
					}
					var updateSort = function(orderSortArray) {
						Ext.Ajax.request({
							url: webRoot + '/sys/deptSort',
							params: {
								orderDeptIdArray: orderSortArray
							},
							method: 'PUT',
							scope: this,
							success: function(response) {

							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '更新排序号失败,请求超时或网络故障!');
							}
						});
					}
					if (orderDeptIdArray.length > 0) {
						updateSort(orderDeptIdArray);
					}
					if (orderWardIdArray.length > 0) {
						updateSort(orderWardIdArray);
					}
					if (orderIcuIdArray.length > 0) {
						updateSort(orderIcuIdArray);
					}
				}
			}
		}
	},
	initComponent: function() {
		var me = this;
		me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];
		me.columns = [{
			xtype: 'treecolumn',
			dataIndex: 'text',
			flex: 1,
			editor: {
				xtype: 'textfield',
				regex: /^[a-zA-Z0-9-_.\u4e00-\u9fa5]+$/,
				regexText: '可以输入中文、英文、数字、横线、下划线或点',
				maxLength: 20,
				maxLengthText: '最多可输入20个字符',
				allowBlank: false,
				selectOnFocus: true,
				msgTarget: 'side'
			}
		}];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				xtype: 'label',
				html: '<img src="/app/sys/settings/images/tree-dept.png" />',
				width: '10px'
			}, '科室', '->', {
				xtype: 'splitbutton',
				tooltip: '添加',
				iconCls: 'add',
				menu: [{
						text: '添加科室',
						iconCls: 'settings-dept',
						handler: me.handleNewDeptClick
					}, {
						text: '添加病区',
						iconCls: 'ward',
						handler: me.handleNewWardClick
					}, {
						id: 'add-icu',
						text: '添加重症监护室',
						iconCls: 'icu-small',
						handler: me.handlerNewIcuClick
					}
				]
			}, {
				xtype: 'button',
				tooltip: '删除',
				iconCls: 'delete',
				id: 'delete-dept',
				handler: me.deleteNode
			}]
		}];
		me.on('itemclick', me.onItemclick);
		me.on('itemexpand', me.onItemexpand);
		me.on('edit', me.updateNode, me);
		me.on('beforeedit', me.handleBeforeEdit, me);
		me.callParent();
	},
	//刷新树
	refreshView: function() {
		this.getView().refresh();
	},

	//删除节点
	deleteNode: function() {
		var treeDept = Ext.getCmp('dept-tree-panel');
		var rs = treeDept.getSelectionModel().getSelection();
		if (rs.length > 0) {
			rs = rs[0];
			var id = rs.data.id,
				iconCls = rs.data.iconCls;
			if (id === 'root') {
				Ext.Msg.alert("删除节点", "根节点不允许删除！");
				return;
			}
			if (rs.hasChildNodes()) {
				Ext.Msg.alert("删除节点", "请先删除所有子节点，再删除该节点！");
				return;
			} else {
				var content = '确定删除节点: ' + rs.data.text + ' ?';
				Ext.Msg.confirm('删除节点', content, function(btn) {
					if (btn == 'yes') {
//						if (iconCls === 'ward') {
//							Ext.Ajax.request({
//								url: webRoot + '/dic/sys_departments/cancel/' + id,
//								method: 'PUT',
//								scope: this,
//								success: function(response) {
//									var respText = Ext.decode(response.responseText);
//									if (respText.success == 'false') {
//										Ext.MessageBox.show({
//											title: '删除失败',
//											msg: respText.msg,
//											icon: Ext.Msg.ERROR,
//											buttons: Ext.Msg.OK
//										});
//									} else {
//										rs.remove();
//										Ext.getCmp('dept-tree-panel').refreshView();
//									}
//								},
//								failure: function(response, options) {
//									Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
//								}
//							});
//						} else {
							Ext.Ajax.request({
								url: webRoot + '/sys/user/' + id,
								method: 'GET',
								scope: this,
								success: function(response) {
									var respText = Ext.decode(response.responseText);
									if (respText.data.length > 0) {
										Ext.Msg.alert("删除节点", "请先删除该节点下的所有人员，再删除该节点！");
										return;
									} else {
										Ext.Ajax.request({
											url: webRoot + '/dic/sys_departments/cancel/' + id,
											method: 'PUT',
											scope: this,
											success: function(response) {
												var respText = Ext.decode(response.responseText);
												if (respText.success == 'false') {
													Ext.MessageBox.show({
														title: '删除失败',
														msg: respText.msg,
														icon: Ext.Msg.ERROR,
														buttons: Ext.Msg.OK
													});
												} else {
													rs.remove();
													Ext.getCmp('dept-tree-panel').refreshView();
												}
											},
											failure: function(response, options) {
												Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
											}
										});
									}
								},
								failure: function(response, options) {
									Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
								}
							});
//						}
					}
				}, treeDept);
			}
		} else {
			Ext.Msg.alert("删除节点", "请先选择要删除的节点！");
		}
	},
	//更新节点
	updateNode: function(editor, e) {
		var me = this;
		var nodeId = e.record.data.id,
			newName = e.record.data.text,
			iconCls = e.record.data.iconCls;
		Ext.Ajax.request({
			url: webRoot + '/sys/dept/' + nodeId,
			params: {
				id: nodeId,
				name: newName
			},
			method: 'PUT',
			scope: this,
			success: function(response) {
				var respText = Ext.decode(response.responseText);
				if (respText.success == 'false') {
					Ext.MessageBox.show({
						title: '更新失败',
						msg: respText.msg,
						icon: Ext.Msg.ERROR,
						buttons: Ext.Msg.OK
					});
				} else {
					e.record.commit();
				}
			},
			failure: function(response, options) {
				Ext.MessageBox.alert('提示', '修改节点名称失败,请求超时或网络故障!');
				e.record.reject();
			}
		});
	},
	//编辑前判断根节点不允许编辑
	handleBeforeEdit: function(editingPlugin, e) {
		return e.record.get('id') !== 'root';
	},
	//添加科室
	handleNewDeptClick: function() {
		Ext.getCmp('dept-tree-panel').addNode('dept');
	},
	//添加病区
	handleNewWardClick: function() {
		Ext.getCmp('dept-tree-panel').addNode('ward');
	},

	//添加重症监护室
	handlerNewIcuClick: function(me) {
		Ext.getCmp('dept-tree-panel').addNode('icu');
	},


	addNode: function(leaf) {
		var treeDept = Ext.getCmp('dept-tree-panel'),
			cellEditingPlugin = treeDept.cellEditingPlugin,
			selectionModel = treeDept.getSelectionModel(),
			selectedList = selectionModel.getSelection()[0],
			//parentList = selectedList.isLeaf() ? selectedList.parentNode : selectedList,
			model = treeDept.store.getProxy().getModel(),
			newList = null,
			expandAndEdit = function() {
				if (selectedList.isExpanded()) {
					selectionModel.select(newList);
					cellEditingPlugin.startEdit(newList, 0);
				} else {
					treeDept.on('afteritemexpand', function startEdit(list) {
						if (list === selectedList) {
							selectionModel.select(newList);
							cellEditingPlugin.startEdit(newList, 0);
							treeDept.un('afteritemexpand', startEdit);
						}
					});
					selectedList.expand();
				}
			};
		if (selectedList == undefined) {
			Ext.Msg.alert("添加节点", "请先选择科室！");
			return;
		}

		//排序号
		var sortDept = 1,
			sortWard = 1,
			sortIcu = 1;
		for (var i = 0; i < selectedList.childNodes.length; i++) {
			if (selectedList.childNodes[i].data.iconCls === 'settings-dept') {
				sortDept++;
			} else if (selectedList.childNodes[i].data.iconCls === 'ward') {
				sortWard++;
			} else {
				sortIcu++;
			}
		}
		//只能添加到科室节点下。
		if (selectedList.data.iconCls === 'icu-small') {
			Ext.Msg.alert("添加节点", "重症监护室下不允许再添加节点！");
			//组织机构下只能添加科室
			
		} else {
			if (leaf === 'ward') {
				// if (selectedList.data.id === 'root') {
				// 	Ext.MessageBox.alert('提示', '组织机构下不能添加病区!');
				// 	return;
				// }
				Ext.Ajax.request({
					url: webRoot + '/sys/dept',
					method: 'POST',
					params: {
						ID: '',
						NAME: '新病区',
						TYPE: 'W',
						PARENT: selectedList.data.id,
						PATH_NAME: selectedList.data.path_name,
						SORT_NUMBER: sortWard
					},
					scope: this,
					success: function(response) {
						var respText = Ext.decode(response.responseText);
						newList = Ext.create(model, {
							id: respText.data.id,
							pid: selectedList.data.id,
							text: '新病区',
							type: 'W',
							expanded: true,
							path_name: respText.data.path_name,
							iconCls: 'ward'
						});
						selectedList.appendChild(newList);
						expandAndEdit();
					},
					failure: function(response, options) {
						Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
					}
				});
			} else if (leaf === 'dept') {
				Ext.Ajax.request({
					url: webRoot + '/sys/dept',
					method: 'POST',
					params: {
						ID: '',
						NAME: '新科室',
						TYPE: 'D',
						PARENT: selectedList.data.id,
						PATH_NAME: selectedList.data.path_name,
						SORT_NUMBER: sortDept
					},
					scope: this,
					success: function(response) {
						var respText = Ext.decode(response.responseText);
						newList = Ext.create(model, {
							id: respText.data.id,
							pid: selectedList.data.id,
							text: '新科室',
							type: 'D',
							expanded: true,
							path_name: respText.data.path_name,
							iconCls: 'settings-dept'
						});
						selectedList.appendChild(newList);
						expandAndEdit();
					},
					failure: function(response, options) {
						Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
					}
				});
			} else if (leaf === 'icu') {
				Ext.Ajax.request({
					url: webRoot + '/sys/dept',
					method: 'POST',
					params: {
						ID: '',
						NAME: '新重症监护室',
						TYPE: 'I',
						PARENT: selectedList.data.id,
						PATH_NAME: selectedList.data.path_name,
						SORT_NUMBER: sortIcu
					},
					scope: this,
					success: function(response) {
						var respText = Ext.decode(response.responseText);
						newList = Ext.create(model, {
							id: respText.data.id,
							pid: selectedList.data.id,
							type: 'I',
							text: '新监护室',
							leaf: true,
							path_name: respText.data.path_name,
							iconCls: 'icu-small'
						});
						selectedList.appendChild(newList);
						expandAndEdit();
					},
					failure: function(response, options) {
						Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
					}
				});
			}
		}
	},

	//显示当前科室下的人员
	onItemclick: function(_this, record, item, index, e) {
		// 病区下不能添加人员。
		//if (record.data.iconCls === 'ward') {
		//	if (!Ext.getCmp('add-user').disabled) {
		//		Ext.getCmp('add-user').setDisabled(true);
		//	}
		//} else { // 科室和icu下可以添加人员
			var usergrid = Ext.getCmp('user-grid');
			var deptId;
			if (record.data.id === 'root') {


				deptId = 'all';
				if (Ext.getCmp('add-user').disabled == false) {
					Ext.getCmp('add-user').setDisabled(true);
				}
			} else {
				deptId = record.raw.id;
				if (Ext.getCmp('add-user').disabled) {
					Ext.getCmp('add-user').setDisabled(false);
				}
			}
			usergrid.getStore().proxy.url = webRoot + '/sys/user/' + deptId;
			//usergrid.getStore().load();
			usergrid.getStore().load({
				callback: function(records, operation, success) {
					usergrid.records = records;
				}
			});

			//人员刷新后角色全部设为未选中状态
			if (mode != 'lite') {
				var role_panel = Ext.getCmp('role-grid'),
					role_store = role_panel.getStore();
				role_panel.setDisabled(true);
				Ext.getCmp('resource-tree-panel').setDisabled(true);
				var records = role_store.getRange(0, role_store.getCount());
				for (var i = 0; i < records.length; i++) {
					records[i].data.OK = false;
				}

				role_store.loadData(records, false);
			}
		//}
	},
	onItemexpand: function(_this, eOpts) {
		Ext.getCmp('dept-tree-panel').getStore().proxy.url = '';
	}
});