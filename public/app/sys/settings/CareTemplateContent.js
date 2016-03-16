/**
 * 功能说明: 模板内容 项目内容 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareTemplateContent', {
    extend: 'Ext.form.Panel',
    initComponent: function(){
        var me = this;
        Ext.apply(me, {
            border: false,
            layout: 'fit',
            disabled: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['模板内容', '->', {
                    xtype: 'button',
                    tooltip: '保存',
                    iconCls: 'save',
                    scope: me,
                    handler: me.savaItemContent
                }]
            }],

            items: [{
                xtype: 'panel',
                layout: 'border',
                //margin: '0 10 10 0',
                padding: '5 5 5 0',
                border: false,
                style: {
                    borderTop: '1px solid silver'
                },
                bodyStyle: 'background: white',
                items: [{
                    xtype: 'fieldcontainer',
                    region: 'north',
                    height: 28,
                    defaults: {
                        labelWidth: 60,
                        labelAlign: 'right'
                    },
                    layout: 'hbox',
                    items: [{
                        xtype: 'hidden',
                        name: 'CODE'
                    }, {
                        xtype: 'textfield',
                        name: 'NAME',
                        fieldLabel: '名称',
                        width: '100%',
                        //regex: /^[a-zA-Z0-9-_.\u4e00-\u9fa5]+$/,
                        //regexText: '可以输入中文、英文、数字、横线、下划线或点',
                        maxLength: 20,
                        maxLengthText: '最多可输入20个字符',
                        allowBlank: false,
                        selectOnFocus: true
                    }]
                },{
                    xtype: 'fieldcontainer',
                    region: 'north',
                    height: 28,
                    defaults: {
                        labelWidth: 60,
                        labelAlign: 'right'
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'CONCLUSION_TYPE',
                            editable: false,
                            valueField: 'value',
                            displayField: 'text',
                            fieldLabel: '类型',
                            allowBlank: false,
                            width: '100%',
                            value:'0',
                            store: new Ext.data.SimpleStore({
                                fields: ['value', 'text'],
                                data: [
                                    ['0', '文本'],
                                    ['1', '窗口']
                                ]
                            }),
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var container=Ext.getCmp('container');
                                    var content = Ext.getCmp('content');
                                    if (records[0].data.value =='0') {
                                        container.hide();
                                        container.down('combo').allowBlank=true;
                                        content.allowBlank=false;
                                        content.show();
                                    } else {
                                        container.show();
                                        container.down('combo').allowBlank=false;
                                        content.hide();
                                        content.allowBlank=true;
                                        //me.getForm().findField('url').setValue('/templates/zzszxyy/conclusion/Conclusion.html');
                                    }
                                }
                            }
                        } ]
                },{
                    xtype: 'fieldcontainer',
                    region: 'north',
                    id: 'container',
                    height: 28,
                    defaults: {
                        labelWidth: 60,
                        labelAlign: 'right'
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'url',
                            editable: false,
                            valueField: 'value',
                            displayField: 'text',
                           // value:1,
                            allowBlank: false,
                            fieldLabel: '交班页面',
                            width: '100%',
                            store: new Ext.data.Store({
                                fields: ['value', 'text'],
                                proxy: {
                                    type: 'ajax',
                                    url: webRoot + '/nws/conclusiln',
                                    method: 'GET',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                },
                                autoLoad: true,
                                listeners: {
                                    beforeload:function( store, operation, eOpts ){
                                    if(Ext.getCmp("container").down("combo").getValue() == ""){
                                        Ext.getCmp("container").down("combo").setValue("/templates/zzszxyy/conclusion/Conclusion.html");
                                    }
                        }

                                }

                            })
                        } ]
                },{
                    xtype: 'textareafield',
                    name: 'CONTENT',
                    id: 'content',
                    labelWidth: 60,
                    labelAlign: 'right',
                    region: 'center',
                    maxLength: 4000,
                    width: '100%',
                    fieldLabel: '内容'
                }]
            }],
            listeners:{
                render:function() {
                    var container=Ext.getCmp('container');
                    var type = this.getForm().findField('CONCLUSION_TYPE').getValue();
                    if (type =='0') {
                        container.down('combo').allowBlank=true;
                    } else {
                        Ext.getCmp('content').allowBlank=true;
                    }
                }
            }
        });
        me.callParent();
    },

    // 保存项目内容
    savaItemContent: function(){
        var me = this,
            form = me.getForm(),
            code = form.findField('CODE').getValue(),
            name = form.findField('NAME').getValue(),
            content= form.findField('CONTENT').getValue();
            url= form.findField('url').getValue(),
            conclusionType= form.findField('CONCLUSION_TYPE').getValue();

        if(form.isValid()) {
            //遮罩效果
            var myMask = new Ext.LoadMask(me, {
                msg: "保存中..."
            });
            myMask.show();
            me.getForm().submit({
                url: webRoot + '/dic/dic_care_records_template/' + code,
                method: 'PUT',
                success: function(form, action) {
                    myMask.hide();
                    me.parent.careTemplateTreeStore.proxy.url = webRoot + '/dic/dic_care_records_template/tree/all';
                    var currentNode = me.parent.getSelectionModel().getSelection()[0];

                    currentNode.raw.conclusion_type=conclusionType;
                    currentNode.data.conclusion_type=conclusionType;

                    if(conclusionType=='0'){
                        currentNode.raw.content=content;
                        currentNode.data.content=content;
                    }else{
                        currentNode.raw.content=url;
                        currentNode.data.content=url;
                    }

                    if(name!=currentNode.raw.text){
                        currentNode.raw.text=name;
                        currentNode.data.text=name;
                        document.getElementById(me.parent.getView().id+"-record-"+currentNode.raw.id).lastChild.lastChild.lastChild.innerHTML=name;
                    }
                },
                failure: function(form, action) {
                    myMask.hide();
                    Ext.MessageBox.alert('提示', '项目内容保存失败,请求超时或网络故障!');
                }
            });
        }
    }
});