/*
 特殊情况panel。
 */
Ext.define(
    'com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialItemTreePanel',
    {
        extend: 'Ext.tree.Panel',
        requires: [
                   'com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore'
               ],
        alias: 'widget.specialitemtree',
        textWidth:195,
        constructor: function(config) {
       	 Ext.apply(this, config);
            var me = this;
            Ext.util.CSS.swapStyleSheet('consumables.css', webRoot + '/app/nws/consumables/css/consumables.css');
            var treestore=Ext.create('Ext.data.TreeStore', {
                proxy	: {
                    type: 'ajax',
                    url: webRoot + '/icu/nursingRecord/specialitemtree/getSpecialItem',
                    extraParams :{
                        treeid : me.treeid,
                        show_special_item:false
                    },
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            });
            var templatestore=Ext.create('Ext.data.Store',{
                fields: ['value', 'text','texts'],
                proxy: {
                    type: 'ajax',
                    url: webRoot + '/icu/nursingRecord/specialitemtree/getSpecitalItemTemplateList',
                    method: 'GET',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
                , autoLoad: true
            });
            this.getSelsJson=function () {
                var me = this;
                var records = me.getView().getChecked();
                var codeNames = "";
                Ext.Array.each(records, function (rec) {
                    codeNames = codeNames + '{"code":"' + rec.get('id') + '","name":"' + rec.get('text') + '"},';
                });
                codeNames = '[' + codeNames.substr(0, codeNames.length - 1) + ']';
                return codeNames;
            },
            me.callParent([{
                xtype       : 'treepanel',
                title       : '&nbsp;&nbsp;&nbsp;化验检查',
                id          : me.windowId+'special_itemtree',
                minWidth    : 175,
                width       : 175,
                height      : 394,//217
                rootVisible	: false,
                useArrows 	: true,
                border      : true,
                plain       : true,
                store:treestore,
                listeners : {
            	afternodeexpand: function(_this, index, item, eOpts) {
            	},
            	load: function(_store, records, bln, eOpts) {
                },
                itemclick:function( view, record, item, index,e, eOpts ){
                	if(record.data.id=='ch001'&&e.target.className==''){
                		openWindow();
                	}
                },
            	afterrender:function(){
                me.view.on('cellcontextmenu', function(view, cell, cellIndex, record, row, rowIndex, e) {
                	if(record.data.id=='ch001'){
                	}else if(record.data.parentId=='ch001'){
                		event.preventDefault();
                        Ext.create('Ext.menu.Menu', {
                            border: false,
                            plain: true,
                            items: [
                                {
                                    text: '删除',
                                    iconCls: 'delete',
                                    handler: function() {
                                		del(record.data.id);
                                	}
                                }
                            ]
                        }).showAt(e.getPageX(), e.getPageY());
                	}
                });
            },
                }
            }]);
            function del(code) {  
            	Ext.Msg.confirm('删除化验检查', '确定删除此项化验检查?', function(btn) {
                    if (btn == 'yes') {
                    	var checkedid="";
                    	var finalcheckedid="";
                    	var records = Ext.getCmp(me.windowId+'special_itemtree').getView().getChecked();
                    	Ext.Array.each(records, function (rec) {
                    		checkedid=checkedid+rec.get('id')+",";
                        }); 
                    	if(checkedid!="")checkedid=checkedid.substring(0,checkedid.length-1);
                    	checkedid=checkedid.replace(code,"");
                    	var tempid=checkedid.split(',');
                    	for(var i=0;i<tempid.length;i++){
                    		if(tempid[i]!=''){
                    			finalcheckedid=finalcheckedid+tempid[i]+",";
                    		}
                    	}
                    	if(finalcheckedid!="")finalcheckedid=finalcheckedid.substring(0,finalcheckedid.length-1);
                    	Ext.getCmp(me.windowId+'special_itemtree').getStore().load({params:{treeid:finalcheckedid}});
                    }
                }); 
            } 

            function add() {  
            	var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptWindow',{treeid:null,windowId:me.windowId});
            	dlg.show();
            }
            function update(treeid,treename) {  
            	var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptWindow',{treeid:treeid,treename:treename,windowId:me.windowId});
            	dlg.show();
            }
            function stripscript(s) {
                var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
                var rs = "";
                for (var i = 0; i < s.length; i++) {
                    rs = rs + s.substr(i, 1).replace(pattern,"null");
                }
                return rs;
            }	
          //打开医嘱药加水详细页
            function openWindow(){
            	var store = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
            	store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
            	store.load();
            	var store2 = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
            	if(me.treeid==null||me.treeid=='')me.treeid="test";
            	if(typeof me.treeid=='object'){
            		me.treeid=me.treeid.CODES;
            	}
            	store2.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/getSelectItem/'+me.treeid;
            	store2.load();
               var panel=Ext.create('Ext.grid.Panel', {
                   xtype: "grid",
                   width: 500, // 指定表单宽度
                   height:330,
                   region:"west",
                   columnLines: true,
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' , width:150 }, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME', width:200},
                         { text: '类别', dataIndex: 'CATEGORY',width:130 }
                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'label',
                           html: '可用的检查项目：',
                           margin: '10 0 0 0'
                       },'->',{
                           xtype: 'textfield',
                           fieldLabel: '名称',
                           labelWidth: 30,
                           emptyText: '输入拼音首字母或中文名称',
                           width: 250,
               			listeners:{
                            specialkey:function(_field,_e){
                                if (_e.getKey() == _e.ENTER) {
                              var newValue=panel.dockedItems.items[1].items.items[2].value;
                              if(newValue==''){
                    	   		   newValue=null;
                    	   		   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                            	   store.loadPage(1);
                    	   	   }else if(newValue!=null){
                    	   		   newValue = newValue.replace(".","null");
	                     	   	   newValue=newValue.replace(/\\/g,"null");
	                     	   	   newValue=stripscript(newValue);
	                     	   	   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
	                     	   	   store.loadPage(1);
                    	   	   }
                                }
                            }
                           }
                       },{
                           xtype: 'button',
                           tooltip: '刷新',
                           iconCls: 'order-refresh',
                           handler: function (btn) {
                               var newValue=panel.dockedItems.items[1].items.items[2].value;
                               if(newValue==''){
                                   newValue=null;
                                   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                   store.loadPage(1);
                               }else if(newValue!=null){
                                   newValue = newValue.replace(".","null");
                                   newValue=newValue.replace(/\\/g,"null");
                                   newValue=stripscript(newValue);
                                   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                   store.loadPage(1);
                               }
                           }}]
                   }],
                   store: store,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dragGroup: 'firstGridDDGroup',
                           dropGroup: 'secondGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           },
                           beforerefresh : function(v) {
                               v.scrollTop = v.el.dom.scrollTop;
                               v.scrollHeight = v.el.dom.scrollHeight
                           },
                           refresh : function(v) {
                               v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                           }
                       }
                   },
                   bbar: Ext.create('Ext.PagingToolbar', {
                       store: store,
                       displayInfo: true,
                       displayMsg: '共{2}条',
                       emptyMsg: '无记录'
                   })
              });
               var panel2=Ext.create('Ext.grid.Panel', {
                   width: 400, // 指定表单宽度
                   height:330,
                   columnLines: true,
                   region:"east",
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' ,flex: 0.5}, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME',flex: 0.5},
                         {text: '',menuDisabled: true,sortable: false, xtype: 'actioncolumn',
                                         width: 30,
                                         items: [{
                                             iconCls: 'delete',
                                             tooltip: '删除',
                                             align:'center',
                                             handler: function(grid, rowIndex, colIndex) {
                                                grid.getStore().removeAt(rowIndex);

                                             }
                                         }
                                         ]
                                     }

                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'label',
                           html: '已选择的检查项目：',
                           margin: '10 0 0 0'
                       },'->',
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
                           store:templatestore,
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
                                   '<a href="javascript:;" onclick="editTemplate(event,\'{value}\', \'{text}\')"><span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 25px;"><img src="/app/sys/desktop/images/gears.png" /></span></a>' +
                                   '<a href="javascript:;" onclick="deleteTemplate(event,\'{value}\', \'{text}\')"><span style="width: 16px; height: 16px; position: absolute; margin-top: 2px; right: 6px;"><img src="/app/sys/desktop/images/delete.png" /></span></a>' +
                                   '</span>' +
                                   '</div>' +
                                   '<tpl else>' +
                                   '<div class="x-boundlist-item" onclick="addTemplate(event,\'{value}\',\'{text}\')" style="border-top-style: dotted;border-top-color:#B5B8C8;border-top-width: thin; margin-top: -2px;" >' +
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
                               var queryButtonObj = Ext.ComponentQuery.query('button[name=queryButton]', btn.ownerCt.ownerCt)[0];
                               var modeObj = Ext.ComponentQuery.query('combo[name=doctor-mode]', btn.ownerCt.ownerCt)[0];
                               var modeId = modeObj.getValue();
                               if (modeId == null||modeId == "") {
                                   Ext.MessageBox.alert('提示', '请选择一个模板!');
                                   return;
                               }
                                   Ext.MessageBox.confirm("请确认", "应用模板后清空原有记录，是否应用模板？", function (button, text) {
                                       if (button == 'yes') {
                                           Ext.Ajax.request({
                                               url: webRoot + '/icu/nursingRecord/specialitemtree/getSpecitalItemTemplateItems/' + modeId,
                                               method: 'get',
                                               success: function (response) {
                                                   var respText = Ext.decode(response.responseText);
                                                   var content=respText.data[0].content;
                                                   var code="";
                                                   var contentobj=eval(content);
                                                   for(var i=0;i<contentobj.length;i++){
                                                	   code=code+contentobj[i].code+",";
                                                   }
                                                   if(code!="")code=code.substring(0,code.length-1);
                                                   store2.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/getSelectItem/'+code;
                                               	   store2.load();
                                               },
                                               failure: function (response, options) {
                                                   btn.ownerCt.ownerCt.elm.hide();
                                                   Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                                               }
                                           });
                                       }
                                   });

                           }}]
                   }],
                   store: store2,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dropGroup: 'firstGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                    	   	var code=data.records[0].data.CODE;
                    	   	if(store2.findRecord('CODE',code)){
                    	   		Ext.Msg.alert("提示", "已经存在检查项目！");
                    	   		dropHandlers.cancelDrop();
                    	   	}
                    	   	//store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
                       		//store.load();
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           }
                       }
                   }
              });
              var dlg = new Ext.Window({
           		title: '化验检查',
           		resizable: false,
           		width: 912,
           		height:410,
           		modal: true,
           		autoDestroy: true,
           		bodyStyle:'overflow-y:auto;',
           		closeAction: 'hide',
           		layout:"border",
           		items: [panel,panel2],
           		buttons: [{
                    text: '确定',
                    iconCls: 'save',
                    scope: me,
                    handler: function() {
           			var selectstore=panel2.getStore();
           			var str="";
           			for(var i=0;i<selectstore.getCount();i++){
           				str=str+selectstore.getAt(i).get('CODE')+",";
           			}
           			if(str!="")str=str.substring(0,str.length-1);
           			dlg.close();
           			me.treeid=str;
                		var checkedid="";
                    	var records = Ext.getCmp(me.windowId+'special_itemtree').getView().getChecked();
                    	//只有选择了特殊情况，才记住值
                    	Ext.Array.each(records, function (rec) {
                    		if(rec.get('parentId')=='sp001'){
                    			checkedid=checkedid+rec.get('id')+",";
                    		}
                        });
                    	if(checkedid!=''){
                    		me.treeid=me.treeid+","+checkedid;
                    	}
           			treestore.load({params:{treeid:me.treeid}});
                    }
                }, {
                    text: '取消',
                    iconCls: 'cancel',
                    scope: me,
                    handler: function() {
                        dlg.close();
                    }
                }]
           	  });
               dlg.show();
             //删除模板
               this.deleteTemplate=function(e,tempCode,tempName){
                       e.stopPropagation();
                       var modeObj = Ext.ComponentQuery.query('combo[name=doctor-mode]',panel2)[0];
                   Ext.MessageBox.confirm("请确认", "真的要删除【" + tempName + "】模板", function (button, text) {
                       if (button == 'yes') {
                           Ext.Ajax.request({
                               url: webRoot + '/icu/nursingRecord/specialitemtree/delSpecitalItemTemplate/' + tempCode,
                               method: 'PUT',
                               success: function (response) {
                        	     templatestore.reload();
                        	     modeObj.setValue('');
                               },
                               failure: function (response, options) {
                                   Ext.MessageBox.alert('提示', '删除模板失败,请求超时或网络故障!');
                               }
                           });

                       }
                   });
               };
             //新增模板
               this.addTemplate=function(e,pobj,tempCode,tempName){
                   e.stopPropagation();
                   openAddTemplateWindow();
               };
               //新增模板
               this.editTemplate=function(e,tempCode,tempName){
                   e.stopPropagation();
                   openeditTemplateWindow(tempCode,tempName);
               };
               // 获取当前打开模块
               this.getCurrentModule=function(){
                   var modules = ['nws','dws','cms','sys','dtm','sta','dmi'];
                   var openModules = [];
                   for(var i = 0;i<modules.length;i++){
                       if(Ext.getCmp(modules[i]) != undefined ){
                           openModules.push(modules[i]);
                       }
                   }
                   return Ext.getCmp(openModules[0]).zIndexManager.front.id;
               };
            }

            //打开医嘱药加水详细页
            function openAddTemplateWindow(){
            	var store = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
            	store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
            	store.load();
            	var store2 = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
            	if(me.treeid==null||me.treeid=='')me.treeid="test";
            	if(typeof me.treeid=='object'){
            		me.treeid=me.treeid.CODES;
            	}
            	store2.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/getSelectItem/'+me.treeid;
            	store2.load();
               var panel=Ext.create('Ext.grid.Panel', {
                   width: 500, // 指定表单宽度
                   height:330,
                   region:"west",
                   columnLines: true,
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' , width:150 }, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME', width:200},
                         { text: '类别', dataIndex: 'CATEGORY',width:130 }
                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'label',
                           html: '可用的检查项目：',
                           margin: '10 0 0 0'
                       },'->',{
                           xtype: 'textfield',
                           fieldLabel: '名称',
                           labelWidth: 30,
                           emptyText: '输入拼音首字母或中文名称',
                           width: 250,
                           listeners:{
                               specialkey:function(_field,_e){
                                   if (_e.getKey() == _e.ENTER) {
                                       var newValue=panel.dockedItems.items[1].items.items[2].value;
                                       if(newValue==''){
                                           newValue=null;
                                           store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                           store.loadPage(1);
                                       }else if(newValue!=null){
                                           newValue = newValue.replace(".","null");
                                           newValue=newValue.replace(/\\/g,"null");
                                           newValue=stripscript(newValue);
                                           store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                           store.loadPage(1);
                                       }
                                   }
                               }
                           }
                       },{
                           xtype: 'button',
                           tooltip: '刷新',
                           iconCls: 'order-refresh',
                           handler: function (btn) {
                               var newValue=panel.dockedItems.items[1].items.items[2].value;
                               if(newValue==''){
                                   newValue=null;
                                   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                   store.loadPage(1);
                               }else if(newValue!=null){
                                   newValue = newValue.replace(".","null");
                                   newValue=newValue.replace(/\\/g,"null");
                                   newValue=stripscript(newValue);
                                   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                                   store.loadPage(1);
                               }
                           }}]
                   }],
                   store: store,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dragGroup: 'firstGridDDGroup',  
                           dropGroup: 'secondGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断    
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           },
                           beforerefresh : function(v) {
                               v.scrollTop = v.el.dom.scrollTop;
                               v.scrollHeight = v.el.dom.scrollHeight
                           },
                           refresh : function(v) {
                               v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                           }
                       }
                   },
                   bbar: Ext.create('Ext.PagingToolbar', {
                       store: store,
                       displayInfo: true,
                       displayMsg: '共{2}条',
                       emptyMsg: '无记录'
                   })
              });
               var panel2=Ext.create('Ext.grid.Panel', {
                   width: 400, // 指定表单宽度
                   height:330,
                   region:"east",
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' ,flex: 0.5}, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME',flex: 0.5},
                         {text: '',menuDisabled: true,sortable: false, xtype: 'actioncolumn',
                                         width: 30,
                                         items: [{
                                             iconCls: 'delete',
                                             tooltip: '删除',
                                             align:'center',
                                             handler: function(grid, rowIndex, colIndex) {
                                                grid.getStore().removeAt(rowIndex);
                                                 
                                             }
                                         }
                                         ]
                                     }

                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'label',
                           html: '已选择的检查项目：',
                           margin: '10 0 0 0'
                       },'->',{
                           xtype: 'textfield',
                           name:"templateName",
                           //id: "templateNameid",
                           fieldLabel: '模板名称',
                           maxLength: 200,
                           labelWidth: 60,
                           width: 200
                       },{
                           xtype: 'button',
                           tooltip: '保存',
                           iconCls: 'save',
                           handler: function(){
                  			var me=this;
                   			var templateCentent = [];
                   			var selectstore=panel2.getStore();
                   			var  contentRecords = templatestore.getRange(0,templatestore.getCount());
                   			var templateName = panel2.dockedItems.items[1].items.items[2].value;
                   	        if(templateName==undefined||templateName==''){
                   	            Ext.MessageBox.alert('提示', '请输入模板名称！');
                   	            return;
                   	        }
                               if (!panel2.dockedItems.items[1].items.items[2].isValid()) {
                                   return;
                               }
        	           	    if(selectstore.getCount() < 1){
        	                     Ext.MessageBox.alert('提示', '模板内容不能为空！');
        	                     return;
        	                }
	        	           	for (var i = 0; i < contentRecords.length; i++) {
	        	                 if (contentRecords[i].data.text === templateName) {
	        	                     Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
	        	                     return;
	        	                 }
	        	            }
                   			var str="";
                   			for(var i=0;i<selectstore.getCount();i++){
                   				var templateItem = {};
                   				templateItem.code = selectstore.getAt(i).get('CODE');
                   				str=str+selectstore.getAt(i).get('CODE')+",";
                   				templateCentent.push(templateItem);
                   			}
                   			if(str!="")str=str.substring(0,str.length-1);
                   			templateCentent = JSON.stringify(templateCentent);
                            Ext.Ajax.request({
                                url: webRoot + '/icu/nursingRecord/specialitemtree/addSpecitalItemTemplate',
                                method: 'POST',
                                params: {
                                    NAME: templateName,
                                    CONTENT: templateCentent,
                                    CREATOR_ID: parent.userInfo.userId,
                                    CREATE_TIME: new Date()
                                },
                                success: function (response, opts) {
                                    var reqmsg = Ext.decode(response.responseText);
                                    templatestore.reload();
                                    dlg.close();
                                },
                                failure: function (response, opts) {
                                    Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                                }
                            });
                           }
                       }]
                   }],
                   store: store2,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dropGroup: 'firstGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断    
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                    	   	var code=data.records[0].data.CODE;
                    	   	if(store2.findRecord('CODE',code)){
                    	   		Ext.Msg.alert("提示", "已经存在检查项目！");
                    	   		dropHandlers.cancelDrop();
                    	   	}
                    	   	/*store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
                       		store.load();*/
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           }
                       }
                   }
              });
              var dlg = new Ext.Window({
           		title: '添加化验检查模板',
           		resizable: false,
           		width: 912,	
           		height:410,
           		modal: true,
           		autoDestroy: true,
           		bodyStyle:'overflow-y:auto;',
           		closeAction: 'hide',
           		layout:"border",
           		items: [panel,panel2]
           	  });
               dlg.show();
                var position=dlg.getPosition();
                dlg.setPosition(position[0],position[1]+30);
            }
            
            //打开医嘱药加水详细页
            function openeditTemplateWindow(tempCode,tempName){
            	var store = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
            	store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
            	store.load();
            	var store2 = new com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialStore();
                Ext.Ajax.request({
                    url: webRoot + '/icu/nursingRecord/specialitemtree/getSpecitalItemTemplateItems/' + tempCode,
                    method: 'get',
                    success: function (response) {
                        var respText = Ext.decode(response.responseText);
                        var content=respText.data[0].content;
                        var code="";
                        var contentobj=eval(content);
                        for(var i=0;i<contentobj.length;i++){
                     	   code=code+contentobj[i].code+",";
                        }
                        if(code!="")code=code.substring(0,code.length-1);
                        store2.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/getSelectItem/'+code;
                    	store2.load();
                    },
                    failure: function (response, options) {
                        btn.ownerCt.ownerCt.elm.hide();
                        Ext.MessageBox.alert('提示', '应用模板失败,请求超时或网络故障!');
                    }
                });
               var panel=Ext.create('Ext.grid.Panel', {
                   width: 500, // 指定表单宽度
                   height:330,
                   region:"west",
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' , width:150 }, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME', width:200},
                         { text: '类别', dataIndex: 'CATEGORY',width:130 }
                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'textfield',
                           fieldLabel: '检验名称',
                           labelWidth: 60,
                           emptyText: '输入拼音首字母或中文名称',
                           width: 250,
               			listeners:{
                    	   change: function(_this, newValue, oldValue, eOpts) {
                    	   if(newValue==''){
                	   		   newValue=null;
                	   		   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                        	   store.loadPage(1);
                	   	   }else if(newValue!=null){
                	   		   newValue = newValue.replace(".","null");
                     	   	   newValue=newValue.replace(/\\/g,"null");
                     	   	   newValue=stripscript(newValue);
                     	   	   store.proxy.url=webRoot+"/icu/nursingRecord/specialitemtree/queryItem/"+newValue+"";
                     	   	   store.loadPage(1);
                	   	   }
                   		}
                           }
                       }]
                   }],
                   store: store,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dragGroup: 'firstGridDDGroup',  
                           dropGroup: 'secondGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断    
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           },
                           beforerefresh : function(v) {
                               v.scrollTop = v.el.dom.scrollTop;
                               v.scrollHeight = v.el.dom.scrollHeight
                           },
                           refresh : function(v) {
                               v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                           }
                       }
                   },
                   bbar: Ext.create('Ext.PagingToolbar', {
                       store: store,
                       displayInfo: true,
                       displayMsg: '共{2}条',
                       emptyMsg: '无记录'
                   })
              });
               var panel2=Ext.create('Ext.grid.Panel', {
                   width: 400, // 指定表单宽度
                   height:330,
                   region:"east",
                   renderTo: Ext.getBody(),
                   // 定义该表格包含的所有数据列
                   columns: [
                         { text: '编码', dataIndex: 'SYNCID' ,flex: 0.5}, // 第1个数据列
                         { text: '名称', dataIndex: 'NAME',flex: 0.5},
                         {text: '',menuDisabled: true,sortable: false, xtype: 'actioncolumn',
                                         width: 30,
                                         items: [{
                                             iconCls: 'delete',
                                             tooltip: '删除',
                                             align:'center',
                                             handler: function(grid, rowIndex, colIndex) {
                                                grid.getStore().removeAt(rowIndex);
                                                 
                                             }
                                         }
                                         ]
                                     }

                   ],
                   dockedItems: [{
                       xtype: 'toolbar',
                       dock: 'top',
                       items: [{
                           xtype: 'label',
                           html: '已选择的检查项目：',
                           margin: '10 0 0 0'
                       },'->',{
                           xtype: 'textfield',
                           name:"templateName",
                           fieldLabel: '模板名称',
                           value:tempName,
                           labelWidth: 60,
                           width: 200
                       },{
                           xtype: 'button',
                           tooltip: '保存',
                           iconCls: 'save',
                           handler: function(){
                  			var me=this;
                   			var templateCentent = [];
                   			var selectstore=panel2.getStore();
                   			var templateName = panel2.dockedItems.items[1].items.items[2].value;
                   			var  contentRecords = templatestore.getRange(0,templatestore.getCount());
                   	        if(templateName==undefined||templateName==''){
                   	            Ext.MessageBox.alert('提示', '请输入模板名称！');
                   	            return;
                   	        }
        	           	    if(selectstore.getCount() < 1){
        	                     Ext.MessageBox.alert('提示', '模板内容不能为空！');
        	                     return;
        	                }
	        	           	for (var i = 0; i < contentRecords.length; i++) {
	        	           		 if(templateName!=tempName){
	        	           			if (contentRecords[i].data.text === templateName) {
		        	                     Ext.MessageBox.alert('提示', '模板名称重复，请重新输入!');
		        	                     return;
		        	                 }
	        	           		 }
	        	            }
                   			var str="";
                   			for(var i=0;i<selectstore.getCount();i++){
                   				var templateItem = {};
                   				templateItem.code = selectstore.getAt(i).get('CODE');
                   				str=str+selectstore.getAt(i).get('CODE')+",";
                   				templateCentent.push(templateItem);
                   			}
                   			if(str!="")str=str.substring(0,str.length-1);
                   			templateCentent = JSON.stringify(templateCentent);
                            Ext.Ajax.request({
                                url: webRoot + '/icu/nursingRecord/specialitemtree/updateSpecitalItemTemplate/'+tempCode,
                                method: 'PUT',
                                params: {
                                    NAME: templateName,
                                    CONTENT: templateCentent,
                                    CREATOR_ID: parent.userInfo.userId,
                                    CREATE_TIME: new Date()
                                },
                                success: function (response, opts) {
                                    var reqmsg = Ext.decode(response.responseText);
                                    templatestore.reload();
                                    dlg.close();
                                },
                                failure: function (response, opts) {
                                    Ext.MessageBox.alert('提示', '新模板保存失败,请求超时或网络故障!');
                                }
                            });
                           }
                       }]
                   }],
                   store: store2,
                   viewConfig: {
                       toggleOnDblClick: false,
                       plugins: {
                           ptype: 'gridviewdragdrop',
                           dropGroup: 'firstGridDDGroup'
                       },
                       listeners: {

                           //拖拽之前判断    
                           beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                    	   	var code=data.records[0].data.CODE;
                    	   	if(store2.findRecord('CODE',code)){
                    	   		Ext.Msg.alert("提示", "已经存在检查项目！");
                    	   		dropHandlers.cancelDrop();
                    	   	}
                    	   	//store.proxy.url=webRoot+'/icu/nursingRecord/specialitemtree/queryItem/null';
                       		//store.load();
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           }
                       }
                   }
              });
              var dlg = new Ext.Window({
           		title: '修改化验检查模板',
           		resizable: false,
           		width: 912,	
           		height:410,
           		modal: true,
           		autoDestroy: true,
           		bodyStyle:'overflow-y:auto;',
           		closeAction: 'hide',
           		layout:"border",
           		items: [panel,panel2]
           	  });
               dlg.show();
                var position=dlg.getPosition();
                dlg.setPosition(position[0],position[1]+30);
            }
        }
    });
