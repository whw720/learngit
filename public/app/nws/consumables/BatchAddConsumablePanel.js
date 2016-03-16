/**
 * Created by whw720 on 2014/9/12.
 */
Ext.define('com.dfsoft.icu.nws.consumables.BatchAddConsumablePanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.batchaddConsumableGrid',
    initComponent: function () {
        var me = this;
        // 术前用药检索store
        var medicineBeforeAnaesthesiaQueryMedicineStore = Ext.create('Ext.data.Store', {
            fields: ['CODE','RECORD_CODE', 'NAME', 'LOCALITY', 'SPECIFICATION', 'USAGE', 'PRICE', 'IS_HIGHVALUE', 'DEFAULT_AMOUNT', 'HELP_CODE', 'DESCRIPTION'],
            actionMethods: { read: 'POST' },
            proxy: {
                type: 'ajax',
                url: webRoot + '/dic/consumables/queryConsumable',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            filters: [

                function (data) {
                    var indexNum;
                    indexNum = data.store.indexOf(data);
                    if (data.store.pageSize * (data.store.currentPage - 1) <= indexNum && indexNum < data.store.pageSize * data.store.currentPage) {
                        return data;
                    }
                }
            ],
            pageSize: 9,
            tempTime: null,
            autoLoad: false
        });
        Ext.apply(me, {
            isVisible: true,
            inputDataWrong: false,
            header: false,
            layout:'fit',
            border: true,
            columnLines: true,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            //forceFit: true,
            autoScroll: true,
            defaultAlign: 'left',
            store: Ext.create('Ext.data.Store', {
                fields: ['CODE','RECORD_CODE', 'NAME', 'LOCALITY', 'SPECIFICATION', 'USAGE', 'PRICE', 'IS_HIGHVALUE', 'DEFAULT_AMOUNT', 'HELP_CODE', 'DESCRIPTION']
            }),
            /*viewConfig: {
             plugins: {
             ptype: 'gridviewdragdrop'
             }
             },*/
            defaults: {
                css: 'font-size:12;color:black;'
            },
            columns: [
                {
                    header: '备案号',
                    style: 'text-align:center',
                    dataIndex: 'RECORD_CODE',
                    width: 100
                },
                {
                    header: '名称',
                    style: 'text-align:center',
                    dataIndex: 'NAME',
                    width: 200
                },
                {
                    header: '产地',
                    style: 'text-align:center',
                    dataIndex: 'LOCALITY',
                    width: 100
                },
                {
                    header: '规格',
                    style: 'text-align:center',
                    dataIndex: 'SPECIFICATION',
                    width: 100
                },
                {
                    header: '用途',
                    style: 'text-align:center',
                    dataIndex: 'USAGE',
                    width: 100
                },
                {
                    header: '价格',
                    style: 'text-align:center',
                    dataIndex: 'PRICE',
                    width: 60
                },
                {
                    header: '高值耗材',
                    style: 'text-align:center',
                    dataIndex: 'IS_HIGHVALUE',
                    width: 60,
                    renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                        if(value == 1){
                            return "√";
                        }else{
                            return "";
                        }
                    }
                },
                {
                    header: '数量',
                    style: 'text-align:center',
                    dataIndex: 'DEFAULT_AMOUNT',
                    width: 60,
                    maxValue:99999,
                    minValue: 0.1,
                    decimalPrecision: 1,
                    editor: {
                        xtype:'numberfield',
                        allowBlank:false,
                        hideTrigger:true,
                        maxValue:99999,
                        minValue: 0.1,
                        decimalPrecision: 1,
                    }
                },
                {
                    header: '拼音码',
                    style: 'text-align:center',
                    dataIndex: 'HELP_CODE',
                    width: 60
                },
                {
                    header: '备注',
                    style: 'text-align:center',
                    dataIndex: 'DESCRIPTION',
                    width: 60
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    style: 'border-top : 0px',
                    items: [
                        '->',
                        {
                            xtype: 'combo',
                            //id: 'medicineBeforeAnaesthesiaQueryMedicine',
                            fieldLabel: '检索',
                            labelAlign: 'right',
                            queryMode: 'remote',
                            queryDelay: 500,
                            queryCaching: false, // 查询缓存
                            minChars: 0,
                            labelWidth: 30,
                            width: 450,
                            hideTrigger: false,
                            typeAhead: false,
                            store: medicineBeforeAnaesthesiaQueryMedicineStore,
                            displayField: 'COMMON_PRODUCT_NAME',
                            valueField: 'CODE',
                            emptyText: '请输入拼音首字母或汉字检索',
                            matchFieldWidth: false,
                            enableKeyEvents: false,
                            tpl: [
                                '<div style="width:100%;overflow:hidden;"><table style="border-collapse:collapse;font-size:12px; border-bottom-width:thin" width="100%" height="100%" cellspacing="0" cellpadding="0">',
                                '<thead style="background:#f5f5f5;color: #666;font: bold 13px/30px helvetica,arial,verdana,sans-serif;">',
                                '<tr style="border-top:1px solid silver;border-bottom:1px solid silver;">',
                                '<td width="188px" style="border-right:1px solid silver;padding:0 5px 0 7px;" align="center">名称</td>',
                                '<td style="border-right:1px solid silver;padding:0 5px;" width="80px" align="center">规格</td>',
                                '<td style="border-right:1px solid silver;padding:0 5px;" width="80px" align="center">用途</td>',
                                '<td width="64px" style="padding:0 7px 0 5px;" align="center">单价</td></tr></thead>',
                                    '<tbody style="line-height:30px;color:#222;padding-top:25px;line-height:30px;" class="' + Ext.plainListCls + '"><tpl for=".">',
                                    '<tr style="border-bottom:1px solid #e1e1e1;" role="option" unselectable="on" class="' + Ext.baseCSSPrefix + 'boundlist-item">',
                                '<td style="border-right:1px solid #e1e1e1;padding: 0 0 0 3px;" width="188px" align="left">{NAME}</td>',
                                '<td style="border-right:1px solid #e1e1e1;padding: 0 3px 0 0;" width="80px" align="right">{SPECIFICATION}</td>',
                                '<td style="border-right:1px solid #e1e1e1;padding: 0 3px 0 0;" width="80px" align="right">{USAGE}</td>',
                                '<td style="padding-right:7px;" width="64px" align="right">{PRICE}</td>',
                                '</tr></tpl></tbody></table></div>'
                            ].join(''),
                            pageSize: 8,
                            listConfig: {
                                loadingText: 'Loading...',
                                emptyText: '<span style="height:25px; width:200px; font-size:12px;color:black;">没有找到相匹配的数据</span>'
                            },
                            listeners: {
                                select: function (combo, records, eOpts) {
                                    // 当前已选药品，避免重复选择
                                    var flag = false;
                                    var medicineBeforeAnaesthesiaStore = me.getStore();
                                    for (var i = 0; i < medicineBeforeAnaesthesiaStore.getCount(); i++) {
                                        var record = medicineBeforeAnaesthesiaStore.getAt(i);
                                        if (record.data.CODE == records[0].data.CODE) {
                                            me.getSelectionModel().select(record);
                                            flag = true;
                                        }
                                    }
                                    if (!flag) {
                                        me.getSelectionModel().select(records);
                                        medicineBeforeAnaesthesiaStore.loadData(records, true);
                                    }else{
                                        Ext.MessageBox.alert('提示', '请不要添加重复耗材!');
                                    }
                                    combo.focus(true);
                                }
                            },
                            onTriggerClick: function () {
                                var _this = this;
                                if (!_this.isExpanded) {
                                    _this.clearValue();
                                    if (_this.triggerAction === 'all') {
                                        _this.doQuery(_this.allQuery, true);
                                    } else if (_this.triggerAction === 'last') {
                                        _this.doQuery(_this.lastQuery, true);
                                    } else {
                                        _this.doQuery(_this.getRawValue(), false, true);
                                    }
                                }
                            }
                        },
                        {
                            tooltip: '删除药物',
                            iconCls: 'delete',
                            listeners: {
                                click: function () {
                                    var records = me.getSelectionModel().getSelection();
                                    if (records.length < 1) {
                                        Ext.MessageBox.alert('提示', '请选择要删除的材料!');
                                        return;
                                    }
                                    me.getStore().remove(records);
                                }
                            }
                        }/*,
                        {
                            tooltip: '添加新药',
                            iconCls: 'add-drug',
                            handler: function () {
                                win_medicine_add('before_surgery');
                            }
                        },
                        {
                            tooltip: '上移',
                            iconCls: 'up',
                            handler: function (_this) {
                                me.moveupHandler();
                            }
                        },
                        {
                            tooltip: '下移',
                            iconCls: 'down',
                            handler: function (_this) {
                                me.movedownHandler();
                            }
                        }*/
                    ]
                }
            ]

        });
        this.callParent();
    },
    moveupHandler: function () {
        var me = this;
        var seletedGird = me.getSelectionModel(); //获取grid store中的数据
        var currStore = me.getStore();
        var row = seletedGird.getCurrentPosition().row; //获取当前选择的是第几行
        var record = seletedGird.getSelection(); //获取当前选择行的内容
        var newRow = row - 1; //获取上一行的行号
        if (row > 0) {
            currStore.removeAt(row); //删除原行的数据
            currStore.insert(newRow, record); //在新行添加数据
            seletedGird.select(newRow); //选中选择的行
        } else {
            return;
        }
    },
    movedownHandler: function () {
        var me = this;
        var seletedGird = me.getSelectionModel(); //获取grid store中的数据
        var currStore = me.getStore();
        var row = seletedGird.getCurrentPosition().row; //获取当前选择的是第几行
        var record = seletedGird.getSelection(); //获取当前选择行的内容
        var newRow = row + 1; //获取下一行的行号
        var count = currStore.getCount();
        if (newRow < count) {
            currStore.removeAt(row); //删除原行的数据
            currStore.insert(newRow, record); //在新行添加数据
            seletedGird.select(newRow); //选中选择的行
        } else {
            return;
        }
    }
});