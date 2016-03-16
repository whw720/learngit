/*
	系统设置--->选项
*/
Ext.define('com.dfsoft.icu.dmi.LinkInfo', {
	extend: 'Ext.tree.Panel',
	initComponent: function() {
		Ext.QuickTips.init();
		var me = this;
		var treestore = Ext.create('Ext.data.TreeStore', {
	           autoLoad: true,
	           fields: [{
					name: 'name',
					type: 'string'
				},{
					name: 'url',
					type: 'string'
				}, {
					name: 'type',
					type: 'string'
				},{
					name: 'protocol',
					type: 'string'
				},{
					name: 'running_time',
					type: 'string'
				},{
					name: 'start_time',
					type: 'string'
				},{
					name: 'last_time',
					type: 'string'
				},{
					name: 'interval',
					type: 'string'
				},{
					name: 'number',
					type: 'string'
				}],
	           proxy: {
	               type: 'ajax',
	               url: webRoot+'/sys/devicecare/getTreeInfo/' +me.ADAPTER_ID,
	               reader: {
	                   type: 'json',
	                   root: 'children'
	               }
	           }
	       });
		Ext.apply(me, {
			id: 'settings_options',
			border: true,
          //  margin:"0 0 3 0",
			useArrows: true,
			rootVisible: false,
			multiSelect: true,
			autoScroll: true,
			containerScroll: true,
			columnLines: true,
			rowLines: true,
			forceFit: true,
			desktopId: undefined,
			store: treestore,
			columns: [
			{
				text: '设备信息',
				sortable: false,
                menuDisabled  : true,
				align: 'center',
				flex: 2,
				width:500,
				columns: [{
					xtype: 'treecolumn',
					text: '名称',
					width:180,
					sortable: false,
                    menuDisabled  : true,
					dataIndex: 'name',
					align: 'left',
					textAlign:'left'
				},{
					text: '地址',
					width:180,
					sortable: false,
                    menuDisabled  : true,
					dataIndex: 'url',
					align: 'center'
				}, 
				{
					text: '设备类型',
					width:70,
					sortable: false,
                    menuDisabled  : true,
					dataIndex: 'type',
					align: 'center'
				},
				{
					text: '协议',
					width:150,
					sortable: false,
                    menuDisabled  : true,
					dataIndex: 'protocol',
					align: 'center'
				}]
			},          
			{
				text: '采集信息',
				sortable: false,
                menuDisabled  : true,
				align: 'center',
				flex: 2,
				width:500,
				columns: [{
                    text: '最后一次取数时间',
					flex: 1,
					sortable: false,
                    width: 180,
                    menuDisabled  : true,
                    dataIndex: 'last_time',
					align: 'center'
				},{
					text: '适配器间隔',
					flex: 1,
					sortable: false,
					width:175,
                    menuDisabled  : true,
					dataIndex: 'interval',
					align: 'center'
				}]
			}]
		});
		me.callParent();
	}
});