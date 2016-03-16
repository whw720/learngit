/**
 * 功能说明: 警示条件 form
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AlertConditionForm', {
    extend: 'Ext.form.Panel',
    initComponent 	: function(){
        var me = this;
        // 0 字符串格式 则运算符只能是包含 
        if(me.parent.DATA_FORMAT == 0) {
            me.currOperators = [
                {'value': '包含', 'text': '包含'}
            ];
        } else {
            me.currOperators = [
                {'value': '>', 'text': '大于'}, 
                {'value': '<', 'text': '小于'}, 
                {'value': '=', 'text': '等于'}
            ];
        }
        //  录入方式为下拉选择  1 为下拉框
        if(me.parent.INPUT_TYPE == 1) {
            Ext.Ajax.request({
                url: webRoot + '/dic/dic_care_item/range/' + me.parent.dataSourceValue,
                method: 'GET',
                async: false, //同步
                success: function(response) {
                    var respText = Ext.decode(response.responseText);
                    me.valueMenu = [];
                    var currValue = me.parent.FORMULA_VALUE,
                        values = [];
                    if(currValue.length > 0) {
                        values = currValue.split(',');
                    }
                    for(var i=0;i<respText.data.length;i++) {
                        var checked = false;
                        for(var j = 0;j<values.length;j++) {
                            if(respText.data[i].ITEM_VALUE == values[j]) {
                                checked = true;
                            }
                        }
                        me.valueMenu.push({
                            xtype: 'menucheckitem',
                            text: respText.data[i].ITEM_VALUE,
                            checked: checked,
                            listeners: {
                                checkchange: function(_this, checked, eOpts) {
                                    var formulaField = me.getForm().findField('FORMULA_VALUE'),
                                        currValue = formulaField.getValue();
                                    // 勾选中则给赋值
                                    if(checked) {
                                        if(currValue.length > 0) {
                                            currValue += ',';
                                        }
                                        formulaField.setValue(currValue+_this.text);
                                    } else {
                                        var delValue = _this.text;
                                            beforeAfterValue = currValue.split(delValue);
                                        if(beforeAfterValue[0].length > 0 && beforeAfterValue[1].length > 0) {
                                            delValue += ',';
                                        } else if(beforeAfterValue[0].length > 0) {
                                            delValue = ',' + delValue;
                                        } else if(beforeAfterValue[1].length > 0) {
                                            delValue += ',';
                                        }
                                        formulaField.setValue(currValue.replace(delValue, ''));
                                    }
                                }
                            }
                        });
                    }
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('提示', '获取失败,请求超时或网络故障!');
                }
            });
        }
        Ext.apply(me, {
            //padding: 5,
            border: false,
            style: {
                borderTop: '1px solid #3892d3'
            },
            defaults: {
                layout: {
                    type: 'hbox'
                }
            },
            items: [{
                xtype:'fieldcontainer',
                margin: '5 5 0 5',
                defaults: {
                    labelWidth: 46,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'combo',
                    name: 'OPERATORS',
                    width: 190,
                    fieldLabel: '运算符',
                    allowBlank: false,
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    value: '>',
                    store: new Ext.data.Store({
                        fields: ['value', 'text'],
                        data: me.currOperators
                    })
                }, {
                    xtype: 'checkboxfield',
                    name: 'NON',
                    boxLabel: '非',
                    margin: '0 0 0 5',
                    checked: false
                }]
            }, {
                xtype:'fieldcontainer',
                margin: '5 5 0 5',
                defaults: {
                    labelWidth: 46,
                    labelAlign: 'right'
                },
                items: [{
                    xtype: 'textareafield',
                    name: 'FORMULA_VALUE',
                    maxLength: 4000,
					maxLengthText: '最多可输入4000个字符',
                    allowBlank: false,
                    width: 190,
                    hideLabel: true,
                    height: 42
                }, {
                    xtype: 'buttongroup',
                    columns: 1,
                    style: {
                        border: 0
                    },
                    items: [{
                        text: '值',
                        scale: 'medium',
                        cls: 'alert-value-button',
                        margin: '-4 0 0 0',
                        height: 40,
                        minWidth: 30,
                        menu: me.valueMenu
                    }]
                }]
            }]
        });
        me.callParent();
    }
});
