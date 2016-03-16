/**
 * 功能说明:  监护项目维护  form
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareProjectMaintainForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.AlertTipsGrid'
    ],
    initComponent: function() {
        var me = this;
        me.alertGrid = new com.dfsoft.icu.nws.bedmanagement.AlertTipsGrid({
            parent: me
        });
        Ext.apply(me, {
            border: false,
            style: {
                borderTop: '1px solid #3892d3'
            },
            items: [{
                xtype: 'fieldset',
                title: '常规',
                collapsible: true,
                margin: '0 5 0 5',
                defaults: {
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 5,
                            bottom: 3,
                            left: 0
                        }
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'hidden',
                        name: 'SUPERIOR_PRESET_CODE'
                    }, {
                        xtype: 'textfield',
                        name: 'SUPERIOR_NAME',
                        width: 165,
                        fieldLabel: '上级名称',
                        disabled: true
                    }, {
                        xtype: 'textfield',
                        name: 'SUPERIOR_ALIAS',
                        labelWidth: 46,
                        width: 145,
                        fieldLabel: '别名',
                        disabled: true
                    }, {
                        xtype: 'textfield',
                        name: 'SUPERIOR_UNIT_CODE',
                        labelWidth: 34,
                        width: 140,
                        fieldLabel: '单位',
                        disabled: true
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'combo',
                        name: 'PRESET_CODE',
                        fieldLabel: '预置项',
                        width: 165,
                        valueField: 'value',
                        displayField: 'text',
                        editable: false,
                        maxLength: 200,
    					maxLengthText: '最多可输入200个字符',
                        store: new Ext.data.Store({
                            fields: ['value', 'text'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dics/dic_bed_item_preset',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listeners: {
                    	render : function(p) {//渲染后给el添加mouseover事件
                        p.getEl().on('keydown', function(e){ 
                        	if (e.getKey() == 46) { 
                        		me.getForm().findField('PRESET_CODE').setRawValue('');
                            	me.getForm().findField('PRESET_CODE').setValue('');
                            	me.getForm().findField('PRESET_CODE').setFieldLabel('预置项');
                                } 
                        }); 
                    	},
                            select: function(combo, records, eOpts) {
                                var superPresetValue = me.getForm().findField('SUPERIOR_PRESET_CODE').getValue(),
                                    currValue = records[0].data.value;
                                if (currValue == '1c4267adc60e11e395078c89a5769562' || currValue == '24550929c37611e39dd9e41f1364eb96' || currValue == '278366bfc60e11e395078c89a5769562'|| currValue == '337d27b9c37611e39dd9e41f1364eb96'|| currValue == '4223357dc37611e39dd9e41f1364eb96'|| currValue == '4db35a85c37611e39dd9e41f1364eb96'|| currValue == 'a452f80078fd11e39fd9cb7044fhu458'|| currValue == 'bt64f80078fd11e39fd9cb7044fca582'|| currValue == 'cxe4f80078fd11e39fd9cb704412gt89') {
                                	combo.setRawValue(records[0].data.text);
                                	me.presetItemSelect(me, currValue, combo);
                                }
                                
//                                // 入量.名称 入量.剂量 入量.途径 这三项预置项 只有上级节点是预置项入量的才可以选择
//                                if (superPresetValue == 'cxe4f80078fd11e39fd9cb704412gt89') { //入量
//                                    if (currValue == '24550929c37611e39dd9e41f1364eb96' || currValue == '337d27b9c37611e39dd9e41f1364eb96' || currValue == '4223357dc37611e39dd9e41f1364eb96') {
//                                        combo.setRawValue(records[0].data.text.split('.')[1]);
//                                    }
//                                    me.presetItemSelect(me, currValue, combo);
//                                } else {
//                                    if (currValue == '24550929c37611e39dd9e41f1364eb96' || currValue == '337d27b9c37611e39dd9e41f1364eb96' || currValue == '4223357dc37611e39dd9e41f1364eb96') {
//                                        //combo.setValue('');
//                                        //combo.setRawValue('');
//                                    } else {
//                                        me.presetItemSelect(me, currValue, combo);
//                                    }
//                                }
                            },
//                            change:function(_this, newValue, oldValue, eOpts ){
//                            	var currValue = me.getForm().findField('PRESET_CODE').getValue();
//                            	if (currValue != '1c4267adc60e11e395078c89a5769562'&&currValue != '24550929c37611e39dd9e41f1364eb96'&&currValue != '278366bfc60e11e395078c89a5769562'&&currValue != '337d27b9c37611e39dd9e41f1364eb96'&&currValue != '4223357dc37611e39dd9e41f1364eb96'&&currValue != '4db35a85c37611e39dd9e41f1364eb96'&&currValue != 'a452f80078fd11e39fd9cb7044fhu458'&&currValue != 'bt64f80078fd11e39fd9cb7044fca582'&&currValue != 'cxe4f80078fd11e39fd9cb704412gt89') {
//                            		//if(newValue!='出量.名称'||newValue!='入量.名称'||newValue!='出量.量'||newValue!='入量.量'||newValue!='入量.途径'||newValue!='护理内容'||newValue!='出量'||newValue!='生命体征'||newValue!='入量'){
//                            		me.getForm().findField('NAME').setFieldLabel('名称');
//                            		me.getForm().findField('PRESET_CODE').setValue(null);
//                            	}
//                            },
                            // 自动给别名赋值
                            blur: function(_this, _the, eOpts) {
                                var currValue = _this.getRawValue(),name = me.getForm().findField('NAME');
                                    alias = me.getForm().findField('ALIAS');
                                if (currValue != null && currValue.length > 0) {
                                    alias.setValue(currValue);
                                    name.setValue(currValue);
                                }
                            }
                        }
                    },{
                        xtype: 'textfield',
                        name: 'NAME',
                        labelWidth: 46,
                        fieldLabel: '名称',
                        allowBlank: false,
                        maxLength: 20,
    					maxLengthText: '最多可输入20个字符',
                        width: 145,
                        listeners: {
                            // 自动给别名赋值
                            blur: function(_this, _the, eOpts) {
                                var currValue = _this.getValue(),
                                    alias = me.getForm().findField('ALIAS');
                                if (currValue != null && currValue.length > 0) {
                                    alias.setValue(currValue);
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        name: 'ALIAS',
                        labelWidth: 34,
                        fieldLabel: '别名',
                        allowBlank: false,
                        maxLength: 20,
    					maxLengthText: '最多可输入20个字符',
                        width: 140
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'combo',
                        name: 'DATASOURCE_CODE',
                        fieldLabel: '数据来源',
                        width: 165,
                        editable: false,
                        //allowBlank: false,
                        valueField: 'value',
                        displayField: 'text',
                        store: new Ext.data.Store({
                            fields: ['value', 'text'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dics/dic_bed_item_datasource',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true,
                            listeners: {
                                load: function(_this, records, successful, eOpts) {
                                    //var superPreCode = me.getForm().findField('SUPERIOR_PRESET_CODE').getValue();
                                    //if (superPreCode == 'bt64f80078fd11e39fd9cb7044fca582') {
                                    //    _this.remove(records[2]);
                                    //}
                                }
                            }
                        }),
                        listeners: {
                        render : function(p) {//渲染后给el添加mouseover事件
                        p.getEl().on('keydown', function(e){ 
                        	if (e.getKey() == 46) { 
                        		me.getForm().findField('DATASOURCE_CODE').setRawValue('');
                            	me.getForm().findField('DATASOURCE_CODE').setValue('');
                                } 
                        }); 
                    	},
                            select: function(_combo, records, eOpts) {
                                var dic = me.getForm().findField('DATASOURCE_VALUE'),
                                    // 父节点的预置项 如果是生命体征，则还是监护项
                                    superPreCode = me.getForm().findField('SUPERIOR_PRESET_CODE').getValue();
                                if (records[0].data.text == '手工录入') {
                                    me.alertGrid.setDisabled(false);
                                    if (superPreCode == 'bt64f80078fd11e39fd9cb7044fca582') {
                                        dic.getPicker().getStore().proxy.url = webRoot + '/dic/monitor/items/tree';
                                        dic.setFieldLabel('监护项');
                                    } else {
                                        dic.setFieldLabel('字典');
                                        dic.getPicker().getStore().proxy.url = webRoot + '/dic/dic_care_item/tree/all';
                                    }
                                } else if (records[0].data.text == '自动获取') {
                                    me.alertGrid.setDisabled(false);
                                    dic.setFieldLabel('监护项');
                                    dic.getPicker().getStore().proxy.url = webRoot + '/dic/monitor/items/tree';
                                } else {
                                    me.alertGrid.setDisabled(true);
                                    dic.setFieldLabel('评分');
                                    dic.getPicker().getStore().proxy.url = webRoot + '/nws/icu/care_scores/getScores';
                                }
                                dic.getPicker().getStore().load();
                                dic.setDefaultValue('', '');
                                me.alertGrid.getStore().removeAll();
                            }
                        }
                    },{
                        xtype: 'comboboxtree',
                        name: 'DATASOURCE_VALUE',
                        labelWidth: 46,
                        fieldLabel: '字典',
                        rootVisible: false,
                        displayField: 'text',
                        editable: false,
                        //allowBlank: false,
                        width: 145,
                        pickerWidth: 268,
                        store: new Ext.data.TreeStore({
                            fields: [{
                                name: 'text',
                                type: 'string'
                            }, {
                                name: 'id',
                                type: 'string'
                            }],
                            proxy: {
                                type: 'ajax',
                                url: '',
                                reader: {
                                    type: 'json',
                                    root: 'children'
                                }
                            },
                            listeners: {
                                load: function(_this, node, records, successful, eOpts) {
                                    //查找所有节点
                                    var getChild = function(node) {
                                        var childNodes = node.childNodes;
                                        for (var i = 0; i < childNodes.length; i++) {
                                            if (childNodes[i].hasChildNodes()) {
                                                getChild(childNodes[i]);
                                            } else {
                                                childNodes[i].data.leaf = true;
                                            }
                                        }
                                    }
                                    // 将没有子节点的设为叶子节点
                                    getChild(_this.getRootNode());
                                }
                            }
                        }),
                        listeners: {
                    	render : function(p) {
                        p.getEl().on('keydown', function(e){ 
                        	if (e.getKey() == 46) { 
                        		me.getForm().findField('DATASOURCE_VALUE').setRawValue('');
                            	me.getForm().findField('DATASOURCE_VALUE').setValue('');
                                } 
                        }); 
                    	},
                            nodeclick: function(_this, record, item, index, e, eOpts) {
                    		if(record.data.parentId=='root'){
                    			Ext.MessageBox.alert('提示', '不能选择根目录，请选择下级监护项目！');
                    			me.down('comboboxtree').setHasSameItem(true);
                                return;
                    		}
                                var currField = me.down('comboboxtree').getFieldLabel();
                                // 获取监护项目treegrid所有节点
                                var recordsAll = me.parent.getChild(Ext.getCmp('nws-care-project-treegrid').getRootNode());
                                // 当前选中的监护项目
                                var records = Ext.getCmp('nws-care-project-treegrid').getSelectionModel().getSelection();
                                //如果是修改的，则删除该记录
                                if (records.length > 0) {
                                    for (var i = 0; i < recordsAll.length; i++) {
                                        if (recordsAll[i].data.DATASOURCE_VALUE == records[0].data.DATASOURCE_VALUE) {
                                            recordsAll.splice(i, 1);
                                        }
                                    }
                                }
                                // 判断当前选中值是否有重复
                                for (var i = 0; i < recordsAll.length; i++) {
                                    // 如果重复 ，则提示
                                	var ALIAS=me.getForm().findField('ALIAS').getRawValue();
                                    	if(ALIAS == recordsAll[i].data.NAME){
                                    		if(recordsAll[i].data.PRESET_CODE!='278366bfc60e11e395078c89a5769562'){
                                    			Ext.MessageBox.alert('提示', '名称 ' + ALIAS + ' 重复，请重新选择!');
                                                me.down('comboboxtree').setHasSameItem(true);
                                                return;
                                    		}
                                    	}
                                    	if(record.data.id == recordsAll[i].data.DATASOURCE_VALUE){
                                    		Ext.MessageBox.alert('提示', '数据来源值 ' + record.data.text + ' 重复，请重新选择!');
                                            me.down('comboboxtree').setHasSameItem(true);
                                            return;
                                    	}
                                }
                                //  如果当前fieldName 为监护项 ，则根据其正常范围自动填写警示信息
                                if (currField == '监护项') {
                                    if (records.length > 0) {
                                        if (record.data.id != records[0].data.DATASOURCE_VALUE) {
                                        	//选择后，上级和下级的datasource_value一样，修改bug
                                            //records[0].data.DATASOURCE_VALUE = record.data.id;
                                            var itemsNormalRange = [];
                                            if (record.raw.NORMAL_RANGE != null)
                                                itemsNormalRange = record.raw.NORMAL_RANGE.split('~');
                                            var operators = '<',
                                                arr = [];
                                            for (var i = 0; i < itemsNormalRange.length; i++) {
                                                var formula = {
                                                    ICON: 'circle-red',
                                                    OPERATORS: operators,
                                                    FORMULA_VALUE: itemsNormalRange[i],
                                                    FORMULA_FUNCTION: 'function(value) {if(value' + operators + itemsNormalRange[i] + '){return "circle-red";}else{return false;}}'
                                                };
                                                var curr = {
                                                    'ID': '',
                                                    'ITEM_ID': '',
                                                    'FORMULA': formula,
                                                    'COLOR': '#CC0000',
                                                    'DESCRIPTION': record.raw.text + ' ' + operators + ' ' + itemsNormalRange[i]
                                                };
                                                arr.push(curr);
                                                operators = '>';
                                            }
                                            me.alertGrid.getStore().loadData(arr, false);
                                        }
                                    } else {
                                        var itemsNormalRange = [];
                                        if (record.raw.NORMAL_RANGE != null)
                                            itemsNormalRange = record.raw.NORMAL_RANGE.split('~');
                                        var operators = '<',
                                            arr = [];
                                        for (var i = 0; i < itemsNormalRange.length; i++) {
                                            var formula = {
                                                ICON: 'circle-red',
                                                OPERATORS: operators,
                                                FORMULA_VALUE: itemsNormalRange[i],
                                                FORMULA_FUNCTION: 'function(value) {if(value' + operators + itemsNormalRange[i] + '){return "circle-red";}else{return false;}}'
                                            };
                                            var curr = {
                                                'ID': '',
                                                'ITEM_ID': '',
                                                'FORMULA': formula,
                                                'COLOR': '#CC0000',
                                                'DESCRIPTION': record.raw.text + ' ' + operators + ' ' + itemsNormalRange[i]
                                            };
                                            arr.push(curr);
                                            operators = '>';
                                        }
                                        me.alertGrid.getStore().loadData(arr, false);
                                    }
                                } else if (currField == '字典') {
                                    //me.alertGrid.getStore();
                                    me.alertGrid.getStore().removeAll();
                                }
                            }
                        }
                    },{
                        xtype: 'combo',
                        name: 'UNIT_CODE',
                        labelWidth: 34,
                        fieldLabel: '单位',
                        width: 140,
                        valueField: 'value',
                        displayField: 'value',
                        queryMode: 'remote',
                        //allowBlank: false,
                        editable: false,
                        store: new Ext.data.Store({
                            fields: ['value', 'text'],
                            proxy: {
                                type: 'ajax',
                                url: webRoot + '/dics/dic_unit',
                                method: 'GET',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                            autoLoad: true
                        }),
                        listeners: {
                            render : function(p) {//渲染后给el添加mouseover事件
                            p.getEl().on('keydown', function(e){ 
                            	if (e.getKey() == 46) { 
                            		me.getForm().findField('UNIT_CODE').setRawValue('');
                                	me.getForm().findField('UNIT_CODE').setValue('');
                                    } 
                            }); 
                        	}
                    	},
                        listConfig: {
                            cls: 'border-list',
                            getInnerTpl: function() {
                                return '<span style=\'font-size:12px;color:black;borderColor:black\'>{value}</span>';
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: '警示',
                collapsible: true,
                margin: '0 5 0 5',
                padding: '0 10 10 10',
                layout: 'fit',
                items: [me.alertGrid]
            }, {
                xtype: 'fieldset',
                title: '选项',
                collapsible: true,
                margin: '0 5 0 5',
                defaults: {
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 5,
                            bottom: 3,
                            left: 0
                        }
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    defaults: {
                        labelWidth: 64,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'checkboxfield',
                        name: 'DISPLAY_TO_CENTRAL',
                        boxLabel: '显示到监护中心',
                        checked: true
                    }, {
                        xtype: 'checkboxfield',
                        name: 'DISPLAY_TO_RECORDS',
                        margin: '0 0 0 28',
                        boxLabel: '显示到护理记录',
                        checked: true
                    },{
                        xtype: 'checkboxfield',
                        name: 'IS_DAILY',
                        margin: '0 0 0 28',
                        boxLabel: '是否常用',
                        checked: true
                    },{
                        xtype: 'hidden',
                        name: 'SUM_POSITION'
                    }
//                    , {
//                        xtype: 'combo',
//                        name: 'SUM_POSITION',
//                        labelWidth: 82,
//                        width: 180,
//                        fieldLabel: '合计位置',
//                        valueField: 'value',
//                        displayField: 'text',
//                        value: '0',
//                        store: new Ext.data.SimpleStore({ //合计显示位置：0不显示，1首行，2末行
//                            fields: ['value', 'text'],
//                            data: [
//                                ['0', '无'],
//                                ['1', '首行'],
//                                ['2', '末行']
//                            ]
//                        })
//                    }
                    ]
                }]
            }]
        });
        me.callParent();
    },

    presetItemSelect: function(me, value, combo) {
        var preset = me.getForm().findField('PRESET_CODE');
        var rawvalue=preset.getRawValue();
        preset.setValue(value);
        preset.setRawValue(rawvalue);
        preset.setFieldLabel('<img id="care-project-name" style="cursor: pointer;" src="/app/nws/bedmanagement/images/pre-project.png" />预置项');
        var careProjectName = Ext.get('care-project-name');
        var tip = Ext.create('Ext.tip.ToolTip', {
            target: careProjectName.el,
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    tip.update('预置项目：' + preset.getRawValue());
                }
            }
        });
        Ext.fly(careProjectName.el).on('dblclick', function() {
            Ext.Msg.confirm('清除预置项目', '是否清除预置项目设置？', function(btn) {
                if (btn === 'yes') {
                    careProjectName.remove();
                    combo.setValue('');
                    combo.setRawValue('');
                    preset.setValue('');
                    combo.setEditable(true);
                }
            });
        });
        //combo.setEditable(false);
    }
});