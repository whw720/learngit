/**
 * 功能说明: 护士工作站
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.ux.IFrame',
        'com.dfsoft.icu.nws.NwsToolbar',
        'com.dfsoft.icu.nws.BedPanel',
        'com.dfsoft.icu.nws.CareCenterPanel',
        'com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderForm',
        'com.dfsoft.icu.nws.bedmanagement.BedManageMentPanel',
        'com.dfsoft.icu.nws.nursingrecord.NursingRecordTab',
        'com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalPanel',
        'com.dfsoft.icu.nws.nursingevaluation.EvalBeInHospitalPanel',
        'com.dfsoft.icu.nws.nursingevaluation.EvalPainPanel',
        'com.dfsoft.icu.nws.nursingevaluation.EvalCatheterRiskPanel',
        'com.dfsoft.icu.nws.nursingevaluation.EvalFallRiskPanel',
        'com.dfsoft.icu.nws.nursingevaluation.EvalWaterlowsRiskPanel',
        'com.dfsoft.icu.nws.bedmanagement.SelectBedWindow',
        'com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePanel',
        'com.dfsoft.icu.nws.networkstate.NetworkStateWindow',
        'com.dfsoft.icu.nws.criticalcare.CriticalCarePanel',
        'com.dfsoft.icu.nws.bloodgas.BloodGasWindow',
        'com.dfsoft.icu.nws.consumables.ConsumablePanel'
    ],

    id: 'nws',//注意id一定要与yDesktop.App.getModules 的module保持一致，否则无法通过快捷方式打开 todo

    init: function () {
        Ext.util.CSS.swapStyleSheet('nws.css', '/app/nws/css/nws.css');
        Ext.util.CSS.swapStyleSheet('bedmanagement.css', '/app/nws/bedmanagement/css/bedmanagement.css');
        this.launcher = {
            text: '重症监护站',
            iconCls: 'nws-small'
        }
    },

    //判断病人是否在登陆用户的科室内，为了检查床位选择cookie是否有效
    findPatientIsExist: function (deptId, registerId) {
        var patientIsExist = false;
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/findpatientisexist',
            method: 'post',
            async: false,
            params: {
                deptId: deptId,
                registerId: registerId
            },
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    patientIsExist = result.data.patientCount > 0;
                }
            }
        });
        return patientIsExist;
    },

    //必须实现此方法
    createNewWindow: function () {
        var me = this,
            desktop = me.app.getDesktop();

        //从cookie中取值
        var patientInfo = Ext.util.Cookies.get("patientInfo");
        if (patientInfo != null) {
            //防止之前保存cookie信息错误出现异常
            try {
                patientInfo = Ext.decode(patientInfo);
                var patientIsExist = me.findPatientIsExist(userInfo.deptId, patientInfo.REGISTER_ID);
                if (patientIsExist == false) {
                    patientInfo = null;
                }
            } catch (e) {

            }
        }
        me.recordWarning = Ext.create("com.dfsoft.icu.nws.RecordWarning");
        me.nwsToolbar = new com.dfsoft.icu.nws.NwsToolbar({region: 'north', nwsApp: me});
        me.bedPanel = new com.dfsoft.icu.nws.BedPanel({region: 'north', nwsApp: me, patientInfo: patientInfo});
        me.careCenterPanel = new com.dfsoft.icu.nws.CareCenterPanel({nwsApp: me, title: '监护中心'});
        me.tabPanel = new Ext.tab.Panel({
            region: 'center',
            plain: true,
            items: [me.careCenterPanel],
            listeners: {
                tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                    //如果切换的新标签页是监护中心，并且病人信息已经发生了变化。防止当前tab页不在监控中心时，刷新iframe页面布局混乱的问题
                    if (newCard == me.careCenterPanel && me.bedPanel.isChangeBed == true) {
                        //遮罩效果
                        me.careCenterPanel.loadMask.show();
                        //重新加载监控中心
                        me.careCenterPanel.iframePanel.iframe.contentWindow.location.reload();
                        me.bedPanel.isChangeBed = false;
                        // 当前tab不在床位管理上时 重新选择病人，则切换到床位管理时 重新选中默认床位
                    } else if (newCard == me.nwsToolbar.bedManageMentPanel && (me.bedPanel.isChangeBed == 'true' || me.bedPanel.isChangeBed == true)) {
                        var alreadyDept = me.nwsToolbar.bedManageMentPanel.alreadyDept,
                            portal = alreadyDept.down('portalpanel');
                        alreadyDept.initBedInfo(portal, portal.getWidth());
                        me.bedPanel.isChangeBed = false;
                    }
                }
            }
        });

        var first = true;

        return desktop.createWindow({
            nwsApp: me,
            id: me.id,
            title: '重症监护站',
            iconCls: 'nws-small',
            minWidth: 1045 + (visiturl == '' ? 0 : 65),
            width: 1045 + (visiturl == '' ? 0 : 65),
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
                        this.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        first = false;
                       // var alarmText = document.getElementById('alarm_panel');
                        var alarmText = Ext.select("div.nwswarningdiv");
                        var doctorLogText = Ext.select("div.doctorLogdiv");

                        alarmText = alarmText.elements[0];
                        doctorLogText = doctorLogText.elements[0];

                        if (me.bedPanel.patientInfo != null) {
                            var patientId = me.bedPanel.patientInfo.PATIENT_ID;
                            Ext.Ajax.request({
                                url: parent.webRoot + '/nws/getWarning/' + patientId,
                                method: 'GET',
                                success: function (response) {
                                    var reqmsg = Ext.decode(response.responseText);
                                    //console.log(reqmsg);

                                    if (reqmsg.success === true) {
                                        var itemObj = reqmsg.data.warningResult;
                                        var doctorLog = reqmsg.data.doctorLog;
                                        if(doctorLog.length > 0){
                                            me.recordWarning.insertDoctorLog(doctorLogText,doctorLog[0]);
                                        }
                                     if(itemObj.length > 0){
                                         for(var i = 0;i < itemObj.length;i++){
                                             me.recordWarning.insertRecordWarning(alarmText,itemObj[i]);
                                         }
                                     }

                                    } else {
                                        request.showErr(reqmsg.errors, '加载');
                                    }
                                }
                            });
                        }
                    }
                },
                beforeClose: function (component, eOpts) {
                    if (me.bedPanel.selectBedWindow != null) {
                        me.bedPanel.selectBedWindow.close();
                    }
                },
                minimize: function (window, eOpts) {
                    if (me.bedPanel.selectBedWindow != null) {
                        me.bedPanel.selectBedWindow.close();
                    }
                }
            }
        });
    },

    //必须实现此方法
    createWindow: function () {
        var me = this;
        /************************弹出Window窗口***************************/
        var win = me.app.getDesktop().getWindow(this.id);
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
    },

    //显示模态窗口
    showModalWindow: function (win) {
        var me = this;
        if (Ext.getCmp(me.id).hasModalChild==true) {
            win.modal = true;
            win.show();
            return;
        }
        Ext.getCmp(me.id).hasModalChild = true;
        Ext.getCmp(me.id).modalWin = win;
        Ext.getCmp(me.id).loadMask.show();
        win.on("close", function (_panel, eOpts) {
            Ext.getCmp(me.id).loadMask.hide();
            Ext.getCmp(me.id).hasModalChild = false;
        }, this);
        win.show();
    },


    createNewVisitWindow: function () {
        var me = this,
            desktop = me.app.getDesktop();

        if (visiturl == '') {
            return false;
        }
        var visitFrame = new Ext.ux.IFrame({
            width: '100%',
            height: '100%',
            scrolling: 'no',
            loadMask: '页面加载中...',
            border: false,
            src: visiturl + "?DeptID=" + userInfo.deptId
        });
        return desktop.createWindow({
            nwsApp: me,
            id: 'icuwisitwindow',
            title: '远程探视',
            width: 1045,
            height: 600,
            animCollapse: false,
            constrainHeader: false,
            maximizable: false,
            maximized: true,
            autoScroll: false,
            bodyStyle: {
                background: '#FFFFFF',
                autoScroll: false
            },
            layout: {
                type: 'border',
                padding: 0
            },
            defaults: {
                split: false
            },
            items: [visitFrame]
            // html:"<iframe width='100%' height='100%' frameborder='0' scrolling='no' style='overflow:hidden'  src='"+ (visiturl + "?DeptID=" + userInfo.deptId)+"'></iframe>"
        });
    },

    //必须实现此方法
    createVisitWindow: function () {
        var me = this;
        /************************弹出Window窗口***************************/
        var win = me.app.getDesktop().getWindow('icuwisitwindow');
        if (!win) {
            win = me.createNewVisitWindow();
            if (win == false) {
                Ext.MessageBox.alert('提示', '未配置探视系统访问地址！');
                return false;
            }
            //创建遮罩效果
            /* win.loadMask = new Ext.LoadMask(win, {
             msg: ""
             });*/
        }
        win.show();
    }
});
