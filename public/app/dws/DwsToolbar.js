/**
 * 医生工作站菜单栏
 * Created by dfsoft on 14-3-25.
 */
Ext.define('com.dfsoft.icu.dws.DwsToolbar', {
    extend: 'Ext.Panel',
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        var BUTTON_HEIGHT_3 = 82; //三行button高度
        var BUTTON_HEIGHT_2 = 59; //两行行button高度
        var BUTTON_HEIGHT_1 = 27; //一行行button高度
        var BUTTON_WIDTH_2 = 58; //两行行button宽度
        this.nursingScoresMenu = new com.dfsoft.icu.nws.NursingScoresMenu({
            nwsApp: proxy.dwsApp,
            mod:"dws"
        });
        this.bedManagerButton = new Ext.button.Button({
            text: '监护中心',
            id: 'dws_65109a70bad711e386ab3745e188dc61',
            disabled: true,
            iconCls: 'dws-tutelage-center',
            cls: 'dwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: BUTTON_HEIGHT_2,
            width: BUTTON_WIDTH_2,
            handler: function() {
                for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.dwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.careCenterPanel = new com.dfsoft.icu.nws.CareCenterPanel({nwsApp: proxy.dwsApp, title: '监护中心', closable: true});
                proxy.dwsApp.careCenterPanel = proxy.careCenterPanel;
                proxy.dwsApp.tabPanel.add(proxy.careCenterPanel);
                proxy.dwsApp.tabPanel.setActiveTab(proxy.careCenterPanel);
            }
        });

        this.doctorOrderManagementButton = new Ext.button.Button({
            text: '医嘱管理',
            id: 'dws_76209a70bad711e386ab3745e188ea72',
            disabled: true,
            iconCls: 'dws-doctor-order-management-button',
            cls: 'dwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: BUTTON_HEIGHT_2,
            width: BUTTON_WIDTH_2,
            handler: function() {
                for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.dwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.doctorOrderForm = new com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderForm({
                    dwsApp: proxy.dwsApp
                });
                proxy.dwsApp.tabPanel.add(proxy.doctorOrderForm);
                proxy.dwsApp.tabPanel.setActiveTab(proxy.doctorOrderForm);
            }
        });
        this.criticalCareButton = new Ext.button.Button({
            text: '特护单',
            id: 'dws_ea41e7a0ab8311e382ed3b2ee09a2227',
            disabled: true,
            iconCls: 'dws-critical-care-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                if (proxy.dwsApp.bedPanel.findPatientState(proxy.dwsApp.bedPanel.patientInfo.REGISTER_ID)=='a34df80078fd11e39fd9cb7044fca372') {
                    Ext.MessageBox.alert('提示', '不能查看待入科患者的特护单!');
                    return;
                }
                for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.dwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                /*proxy.criticalCarePanel = new com.dfsoft.icu.nws.criticalcare.CriticalCarePanel({
                    patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                    parentPanel: proxy.dwsApp
                });*/
                proxy.criticalCarePanel = new com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyPanel({
                    patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                    closable: true,
                    title: '特护单',
                    parentPanel: proxy.dwsApp
                });
                proxy.dwsApp.tabPanel.add(proxy.criticalCarePanel);
                proxy.dwsApp.tabPanel.setActiveTab(proxy.criticalCarePanel);
            }
        });

        this.temperatureButton = new Ext.button.Button({
            text: '体温单',
            id: 'dws_fb52e7a0ab8311e382ed3b2ee09a3338',
            disabled: true,
            iconCls: 'dws-temperature-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.dwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePanel({
                    patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                    parentPanel: proxy.dwsApp
                });
                proxy.dwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                proxy.dwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
            }
        });

        this.scoreButton = new Ext.button.Button({
            text: '护理评分',
            id: 'dws_27ggg080b88511e3be54aba4461d19g6',
            disabled: true,
            iconCls: 'dws-icon-care-scores',
            height: BUTTON_HEIGHT_1,
            textAlign: 'left',
            menu: this.nursingScoresMenu
        });

        this.valuationButton = new Ext.button.Button({
            text: '护理评估',
            id: 'dws_16fff080b88511e3be54aba4461d08f5',
            disabled: true,
            iconCls: 'dws-valuation-button',
            height: BUTTON_HEIGHT_1,
            menu: new Ext.menu.Menu({
                items: [
                    {
                    text: '入院护理评估',
                    iconCls: 'valuation-button',
                    handler: function() {
                        for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                            if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                                proxy.dwsApp.tabPanel.setActiveTab(i);
                                return;
                            }
                        }
                        proxy.evalIntoHospitalPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalIntoHospitalPanel({
                            patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                            mod:'dws'
                        });
                        proxy.dwsApp.tabPanel.add(proxy.evalIntoHospitalPanel);
                        proxy.dwsApp.tabPanel.setActiveTab(proxy.evalIntoHospitalPanel);
                    }
                }, {
                    text: '住院护理评估',
                    iconCls: 'valuation-button',
                    handler: function() {
                        for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                            if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                                proxy.dwsApp.tabPanel.setActiveTab(i);
                                return;
                            }
                        }
                        proxy.evalBeInHospitalPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalBeInHospitalPanel({
                            patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                            mod:'dws'

                        });
                        proxy.dwsApp.tabPanel.add(proxy.evalBeInHospitalPanel);
                        proxy.dwsApp.tabPanel.setActiveTab(proxy.evalBeInHospitalPanel);
                    }
                }, {
                    text: '疼痛评估',
                    iconCls: 'valuation-button',
                    handler: function() {
                        for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                            if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                                proxy.dwsApp.tabPanel.setActiveTab(i);
                                return;
                            }
                        }
                        proxy.evalPainPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalPainPanel({
                            patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                            mod:'dws'
                        });
                        proxy.dwsApp.tabPanel.add(proxy.evalPainPanel);
                        proxy.dwsApp.tabPanel.setActiveTab(proxy.evalPainPanel);
                    }
                }, {
                    text: '导管滑脱危险因素评估',
                    iconCls: 'valuation-button',
                    handler: function() {
                        for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                            if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                                proxy.dwsApp.tabPanel.setActiveTab(i);
                                return;
                            }
                        }
                        proxy.evalCatheterRiskPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalCatheterRiskPanel({
                            patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                            mod:'dws'
                        });
                        proxy.dwsApp.tabPanel.add(proxy.evalCatheterRiskPanel);
                        proxy.dwsApp.tabPanel.setActiveTab(proxy.evalCatheterRiskPanel);
                    }
                }, {
                    text: '跌倒/坠床因素评估',
                    iconCls: 'valuation-button',
                    handler: function() {
                        for (var i = 0; i < proxy.dwsApp.tabPanel.items.items.length; i++) {
                            if (proxy.dwsApp.tabPanel.items.items[i].title == this.text) {
                                proxy.dwsApp.tabPanel.setActiveTab(i);
                                return;
                            }
                        }
                        proxy.evalFallRiskPanel = new com.dfsoft.icu.nws.nursingevaluation.EvalFallRiskPanel({
                            patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                            mod:'dws'
                        });
                        proxy.dwsApp.tabPanel.add(proxy.evalFallRiskPanel);
                        proxy.dwsApp.tabPanel.setActiveTab(proxy.evalFallRiskPanel);
                    }
                }]
            })
        });

        /**
         *

         this.preoperativeInterviewButton = new Ext.button.Button({
            text: '术前访视',
            iconCls: 'preoperative-interview-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function() {
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
            iconCls: 'anesthesia-note-button',
            cls: 'nwsLargeButton',
            iconAlign: 'top',
            scale: 'large',
            rowspan: 2,
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function() {
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
            iconCls: 'image-button',
            height: this.BUTTON_HEIGHT_1,
            handler: function() {
                var currBed = proxy.nwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.PictureWindow', {
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
            }
        });

         * @type {Ext.button.Button}
         */
        this.medicalRecordButton = new Ext.button.Button({
            text: '病历',
            id: proxy.dwsApp.id + '_12a76a85ba6611e389cf87c04adb0118',
            disabled: true,
            iconCls: 'dws-medical-record-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.CaseWindow', {
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
            }
        });

        this.checkoutButton = new Ext.button.Button({
            text: '检验',
            id: proxy.dwsApp.id + '_34c76a85ba6611e389cf87c04adb0330',
            disabled: true,
            iconCls: 'dws-checkout-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.ExamineWindow', {
                    patientInfo:currBed,
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
            }
        });

        this.preoperativeInterviewButton = new Ext.button.Button({
            text: '术前访视',
            id: proxy.dwsApp.id + '_56e76a85ba6611e389cf87c04adb0552',
            disabled: true,
            iconCls: 'dws-preoperative-interview-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
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
            id: proxy.dwsApp.id + '_90i76a85ba6611e389cf87c04adb0999',
            disabled: true,
            iconCls: 'dws-anesthesia-note-button',
            cls: 'dwsLargeButton',
            iconAlign: 'top',
            scale: 'large',
            rowspan: 2,
            height: BUTTON_HEIGHT_2,
            width: BUTTON_WIDTH_2,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
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
            id: proxy.dwsApp.id + '_45d76a85ba6611e389cf87c04adb0441',
            disabled: true,
            iconCls: 'dws-image-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
                if (currBed == null) {
                    return;
                }
                var dlg = Ext.create('com.dfsoft.icu.medicalrecord.PictureWindow', {
                    patientInfo: currBed,
                    parent: this,
                    PATIENT_ID: currBed.PATIENT_ID
                });
                dlg.show();
            }
        });

        this.postoperativeInterviewButton = new Ext.button.Button({
            text: '术后随访',
            id: proxy.dwsApp.id + '_78g76a85ba6611e389cf87c04adb0774',
            disabled: true,
            iconCls: 'dws-postoperative-interview-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
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
            id: proxy.dwsApp.id + '_23b76a85ba6611e389cf87c04adb0229',
            disabled: true,
            iconCls: 'dws-doctor-order-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
                var doctorOrderForm=proxy.doctorOrderForm;

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
            id: proxy.dwsApp.id + '_67f76a85ba6611e389cf87c04adb0663',
            disabled: true,
            iconCls: 'blood-gas-analy',
            height:BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                /* proxy.networkStateWindow = new com.dfsoft.icu.nws.bloodgas.BloodGasWindow({
                 patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                 nwsApp: proxy.nwsApp
                 });*/
                proxy.dwsApp.showModalWindowDws(Ext.create('com.dfsoft.icu.nws.bloodgas.BloodGasWindow', {
                    patientInfo: proxy.dwsApp.bedPanel.patientInfo,
                    modal:false
                }));
                //proxy.networkStateWindow.show();

            }
        });

        this.operationNursingButton = new Ext.button.Button({
            text: '手术护理',
            id: proxy.dwsApp.id + '_89h76a85ba6611e389cf87c04adb0885',
            disabled: true,
            iconCls: 'dws-operation-nursing-button',
            height: BUTTON_HEIGHT_1,
            handler: function() {
                if(proxy.dwsApp.bedPanel.patientInfo==null){
                    Ext.MessageBox.alert('提示', '请选择床位病人信息!');
                    return;
                }
                var currBed = proxy.dwsApp.bedPanel.patientInfo;
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
//console.log(proxy.dwsApp.bedPanel.patientInfo);
//        this.warning=new Ext.ux.IFrame({
//            padding:'0',
//            autoScroll:false,
//            margin:'0',
//            border: false,
//            src:'/app/dws/dws_warning.html'
//            //src:'/app/dws/dws_warning.html?PATIENT_ID='+ proxy.dwsApp.bedPanel.patientInfo.REGISTER_ID
//        });

        this.callParent([{
            background: 'transparent',
            tbar: [{
                xtype: 'buttongroup',
                title: '操作',
                columns: 2,
                items: [proxy.bedManagerButton, proxy.doctorOrderManagementButton]
            }, {
                xtype: 'buttongroup',
                title: '文书',
                columns: 1,
                items: [proxy.criticalCareButton, proxy.temperatureButton]
            }, {
                xtype: 'buttongroup',
                title: '评估',
                columns: 1,
                items: [proxy.valuationButton, proxy.scoreButton]
            }, {
                xtype: 'buttongroup',
                title: '病案',
                id: 'dws_46d76a85ba6611e389cf87c04adb0118',
                disabled: true,
                columns: 5,
                items: [proxy.medicalRecordButton, proxy.checkoutButton, proxy.preoperativeInterviewButton,
                    proxy.postoperativeInterviewButton, proxy.anesthesiaNoteButton,
                    proxy.doctorOrderButton, proxy.imageButton, proxy.electrocardioButton,
                    proxy.operationNursingButton
                ]
            },{
                xtype: 'buttongroup',
                title: '警示',
                height: 96,
                layout: 'fit',
                padding:'0',
                name: 'warning_div',
                minWidth: 255,
                //items:[this.warning]
                items:[]

//                html: '<div id="alarm_panel" class="dws-warningdiv" ></div>' +
//                    '<audio src="/audio/sound/warning.wav"  id="music_warning" name="music_warning"></audio >'
            }]
        }]);

        // 权限控制医生工作站工具栏
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp('dws_' + resourceData[i].id);
            if (currButton != undefined) {
                currButton.setDisabled(false);
            }
        }
        this.on('afterrender', function(p, eOpts) {
            // 请求查询数据
//            if (proxy.dwsApp.bedPanel.patientInfo != null) {
//                // 连接服务器，发送查询报警信息请求
//                var socket = io.connect(parent.webRoot);
//                var params = {
//                    registerId: proxy.dwsApp.bedPanel.patientInfo.REGISTER_ID,
//                    careTime: Ext.Date.format(new Date(), 'Y-m-d H:i')
//                };
//                socket.emit('careRecordWarning', params);
//
//                // 接受告警信息并在页面展示
//                socket.on('warningdata', function(data) {
//                    var alarmDiv = document.getElementById("alarm_panel");
//                    var isPlay = false;
//                    for (var i = 0; i < data.length; i++) {
//                        var careValue = data[i].CARE_VALUE;
//                        var careTime = data[i].CARE_TIME;
//                        var color = data[i].COLOR;
//                        var formulaStr = data[i].FORMULA;
//                        var description = data[i].DESCRIPTION;
//                        var arrStr = formulaStr.split('|');
//                        var desStr = description.split('|');
//                        var colorStr = color.split('|');
//                        for (j = 0; j < arrStr.length; j++) {
//                            var formulaObj = Ext.decode(arrStr[j]);
//                            var f2 = (new Function("return " + formulaObj.FORMULA_FUNCTION))();
//                            var res = f2(careValue);
//                            if (res != false) {
//                                isPlay = true;
//                                var text = "<div>" +
//                                    "<font color=blue>" + careTime + "</font>" + " " +
//                                    "<font color=" + colorStr + ">" + desStr[j] + "</font></div><br>";
//
//                                alarmDiv.innerHTML = text;
//                                alarmDiv.title = careTime + " " + desStr[j];
//                            }
//                        }
//                    }
//                    if (isPlay) {
//                        document.getElementById('music_warning').play();
//                    }
//                });
//            }
        });
        this.on('afterrender', function(p, eOpts) {

//
//            if (proxy.dwsApp.bedPanel.patientInfo != null) {
//                // 连接服务器，发送查询报警信息请求
//                var socket = io.connect(parent.webRoot);
//                // 请求查询数据
//                var params = [{
//                    registerId: proxy.dwsApp.bedPanel.patientInfo.REGISTER_ID,
//                    careTime: Ext.Date.format(new Date(), 'Y-m-d H:i')
//                }];
//                socket.emit('careDwsAnimaWarning',params[0]);
////                // 接受告警信息并在页面展示
//                socket.on('AnimaDwsWarningdata', function(data) {
//                    var alarmDiv = Ext.select("div.dws-warningdiv");
//                    alarmDiv =  alarmDiv.elements[0];
//                    var isPlay = false;
//                    if(alarmDiv!=undefined){
//                    alarmDiv.innerHTML = "";
//                    if(data.length > 0){
//                        for(var i = 0;i < data.length;i++){
//                            alarmDiv.innerHTML = alarmDiv.innerHTML + '<div style="color:#F00;height:19px;padding:0;margin:0;cursor:default;">【' +data[i].name +'】 值：'+ data[i].CARE_VALUE + '<span style="color:#4D924D;padding:0;"> 护理时间：' +data[i].CARE_TIME + '</span></div>';
//                                }
//                    }
//                    if (isPlay) {
//                        document.getElementById('music_warning').play();
//                    }}
//
//                });
//            }


        });
        // 重新设置警示框宽度
        this.on('resize', function(_this, width, height, oldWidth, oldHeight, eOpts) {
            var divObj = this.down('[name=warning_div]');
            divObj.setWidth(width - 785);
        });
    }

});