/**
 * 功能说明:  监护项目 treegrid
 * @author: 杨祖文
 */
var templatestore=Ext.create('Ext.data.Store',{
        	fields: ['ID', 'NAME', 'CONTENT','NAMEs'],
            proxy: {
                type: 'ajax',
                method: 'GET',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
        });
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareProjectTreeGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.CareProjectTreeStore'
    ],
    initComponent: function() {
        var me = this;
        var careProjectTreeStore = new com.dfsoft.icu.nws.bedmanagement.CareProjectTreeStore();
        var resourceData = userInfo.resource;
        var flag=true;
        var template={
                xtype: 'combo',
                name:'templatename',
                fieldLabel: '模板',
                labelWidth: 32,
                width: 200,
                queryMode: 'local',
                valueField: 'ID',
                displayField: 'NAME',
                editable: false,
                //allowBlank: false,
                store:templatestore,
                listConfig:{
                    loadMask: false,
                    width: 250
                },
                tpl:Ext.create('Ext.XTemplate',
                        '<tpl for=".">' +
                        '<tpl if="NAME != \'添加新模板\'">' +
                        '<div class="x-boundlist-item" style="border-top-style: dotted;border-top-color:#B5B8C8 ;border-top-width: thin;" onclick="">' +
                        '<span title={NAME}>{NAMEs}</span>' +
                        '<span align="right" style="padding: 0px 5px 0px 0px;">' +
                        '<a href="javascript:;" onclick="Ext.getCmp(\'nws-care-project-treegrid\').deleteTemplate(event,\'{ID}\', \'{NAME}\')"><span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 6px;"><img src="/app/sys/desktop/images/delete.png" /></span></a>' +
                        '</span>' +
                        '</div>' +
                        '<tpl else>' +
                        '<div class="x-boundlist-item" onclick="Ext.getCmp(\'nws-care-project-treegrid\').addTemplate();event.stopPropagation();" style="border-top-style: dotted;border-top-color:#B5B8C8;border-top-width: thin; margin-top: -2px;" >' +
                        '<span>{NAME}</span>' +
                        '<span align="right" style="padding: 0px 5px 0px 0px;">' +
                        '<span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 6px;"><img src="/app/sys/desktop/images/add.png" /></span>' +
                        '</span>' +
                        '</div>' +
                        '</tpl>' +
                        '</tpl>'
                ),
                listeners: {
                    select: function(combo, records, eOpts) {

                    },
                    afterrender: function(_this, eOpts) {
                    	Ext.Ajax.request({
                    		url: webRoot + '/nws/icu_beds/getTemplateId/' + me.parent.BED_ID,
                            method: 'PUT',
                            async: false,
                            success: function(response) {
                                var respText = Ext.decode(response.responseText).data;
                                _this.setValue(respText[0].TEMPLATE_ID);
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                            }
                        });
                	}
                }
            };
        for (var i = 0; i < resourceData.length; i++) {
            if (resourceData[i].id == '22b5e2b078fd11e39fd9cb7044fb7aaa') {
            	flag=false;
            	templatestore.proxy.url=webRoot + '/nws/icu_bed_item_template';
                templatestore.load();
                break;
            }
        }
        if(flag){
        	templatestore.proxy.url=webRoot + '/nws/icu_bed_item_template/getTemplate';
            templatestore.reload();
            template={
                    xtype: 'combo',
                    name:'templatename',
                    fieldLabel: '模板',
                    labelWidth: 32,
                    width: 200,
                    queryMode: 'local',
                    valueField: 'ID',
                    displayField: 'NAME',
                    editable: false,
                    //allowBlank: false,
                    store:templatestore,
                    listConfig:{
                        loadMask: false,
                        width: 250
                    },
                    listeners: {
                        select: function(combo, records, eOpts) {

                        },
                        afterrender: function(_this, eOpts) {
                        	Ext.Ajax.request({
                        		url: webRoot + '/nws/icu_beds/getTemplateId/' + me.parent.BED_ID,
                                method: 'PUT',
                                async: false,
                                success: function(response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    _this.setValue(respText[0].TEMPLATE_ID);
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                                }
                            });
                    	}
                    }
                };
        }
        var splitbutton=Ext.create('Ext.button.Split', {
            renderTo: Ext.getBody(),
            text: '应用模板',
            disabled:flag,
            menu: new Ext.menu.Menu({
                items: [
                    {text: '应用该床位',tooltip: '应用该床位',iconCls: 'template-submit',scope: me, handler: me.applyTemplate},
                    {text: '应用全部床位',tooltip: '应用全部床位',iconCls: 'template-submit',scope: me, handler: me.applyAllTemplate}
                ]
            })
        });
        var saveas={
            xtype: 'button',
            tooltip: '另存为新模板',
            disabled:flag,
            iconCls: 'save-as',
            scope: me,
            handler: me.createNewTemplateWindow
        };
        var addnew={
            xtype: 'button',
            tooltip: '新增',
            disabled:flag,
            iconCls: 'add',
            handler: function() {
                createCareProjectMaintainWindow(false);
            }
        };
        Ext.apply(me, {
            id: 'nws-care-project-treegrid',
            title: '监护项目',
            border: false,
            viewConfig: {
                toggleOnDblClick: false,
                plugins: {
                    ptype: 'treeviewdragdrop'
                },
                listeners: {

                    //拖拽之前判断    
                    beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                        //节点拖动之前的父节点
                        beforeNode = data.records[0].parentNode;
                        if (beforeNode.data.ID.length == 0) beforeNode.data.ID = 'root';
                        //dropHandlers.cancelDrop();
                        var currDropNode = data.records[0];
                        //节点拖动之后的父节点
                        var aimNode = currDropNode.parentNode;
//                        if(currDropNode.data.PRESET_CODE=='bt64f80078fd11e39fd9cb7044fca582'){
//                        	Ext.Msg.alert("拖动节点", "生命体征不能拖动!！");
//                        	dropHandlers.cancelDrop();
//                        }
                    },
                    drop: function(node, data, dropRec, dropPosition) {
                        //当前拖动节点
                        var currDropNode = data.records[0],
                            //当前拖动节点ID
                            currDropNodeId = currDropNode.data.ID;
                        //节点拖动之后的父节点
                        var aimNode = currDropNode.parentNode,
                            aimNodeId = aimNode.data.ID;
                        if (aimNodeId.length == 0) aimNodeId = 'root';
                        //拖至某节点下的节点路径
                        if (aimNode.data.leaf) {
                            aimNode.removeChild(currDropNode);
                            beforeNode.appendChild(currDropNode);
                            Ext.Msg.alert("拖动节点", "只能拖动到一级节点下！");
                            return;
                        }
                        else if (currDropNode.data.PRESET_CODE=='bt64f80078fd11e39fd9cb7044fca582') {
                        	if(aimNode.data.NAME!=''){
                        		aimNode.removeChild(currDropNode);
                                beforeNode.appendChild(currDropNode);
                            	Ext.Msg.alert("拖动节点", "生命体征不能拖动至其他节点下！");
                        	}
                        }
                        else if (currDropNode.parentNode.data.PRESET_CODE=='bt64f80078fd11e39fd9cb7044fca582') {
                        	if(data.records[0].childNodes.length>0){
                        		aimNode.removeChild(currDropNode);
                                beforeNode.appendChild(currDropNode);
                            	Ext.Msg.alert("拖动节点", "生命体征下不能有多级！");
                        	}
                        }
                        else {
                            //如果拖动的父节点不变 则只更新其排序号
                            if (beforeNode.data.ID != aimNodeId) {
                            	if(currDropNodeId!=null&&currDropNodeId!=''){
                            		Ext.Ajax.request({
                                        url: webRoot + '/dic/icu_bed_item/Node/' + currDropNodeId,
                                        params: {
                                            ID: currDropNodeId,
                                            PARENT_ID: aimNodeId
                                        },
                                        method: 'PUT',
                                        scope: this,
                                        success: function(response) {

                                        },
                                        failure: function(response, options) {
                                            Ext.MessageBox.alert('提示', '拖动失败,请求超时或网络故障!');
                                        }
                                    });
                            	}
                            }

                            //拖动后目标节点子节点
                            var afterDropAimChildren = aimNode.childNodes;
                            var orderArray = [];
                            for (var i = 0; i < afterDropAimChildren.length; i++) {
                                orderArray[orderArray.length] = afterDropAimChildren[i].data.ID;
                            }
                            if (orderArray.length > 0) {
                                Ext.Ajax.request({
                                    url: webRoot + '/dic/icu_bed_itemSort',
                                    params: {
                                        orderArray: orderArray
                                    },
                                    method: 'PUT',
                                    scope: this,
                                    success: function(response) {

                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('提示', '更新排序号失败,请求超时或网络故障!');
                                    }
                                });
                            }
                        }
                    }
                }
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->',template, splitbutton,'-',saveas,addnew]
            }],
            store: careProjectTreeStore,
            border: true,
            useArrows: true,
            rootVisible: false,
            columnLines: true,
            rowLines: true,
            selType: 'rowmodel',
            columns: [{
                text: '操作',
                flex: 1,
                sortable: false,
                renderer: me.formatOperaValue
            }, {
                xtype: 'treecolumn',
                text: '监护项目',
                flex: 5,
                sortable: false,
                dataIndex: 'NAME',
                renderer: me.formatNameValue
            }, {
                text: '别名',
                flex: 1.5,
                sortable: false,
                dataIndex: 'ALIAS',
                align: 'left'
            }, {
                text: '单位',
                flex: 1,
                dataIndex: 'UNIT_CODE',
                sortable: false
            }, {
                text: '显示宽度',
                flex: 1,
                dataIndex: 'WIDTH',
                sortable: false,
                editor: {
                    xtype: 'numberfield',
                    hideTrigger: false,
                    minValue: 1,
                    negativeText: '最小值为1',
                    maxValue: 99999,
                    value:60,
					maxValueText: '最大值为99999',
                }
            }],
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })]
        });
        me.on('itemexpand', me.onItemexpand, me);
        me.callParent();
    },
    deleteTemplate : function(e,tempCode,tempName){
    	var me=this;
        e.stopPropagation();
	    Ext.MessageBox.confirm("请确认", "真的要删除【" + tempName + "】模板", function (button, text) {
	        if (button == 'yes') {
	            Ext.Ajax.request({
	                url: webRoot + '/nws/icu_bed_item_template/deletetemplate/' + tempCode,
	                method: 'PUT',
	                success: function (response) {
                        var combo = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1];
                        if (combo.getValue()==tempCode) {
                            combo.setValue(null);
                        }
	            	    me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getStore().load();
	                },
	                failure: function (response, options) {
	                    Ext.MessageBox.alert('提示', '删除模板失败,请求超时或网络故障!');
	                }
	            });
	
	        }
	    });
    },
  //新增模板
    addTemplate:function(){
    	var me=this;
    	var conPanel = Ext.ComponentQuery.query('panel[title="监护项目"]')[0];
        var conCombo = Ext.ComponentQuery.query('combo[name="templatename"]',conPanel)[0];
        var TEMPLATE_ID='';//me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.ID;
        //conCombo.setValue(TEMPLATE_ID);
        conCombo.collapse(true);
        this.addTemplateWindow();
    },
    onItemexpand: function(_this, eOpts) {
        this.getStore().proxy.url = '';
    },

    formatNameValue: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            currValue = '',
            parentName = record.parentNode.data.PRESET_CODE;
        // 是否显示到监护中心
        if (record.data.DISPLAY_TO_CENTRAL == 1) {
            currValue += '<img src="/app/nws/bedmanagement/images/display-center.png" title="显示到监护中心" style="margin-bottom: -3px; margin-right: -5px;" align="right" />';
        }
        // 是否显示到护理记录
        if (record.data.DISPLAY_TO_RECORDS == 1) {
            if (currValue.length == 0) currValue += '<img src="/app/nws/bedmanagement/images/display-records.png" title="显示到护理记录" style="margin-bottom: -3px; margin-right: -5px;" align="right" />';
            else currValue += '<img src="/app/nws/bedmanagement/images/display-records.png" title="显示到护理记录" style="margin-bottom: -3px; margin-right: 5px;" align="right" />';
        }
        // 预置项：生命体征，出量，入量  入量.名称 入量.剂量 入量.途径
        if (record.data.PRESET_CODE == '4db35a85c37611e39dd9e41f1364eb96'||record.data.PRESET_CODE == '1c4267adc60e11e395078c89a5769562'||record.data.PRESET_CODE == 'bt64f80078fd11e39fd9cb7044fca582' || record.data.PRESET_CODE == 'a452f80078fd11e39fd9cb7044fhu458' || record.data.PRESET_CODE == 'cxe4f80078fd11e39fd9cb704412gt89' || record.data.PRESET_CODE == '24550929c37611e39dd9e41f1364eb96' || record.data.PRESET_CODE == '337d27b9c37611e39dd9e41f1364eb96' || record.data.PRESET_CODE == '4223357dc37611e39dd9e41f1364eb96'|| record.data.PRESET_CODE == '278366bfc60e11e395078c89a5769562') {
            if (currValue.length == 0) currValue += '<img src="/app/nws/bedmanagement/images/pre-project.png" title="预置项目" style="margin-bottom: -3px; margin-right: -5px;" align="right" />';
            else currValue += '<img src="/app/nws/bedmanagement/images/pre-project.png" title="预置项目" style="margin-bottom: -3px; margin-right: 5px;" align="right" />';
        }
     // 预置项：生命体征，出量，入量  入量.名称 入量.剂量 入量.途径
//        if (record.data.NAME == '出量.名称'||record.data.NAME == '入量.名称'||record.data.NAME == '出量.量'||record.data.NAME == '入量.量'||record.data.NAME == '入量.途径'||record.data.NAME == '护理内容'||record.data.NAME == '出量'||record.data.NAME == '生命体征'||record.data.NAME == '入量') {
//            if (currValue.length == 0) currValue += '<img src="/app/nws/bedmanagement/images/pre-project.png" title="预置项目" style="margin-bottom: -3px; margin-right: -5px;" align="right" />';
//            else currValue += '<img src="/app/nws/bedmanagement/images/pre-project.png" title="预置项目" style="margin-bottom: -3px; margin-right: 5px;" align="right" />';
//        }
        //自动获取的生命体征
        if (record.data.DATASOURCE_CODE == '7992ce90fdad11e2b0ab11ca6e98dc94' && parentName == 'bt64f80078fd11e39fd9cb7044fca582') {
            if (currValue.length == 0) currValue += '<img src="/app/nws/bedmanagement/images/auto-vital-signs.png" title="自动获取的生命体征" style="margin-bottom: -3px; margin-right: -5px;" align="right" />';
            else currValue += '<img src="/app/nws/bedmanagement/images/auto-vital-signs.png" title="自动获取的生命体征" style="margin-bottom: -3px; margin-right: 5px;" align="right" />';
        }
        return '<a class="bed-item-name" href="javascript:createCareProjectMaintainWindow(\'update\');">' + record.data.NAME + '</a>' + currValue;
    },

    // 操作列
    formatOperaValue: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            parentName = record.parentNode.raw.PRESET_CODE,
            currValue = '<a href="javascript:deleteCareItem();"><img src="/app/nws/bedmanagement/images/delete.png" title="删除" style="margin-bottom: -3px; margin-right: 5px;" align="right" /></a>';
        // 父节点为生命体征预置项
        if (parentName == 'bt64f80078fd11e39fd9cb7044fca582') {
            return currValue;
        } else {
            return currValue + '<a href="javascript:createCareProjectMaintainWindow(true);"><img src="/app/nws/bedmanagement/images/add.png" title="添加" style="margin-bottom: -3px; margin-right: 5px;" align="right" /></a>';
        }
    },
 // 另存为新模板窗口
    addTemplateWindow: function() {
        var me = this;
        var TemplateID="";
        var selectTemplateID="";
        var TemplateName="";
        var templateWindow = Ext.create('Ext.Window', {
            title: '新模板',
            height: 80,
            width: 200,
            closable: false,
            tools: [{
                type: 'save',
                tooltip: '确认',
                handler: function() {
                    var templateName = Ext.util.Format.trim(templateWindow.down('textfield').getValue()),
                        contentStore = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getStore(),
                        contentRecords = contentStore.getRange(0, contentStore.getCount());
                    // 名称为空格符也算是未输入
                    if (templateName.length == 0) {
                        templateWindow.down('textfield').setValue(templateName);
                    }
                    for (var i = 0; i < contentRecords.length; i++) {
	   	                 if (contentRecords[i].data.NAME === templateName) {
	   	                     Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
	   	                     return;
	   	                 }
                    }
                    if (templateWindow.down('form').getForm().isValid()) {
                        var allItems = me.getItemTemplateJson(me.getStore().getRootNode()),
                            itemTemplateJson = JSON.stringify(allItems);
                        //遮罩效果
                        var myMask = new Ext.LoadMask(templateWindow, {
                            msg: "保存中..."
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url: webRoot + '/nws/icu_bed_item_template',
                            method: 'POST',
                            params: {
                                NAME: templateName,
                                CONTENT: itemTemplateJson,
                                CREATOR_ID: userInfo.userId,
                                CREATE_TIME: new Date(),
                                TemplateID:TemplateID
                            },
                            success: function(response, opts) {
                            	me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getStore().load();
                            	myMask.hide();
                                templateWindow.close();
                            },
                            failure: function(response, opts) {
                                myMask.hide();
                                Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }, {
                type: 'close',
                tooltip: '取消',
                handler: function() {
                    templateWindow.close();
                }
            }],
            items: [{
                xtype: 'form',
                layout: 'hbox',
                padding: 5,
                items: [
					{
					    xtype: 'textfield',
					    name: 'TEMPLATENAME',
					    fieldLabel: '模板',
					    labelWidth: 32,
					    allowBlank: false,
					    maxLength: 100,
					    labelAlign: 'left',
						maxLengthText: '最多可输入100个字符',
					    width: 180
					}
//                 {
//                    xtype: 'combo',
//                    fieldLabel: '模板',
//                    labelWidth: 32,
//                    width: 160,
//                    valueField: 'CONTENT',
//                    displayField: 'NAME',
//                    editable: true,
//                    allowBlank: false,
//                    store: new Ext.data.Store({
//                        fields: ['ID', 'NAME', 'CONTENT'],
//                        proxy: {
//                            type: 'ajax',
//                            url: webRoot + '/nws/icu_bed_item_template/getTemplate',
//                            method: 'GET',
//                            reader: {
//                                type: 'json',
//                                root: 'data'
//                            }
//                        },
//                        autoLoad: true
//                    }),
//                    listeners: {
//                        select: function(combo, records, eOpts) {
//                			TemplateID=records[0].data.ID;
//                			selectTemplateID=records[0].data.ID;
//                			TemplateName=records[0].data.NAME;
//                        },
//                        change:function(_this, newValue, oldValue, eOpts ){
//                        	if(TemplateName!=newValue){
//                        		TemplateID="";
//                        	}else{
//                        		TemplateID=selectTemplateID;
//                        	}
//                      }
//                    }
//                }
                 
                 ]
            }]
        });
        me.parent.showModalWindow(templateWindow);
        //templateWindow.show();
    },
    // 另存为新模板窗口
    createNewTemplateWindow: function() {
        var me = this;
        var TemplateID="";
        var selectTemplateID="";
        var TemplateName="";
        var templateWindow = Ext.create('Ext.Window', {
            title: '新模板',
            height: 80,
            width: 200,
            closable: false,
            tools: [{
                type: 'save',
                tooltip: '确认',
                handler: function() {
                    var templateName = templateWindow.down('textfield').getValue()==null ? "" : Ext.util.Format.trim(templateWindow.down('textfield').getValue()),
                        contentStore = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getStore(),
                        contentRecords = contentStore.getRange(0, contentStore.getCount());
                    // 名称为空格符也算是未输入
                    if (templateName.length == 0) {
                        templateWindow.down('textfield').setValue(templateName);
                    }
                    for (var i = 0; i < contentRecords.length; i++) {
	   	                 if (contentRecords[i].data.NAME === templateName) {
	   	                     Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
	   	                     return;
	   	                 }
                   }
                    if (templateWindow.down('form').getForm().isValid()) {
                        var allItems = me.getItemTemplateJson(me.getStore().getRootNode()),
                            itemTemplateJson = JSON.stringify(allItems);
                        //遮罩效果
                        var myMask = new Ext.LoadMask(templateWindow, {
                            msg: "保存中..."
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url: webRoot + '/nws/icu_bed_item_template',
                            method: 'POST',
                            params: {
                                NAME: templateName,
                                CONTENT: itemTemplateJson,
                                CREATOR_ID: userInfo.userId,
                                CREATE_TIME: new Date(),
                                TemplateID:TemplateID
                            },
                            success: function(response, opts) {
                            	me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getStore().load();
                            	//me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].rawValue=templateName;
                            	//me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].value=templateName;
                            	//me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].setValue(TemplateID);
                                myMask.hide();
                                templateWindow.close();
                            },
                            failure: function(response, opts) {
                                myMask.hide();
                                Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }, {
                type: 'close',
                tooltip: '取消',
                handler: function() {
                    templateWindow.close();
                }
            }],
            items: [{
                xtype: 'form',
                layout: 'hbox',
                padding: 5,
                items: [{
                    xtype: 'combo',
                    fieldLabel: '模板',
                    labelWidth: 32,
                    width: 160,
                    valueField: 'CONTENT',
                    displayField: 'NAME',
                    editable: true,
                    allowBlank: false,
                    store: new Ext.data.Store({
                        fields: ['ID', 'NAME', 'CONTENT'],
                        proxy: {
                            type: 'ajax',
                            url: webRoot + '/nws/icu_bed_item_template/getTemplate',
                            method: 'GET',
                            reader: {
                                type: 'json',
                                root: 'data'
                            }
                        },
                        autoLoad: true
                    }),
                    listeners: {
                        select: function(combo, records, eOpts) {
                			TemplateID=records[0].data.ID;
                			selectTemplateID=records[0].data.ID;
                			TemplateName=records[0].data.NAME;
                        },
                        change:function(_this, newValue, oldValue, eOpts ){
                        	if(TemplateName!=newValue){
                        		TemplateID="";
                        	}else{
                        		TemplateID=selectTemplateID;
                        	}
                        }
                    }
                }]
            }]
        });
        me.parent.showModalWindow(templateWindow);
        //templateWindow.show();
    },

    // 应用模板
    applyTemplate: function() {
        var me = this;
        if (me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels.length==0) {
            Ext.MessageBox.alert('提示', '请先选择模板!');
            return;
        }
        //var content = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1];
        var content = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.CONTENT;
        var TEMPLATE_ID=me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.ID;
        console.log(me.parent.BED_ID);
//        var allItems = eval(content.getValue()),
        var allItems = eval(content),
            root = me.getStore().getRootNode();
        //if (content.getValue() !=null) {
        if (content!=null) {
            Ext.Msg.confirm('应用模板', '应用模板后保存将会删掉之前的所有设置，是否继续？', function(btn) {
                if (btn == 'yes') {
                    // 删除当前根节点下所有节点
                    root.removeAll();
                    me.getStore().setRootNode({
                        expanded: true,
                        children: me.getItemTreeNode(allItems, false)
                    });
                    	//try{
                         //   	//在床位保存模板id
                         //   	Ext.Ajax.request({
                         //           url: webRoot + '/nws/icu_beds/updateBedtemplateID',
                         //           method: 'POST',
                         //           params: {
                         //   			BED_ID: me.parent.BED_ID,
                         //   			TEMPLATE_ID: TEMPLATE_ID
                         //           },
                         //           success: function(response) {
                         //
                         //           },
                         //           failure: function(response, options) {
                         //               myMask.hide();
                         //               Ext.MessageBox.alert('提示', '保存床位模板失败!');
                         //           }
                         //       });
                    	//}catch(e){}
                } else {
                    // 选择否后清空模板的值
                    content.setValue('');
                }
            });
        }else{
        	Ext.MessageBox.alert('提示', '请先选择模板!');
        }
    },
    // 应用所有模板
    applyAllTemplate: function() {
        var me = this;
        if (me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels.length==0) {
            Ext.MessageBox.alert('提示', '请先选择模板!');
            return;
        }
        //var content = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1];
        var content = me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.CONTENT;
        var TEMPLATE_ID=me.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.ID;
        //var allItems = eval(content.getValue()),
        var allItems = eval(content),
            root = me.getStore().getRootNode();
//        if (content.getValue() !=null) {
        if (content!=null) {
            Ext.Msg.confirm('全部应用', '应用模板后，本科室下的所有床位监护项设置都会改变，是否继续？', function(btn) {
                if (btn == 'yes') {
                	 var myMask = new Ext.LoadMask(me, {
                         msg: '正在保存中...'
                     });
                	 myMask.show();
                    // 删除当前根节点下所有节点
                    root.removeAll();
                    me.getStore().setRootNode({
                        expanded: true,
                        children: me.getItemTreeNode(allItems, false)
                    });
                   	Ext.Ajax.request({
                 		url:webRoot + '/nws/icu_bed_item/queryBedsItemsByIcuId/' + me.parent.BED_ID,
                         method: 'PUT',
                         params: {
                     		ICU_ID:userInfo.deptId
                     	},
                         success: function(response) {
                     		var result = Ext.decode(response.responseText);
                     		if (result.success) {
                                if(result.data.length>0){
                                	for(var i=0;i<result.data.length;i++){
                                   	Ext.Ajax.request({
                                 		url:webRoot + '/nws/icu_bed_item/applyAllTemplate/' + me.parent.BED_ID,
                                         method: 'PUT',
                                         params: {
                                     		//ICU_ID:userInfo.deptId,
                                   			TEMPLATE_ID:TEMPLATE_ID,
                                   			BED_ID:result.data[i].ID,
                                     		allItems: JSON.stringify(me.getAllItemJson(allItems))
                                     	},
                                         success: function(response) {
                                         },
                                         failure: function(response, options) {
                                             Ext.MessageBox.alert('提示', '监护项目保存失败,请求超时或网络故障!');
                                         }
                                     	});
                                	}
                                	myMask.hide();
                                }
                            }
                         },
                         failure: function(response, options) {
                             Ext.MessageBox.alert('提示', '监护项目保存失败,请求超时或网络故障!');
                         }
                     	});
                } else {
                    // 选择否后清空模板的值
                    content.setValue('');
                }
            });
        }else{
        	Ext.MessageBox.alert('提示', '请先选择模板!');
        }
    },

    // 获取当前item treegrid的配置
    getItemTemplateJson: function(rootNode) {
        var me = this,
            childs = rootNode.childNodes,
            allItems = [];
        if (childs.length > 0) {
            for (var i = 0; i < childs.length; i++) {
                var item = {
                    presetCode: childs[i].data.PRESET_CODE,
                    name: childs[i].data.NAME,
                    alias: childs[i].data.ALIAS,
                    unitCode: childs[i].data.UNIT_CODE,
                    datasourceCode: childs[i].data.DATASOURCE_CODE,
                    datasourceValue: childs[i].data.DATASOURCE_VALUE,
                    width: childs[i].data.WIDTH,
                    displayToCentral: childs[i].data.DISPLAY_TO_CENTRAL,
                    displayToRecords: childs[i].data.DISPLAY_TO_RECORDS,
                    IS_DAILY: childs[i].data.IS_DAILY,
                    sumPosition: childs[i].data.SUM_POSITION,
                    alertStr:childs[i].data.alertStr    //警示条件
                }
                if (childs[i].hasChildNodes()) {
                    item.items = me.getItemTemplateJson(childs[i]);
                }
                allItems.push(item);
            }
        }
        return allItems;
    },

    // 根据模板配置树
    getItemTreeNode: function(items, isLeaf) {
        var me = this,
            nodes = [];
        for (var i = 0; i < items.length; i++) {
            var root = {
                ID: '',
                PARENT_ID: '',
                PRESET_CODE: items[i].presetCode,
                NAME: items[i].name,
                ALIAS: items[i].alias,
                UNIT_CODE: items[i].unitCode,
                DATASOURCE_CODE: items[i].datasourceCode,
                DATASOURCE_VALUE: items[i].datasourceValue,
                WIDTH: items[i].width,
                DISPLAY_TO_CENTRAL: items[i].displayToCentral,
                DISPLAY_TO_RECORDS: items[i].displayToRecords,
                IS_DAILY: items[i].IS_DAILY,
                SUM_POSITION: items[i].sumPosition,
                alertStr:items[i].alertStr,
                leaf: isLeaf
            }
            if (items[i].items && items[i].items.length > 0) {
                root.iconCls = 'care-parent';
                root.expanded = true;
                // 父节点为生命体征的预置项
                if (root.PRESET_CODE == 'bt64f80078fd11e39fd9cb7044fca582') {
                    root.children = me.getItemTreeNode(items[i].items, true);
                } else root.children = me.getItemTreeNode(items[i].items, false);
            } else {
                root.iconCls = 'care-child';
            }
            nodes.push(root);
        }
        return nodes;
    }
    ,
    // 根据模板配置树
    getAllItemJson: function(items) {
    	var me = this,
        nodes = [];
        try{
        	if(items[i].IS_DAILY==undefined){
        		items[i].IS_DAILY="0";
            }
        }catch(e){}
        
    for (var i = 0; i < items.length; i++) {
        var root = {
            ID: '',
            PARENT_ID: '',
            PRESET_CODE: items[i].presetCode,
            NAME: items[i].name,
            ALIAS: items[i].alias,
            UNIT_CODE: items[i].unitCode,
            DATASOURCE_CODE: items[i].datasourceCode,
            DATASOURCE_VALUE: items[i].datasourceValue,
            WIDTH: items[i].width,
            DISPLAY_TO_CENTRAL: items[i].displayToCentral,
            DISPLAY_TO_RECORDS: items[i].displayToRecords,
            IS_DAILY: items[i].IS_DAILY,
            SUM_POSITION: items[i].sumPosition,
            alertStr:items[i].alertStr
        }
        if (items[i].items && items[i].items.length > 0) {
        	root.items = me.getAllItemJson(items[i].items);
        }
        nodes.push(root);
    }
    return nodes;
    },

    // 循环保存树 深度处理
    careProjectTreeAddData: function(currNode, method, pid,addtrees) {
        var me = this;
        var uuid = Ext.create('Ext.data.UuidGenerator').generate().replace(/-/g,'');
        // 如果当前节点有子节点
        var params = me.getCurrItem(currNode);
        params.PARENT_ID = pid;
        params.VALID=1;
        	//新增
        	params.ID =uuid;
        	currNode.data.ID =params.ID;
        	addtrees.push(params);
            if (currNode.hasChildNodes()) {
                for (var i = 0; i < currNode.childNodes.length; i++) {
                    currNode.childNodes[i].data.SORT_NUMBER = i + 1;
                    currNode.childNodes[i].data.BED_ID = params.BED_ID;
                    me.careProjectTreeAddData(currNode.childNodes[i], 'POST', currNode.data.ID,addtrees);
                }
            }
    },
    // 监护项目格式
    getCurrItem: function(record) {
        var me = this;
        var curr = {
            BED_ID: record.data.BED_ID,
            PRESET_CODE: record.data.PRESET_CODE,
            NAME: record.data.NAME,
            ALIAS: record.data.ALIAS,
            UNIT_CODE: record.data.UNIT_CODE,
            DATASOURCE_CODE: record.data.DATASOURCE_CODE,
            DATASOURCE_VALUE: record.data.DATASOURCE_VALUE,
            WIDTH: record.data.WIDTH,
            DISPLAY_TO_CENTRAL: record.data.DISPLAY_TO_CENTRAL,
            DISPLAY_TO_RECORDS: record.data.DISPLAY_TO_RECORDS,
            IS_DAILY:record.data.IS_DAILY,
            SUM_POSITION: record.data.SUM_POSITION,
            SORT_NUMBER: record.data.SORT_NUMBER,
            alertStr:record.data.alertStr
        }
        return curr;
    },
}
);
