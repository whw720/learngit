/**
 * 功能说明: Demo模块
 * @author: zag
 */
Ext.define('com.dfsoft.icu.dmi.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View',
        'com.dfsoft.icu.dmi.LinkInfo',
        'com.dfsoft.icu.dmi.PatientGrid'
    ],

    id: 'dmi',

    init: function() {
	var me = this;
	//me.ADAPTER_ID="0f11f720f84e11e3b1a3cf216b47bebe,1faa9f60f84e11e3b1a3cf216b47bebe";
	//me.REGISTER_ID="null";
        Ext.util.CSS.swapStyleSheet('dmi.css','/app/dmi/css/dmi.css');
        this.launcher = {
            text: '设备监护控制',
            iconCls: 'dmi-small'
        }
    },

    //必须实现此方法
    createNewWindow:function() {
        var me = this;
       // me.openItemDetail(me.ADAPTER_ID,me.REGISTER_ID);
        var desktop = me.app.getDesktop();

        //用户register_id
        if(me.REGISTER_ID == undefined){
            me.REGISTER_ID = null;
        }
        if(me.ADAPTER_ID == undefined){
            me.ADAPTER_ID = null;
        }

        //适配器id
        me.LinkInfo = new com.dfsoft.icu.dmi.LinkInfo({ADAPTER_ID:me.ADAPTER_ID,region:"center"});
        me.grid=new com.dfsoft.icu.dmi.PatientGrid({REGISTER_ID:me.REGISTER_ID,region:"center"});


        return desktop.createWindow({
            id: me.id,
            title: '设备监护控制',
            iconCls: 'dmi-small',
            width: 1045,
            height: 570,
            border: false,
            layout:'border',
            bodyStyle: 'background: white',
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Link2数据获取监控',
                    region: 'west',
                    margin:'0 2 5 5',
                    width:'50%',
                    layout:'border',
                    padding:'5 5 5 5',
                    items:[
                           	me.LinkInfo
                           ]
                },
                {
                    xtype: 'fieldset',
                    title: '护理记录数据获取监控',
                    region: 'center',
                    margin:'0 5 5 3',
                    layout:'border',
                    padding:'5 5 5 5',
                    items:[
                          	me.grid
                          ]
                }
            ]
        });
    },
    //必须实现此方法
    createWindow: function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    },
    openItemDetail:function(ADAPTER_ID,REGISTER_ID){
    	var me = this;
    	me.ADAPTER_ID=ADAPTER_ID;
    	me.REGISTER_ID=REGISTER_ID;
    }
});