/**
 * 功能说明: 患者自动记录定时器执行信息
 * @author: zag
 */
Ext.define('com.dfsoft.icu.dmi.PatientGrid', {
    extend: 'Ext.grid.Panel',
    initComponent: function() {
        var me = this;
       var patientstore = Ext.create('Ext.data.Store', {
           autoLoad: true,
           fields: [{
               name: 'name',
               type: 'string'
           },
               {
               name: 'bed_number',
               type: 'string'
           },
               {
                   name: 'careStartTime',
                   type: 'string'
               },
               {
               name: 'last_time',
               type: 'string'
           }, {
               name: 'interval',
               type: 'string'
           }],
           proxy: {
               type: 'ajax',
               url: webRoot+'/sys/devicecare/getInfo/' +me.REGISTER_ID,
               reader: {
                   type: 'json',
                   root: 'data'
               }
           }
       });
        Ext.apply(me, {
            id:'waitdeptgrids',
           // margin:"0 0 3 0",
            border: true,
            columnLines: true,
            store: patientstore,
            split: {
                size: 5
            },
            columns: [
            {
				text: '患者信息',
				sortable: false,
                menuDisabled  : true,
				align: 'left',
				flex: 2,
				columns: [{
	                text: '患者姓名',
	                dataIndex: 'name',
                    menuDisabled  : true,
	                width: 150,
	                sortable: true,
	                align: 'left'
	            },
	            {
	                text: '床号',
	                dataIndex: 'bed_number',
                    menuDisabled  : true,
	                width: 100,
	                sortable: true,
	                align: 'left'
	            },
                    {
                        text: '护理开始时间',
                        dataIndex: 'careStartTime',
                        menuDisabled  : true,
                        width: 170,
                        sortable: true,
                        align: 'center'
                    }
                ]
			},
            {
				text: '采集信息',
				sortable: false,
                menuDisabled  : true,
				align: 'center',
				flex: 2,
				columns: [{
					text: '最近一次取数时间',
					flex: 1,
					sortable: false,
                    menuDisabled  : true,
					width: 170,
					dataIndex: 'last_time',
					align: 'center'
				},{
					text: '间隔时间',
					flex: 1,
					sortable: false,
                    menuDisabled  : true,
					width: (screen.width)/2-615,
					dataIndex: 'interval',
					align: 'center'
				}]
			}]
        });

        me.callParent();
    }
});

