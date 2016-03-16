/**
 * 一次性材料录入
 *
 * @author zag
 * @date 2014-9-10
 */
Ext.define('com.dfsoft.icu.nws.consumables.ConsumablePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.consumablepanel',
    requires: [
        'com.dfsoft.icu.nws.consumables.ConsumableGrid',
        'com.dfsoft.icu.nws.consumables.ConsumableStore',
        'com.dfsoft.icu.nws.consumables.BatchAddConsumableWindow'],
    initComponent: function () {
        var me = this;
        Ext.util.CSS.swapStyleSheet('consumables.css', webRoot + '/app/nws/consumables/css/consumables.css');
        me.registerId = "";

        if (me.patientInfo != null) {
            me.registerId = me.patientInfo.REGISTER_ID;
        }
        me.consumableGrid = new com.dfsoft.icu.nws.consumables.ConsumableGrid({registerId: me.registerId, mod: me.mod});
        // alert(me.patientInfo);
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
//      me.consumableGrid.addListener('itemdblclick', conItemDblclick);
//        function conItemDblclick(grid, record, item, index, e, eOpts){
//
//            alert(item);
//        };


//        me.consumableGrid.on('edit', function(editor, e, eOpts){
//            var editStore = editor.grid.getStore();
//           // var record = editStore.getModifiedRecords();
//            var record = editor.grid.getSelectionModel().lastSelection.record;
//
//            var amount = record.data.AMOUNT;//数量
//            var price = record.data.PRICE;//单价
//            var itemCode = record.data.CONSUMABLES_CODE;//使用耗材代码
//            var conId = record.data.ID;// ID
//// 日期，班次
//            var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]',me)[0];
//            var orderType = orderTypeObj.getValue();
//            var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time]',me)[0];
//            var queryDate = queryDateObj.getValue();
//            var totalPrice = 0;
//if(record.length == 0){
//   //木有修改
//}else{
//   /* name: 'totalPrice'//总价
//    name: 'AMOUNT'//用量
//    'CONSUMABLES_CODE'//使用耗材代码
//   */
//
//    if(editor.context.field == "AMOUNT"){
//        if(itemCode == ""){
//            Ext.Msg.alert("提示", "请先选择一次性耗材！");
//            record.commit();
//            return;
//        }
//
//       // debugger;
//    //    console.log(amount);
//       // console.log(price);
//
//         if(amount != null && price != null){
//             totalPrice = amount * price;
//             totalPrice = totalPrice * 100 / 100;
//             record.set('totalPrice',totalPrice);
//         }
//       // 更新
//        Ext.Ajax.request({
//            url: parent.webRoot + '/nws/updateConsumable/' + conId,
//            method:'PUT',
//            params: {
//                totalPrice:totalPrice,
//                amount: amount,
//                itemCode: itemCode
//            },
//            success: function(response) {
//                var reqmsg = Ext.decode(response.responseText);
//                if (reqmsg.success === true) {
//                    record.commit();
//                } else {
//                    request.showErr(reqmsg.errors,'保存失败，请联系网络管理员！');
//                }
//            }
//        });
//    }else if(editor.context.field == "NAME"){//更改的是名称
//    // 更改名称。
//
//
//       var  useConParams = {
//            ID:'',//耗材使用唯一标识
//                SCHEDULING_TYPE:orderType,//使用班次
//                USE_DATE:queryDate,//使用日期
//                CONSUMABLES_CODE:itemCode,//使用耗材代码
//                AMOUNT:amount,//用量
//                REGISTER_ID:me.patientInfo.REGISTER_ID,//患者登记ID
//                CREATOR_ID:parent.userInfo.userId,//创建者
//                CREATE_TIME:new Date()//创建时间
//        };
//        if(conId == ""){// 插入数据
//            Ext.Ajax.request({
//                url: parent.webRoot + '/nws/addConsumable',
//                method:'POST',
//                params:useConParams,
//                success: function(response) {
//                    var reqmsg = Ext.decode(response.responseText);
//                    record.set('ID',reqmsg.data.conId);
//                   // console.log(record);
//                },
//                failure: function(response, options) {
//                    request.showLanErr('保存');
//                }
//            });
//        }else{//更新数据
//
//
//
//        }
//
//
//    }
//}
//        });
        Ext.apply(this, {
            title: '一次性材料',
            closable: true,
            // tooltip: '一次性材料',
            id: me.mod + 'consumablepanel',
            layout: 'fit',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    margin: '-1 -1 0 -1',
                    border: true,
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'doctor-order-extract-time-bc',
                            fieldLabel: '日期',
                            format: 'Y-m-d',
                            value: new Date(),
                            width: 140,
                            editable: false,
                            labelWidth: 30,
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'combo',
                            name: 'doctor-order-type-bc',
                            fieldLabel: '班次',
                            width: 100,
                            editable: false,
                            allowBlank: false,
                            blankText: '请输入类型',
                            valueField: 'value',
                            value: '',
                            displayField: 'text',
                            store: new Ext.data.SimpleStore({
                                fields: ['value', 'text'],
                                data: [
                                    ['be0df177abf011e396e800271396a820', '日班'],
                                    ['c7605a40abf011e396e800271396a820', '夜班']
                                ]
                            }),
                            msgTarget: 'none',
                            preventMark: true,
                            labelWidth: 30,
                            labelAlign: 'right',
                            listeners: {
                                afterRender: function (combo) {
                                    var currentTime = new Date();
                                    if (currentTime.getHours() < 7 || currentTime.getHours() > 19) {
                                        //夜班
                                        combo.setValue('c7605a40abf011e396e800271396a820');
                                    } else {
                                        //白班
                                        combo.setValue('be0df177abf011e396e800271396a820');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '刷新',
                            name: 'queryButton',
                            iconCls: 'order-refresh',
//                            handler: function (btn) {
//
//                                var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]',btn.ownerCt.ownerCt)[0];
//                                var orderType = orderTypeObj.getValue();
//                                var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time]',btn.ownerCt.ownerCt)[0];
//                                var queryDate = queryDateObj.getValue();
////                                var startTime,endTime;
////                                if(orderType == "day"){
////                                    //白班起始时间
////                                    startTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 7:00:00";
////                                    endTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 19:00:00";
////                                }else{
////                                        //夜班起始时间
////                                        startTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 19:00:00";
////                                        endTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate() + 1) + " 7:00:00";
////                                }
//                                var startTime = queryDate.Format("yyyy-MM-dd 00:00:00");
//                                var conStore = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableStore',{
//                                    registerId:btn.ownerCt.ownerCt.patientInfo.REGISTER_ID,
//                                    startTime:startTime,
//                                    orderType:orderType
//                                });
//                                btn.ownerCt.ownerCt.elm.show();
//                                btn.ownerCt.ownerCt.consumableGrid.reconfigure(conStore);
//                                btn.ownerCt.ownerCt.elm.hide();
//                            }
//                            ,
                            listeners: {
                                "click": function () {
                                    // console.log(this);
                                    if (this.ownerCt.ownerCt.patientInfo == null) {
                                        Ext.Msg.alert("提示", "请选择患者！");
                                        return;

                                    }
                                    var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', this.ownerCt.ownerCt)[0];
                                    var orderType = orderTypeObj.getValue();
                                    var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', this.ownerCt.ownerCt)[0];
                                    var queryDate = queryDateObj.getValue();
//                                var startTime,endTime;
//                                if(orderType == "day"){
//                                    //白班起始时间
//                                    startTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 7:00:00";
//                                    endTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 19:00:00";
//                                }else{
//                                        //夜班起始时间
//                                        startTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate()) + " 19:00:00";
//                                        endTime = queryDate.getFullYear()+"-"+(queryDate.getMonth() + 1) + "-"+(queryDate.getDate() + 1) + " 7:00:00";
//                                }
                                    var startTime = queryDate.Format("yyyy-MM-dd 00:00:00");
                                    var conStore = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableStore', {
                                        registerId: this.ownerCt.ownerCt.patientInfo.REGISTER_ID,
                                        startTime: startTime,
                                        orderType: orderType
                                    });
                                    this.ownerCt.ownerCt.elm.show();
                                    this.ownerCt.ownerCt.consumableGrid.reconfigure(conStore);
                                    this.ownerCt.ownerCt.elm.hide();
                                }}
                        },
                        '->',
                        {
                            xtype: 'combo',
                            name: 'doctor-mode',
                            fieldLabel: '模板',
                            width: 220,
                            queryMode: 'local',
                            editable: false,
                            // allowBlank : false,
                            blankText: '请输入类型',
                            valueField: 'value',
                            displayField: 'text',
                            store: new Ext.data.Store({
                                fields: ['value', 'text','texts'],
                                proxy: {
                                    type: 'ajax',
                                    url: webRoot + '/nws/getConsumableTemplate',
                                    method: 'GET',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                },
                                autoLoad: true
                            }),
                            labelWidth: 30,
                            labelAlign: 'right',
                            listConfig:{
                                loadMask: false,
                                width: 250
                            },
                            tpl:Ext.create('Ext.XTemplate',
                                    '<tpl for=".">' +
                                    '<tpl if="text != \'添加新模板\'">' +
                                    '<div class="x-boundlist-item" style="border-top-style: dotted;border-top-color:#B5B8C8 ;border-top-width: thin;" onclick="">' +
                                    '<span title={text}>{texts}</span>' +
                                    '<span align="right" style="padding: 0px 5px 0px 0px;">' +
                                    '<a href="javascript:;" onclick="editConsumableTemplate(event,\'{value}\', \'{text}\')"><span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 25px;"><img src="/app/sys/desktop/images/gears.png" /></span></a>' +
                                    '<a href="javascript:;" onclick="deleteConsumableTemplate(event,\'{value}\', \'{text}\')"><span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 6px;"><img src="/app/sys/desktop/images/delete.png" /></span></a>' +
                                    '</span>' +
                                    '</div>' +
                                    '<tpl else>' +
                                    '<div class="x-boundlist-item" onclick="addConsumableTemplate(event,\'{value}\',\'{text}\')" style="border-top-style: dotted;border-top-color:#B5B8C8;border-top-width: thin; margin-top: -2px;" >' +
                                    '<span>{text}</span>' +
                                    '<span align="right" style="padding: 0px 5px 0px 0px;">' +
                                    '<span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 6px;"><img src="/app/sys/desktop/images/add.png" /></span>' +
                                    '</span>' +
                                    '</div>' +
                                    '</tpl>' +
                                    '</tpl>'
                            )
                        },
                        {
                            xtype: 'button',
                            tooltip: '应用模板',
                            iconCls: 'shift-submit',
                            handler: function (btn) {
                                if (btn.ownerCt.ownerCt.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请选择患者！");
                                    return;
                                }
                                var queryButtonObj = Ext.ComponentQuery.query('button[name=queryButton]', btn.ownerCt.ownerCt)[0];

                                var modeObj = Ext.ComponentQuery.query('combo[name=doctor-mode]', btn.ownerCt.ownerCt)[0];

                                var modeId = modeObj.getValue();
                               //console.log(modeId);
                                if (modeId == null||modeId == "") {
                                    Ext.MessageBox.alert('提示', '请选择一个模板!');
                                    return;
                                }
                                if (btn.ownerCt.ownerCt.consumableGrid.store.getCount() > 0) {
                                    Ext.MessageBox.confirm("请确认", "应用模板后清空原有记录，是否应用模板？", function (button, text) {
                                        if (button == 'yes') {
                                            btn.ownerCt.ownerCt.elm.show();
                                            Ext.Ajax.request({
                                                url: webRoot + '/nws/getConsumableTemplateItems/' + modeId,
                                                method: 'get',
                                                success: function (response) {
                                                    var respText = Ext.decode(response.responseText).data;
                                                    btn.ownerCt.ownerCt.consumableAddRow(respText, 2);
                                                },
                                                failure: function (response, options) {
                                                    btn.ownerCt.ownerCt.elm.hide();
                                                    Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    Ext.Ajax.request({
                                        url: webRoot + '/nws/getConsumableTemplateItems/' + modeId,
                                        method: 'get',
                                        success: function (response) {
                                            var respText = Ext.decode(response.responseText).data;

                                            btn.ownerCt.ownerCt.consumableAddRow(respText, 2);

                                        },
                                        failure: function (response, options) {
                                            btn.ownerCt.ownerCt.elm.hide();
                                            Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                                        }
                                    });

                                }

                            }},
                        {
                            xtype: 'button',
                            iconCls: 'save',
                            tooltip: '保存模板',
                            hidden:true,
                            handler: function (btn) {
                                btn.ownerCt.ownerCt.createNewTemplateWindow();
                            }
                        },
                        '-',
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'nws-order-add',
                            handler: function (btn) {
                                if (btn.ownerCt.ownerCt.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请选择患者！");
                                    return;

                                }
                                var delObj = Ext.ComponentQuery.query('button[name=delCon]', btn.ownerCt.ownerCt)[0];
                                var fastObj = Ext.ComponentQuery.query('button[name=fastCon]', btn.ownerCt.ownerCt)[0];
                                delObj.disable();
                                fastObj.disable();

                                var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', btn.ownerCt.ownerCt)[0];
                                var orderType = orderTypeObj.getValue();
                                //console.log(orderType);
                                var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', btn.ownerCt.ownerCt)[0];
                                var queryDate = queryDateObj.getValue();
                                queryDate = queryDate.Format("yyyy-MM-dd");
                                btn.ownerCt.ownerCt.consumableGrid.rowEditing.cancelEdit();
                                var consumableModel = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableModel', {
                                    ID: '',//耗材使用唯一标识
                                    SCHEDULING_TYPE: orderType,//使用班次
                                    USE_DATE: queryDate,//使用日期
                                    CONSUMABLES_CODE: "",//使用耗材代码
                                    NAME: "",//名称
                                    LOCALITY: "",//产地
                                    SPECIFICATION: "",//规格
                                    USAGE: "",//用途
                                    PRICE: "",//单 价
                                    RECORD_CODE: "",//备案
                                    totalPrice: "",//总价
                                    AMOUNT: "",//用量
                                    REGISTER_ID: btn.ownerCt.ownerCt.patientInfo.REGISTER_ID,//患者登记ID
                                    CREATOR_ID: parent.userInfo.userId,//创建者
                                    CREATE_TIME: new Date()//创建时间
                                });
                                btn.ownerCt.ownerCt.consumableGrid.store.insert(0, consumableModel);
                                btn.ownerCt.ownerCt.consumableGrid.rowEditing.startEdit(0, 0);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            iconCls: 'delete',
                            name: 'delCon',
                            handler: function (btn) {
                                var records = btn.ownerCt.ownerCt.consumableGrid.getSelectionModel().getSelection();
                                if (records.length <= 0) {
                                    Ext.Msg.alert("提示", "请选择需要删除的记录！");
                                    return;
                                }
                                Ext.MessageBox.confirm("请确认", "是否真的要删除选定的内容", function (button, text) {
                                    if (button == 'yes') {
                                        btn.ownerCt.ownerCt.elm.show();
                                        var conId = records[0].data.ID;
                                        // alert(conId);
                                        Ext.Ajax.request({
                                            url: webRoot + '/nws/delConsumable/' + conId,
                                            method: 'PUT',
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText).data;
                                                btn.ownerCt.ownerCt.consumableGrid.store.remove(records[0]);
                                                btn.ownerCt.ownerCt.elm.hide();
                                            },
                                            failure: function (response, options) {
                                                btn.ownerCt.ownerCt.elm.hide();
                                                Ext.MessageBox.alert('提示', '删除材料失败,请求超时或网络故障!');
                                            }
                                        });

                                    }
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '快速添加',
                            iconCls: 'doctor-scan',
                            name: 'fastCon',
                            handler: function (btn) {
                                var me = this;
                                if (btn.ownerCt.ownerCt.patientInfo == null) {
                                    Ext.Msg.alert("提示", "请选择患者！");
                                    return;
                                }
                                me.ownerCt.ownerCt.openFastAddWin();//打开快速录入窗口
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '打印',
                            iconCls: 'print-button',
                            handler: function (btn) {
                                //consumablePrint
                            },
                            menu: [
                                {
                                    text: '打印全天',
                                    iconCls: 'print-button',
                                    handler: function (btn) {

                                        // 调用打印
                                        if (this.ownerCt.ownerButton.ownerCt.ownerCt.patientInfo == null) {
                                            Ext.Msg.alert("提示", "请选择患者！");
                                            return;

                                        }
                                        var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', btn.ownerCt.ownerCt)[0];
                                        var queryDate = queryDateObj.getValue();
                                        var registerId = me.patientInfo.REGISTER_ID;
                                        queryDate = queryDate.Format("yyyy-MM-dd");
                                        //  console.log(btn.ownerCt.ownerCt.parentPanel.mod);
                                        var conframe = document.getElementById('conPrintIframe').contentWindow;
                                        conframe.loadPageData(registerId, queryDate);
                                    }
                                },
                                {
                                    text: '打印班次',
                                    iconCls: 'print-button',
                                    handler: function (btn) {

                                        // 调用打印
                                        if (this.ownerCt.ownerButton.ownerCt.ownerCt.patientInfo == null) {
                                            Ext.Msg.alert("提示", "请选择患者！");
                                            return;

                                        }
                                        var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', btn.ownerCt.ownerCt)[0];
                                        // console.log(orderTypeObj.getValue());
                                        var orderType = orderTypeObj.getValue();
                                        var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', btn.ownerCt.ownerCt)[0];
                                        var queryDate = queryDateObj.getValue();
                                        var registerId = me.patientInfo.REGISTER_ID;
                                        queryDate = queryDate.Format("yyyy-MM-dd");
                                        //  console.log(btn.ownerCt.ownerCt.parentPanel.mod);
                                        var conframe = document.getElementById('conPrintIframe').contentWindow;
                                        conframe.loadPageData(registerId, queryDate, orderType);
                                    }
                                }

                            ]
                        }
                    ]
                }
            ],
            items: [
                {
                    autoScroll: true,
                    layout: 'fit',
                    style: {
                        borderTop: '1px solid silver'
                    },
                    items: [me.consumableGrid]
                }
                ,
                {
                    xtype: 'panel',
                    hidden: true,
                    html: '<iframe id="conPrintIframe" frameborder="0" src="/templates/' + templates + '/consumables_use.html' + '" width="100%" height="100%"></iframe>'
                }
            ]
        });
        this.callParent(arguments);
    },

    //换床
    setPatientInfo: function (patientInfo) {
        var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', this)[0];
        var currentTime = queryDateObj.getValue();
        var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', this)[0];
        var orderType = orderTypeObj.getValue();
        var startTime = currentTime.Format("yyyy-MM-dd 00:00:00");
        var conStore = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableStore', {
            registerId: patientInfo.REGISTER_ID,
            startTime: startTime,
            orderType: orderType
        });

        this.elm.show();
        this.consumableGrid.reconfigure(conStore);
        this.patientInfo = patientInfo;
        this.consumableGrid.registerId = patientInfo.REGISTER_ID;
        this.elm.hide();
    },
    openFastAddWin: function () {
        var me = this;
        var addWindow = Ext.create('com.dfsoft.icu.nws.consumables.BatchAddConsumableWindow',
            {
                consumablePanel: me
            });
        me.parentPanel.nwsToolbar.nwsApp.showModalWindow(addWindow);
    },
    //检查重复项目
    checkRepeat: function (newCode, OriginalItems) {
        for (var oi = 0; oi < OriginalItems.length; oi++) {
            if (OriginalItems[oi].data.CONSUMABLES_CODE == newCode) {
                return false;
            }
        }
        return true;
    },
    // 快速添加
    fastAdd: function (fastStore) {

        var me = this;
        var OriginalItems = me.consumableGrid.store.data.items;
        var queryButtonObj = Ext.ComponentQuery.query('button[name=queryButton]', this)[0];
        var conItems = fastStore.data.items;
        //console.log(conItems);
        var conItemsAll = [];
        var repeatItems = "";
        if (conItems.length > 0) {
            for (var ci = 0; ci < conItems.length; ci++) {
                var itemOne = conItems[ci].data;
                itemOne.amount = conItems[ci].data.DEFAULT_AMOUNT;
                if (conItems[ci].data.DEFAULT_AMOUNT != null && conItems[ci].data.PRICE != null) {
                    itemOne.totalPrice = (conItems[ci].data.DEFAULT_AMOUNT * conItems[ci].data.PRICE) * 100 / 100;
                }
                //重复不添加
                if (me.checkRepeat(itemOne.CODE, OriginalItems)) {
                    conItemsAll.push(itemOne);
                } else {
                    repeatItems = repeatItems + itemOne.NAME + '、';

                }
            }
            // console.log(conItemsAll);

            // this.conItemAdd(conItemsAll);
            this.conItemAddNew(conItemsAll);

            queryButtonObj.fireEvent("click", queryButtonObj);

            // console.log(me.consumableGrid.store);


            if (repeatItems != "") {
                repeatItems = repeatItems.substring(0, repeatItems.length - 1);
                repeatItems = '以下项目 【' + repeatItems + '】 有重复添加，请修改数量！';
                Ext.MessageBox.alert('提示', repeatItems);
            }
        }
    },
    /*
     *添加行，1 来自模板， 2 来自快速添加。
     * conItems 项目对象
     * addType 2 来自模板， 1 来自快速添加。   如果来自 2 删除原来添加的行。
     * */
    consumableAddRow: function (conItems, addType) {
        var me = this;
        if (addType == 2) {
            //删除原有记录
            // alert(me.consumableGrid.store.getCount());
            // debugger;

            var conRowCount = me.consumableGrid.store.getCount();
            if (conRowCount > 0) {
                var conIds = "";
                for (var ci = 0; ci < conRowCount; ci++) {
                    var conRecord = me.consumableGrid.store.getAt(ci);
                    if (conRecord.data.ID != "") {
                        conIds = conIds + "'" + conRecord.data.ID + "',";
                    }
                }
                conIds = conIds.substring(0, conIds.length - 1);
                if (conIds == "") {
                    me.consumableGrid.store.removeAll();
                    me.conItemAddNew(conItems);

                } else {
                    Ext.Ajax.request({
                        url: webRoot + '/nws/delConsumableAll/' + conIds,
                        method: 'PUT',
                        success: function (response) {
                            me.consumableGrid.store.removeAll();
                            me.conItemAddNew(conItems);

                        },
                        failure: function (response, options) {
                            Ext.MessageBox.alert('提示', '删除材料失败,请求超时或网络故障!');
                        }
                    });
                }
            } else {
                me.conItemAddNew(conItems);
            }
        }
    },
    //添加行后保存
    conItemAdd: function (conItems) {
        var me = this;
        var consumableItems = [];
        for (var i = 0; i < conItems.length; i++) {
            var conitem = {};
            conitem.ID = '';//耗材使用唯一标识
            conitem.SCHEDULING_TYPE = "";//使用班次
            conitem.USE_DATE = "";//使用日期
            conitem.CONSUMABLES_CODE = conItems[i].CODE;//使用耗材代码
            conitem.NAME = conItems[i].NAME;//名称
            conitem.LOCALITY = conItems[i].LOCALITY;//产地
            conitem.SPECIFICATION = conItems[i].SPECIFICATION;//规格
            conitem.USAGE = conItems[i].USAGE;//用途
            conitem.PRICE = conItems[i].PRICE;//单 价
            conitem.RECORD_CODE = conItems[i].RECORD_CODE;//备案
            conitem.totalPrice = conItems[i].totalPrice;//总价
            conitem.AMOUNT = conItems[i].amount;//用量
            conitem.REGISTER_ID = this.patientInfo.REGISTER_ID;//患者登记ID
            conitem.CREATOR_ID = parent.userInfo.userId;//创建者
            conitem.CREATE_TIME = new Date();//创建时间
            consumableItems.push(conitem);
        }
        var store = me.consumableGrid.store;
        store.add(consumableItems);
// 保存
        var conRowCount = me.consumableGrid.store.getCount();
        if (conRowCount > 0) {
            var conIds = "";
            var conRecord = "";
            for (var ci = 0; ci < conRowCount; ci++) {
                conRecord = me.consumableGrid.store.getAt(ci);
                if (conRecord.data.ID == "") {
                    var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', me)[0];
                    var orderType = orderTypeObj.getValue();
                    var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', me)[0];
                    var queryDate = queryDateObj.getValue();
                    var useConParams = {
                        ID: '',//耗材使用唯一标识
                        SCHEDULING_TYPE: orderType,//使用班次
                        USE_DATE: queryDate,//使用日期
                        CONSUMABLES_CODE: conRecord.data.CONSUMABLES_CODE,//使用耗材代码
                        AMOUNT: conRecord.data.AMOUNT,//用量
                        REGISTER_ID: me.patientInfo.REGISTER_ID,//患者登记ID
                        CREATOR_ID: parent.userInfo.userId,//创建者
                        CREATE_TIME: new Date()//创建时间
                    };
                    Ext.Ajax.request({
                        url: parent.webRoot + '/nws/addConsumable',
                        method: 'POST',
                        params: useConParams,
                        success: function (response) {
                            var reqmsg = Ext.decode(response.responseText);
                            conRecord.set('ID', reqmsg.data.conId);
                            // console.log(conRecord);
                            me.elm.hide();
                        },
                        failure: function (response, options) {
                            request.showLanErr('保存');
                        }
                    });
                }
            }
        }

    },
    conItemAddNew: function (conItems) {
        // console.log(conItems);
        var me = this;
        var consumableItems = [];
        var queryButtonObj = Ext.ComponentQuery.query('button[name=queryButton]', this)[0];
        var conAllItems = "";
        var orderTypeObj = Ext.ComponentQuery.query('combo[name=doctor-order-type-bc]', me)[0];
        var orderType = orderTypeObj.getValue();
        var queryDateObj = Ext.ComponentQuery.query('datefield[name=doctor-order-extract-time-bc]', me)[0];
        var queryDate = queryDateObj.getValue();
        for (var i = 0; i < conItems.length; i++) {
            var useConParams = {
                ID: '',//耗材使用唯一标识
                SCHEDULING_TYPE: orderType,//使用班次
                USE_DATE: queryDate,//使用日期
                CONSUMABLES_CODE: conItems[i].CODE,//使用耗材代码,//使用耗材代码
                AMOUNT: conItems[i].amount,//用量
                REGISTER_ID: me.patientInfo.REGISTER_ID,//患者登记ID
                CREATOR_ID: parent.userInfo.userId,//创建者
                CREATE_TIME: new Date()//创建时间
            };
            consumableItems.push(useConParams);
        }
        conAllItems = {"conAllItems": Ext.encode(consumableItems)};
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/addConsumableTemplateItems',
            method: 'POST',
            params: conAllItems,
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                queryButtonObj.fireEvent("click", queryButtonObj);
                me.elm.hide();
            },
            failure: function (response, options) {
                request.showLanErr('保存');
            }
        });
    },

    // 存为新模板窗口
    createNewTemplateWindow: function () {
        var me = this;
        var orderModeObj = Ext.ComponentQuery.query('combo[name=doctor-mode]', me)[0];
        var orderModeObjStore = orderModeObj.getStore();
        if (me.consumableGrid.getStore().getCount() == 0) {
            Ext.MessageBox.alert('提示', '无数据可保存，请录入数据！');
            return;
        }

        var templateWindow = Ext.create('Ext.Window', {
            title: '新模板',
            height: 80,
            width: 200,
            closable: false,
            tools: [
                {
                    type: 'save',
                    tooltip: '确认',
                    handler: function () {
                        var templateName = Ext.util.Format.trim(templateWindow.down('textfield').getValue()),
                            contentRecords = orderModeObjStore.getRange(0, orderModeObjStore.getCount());
                        // 名称为空格符也算是未输入
                        if (templateName.length == 0) {
                            templateWindow.down('textfield').setValue(templateName);
                        }
                        for (var i = 0; i < contentRecords.length; i++) {
                            if (contentRecords[i].data.text === templateName) {
                                Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
                                return;
                            }
                        }
                        if (templateWindow.down('form').getForm().isValid()) {
                            var templateCentent = [];
                            var allItems = me.consumableGrid.getStore().getRange(0, me.consumableGrid.getStore().getCount());
                            for (var i = 0; i < allItems.length; i++) {
                                var templateItem = {};
                                templateItem.code = allItems[i].data.CONSUMABLES_CODE;
                                templateItem.amount = allItems[i].data.AMOUNT;
                                templateCentent.push(templateItem);
                            }
//                            itemTemplateJson = JSON.stringify(allItems);
                            templateCentent = JSON.stringify(templateCentent);
                            //遮罩效果
                            var myMask = new Ext.LoadMask(templateWindow, {
                                msg: "保存中..."
                            });
                            myMask.show();
                            Ext.Ajax.request({
                                url: webRoot + '/nws/addConsumableTemplate',
                                method: 'POST',
                                params: {
                                    NAME: templateName,
                                    CONTENT: templateCentent,
                                    CREATOR_ID: parent.userInfo.userId,
                                    CREATE_TIME: new Date()
                                },
                                success: function (response, opts) {
                                    var reqmsg = Ext.decode(response.responseText);
                                    myMask.hide();
                                    orderModeObjStore.load();
                                    templateWindow.close();
                                    orderModeObj.value = reqmsg.data;
                                },
                                failure: function (response, opts) {
                                    myMask.hide();
                                    Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                },
                {
                    type: 'close',
                    tooltip: '取消',
                    handler: function () {
                        templateWindow.close();
                    }
                }
            ],
            items: [
                {
                    xtype: 'form',
                    layout: 'hbox',
                    padding: 5,
                    items: [
                        {
                            xtype: 'textfield',
                            width: 180,
                            fieldLabel: '模板名称',
                            labelAlign: 'right',
                            labelWidth: 57,
                            allowBlank: false
                        }
                    ]
                }
            ]
        });
        me.parentPanel.nwsToolbar.nwsApp.showModalWindow(templateWindow);
    }
});
//删除模板
function deleteConsumableTemplate(e,tempCode,tempName){
        e.stopPropagation();
    var conPanel = Ext.ComponentQuery.query('panel[title="一次性材料"]')[0];
    var conCombo = Ext.ComponentQuery.query('combo[name="doctor-mode"]',conPanel)[0];
    Ext.MessageBox.confirm("请确认", "真的要删除【" + tempName + "】模板", function (button, text) {
        if (button == 'yes') {
            conPanel.mask();
            Ext.Ajax.request({
                url: webRoot + '/nws/delConsumableTemp/' + tempCode,
                method: 'PUT',
                success: function (response) {
                    conCombo.store.load();
                    conPanel.unmask();
                    conCombo.setValue('');
                },
                failure: function (response, options) {
                    conPanel.unmask();
                    Ext.MessageBox.alert('提示', '删除模板失败,请求超时或网络故障!');
                }
            });

        }
    });

};
//编辑模板
function editConsumableTemplate(e,tempCode,tempName){
    e.stopPropagation();
    var moduleId = this.getCurrentModule();
    var currentModule = Ext.getCmp(moduleId);
    var conPanel = Ext.ComponentQuery.query('panel[title="一次性材料"]',currentModule)[0];
    var conCombo = Ext.ComponentQuery.query('combo[name="doctor-mode"]',conPanel)[0];
    conCombo.setValue('');
    conCombo.collapse(true);
    var conTempWin = Ext.create("com.dfsoft.icu.nws.consumables.ConsumableTemplateWindow",{
        operType:"edit",
        parentPanel:conPanel,
        tempCode:tempCode,
        tempName:tempName
    });
    conPanel.parentPanel.nwsToolbar.nwsApp.showModalWindow(conTempWin);
};
//新增模板
function addConsumableTemplate(e,pobj,tempCode,tempName){
    e.stopPropagation();
   var moduleId = this.getCurrentModule();
    var currentModule = Ext.getCmp(moduleId);

    var conPanel = Ext.ComponentQuery.query('panel[title="一次性材料"]',currentModule)[0];
    var conCombo = Ext.ComponentQuery.query('combo[name="doctor-mode"]',conPanel)[0];
    conCombo.setValue('');
    conCombo.collapse(true);
    var conTempWin = Ext.create("com.dfsoft.icu.nws.consumables.ConsumableTemplateWindow",{
        operType:"add",
        parentPanel:conPanel
    });
    conPanel.parentPanel.nwsToolbar.nwsApp.showModalWindow(conTempWin);
};
// 获取当前打开模块
function getCurrentModule(){
    var modules = ['nws','dws','cms','sys','dtm','sta','dmi'];
    var openModules = [];
    for(var i = 0;i<modules.length;i++){
        if(Ext.getCmp(modules[i]) != undefined ){
            openModules.push(modules[i]);
        }
    }
    return Ext.getCmp(openModules[0]).zIndexManager.front.id;
};