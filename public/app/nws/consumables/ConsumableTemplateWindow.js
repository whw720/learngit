/**
 * 一次性材料录入
 *
 * @author zag
 * @date 2014-9-10
 */
Ext.define('com.dfsoft.icu.nws.consumables.ConsumableTemplateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.consumabletemplatewindow',
    requires: [
        'com.dfsoft.icu.nws.consumables.ConsumableTemplateGrid',
        'com.dfsoft.icu.nws.consumables.ConsumableStore',
        'com.dfsoft.icu.nws.consumables.BatchAddConsumableWindow'],
    initComponent: function () {
        var me = this;
        Ext.util.CSS.swapStyleSheet('consumables.css', webRoot + '/app/nws/consumables/css/consumables.css');
        me.consumableTemplateGrid = new com.dfsoft.icu.nws.consumables.ConsumableTemplateGrid({
            templateCode: me.tempCode
        });
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        Ext.apply(this, {
            title: '一次性材料模板',
            width: '780px',
            height: '480px',
            closable: true,
            id: me.mod + 'consumableTemplateWin',
            layout: 'fit',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    margin: '-1 -1 0 -1',
                    border: true,
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'templateName',
                            fieldLabel: '模板名称',
                            value: "",
                            width: 240,
                            editable: false,
                            labelWidth: 60,
                            maxLength: 200,
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'textfield',
                            name: 'templateId',
                            hidden:true
                        },
                        {
                            xtype: 'button',
                            tooltip: '应用模板',
                            iconCls: 'shift-submit',
                            hidden:true,
                            name:'appTemplate',
                            handler: function (btn) {
                                var records = me.consumableTemplateGrid.getSelectionModel().getSelection();
                                if (records.length <= 0) {
                                    Ext.Msg.alert("提示", "当前模板没有数据，不可用！");
                                    return;
                                }
                                var templateId = Ext.ComponentQuery.query('textfield[name=templateId]',me)[0];
                                templateId = templateId.getValue();
                                var parentTemplateCombo = Ext.ComponentQuery.query('combo[name=doctor-mode]',me.parentPanel)[0];
                                parentTemplateCombo.getStore().load();
                                parentTemplateCombo.setValue(templateId);
                                if (me.parentPanel.consumableGrid.store.getCount() > 0) {
                                    Ext.MessageBox.confirm("请确认", "应用模板后清空原有记录，是否应用模板？", function (button, text) {
                                        if (button == 'yes') {
                                            me.parentPanel.elm.show();
                                            Ext.Ajax.request({
                                                url: webRoot + '/nws/getConsumableTemplateItems/' + templateId,
                                                method: 'get',
                                                success: function (response) {
                                                    var respText = Ext.decode(response.responseText).data;
                                                    me.parentPanel.consumableAddRow(respText, 2);
                                                    me.close();
                                                },
                                                failure: function (response, options) {
                                                    me.parentPanel.elm.hide();
                                                    Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    Ext.Ajax.request({
                                        url: webRoot + '/nws/getConsumableTemplateItems/' + templateId,
                                        method: 'get',
                                        success: function (response) {
                                            var respText = Ext.decode(response.responseText).data;
                                            me.parentPanel.consumableAddRow(respText, 2);
                                            me.close();
                                        },
                                        failure: function (response, options) {
                                            me.parentPanel.elm.hide();
                                            Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                                        }
                                    });

                                }

                            }},
                        '->',
                        {
                            xtype: 'combo',
                            name: 'template-mode',
                            hidden:true,
                            fieldLabel: '模板',
                            width: 220,
                            queryMode: 'local',
                            editable: false,
                            // allowBlank : false,
                            blankText: '请输入类型',
                            valueField: 'value',
                            displayField: 'text',
                            store: new Ext.data.Store({
                                fields: ['value', 'text'],
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
                            listConfig: {
                                loadMask: false,
                                width: 250
                            },
                            tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">' +
                                    '<tpl if="text != \'添加新模板\'">' +
                                    '<div class="x-boundlist-item" style="border-top-style: dotted;border-top-color:#B5B8C8 ;border-top-width: thin;" onclick="">' +
                                    '<span>{text}</span>' +
                                    '<span align="right" style="padding: 0px 5px 0px 0px;">' +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</tpl>' +
                                    '</tpl>'),
                            listeners: {
                                select: function (combo, records, eOpts) {
                                    Ext.Msg.show({
                                        title: "提示",
                                        msg: "修改【"+ records[0].data.text +"】模板？",
                                        //buttons:[{ text:'YES' }],
                                        buttonText:{yes:'是', no:'否，在此基础上建立新模板'},
                                        icon: Ext.Msg.QUESTION,
                                        width:300,
                                        fn: function(id, msg){
                                            if(id == "no"){// 新模板
                                                var templateNameObj = Ext.ComponentQuery.query('textfield[name=templateName]',me)[0];
                                                var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', me)[0];
                                                var templateName = templateNameObj.getValue();
                                                var templateId = templateCombo.getValue();
                                                if(!templateNameObj.isValid()){
                                                    return false;
                                                };
                                                if(templateName.replace(/[ ]/g,"") == ""){
                                                    Ext.MessageBox.alert('提示', '请输入模板名称！');
                                                    templateCombo.setValue("");
                                                    return;
                                                }
                                                Ext.Ajax.request({
                                                    url: webRoot + '/nws/copyConsumableTemplate/'+templateId,
                                                    method: 'PUT',
                                                    params: {
                                                        NAME: templateName,
                                                        CREATOR_ID: parent.userInfo.userId,
                                                        CREATE_TIME: new Date()
                                                    },
                                                    success: function (response, opts) {
                                                        var reqmsg = Ext.decode(response.responseText);
                                                        console.log(reqmsg.data.templateId);
                                                        templateCombo.getStore().load();
                                                        templateCombo.setValue(reqmsg.data.templateId);
                                                        me.queryTemplateDate(reqmsg.data.templateId);
                                                        me.operType = "edit";




                                                        me.elm.hide();
                                                    },
                                                    failure: function (response, opts) {
                                                        me.elm.hide();
                                                        Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                                                    }
                                                });
                                            }else{//修改模板




                                            }
                                        }
                                    });

                                }
                            }

                        },
                        //'-',
                        {
                            xtype: 'button',
                            tooltip: '保存',
                            iconCls: 'save',
                            //hidden:true,
                            handler: function(){
                                me.saveTemplate();
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'save-as',
                            name:'conSaveAs',
                            tooltip: '模板另存为',
                            hidden:true,
                            handler: function (btn) {
                                btn.ownerCt.ownerCt.createNewTemplateWindow();
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '添加',
                            iconCls: 'nws-order-add',
                            name:'addConTemplate',
                            handler: function (btn) {
                                var templateNameObj = Ext.ComponentQuery.query('textfield[name=templateName]',me)[0];
                                var templateName = templateNameObj.getValue();
                                var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]',me)[0];
                                var  contentRecords = templateCombo.getStore().getRange(0, templateCombo.getStore().getCount());

//                                if(templateName.replace(/[ ]/g,"") == ""){
//                                    Ext.MessageBox.alert('提示', '请输入模板名称！');
//                                    return;
//                                }
//                                if(me.operType == "add"){
//                                    for (var i = 0; i < contentRecords.length; i++) {
//                                        if (contentRecords[i].data.text === templateName) {
//                                            Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
//                                            return;
//                                        }
//                                    }
//                                };
                                // 下拉选择、删除、保存、快速添加 不可用。
                                templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', me)[0];
                                var saveAsBtn = Ext.ComponentQuery.query('button[name=conSaveAs]', me)[0];
                                var delBtn = Ext.ComponentQuery.query('button[name=delCon]', me)[0];
                                 templateName  = Ext.ComponentQuery.query('textfield[name=templateName]', me)[0];
                                var appTemplate = Ext.ComponentQuery.query('button[name=appTemplate]', me)[0];
                                templateCombo.disable();
                                saveAsBtn.disable();
                                delBtn.disable();
                                btn.disable();
                                templateName.disable();
                                appTemplate.disable();

                              me.consumableTemplateGrid.rowEditing.cancelEdit();
                                var consumableModel = Ext.create('com.dfsoft.icu.nws.consumables.ConsumableTemplateDetailModel', {
                                    ID: '',//耗材使用唯一标识
                                    SCHEDULING_TYPE: "",//使用班次
                                    USE_DATE: "",//使用日期
                                    CONSUMABLES_CODE: "",//使用耗材代码
                                    NAME: "",//名称
                                    LOCALITY: "",//产地
                                    SPECIFICATION: "",//规格
                                    USAGE: "",//用途
                                    PRICE: "",//单 价
                                    RECORD_CODE: "",//备案
                                    totalPrice: "",//总价
                                    AMOUNT: ""//用量
                                });
                                me.consumableTemplateGrid.store.insert(0, consumableModel);
                                me.consumableTemplateGrid.rowEditing.startEdit(0,0);
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '删除',
                            iconCls: 'delete',
                            name: 'delCon',
                            handler: function (btn) {
                                var records = me.consumableTemplateGrid.getSelectionModel().getSelection();
                                if (records.length <= 0) {
                                    Ext.Msg.alert("提示", "请选择需要删除的记录！");
                                    return;
                                }
                                Ext.MessageBox.confirm("请确认", "是否真的要删除选定的内容", function (button, text) {
                                    if (button == 'yes'){
                                        me.consumableTemplateGrid.store.remove(records[0]);
                                        //me.saveTemplate();
                                    }
                                });
                            }
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
                    items: [
                        me.consumableTemplateGrid
                    ]
                }
            ]
        });
        this.callParent(arguments);
        if (me.tempCode != undefined) {
            me.queryTemplateDate(me.tempCode);
            var templateName = Ext.ComponentQuery.query('textfield[name=templateName]', me)[0];
            var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]', me)[0];
            var templateId = Ext.ComponentQuery.query('textfield[name=templateId]',me)[0];
             templateName.setValue(me.tempName);
             templateCombo.setValue(me.tempCode);
            templateId.setValue(me.tempCode);
//            templateName.disable();
//            templateCombo.disable();
        }
    },
    // 跟据模板code查询模板详细
    queryTemplateDate: function (tempCode){
        var me = this;
        var templateDetailStore = me.consumableTemplateGrid.getStore();
        templateDetailStore.templateCode = tempCode;
        templateDetailStore.load();
    },
    //保存模板
    saveTemplate:function(){
        var me = this;
        //遮罩效果
        var myMask = new Ext.LoadMask(me, {
            msg: "保存中..."
        });
        var templateNameObj = Ext.ComponentQuery.query('textfield[name=templateName]',me)[0];
        //var templateCombo = Ext.ComponentQuery.query('combo[name=template-mode]',me)[0];
        var templateCombo =  Ext.ComponentQuery.query('combo[name=doctor-mode]',me.parentPanel)[0];
        var templateId = Ext.ComponentQuery.query('textfield[name=templateId]',me)[0];
        var templateCentent = [];
        var templateName = templateNameObj.getValue();
        if(!templateNameObj.isValid()){
            return false;
        };
        if(templateName.replace(/[ ]/g,"") == ""){
            Ext.MessageBox.alert('提示', '请输入模板名称！');
            return;
        }
        var  contentRecords = templateCombo.getStore().getRange(0, templateCombo.getStore().getCount());
        if(me.consumableTemplateGrid.getStore().getCount() < 1){
            Ext.MessageBox.alert('提示', '模板内容不能为空！');
            return;
        }
        var allItems = me.consumableTemplateGrid.getStore().getRange(0, me.consumableTemplateGrid.getStore().getCount());
       // console.log(allItems.length);
        for (var i = 0; i < allItems.length; i++) {
            var templateItem = {};
            templateItem.code = allItems[i].data.CODE;
            templateItem.amount = allItems[i].data.AMOUNT;
            templateCentent.push(templateItem);
        }
       // console.log(templateCentent);
        templateCentent = JSON.stringify(templateCentent);

      if(me.operType == "add"){//添加
          for (var i = 0; i < contentRecords.length; i++) {
              if (contentRecords[i].data.text === templateName) {
                  Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
                  return;
              }
          }
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
                      templateCombo.getStore().load();
                      templateCombo.setValue(reqmsg.data);
                      templateId.setValue(reqmsg.data);
                      me.operType = "edit";
                      myMask.hide();
                      me.close();
                  },
                  failure: function (response, opts) {
                      myMask.hide();
                      Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                  }
              });
      }else{//修改
          templateId = templateId.getValue();
          for (var i = 0; i < contentRecords.length; i++) {
        	  if(templateName!=me.tempName){
        		  if (contentRecords[i].data.text === templateName) {
                      Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
                      return;
                  }
        	  }
              
          }
          myMask.show();
          Ext.Ajax.request({
              url: webRoot + '/nws/updateConsumableTemplate/'+templateId,
              method: 'PUT',
              params: {
                  NAME: templateName,
                  CONTENT: templateCentent,
                  CREATOR_ID: parent.userInfo.userId,
                  CREATE_TIME: new Date()
              },
              success: function (response, opts) {
                  var reqmsg = Ext.decode(response.responseText);
                  templateCombo.getStore().load();
                  templateCombo.setValue(templateId);
                  myMask.hide();
                  me.close();
              },
              failure: function (response, opts) {
                  myMask.hide();
                  Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
              }
          });
      }
    },
    // 存为新模板窗口
    createNewTemplateWindow: function () {
        var me = this;
        if (me.consumableTemplateGrid.getStore().getCount() == 0) {
            Ext.MessageBox.alert('提示', '无数据可另存，请录入数据！');
            return;
        }
        var templateWindow = Ext.create('Ext.Window', {
            title: '新模板',
            height: 80,
            width: 200,
            modal:true,
            closable: false,
            tools: [
                {
                    type: 'save',
                    tooltip: '确认',
                    handler: function () {
                        var templateNameObj = Ext.ComponentQuery.query('textfield[name=templateName]',me)[0];
                       var templateName = Ext.util.Format.trim(templateWindow.down('textfield').getValue());
                        var templateId = Ext.ComponentQuery.query('textfield[name=templateId]',me)[0];
                        templateId = templateId.getValue();
                        var parentTemplateCombo = Ext.ComponentQuery.query('combo[name=doctor-mode]',me.parentPanel)[0];
                        parentTemplateCombo.getStore();
                       var contentRecords = parentTemplateCombo.getStore().getRange(0, parentTemplateCombo.getStore().getCount());
                        if(templateWindow.down('form').isValid()){
                            for (var i = 0; i < contentRecords.length; i++) {
                            if (contentRecords[i].data.text === templateName) {
                                Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
                                return;
                            }
                        }
                            Ext.Ajax.request({
                                url: webRoot + '/nws/copyConsumableTemplate/'+templateId,
                                method: 'PUT',
                                params: {
                                    NAME: templateName,
                                    CREATOR_ID: parent.userInfo.userId,
                                    CREATE_TIME: new Date()
                                },
                                success: function (response, opts) {
                                    var reqmsg = Ext.decode(response.responseText);
                                    parentTemplateCombo.getStore().load();
                                    parentTemplateCombo.setValue(reqmsg.data.templateId);
                                    me.queryTemplateDate(reqmsg.data.templateId);

                                    templateNameObj.setValue(templateName);
                                    me.operType = "edit";
                                    me.elm.hide();
                                    templateWindow.close();
                                },
                                failure: function (response, opts) {
                                    me.elm.hide();
                                    Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                                }
                            });

                        }else{
                            Ext.MessageBox.alert('提示', '请录入模板名称!');
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
        templateWindow.show();
    }
});
