/**
 * 功能说明: 护理字典 项目取值范围 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareItemRangeGrid', {
    extend: 'Ext.grid.Panel',
    initComponent: function() {
        var me = this;
        me.rangeStore = new Ext.data.Store({
            fields: ['CODE', 'DISPLAY_NAME', 'HELPER_CODE', 'ITEM_VALUE', {
                name: 'IS_DEFAULT', // 是否默认
                type: 'boolean',
                defaultValue: true
            }],
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/dic_care_item/range/all',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });
        Ext.apply(me, {
            id: 'care-item-range-grid',
            border: false,
            style: {
                borderTop: '1px solid silver'
            },
            margin: '5 0 0 0',
            store: me.rangeStore,
            columnLines: true,
            region: 'center',
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function(node, data, overModel, dropPosition, eOpts) {
                        /*var rangeSort = [];
                        for (var i = 0; i < me.rangeStore.getCount(); i++) {
                            var curr = me.rangeStore.getAt(i);
                            if (curr.data.CODE.length > 0) {
                                rangeSort.push(curr.data.CODE);
                            }
                        }

                        Ext.Ajax.request({
                            url: webRoot + '/dic/dic_care_item_range/sort',
                            params: {
                                rangeSort: rangeSort
                            },
                            method: 'PUT',
                            success: function(response) {
                                me.rangeStore.reload();
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '更新排序号失败,请求超时或网络故障!');
                            }
                        });*/
                    }
                }
            },
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                autoRender:true,
                width: '10%',
                align: 'center'
            }, {
                text: '默认',
                dataIndex: 'NAME',
                width: '12%',
                sortable: true,
                align: 'left',
                renderer: me.formatValue
            }, {
                text: '显示名称',
                dataIndex: 'DISPLAY_NAME',
                width: '27%',
                sortable: true,
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    maxLength: 18,
                    allowBlank: false,
                    maxLengthText: '最大输入18个字符'
                }
            }, {
                text: '助记码',
                dataIndex: 'HELPER_CODE',
                width: '24%',
                sortable: true,
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    maxLength: 18
                }
            }, {
                text: '值',
                dataIndex: 'ITEM_VALUE',
                width: '26%',
                sortable: true,
                align: 'left',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    maxLength: 200
                }
            }],
            plugins: [this.cellEditing = new Ext.grid.plugin.CellEditing({
                clicksToEdit: 2
            })]
        });
        me.callParent();
    },

    // 将当前列格式化成radio
    formatValue: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            checked = record.data.IS_DEFAULT;
        if (checked) {
            return '<input type="radio" name="default" checked="true" onclick="getChecked(\'' + rowIdx + '\');" />';
        } else {
            return '<input type="radio" name="default" onclick="getChecked(\'' + rowIdx + '\');" />';
        }
    }
});