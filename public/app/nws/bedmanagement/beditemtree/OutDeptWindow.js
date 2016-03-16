/**
 * 功能说明: 出科情况 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptForm'
    ],
    initComponent: function() {
        var me = this;
        me.outDeptForm = new com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptForm();
        var form = me.outDeptForm.getForm();
        form.findField('NAME').setValue(me.treename);
        Ext.apply(me, {
            title: '化验检查',
            closable: false,
            iconCls: 'out-dept',
            layout: 'fit',
            resizable: false,
            width: 230,
            height: 115,
            items: [me.outDeptForm],
            buttons: [{
                text: '保存',
                iconCls: 'save',
                scope: me,
                handler: me.save
            }, {
                text: '取消',
                iconCls: 'cancel',
                scope: me,
                handler: function() {
                    me.close();
                }
            }]
        });
        me.callParent();
    },

    //保存
    save: function() {
    	var me = this;
        var form = me.outDeptForm.getForm();
        var treename=form.findField('NAME').getValue();
        if (form.isValid()) {
        	if(me.treeid==null){
        		Ext.Ajax.request({
            		url: webRoot + '/icu/nursingRecord/specialitemtree/queryItem/' + treename + '/null',
            		method: 'PUT',
            		params: {
            		name: treename
                    },
                    success: function(response) {
                    	var respText = Ext.decode(response.responseText).data;
            			if(respText.flag==false){
            				Ext.MessageBox.alert('提示',respText.msg);
            			}else{
            				Ext.Ajax.request({
                            	url: webRoot + '/icu/nursingRecord/specialitemtree/addItem/' + me.treeid,
                                method: 'PUT',
                                params: {
                        			treename:treename
                                },
                                success: function(response) {
                                	me.close();
                                	var checkedid="";
                                	var records = Ext.getCmp(me.windowId+'special_itemtree').getView().getChecked();
                                	Ext.Array.each(records, function (rec) {
                                		checkedid=checkedid+rec.get('id')+",";
                                    }); 
                                	if(checkedid!="")checkedid=checkedid.substring(0,checkedid.length-1);
                                	Ext.getCmp(me.windowId+'special_itemtree').getStore().load({params:{treeid:checkedid}});
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                                }
                            });
            			}
                    },
                    failure: function(response, options) {
                        Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                    }
                });
        		
        	}else{
        		Ext.Ajax.request({
            		url: webRoot + '/icu/nursingRecord/specialitemtree/queryItem/' + treename + '/'+me.treeid,
            		method: 'PUT',
            		params: {
        			name: treename,
            		id:me.treeid
                    },
                    success: function(response) {
                    	var respText = Ext.decode(response.responseText).data;
            			if(respText.flag==false){
            				Ext.MessageBox.alert('提示',respText.msg);
            			}else{
            				Ext.Ajax.request({
                            	url: webRoot + '/icu/nursingRecord/specialitemtree/updateItem/' + me.treeid,
                                method: 'PUT',
                                params: {
                    			treeid:me.treeid,
                    			treename:treename
                                },
                                success: function(response) {
                                	me.close();
                                	var checkedid="";
                                	var records = Ext.getCmp(me.windowId+'special_itemtree').getView().getChecked();
                                	Ext.Array.each(records, function (rec) {
                                		checkedid=checkedid+rec.get('id')+",";
                                    }); 
                                	if(checkedid!="")checkedid=checkedid.substring(0,checkedid.length-1);
                                	Ext.getCmp(me.windowId+'special_itemtree').getStore().load({params:{treeid:checkedid}});
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                                }
                            });
            			}
                    },
                    failure: function(response, options) {
                        Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                    }
                });
        		
        	}
        }
    }
});