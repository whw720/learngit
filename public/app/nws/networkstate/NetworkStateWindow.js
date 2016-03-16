/**
 * 通讯状态页面
 * @author:whw
 * @date:2014-3-24.
 */
Ext.define('com.dfsoft.icu.nws.networkstate.NetworkStateWindow', {
    extend: 'Ext.window.Window',
    requires:['com.dfsoft.icu.nws.networkstate.AdapterDetailWindow'],
    layout: 'fit',
    //header:false,
    iconCls: 'network-state-small',
    title: '通讯状态',
    width: 600,
    height: 418,
    border: false,
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            style: {
                'padding-bottom': '0px'
            },
            items: [ '仪器连接状态', '->', {
                action: 'back_button',
                iconCls: 'network-state-refresh',
                labelAlign: 'right',
                tooltip: '刷新',
                handler: function (btn) {
                    var me = this;
                    //创建遮罩效果
                    var lm = new Ext.LoadMask(me.ownerCt.ownerCt,{
                        msg: "数据加载中。。。"
                    });
                    lm.show();
                    //获取设备最新信息
                    me.ownerCt.ownerCt.getAdapterList();
                    lm.hide();
                }

            }
//            ,'-',
//            {
//                action : 'c_button',
//                labelAlign:'right',
//                tooltip:'患者出科',
//                text:'患者出科',
//                handler:function(){
//                    var me = this;
//                 var patientId = "456";
//
//                    Ext.Ajax.request({
//                        url: parent.webRoot + '/nws/indep/' + patientId,
//                        method: 'GET',
//                        async: false,
//                        scope: me,
//                        success: function (response) {
//                            var reqmsg = Ext.decode(response.responseText);
//                            if (reqmsg.success === true) {
//                               // alert("患者出科");
//                               // me.load(reqmsg.data, patientId, scoreCode);
//                            } else {
//                                request.showErr(reqmsg.errors, '加载');
//                            }
//                        }
//                    });
//
//
//                }
//            },'-',
//            {
//                action : 'r_button',
//                labelAlign:'right',
//                tooltip:'患者入科',
//                text:'患者入科',
//                handler:function(){
//                    var me = this;
//                    var patientId = "123";
//                    Ext.Ajax.request({
//                        url: parent.webRoot + '/nws/outdep/' + patientId,
//                        method: 'GET',
//                        async: false,
//                        scope: me,
//                        success: function (response) {
//                            var reqmsg = Ext.decode(response.responseText);
//                            if (reqmsg.success === true) {
//                              //   alert("患者入科");
//                              //  console.log("---123----");
//                              //  me.load(reqmsg.data, patientId, scoreCode);
//                            } else {
//                                request.showErr(reqmsg.errors, '加载');
//                            }
//                        }
//                    });
//
//                  //  alert("患者入科");
//
//                }
//            }
            ]
        },
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [ '图例: ', {
                xtype: 'label',
                html: '<img src="/app/nws/networkstate/images/state-normal.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '连接正常'
            }, {
                xtype: 'label',
                html: '<img src="/app/nws/networkstate/images/state-noconn.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '无法连接'
            }, {
                xtype: 'label',
                html: '<img src="/app/nws/networkstate/images/state-nodata.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '无法获取数据'
            }
            ]
        }
    ],
    createWin:function(){
        alert("打开窗口。。。。。。");
    },

    //显示模态窗口
    showModalWindowPop: function (win) {
        var me = this;
        //创建遮罩效果
        me.loadMask = new Ext.LoadMask(me, {
            msg: "数据加载中...",
            useMsg: false
        });
        me.hasModalChild = true;
        me.loadMask.show();
        win.on("close", function (_panel, eOpts) {
            me.loadMask.hide();
            me.hasModalChild = false;
        }, this);
        win.show();
    },
    //获取设备信息
    getAdapterList: function () {
        var me = this;
        var deviceInfo = "";
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getTimers/' + me.REGISTER_ID,
            method: 'GET',
            async: false,
            scope: me,
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    deviceInfo = reqmsg.data;
                    console.log(deviceInfo);
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
        /*
         返回数据：
         * ADAPTER_ID:  设备ID
         * ADAPTER_NAME: 设备名称
         *RECEIVING_INTERVAL:  间隔时间
         *LINK_ID: 采集点ID
         *LINK_NAME:  采集点名称
         *URL:  采集点URL
         * */
        //表格store
        var pstore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'LINK_ID'},
                {name: 'LINK_NAME'},
                {name: 'URL'},
                {name: 'ADAPTER_ID'},
                {name: 'ADAPTER_NAME'},
                {name: 'ADAPTER_STATE'},
                {name: 'RECEIVING_INTERVAL'},
                {name: 'DETAIL'}
            ],
            data: deviceInfo,
            autoLoad: true
        });
        me.divGrid.reconfigure(pstore);
    },
    initComponent: function () {
        Ext.util.CSS.swapStyleSheet('networkstate.css', webRoot + '/app/nws/networkstate/css/networkstate.css');
        var me = this;
        if (me.REGISTER_ID == "") {
            me.REGISTER_ID = "null";
        }
        me.divGrid = Ext.create('com.dfsoft.icu.nws.networkstate.NetworkStateGridPanel', {
            REGISTER_ID: me.REGISTER_ID,
            parent:me
        });
        //获取设备信息
        me.getAdapterList();
        Ext.apply(me, {
            items: [
                me.divGrid
            ]
        });
        me.callParent();
    }
});