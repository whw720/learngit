/**
 * 功能说明: 护理字典 tree
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareItemTree', {
	extend: 'Ext.tree.Panel',
	initComponent: function() {
		var me = this;
		me.careItemTreeStore = new Ext.data.TreeStore({
			
			model: 'com.dfsoft.lancet.sys.settings.CareItemTreeModel',
			proxy: {
				type: 'ajax',
				url: webRoot + '/dic/dic_care_item/tree/all',
				reader: {
					type: 'json',
					root: 'children'
				}
			},
			autoLoad: true
		});
		me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];
		Ext.apply(me, {
			region: 'north',
			height: '50%',
			border: true,
			split: {
				size: 5
			},
			hideHeaders: true,
			rootVisible: false,
			autoScroll: true,
			store: me.careItemTreeStore,
			columns: [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
				editor: {
					xtype: 'textfield',
					regex: /^[a-zA-Z0-9-_.-\\)\(\s\%\u4e00-\u9fa5]+$/,
					regexText: '可以输入中文、英文、数字、横线、斜杠、括号、空格、%、下划线或点',
					maxLength: 20,
					maxLengthText: '最多可输入20个字符',
					allowBlank: false,
					selectOnFocus: true,
					msgTarget: 'side'
				}
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: ['护理项目', '->', {
					xtype: 'splitbutton',
					tooltip: '添加',
					iconCls: 'add',
					menu: [{
						text: '添加分类',
						iconCls: 'care-caretory',
						scope: me,
						handler: me.addCaretory
					}, {
						text: '添加项',
						iconCls: 'care-item',
						scope: me,
						handler: me.addItem,
						disabled: true
					}]
				}, '-', {
					xtype: 'button',
					tooltip: '删除',
					iconCls: 'delete',
					scope: me,
					handler: me.deleteNode
				}]
			}],
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
						if (!aimNode.isExpanded()) {
							aimNode.expand();
						}
						//节点拖动之后的父节点
						var aimNodeId = aimNode.data.id,
							aimIconCls = aimNode.data.iconCls;
						if (aimIconCls === 'care-item') {
							aimNode.removeChild(currDropNode);
							beforeNode.appendChild(currDropNode);
							Ext.Msg.alert("拖动节点", "只能拖动到护理分类下！");
							return;
						} else {
							var aimPathName = aimNode.data.path_name;
							// 更新当前拖动节点的父关系
							Ext.Ajax.request({
								url: webRoot + '/dic/dic_care_item/tree/' + currDropNodeId,
								params: {
									CODE: currDropNodeId,
									PARENT_CODE: aimNodeId
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
							var orderItemIdArray = [],
								orderCategoryIdArray = [];
							for (var i = 0; i < afterDropAimChildren.length; i++) {
								if (afterDropAimChildren[i].data.iconCls === 'care-item') {
									orderItemIdArray[orderItemIdArray.length] = afterDropAimChildren[i].data.id;
								} else if (afterDropAimChildren[i].data.iconCls === 'care-caretory') {
									orderCategoryIdArray[orderCategoryIdArray.length] = afterDropAimChildren[i].data.id;
								}
							}
							var updateSort = function(orderSortArray) {
								Ext.Ajax.request({
									url: webRoot + '/dic/dic_care_item_sort',
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
							if (orderItemIdArray.length > 0) {
								updateSort(orderItemIdArray);
							}
							if (orderCategoryIdArray.length > 0) {
								updateSort(orderCategoryIdArray);
							}
						}
					}
				}
			},
			listeners: {
				itemexpand: function(_this, eOpts) {
					me.careItemTreeStore.proxy.url = '';
				}
			}
		});
		me.on('edit', me.updateNode, me);
		me.on('itemclick', me.onItemclick, me);
		me.callParent();
	},

	// 添加护理项目分类 
	addCaretory: function() {
		var me = this;
		me.addNode('caretory');
	},

	// 添加护理项目
	addItem: function() {
		var me = this;
		me.addNode('item');
	},

	//删除节点
	deleteNode: function() {
		var me = this;
		var rs = me.getSelectionModel().getSelection();
		if (rs.length > 0) {
			rs = rs[0];
			var id = rs.data.id,
				iconCls = rs.data.iconCls;
			if (!rs.isExpanded()) {
				rs.expand();
			}
			if (rs.hasChildNodes()) {
				Ext.Msg.alert("删除节点", "请先删除所有子节点，再删除该节点！");
				return;
			} else {
				var content = '确定删除节点: ' + rs.data.text + ' ?';
				Ext.Msg.confirm('删除节点', content, function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							url: webRoot + '/dic/dic_care_item/' + id,
							method: 'DELETE',
							scope: this,
							success: function(response) {
								var respText = Ext.decode(response.responseText);
								rs.remove();
								me.itemContent.setDisabled(true);
								me.careItemTreeStore.proxy.url  =webRoot + '/dic/dic_care_item/tree/all';
								me.careItemTreeStore.reload();
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
							}
						});
					}
				}, me);
			}
		} else {
			Ext.Msg.alert("删除节点", "请先选择要删除的节点！");
		}
	},

	addNode: function(node) {
		var me = this,
			cellEditingPlugin = me.cellEditingPlugin,
			selectionModel = me.getSelectionModel(),
			selectedList = selectionModel.getSelection()[0],
			//parentList = selectedList.isLeaf() ? selectedList.parentNode : selectedList,
			model = me.store.getProxy().getModel(),
			newList = null,
			expandAndEdit = function() {
				if (selectedList.isExpanded()) {
					selectionModel.select(newList);
					cellEditingPlugin.startEdit(newList, 0);
				} else {
					me.on('afteritemexpand', function startEdit(list) {
						if (list === selectedList) {
							selectionModel.select(newList);
							cellEditingPlugin.startEdit(newList, 0);
							me.un('afteritemexpand', startEdit);
						}
					});
					selectedList.expand();
				}
			};
		if (selectedList == undefined) {
			selectedList = me.getStore().getRootNode();
		}

		//排序号
		var sortCaretory = 1,
			sortItem = 1;
		for (var i = 0; i < selectedList.childNodes.length; i++) {
			if (selectedList.childNodes[i].data.iconCls === 'care-caretory') {
				sortCaretory++;
			} else if (selectedList.childNodes[i].data.iconCls === 'care-item') {
				sortItem++;
			}
		}
		//只能添加到分类下。
		if (selectedList.data.iconCls === 'care-item') {
			Ext.Msg.alert("添加节点", "护理项目下不允许再添加节点！");
			//组织机构下只能添加科室

		} else {
			if (node === 'item') {
				// if (selectedList.data.id === 'root') {
				// 	Ext.MessageBox.alert('提示', '组织机构下不能添加病区!');
				// }
				Ext.Ajax.request({
					url: webRoot + '/dic/dic_care_item',
					method: 'POST',
					params: {
						CODE: '',
						PARENT_CODE: selectedList.data.id,
						NAME: '新护理项',
						TYPE: 'I',
						SORT_NUMBER: sortItem
					},
					scope: this,
					success: function(response) {
						var respText = Ext.decode(response.responseText);
						newList = Ext.create(model, {
							id: respText.data.id,
							pid: selectedList.data.id,
							text: '新护理项',
							leaf: true,
							iconCls: 'care-item'
						});
						//me.parent.itemContent.setDisabled(true);
						selectedList.appendChild(newList);
						expandAndEdit();
					},
					failure: function(response, options) {
						Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
					}
				});
			} else if (node === 'caretory') {
				Ext.Ajax.request({
					url: webRoot + '/dic/dic_care_item',
					method: 'POST',
					params: {
						CODE: '',
						PARENT_CODE: selectedList.data.id,
						NAME: '新分类',
						TYPE: 'C',
						SORT_NUMBER: sortCaretory
					},
					scope: this,
					success: function(response) {
						var respText = Ext.decode(response.responseText);
						newList = Ext.create(model, {
							id: respText.data.id,
							pid: selectedList.data.id,
							text: '新分类',
							expanded: true,
							iconCls: 'care-caretory'
						});
						//me.parent.itemContent.setDisabled(true);
						me.getDockedItems('toolbar[dock="top"]')[0].items.items[2].menu.items.items[1].setDisabled(false);
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

	//更新节点
	updateNode: function(editor, e) {
		var me = this;
		var nodeId = e.record.data.id,
			newName = e.record.data.text,
			iconCls = e.record.data.iconCls;
		Ext.Ajax.request({
			url: webRoot + '/dic/dic_care_item/' + nodeId,
			params: {
				id: nodeId,
				name: newName
			},
			method: 'PUT',
			scope: me,
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
                    if (me.itemContent)me.itemContent.setDisabled(false);
                    if( me.itemContent&& me.itemContent.disabled==false){
                        me.itemContent.getForm().findField('NAME').setValue(newName);
                    }
				}
			},
			failure: function(response, options) {
				Ext.MessageBox.alert('提示', '修改节点名称失败,请求超时或网络故障!');
				e.record.reject();
			}
		});
	},

	// 显示当前护理项目的内容
	onItemclick: function(_this, record, item, index, e) {
		var me = this;
		me.itemContent = new com.dfsoft.lancet.sys.settings.CareItemContent({
			parent:me
		});
		var rangeGridStore = me.itemContent.rangeGrid.rangeStore,
			categoryName = '';
		var contentPanel = me.parent.items.items[2];
		contentPanel.removeAll(true);
		// 护理项目下不能再添加
		var buttons = me.getDockedItems('toolbar[dock="top"]')[0].items.items[2].menu.items.items;
		if (record.data.iconCls == 'care-item') {
			contentPanel.add(me.itemContent);
			me.itemContent.setDisabled(false);
			buttons[0].setDisabled(true);
			buttons[1].setDisabled(true);

			if (record.parentNode.data.id != 'root') {
				categoryName = record.parentNode.data.text;
			}
			// 加载当前护理项的内容
			Ext.Ajax.request({
				url: webRoot + '/dic/dic_care_item/' + record.data.id,
				method: 'GET',
				//async: false, //同步
				success: function(response) {
					var respText = Ext.decode(response.responseText),
						data = {
							CODE: '',
							CATEGORY_CODE: record.data.id,
							CATEGORY: categoryName,
							NAME: record.data.text,
							UNIT_CODE: '',
							DATA_FORMAT: '1',
							INPUT_TYPE: '1',
							NULL_VALUE: '',
							ALLOW_EDITING: 1,
							ALLOW_MULTI: 0,
							RANGE_TYPE: null,
							RANGE_SOURCE: null
						};
					//  给项目内容赋值
					if (respText.data.length > 0) {
						data.CODE = record.data.id,
						data.UNIT_CODE = respText.data[0].UNIT_CODE,
						data.DATA_FORMAT = respText.data[0].DATA_FORMAT,
						data.INPUT_TYPE = respText.data[0].INPUT_TYPE,
						data.NULL_VALUE = respText.data[0].NULL_VALUE,
						data.ALLOW_EDITING = respText.data[0].ALLOW_EDITING,
						data.ALLOW_MULTI = respText.data[0].ALLOW_MULTI,
						data.RANGE_TYPE = respText.data[0].RANGE_TYPE,
						data.RANGE_SOURCE = respText.data[0].RANGE_SOURCE
					}
					if (data.INPUT_TYPE == '1') {
						Ext.getCmp('extended-definition-panel').setDisabled(false);
					} else {
						Ext.getCmp('extended-definition-panel').setDisabled(true);
					}
					//系统字典，隐藏新增和删除按钮
					if (data.RANGE_TYPE == 'S'){
						me.itemContent.rangeGrid.setDisabled(true);
						Ext.getCmp('care_item_add').setDisabled(true);
						Ext.getCmp('care_item_delete').setDisabled(true);
                        me.itemContent.getForm().findField('RANGE_SOURCE').setDisabled(false);
					}else{
                        if(data.RANGE_TYPE!=''&&data.RANGE_TYPE!=null)
                            me.itemContent.getForm().findField('RANGE_SOURCE').setDisabled(true);
						me.itemContent.rangeGrid.setDisabled(false);
						Ext.getCmp('care_item_add').setDisabled(false);
						Ext.getCmp('care_item_delete').setDisabled(false);

					}

					me.itemContent.getForm().setValues(data);
					me.itemContent.setDisabled(false);
					me.itemContent.doLayout();
					rangeGridStore.proxy.url = webRoot + '/dic/dic_care_item/range/' + record.data.id;
					rangeGridStore.load();
				},
				failure: function(response, options) {
					Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
				}
			});
		} else {
			me.itemContent.setDisabled(true);
			buttons[0].setDisabled(false);
			buttons[1].setDisabled(false);
		}
	}
});