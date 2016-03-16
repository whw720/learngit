Ext.define('com.dfsoft.lancet.sys.settings.Client', {
	extend: 'Ext.panel.Panel',
	requires: [
		'Ext.grid.*',
		'Ext.data.*'
	],
	title: '接口',
	id: 'settings_a30836d0265111e3a7c623368e524292',
	disabled: true,
	layout: 'border',
	border: false,
	bodyStyle: 'background: white',
	initComponent: function() {
		var me = this;
		me.client = me.createClientPanel();
		me.adapterList = me.createAdapterListPanel();
		me.adapterForm = me.createAdapterForm();
		me.items = [me.client, {
			id: 'sys-adapter',
			xtype: 'panel',
			border: 1,
			region: 'center',
			split: {
				size: 5
			},
			bodyStyle: 'background: white',
			layout: 'border',
			items: [me.adapterList, me.adapterForm]
		}];
		me.callParent();
	},

	//创建数据采集点
	createClientPanel: function() {
		var clientStore = Ext.create('Ext.data.Store', {
			model: 'com.dfsoft.lancet.sys.settings.LinkModel',
			proxy: {
				type: 'ajax',
				url: webRoot + '/sys/link',
				reader: {
					type: 'json',
					root: 'data'
				}
			},
			autoLoad: true
		});
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit: 2,
			autoCancel: false,
			listeners: {
				canceledit: function(editor, context) {
					var grid = context.grid;
					var items = grid.getSelectionModel().getSelection();
					Ext.each(items, function(item) {
						if (item.data.ID.length == 0) {
							clientStore.remove(item);
						}
					});
					Ext.getCmp('delBtn').setDisabled(false);
					Ext.getCmp('okBtn').setDisabled(false);
				},
				edit: function(editor, context) {
					var newRecord = context.record;
					if (newRecord.data.ID.length == 0) {
						// 新插入一条
						Ext.Ajax.request({
							url: webRoot + '/sys/link',
							method: 'POST',
							scope: this,
							params: {
								NAME: newRecord.data.NAME,
								URL: newRecord.data.URL
							},
							success: function(response) {
								var respText = Ext.decode(response.responseText).data;
								clientStore.reload();
								Ext.getCmp('delBtn').setDisabled(false);
								Ext.getCmp('okBtn').setDisabled(false);
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '添加数据采集点失败,请求超时或网络故障!');
								Ext.getCmp('delBtn').setDisabled(false);
								Ext.getCmp('okBtn').setDisabled(false);
							}
						});
					} else {
						//修改
						Ext.Ajax.request({
							url: webRoot + '/sys/link/' + newRecord.data.ID,
							method: 'PUT',
							scope: this,
							params: {
								NAME: newRecord.data.NAME,
								URL: newRecord.data.URL
							},
							success: function(response) {
								var respText = Ext.decode(response.responseText).data;
								clientStore.reload();
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '修改数据采集点失败,请求超时或网络故障!');
							}
						});
					}
				}
			}
		});

		var grid = Ext.create('Ext.grid.Panel', {
			border: 1,
			width: 248,
			region: 'west',
			split: {
				size: 5
			},
			minWidth: 246,
			selType: 'rowmodel',
			plugins: [rowEditing],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/data-collect-list.png" />',
					width: '10px'
				}, '数据采集点', '->', {
					xtype: 'button',
					tooltip: '添加',
					iconCls: 'add',
					handler: function() {
						var me = this;
						rowEditing.cancelEdit();
						var clientModel = Ext.create('com.dfsoft.lancet.sys.settings.LinkModel', {
							NAME: '新采集点',
							URL:'192.168.0.1'
						});
						clientStore.insert(0, clientModel);
						rowEditing.startEdit(0, 0);
						Ext.getCmp('delBtn').setDisabled(true);
						Ext.getCmp('okBtn').setDisabled(true);
					}
				}, {
					xtype: 'button',
					tooltip: '删除',
					id: 'delBtn',
					iconCls: 'delete',
					handler: function() {
						var records = grid.getSelectionModel().getSelection();
						if (records.length < 1) {
							Ext.MessageBox.alert('提示', '请选择要删除的数据采集点!');
							return;
						}
                        if(this.ownerCt.ownerCt.ownerCt.adapterList.getStore().getCount()>0){
                            Ext.MessageBox.alert('提示', '请先删除采集点下的设备，再删除采集点！');
                            return;

                        }
                     //  alert(this.ownerCt.ownerCt.ownerCt.adapterList.getStore().getCount());
                       // console.log(this.ownerCt.ownerCt);
                       //alert(me.adapterList);



						Ext.Msg.confirm('退出', '确认要删除 ' + records[0].data.NAME + ' 吗？', function(btn) {
							if (btn === 'yes') {
								Ext.Ajax.request({
									url: webRoot + '/sys/link/' + records[0].data.ID,
									method: 'DELETE',
									params: {
										NAME: records[0].data.NAME
									},
									scope: this,
									success: function(response) {
										var respText = Ext.decode(response.responseText).data;
										clientStore.reload();
										//var adapterList = Ext.getCmp('adapter-list-panel');
										//adapterList.store.proxy.url = webRoot + '/sys/adapter/' + '111';
										//adapterList.store.load();
										//adapterList.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getEl().dom.innerHTML = '数据采集点接口适配器列表';
										Ext.getCmp('adapter-info-form').setDisabled(true);
									},
									failure: function(response, options) {
										Ext.MessageBox.alert('提示', '删除数据采集点失败,请求超时或网络故障!');
									}
								});
//								Ext.Ajax.request({
//									url: webRoot + '/sys/adapter/updateAdapter/' + records[0].data.ID,
//									method: 'DELETE',
//									scope: this,
//									success: function(response) {
//									},
//									failure: function(response, options) {
//										//Ext.MessageBox.alert('提示', '删除数据采集点失败,请求超时或网络故障!');
//									}
//								});
							}
						});
					}
				}, {
					xtype: 'button',
					id: 'okBtn',
					tooltip: '确认',
                    hidden:true,
					disabled: true,
					iconCls: 'ok',
					handler: function() {
						var record = grid.getSelectionModel().getSelection()[0];
						Ext.Ajax.request({
							url: webRoot + '/service/link/test/' + record.data.ID,
							method: 'GET',
							scope: this,
							success: function(response) {
								var respText = Ext.decode(response.responseText);
								if (respText.success == true) {
									record.STATE = respText.data[0].STATE;
									grid.getView().refresh();
								}
							},
							failure: function(response, options) {
								Ext.MessageBox.alert('提示', '查询失败,请求超时或网络故障!');
							}
						});
					}
				}, '-', {
					xtype: 'button',
					tooltip: '刷新',
					iconCls: 'data-refresh',
					handler: function() {
						clientStore.reload();
						Ext.getCmp('add-button').setDisabled(true);
						Ext.getCmp('adapter-info-form').setDisabled(true);
					}
				}]
			}],
			store: clientStore,
			columnLines: true,
			columns: [{
				width: '15%',
				sortable: false,
				dataIndex: 'STATE',
				renderer: function(value) {
					if (value) {
						return '<img src="/app/sys/settings/images/ok.png" />';
					} else {
						return '<img src="/app/sys/settings/images/ok.png" />';
					}
				}
			}, {
				text: '名称',
				width: '32%',
				dataIndex: 'NAME',
				sortable: false,
				editor: {
					xtype: 'textfield',
					allowBlank: false,
                    maxLength:20
				}
			}, {
				text: '地址',
				width: '52%',
				dataIndex: 'URL',
				sortable: false,
				editor: {
					xtype: 'textfield',
                    maxLength:200
				}
			}],
			listeners: {
				itemclick: function(view, record, item, index, e) {
					var adapterList = Ext.getCmp('adapter-list-panel');
					linkId = record.data.ID;
					adapterList.store.proxy.url = webRoot + '/sys/adapter/' + linkId;
					adapterList.store.load();
					adapterList.getDockedItems('toolbar[dock="top"]')[0]
						.items.items[1].getEl().dom.innerHTML = '数据采集点"' + record.data.NAME + '"接口适配器列表';
					Ext.getCmp('adapter-info-form').setDisabled(true);
					Ext.getCmp('add-button').setDisabled(false);
					Ext.getCmp('okBtn').setDisabled(false);
				}
			}
		});
		return grid;
	},

	//适配器列表
	createAdapterListPanel: function() {
		var me = this;
		var adapterStore = Ext.create('Ext.data.Store', {
			model: 'com.dfsoft.lancet.sys.settings.AdapterModel',
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
		var adapter = Ext.create('Ext.grid.Panel', {
			id: 'adapter-list-panel',
			height: '52%',
			border: false,
			style: {
				borderBottom: '1px solid #99BCE8'
			},
			store: adapterStore,
			autoScroll: true,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/data-collect.png" />',
					width: '10px'
				}, '数据采集点' + '接口适配器列表', '->', {
					xtype: 'button',
					id: 'add-button',
					tooltip: '添加',
					iconCls: 'add',
					disabled: true,
					handler: function() {
						var infoForm = Ext.getCmp('adapter-info-form');
						infoForm.setDisabled(false);
						var select = infoForm.getForm().findField('PROTOCOL');
						infoForm.getForm().setValues({
							'ID': '',
							'TYPE': '',
							'NAME': '',
							'MANUFACTURER': '',
							'PRODUCT_TYPE': '',
							'DESCRIPTION': '',
							'CHANNEL': '',
							'MODEL': '',
							'CHANNEL_SETTING': '',
							'ICU_ROOM':'',
							//'PROTOCOL': '',
							'RECEIVING_INTERVAL': '',
							'COLL_PROJECT': '0项'
						});
						infoForm.getForm().findField('PROTOCOL').setDefaultValue('', '');
						var model = infoForm.getForm().findField('MODEL');
						model.setReadOnly(true);
						model.setFieldLabel('X件类型');
						select.focus();
                        //处理有些必输项不报红的问题。
                        infoForm.isValid();
					}
				}, {
					xtype: 'button',
					tooltip: '删除',
					iconCls: 'delete',
					handler: function() {
						var records = adapter.getSelectionModel().getSelection()[0];
                        if(records == undefined){
                            Ext.MessageBox.alert('提示',"请选择要删除的适配器！");
                            return;
                        }
						var id = records.data.ID;
						var data = [],
							json = JSON.stringify(data);
						Ext.Msg.confirm('删除适配器', '确定删除适配器?', function(btn) {
				            if (btn == 'yes') {

                                Ext.Ajax.request({
                                    url: webRoot + '/sys/adapter/getAdapterAsBed/' + id,
                                    method: 'GET',
                                    scope: this,
                                    success: function(response) {
                                        var respText = Ext.decode(response.responseText);
                                        if (respText.success == 'false') {
                                            Ext.MessageBox.show({
                                                title: '获取床位关联信息失败！',
                                                msg: respText.msg,
                                                icon: Ext.Msg.ERROR,
                                                buttons: Ext.Msg.OK
                                            });
                                        } else {
                                            //删除设备
                                            if(respText.data.length > 0){
                                                var bedNum = respText.data[0].BED_NUMBER;
                                                var depName = respText.data[0].name;
                                                Ext.MessageBox.alert('提示', '科室【' + depName + "】 下 【" + bedNum + "】 床绑定该设备，请删除绑定后再删除该设备！");

                                            }else{
                                                Ext.Ajax.request({
                                                    url: webRoot + '/sys/adapter/updateAdapter/' + id,
                                                    method: 'DELETE',
                                                    params: {
                                                    	NAME: records.data.NAME
                                                    },
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
                                                            adapter.store.reload();
                                                            var infoForm = Ext.getCmp('adapter-info-form');
                                                            infoForm.getForm().setValues({
                                                                'ID': '',
                                                                'TYPE': '',
                                                                'NAME': '',
                                                                'MODEL': '',
                                                                'ICU_ROOM': '',
                                                                'LOCATION_ID': '',
                                                                'MANUFACTURER': '',
                                                                'PRODUCT_TYPE': '',
                                                                'DESCRIPTION': '',
                                                                'CHANNEL': '',
                                                                'CHANNEL_SETTING': '',
                                                                'PROTOCOL': '',
                                                                'RECEIVING_INTERVAL': '',
                                                                'COLL_PROJECT': '0项'
                                                            });
                                                            infoForm.getForm().findField('PROTOCOL').setDefaultValue('', '');
                                                            infoForm.setDisabled(true);
                                                        }
                                                    },
                                                    failure: function(response, options) {
                                                        Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
                                                    }
                                                });

                                            }

                                        }
                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
                                    }
                                });

				            }
				        });
					}
				}]
			}],
			region: 'north',
			split: {
				size: 5
			},
			columnLines: true,
			columns: [{
				text: '类型',
				width: '11%',
				dataIndex: 'TYPE',
				sortable: false,
				align: 'left'
			}, {
				text: '名称',
				width: '16%',
				dataIndex: 'NAME',
				sortable: false,
				align: 'left'
			}, {
				text: '制造商',
				width: '13%',
				dataIndex: 'MANUFACTURER',
				sortable: false,
				align: 'left'
			}, {
				text: '产品型号',
				width: '15%',
				dataIndex: 'PRODUCT_TYPE',
				sortable: false,
				align: 'left'
			}, {
				text: '数据通道',
				width: '15%',
				dataIndex: 'CHANNELNAME',
				sortable: false,
				align: 'left'
			}, {
				text: '协议',
				width: '15%',
				dataIndex: 'PROTOCOLNAME',
				sortable: false,
				align: 'left'
			}, {
				text: '采集频率',
				width: '15%',
				dataIndex: 'RECEIVING_INTERVAL',
				sortable: false,
				align: 'left'
			}, {
				text: '位置',
				width: '16%',
				dataIndex: 'ICU_ROOM',
				sortable: false,
				align: 'left'
			}],
			listeners: {
				itemclick: function(view, record, item, index, e) {
					var clientRecord = me.client.getSelectionModel().getSelection()[0];
					// 用于记录当前适配器的数据通道，以防止 修改适配器数据通道信息后，类型仍记忆上次选择的信息
					me.initialChannel = record.data.CHANNEL;
					me.initialChannelSetting = record.data.CHANNEL_SETTING;
					Ext.getCmp('adapter-info-form').setDisabled(false);
					Ext.getCmp('sys_save').setDisabled(false);
					var infoForm = Ext.getCmp('adapter-info-form').getForm();
					var model = infoForm.findField('MODEL'),
					protocol = infoForm.findField('PROTOCOL'), //协议
					config = {
						fields: ['value', 'text']
					};
				model.setReadOnly(false);
				model.clearValue();

				protocol.setDefaultValue('', '');
				if (record.data.TYPE == '软件') {
					// 类型跟协议 关联
					protocol.getPicker().getStore().setRootNode({
						children: [{
							id: '',
							text: '大成',
							expanded: true,
							children: [{
								id: 'dcsoft-aims',
								text: '大成-手术麻醉系统',
								leaf: true,
								iconCls: 'protocol'
							}, {
								id: 'dcsoft-icus',
								text: '大成-重症监护系统',
								leaf: true,
								iconCls: 'protocol'
							}]
						}, {
							id: '',
							text: '天健',
							expanded: true,
							children: [{
								id: 'tianjian-his',
								text: '天健-HIS系统',
								leaf: true,
								iconCls: 'protocol'
							}]
						}, {
							id: '',
							text: '新益华',
							expanded: true,
							children: [{
								id: 'zzxyh-his',
								text: '新益华-HIS系统',
								leaf: true,
								iconCls: 'protocol'
							}]
						}, {
							id: '',
							text: '用友',
							expanded: true,
							children: [{
								id: 'yonyou-his',
								text: '用友-HIS系统',
								leaf: true,
								iconCls: 'protocol'
							}, {
								id: 'yonyou-lis',
								text: '用友-LIS系统',
								leaf: true,
								iconCls: 'protocol'
							}, {
								id: 'yonyou-pacs',
								text: '用友-PACS系统',
								leaf: true,
								iconCls: 'protocol'
							}, {
								id: 'yonyou-hplus',
								text: '用友-H+系统',
								leaf: true,
								iconCls: 'protocol'
							}]
						}]
					});
					// 类型跟X件类型 关联
					model.setFieldLabel('软件类型');
					config.data = [{
						'value': 'HIS',
						'text': '医院管理系统'
					}, {
						'value': 'EMR',
						'text': '电子病历系统'
					}, {
						'value': 'LIS',
						'text': '检验系统'
					}, {
						'value': 'PACS',
						'text': '影像系统'
					}, {
						'value': 'AIMS',
						'text': '手术麻醉系统'
					}, {
						'value': 'ICUS',
						'text': '重症监护系统'
					}, {
						'value': 'OTHERSYSTEM',
						'text': '其他系统'
					}]
				} else if (record.data.TYPE == '硬件') {
					// 类型跟协议 关联
					protocol.getPicker().getStore().setRootNode({
						children: [{
							id: '',
							text: '德尔格',
							expanded: true,
							children: [{
								id: '',
								text: '网络工作站',
								expanded: true,
							}, {
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'drager-standalone-vitalink',
									text: 'Vitalink协议',
									leaf: true,
									iconCls: 'protocol'
								}, {
									id: 'drager-standalone-medibus',
									text: 'Medibus协议',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						}, {
							id: '',
							text: '迈瑞',
							expanded: true,
							children: [{
								id: '',
								text: '网络工作站',
								expanded: true,
							}, {
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'mindray-standalone-pds',
									text: 'PDS网关',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						}, {
							id: '',
							text: '飞利浦',
							expanded: true,
							children: [{
								id: '',
								text: '网络工作站',
								expanded: true,
								children: [{
									id: 'philips-networked-hl7',
									text: 'HL7协议',
									leaf: true,
									iconCls: 'protocol'
								}]
							}, {
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'philips-standalone-intellivue',
									text: 'IntelliVue系列',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						}, {
							id: '',
							text: '普博',
							expanded: true,
							children: [{
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'probe-standalone-boaray',
									text: '通用协议',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						}, {
							id: '',
							text: '雷度',
							expanded: true,
							children: [{
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'radiometer-standalone-abl',
									text: 'ABL系列',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						},
                            {
							id: '',
							text: '太空',
							expanded: true,
							children: [{
								id: '',
								text: '网络工作站',
								expanded: true,
							}, {
								id: '',
								text: '独立工作站',
								expanded: true,
								children: [{
									id: 'spacelabs-standalone-vitalink',
									text: 'Vitalink协议',
									leaf: true,
									iconCls: 'protocol'
								}]
							}]
						}, {
                            id: '',
                            text: '泰科',
                            expanded: true,
                            children: [ {
                                id: '',
                                text: '独立工作站',
                                expanded: true,
                                children: [{
                                    id: 'covidien-standalone-pb840',
                                    text: 'PB840通迅协议',
                                    leaf: true,
                                    iconCls: 'protocol'
                                }]
                            }]
                        }, {
                                id: '',
                                text: '科惠',
                                expanded: true,
                                children: [ {
                                    id: '',
                                    text: '独立工作站',
                                    expanded: true,
                                    children: [{
                                        id: 'covidien-standalone-e360',
                                        text: 'E360呼吸机',
                                        leaf: true,
                                        iconCls: 'protocol'
                                    }]
                                }]
                            }
                        ]
					});
					// 类型跟X件类型 关联
					model.setFieldLabel('硬件类型');
					config.data = [{
                        'value': 'MONITOR_CS',
                        'text': '监护中央站'
                    },{
						'value': 'MONITOR',
						'text': '监护仪'
					}, {
						'value': 'ANESTHESIA',
						'text': '麻醉机'
					}, {
						'value': 'VENTILATOR',
						'text': '呼吸机'
					}, {
						'value': 'INFUSION',
						'text': '输液泵'
					}, {
						'value': 'BLOODGAS',
						'text': '血气分析仪'
					}, {
						'value': 'OTHERINSTRUMENT',
						'text': '其他仪器'
					}]
				}
				model.getStore().loadData(config.data);
                    infoForm.findField('ICU_ROOM').clearValue();
				infoForm.setValues({
					'ID': record.data.ID,
					'ICU_ROOM': record.data.ICU_ROOM,
					'LOCATION_ID': record.data.LOCATION_ID,
					'TYPE': record.data.TYPE,
					'MODEL': record.data.MODEL,
					'NAME': record.data.NAME,
					'MANUFACTURER': record.data.MANUFACTURER,
					'PRODUCT_TYPE': record.data.PRODUCT_TYPE,
					'DESCRIPTION': record.data.DESCRIPTION,
					'CHANNEL': record.data.CHANNEL,
					'CHANNEL_SETTING': record.data.CHANNEL_SETTING,
					//'PROTOCOL': record.data.PROTOCOL,
					'RECEIVING_INTERVAL': record.data.RECEIVING_INTERVAL
				});
				// 设置协议的值
				var protocol = infoForm.findField('PROTOCOL');
				var protocolData = protocol.getPicker().getStore().getNodeById(record.data.PROTOCOL);
				if (protocolData != undefined) {
					protocol.setDefaultValue(protocolData.data.id, protocolData.data.text);
				}

                    infoForm.findField('ICU_ROOM').store.initSortable();
                    infoForm.findField('ICU_ROOM').store.load();

				}
			}
		});
		return adapter;
	},

	//适配器信息
	createAdapterForm: function() {
		var me = this;
		var adapterForm = Ext.create('Ext.form.Panel', {
			border: false,
            autoScroll : true,
             minWidth:485,
			style: {
				borderTop: '1px solid #99BCE8',
                overflow:true
			},
            bodyStyle:{
                overflow:true
            },
			id: 'adapter-info-form',

			disabled: true,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					xtype: 'label',
					html: '<img src="/app/sys/settings/images/adapter-info.png" />',
					width: '10px'
				}, '适配器信息', '->', {
					xtype: 'button',
					tooltip: '保存',
					id: 'sys_save',
					iconCls: 'save',
					handler: function() {
						var infoForm = Ext.getCmp('adapter-info-form').getForm();
						var currFormValue = infoForm.getValues();
						//遮罩效果
						var myMask = new Ext.LoadMask(Ext.getCmp('sys-adapter'), {
							msg: "Loading..."
						});
						if (currFormValue.ID === '') {
							if (infoForm.isValid()) {
								myMask.show();
								infoForm.submit({
									clientValidation: true,
									url: webRoot + '/sys/adapter',
									method: 'POST',
									params: {
										LINK_ID: linkId,
										LOCATION_ID: currFormValue.LOCATION_ID,
										NAME: currFormValue.NAME
									},
									success: function(response) {
										myMask.hide();
										Ext.getCmp('adapter-list-panel').store.reload();
										var infoForm = Ext.getCmp('adapter-info-form');
										infoForm.setDisabled(true);
									},
									failure: function(response, options) {
										myMask.hide();
										Ext.MessageBox.alert('提示', '保存适配器信息失败,请求超时或网络故障!');
									}
								});
							}
						} else {
							if (infoForm.isValid()) {
								myMask.show();
								infoForm.submit({
									clientValidation: true,
									url: webRoot + '/sys/adapter/' + currFormValue.ID,
									method: 'PUT',
									params: {
										LOCATION_ID: currFormValue.LOCATION_ID,
										NAME: currFormValue.NAME
									},
									success: function(form, action) {
										myMask.hide();
										Ext.getCmp('adapter-list-panel').store.reload();
										Ext.getCmp('adapter-info-form').setDisabled(true);
									},
									failure: function(form, action) {
										myMask.hide();
										Ext.Msg.alert('提示', '修改适配器模板信息失败，请求超时或网络故障!');
									}
								});
							}
						}
					}
				}]
			}],
			//bodyPadding: 5,
			layout: 'column',
			region: 'center',
			items: [
                {
				xtype: 'fieldset',
				columnWidth: 0.55,
				border: '1 0 0 0',
				padding: '5 0 0 0',
                   // minWidth:266,
				defaults: {
					layout: {
						type: 'hbox'
					}
				},
				items: [{
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 35,
						labelAlign: 'right'
					},

					items: [{
						xtype: 'hiddenfield',
						name: 'CHANNEL_SETTING'
					}, {
						xtype: 'hiddenfield',
						name: 'ID'
					}, {
						xtype: 'hiddenfield',
						name: 'LOCATION_ID'
					},
                        {
						xtype: 'combo',
						fieldLabel: '类型',
						name: 'TYPE',
						width: '55%',
						editable: false,
						valueField: 'text',
						displayField: 'text',
						value: '软件',
						allowBlank: false,
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data: [
								['SOFTWARE', '软件'],
								['HARDWARE', '硬件']
							]
						}),
						listeners: {
							select: function(combo, record) {
								var model = adapterForm.getForm().findField('MODEL'), //X件类型
									protocol = adapterForm.getForm().findField('PROTOCOL'), //协议
									config = {
										fields: ['value', 'text'],
									};
								model.setReadOnly(false);
								model.clearValue();
								protocol.setDefaultValue('', '');
								if (record[0].data.text == '软件') {
									// 类型跟协议 关联
									protocol.getPicker().getStore().setRootNode({
										children: [{
											id: '',
											text: '大成',
											expanded: true,
											children: [{
												id: 'dcsoft-aims',
												text: '手术麻醉系统',
												leaf: true,
												iconCls: 'protocol'
											}, {
												id: 'dcsoft-icus',
												text: '重症监护系统',
												leaf: true,
												iconCls: 'protocol'
											}]
										}, {
											id: '',
											text: '天健',
											expanded: true,
											children: [{
												id: 'tianjian-his',
												text: 'HIS系统',
												leaf: true,
												iconCls: 'protocol'
											}]
										}, {
											id: '',
											text: '新益华',
											expanded: true,
											children: [{
												id: 'zzxyh-his',
												text: '新益华-HIS系统',
												leaf: true,
												iconCls: 'protocol'
											}]
										}, {
											id: '',
											text: '用友',
											expanded: true,
											children: [{
												id: 'yonyou-his',
												text: 'HIS系统',
												leaf: true,
												iconCls: 'protocol'
											}, {
												id: 'yonyou-lis',
												text: 'LIS系统',
												leaf: true,
												iconCls: 'protocol'
											}, {
												id: 'yonyou-pacs',
												text: 'PACS系统',
												leaf: true,
												iconCls: 'protocol'
											}, {
												id: 'yonyou-hplus',
												text: '用友-H+系统',
												leaf: true,
												iconCls: 'protocol'
											}]
										}]
									});
									// 类型跟X件类型 关联
									model.setFieldLabel('软件类型');
									config.data = [{
										'value': 'HIS',
										'text': '医院管理系统'
									}, {
										'value': 'EMR',
										'text': '电子病历系统'
									}, {
										'value': 'LIS',
										'text': '检验系统'
									}, {
										'value': 'PACS',
										'text': '影像系统'
									}, {
										'value': 'AIMS',
										'text': '手术麻醉系统'
									}, {
										'value': 'ICU',
										'text': '重症监护系统'
									}, {
										'value': 'OTHERSYSTEM',
										'text': '其他系统'
									}]
								} else if (record[0].data.text == '硬件') {
									// 类型跟协议 关联
									protocol.getPicker().getStore().setRootNode({
										children: [{
											id: '',
											text: '德尔格',
											expanded: true,
											children: [{
												id: '',
												text: '网络工作站',
												expanded: true,
											}, {
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'drager-standalone-vitalink',
													text: 'Vitalink协议',
													leaf: true,
													iconCls: 'protocol'
												}, {
													id: 'drager-standalone-medibus',
													text: 'Medibus协议',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										}, {
											id: '',
											text: '迈瑞',
											expanded: true,
											children: [{
												id: '',
												text: '网络工作站',
												expanded: true,
											}, {
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'mindray-standalone-pds',
													text: 'PDS网关',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										}, {
											id: '',
											text: '飞利浦',
											expanded: true,
											children: [{
												id: '',
												text: '网络工作站',
												expanded: true,
												children: [{
													id: 'philips-networked-hl7',
													text: 'HL7协议',
													leaf: true,
													iconCls: 'protocol'
												}]
											}, {
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'philips-standalone-intellivue',
													text: 'IntelliVue系列',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										}, {
											id: '',
											text: '普博',
											expanded: true,
											children: [{
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'probe-standalone-boaray',
													text: '通用协议',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										}, {
											id: '',
											text: '雷度',
											expanded: true,
											children: [{
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'radiometer-standalone-abl',
													text: 'ABL系列',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										},
                                            {
											id: '',
											text: '太空',
											expanded: true,
											children: [{
												id: '',
												text: '网络工作站',
												expanded: true,
											}, {
												id: '',
												text: '独立工作站',
												expanded: true,
												children: [{
													id: 'spacelabs-standalone-vitalink',
													text: 'Vitalink协议',
													leaf: true,
													iconCls: 'protocol'
												}]
											}]
										}, {
                                                id: '',
                                                text: '泰科',
                                                expanded: true,
                                                children: [ {
                                                    id: '',
                                                    text: '独立工作站',
                                                    expanded: true,
                                                    children: [{
                                                        id: 'covidien-standalone-pb840',
                                                        text: 'PB840通迅协议',
                                                        leaf: true,
                                                        iconCls: 'protocol'
                                                    }]
                                                }]
                                            }, {
												id: '',
												text: '科惠',
												expanded: true,
												children: [ {
													id: '',
													text: '独立工作站',
													expanded: true,
													children: [{
														id: 'covidien-standalone-e360',
														text: 'E360呼吸机',
														leaf: true,
														iconCls: 'protocol'
													}]
												}]
											}
                                        ]
									});
									// 类型跟X件类型 关联
									model.setFieldLabel('硬件类型');
									config.data = [{
                                        'value': 'MONITOR_CS',
                                        'text': '监护中央站'
                                    },
                                        {
										'value': 'MONITOR',
										'text': '监护仪'
									}, {
										'value': 'ANESTHESIA',
										'text': '麻醉机'
									}, {
										'value': 'VENTILATOR',
										'text': '呼吸机'
									}, {
										'value': 'INFUSION',
										'text': '输液泵'
									}, {
										'value': 'BLOODGAS',
										'text': '血气分析仪'
									}, {
										'value': 'OTHERINSTRUMENT',
										'text': '其他仪器'
									}]
								}
								model.store.loadData(config.data);
							}
						}
					}, {
						xtype: 'comboboxtree',
						fieldLabel: '协议',
						name: 'PROTOCOL',
						width: '44%',
						valueField: 'value',
						allowBlank: false,
						editable: false,
						pickerWidth: 220,
						displayField: 'text',
						selectedIconCls: 'protocol',
						store: new Ext.data.TreeStore({
							fields: [{
								name: 'text',
								type: 'string'
							}, {
								name: 'id',
								type: 'string'
							}, {
								name: 'iconCls',
								type: 'string',
								defaultValue: 'x-tree-icon-parent'
							}]
						}),
						// store: new Ext.data.SimpleStore({
						// 	fields: ['value', 'text'],
						// 	data: [
						// 		['mindray-standalone-pds', '迈瑞Patient Data Share监护仪协议'],
						// 		['philips-standalone-intellivue', '飞利浦IntelliVue监护仪协议'],
						// 		['probe-standalone-boaray', '普博Boaray麻醉机协议'],
						// 		['radiometer-standalone-abl', '雷度ABL血液分析仪协议']
						// 	]
						// }),
						listeners: {
							expand: function(field, eOpts) {
								var nodeId = Ext.getCmp('adapter-info-form').getForm().findField('PROTOCOL').getSubmitValue();
								field.getPicker().getSelectionModel().select(field.store.getNodeById(nodeId));
							},
							nodeclick: function(_this, record, item, index, e, eOpts) {
								var selectTemp = record.data.id,
									clientRecord = me.client.getSelectionModel().getSelection()[0];
								if (record.data.iconCls == 'protocol') {
									try{
//										Ext.Ajax.request({
//											url: webRoot + '/sys/adapter/metadata/' + encodeURIComponent(clientRecord.data.URL) + '/' + selectTemp,
//											method: 'GET',
//											scope: this,
//											success: function(response) {
//												var respText = Ext.decode(response.responseText);
//												if (respText.success) {
//													var protocolInfo = Ext.decode(respText.data);
//													if (protocolInfo != null) {
//														var infoForm = Ext.getCmp('adapter-info-form').getForm(),
//															productType = infoForm.findField('PRODUCT_TYPE');
//														productType.clearValue();
//														//productType.hideTrigger = false;
//														if (protocolInfo.series != undefined) {
//															var typeData = protocolInfo.series.split(','),
//																types = [];
//															for (var i = 0; i < typeData.length; i++) {
//																types.push({
//																	'text': typeData[i]
//																});
//															}
//															productType.getStore().loadData(types);
//														}
//														var infoForm = Ext.getCmp('adapter-info-form').getForm();
//														//型号默认选中第一个
//														//if (infoForm.getValues().ID.length == 0) {
//														productType.select(productType.getStore().first());
//														//}
//														infoForm.setValues({
//															'NAME': protocolInfo.name,
//															'MANUFACTURER': protocolInfo.vendor,
//															'MODEL': protocolInfo.type
//														});
//													}
//												}
//											},
//											failure: function(response, options) {
//												Ext.MessageBox.alert('提示', '查询失败,请求超时或网络故障!');
//											}
//										});
									}catch(e){}
								}
							}
						}
					}]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 35,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: '名称',
						name: 'NAME',
						allowBlank: false,
						width: '55%',
						maxLength: 200,
						maxLengthText: '最多可输入200位'
					}, {
						xtype: 'comboboxtree',
						fieldLabel: '位置',
						id: 'ICU_ROOM',
						name: 'ICU_ROOM',
						allowBlank: false,
						width: '44%',
						pickerWidth: 220,
						deselected: 'settings-dept,ward',
						displayField: 'text',
                        editable: false,
						store: new Ext.data.TreeStore({
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
								url: webRoot + '/sys/tree/dept/icu/all',//sys/tree/dept/icu/all//sys/tree/dept/all
								reader: {
									type: 'json',
									root: 'children'
								}
							},
							listeners: {
								load: function(_this, node, records, successful, eOpts) {
//									var nodeId = Ext.getCmp('adapter-info-form').getForm().findField('LOCATION_ID').getValue(),
//
//										field = Ext.getCmp('ICU_ROOM');
//                                    console.log(nodeId);
//									field.getPicker().getSelectionModel().select(field.store.getNodeById(nodeId));
								}
							}
						}),
						listeners: {
							expand: function(field, eOpts) {
								var nodeId = Ext.getCmp('adapter-info-form').getForm().findField('LOCATION_ID').getValue();
                               // console.log(field.store.getNodeById(nodeId));
                                //console.log(field.store);
                                field.getPicker().getSelectionModel().select(field.store.getNodeById(nodeId));


							},
							nodeclick: function(_this, record, item, index, e, eOpts) {

							}
						}
					}]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 35,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: '厂商',
						name: 'MANUFACTURER',
						width: '55%',
						maxLength: 200,
						maxLengthText: '最多可输入200位'
					},
//					{
//						xtype: 'combo',
//						fieldLabel: '型号',
//						name: 'PRODUCT_TYPE',
//						width: '44%',
//						//hideTrigger: true,
//						maxLength: 1000,
//						maxLengthText: '最多可输入1000位',
//						valueField: 'text',
//						//editable: false,
//						displayField: 'text',
//						matchFieldWidth: false,
//						queryMode: 'local',
//						store: new Ext.data.Store({
//							fields: ['text'],
//							data: []
//						}),
//					}
					{
						xtype: 'textfield',
						fieldLabel: '型号',
						name: 'PRODUCT_TYPE',
						width: '44%',
						maxLength: 1000,
						maxLengthText: '最多可输入1000位'
					}
					]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 35,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: '描述',
						name: 'DESCRIPTION',
						width: '99%',
						maxLength: 4000,
						maxLengthText: '最多可输入4000位'
					}]
				}]
			},
                {
				xtype: 'fieldset',
				columnWidth: 0.45,
				padding: '5 0 0 0',
				border: '1 0 0 0',
                   // minWidth:216,
				defaults: {
					layout: {
						type: 'hbox'
					}
				},
				items: [{
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 60,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'combo',
						fieldLabel: 'X件类型',
						name: 'MODEL',
						width: '86%',
						editable: false,
						allowBlank: false,
						valueField: 'value',
						displayField: 'text',
						margin: '0 5 0 0',
						readOnly: true,
						queryMode: 'local',
						store: new Ext.data.Store({
							fields: ['value', 'text'],
							data: []
						})
					}]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 60,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'combo',
						fieldLabel: '数据通道',
						name: 'CHANNEL',
						allowBlank: false,
						width: '86%',
						editable: false,
						valueField: 'value',
						displayField: 'text',
						maxLength: 4000,
						maxLengthText: '最多可输入4000位',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data: [
								['DB', '数据库'],
								['FTP', 'FTP'],
								['WebService', 'Web服务'],
								['Socket', 'Socket'],
								['SerialPort', '串口'],
								['USB', 'USB'],
								['URL', 'URL']
							]
						}),
						margin: '0 5 0 0',
						listeners: {
							select: function(combo, records, eOpts) {
								//me.initialChannel = me.adapterList.getSelectionModel().getSelection()[0].data.CHANNEL;
								//var adapterRecord = combo.getValue(); //me.adapterForm.getForm().findField(''); //getSelectionModel().getSelection()[0];
								if (me.initialChannel != records[0].data.value) {
									me.isModifyChannel = true;
									me.adapterForm.getForm().findField('CHANNEL_SETTING').setValue(null);
								} else {
									me.isModifyChannel = false;
									me.adapterForm.getForm().findField('CHANNEL_SETTING').setValue(me.initialChannelSetting);
								}
							}
						}
					}, {
						xtype: 'image',
						src: '/app/sys/settings/images/set-up.png',
						scope: this,
						cls: 'cursor',
						margin: '5 0 0 0',
						listeners: {
							render: function() {
								Ext.fly(this.el).on('click', function() {
									var form = Ext.getCmp('adapter-info-form').getForm();
									var dataChannel = form.findField('CHANNEL').getValue();
									if ('DB' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createDBPassageWindow();
									} else if ('FTP' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createFTPPassageWindow();
									} else if ('WebService' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createWebPassageWindow();
									} else if ('Socket' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createSocketPassageWindow();
									} else if ('SerialPort' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createSerialPassageWindow();
									} else if ('USB' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createUsbPassageWindow();
									} else if ('URL' === dataChannel) {
										Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createURLPassageWindow();
									}
								});
							}
						}
					}]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 60,
						labelAlign: 'right'
					},
					items: [{
						xtype: 'numberfield',
						fieldLabel: '采集频率',
						name: 'RECEIVING_INTERVAL',
						width: '86%',
						allowBlank: false,
						//regex: /^[0-9]*$/,
						//regexText: '只能输入数字',
                        minValue: 0,
                        maxValue: 99999,
                        decimalPrecision:0,
                        nanText: '输入数据不能小于0',
                        negativeText: '输入数据不能小于0',
						value: 5,
						margin: '0 5 0 0',
						maxLength: 11,
						maxLengthText: '最多可输入11位'
					}, {
						xtype: 'label',
						text: '/s',
						margin: '5 0 0 0'
					}]
				}, {
					xtype: 'fieldcontainer',
					combineErrors: true,
					defaults: {
						labelWidth: 60,
						labelAlign: 'right'
					}//,
//					items: [{
//						xtype: 'textfield',
//						fieldLabel: '采集项目',
//						name: 'COLL_PROJECT',
//						width: '86%',
//						value: '0项',
//						disabled: true,
//						margin: '0 5 0 0'
//					},
//                        {
//						xtype: 'image',
//						src: '/app/sys/settings/images/set-up.png',
//						cls: 'cursor',
//						scope: this,
//						margin: '5 0 0 0',
//						listeners: {
//							render: function() {
//								Ext.fly(this.el).on('click', function() {
//									Ext.getCmp('settings_a30836d0265111e3a7c623368e524292').createCollectProjectWindow();
//								});
//							}
//						}
//					}
//                    ]
				}]
			}]
		});
		return adapterForm;
	},

	createDBPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.DBPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createFTPPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.FTPPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createWebPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.WebPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createSocketPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.SocketPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createSerialPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.SerialPortPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createUsbPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.UsbPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	// url数据通道
	createURLPassageWindow: function() {
		var me = this;
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.URLPassageWindow', {
			parent: me,
			CHANNEL_SETTING: me.adapterForm.getForm().findField('CHANNEL_SETTING').getValue()
		});
		dlg.show();
	},
	createCollectProjectWindow: function() {
		var dlg = Ext.create('com.dfsoft.lancet.sys.settings.CollectProjectWindow', {

		});
		dlg.show();
	}
});