/**
 * 功能说明: 监护项目维护 警示 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AlertTipsGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.AlertStore'
    ],
    initComponent: function() {
        var me = this;
        var alertStore = new com.dfsoft.icu.nws.bedmanagement.AlertStore();
        //创建颜色数据源
        var colorStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'icon', 'value'],
            data: [{
                name: '橙色',
                value: '#FF8800',
                icon: 'circle-orange'
            }, {
                name: '黑色',
                value: '#212121',
                icon: 'circle-black'
            }, {
                name: '红色',
                value: '#CC0000',
                icon: 'circle-red'
            }, {
                name: '黄色',
                value: '#A7A400',
                icon: 'circle-yellow'
            }, {
                name: '蓝色',
                value: '#0099CC',
                icon: 'circle-light-blue'
            }, {
                name: '绿色',
                value: '#669900',
                icon: 'circle-green'
            }, {
                name: '紫红色',
                value: '#980034',
                icon: 'circle-violet'
            }, {
                name: '紫罗兰',
                value: '#180438',
                icon: 'circle-purple'
            }, {
                name: '紫色',
                value: '#9933CC',
                icon: 'circle-light-purple'
            }]
        });
        Ext.apply(me, {
            id: 'nws-alert-grid',
            border: true,
            height: 110,
            store: alertStore,
            lbar: [{
                xtype: 'button',
                iconCls: 'add',
                tooltip: '添加警示',
                scope: me,
                handler: function() {
                    var arr = [{
                        'ID': '',
                        'ITEM_ID': '',
                        'FORMULA': {
                            ICON: 'circle-red',
                            OPERATORS: '',
                            FORMULA_VALUE: '',
                            FORMULA_FUNCTION: ''
                        },
                        'COLOR': '#CC0000',
                        'DESCRIPTION': ''
                    }];
                    alertStore.loadData(arr, true);
                }
            }, {
                xtype: 'button',
                iconCls: 'delete',
                tooltip: '删除警示',
                scope: me,
                handler: function() {
                    var currRecord = me.getSelectionModel().getSelection();
                    if (currRecord.length == 0) {
                        Ext.MessageBox.alert('提示', '请选择一条警示信息!');
                        return;
                    }
                    alertStore.remove(currRecord[0]);
                    var nwsalertGrid = Ext.getCmp('nws-alert-grid');
                    nwsalertGrid.getView().refresh();
                }
            }],
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: '10%',
                align: 'center'
            }, {
                text: '条件',
                dataIndex: 'FORMULA',
                width: '20%',
                sortable: true,
                align: 'center',
                renderer: me.formatValue
            }, {
                text: '颜色',
                dataIndex: 'COLOR',
                width: '20%',
                sortable: true,
                align: 'center',
                field: {
                    xtype: 'combobox',
                    typeAhead: true,
                    queryMode: 'local',
                    triggerAction: 'all',
                    displayField: 'name',
                    valueField: 'value',
                    matchFieldWidth: false,
                    store: colorStore,
                    listConfig: {
                        getInnerTpl: function() {
                            // here you place the images in your combo
                            var tpl = '<div>' +
                                '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                                '<span style="padding-left: 18px;">{name}</span></div>';
                            return tpl;
                        }
                    },
                    listeners: {
                        select: function(combo, record) {
                            var curr = me.getSelectionModel().getSelection();
                            curr[0].data.FORMULA.ICON = record[0].data.icon;
                            console.log(curr[0].data.FORMULA.OPERATORS);
                            //curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {if(value' + curr[0].data.FORMULA.OPERATORS + curr[0].data.FORMULA.FORMULA_VALUE + '){return "' + record[0].data.icon + '";}else{return false;}}';
                            if(curr[0].data.FORMULA.OPERATORS!=undefined){
                            	var operator=curr[0].data.FORMULA.OPERATORS.substring(0,1);
                            	if(operator=='不'){
                            		curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {var curr=\''+curr[0].data.FORMULA.FORMULA_VALUE+'\'.split(",");var boolean=false;for(var i=0;i<curr.length;i++){if(curr[i]==value){boolean=true;}}if(boolean){return false;}else{return "'+record[0].data.icon+'";}}'
                            	}else if(operator=='包'){
                            		curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {var curr=\''+curr[0].data.FORMULA.FORMULA_VALUE+'\'.split(",");for(var i=0;i<curr.length;i++){if(curr[i]==value){return "'+record[0].data.icon+'";}}return false;}'
                            	}else if(operator=='!'){
                            		curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {if(!(value=' + curr[0].data.FORMULA.OPERATORS.substring(1,curr[0].data.FORMULA.OPERATORS.length) + curr[0].data.FORMULA.FORMULA_VALUE + ')){return "' + record[0].data.icon + '";}else{return false;}}';
                            	}else if(operator=='='){
                            		curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {if(value=' + curr[0].data.FORMULA.OPERATORS + curr[0].data.FORMULA.FORMULA_VALUE + '){return "' + record[0].data.icon + '";}else{return false;}}';
                            	}else{
                            		curr[0].data.FORMULA.FORMULA_FUNCTION = 'function(value) {if(value' + curr[0].data.FORMULA.OPERATORS + curr[0].data.FORMULA.FORMULA_VALUE + '){return "' + record[0].data.icon + '";}else{return false;}}';
                            	}
                            }
                            curr[0].commit();
                        }
                    }
                },
                renderer: function(value, record) {
                    var colorData = colorStore.data.items;
                    var icon = '';
                    for (var i = 0; i < colorData.length; i++) {
                        var currColor = colorData[i];
                        if (currColor.data.value === record.record.data.COLOR) {
                            icon = currColor.data.icon;
                        }
                    }
                    if (icon.length == 0) {
                        return '';
                    } else {
                        return '<img src="/app/sys/settings/images/colors/' + icon + '.png" />';
                    }
                }
            }, {
                text: '说明',
                dataIndex: 'DESCRIPTION',
                width: '48%',
                sortable: true,
                align: 'center'
            }],
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })]
        });
        me.callParent();
    },

    formatValue: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            formula = record.data.FORMULA,
            text = '';
        if (typeof formula == 'string') {
            formula = Ext.decode(formula);
            record.data.FORMULA = formula;
        }
        if (formula.FORMULA_FUNCTION.length > 0) {
            text = '<div style="float:left">已设置</div>';
        }
        return text + '<a href="javascript:createAlertConditionWindow(\'' + formula.OPERATORS + '\',\'' + formula.FORMULA_VALUE + '\');"><img src="/app/sys/settings/images/dot.png" title="设置警示条件" style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
    }
});