// 系统字典
Ext.define('com.dfsoft.lancet.sys.settings.SysDictionary', {
    extend: 'Ext.tab.Panel',
    requires: ['com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore', 'com.dfsoft.lancet.sys.settings.ExamineItemModel'],
    id: 'settings_23315e7041de11e3b5bcdd145cb30972',
    disabled: true,
    activeTab: 0,
    plain: true,
    title: '系统字典',
    border: false,
    layout: 'fit',
    tabBar: {
        defaults: {
            width: 90
        }
    },
    tabPosition: 'bottom',
    initComponent: function () {

        /* Ext.apply(Ext.form.field.VTypes, {
         nospace: function (val, field) { if(val&&Ext.util.Format.trim(val).length==0) return false;else return true;},
         nospaceText: '不能输入空格'
         });*/
        var me = this;
        me.drug = me.createDurgPanel();
        me.drugsRoute = me.createDrugsRoutePanel();
        me.consumables = me.createConsumablesPanel();
        me.descriptionOrder = me.createDescriptionOrderPanel();
        me.examine = me.createExaminePanel();
        me.items = [me.drug, me.drugsRoute, me.consumables, me.descriptionOrder, me.examine];
        me.callParent();
    },

    //创建药品Tab
    createDurgPanel: function () {
        var drugStore = Ext.create('Ext.data.Store', {
            pageSize: 25,
            model: 'com.dfsoft.lancet.sys.settings.DrugModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/drugs/settings',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'totalCount'
                }
            }
        });
        drugStore.loadPage(1);
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            errorsText: '提示',
            autoCancel: false,
            // errorSummary:false,
            listeners: {
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    Ext.each(items, function (item) {
                        if (item.data.CODE.length == 0) {
                            drugStore.remove(item);
                        }
                    });
                    Ext.getCmp('delete_1').setDisabled(false);
                },
                edit: function (editor, context) {
                    var newRecord = context.record;
                    if (newRecord.data.CODE.length == 0) {
                        // 新插入一条
                        Ext.Ajax.request({
                            url: webRoot + '/dic/drugs',
                            method: 'POST',
                            scope: this,
                            params: {
                                CATEGORY_CODE: newRecord.data.CATEGORY_CODE,
                                COMMON_NAME: newRecord.data.COMMON_NAME,
                                PRODUCT_NAME: newRecord.data.PRODUCT_NAME,
                                DISPLAY_NAME: newRecord.data.DISPLAY_NAME,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                SPECIFICATION_QUALITY: newRecord.data.SPECIFICATION_QUALITY,
                                UNIT_QUALITY_CODE: newRecord.data.UNIT_QUALITY_CODE,
                                SPECIFICATION_VOLUME: newRecord.data.SPECIFICATION_VOLUME,
                                UNIT_VOLUME_CODE: newRecord.data.UNIT_VOLUME_CODE,
                                DOSAGE_DEFAULT: newRecord.data.DOSAGE_DEFAULT,
                                ROUTE_DEFAULE_CODE: newRecord.data.ROUTE_DEFAULE_CODE,
                                UNIT_DEFAULT_CODE: newRecord.data.UNIT_DEFAULT_CODE,
                                IS_COMMON: newRecord.data.IS_COMMON,
                                IS_ENABLED: newRecord.data.IS_ENABLED,
                                SYNCID: newRecord.data.SYNCID,
                                PRICE: newRecord.data.PRICE,
                                MANUFACTURER: newRecord.data.MANUFACTURER,
                                MEDICARE_TYPE: newRecord.data.MEDICARE_TYPE,
                                IS_BASED_MEDICINE: newRecord.data.IS_BASED_MEDICINE
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                drugStore.reload();
                                Ext.getCmp('delete_1').setDisabled(false);
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '添加药品失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        //修改
                        Ext.Ajax.request({
                            url: webRoot + '/dic/drugs/' + newRecord.data.CODE,
                            method: 'PUT',
                            scope: this,
                            params: {
                                CATEGORY_CODE: newRecord.data.CATEGORY_CODE,
                                COMMON_NAME: newRecord.data.COMMON_NAME,
                                PRODUCT_NAME: newRecord.data.PRODUCT_NAME,
                                DISPLAY_NAME: newRecord.data.DISPLAY_NAME,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                SPECIFICATION_QUALITY: newRecord.data.SPECIFICATION_QUALITY,
                                UNIT_QUALITY_CODE: newRecord.data.UNIT_QUALITY_CODE,
                                SPECIFICATION_VOLUME: newRecord.data.SPECIFICATION_VOLUME,
                                UNIT_VOLUME_CODE: newRecord.data.UNIT_VOLUME_CODE,
                                ROUTE_DEFAULE_CODE: newRecord.data.ROUTE_DEFAULE_CODE,
                                DOSAGE_DEFAULT: newRecord.data.DOSAGE_DEFAULT,
                                UNIT_DEFAULT_CODE: newRecord.data.UNIT_DEFAULT_CODE,
                                IS_COMMON: newRecord.data.IS_COMMON,
                                IS_ENABLED: newRecord.data.IS_ENABLED,
                                SYNCID: newRecord.data.SYNCID,
                                PRICE: newRecord.data.PRICE,
                                MANUFACTURER: newRecord.data.MANUFACTURER,
                                MEDICARE_TYPE: newRecord.data.MEDICARE_TYPE,
                                IS_BASED_MEDICINE: newRecord.data.IS_BASED_MEDICINE
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                drugStore.reload();
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '修改药品失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        drugStore.on('beforeload', function (store, options) {
            var name = Ext.getCmp('search-drug').getValue();
            var new_params = {};
            if (Ext.util.Format.trim(name) != '') {
                drugStore.getProxy().url = webRoot + '/dic/drugs/searchDrug/a'
            } else {
                drugStore.getProxy().url = webRoot + '/dic/drugs/settings';
            }
            if (name && Ext.util.Format.trim(name) != '') {
                name = name.replace(/%/g, '$%25');
                new_params.helpcode = name
            } else {
                new_params.helpcode = null;
            }
            Ext.apply(store.proxy.extraParams, new_params);
        });
        var drug = Ext.create('Ext.grid.Panel', {
            title: '药品',
            id: 'settings_a125e2b078fd11e39fd9cb7044fb9357',
//            disabled: true,
            border: 1,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/drug.png" />',
                            width: '10px'
                        },
                        '药品清单',
                        '->',
                        {
                            xtype: 'textfield',
                            id: 'search-drug',
                            fieldLabel: '药品名',
                            labelWidth: 48,
                            maxLength: 200,
                            width: 180
                        },
                        {
                            xtype: 'button',
                            text: '搜索',
                            handler: function () {
                                if (this.ownerCt.down('textfield').validate()) {
                                    drugStore.loadPage(1);
                                }
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'add',
                            handler: function () {
                                rowEditing.cancelEdit();
                                var drugModel = Ext.create('com.dfsoft.lancet.sys.settings.DrugModel', {});
                                drugStore.insert(0, drugModel);
                                rowEditing.startEdit(0, 0);
                                Ext.getCmp('delete_1').setDisabled(true);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            id: 'delete_1',
                            iconCls: 'delete',
                            handler: function () {
                                var records = drug.getSelectionModel().getSelection();
                                if (records.length < 1) {
                                    Ext.MessageBox.alert('提示', '请选择要删除的药品!');
                                    return;
                                }
                                Ext.Msg.confirm('删除药品', '确认要删除该药品吗？', function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/dic/drugs/' + records[0].data.CODE,
                                            method: 'DELETE',
                                            scope: this,
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                drugStore.reload();
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除药品失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '同步数据',
                            iconCls: 'data-refresh',
                            handler: function () {
                                drug.el.mask('数据同步中...');
                                Ext.Ajax.request({
                                    url: webRoot + '/link/drug/requestSyncDrugs/dic-drugs-icu/null/null/null',
                                    method: 'get',
                                    scope: this,
                                    success: function (response) {
                                        drug.el.unmask();
                                        var respText = Ext.decode(response.responseText).data;
                                        if (respText.success == true) {
                                            drugStore.reload();
                                        } else {
                                            Ext.MessageBox.alert('提示', respText.msg);
                                        }

                                    },
                                    failure: function (response, options) {
                                        drug.el.unmask();
                                        Ext.MessageBox.alert('提示', '同步药品失败,请求超时或网络故障!');
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            store: drugStore,
            selType: 'rowmodel',
            plugins: [rowEditing],
            columnLines: true,
            columns: [
                {
                    text: '分类',
                    width: '20%',
                    dataIndex: 'CATEGORY',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'combobox',
                        id: 'dic_drugs_category',
                        queryMode: 'remote',
                        displayField: 'CATEGORY',
                        valueField: 'CATEGORY',
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.Store({
                            fields: ['CATEGORY_CODE', 'CATEGORY'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dic/drugs/categoryAll',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listConfig: {
                            cls: 'border-list',
                            getInnerTpl: function () {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{CATEGORY}</span>';
                            }
                        },
                        listeners: {
                            select: function (combo, records, eOpts) {
                                var currRecord = drug.getSelectionModel().getSelection()[0];
                                currRecord.data.CATEGORY_CODE = records[0].data.CATEGORY_CODE;
                                currRecord.commit();
                                if (combo.ownerCt.down('button').disabled == true)
                                    combo.ownerCt.down('button').setDisabled(false);
                            }
                        }
                    }
                },
                {
                    text: '通用名',
                    width: '22%',
                    dataIndex: 'COMMON_NAME',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符',
                        allowBlank: false
                    }
                },
                {
                    text: '商品名',
                    width: '12%',
                    dataIndex: 'PRODUCT_NAME',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '显示名称',
                    width: '20%',
                    dataIndex: 'DISPLAY_NAME',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 410,
                        maxLengthText: '最大输入410个字符'
                    }
                },
                {
                    text: '源系统编码',
                    width: '12%',
                    dataIndex: 'SYNCID',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 32,
                        maxLengthText: '最大输入32个字符'
                    }
                },
                {
                    text: '助记码',
                    width: '10%',
                    dataIndex: 'HELPER_CODE',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '规格',
                    dataIndex: 'SPECIFICATION_QUALITY',
                    width: '10%',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0,
                        negativeText: '该输入项的最小值是 0',
                        maxValue: 99999.99,
                        decimalPrecision: 2,
                        maxLengthText: '最大输入7个字符'
                    }
                },
                {
                    text: '单位',
                    dataIndex: 'UNIT_QUALITY_CODE',
                    width: 100,
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'combobox',
                        queryMode: 'remote',
                        displayField: 'value',
                        valueField: 'value',
                        //allowBlank: false,
                        matchFieldWidth: false,
                        editable: false,

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
                        listConfig: {
                            cls: 'border-list',
                            width: 100,
                            getInnerTpl: function () {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}</span>';
                            }
                        },
                        listeners: {
                            render: function (p) {//渲染后给el添加mouseover事件
                                p.getEl().on('keydown', function (e) {
                                    if (e.getKey() == 46) {
                                        p.setRawValue('');
                                        p.setValue('');
                                    }
                                });
                            }
                        }
                    }
                },
//			{
//				text: '质量',
//				sortable: false,
//				align: 'left',
//				columns: [{
//					text: '规格',
//					dataIndex: 'SPECIFICATION_QUALITY',
//					flex: 1,
//					align: 'center',
//					editor: {
//						xtype: 'numberfield',
//						minValue: 0,
//						maxLength: 8,
//						maxLengthText: '最大输入7个字符'
//					}
//				}, {
//					text: '单位',
//					dataIndex: 'UNIT_QUALITY_CODE',
//					flex: 1,
//					align: 'center',
//					editor: {
//						xtype: 'combobox',
//						queryMode: 'remote',
//						displayField: 'value',
//						valueField: 'value',
//						//allowBlank: false,
//						matchFieldWidth: false,
//						editable: false,
//						store: new Ext.data.Store({
//							fields: ['value', 'text'],
//							proxy: {
//								type: 'ajax',
//								url: webRoot + '/dics/dic_unit',
//								method: 'GET',
//								reader: {
//									type: 'json',
//									root: 'data'
//								}
//							},
//							autoLoad: true
//						}),
//						listConfig: {
//							cls: 'border-list',
//							getInnerTpl: function() {
//								return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}{text}</span>';
//							}
//						}
//					}
//				}]
//			}, 
//			{
//				text: '容积',
//				sortable: false,
//				align: 'left',
//				columns: [{
//					text: '规格',
//					dataIndex: 'SPECIFICATION_VOLUME',
//					flex: 1,
//					align: 'center',
//					editor: {
//						xtype: 'numberfield',
//						minValue: 0
//					}
//				}, {
//					text: '单位',
//					dataIndex: 'UNIT_VOLUME_CODE',
//					flex: 1,
//					align: 'center',
//					editor: {
//						xtype: 'combobox',
//						queryMode: 'remote',
//						displayField: 'value',
//						valueField: 'value',
//						//allowBlank: false,
//						matchFieldWidth: false,
//						editable: false,
//						store: new Ext.data.Store({
//							fields: ['value', 'text'],
//							proxy: {
//								type: 'ajax',
//								url: webRoot + '/dics/dic_unit',
//								method: 'GET',
//								reader: {
//									type: 'json',
//									root: 'data'
//								}
//							},
//							autoLoad: true
//						}),
//						listConfig: {
//							cls: 'border-list',
//							getInnerTpl: function() {
//								return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}&nbsp;&nbsp;{text}</span>';
//							}
//						}
//					}
//				}]
//			}, 
                {
                    text: '用药途径',
                    width: 130,
                    dataIndex: 'ROUTE_DEFAULE_NAME',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'combo',
                        displayField: 'text',
                        valueField: 'text',
                        editable: false,
                        store: new Ext.data.Store({
                            fields: ['value', 'text'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dic/drugs_route',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listConfig: {
                            cls: 'border-list',
                            getInnerTpl: function () {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{text}&nbsp;&nbsp;</span>';
                            }
                        },
                        listeners: {
                            select: function (combo, records, eOpts) {
                                var currRecord = drug.getSelectionModel().getSelection()[0];
                                currRecord.data.ROUTE_DEFAULE_CODE = records[0].data.value;
                                currRecord.commit();
                            },
                            render: function (p) {//渲染后给el添加mouseover事件
                                p.getEl().on('keydown', function (e) {
                                    if (e.getKey() == 46) {
                                        p.setRawValue('');
                                        p.setValue('');
                                        var currRecord = drug.getSelectionModel().getSelection()[0];
                                        currRecord.data.ROUTE_DEFAULE_CODE = '';
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    text: '默认剂量',
                    width: '10%',
                    dataIndex: 'DOSAGE_DEFAULT',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0,
                        negativeText: '该输入项的最小值是 0',
                        maxValue: 99999,
                        decimalPrecision: 2
                    }
                },
                {
                    text: '默认单位',
                    width: '10%',
                    dataIndex: 'UNIT_DEFAULT_CODE',
                    sortable: false,
                    align: 'left',
                    editor: {
                        xtype: 'combobox',
                        queryMode: 'remote',
                        displayField: 'value',
                        valueField: 'value',
                        //allowBlank: false,
                        matchFieldWidth: false,
                        editable: false,
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
                        listConfig: {
                            cls: 'border-list',
                            width: '9%',
                            getInnerTpl: function () {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}</span>';
                            }
                        },
                        listeners: {
                            render: function (p) {//渲染后给el添加mouseover事件
                                p.getEl().on('keydown', function (e) {
                                    if (e.getKey() == 46) {
                                        p.setRawValue('');
                                        p.setValue('');
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '常用药',
                    width: '8%',
                    dataIndex: 'IS_COMMON',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = drugStore.getAt(rowIndex)
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs/updateIs/IS_COMMON/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_COMMON: currRecord.data.IS_COMMON
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    drugStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改药品为常用药失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '启用',
                    width: '6%',
                    dataIndex: 'IS_ENABLED',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = drugStore.getAt(rowIndex)
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs/updateIs/IS_ENABLED/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_ENABLED: currRecord.data.IS_ENABLED
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    drugStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改药品是否启用失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                },
                {
                    text: '零售价',
                    dataIndex: 'PRICE',
                    width: 72,
                    style: 'text-align:center;',
                    align: 'center',
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0,
                        negativeText: '该输入项的最小值是 0',
                        maxValue: 99999,
                        decimalPrecision: 2
                    }
                },
                {
                    text: '生产厂家',
                    width: '14%',
                    style: 'text-align:center;',
                    dataIndex: 'MANUFACTURER',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '医保分类',
                    width: 72,
                    style: 'text-align:center;',
                    dataIndex: 'MEDICARE_TYPE',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '基药',
                    width: 64,
                    style: 'text-align:center;',
                    dataIndex: 'IS_BASED_MEDICINE',
                    sortable: false,
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = drugStore.getAt(rowIndex)
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs/updateIs/IS_BASED_MEDICINE/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_BASED_MEDICINE: currRecord.data.IS_BASED_MEDICINE
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    drugStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改药品为常用药失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                }
            ],
            listeners: {
                selectionchange: function (selModel, selected, eOpts) {
                    if (!selected[0]) return false;
                    if (selected[0].data.CODE.length != 0) {
                        var current = selected[0];
                        var items = selModel.store;
                        var item;
                        for (var i = 0; i < items.getCount(); i++) {
                            item = items.getAt(i);
                            if (item.data.CODE.length == 0) {
                                drugStore.remove(item);
                                break;
                            }
                        }
                        rowEditing.cancelEdit();
                    }
                }
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: drugStore,
                displayInfo: true,
                displayMsg: '共{2}条',
                emptyMsg: '无药品记录'
            })
        });

        return drug;
    },

    //创建用药途径Tab
    createDrugsRoutePanel: function () {
        var me = this;
        var routeStore = Ext.create('Ext.data.Store', {
            model: 'com.dfsoft.lancet.sys.settings.DrugRouteModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/drugs_route',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            errorsText: '提示',
            autoCancel: false,
            listeners: {
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    Ext.each(items, function (item) {
                        if (item.data.CODE.length == 0) {
                            routeStore.remove(item);
                        }
                    });
                    Ext.getCmp('delete_2').setDisabled(false);
                },
                edit: function (editor, context) {
                    var newRecord = context.record;
                    if (newRecord.data.CODE.length == 0) {
                        // 新插入一条
                        Ext.Ajax.request({
                            url: webRoot + '/dic/drugs_route',
                            method: 'POST',
                            scope: this,
                            params: {
                                CATEGORY: newRecord.data.CATEGORY,
                                NAME: newRecord.data.NAME,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                DESCRIPTION: newRecord.data.DESCRIPTION,
                                IS_INTAKE: newRecord.data.IS_INTAKE,
                                IS_PRINT: newRecord.data.IS_PRINT,
                                IS_EXTRACT: newRecord.data.IS_EXTRACT
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                routeStore.reload();
                                Ext.getCmp('delete_2').setDisabled(false);
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '添加用药途径失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        //修改
                        Ext.Ajax.request({
                            url: webRoot + '/dic/drugs_route/' + newRecord.data.CODE,
                            method: 'PUT',
                            scope: this,
                            params: {
                                CATEGORY: newRecord.data.CATEGORY,
                                NAME: newRecord.data.NAME,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                DESCRIPTION: newRecord.data.DESCRIPTION,
                                IS_INTAKE: newRecord.data.IS_INTAKE,
                                IS_PRINT: newRecord.data.IS_PRINT,
                                IS_EXTRACT: newRecord.data.IS_EXTRACT
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                routeStore.reload();
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '修改用药途径失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        var route = Ext.create('Ext.grid.Panel', {
            title: '用药途径',
            border: 1,
            id: 'settings_b236e2b078fd11e39fd9cb7044fb0468',
//            disabled: true,
            // enableDragDrop : true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function (node, data, dropRec, dropPosition) {
                        var sortNumbers = [];
                        for (var i = 0; i < routeStore.getCount(); i++) {
                            sortNumbers.push({CODE: routeStore.getAt(i).get('CODE'), SORT_NUMBER: i + 1});
                        }
                        if (dropRec && sortNumbers.length > 0) {
                            var start = dropRec.get('SORT_NUMBER');
                            var startCode = dropRec.get('CODE');
                            var end = data.records[0].get('SORT_NUMBER');
                            var endCode = data.records[0].get('CODE');
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs_route/updateSortNumber/' + startCode + '/' + (start),
                                method: 'PUT',
                                scope: this,
                                params: {
                                    sortNumbers: Ext.encode(sortNumbers),
                                    dropPosition: dropPosition
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改是否计入入量失败,请求超时或网络故障!');
                                }
                            });
                        }
                    },
                    beforerefresh: function (v) {
                        v.scrollTop = v.el.dom.scrollTop;
                        v.scrollHeight = v.el.dom.scrollHeight
                    },
                    refresh: function (v) {
                        v.el.dom.scrollTop = v.scrollTop + (v.scrollTop == 0 ? 0 : v.el.dom.scrollHeight - v.scrollHeight);
                    }
                }
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/drug.png" />',
                            width: '10px'
                        },
                        '用药途径',
                        '->',
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'add',
                            handler: function () {
                                rowEditing.cancelEdit();
                                var routeModel = Ext.create('com.dfsoft.lancet.sys.settings.DrugRouteModel', {});
                                routeStore.insert(0, routeModel);
                                rowEditing.startEdit(0, 0);
                                Ext.getCmp('delete_2').setDisabled(true);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            id: 'delete_2',
                            iconCls: 'delete',
                            handler: function () {
                                var records = route.getSelectionModel().getSelection();
                                if (records.length < 1) {
                                    Ext.MessageBox.alert('提示', '请选择要删除的用药途径!');
                                    return;
                                }
                                Ext.Msg.confirm('删除用药途径', '确认要删除该用药途径吗？', function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/dic/drugs_route/' + records[0].data.CODE,
                                            method: 'DELETE',
                                            scope: this,
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                routeStore.reload();
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除用药途径失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            iconCls: 'dtm-accessibility-up',
                            tooltip: '向上',
                            handler: function () {
                                var gridPanle = this.up().up();
                                var store = gridPanle.getStore();
                                var records = gridPanle.getSelectionModel().getSelection();
                                var index = records[0]?records[0].index:0;
                                if (index > 0) {
                                    Ext.each(records, function (records) {
                                        store.remove(records);
                                    });
                                    store.insert(index - 1, records);
                                    store.getAt(index - 1).index = index - 1;
                                    store.getAt(index).index = index;
                                }
                                gridPanle.getSelectionModel().select(store.getAt(index - 1));
                                var currRecord = gridPanle.getSelectionModel().getSelection()[0];
                                if (currRecord) {
                                    Ext.Ajax.request({
                                        url: webRoot + '/dic/drugs_route/updateSortNumber/' + currRecord.data.CODE + '/' + (index),
                                        method: 'PUT',
                                        scope: this,
                                        params: {
                                            bNumber: index + 1,
                                            bCode: store.getAt(index).get('CODE')
                                        },
                                        success: function (response) {
                                            var respText = Ext.decode(response.responseText).data;
                                        },
                                        failure: function (response, options) {
                                            Ext.MessageBox.alert('提示', '修改是否计入入量失败,请求超时或网络故障!');
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'dtm-accessibility-down',
                            tooltip: '向下',
                            handler: function () {
                                var gridPanle = this.up().up();
                                var store = gridPanle.getStore();
                                var records = gridPanle.getSelectionModel().getSelection();
                                var index = records[0]?records[0].index:store.getCount()+1;
                                if (index < store.getCount() - 1) {
                                    Ext.each(records, function (records) {
                                        store.remove(records);
                                    });
                                    store.insert(index + 1, records);
                                    store.getAt(index).index = index;
                                    store.getAt(index + 1).index = index + 1;
                                }
                                gridPanle.getSelectionModel().select(store.getAt(index + 1));
                                var currRecord = gridPanle.getSelectionModel().getSelection()[0];
                                if (currRecord) {
                                    Ext.Ajax.request({
                                        url: webRoot + '/dic/drugs_route/updateSortNumber/' + currRecord.data.CODE + '/' + (index + 1 + 1),
                                        method: 'PUT',
                                        scope: this,
                                        params: {
                                            bNumber: index + 1,
                                            bCode: store.getAt(index).get('CODE')
                                        },
                                        success: function (response) {
                                            var respText = Ext.decode(response.responseText).data;
                                        },
                                        failure: function (response, options) {
                                            Ext.MessageBox.alert('提示', '修改是否计入入量失败,请求超时或网络故障!');
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ],
            store: routeStore,
            loadMask: true,
            selType: 'rowmodel',
            plugins: [rowEditing],
            columnLines: true,
            columns: [
                {
                    text: '分类',
                    width: '16%',
                    sortable: false,
                    dataIndex: 'CATEGORY',
                    align: 'left',
                    editor: {
                        xtype: 'combobox',
                        queryMode: 'remote',
                        displayField: 'CATEGORY',
                        valueField: 'CATEGORY',
                        allowBlank: false,
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符',
                        store: new Ext.data.Store({
                            fields: ['CATEGORY'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dic/drugs_route/listCategory/all',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listeners: {
                            change: function (roweditor) {
                                if (roweditor.ownerCt.down('button').disabled == true)
                                    roweditor.ownerCt.down('button').setDisabled(false);
                            }
                        },
                        //value:this.getStore().getAt(0).data.CATEGORY,
                        listConfig: {
                            cls: 'border-list',
                            getInnerTpl: function () {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{CATEGORY}</span>';
                            }
                        }
                    }
                },
                {
                    text: '名称',
                    width: '15%',
                    sortable: false,
                    dataIndex: 'NAME',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        allowBlank: false,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '助记码',
                    width: '15%',
                    sortable: false,
                    dataIndex: 'HELPER_CODE',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '描述',
                    width: '21%',
                    sortable: false,
                    dataIndex: 'DESCRIPTION',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 4000
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '是否计入入量',
                    width: '15%',
                    sortable: false,
                    dataIndex: 'IS_INTAKE',
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = routeStore.getAt(rowIndex);
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs_route/updateIs/IS_INTAKE/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_INTAKE: currRecord.data.IS_INTAKE
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    routeStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改是否计入入量失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '是否打印',
                    width: '12%',
                    sortable: false,
                    dataIndex: 'IS_PRINT',
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = routeStore.getAt(rowIndex)
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs_route/updateIs/IS_PRINT/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_PRINT: currRecord.data.IS_PRINT
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    routeStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改是否打印失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: '是否从医嘱中提取',
                    width: '20%',
                    sortable: false,
                    dataIndex: 'IS_EXTRACT',
                    align: 'center',
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    },
                    listeners: {
                        checkchange: function (_this, rowIndex, checked, eOpts) {
                            var currRecord = routeStore.getAt(rowIndex)
                            Ext.Ajax.request({
                                url: webRoot + '/dic/drugs_route/updateIs/IS_EXTRACT/' + currRecord.data.CODE,
                                method: 'PUT',
                                scope: this,
                                params: {
                                    IS_EXTRACT: currRecord.data.IS_EXTRACT,
                                },
                                success: function (response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    routeStore.reload();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '修改是否从医嘱中提取失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                }
            ],
            listeners: {
                selectionchange: function (selModel, selected, eOpts) {
                    if (!selected[0]) return false;
                    if (selected[0].data.CODE.length != 0) {
                        var current = selected[0];
                        var items = selModel.store;
                        var item;
                        for (var i = 0; i < items.getCount(); i++) {
                            item = items.getAt(i);
                            if (item.data.CODE.length == 0) {
                                routeStore.remove(item);
                                break;
                            }
                        }
                        rowEditing.cancelEdit();
                    }
                }
            }
        });
        return route;
    },


    //创建耗材Tab
    createConsumablesPanel: function () {
        var consumablesStore = Ext.create('Ext.data.Store', {
            model: 'com.dfsoft.lancet.sys.settings.ConsumablesModel',
            pageSize: 25,
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/consumables',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data.data',
                    totalProperty: 'data.totalCount'
                }
            },
            autoLoad: true
        });
        consumablesStore.on('beforeload', function (store, options) {
            var name = Ext.getCmp('consumableComboId').getValue();
            var new_params = {};
            if (name && Ext.util.Format.trim(name) != '') {
                name = name.replace(/%/g, '$%25');
                new_params.helpcode = name
            } else {
                new_params.helpcode = null;
            }
            Ext.apply(store.proxy.extraParams, new_params);
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            errorsText: '提示',
            autoCancel: false,
            listeners: {
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    Ext.each(items, function (item) {
                        if (item.data.CODE.length == 0) {
                            consumablesStore.remove(item);
                        }
                    });
                    Ext.getCmp('delete_3').setDisabled(false);
                },
                edit: function (editor, context, e) {
                    var newRecord = context.record;
                    newRecord.data.IS_HIGHVALUE = editor.editor.down('checkbox').checked;
                    if (newRecord.data.CODE.length == 0) {
                        // 新插入一条
                        Ext.Ajax.request({
                            url: webRoot + '/dic/consumables',
                            method: 'POST',
                            scope: this,
                            params: {
                                LOCALITY: newRecord.data.LOCALITY,
                                SPECIFICATION: newRecord.data.SPECIFICATION,
                                USAGE: newRecord.data.USAGE,
                                PRICE: newRecord.data.PRICE,
                                HELP_CODE: newRecord.data.HELP_CODE,
                                IS_HIGHVALUE: newRecord.data.IS_HIGHVALUE == true ? 1 : 0,
                                DEFAULT_AMOUNT: newRecord.data.DEFAULT_AMOUNT,
                                RECORD_CODE: newRecord.data.RECORD_CODE,
                                NAME: newRecord.data.NAME,
                                DESCRIPTION: newRecord.data.DESCRIPTION
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                consumablesStore.reload();
                                Ext.getCmp('delete_3').setDisabled(false);
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '添加耗材失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        //修改
                        Ext.Ajax.request({
                            url: webRoot + '/dic/consumables/' + newRecord.data.CODE,
                            method: 'PUT',
                            scope: this,
                            params: {
                                LOCALITY: newRecord.data.LOCALITY,
                                SPECIFICATION: newRecord.data.SPECIFICATION,
                                USAGE: newRecord.data.USAGE,
                                PRICE: newRecord.data.PRICE,
                                HELP_CODE: newRecord.data.HELP_CODE,
                                IS_HIGHVALUE: newRecord.data.IS_HIGHVALUE == true ? 1 : 0,
                                DEFAULT_AMOUNT: newRecord.data.DEFAULT_AMOUNT,
                                RECORD_CODE: newRecord.data.RECORD_CODE,
                                NAME: newRecord.data.NAME,
                                DESCRIPTION: newRecord.data.DESCRIPTION
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                consumablesStore.reload();
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '修改耗材失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        var consumables = Ext.create('Ext.grid.Panel', {
            title: '耗材',
            border: 1,
            id: 'settings_c346e2b078fd11e39fd9cb7044fb0579',
//            disabled: true,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/drug.png" />',
                            width: '10px'
                        },
                        '耗材',
                        '->',
                        {
                            xtype: 'textfield',
                            id: 'consumableComboId',
                            name: 'consumableComboName',
                            fieldLabel: '耗材名',
                            width: 235,
                            labelWidth: 48,
                            maxLength: 200,
                            emptyText: '请输入拼音首字母或汉字',
                            matchFieldWidth: false
                        },
                        {
                            xtype: 'button',
                            text: '搜索',
                            handler: function () {
                                if (this.ownerCt.down('textfield').validate()) {
                                    consumablesStore.loadPage(1);
                                }
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'add',
                            handler: function () {
                                rowEditing.cancelEdit();
                                var consumablesModel = Ext.create('com.dfsoft.lancet.sys.settings.ConsumablesModel', {
                                    NAME: '新耗材'
                                });
                                consumablesStore.insert(0, consumablesModel);
                                rowEditing.startEdit(0, 0);
                                Ext.getCmp('delete_3').setDisabled(true);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            id: 'delete_3',
                            iconCls: 'delete',
                            handler: function () {
                                var records = consumables.getSelectionModel().getSelection();
                                if (records.length < 1) {
                                    Ext.MessageBox.alert('提示', '请选择要删除的耗材!');
                                    return;
                                }
                                Ext.Msg.confirm('删除耗材', '确认要删除该耗材吗？', function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/dic/consumables/' + records[0].data.CODE,
                                            method: 'DELETE',
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                consumablesStore.reload();
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除耗材失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            store: consumablesStore,
            loadMask: true,
            selType: 'rowmodel',
            plugins: [rowEditing],
            columnLines: true,
            columns: [
                {
                    text: '备案号',
                    sortable: false,
                    width: 130,
                    dataIndex: 'RECORD_CODE',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50,
                        maxLengthText: '最大输入50个字符'
                    }
                },
                {
                    text: '名称',
                    sortable: false,
                    dataIndex: 'NAME',
                    width: 170,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        // vtype:'nospace',
                        maxLength: 200,
                        allowBlank: false,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '产地',
                    sortable: false,
                    width: 80,
                    dataIndex: 'LOCALITY',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50,
                        maxLengthText: '最大输入50个字符'
                    }
                },
                {
                    text: '规格',
                    sortable: false,
                    width: 100,
                    dataIndex: 'SPECIFICATION',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50,
                        maxLengthText: '最大输入50个字符'
                    }
                },
                {
                    text: '用途',
                    sortable: false,
                    dataIndex: 'USAGE',
                    width: 100,
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50,
                        maxLengthText: '最大输入50个字符'
                    }
                },
                {
                    text: '单价',
                    sortable: false,
                    width: 80,
                    dataIndex: 'PRICE',
                    align: 'left',
                    renderer: function (v) {
                        return v;
                    },
                    editor: {
                        xtype: 'numberfield',
                        maxValue: 99999.9,
                        minValue: 0,
                        negativeText: '该输入项的最小值是 0',
                        decimalPrecision: 1,
                        listeners: {
                            change: function (roweditor) {
                                var isHighvalue = roweditor.ownerCt.down('checkbox');
                                if (this.getValue() >= 200) {
                                    isHighvalue.setValue(true);
                                } else if (this.getValue()) {
                                    isHighvalue.setValue(false);
                                }
                            }
                        }
                    }
                },
                {
                    text: '高值耗材',
                    width: 80,
                    sortable: false,
                    dataIndex: 'IS_HIGHVALUE',
                    align: 'center',
                    editor: { xtype: 'checkbox',
                        width: 80
                    },
                    renderer: function (v) {
                        if (v == 1) {
                            return '√';
                        } else {
                            return '';
                        }
                    }
                },
                {
                    text: '默认数量',
                    width: 80,
                    sortable: false,
                    dataIndex: 'DEFAULT_AMOUNT',
                    align: 'left',
                    renderer: function (v) {
                        return v == 0 ? '' : v;
                    },
                    editor: {
                        xtype: 'numberfield',
                        maxValue: 99999,
                        minValue: 0.1,
                        decimalPrecision: 1,
                        listeners: {
                            change: function (roweditor) {
                                if (roweditor.ownerCt.down('button').disabled == true)
                                    roweditor.ownerCt.down('button').setDisabled(false);
                            }
                        }
                    }
                },
                {
                    text: '拼音码',
                    width: 100,
                    sortable: false,
                    dataIndex: 'HELP_CODE',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 50,
                        maxLengthText: '最大输入50个字符'
                    }
                },
                {
                    text: '备注',
                    width: 200,
                    sortable: false,
                    dataIndex: 'DESCRIPTION',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符',
                        listeners: {
                            change: function (roweditor) {
                                if (roweditor.ownerCt.down('button').disabled == true)
                                    roweditor.ownerCt.down('button').setDisabled(false);
                            }
                        }
                    }
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: consumablesStore,
                displayInfo: true,
                displayMsg: '共{2}条'
            }),
            listeners: {
                selectionchange: function (selModel, selected, eOpts) {
                    if (!selected[0]) return false;
                    if (selected[0].data.CODE.length != 0) {
                        var current = selected[0];
                        var items = selModel.store;
                        var item;
                        for (var i = 0; i < items.getCount(); i++) {
                            item = items.getAt(i);
                            if (item.data.CODE.length == 0) {
                                consumablesStore.remove(item);
                                break;
                            }
                        }
                        rowEditing.cancelEdit();
                    }
                }
            }
        });
        return consumables;
    },

    createDescriptionOrderPanel: function () {
        var BedItemStore = new com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore();
        BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBoxs/null';
        BedItemStore.load();
        var descriptionOrderStore = Ext.create('Ext.data.Store', {
            model: 'com.dfsoft.lancet.sys.settings.DrugRouteModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/descriptionOrder',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            errorsText: '提示',
            autoCancel: false,
            listeners: {
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    Ext.each(items, function (item) {
                        if (item.data.CODE.length == 0) {
                            descriptionOrderStore.remove(item);
                        }
                    });
                    Ext.getCmp('delete_4delete_dorder').setDisabled(false);
                },
                edit: function (editor, context, e) {
                    var newRecord = context.record;
                    var selectRecord = descriptionOrder.getSelectionModel().getSelection();
                    if (newRecord.data.CODE.length == 0) {
                        // 新插入一条
                        Ext.Ajax.request({
                            url: webRoot + '/dic/descriptionOrder',
                            method: 'POST',
                            scope: this,
                            params: {
                                NAME: newRecord.data.NAME,
                                CARE_ITEM_CODE: selectRecord[0].raw.CARE_ITEM_CODE
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                descriptionOrderStore.reload();
                                Ext.getCmp('delete_4delete_dorder').setDisabled(false);
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '添加床旁操作失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        //修改
                        Ext.Ajax.request({
                            url: webRoot + '/dic/descriptionOrder/' + newRecord.data.CODE,
                            method: 'PUT',
                            scope: this,
                            params: {
                                CODE: newRecord.data.CODE,
                                NAME: newRecord.data.NAME,
                                CARE_ITEM_CODE: selectRecord[0].raw.CARE_ITEM_CODE
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                descriptionOrderStore.reload();
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '修改床旁操作失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        var descriptionOrder = Ext.create('Ext.grid.Panel', {
            title: '床旁操作',
            border: 1,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/drug.png" />',
                            width: '10px'
                        },
                        '床旁操作',
                        '->',
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'add',
                            handler: function () {
                                rowEditing.cancelEdit();
                                var descriptionOrderModel = Ext.create('com.dfsoft.lancet.sys.settings.DrugRouteModel', {
                                    NAME: '新床旁操作'
                                });
                                descriptionOrderStore.insert(0, descriptionOrderModel);
                                rowEditing.startEdit(0, 0);
                                Ext.getCmp('delete_4delete_dorder').setDisabled(true);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            id: 'delete_4delete_dorder',
                            iconCls: 'delete',
                            handler: function () {
                                var records = descriptionOrder.getSelectionModel().getSelection();
                                if (records.length < 1) {
                                    Ext.MessageBox.alert('提示', '请选择要删除的床旁操作!');
                                    return;
                                }
                                Ext.Msg.confirm('提示', '确认要删除该床旁操作吗？', function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/dic/descriptionOrder/' + records[0].data.CODE,
                                            method: 'DELETE',
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                descriptionOrderStore.reload();
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除床旁操作失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            store: descriptionOrderStore,
            loadMask: true,
            selType: 'rowmodel',
            plugins: [rowEditing],
            columnLines: true,
            columns: [
                {
                    text: '名称',
                    sortable: false,
                    flex: 1,
                    dataIndex: 'NAME',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 500,
                        maxLengthText: '最大输入500个字符'
                    }
                },
                {
                    text: '监护项目',
                    sortable: false,
                    dataIndex: 'CARE_ITEM_NAME',
                    width: 210,
                    align: 'left',
                    editor: {
                        xtype: 'comboboxtree',
                        allowBlank: true,
                        editable: false,
                        multiSelect: false,
                        onlyLeafClick: true,
                        store: BedItemStore,
                        listeners: {
                            nodeclick: function (combo, record, item, index, e, eOpts) {
                                var selectRecord = descriptionOrder.getSelectionModel().getSelection();
                                if (record.get("leaf") == true) {
                                    selectRecord[0].raw.CARE_ITEM_CODE = record.raw.datasource_value;
                                }
                            }
                        }
                    }
                }
            ]
        });
        return descriptionOrder;
    },
    //创建用药途径Tab
    createExaminePanel: function () {
        var me = this;
        var examineItemStore = Ext.create('Ext.data.Store', {
            pageSize: 25,
            model: 'com.dfsoft.lancet.sys.settings.ExamineItemModel',
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/examineItem',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'totalCount'
                }
            },
            autoLoad: true,
            listeners: {
                load: function () {
                    if (this.getCount() == 0 && this.currentPage > 1) {
                        this.loadPage(1);
                    }
                }
            }

        });
        examineItemStore.on('beforeload', function (store, options) {
            var name = me.examine.down('toolbar').down('textfield').getValue();
            var new_params = {};
            if (name && Ext.util.Format.trim(name) != '') {
                name = name.replace(/%/g, '$%25');
                new_params.helpcode = name
            } else {
                new_params.helpcode = null;
            }
            Ext.apply(store.proxy.extraParams, new_params);
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            errorsText: '提示',
            autoCancel: false,
            listeners: {
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    Ext.each(items, function (item) {
                        if (item.data.CODE.length == 0) {
                            examineItemStore.remove(item);
                        }
                    });
                    Ext.getCmp('delete_examine').setDisabled(false);
                },
                edit: function (editor, context) {
                    var newRecord = context.record;
                    if (newRecord.data.CODE.length == 0) {
                        // 新插入一条
                        Ext.Ajax.request({
                            url: webRoot + '/dic/examineItem',
                            method: 'POST',
                            scope: this,
                            params: {
                                ORDER_NAME: newRecord.data.ORDER_NAME,
                                NAME: newRecord.data.NAME,
                                CATEGORY: newRecord.data.CATEGORY,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                DESCRIPTION: newRecord.data.DESCRIPTION,
                                SYNCID: newRecord.data.SYNCID
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                examineItemStore.reload();
                                Ext.getCmp('delete_examine').setDisabled(false);
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        //修改
                        Ext.Ajax.request({
                            url: webRoot + '/dic/examineItem/' + newRecord.data.CODE,
                            method: 'PUT',
                            scope: this,
                            params: {
                                CODE: newRecord.data.CODE,
                                ORDER_NAME: newRecord.data.ORDER_NAME,
                                NAME: newRecord.data.NAME,
                                CATEGORY: newRecord.data.CATEGORY,
                                HELPER_CODE: newRecord.data.HELPER_CODE,
                                SORT_NUMBER: newRecord.data.SORT_NUMBER,
                                DESCRIPTION: newRecord.data.DESCRIPTION,
                                SYNCID: newRecord.data.SYNCID
                            },
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                examineItemStore.reload();
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        var examineGrid = Ext.create('Ext.grid.Panel', {
            title: '化验检查',
            border: 1,
            disabled: false,
            // enableDragDrop : true,
            viewConfig: {
                listeners: {
                    beforerefresh: function (v) {
                        v.scrollTop = v.el.dom.scrollTop;
                        v.scrollHeight = v.el.dom.scrollHeight
                    },
                    refresh: function (v) {
                        v.el.dom.scrollTop = v.scrollTop + (v.scrollTop == 0 ? 0 : v.el.dom.scrollHeight - v.scrollHeight);
                    }
                }
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/drug.png" />',
                            width: '10px'
                        },
                        '化验检查项目',
                        '->',
                        {
                            xtype: 'textfield',
                            fieldLabel: '项目名称',
                            width: 235,
                            labelWidth: 60,
                            maxLength: 200,
                            emptyText: '请输入拼音首字母或汉字',
                            matchFieldWidth: false
                        },
                        {
                            xtype: 'button',
                            text: '搜索',
                            handler: function () {
                                if (this.ownerCt.down('textfield').validate()) {
                                    examineItemStore.loadPage(1);
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'add',
                            handler: function () {
                                rowEditing.cancelEdit();
                                var routeModel = Ext.create('com.dfsoft.lancet.sys.settings.ExamineItemModel', {});
                                examineItemStore.insert(0, routeModel);
                                rowEditing.startEdit(0, 0);
                                Ext.getCmp('delete_examine').setDisabled(true);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            id: 'delete_examine',
                            iconCls: 'delete',
                            handler: function () {
                                var records = examineGrid.getSelectionModel().getSelection();
                                if (records.length < 1) {
                                    Ext.MessageBox.alert('提示', '请选择要删除的化验检查项目!');
                                    return;
                                }
                                Ext.Msg.confirm('提示', '确认要删除该化验检查项目？', function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/dic/examineItem/' + records[0].data.CODE,
                                            method: 'DELETE',
                                            scope: this,
                                            params: {
                                                CODE: records[0].data.CODE
                                            },
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                examineItemStore.reload();
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            store: examineItemStore,
            loadMask: true,
            selType: 'rowmodel',
            plugins: [rowEditing],
            columnLines: true,
            columns: [
                {
                    text: '源系统编码',
                    width: 120,
                    sortable: false,
                    dataIndex: 'SYNCID',
                    align: 'left',
                    editor: {
                        maxLength: 32,
                        xtype: 'textfield'
                    }
                },
                {
                    text: '名称',
                    width: '30%',
                    sortable: false,
                    dataIndex: 'NAME',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        allowBlank: false,
                        maxLengthText: '最大输入200个字符',
                        listeners: {
                            change: function (roweditor) {
                                if (roweditor.ownerCt.down('button').disabled == true)
                                    roweditor.ownerCt.down('button').setDisabled(false);
                            }
                        }
                    }
                },
                {
                    text: '医嘱名称',
                    width: '15%',
                    sortable: false,
                    dataIndex: 'ORDER_NAME',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '分类',
                    width: 120,
                    sortable: false,
                    dataIndex: 'CATEGORY',
                    align: 'left',
                    editor: {
                        maxLength: 40,
                        xtype: 'textfield'
                    }
                },
                {
                    text: '助记码',
                    width: '10%',
                    sortable: false,
                    dataIndex: 'HELPER_CODE',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 200,
                        maxLengthText: '最大输入200个字符'
                    }
                },
                {
                    text: '描述',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'DESCRIPTION',
                    align: 'left',
                    editor: {
                        xtype: 'textfield',
                        maxLength: 4000
                    }
                }
            ],
            listeners: {
                selectionchange: function (selModel, selected, eOpts) {
                    if (!selected[0]) return false;
                    if (selected[0].data.CODE.length != 0) {
                        var current = selected[0];
                        var items = selModel.store;
                        var item;
                        for (var i = 0; i < items.getCount(); i++) {
                            item = items.getAt(i);
                            if (item.data.CODE.length == 0) {
                                examineItemStore.remove(item);
                                break;
                            }
                        }
                        rowEditing.cancelEdit();
                    }
                }
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: examineItemStore,
                displayInfo: true,
                displayMsg: '共{2}条',
                emptyMsg: '无记录'
            })
        });
        return examineGrid;
    }
});