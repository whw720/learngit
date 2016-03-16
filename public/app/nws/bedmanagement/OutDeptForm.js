/**
 * 功能说明: 出科情况 form
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.OutDeptForm', {
    extend: 'Ext.form.Panel',
    initComponent 	: function(){
        var me = this,
            outItems = [];
        Ext.Ajax.request({
            url: webRoot + '/dics/dic_out_whereabouts',
            method: 'GET',
            async: false,
            success: function(response) {
                var respText = Ext.decode(response.responseText);
                for(var i = 0;i<respText.data.length;i++) {
                    var curr = {
                        id: respText.data[i].value,
                        boxLabel: respText.data[i].text,
                        name: 'whereabouts'
                    }
                    outItems.push(curr);
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取出科去向列表失败,请求超时或网络故障!');
            }
        });
        Ext.apply(me, {
            padding: '0 5 0 5',
            layout: 'fit',
            items: [{
                xtype:'fieldset',
                title: '归转',
                margin: '0 0 5 0',
                allowBlank: false,
                blankText: '必须选择一项',
                items: [{
                    xtype: 'radiogroup',
                    columns: 1,
                    vertical: true,
                    items : [{
                    	id : 'c3cf2625ff0811e2b69eef705ed7331d',
                    	boxLabel : "病房",
                    	name : 'whereabouts'
                    },
                    {
                    	id : 'd2be1525ff0811e2b69eef705ed7220c',
                    	boxLabel : "门/急诊观察室",
                    	name : 'whereabouts'
                    },
                    {
                    	id : 'e4be1525ff0811e2b69eef705ed7442d',
                    	boxLabel : "返家",
                    	name : 'whereabouts'
                    },
                    {
                    	id : 'f5dg1525ff0811e2b69eef705ed7553e',
                    	boxLabel : "死亡",
                    	name : 'whereabouts'
                    },{
                    	id:'DIE_DATE',
                        xtype: 'datetimefield',
                        name: 'DIE_DATE',
                        fieldLabel: '死亡时间',
                        //allowBlank: false,
                        value:new Date(),
                        format: 'Y-m-d H:i',
                        width: 250
                    }]
                }]
            }]
        });
        me.callParent();
    }
});
