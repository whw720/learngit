Ext.define('com.dfsoft.lancet.sys.settings.CollectProjectWindow', {
    extend: 'Ext.window.Window',
    id: 'collect-project-window',
    requires: [
        'Ext.selection.CheckboxModel'
    ],
    layout: 'fit',
    title: '采集项目',
    modal: true,
    width: 700,
    height: 360,
    border: false,
    maximizable: true,
    iconCls: 'collect-project',
    initComponent: function() {
        var me = this;
        me.collectProPanel = me.createCollectProjectPanel();
        me.buttons = [{
            text: '确定',
            iconCls: 'save',
            handler: me.onOK,
            scope: me
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];
        me.items = [me.collectProPanel];
        me.callParent();
    },
    createCollectProjectPanel: function() {
        var me = this;
        var collectStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'CODE',
                type: 'string'
            }, {
                name: 'CATEGORY',
                type: 'string'
            }, {
                name: 'NAME',
                type: 'string'
            }, {
                name: 'UNIT',
                type: 'string'
            }, {
                name: 'NORMAL_RANGE',
                type: 'string'
            }, {
                name: 'EFFECTIVE_RANGE',
                type: 'string'
            }, {
                name: 'OK',
                type: 'boolean',
                defaultValue: 'false'
            }],
            groupField: 'CATEGORY',
            proxy: {
                type: 'ajax',
                url: '',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });
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
        //创建多选和可编辑
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
        //     mode: 'SIMPLE'
        // });
        // var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        //     clicksToEdit: 1,
        //     listeners: {
        //         edit: function(editor, e) {
        //             e.record.commit();
        //         }
        //     }
        // });
        var collectPro = Ext.create('Ext.grid.Panel', {
            id: 'collect-project-panel',
            border: false,
            bodyPadding: 5,
            columnLines: true,
            disableSelection: false,
            loadMask: true,
            store: collectStore,
            //selModel: selModel,
            //plugins: [cellEditing],
            viewConfig: {
                trackOver: false,
                stripeRows: false
            },
            features: [Ext.create('Ext.grid.feature.Grouping', {
                groupByText: '用本字段分组',
                showGroupsText: '显示分组',
                startCollapsed: false //设置初始分组是否收起 
            })],
            columns: [{
                    xtype: 'checkcolumn',
                    text: '<input id="check-all-coll" type="checkbox" />',
                    sortable: false,
                    dataIndex: 'OK',
                    width: '8%',
                    listeners: {
                        checkchange: function(_this, rowIndex, checked) {
                            var store = Ext.getCmp('collect-project-panel').getStore(),
                                record = store.getAt(rowIndex);
                            record.commit();
                        }
                    }
                }, {
                    text: '分类',
                    dataIndex: 'CATEGORY',
                    width: '25%',
                    sortable: false,
                    align: 'left'
                }, {
                    text: '名称',
                    dataIndex: 'NAME',
                    width: '27%',
                    sortable: false,
                    align: 'left'
                }, {
                    text: '单位',
                    dataIndex: 'UNIT',
                    width: '10%',
                    sortable: false,
                    align: 'left'
                }, {
                    text: '正常范围',
                    width: '14%',
                    dataIndex: 'NORMAL_RANGE',
                    sortable: false,
                    align: 'left'
                }, {
                    text: '有效范围',
                    dataIndex: 'EFFECTIVE_RANGE',
                    width: '14%',
                    sortable: false,
                    align: 'left'
                }
                // , {
                //     text: '图例',
                //     dataIndex: 'LEGEND_CODE',
                //     width: '12%',
                //     sortable: false,
                //     align: 'left',
                //     editor: {
                //         xtype: 'combobox',
                //         typeAhead: true,
                //         triggerAction: 'all',
                //         queryMode: 'local',
                //         displayField: 'name',
                //         valueField: 'value',
                //         matchFieldWidth: false,
                //         store: new Ext.data.Store({
                //             fields: ['name', 'value', 'icon'],
                //             data: [{
                //                 name: '收缩压',
                //                 value: 'SBP',
                //                 icon: 'sbp'
                //             }, {
                //                 name: '舒张压',
                //                 value: 'DBP',
                //                 icon: 'dbp'
                //             }, {
                //                 name: '脉搏',
                //                 value: 'PULSE',
                //                 icon: 'pulse'
                //             }, {
                //                 name: '自主呼吸',
                //                 value: 'SPONT',
                //                 icon: 'spont'
                //             }, {
                //                 name: '机械通气',
                //                 value: 'FMMV',
                //                 icon: 'fmmv'
                //             }, {
                //                 name: '体温',
                //                 value: 'TP',
                //                 icon: 'tp'
                //             }]
                //         }),
                //         listConfig: {
                //             getInnerTpl: function() {
                //                 // here you place the images in your combo
                //                 var tpl = '<div>' +
                //                     '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                //                     '<span style="padding-left: 18px;">{name}</span></div>';
                //                 return tpl;
                //             }
                //         }
                //     },
                //     renderer: function(value, record) {
                //         if (record.record.data.LEGEND_CODE.length == 0) {
                //             return '';
                //         } else {
                //             var icon = record.record.data.LEGEND_CODE.toLowerCase();
                //             return '<img src="/app/sys/settings/images/' + icon + '.png" />';
                //         }

                //     }
                // }
                // , {
                //     text: '颜色',
                //     dataIndex: 'DISPLAY_COLOR',
                //     width: '12%',
                //     sortable: false,
                //     align: 'left',
                //     field: {
                //         xtype: 'combobox',
                //         typeAhead: true,
                //         queryMode: 'local',
                //         triggerAction: 'all',
                //         displayField: 'name',
                //         valueField: 'value',
                //         matchFieldWidth: false,
                //         store: colorStore,
                //         listConfig: {
                //             getInnerTpl: function() {
                //                 // here you place the images in your combo
                //                 var tpl = '<div>' +
                //                     '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                //                     '<span style="padding-left: 18px;">{name}</span></div>';
                //                 return tpl;
                //             }
                //         }
                //     },
                //     renderer: function(value, record) {
                //         var colorData = colorStore.data.items;
                //         var icon = '';
                //         for (var i = 0; i < colorData.length; i++) {
                //             var currColor = colorData[i];
                //             if (currColor.data.value === record.record.data.DISPLAY_COLOR) {
                //                 icon = currColor.data.icon;
                //             }
                //         }
                //         if (icon.length == 0) {
                //             return '';
                //         } else {
                //             return '<img src="/app/sys/settings/images/colors/' + icon + '.png" />';
                //         }
                //     }
                // }
            ],
            listeners: {
                afterrender: function(_this) {
                    var collChecked = Ext.get("check-all-coll");
                    collChecked.on('click', function() {
                        var store = Ext.getCmp('collect-project-panel').getStore(),
                            records = store.getRange(0, store.getCount());
                        if (collChecked.dom.checked === true) {
                            for (var i = 0; i < records.length; i++) {
                                records[i].data.OK = true;
                            }
                        } else {
                            for (var i = 0; i < records.length; i++) {
                                records[i].data.OK = false;
                            }
                        }
                        store.loadData(records, false);
                    });
                },
                // itemclick: function(_this, record, item, index, e) {
                //     if (record.data.OK === true) {
                //         record.data.OK = false;
                //     } else {
                //         record.data.OK = true;
                //     }
                //     var store = Ext.getCmp('collect-project-panel').getStore(),
                //         records = store.getRange(0, store.getCount());
                //     store.loadData(records, false);
                // }
            }
        });
        return collectPro;
    },
    onOK: function() {
    	var me=this;
        var store = Ext.getCmp('collect-project-panel').getStore(),
            records = store.getRange(0, store.getCount()),
            selectRec = [],
            infoForm = Ext.getCmp('adapter-info-form').getForm();
        for (var i = 0; i < records.length; i++) {
            if (records[i].data.OK == true) {
                selectRec.push(records[i]);
            }
        }
        infoForm.findField('COLL_PROJECT').setValue(selectRec.length + '项');
        var data = [];
        for (var i = 0; i < selectRec.length; i++) {
            data[i] = {
                'CODE': selectRec[i].data.CODE
                //'LEGEND_CODE': selectRec[i].data.LEGEND_CODE,
                //'DISPLAY_COLOR': selectRec[i].data.DISPLAY_COLOR
            }
        }
        //selectData = data;
        var json = JSON.stringify(data);
        if(data.length>0){
        	infoForm.findField('SELECT_ITEM').setValue(json);
        }
        Ext.getCmp('collect-project-window').close();
    }
});