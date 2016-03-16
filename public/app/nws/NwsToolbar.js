/**
 * 功能说明: 护士工作站工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.NwsToolbar', {
    extend: 'Ext.Panel',
    requires: [
        'com.dfsoft.icu.nws.NursingScoresMenu',
        'com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyPanel',
        'com.dfsoft.icu.medicalrecord.CaseWindow',
        'com.dfsoft.icu.medicalrecord.AnesthesiaNoteWindow',
        'com.dfsoft.icu.medicalrecord.AnesthesiaOtherNoteWindow',
        'com.dfsoft.icu.nws.specialevent.SpecialEventForm'
    ],
    constructor: function (config) {
        Ext.apply(this, config);
        var proxy = this;
        this.BUTTON_HEIGHT_3 = 82; //三行button高度
        this.BUTTON_HEIGHT_2 = 59; //两行行button高度
        this.BUTTON_HEIGHT_1 = 27; //一行行button高度
        this.BUTTON_WIDTH_2 = 58; //两行行button宽度
        this.nursingScoresMenu = new com.dfsoft.icu.nws.NursingScoresMenu({
            nwsApp: proxy.nwsApp,
            mod: proxy.nwsApp.id
        });


        this.bedManagerButton = new Ext.button.Button({
            text: '床位管理',
            id: proxy.nwsApp.id + '_6dbb5c90089d11e396021b9f5cdf5sa5',
            disabled: true,
            iconCls: 'bed-manager-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function () {
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.bedManageMentPanel = new com.dfsoft.icu.nws.bedmanagement.BedManageMentPanel({
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    nwsApp: proxy.nwsApp,
                    outCallback: function (REGISTER_ID) {
                        if (proxy.nwsApp.bedPanel.patientInfo == null) {
                            return;
                        }
                        if (proxy.nwsApp.bedPanel.patientInfo.REGISTER_ID == REGISTER_ID) {
                            proxy.nwsApp.bedPanel.patientInfo.STATUS_CODE = 'wty4980078fd11e39fd9cb7044fb795e';
                            document.getElementById("bedinfo_NAME" + proxy.nwsApp.bedPanel.appendId).innerHTML = proxy.nwsApp.bedPanel.patientInfo.NAME + "<br/>已出科";
                            document.getElementById("bedinfo_NAME" + proxy.nwsApp.bedPanel.appendId).title = proxy.nwsApp.bedPanel.patientInfo.NAME + "已出科";
                        }
                    },
                    changeBedCallback: function (fromPatient, toPatient) {
                        proxy.nwsApp.bedPanel.changeBed(fromPatient, toPatient);
                    },
                    //待入科回调函数
                    returnWaitCallback: function (REGISTER_ID) {
                        if (proxy.nwsApp.bedPanel.patientInfo == null) {
                            return;
                        }
                        if (proxy.nwsApp.bedPanel.patientInfo.REGISTER_ID == REGISTER_ID) {
                            proxy.nwsApp.bedPanel.patientInfo.STATUS_CODE = 'a34df80078fd11e39fd9cb7044fca372';
                            document.getElementById("bedinfo_NAME" + proxy.nwsApp.bedPanel.appendId).innerHTML = proxy.nwsApp.bedPanel.patientInfo.NAME + "<br/>待入科";
                            document.getElementById("bedinfo_NAME" + proxy.nwsApp.bedPanel.appendId).title = proxy.nwsApp.bedPanel.patientInfo.NAME + "待入科";
                        }
                    }
                });
                proxy.nwsApp.tabPanel.add(proxy.bedManageMentPanel);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.bedManageMentPanel);
            }
        });

        this.doctorOrderManagementButton = new Ext.button.Button({
            text: '医嘱管理',
            id: proxy.nwsApp.id + '_5caa5c90089d11e396021b9f5cdf5eb4',
            disabled: true,
            iconCls: 'doctor-order-management-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.doctorOrderForm = new com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderForm({
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    nwsApp: proxy.nwsApp
                });
                proxy.nwsApp.tabPanel.add(proxy.doctorOrderForm);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.doctorOrderForm);
            }
        });

        this.nursingRecordButton = new Ext.button.Button({
            text: '护理记录',
            id: proxy.nwsApp.id + '_4dba5c90089d11e396021b9f5cdf5h32',
            disabled: true,
            iconCls: 'nursing-record-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.nursingRecordTab = new com.dfsoft.icu.nws.nursingrecord.NursingRecordTab({
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    nwsApp: proxy.nwsApp
                });
                proxy.nwsApp.tabPanel.add(proxy.nursingRecordTab);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.nursingRecordTab);
            }
        });

        this.criticalCareButton = new Ext.button.Button({
            text: '特护单',
            id: proxy.nwsApp.id + '_ea41e7a0ab8311e382ed3b2ee09a2227',
            disabled: true,
            iconCls: 'critical-care-button',
            height: this.BUTTON_HEIGHT_1,
            width: 74,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                if (proxy.nwsApp.bedPanel.findPatientState(proxy.nwsApp.bedPanel.patientInfo.REGISTER_ID) == 'a34df80078fd11e39fd9cb7044fca372') {
                    Ext.MessageBox.alert('提示', '不能查看待入科患者的特护单!');
                    return;
                }
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                /*proxy.criticalCarePanel = new com.dfsoft.icu.nws.criticalcare.CriticalCarePanel({
                 patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                 parentPanel: proxy.nwsApp
                 });*/

                proxy.criticalCarePanel = new com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyPanel({
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    closable: true,
                    title: '特护单',
                    parentPanel: proxy.nwsApp
                });
                proxy.nwsApp.tabPanel.add(proxy.criticalCarePanel);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.criticalCarePanel);
            }
        });
        this.icuVisitSysButton = new Ext.button.Button({
            text: '远程探视',
            id: proxy.nwsApp.id + '_d6e88dd5d5ae11e4ba10f0def103fe57',
            disabled: true,
            hidden: visiturl == '' ? true : (proxy.nwsApp.id == 'nws' ? false : true),
            iconCls: 'icu-visit-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function () {
                proxy.nwsApp.createVisitWindow();
            }
        });
        this.temperatureButton = new Ext.button.Button({
            text: '其他',
            iconCls: 'valuation-button',
            height: this.BUTTON_HEIGHT_1,
            menu: new Ext.menu.Menu({
                items: [
                    {
                        text: '体温单',
                        id: proxy.nwsApp.id + '_fb52e7a0ab8311e382ed3b2ee09a3338',
                        disabled: true,
                        iconCls: 'temperature-button',
                        handler: function () {
                            if (proxy.nwsApp.bedPanel.patientInfo == null) {
                                Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                                return;
                            }
                            for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                    proxy.nwsApp.tabPanel.setActiveTab(i);
                                    return;
                                }
                            }
                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePanel({
                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                parentPanel: proxy.nwsApp
                            });
                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                        }
                    },
                    {
                        text: '一次性材料',
                        id: proxy.nwsApp.id + '_e80f3bbdc0a011e4865700262dff6a9e',
                        disabled: true,
                        iconCls: 'valuation-button',
                        handler: function () {
                            for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                    proxy.nwsApp.tabPanel.setActiveTab(i);
                                    return;
                                }
                            }
                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.consumables.ConsumablePanel({
                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                parentPanel: proxy.nwsApp,
                                mod: proxy.nwsApp.id
                            });
                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                        }
                    },
                    {
                            text: '护理评估',
                            id: proxy.nwsApp.id + '_16fff080b88511e3be54aba4461d08f5',
                            disabled: true,
                            iconCls: 'valuation-button',
                            height: this.BUTTON_HEIGHT_1,
                            handler: function () {
                            },menu: new Ext.menu.Menu({
                        items: [
                            {
                                text: '入院护理评估',
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalIntoHospitalPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalIntoHospitalPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalIntoHospitalPanel);
                                }
                            },
                            {
                                text: '住院护理评估',
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalBeInHospitalPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalBeInHospitalPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalBeInHospitalPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalBeInHospitalPanel);
                                }
                            },
                            {
                                text: '疼痛评估',
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalPainPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalPainPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalPainPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalPainPanel);
                                }
                            },
                            {
                                text: '导管滑脱危险因素评估',
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalCatheterRiskPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalCatheterRiskPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalCatheterRiskPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalCatheterRiskPanel);
                                }
                            },
                            {
                                text: '跌倒/坠床因素评估',
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalFallRiskPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalFallRiskPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalFallRiskPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalFallRiskPanel);
                                }
                            },
                            {
                                text: "waterlow's危险因素评估表",
                                iconCls: 'valuation-button',
                                handler: function () {
                                    for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                        if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                                            proxy.nwsApp.tabPanel.setActiveTab(i);
                                            return;
                                        }
                                    }
                                    proxy.evalWaterlowsRiskPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalWaterlowsRiskPanel({
                                        patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                        mod: proxy.nwsApp.id
                                    });
                                    proxy.nwsApp.tabPanel.add(proxy.evalWaterlowsRiskPanel);
                                    proxy.nwsApp.tabPanel.setActiveTab(proxy.evalWaterlowsRiskPanel);
                                }
                            }
                        ]
                    })
                    }


                ]})

        });

        this.scoreButton = new Ext.button.Button({
            text: '质控评分',
            id: proxy.nwsApp.id + '_27ggg080b88511e3be54aba4461d19g6',
            disabled: true,
            iconCls: 'icon-care-scores',
            height: this.BUTTON_HEIGHT_1,
            textAlign: 'left',
            handler: function () {
            },
            menu: this.nursingScoresMenu
        });
        this.specialEventButton = new Ext.button.Button({
            text: '质控指标',
            id: proxy.nwsApp.id + '_27ggg080b88511e3be54aba4461d19aa',
            disabled: true,
            width: 98,
            iconCls: 'icon-care-scores',
            height: this.BUTTON_HEIGHT_1,
            textAlign: 'left',
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.specialevent.SpecialEventForm({
                    closable: true,
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    nwsApp: proxy.nwsApp,
                    mod:proxy.nwsApp.id
                });
                proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                proxy.bodyTemperaturePanel.doLayout();
            }
        });
        this.startButton = new Ext.button.Button({
            text: '启动',
            disabled: true,
            iconCls: 'start-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            rowspan: 2,
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2
        });

        this.communicationButton = new Ext.button.Button({
            text: '通讯状态',
            id: proxy.nwsApp.id + '_8b7ed272c0a311e4865700262dff6a9e',
            disabled: true,
            iconCls: 'communication-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                var REGISTER_ID = "";
                if (proxy.nwsApp.bedPanel.patientInfo != null) {
                    REGISTER_ID = proxy.nwsApp.bedPanel.patientInfo.REGISTER_ID;
                }
                proxy.networkStateWindow = new com.dfsoft.icu.nws.networkstate.NetworkStateWindow({
                    REGISTER_ID: REGISTER_ID
                });
                proxy.nwsApp.showModalWindow(proxy.networkStateWindow);
                proxy.networkStateWindow.show();
            }
        });
        this.careSettingButton = new Ext.button.Button({
            text: '监护设置',
            id: proxy.nwsApp.id + '_22b5e2b078fd11e39fd9cb7044fb706f',
            disabled: true,
            iconCls: 'care-setting-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed != null) {
                    var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.CareSettingWindow', {
                        REGISTER_ID: currBed.REGISTER_ID,
                        PATIENT_ID: currBed.PATIENT_ID,
                        BED_ID: currBed.BED_ID,
                        patientName: currBed.NAME,
                        parentPanel: proxy.nwsApp
                    });
                    proxy.nwsApp.showModalWindow(dlg);
                    //dlg.showModalWindow();

                    // 加载当前床位上的信息
                    var basicSettingsForm = dlg.careSettingTabPanel.basicSettingsForm.getForm();
                    if (currBed.PATIENT_ID.length > 0) {
                        Ext.Ajax.request({
                            url: webRoot + '/nws/icu_patient/' + currBed.REGISTER_ID,
                            method: 'GET',
                            success: function (response) {
                                var respText = Ext.decode(response.responseText).data;
                                respText[0].CARE_START_TIME = Ext.util.Format.date(respText[0].CARE_START_TIME, "Y-m-d H:i");
                                var CARE_START_TIME = respText[0].CARE_START_TIME;
                                //if (CARE_START_TIME == null || CARE_START_TIME.length == 0) {
                                //   CARE_START_TIME = new Date();
                                //}
                                basicSettingsForm.findField('NURSE_ID').getStore().loadData([{"value": respText[0].NURSE_ID, "text": respText[0].NURSE_NAME}]);
                                basicSettingsForm.setValues({
                                    PATIENT_NAME: respText[0].NAME,
                                    HEIGHT: respText[0].HEIGHT,
                                    WEIGHT: respText[0].WEIGHT,
                                    CONDITION_CODE: respText[0].CONDITION_CODE,
                                    ALLERGIC_HISTORY: respText[0].ALLERGIC_HISTORY,
                                    DIAGNOSIS: respText[0].DIAGNOSIS,
                                    NURSE_ID: respText[0].NURSE_NAME,
                                    HIDDEN_NURSE_ID: respText[0].NURSE_ID,
                                    CARE_LEVEL: respText[0].CARE_LEVEL_CODE,
                                    CARE_START_TIME: CARE_START_TIME,
                                    CARE_INTERVAL: respText[0].CARE_INTERVAL,
                                    CARE_FREQUENCY: respText[0].CARE_FREQUENCY
                                });
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                            }
                        });
                    } else {
                        var fieldItemArray = basicSettingsForm.getFields().items;
                        for (var m = 0; m < fieldItemArray.length; m++) {
                            fieldItemArray[m].setDisabled(true);
                        }
                    }
                    // 加载当前床上上的适配器列表
                    var equipmentStore = dlg.careSettingTabPanel.basicSettingsForm.equipmentGrid.getStore();
                    equipmentStore.proxy.url = webRoot + '/nws/icu_beds/adapterList/' + currBed.BED_ID;
                    equipmentStore.load();
                    // 加载当前床上的监护项目树
                    var careProjectTreeGrid = dlg.careSettingTabPanel.careProjectTreeGrid;
                    if (careProjectTreeGrid) {
                        var careProjectTreeStore = careProjectTreeGrid.getStore();
                        careProjectTreeStore.proxy.url = webRoot + '/nws/icu_beds/items/' + currBed.BED_ID;
                        careProjectTreeStore.load();
                    }
                }
            },
            listeners: {
                afterrender: function (_this) {
                    if (proxy.nwsApp.bedPanel.patientInfo == null) {
                        _this.setDisabled(true);
                    }
                }
            }
        });

        this.medicalRecordButton = new Ext.button.Button({
            text: '病历',
            id: proxy.nwsApp.id + '_12a76a85ba6611e389cf87c04adb0118',
            disabled: true,
            iconCls: 'medical-record-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.CaseWindow', {
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID,
                    patientInfo:currBed
                });
                dlg.show();
            }
        });

        this.checkoutButton = new Ext.button.Button({
            text: '检验',
            id: proxy.nwsApp.id + '_34c76a85ba6611e389cf87c04adb0330',
            disabled: true,
            iconCls: 'checkout-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.ExamineWindow', {
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
            }
        });

        this.preoperativeInterviewButton = new Ext.button.Button({
            text: '术前访视',
            id: proxy.nwsApp.id + '_56e76a85ba6611e389cf87c04adb0552',
            disabled: true,
            iconCls: 'preoperative-interview-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                Ext.create('com.dfsoft.icu.medicalrecord.AnesthesiaOtherNoteWindow', {
                    title: '术前访视',
                    documentName: 'mbs-visits',
                    HOSPITAL_NUMBER: currBed.HOSPITAL_NUMBER
                }).show();
            }
        });

        this.anesthesiaNoteButton = new Ext.button.Button({
            text: '麻醉记录单',
            id: proxy.nwsApp.id + '_90i76a85ba6611e389cf87c04adb0999',
            disabled: true,
            iconCls: 'anesthesia-note-button',
            cls: 'nwsLargeButton',
            iconAlign: 'top',
            scale: 'large',
            rowspan: 2,
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                Ext.create('com.dfsoft.icu.medicalrecord.AnesthesiaNoteWindow', {
                    HOSPITAL_NUMBER: currBed.HOSPITAL_NUMBER
                }).show();
            }
        });

        this.imageButton = new Ext.button.Button({
            text: '影像',
            id: proxy.nwsApp.id + '_45d76a85ba6611e389cf87c04adb0441',
            disabled: true,
            iconCls: 'image-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    Ext.MessageBox.alert('提示', '请先选择患者！');
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.PictureWindow', {
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
//
//                Ext.Ajax.request({
//                    url: webRoot + '/adm/patient/picture/' + currBed.PATIENT_ID,
//
//                    success: function(response) {
//                        var reqmsg = Ext.decode(response.responseText);
//                        if (reqmsg.success === true) {
//                            if (reqmsg.data != "") {
//                                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.PictureWindow', {
//                                    parent: this,
//                                    PATIENT_ID: currBed.PATIENT_ID
//                                });
//                                dlg.show();
//                            } else {
//                                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.PictureWindow', {
//                                    parent: this,
//                                    PATIENT_ID: currBed.PATIENT_ID
//                                });
//                                dlg.show();
////                                Ext.Msg.show({
////                                    title: '提示',
////                                    msg: '没有查询到该病人的影像信息！',
////                                    buttons: Ext.Msg.OK,
////                                    icon: Ext.Msg.INFO
////                                });
//                            }
//                        } else {
//                            Ext.Msg.show({
//                                title: '错误',
//                                msg: '加载失败！',
//                                buttons: Ext.Msg.OK,
//                                icon: Ext.Msg.ERROR
//                            });
//                        }
//                    }
//                });
            }
        });

        this.postoperativeInterviewButton = new Ext.button.Button({
            text: '术后随访',
            id: proxy.nwsApp.id + '_78g76a85ba6611e389cf87c04adb0774',
            disabled: true,
            iconCls: 'postoperative-interview-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                Ext.create('com.dfsoft.icu.medicalrecord.AnesthesiaOtherNoteWindow', {
                    title: '术后随访',
                    documentName: 'mas-visits',
                    HOSPITAL_NUMBER: currBed.HOSPITAL_NUMBER
                }).show();
            }
        });

        this.doctorOrderButton = new Ext.button.Button({
            text: '医嘱',
            id: proxy.nwsApp.id + '_23b76a85ba6611e389cf87c04adb0229',
            disabled: true,
            iconCls: 'doctor-order-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                var doctorOrderForm = proxy.doctorOrderForm;

                var doctorOrderFormValues = {};
                if (doctorOrderForm && doctorOrderForm.hidden == false) {
                    try {
                        doctorOrderFormValues = doctorOrderForm.getValues();
                        doctorOrderFormValues.orderName = doctorOrderForm.getForm().findField('doctor-order-way').orderName;
                    } catch (e) {
                        doctorOrderFormValues = {};
                    }
                }
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.MedicalWindow', {
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID,
                    EXTRACT_TIME: doctorOrderFormValues['doctor-order-extract-time'],
                    ORDER_STATUS: doctorOrderFormValues['doctor-order-status'],
                    ORDER_WAY: doctorOrderFormValues['doctor-order-way'],
                    ORDER_TYPE: doctorOrderFormValues['doctor-order-type'],
                    ORDER_NAME: doctorOrderFormValues['orderName']
                });
                dlg.show();
                /*Ext.Ajax.request({
                 url: webRoot + '/adm/patient/medical/order/' + currBed.PATIENT_ID,
                 success: function(response) {
                 var reqmsg = Ext.decode(response.responseText);
                 if (reqmsg.success === true) {
                 if (reqmsg.data != "") {

                 } else {
                 Ext.Msg.show({
                 title: '提示',
                 msg: '没有查询到该病人的医嘱信息！',
                 buttons: Ext.Msg.OK,
                 icon: Ext.Msg.INFO
                 });
                 }
                 } else {
                 Ext.Msg.show({
                 title: '错误',
                 msg: '加载失败！',
                 buttons: Ext.Msg.OK,
                 icon: Ext.Msg.ERROR
                 });
                 }
                 }
                 });*/
            }
        });

        this.electrocardioButton = new Ext.button.Button({
            text: '血气分析',
            id: proxy.nwsApp.id + '_67f76a85ba6611e389cf87c04adb0663',
            disabled: true,
            iconCls: 'blood-gas-analy',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                /* proxy.networkStateWindow = new com.dfsoft.icu.nws.bloodgas.BloodGasWindow({
                 patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                 nwsApp: proxy.nwsApp
                 });*/
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;

                if (currBed == null) {
                    Ext.MessageBox.alert('提示', '请先选择患者！');
                    return;
                }
                proxy.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.bloodgas.BloodGasWindow', {
                    patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                    modal: false
                }));
            }
        });

        this.operationNursingButton = new Ext.button.Button({
            text: '手术护理',
            id: proxy.nwsApp.id + '_89h76a85ba6611e389cf87c04adb0885',
            disabled: true,
            iconCls: 'operation-nursing-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function () {
                if (proxy.nwsApp.bedPanel.patientInfo == null) {
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                Ext.create('com.dfsoft.icu.medicalrecord.AnesthesiaOtherNoteWindow', {
                    title: '手术护理',
                    documentName: 'mds-nurse-records',
                    HOSPITAL_NUMBER: currBed.HOSPITAL_NUMBER
                }).show();
            }
        });
        this.warningDiv = '<div id="alarm_panel" class="nwswarningdiv" style="padding:0px 0px 0px 0px"></div>';
        this.doctor_log = '<div id="doctor_log" class="doctorLogdiv" style="margin:0px 3px 0px 3px;padding:0px 0px 0px 2px"></div>';
        this.toolbar = new Ext.toolbar.Toolbar({
            items: [
                {
                    xtype: 'buttongroup',
                    title: '操作',
                    columns: 4,
                    items: [proxy.bedManagerButton, proxy.doctorOrderManagementButton, proxy.nursingRecordButton, proxy.icuVisitSysButton]
                },
                {
                    xtype: 'buttongroup',
                    title: '文书',
                    columns: 1,
                    items: [proxy.criticalCareButton, proxy.temperatureButton]
                },
                {
                    xtype: 'buttongroup',
                    title: '质控',
                    columns: 1,
                    items: [proxy.specialEventButton, proxy.scoreButton]
                },
                {
                    xtype: 'buttongroup',
                    title: '仪器',
                    columns: 1,
                    items: [proxy.communicationButton, proxy.careSettingButton]
                },
                {
                    xtype: 'buttongroup',
                    title: '病案',
                    id: proxy.nwsApp.id + '_46d76a85ba6611e389cf87c04adb0118',
                    disabled: true,
                    columns: 5,
                    items: [proxy.medicalRecordButton, proxy.checkoutButton, proxy.preoperativeInterviewButton,
                        proxy.postoperativeInterviewButton, proxy.anesthesiaNoteButton,
                        proxy.doctorOrderButton, proxy.imageButton, proxy.electrocardioButton,
                        proxy.operationNursingButton
                    ]
                },
                {
                    xtype: 'buttongroup',
                    title: '未执行医嘱',
                    // columns: 1,
                    height: 96,
                    layout: 'fit',
                    name: 'warning_div',
                    minWidth: 60,
                    html: this.warningDiv +
                        '<audio src="/audio/sound/warning.wav"  id="music_warning" name="music_warning"></audio >'
                },
                {
                    xtype: 'buttongroup',
                    title: '医嘱抽取日志',
                    name: 'doctor_log',
                    height: 96,
                    width: 50,
                    html: this.doctor_log
                }
            ]
        });
        this.elm = function (Obj) {
            return new Ext.LoadMask(Obj, {
                msg: "医嘱定位中，请稍候……",
                color: 'red'
                //backgroundcolor:'red'
                //background-color:black
            });
        }
        this.overLoad = function (daId) {
//            var divObj = Ext.ComponentQuery.query('buttongroup[title="未执行医嘱"]')[0];
//            var elmObj = this.elm(divObj);
            if (this.elmObj) {
                this.elmObj.hide();
            }
            // var daIdDiv = document.getElementById(daId);
            // daIdDiv.onclick = "Ext.getCmp('nws').nwsApp.nwsToolbar.locationDa("+daId+");";
            //Ext.getCmp(\'nws\').nwsApp.nwsToolbar.locationDa(this.id,document.getElementById(\''+ data.ID + 'nwsdaDate\').innerHTML);
        };
        // Location Doctor's advice 定位医嘱
        this.locationDa = function (daId, daDate) {

            var divObj = Ext.ComponentQuery.query('buttongroup[title="未执行医嘱"]')[0];
            var daIdDiv = document.getElementById(daId);

            this.elmObj = this.elm(divObj);

            // 设置遮罩底色
            this.elmObj.show();
            for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                if (proxy.nwsApp.tabPanel.items.items[i].title == "医嘱管理") {
                    proxy.nwsApp.tabPanel.setActiveTab(i);
                    proxy.nwsApp.tabPanel.items.items[i].findExecuteOrder(daId, daDate);
                    return;
                }
            }
            Ext.Ajax.request({
                url: webRoot + '/nws/doctorordermanagement/location_order',
                method: 'POST',
                params: {
                    extractDate: daDate,
                    findId: daId,
                    patientId: proxy.nwsApp.bedPanel.patientInfo.PATIENT_ID
                },
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        if (result.data >= 1) {
                            var start = (result.data - 1) * 25;
                            proxy.doctorOrderForm = new com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderForm({
                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                locationDate: daDate,
                                locationPage: result.data,
                                locationStart: start,
                                findExecuteOrderById: daId,
                                nwsApp: proxy.nwsApp
                            });
                            proxy.nwsApp.tabPanel.add(proxy.doctorOrderForm);
                            proxy.nwsApp.tabPanel.setActiveTab(proxy.doctorOrderForm);
                            setTimeout(function () {
                                proxy.doctorOrderForm.findExecuteOrder(daId, daDate);
                                //elmObj.hide();
                            }, 500);
                        } else {
                            proxy.doctorOrderForm = new com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderForm({
                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                locationDate: daDate,
                                findExecuteOrderById: daId,
                                nwsApp: proxy.nwsApp
                            });
                            proxy.nwsApp.tabPanel.add(proxy.doctorOrderForm);
                            proxy.nwsApp.tabPanel.setActiveTab(proxy.doctorOrderForm);
                            setTimeout(function () {
                                proxy.doctorOrderForm.findExecuteOrder(daId, daDate);
                                //elmObj.hide();
                            }, 500);
                        }
                    }
                }
            });


        };
        this.cancelWarning = function (daId) {
            var warningObj = document.getElementById(daId);
            if (warningObj != null) {
                warningObj.parentNode.removeChild(warningObj);
            }
        };
        this.callParent([
            {
                background: 'transparent',
                tbar: proxy.toolbar
            }
        ]);
        // 权限控制医生工作站工具栏
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp(proxy.nwsApp.id + '_' + resourceData[i].id);
            if (currButton != undefined) {
                currButton.setDisabled(false);
                // 监护设置和仪器共用一个权限
//                if (resourceData[i].id == '22b5e2b078fd11e39fd9cb7044fb706f') {
//                    this.startButton.setDisabled(false);
//                    this.communicationButton.setDisabled(false);
//                }
            }
        }

        if (proxy.nwsApp.id == 'nws') {
            this.on('afterrender', function (p, eOpts) {

                if (proxy.nwsApp.bedPanel.patientInfo != null) {
                    // 连接服务器，发送查询报警信息请求
                    var socket = io.connect(parent.webRoot);
                    // 请求查询数据
                    var params = [
                        {
                            registerId: proxy.nwsApp.bedPanel.patientInfo.PATIENT_ID,
                            careTime: Ext.Date.format(new Date(), 'Y-m-d H:i')
                        }
                    ];
                    socket.emit('careRecordWarning', params[0]);
                    // 接受告警信息并在页面展示
                    socket.on('warningdata', function (data) {
                        console.log("-－推送数据--start" );
                        console.log(data);
                        console.log("-－推送数据--end" );
                        //  var alarmDiv = document.getElementById("alarm_panel");
                        var alarmDiv = Ext.select("div.nwswarningdiv");
                        var doctorLogDiv = Ext.select("div.doctorLogdiv");

                        doctorLogDiv = doctorLogDiv.elements[0];
                        alarmDiv = alarmDiv.elements[0];
//                        var alarmdd = Ext.select("div.nwswarningdiv");

                        var alarmData = data.warningResult;
                        var doctorLogData = data.doctorLog;

                        var isPlay = false;
                        if (alarmDiv != undefined) {
                            alarmDiv.innerHTML = "";
                            if (alarmData.length > 0) {
                                for (var i = 0; i < alarmData.length; i++) {
                                    proxy.nwsApp.recordWarning.insertRecordWarning(alarmDiv, alarmData[i]);
                                }
                            }
                            if (isPlay) {
                                document.getElementById('music_warning').play();
                            }
                        }
                        if (doctorLogDiv != undefined) {
                            doctorLogDiv.innerHTML = "";
                            if (doctorLogData.length > 0) {
                                proxy.nwsApp.recordWarning.insertDoctorLog(doctorLogDiv, doctorLogData[0]);
                            }
                        }
                    });
                }
                // 重新设置警示框宽度
                this.on('resize', function (_this, width, height, oldWidth, oldHeight, eOpts) {
                    var divObj = this.down('[name=warning_div]');
                    var doctorObj = this.down('[name=doctor_log]');
                    if (width > 1200 + (visiturl == '' ? 0 : 65)) {
                        // divObj.setWidth(225);
                        divObj.setWidth(width - 964 - 146 - (visiturl == '' ? 0 : 65));
                        doctorObj.setWidth(146);
                    } else {
                        //divObj.setWidth(60);
                        divObj.setWidth(width - 955 - (visiturl == '' ? 0 : 65));
                        //doctorObj.setWidth(width - 1000);
                    }

                });
            });
        } else if (proxy.nwsApp.id == 'cms') {
//            var doctorLog = Ext.ComponentQuery.query('buttongroup[name="doctor_log"]')[0];
//            this.remove(doctorLog);
            //  this.remove(this.toolbar.items.items[5]);

            // var doctorLog = Ext.ComponentQuery.query('buttongroup[name="doctor_log"]')[0];
            // doctorLog.hidden = true;
        }

    }
});