// 系统设置--字典
Ext.define('com.dfsoft.lancet.sys.settings.Dictionary', {
	extend: 'Ext.tab.Panel',
	requires: [
        'com.dfsoft.lancet.sys.settings.SysDictionary',
        'com.dfsoft.lancet.sys.settings.CareDictionary'
    ],
	id: 'settings_a20836d0265111e3a7c623368e524293',
	disabled: true,
	activeTab: 0,
	plain: true,
	title: '字典',
	border: false,
	layout: 'fit',
	tabPosition: 'left',
	initComponent: function() {

		var me = this;
		//系统字典
		me.sysDictionary = new com.dfsoft.lancet.sys.settings.SysDictionary();
		//护理字典
		me.careDictionary = new com.dfsoft.lancet.sys.settings.CareDictionary();
		me.items = [me.sysDictionary, me.careDictionary];
		me.callParent();
	}
});