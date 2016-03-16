/**
 * 功能说明: 出科情况 form
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.OutDeptForm', {
    extend: 'Ext.form.Panel',
    initComponent 	: function(){
        var me = this;
        Ext.apply(me, {
        	padding: '5 0 0 0',
            margin: '0 5 0 5',
            layout: 'hbox',
            items: [{
                xtype: 'textfield',
                name: 'NAME',
                labelWidth: 30,
                fieldLabel: '名称',
                allowBlank: false,
                maxLength: 200,
				maxLengthText: '最多可输入200个字符',
                width: 210
            }]
        });
        me.callParent();
    }
});
