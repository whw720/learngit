/**
 * 功能说明: 添加床位 form
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AddBedForm', {
    extend: 'Ext.form.Panel',
    initComponent 	: function(){
        var me = this;
        Ext.apply(me, {
        	padding: '5 0 0 0',
            margin: '0 5 0 5',
            layout: 'hbox',
            items: [{
                xtype: 'textfield',
                name: 'BedNumber',
                labelWidth: 30,
                fieldLabel: '床号',
                allowBlank: false,
                //regex: /^[0-9]*[1-9][0-9]*$/,
				//regexText: '只能输入正整数',
				maxLength: 200,
				maxLengthText: '最大输入200位长度',
                width: 210
            }]
        });
        me.callParent();
    }
});
