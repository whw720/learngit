/**
 * 功能说明: Demo模块
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.dws.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View',
        'com.dfsoft.icu.dws.DwsToolbar',
        'com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderForm',
        'com.dfsoft.icu.dws.BedListPanel',
        'com.dfsoft.icu.nws.criticalcare.CriticalCarePanel'
    ],

    id: 'dws',//注意id一定要与yDesktop.App.getModules 的module保持一致，否则无法通过快捷方式打开 todo

    init: function() {
        Ext.util.CSS.swapStyleSheet('nws.css', '/app/nws/css/nws.css');
        Ext.util.CSS.swapStyleSheet('dws.css', '/app/dws/css/dws.css');
        Ext.util.CSS.swapStyleSheet('bedmanagement.css', '/app/nws/bedmanagement/css/bedmanagement.css');
        this.launcher = {
            text: '医生工作站',
            iconCls: 'dws-small'
        }
    },
    //判断病人是否在登陆用户的科室内，为了检查床位选择cookie是否有效
    findPatientIsExist : function(deptId, registerId) {
        var patientIsExist = false;
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/findpatientisexist',
            method: 'post',
            async: false,
            params : {
                deptId: deptId,
                registerId: registerId
            },
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    patientIsExist = result.data.patientCount>0;
                }
            }
        });
        return patientIsExist;
    },

    //必须实现此方法
    createNewWindow: function() {
        var me = this,
            desktop = me.app.getDesktop();

        //从cookie中取值
        var patientInfo = Ext.util.Cookies.get("patientInfo");
        if (patientInfo!=null) {
        	//防止之前保存cookie信息错误出现异常
            try {
                patientInfo = Ext.decode(patientInfo);
                var patientIsExist = me.findPatientIsExist(userInfo.deptId, patientInfo.REGISTER_ID);
                if (patientIsExist==false) {
                    patientInfo = null;
                }
            } catch (e) {

            }
        }
        me.bedPanel = new com.dfsoft.icu.nws.BedPanel({region: 'north', nwsApp: me, patientInfo: patientInfo});
        me.bedListPanel = new com.dfsoft.icu.dws.BedListPanel({dwsApp: me, title: '床位列表'});
        me.dwsToolbar = new com.dfsoft.icu.dws.DwsToolbar({region: 'north', dwsApp:me});
        me.tabPanel = new Ext.tab.Panel({
            region: 'center',
            plain: true,
            items: [me.bedListPanel],
            listeners: {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    //如果切换的新标签页是监护中心，并且病人信息已经发生了变化。防止当前tab页不在监控中心时，刷新iframe页面布局混乱的问题
                    if (newCard==me.bedListPanel && me.bedPanel.isChangeBed==true) {
                        //遮罩效果
                        //重新加载监控中心
                        var portal = me.bedListPanel.down('portalpanel');
                        me.bedListPanel.initBedInfo(portal, portal.getWidth());
                        me.bedPanel.isChangeBed = false;
                    // 当前tab不在床位管理上时 重新选择病人，则切换到床位管理时 重新选中默认床位
                    } else if (me.bedPanel.isChangeBed == 'true' || me.bedPanel.isChangeBed == true) {
                        me.bedPanel.isChangeBed = false;
                    }
                }
            }
        });
//        me.warning=new Ext.ux.IFrame({
//            padding:'0',
//            autoScroll:false,
//            margin:'0',
//            border: false,
//            src:'/app/dws/dws_warning.html?PATIENT_ID='+ me.bedPanel.patientInfo.REGISTER_ID
//        });
        var first = true;
        return desktop.createWindow({
            id: me.id,
            title: '医生工作站',
            iconCls: 'dws-small',
            minWidth: 1045,
            width: 1045,
            height: 600,
            animCollapse: false,
            constrainHeader: false,
            layout: {
                type: 'border',
                padding: 0
            },
            bodyStyle: {
                background: '#FFFFFF'
            },
            defaults: {
                split: false
            },
            items: [me.dwsToolbar, me.bedPanel,me.tabPanel],
            listeners: {
                show: function (component, eOpts) {
                    //alert(11);
                    if (first == true && this.loadMask.isHidden() == false) {//防止子页面先加载，已经调用过隐藏方法
                        //this.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        first = false;
                        if (me.bedPanel.patientInfo != null) {
                            var dwsToolbarItems = me.dwsToolbar.dockedItems.items[0].items.items;
                            var warningItem = "";
                            for(var i = 0;i<dwsToolbarItems.length;i++){
                                var tagObj = dwsToolbarItems[i];
                                if(tagObj.title == "警示"){
                                    warningItem = tagObj;
                                }

                            }
                            var warning=new Ext.ux.IFrame({
                                padding:'0',
                                autoScroll:false,
                                margin:'0',
                                border: false,
                                src:'/app/dws/dws_warning.html?PATIENT_ID=' + me.bedPanel.patientInfo.REGISTER_ID
                           });
                            warningItem.add(warning);
                        }
                    }
                }}
        });
    },

    //必须实现此方法
    createWindow: function() {
        var me=this;
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
            //创建遮罩效果
            win.loadMask = new Ext.LoadMask(win, {
                msg: ""
            });
        }
        /*//创建遮罩效果
        win.loadMask = new Ext.LoadMask(win, {
            msg: "",
        });*/
        win.show();
        if (Ext.getCmp(me.id).hasModalChild==true) {
            Ext.getCmp(me.id).modalWin.show();
        }
        //return win;
    },
    setPatientInfo:function(info){
        var me=this;
        if (info!=null) {
            me.bedPanel.selectPatientInfo(info);
        }
        //循环tab页设置
        for (var i=0; i<me.tabPanel.items.items.length; i++) {
            if (typeof(me.tabPanel.items.items[i].setPatientInfo)!="undefined") {
                me.tabPanel.items.items[i].setPatientInfo(info);
            }
        }
    },
    //显示模态窗口
    showModalWindowDws: function(win) {
        var me = this;

        Ext.getCmp(me.id).hasModalChild = true;
        Ext.getCmp(me.id).modalWin = win;
        Ext.getCmp(me.id).loadMask.show();
        win.on("close", function(_panel, eOpts ){
            Ext.getCmp(me.id).loadMask.hide();
            Ext.getCmp(me.id).hasModalChild = false;
        }, this);
        win.show();
    }
});