/**
 * 功能说明: 护理记录模板 tree
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareTemplateTree', {
    extend: 'Ext.tree.Panel',
    initComponent: function(){
        var me = this;
        me.careTemplateTreeStore = new Ext.data.TreeStore({
            model: 'com.dfsoft.lancet.sys.settings.CareTemplateTreeModel',
            proxy	: {
                type: 'ajax',
                url: webRoot + '/dic/dic_care_records_template/tree/all',
                reader: {
                    type: 'json',
                    root: 'children'
                }
            },
            autoLoad: true
        });
        me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];
        Ext.apply(me, {
            region: 'center',
            border: true,
            split: {
                size: 5
            },
            hideHeaders: true,
            rootVisible: false,
            autoScroll: true,
            store: me.careTemplateTreeStore,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    //regex: /^[a-zA-Z0-9-_.-\\)\(\s\%\u4e00-\u9fa5]+$/,
                    //regexText: '可以输入中文、英文、数字、横线、斜杠、括号、空格、%、下划线或点',
                    maxLength: 20,
                    maxLengthText: '最多可输入20个字符',
                    allowBlank: false,
                    selectOnFocus: true,
                    msgTarget: 'side'
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['模板分类', '->', {
                    xtype: 'button',
                    tooltip: '添加',
                    iconCls: 'add',
                    scope: me,
                    disabled: true,
                    handler: me.addNode
                }, '-', {
                    xtype: 'button',
                    tooltip: '删除',
                    iconCls: 'delete',
                    scope: me,
                    handler: me.deleteNode
                }]
            }],
            viewConfig: {
                toggleOnDblClick: false,
                plugins: {
                    ptype: 'treeviewdragdrop'
                },
                listeners: {
                    //拖拽之前判断
                    beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                        if(data.records[0].data.id.length == 1) {
                            Ext.Msg.alert("拖动节点", "只能拖动子节点！");
                            dropHandlers.cancelDrop();
                        }
                        //节点拖动之前的父节点
                        beforeNode = data.records[0].parentNode;
                        //dropHandlers.cancelDrop();
                    },
                    drop: function(node, data, dropRec, dropPosition) {
                        //当前拖动节点
                        var currDropNode = data.records[0],
                        //当前拖动节点ID
                            currDropNodeId = currDropNode.data.id;
                        var aimNode = currDropNode.parentNode;
                        //如果父节点未展开，则拖动之前先展开
                        if(!aimNode.isExpanded()) {
                            aimNode.expand();
                        }
                        //节点拖动之后的父节点
                        var	aimNodeId = aimNode.data.id,
                            beforNodeId=beforeNode.data.id;
                            aimIconCls = aimNode.data.iconCls;
                        var index=((aimNodeId+''+beforNodeId).replace('root','')).indexOf('2')
                        if(index>=0&&aimNodeId!=beforNodeId){
                            aimNode.removeChild(currDropNode);
                            beforeNode.appendChild(currDropNode);
                            Ext.Msg.alert("拖动节点", "不能拖动到指定的模板节点下！");
                            if(me.templateContent)
                                me.templateContent.setDisabled(true);
                            return;
                        }
                        if (aimIconCls === 'care-item' || aimNodeId == 'root') {
                            aimNode.removeChild(currDropNode);
                            beforeNode.appendChild(currDropNode);
                            Ext.Msg.alert("拖动节点", "只能将节点拖动到根级模板节点下！");
                            if(me.templateContent)
                                me.templateContent.setDisabled(true);
                            return;
                        } else {
                            var aimPathName = aimNode.data.path_name;
                            // 更新当前拖动节点的父关系
                            Ext.Ajax.request({
                                url: webRoot + '/dic/dic_care_records_template/tree/' + currDropNodeId,
                                params: {
                                    CODE: currDropNodeId,
                                    TYPE: aimNodeId
                                },
                                method: 'PUT',
                                success: function(response) {

                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '拖动失败,请求超时或网络故障!');
                                }
                            });
                            //拖动后目标节点子节点
                            var afterDropAimChildren = currDropNode.parentNode.childNodes;
                            var orderItemIdArray = [];
                            for (var i = 0; i < afterDropAimChildren.length; i++) {
                                orderItemIdArray[orderItemIdArray.length] = afterDropAimChildren[i].data.id;
                            }
                            Ext.Ajax.request({
                                url: webRoot + '/dic/dic_care_records_template_sort',
                                params: {
                                    orderDeptIdArray: orderItemIdArray
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
                        if(me.templateContent)
                            me.templateContent.setDisabled(true);
                    }
                }
            },
            listeners: {
                itemexpand: function(_this, eOpts) {
                    me.careTemplateTreeStore.proxy.url = '';
                }
            }
        });
        me.on('edit', me.updateNode, me);
        me.on('itemclick', me.onItemclick, me);
        me.callParent();
    },
    //删除节点
    deleteNode: function() {
        var me = this;
        var rs = me.getSelectionModel().getSelection();
        if (rs.length > 0) {
            rs = rs[0];
            var id = rs.data.id;
            if(!rs.isExpanded()) {
                rs.expand();
            }
            var content = '确定删除节点: ' + rs.data.text + ' ?';
            Ext.Msg.confirm('删除节点', content, function(btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: webRoot + '/dic/dic_care_records_template/' + id,
                        method: 'DELETE',
                        scope: this,
                        success: function(response) {
                            var respText = Ext.decode(response.responseText);
                            rs.remove();
                            me.templateContent.setDisabled(true);
                            me.careTemplateTreeStore.proxy.url=webRoot + '/dic/dic_care_records_template/tree/all';
                            me.careTemplateTreeStore.load();
                        },
                        failure: function(response, options) {
                            Ext.MessageBox.alert('提示', '删除节点失败,请求超时或网络故障!');
                        }
                    });
                }
            }, me);
        } else {
            Ext.Msg.alert("删除节点", "请先选择要删除的节点！");
        }
    },

    addNode: function() {
        var me = this,
            cellEditingPlugin = me.cellEditingPlugin,
            selectionModel = me.getSelectionModel(),
            selectedList = selectionModel.getSelection()[0],
        //parentList = selectedList.isLeaf() ? selectedList.parentNode : selectedList,
            model = me.store.getProxy().getModel(),
            newList = null,
            expandAndEdit = function() {
                if (selectedList.isExpanded()) {
                    selectionModel.select(newList);
                    cellEditingPlugin.startEdit(newList, 0);
                } else {
                    me.on('afteritemexpand', function startEdit(list) {
                        if (list === selectedList) {
                            selectionModel.select(newList);
                            cellEditingPlugin.startEdit(newList, 0);
                            me.un('afteritemexpand', startEdit);
                        }
                    });
                    selectedList.expand();
                }
            };
        var contentStr = '';
        if(selectedList.data.id==2){

            contentStr = '/templates/zzszxyy/conclusion/Conclusion.html';

        }
        //排序号
        var sortItem = selectedList.childNodes.length + 1;
        Ext.Ajax.request({
            url: webRoot + '/dic/dic_care_records_template',
            method: 'POST',
            params: {
                CODE: '',
                NAME: '新护理模板',
                TYPE: selectedList.data.id,
                CONTENT: contentStr,
                SORT_NUMBER: sortItem//,
                //CONCLUSION_TYPE:1
            },
            success: function(response) {
                var respText = Ext.decode(response.responseText);
                newList = Ext.create(model, {
                    id: respText.data.id,
                    text: '新建模板',
                    type: selectedList.data.id,
                    leaf: true,
                    conclusion_type:selectedList.data.id==2?'1':'0',
                    iconCls: 'care-item'
                });
                //console.log(newList);
                me.templateContent.setDisabled(true);
                //console.log(newList);
                selectedList.appendChild(newList);
                expandAndEdit();
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
            }
        });
    },

    //更新节点
    updateNode: function(editor, e) {
        var me = this;
        var nodeId = e.record.data.id,
            conclusion_type = e.record.data.conclusion_type,
            newName = e.record.data.text;
        Ext.Ajax.request({
            url: webRoot + '/dic/dic_care_records_template_tree/' + nodeId,
            params: {
                NAME: newName,
                CONCLUSION_TYPE:conclusion_type

            },
            method: 'PUT',
            success: function(response) {
                var respText = Ext.decode(response.responseText);
                e.record.commit();
                if( me.templateContent&& me.templateContent.disabled==false){
                    me.templateContent.getForm().findField('NAME').setValue(newName);
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '修改节点名称失败,请求超时或网络故障!');
                e.record.reject();
            }
        });
    },

    // 显示当前护理项目的内容
    onItemclick: function(_this, record, item, index, e) {
        var me = this;  //模板内容
        me.templateContent = new com.dfsoft.lancet.sys.settings.CareTemplateContent({parent: me});
        var contentPanel = me.parent.items.items[2];
        contentPanel.removeAll(true);
        contentPanel.add(me.templateContent);
        me.templateContent.setDisabled(false);
        var buttons = me.getDockedItems('toolbar[dock="top"]')[0].items.items;
        var consclusionType=record.data.conclusion_type;
        if(record.raw.type!=2&&(consclusionType==''||!consclusionType)){
            consclusionType='0';
        }else if(record.raw.type==2&&(consclusionType==''||!consclusionType)){
            consclusionType='1';
        }
        var container=Ext.getCmp('container');
        var content = Ext.getCmp('content');
        if(consclusionType=='0'){
            container.hide();
            container.down('combo').allowBlank=true;
            content.allowBlank=false;
            content.show();
        } else {
            container.show();
            container.down('combo').allowBlank=false;
            content.hide();
            content.allowBlank=true;
        }
        if(record.raw.type!=2){
            me.templateContent.getForm().findField('CONCLUSION_TYPE').setDisabled(true);
        }else{
            me.templateContent.getForm().findField('CONCLUSION_TYPE').setDisabled(false);
        }
        // 只能删除叶子节点，只能在根级节点下添加新节点
        if(record.data.iconCls == 'care-item') {
            buttons[2].setDisabled(true);
            buttons[4].setDisabled(false);
            me.templateContent.getForm().setValues({
                CODE: record.data.id,
                NAME: record.data.text,
                CONTENT: record.data.content,
                CONCLUSION_TYPE:consclusionType,
                url:record.data.content
            });
        }else {
            if(!me.templateContent.isDisabled()) me.templateContent.setDisabled(true);
            buttons[2].setDisabled(false);
            buttons[4].setDisabled(true);
        }
    }
});