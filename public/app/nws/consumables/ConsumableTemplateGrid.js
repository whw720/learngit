/**
 * 功能说明: gcs grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.consumables.ConsumableTemplateGrid', {
    extend: 'Ext.grid.Panel',
    columnLines: true,
    require: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'com.dfsoft.icu.nws.consumables.ConsumableStore',
        'com.dfsoft.icu.nws.consumables.BatchAddConsumablePanel'
    ],
    initComponent: function () {
        var me = this;
        me.itemTempName = "";
        // 一次性材料检索store
        var medicineBeforeAnaesthesiaQueryMedicineStore = Ext.create('Ext.data.Store', {
            fields: ['CODE', 'RECORD_CODE', 'NAME', 'LOCALITY', 'SPECIFICATION', 'USAGE', 'PRICE', 'IS_HIGHVALUE', 'DEFAULT_AMOUNT', 'HELP_CODE', 'DESCRIPTION'],
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
       // console.log(me.templateCode);
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            autoCancel: false,
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    var templateWin = me.ownerCt.ownerCt;
                    var delBtn = Ext.ComponentQuery.query('button[name=delCon]', templateWin)[0];
                    var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', templateWin)[0];
                    var saveAsBtn = Ext.ComponentQuery.query('button[name=conSaveAs]', templateWin)[0];
                    var addBtn = Ext.ComponentQuery.query('button[name=addConTemplate]', templateWin)[0];
                    var templateName = Ext.ComponentQuery.query('textfield[name=templateName]', templateWin)[0];
                    var appTemplate = Ext.ComponentQuery.query('button[name=appTemplate]', templateWin)[0];
                    templateCombo.disable();
                    saveAsBtn.disable();
                    delBtn.disable();
                    addBtn.disable();
                    templateName.disable();
                    appTemplate.disable();
                    if (items[0] != undefined) {
                        me.itemTempName = items[0].data.NAME;
                    }
                },
                validateedit: function (editor, context, eOpts) {

                    var conRecode = context.grid.getSelectionModel().lastSelected;
                    if (conRecode.data.CODE == "") {
                        Ext.MessageBox.alert('提示', '请选择一次性材料，材料名称只能选择，不能录入、修改!');
                        return false;
                    }

                    if (context.newValues.NAME == "") {
                        Ext.MessageBox.alert('提示', '请选择一次性材料名称！');
                        return false;
                    }
                    if (context.newValues.AMOUNT == null) {
                        Ext.MessageBox.alert('提示', '请输入数量！');
                        return false;
                    }

                },
                canceledit: function (editor, context) {
                    var grid = context.grid;
                    var items = grid.getSelectionModel().getSelection();
                    //me.store.remove(item);
                    Ext.each(items, function (item) {
                        //if (item.data.CODE == "") {
                            me.store.remove(item);
                            return false;
                       // }

                    });

                    var templateWin = me.ownerCt.ownerCt;
                    var delBtn = Ext.ComponentQuery.query('button[name=delCon]', templateWin)[0];
                    var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', templateWin)[0];
                    var saveAsBtn = Ext.ComponentQuery.query('button[name=conSaveAs]', templateWin)[0];
                    var addBtn = Ext.ComponentQuery.query('button[name=addConTemplate]', templateWin)[0];
                    var templateName = Ext.ComponentQuery.query('textfield[name=templateName]', templateWin)[0];
                    var appTemplate = Ext.ComponentQuery.query('button[name=appTemplate]', templateWin)[0];
                    templateCombo.enable();
                    saveAsBtn.enable();
                    delBtn.enable();
                    addBtn.enable();
                    templateName.enable();
                    appTemplate.enable();
                },
                edit: function (editor, context) {
                    var templateWin = me.ownerCt.ownerCt;
                    var delBtn = Ext.ComponentQuery.query('button[name=delCon]', templateWin)[0];
                    var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', templateWin)[0];
                    var saveAsBtn = Ext.ComponentQuery.query('button[name=conSaveAs]', templateWin)[0];
                    var addBtn = Ext.ComponentQuery.query('button[name=addConTemplate]', templateWin)[0];
                    var templateName = Ext.ComponentQuery.query('textfield[name=templateName]', templateWin)[0];
                    var appTemplate = Ext.ComponentQuery.query('button[name=appTemplate]', templateWin)[0];
                    templateCombo.enable();
                    saveAsBtn.enable();
                    delBtn.enable();
                    addBtn.enable();
                    templateName.enable();
                    appTemplate.enable();

                    var medicineBeforeAnaesthesiaStore = context.grid.getStore();
                    for (var i = 0; i < medicineBeforeAnaesthesiaStore.getCount(); i++) {
                        var record = medicineBeforeAnaesthesiaStore.getAt(i);

                    }
                    var conRecode = context.grid.getSelectionModel().lastSelected;

                    conRecode.set('NAME', me.itemTempName);
                    if (conRecode.data.PRICE != "") {
                        var countPrice = conRecode.data.AMOUNT * conRecode.data.PRICE;
                        // countPrice = countPrice * 100 / 100;
                        countPrice = countPrice.toFixed(2);
                        // console.log(countPrice);
                        conRecode.set('totalPrice', countPrice);
                    }
//保存
                    //调用保存
                    //templateWin.saveTemplate();
                    conRecode.commit();
                }
            }
        });
        me.store = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableTemplateStore', {
            templateCode: me.templateCode
        });

        Ext.apply(me, {
            border: false,
            autoScroll: true,
            selType: 'rowmodel',
            // enableColumnHide:false,
            store: me.store,
            // layout:'fit',
            forceFit: true,
            plugins: [me.rowEditing],
            // selType: 'cellmodel',
            columns: [
                {
                    text: '名称',
                    dataIndex: 'NAME',
                    width: 160,
                    align: 'left',
                    editor: {
                        xtype: 'combo',
                        queryMode: 'remote',
                        queryDelay: 500,
                        // queryCaching: false, // 查询缓存
                        minChars: 0,
                        labelWidth: 30,
                        width: 450,
                        hideTrigger: false,
                        typeAhead: false,
                        store: medicineBeforeAnaesthesiaQueryMedicineStore,
                        //displayField: 'COMMON_PRODUCT_NAME',
                        displayField: 'NAME',
                        valueField: 'NAME',
                        emptyText: '请输入拼音首字母或汉字检索',
                        matchFieldWidth: false,
                        enableKeyEvents: false,
                        tpl: [
                                '<div style="width:100%;overflow:hidden;">' +
                                '<table style="border-collapse:collapse;font-size:12px; border-bottom-width:thin" width="100%" height="100%" cellspacing="0" cellpadding="0">',
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
                        pageSize: 9,
                        listConfig: {
                            loadingText: 'Loading...',
                            emptyText: '<span style="height:25px; width:200px; font-size:12px;color:black;">没有找到相匹配的数据</span>'
                        },
                        listeners:{
                            afterrender: function (_this, eOpts) {

                                /*if (medicineBeforeAnaesthesiaDrugsInfoData.length == 0) {
                                 if (!_this.isExpanded) {
                                 medicineBeforeAnaesthesiaQueryMedicineStore.load();
                                 _this.expand();
                                 Ext.Function.defer(function () {
                                 _this.focus();
                                 }, 200);
                                 }
                                 }
                                 Ext.fly(_this.el).on('click', function () {
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
                                 });*/
                            },
                            select: function (combo, records, eOpts) {
                                // alert(records[0]);
                                // console.log(records[0]);
                                // 当前已选药品，避免重复选择
                                var flag = false;
                                var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', me.parent)[0];
                                var orderType = orderTypeObj.getValue();
                                var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', me.parent)[0];
                                var queryDate = queryDateObj.getValue();
                                var medicineBeforeAnaesthesiaStore = me.getStore();
                                for (var i = 0; i < medicineBeforeAnaesthesiaStore.getCount(); i++) {
                                    var record = medicineBeforeAnaesthesiaStore.getAt(i);
                                    if (record.data.CODE == records[0].data.CODE) {// 选择项目已经添加过。
                                        Ext.Msg.alert("提示","当前选择项目已经添加过，请修改数量！");
                                        flag = true;
                                        me.rowEditing.fireEvent("canceledit", me.rowEditing, me.rowEditing.context);
                                    }
                                }
                                if (!flag) {
                                    //var recordCurrent = me.store.getAt(0);
                                    // console.log(me.getSelectionModel().getLastSelected());
                                    var recordCurrent = me.getSelectionModel().getLastSelected();
                                    recordCurrent.set('NAME', records[0].data.NAME);// 名 称
                                    recordCurrent.set('SCHEDULING_TYPE', orderType);//班次
                                    recordCurrent.set('USE_DATE', queryDate);// 使用日期
                                    recordCurrent.set('CODE', records[0].data.CODE);//使用耗材代码
                                    recordCurrent.set('SPECIFICATION', records[0].data.SPECIFICATION);//规格
                                    recordCurrent.set('IS_HIGHVALUE', records[0].data.IS_HIGHVALUE);// 是否高值耗材
                                    recordCurrent.set('LOCALITY', records[0].data.LOCALITY);//产地
                                    recordCurrent.set('USAGE', records[0].data.USAGE);//用途
                                    recordCurrent.set('PRICE', records[0].data.PRICE);//单价
                                    recordCurrent.set('totalPrice', '');//总价
                                    recordCurrent.set('RECORD_CODE', records[0].data.RECORD_CODE);//备案号
                                    recordCurrent.set('REGISTER_ID', me.registerId);//患者ID
                                    recordCurrent.set('CREATOR_ID', parent.userInfo.userId);//创建者
                                    recordCurrent.set('CREATE_TIME', new Date());//创建时间

                                    //  console.log(me);


                                    var elitems = Ext.fly(me.mod + "consumableTemplateWin-body").select("div.x-form-display-field[role=input]");
                                    var amountitems = Ext.fly(me.mod + "consumableTemplateWin-body").select("input.x-form-field[name=AMOUNT]");


                                    var amountId = amountitems.elements[0].id;
                                    var totalPrice = 0;
                                    me.itemTempName = records[0].data.NAME;
                                    document.getElementById(amountId).value = records[0].data.DEFAULT_AMOUNT;
                                    if (records[0].data.DEFAULT_AMOUNT != "" && records[0].data.PRICE != "") {
                                        totalPrice = records[0].data.DEFAULT_AMOUNT * records[0].data.PRICE;
                                    }

                                    elitems.elements[0].innerHTML = records[0].data.LOCALITY;
                                    elitems.elements[1].innerHTML = records[0].data.SPECIFICATION;
                                    elitems.elements[2].innerHTML = records[0].data.USAGE;
                                    elitems.elements[3].innerHTML = records[0].data.IS_HIGHVALUE;
                                    elitems.elements[4].innerHTML = records[0].data.PRICE;
                                   // elitems.elements[5].innerHTML = totalPrice;
                                    elitems.elements[5].innerHTML = records[0].data.RECORD_CODE;
                                }

                            }
                        },
                        onTriggerClick: function () {
                            var divObj = Ext.select('div.x-boundlist-list-ct');
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
                    }
                },
                {
                    text: '产地',
                    dataIndex: 'LOCALITY',
                    sortable: false,
                    width: 40,
                    align: 'left'//,
                    //editor: 'textfield'

                },
                {
                    text: '规格',
                    dataIndex: 'SPECIFICATION',
                    width: 90,
                    sortable: false,
                    align: 'left'
                },
                {
                    text: '用途',
                    dataIndex: 'USAGE',
                    width: 90,
                    sortable: false,
                    align: 'left'
                },
                {
                    text: '高值耗材',
                    dataIndex: 'IS_HIGHVALUE',
                    width: 30,
                    sortable: false,
                    // disabled:true,
                    align: 'center',
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        if (value == 1) {
                            return "√";
                        } else {
                            return "";
                        }
                    }
                },
                {
                    text: '单价',
                    dataIndex: 'PRICE',
                    width: 40,
                    sortable: false,
                    align: 'center'
                },
                {
                    text: '数量',
                    dataIndex: 'AMOUNT',
                    width: 40,
                    sortable: false,
                    align: 'center',
                    editor:{
                        xtype: 'numberfield',
                        maxValue: 99999,
                        minValue: 0.1,
                        decimalPrecision: 1

                    }
                },
                {
                    text: '金额',
                    dataIndex: 'TOTALPRICE',
                    width: 40,
                    hidden: true,
                    sortable: false,
                    align: 'center'
                },
                {
                    text: '备案号',
                    dataIndex: 'RECORD_CODE',
                    width: 100,
                    sortable: false,
                    align: 'left'
                }
            ]
        });
        me.callParent();
    }

});