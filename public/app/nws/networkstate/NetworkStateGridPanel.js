/**
 * 通讯状态GRID页面
 * @author:whw
 * @date:2014-3-24.
 */
Ext.define('com.dfsoft.icu.nws.networkstate.NetworkStateGridPanel', {
    extend: 'Ext.grid.Panel',
    requires:['com.dfsoft.icu.nws.networkstate.AdapterDetailWindow',
        'com.dfsoft.icu.dmi.App',
        'com.dfsoft.lancet.sys.desktop.App'],
    padding: '5 5 0 5',
    setState: function (value, metaData, record, rowIdx, colIdx, store, view) {
        if (record.data.ADAPTER_STATE == 0){//正常连接
            return '<img src="/app/nws/networkstate/images/state-normal.png" align="center"/>';
        } else if (record.data.ADAPTER_STATE == 1) {//不能连接
            return '<img src="/app/nws/networkstate/images/state-noconn.png" align="center"/>';
        } else if (record.data.ADAPTER_STATE == 2) {//取不到数据
            return '<img src="/app/nws/networkstate/images/state-nodata.png" align="center"/>';
        }
    },
    createWindow:function(){

        var adw = new com.dfsoft.icu.nws.networkstate.AdapterDetailWindow();

        adw.show();

    },
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        Ext.apply(me, {
            columnLines: true,
            border: 1,
            autoScroll: true,
            enableColumnHide:false,
            forceFit:true,
            listeners: {'cellclick': function (_this, td, cellIndex, res, tr, rowIndex, e, eOpts) {
                var records = _this.getGridColumns();
                var record = records[cellIndex];
                if(record.dataIndex == "DETAIL"){
                    //var me = this;
                   // console.log(res.get("ADAPTER_ID"));
                    var adw = Ext.create('com.dfsoft.icu.dmi.App',{REGISTER_ID:me.REGISTER_ID,ADAPTER_ID:res.get("ADAPTER_ID")});
                    adw.app = myDesktopApp;
                    var win = adw.createWindow();
                    win.show();
                   // var adw = Ext.create('com.dfsoft.icu.nws.networkstate.AdapterDetailWindow');
                 //   me.parent.showModalWindowPop(adw);
                }
            }},
            /*
             返回数据：
             * ADAPTER_ID:  设备ID
             * ADAPTER_NAME: 设备名称
             *RECEIVING_INTERVAL:  间隔时间
             *LINK_ID: 采集点ID
             *LINK_NAME:  采集点名称
             *URL:  采集点URL
             * */
            columns: [
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 40,
                    align: 'center'
                },
                { header: '采集点名称',
                    width: 80,
                    sortable: false,
                    dataIndex: 'LINK_NAME'
                },
                { header: 'LinkId',
                    dataIndex: 'LINK_ID',
                    hidden: true
                },
                { header: 'LinkURL',
                    dataIndex: 'URL',
                    hidden: true
                },
                { header: '设备名称',
                    width: 80,
                    sortable: false,
                    dataIndex: 'ADAPTER_NAME'
                },
                { header: '状态',
                    width: 30,
                    sortable: false,
                    dataIndex: 'ADAPTER_STATE',
                    renderer: me.setState,
                    align: 'center'
                },
                { header: 'adapterId',
                    dataIndex: 'ADAPTER_ID',
                    hidden: true
                },
                { header: '间隔时间',
                    width: 40,
                    sortable: false,
                    dataIndex: 'RECEIVING_INTERVAL',
                    align: 'center'
                }
                ,
                { header: '详细',
                    width: 30,
                    sortable: false,
                    dataIndex: 'DETAIL',
                    renderer: function (val, meta, records) {
                        return '<img src="/app/nws/nursingrecord/images/dot.png" title="查看设备详细" align="center">';
                    },
                    align: 'center'
                }
            ]
        });
        me.callParent();
    }
});
