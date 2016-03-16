/**
 * 功能说明: 中央监护站
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.cms.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View',
        'com.dfsoft.icu.cms.bedlist.BedListPanel',
        'com.dfsoft.icu.cms.CmsToolbar',
        'com.dfsoft.icu.nws.CareCenterPanel'
    ],

    id: 'cms',//注意id一定要与yDesktop.App.getModules 的module保持一致，否则无法通过快捷方式打开 todo

    init: function() {
        Ext.util.CSS.swapStyleSheet('nws.css', '/app/nws/css/nws.css');
        Ext.util.CSS.swapStyleSheet('cms.css', '/app/cms/css/cms.css');

        this.launcher = {
            text: '中央监护站',
            iconCls: 'cms-small'
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

        //和护士工作站名称保持一致，为了实现隐藏功能
        me.nwsToolbar = new com.dfsoft.icu.cms.CmsToolbar({region: 'north', nwsApp: me});
        me.bedPanel = new com.dfsoft.icu.nws.BedPanel({
            region: 'north',
            nwsApp: me,
            patientInfo: patientInfo
        });
        me.bedListPanel = new com.dfsoft.icu.cms.bedlist.BedListPanel({
            cmsApp: me,
            selectBed: function(patientInfo) {
                if (patientInfo!=null) {
                    me.bedPanel.selectPatientInfo(patientInfo);
                }
            }
        });
        me.tabPanel = new Ext.tab.Panel({
            region: 'center',
            plain: true,
            items: [me.bedListPanel],
            listeners: {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {

                }
            }
        });
        var first = true;
        return desktop.createWindow({
            nwsApp: me,
            id: me.id,
            title: '中央监护站',
            iconCls: 'cms-small',
            minWidth: 1045,
            width: 1045,
            height: 600,
            animCollapse: false,
            constrainHeader: false,
            bodyStyle: {
                background: '#FFFFFF'
            },
            layout: {
                type: 'border',
                padding: 0
            },
            defaults: {
                split: false
            },
            items: [me.nwsToolbar, me.bedPanel, me.tabPanel],
            listeners: {
                show: function (component, eOpts) {
                    if (first == true && this.loadMask.isHidden() == false) {//防止子页面先加载，已经调用过隐藏方法
                        //this.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        first = false;
                        if (me.bedPanel.patientInfo != null) {
                            var dwsToolbarItems = me.nwsToolbar.dockedItems.items[0].items.items;
                            var warningItem = "";
                            for(var i = 0;i<dwsToolbarItems.length;i++){
                                var tagObj = dwsToolbarItems[i];
                                if(tagObj.title == "警示"){
                                    warningItem = tagObj;
                                }
                            }
                           // console.log(warningItem);
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
    //显示模态窗口
    showModalWindow: function(win) {
        var me = this;
        if (Ext.getCmp(me.id).hasModalChild==true) {
            win.modal = true;
            win.show();
            return;
        }
        Ext.getCmp(me.id).hasModalChild = true;
        Ext.getCmp(me.id).modalWin = win;
        Ext.getCmp(me.id).loadMask.show();
        win.on("close", function(_panel, eOpts ){
            Ext.getCmp(me.id).loadMask.hide();
            Ext.getCmp(me.id).hasModalChild = false;
        }, this);
        win.show();
    },
    //必须实现此方法
    createWindow: function() {
        var me = this;
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = me.createNewWindow();
            //创建遮罩效果
            win.loadMask = new Ext.LoadMask(win, {
                msg: ""
            });
        }
        win.show();
        if (Ext.getCmp(me.id).hasModalChild==true) {
            Ext.getCmp(me.id).modalWin.show();
        }
    }
});