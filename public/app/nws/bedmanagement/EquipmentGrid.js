/**
 * 功能说明: 基本设置中的 仪器设备 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.EquipmentGrid', {
	extend: 'Ext.grid.Panel',
	requires: [
		'com.dfsoft.icu.nws.bedmanagement.EquipmentStore'
	],
	initComponent: function() {
		var me = this;
		var equipmentStore = new com.dfsoft.icu.nws.bedmanagement.EquipmentStore();
		Ext.apply(me, {
			border: true,
            height: 135,
            store: equipmentStore,
            lbar:[{
                xtype: 'button',
                iconCls: 'add',
                tooltip: '添加监护仪器',
                scope: me,
                handler: function() {
                	var arr = [{
						'ID': '',
						'USE': true,
						'NAME': '',
						'MANUFACTURER': '',
						'PRODUCT_TYPE': ''
					}];
					equipmentStore.loadData(arr, true);
                }
            }, {
                xtype: 'button',
                iconCls: 'delete',
                tooltip: '删除监护仪器',
                scope: me,
                handler: function() {
                	var currRecord = me.getSelectionModel().getSelection();
                	if(currRecord.length == 0) {
                		Ext.MessageBox.alert('提示', '请选择一条仪器设备!');
                		return;
                	}
					equipmentStore.remove(currRecord[0]);
                }
            }],
            columns: [{
                xtype: 'checkcolumn',
                text: '使用',
                sortable: false,
                dataIndex: 'USE',
                width: '10%'
            }, {
                text: '名称',
                dataIndex: 'NAME',
                width: '40%',
                sortable: true,
                align: 'left',
                editor: {
                	xtype: 'combo',
                    editable: false,
                    listConfig: {
                        cls: 'border-list',
                        getInnerTpl: function() {
                            return '<span style=\'font-size:12px;color:black;borderColor:black\'>{NAME}</span>';
                        }
                    },
                    valueField: 'NAME',
                    displayField: 'NAME',
                    store: new Ext.data.Store({
						fields: ['ID', 'NAME', 'MANUFACTURER', 'PRODUCT_TYPE'],
						proxy: {
							type: 'ajax',
							url: webRoot + '/sys/adapter',
							reader: {
								type: 'json',
								root: 'data'
							}
						}
					}),
                    scope: me,
                    listeners: {
                    	select: function(_this, records, eOpts) {
                    		var currRecord = me.getSelectionModel().getSelection()[0];
                    		currRecord.data.ID = records[0].data.ID;
                    		currRecord.data.USE = true;
                    		currRecord.data.NAME = records[0].data.NAME;
                    		currRecord.data.MANUFACTURER = records[0].data.MANUFACTURER;
                    		currRecord.data.PRODUCT_TYPE = records[0].data.PRODUCT_TYPE;
                    		currRecord.commit();
                    	}
                    }
                }
            }, {
                text: '生产厂商',
                dataIndex: 'MANUFACTURER',
                width: '25%',
                sortable: true,
                align: 'left'
            }, {
                text: '型号',
                dataIndex: 'PRODUCT_TYPE',
                width: '24%',
                sortable: true,
                align: 'left'
            }],
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})]
		});
		me.callParent();
	}
});