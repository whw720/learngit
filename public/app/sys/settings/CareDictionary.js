/**
 * 功能说明: 护理字典 
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.lancet.sys.settings.CareDictionary', {
	extend: 'Ext.panel.Panel',
	requires: [
		'com.dfsoft.lancet.sys.settings.CareItemTree',
		'com.dfsoft.lancet.sys.settings.CareItemContent',
		'com.dfsoft.lancet.sys.settings.CareTemplateTree',
		'com.dfsoft.lancet.sys.settings.CareTemplateContent'
	],
	initComponent: function(){
		var me = this;
		me.careItemTree = new com.dfsoft.lancet.sys.settings.CareItemTree({parent: me});
		
		me.careTemplateTree = new com.dfsoft.lancet.sys.settings.CareTemplateTree({parent: me});
		
		Ext.apply(me, {
			id: 'settings_34415e7041de11e3b5bcdd145cb30083',
			disabled: true,
			title: '护理字典',
			layout: 'border',
			items: [{
				xtype: 'panel',
				region: 'west',
				width: '30%',
				layout: 'border',
				split: {
					size: 5
				},
				minWidth: 188,
				items: [me.careItemTree, me.careTemplateTree]
			}, {
				xtype: 'panel',
				region: 'center',
				layout: 'fit',
				border: true,
				items: []
			}]
		});
		me.callParent();
	}
});