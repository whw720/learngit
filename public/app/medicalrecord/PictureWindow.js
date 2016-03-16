//检验信息
Ext.define('com.dfsoft.icu.medicalrecord.PictureWindow', {
    extend: 'Ext.window.Window',

    uses: [

    ],

    layout: 'fit',
    title: '放射影像',
    modal: true,
    width: 1080,
    height: 600,
    border: false,
    iconCls: 'image',
    maximizable: true,

    initComponent: function() {
        var me = this;
        me.buttons = [{
            xtype: 'splitbutton',
            hidden: true,
            text: '打印',
            iconCls: 'print',
            handler: me.onPrint,
            scope: me,
            menu: [{
                text: '直接打印',
                iconCls: 'print',
                handler: me.onPrint,
                scope: me
            }, {
                text: '打印预览',
                iconCls: 'print-preview',
                handler: me.onPrint,
                scope: me
            }]
        }, {
            text: '刷新',
            iconCls: '',
            handler: me.recoverData,
            scope: me
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];
        me.items = [{
            anchor: '100%',
            border: false,
            layout: 'fit',
            items: [
                me.createPan()
            ]
        }];
        me.callParent();
    },

    createPan: function() {
        var me = this;
        me.navigation = me.createNavigation();
        me.dynamic = me.createDdynamic();
        var pan = Ext.createWidget('panel', {
            activeTab: 0,
            layout: 'border',
            border: false,
            padding: 5,
            bodyStyle: 'background: white',
            items: [me.navigation, me.dynamic]
        });
        return pan;
    },

    createNavigation: function() {
        var me = this;
        var clientStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'syncId',
                type: 'string'
            }, {
                name: 'photoDate',
                type: 'string'
            }, {
                name: 'devName',
                type: 'string'
            }],
            proxy: {
                type: 'ajax',
                url: webRoot + '/adm/patient/picture/store/' + me.PATIENT_ID,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true//,
//            listeners: {
//                load: function(_this, _records, successful, eOpts) {
//                    grid.getSelectionModel().select(0, true, false);
//                    grid.getView().focusRow(0);
//                    var selectionData = grid.getSelectionModel().getSelection();
//                    Ext.Function.defer(function() {
//                        var topWin = document.getElementById("pictureIframe").contentWindow;
//                        if (selectionData.length > 0) {
//                            Ext.Ajax.request({
//                                url: webRoot + '/adm/patient/picture/' + me.PATIENT_ID,
//                                method: 'GET',
//                                success: function(response) {
//                                    var reqmsg = Ext.decode(response.responseText);
//                                    if (reqmsg.success === true) {
//                                        if (reqmsg.data != "") {
//                                            var admexamine = Ext.decode(reqmsg.data[0].CONTENT);
//                                            for (var i = 0; i < admexamine.length; i++) {
//                                              //  console.log(selectionData[0].data.syncId);
//                                                if (admexamine[i].report.syncId == selectionData[0].data.syncId) {
//                                                    topWin['devName'].innerHTML = (admexamine[i].report.devName == null ? '' : admexamine[i].report.devName) + '诊断报告';
//                                                    topWin['examItemName'].innerHTML = admexamine[i].report.examItemName == null ? '' : admexamine[i].report.examItemName;
//                                                    topWin['checkNumber'].innerHTML = admexamine[i].report.checkNumber == null ? '' : admexamine[i].report.checkNumber;
//                                                    topWin['patientName'].innerHTML = admexamine[i].patient.name == null ? '' : admexamine[i].patient.name;
//                                                    topWin['gender'].innerHTML = admexamine[i].patient.gender == null ? '' : admexamine[i].patient.gender;
//                                                    topWin['age'].innerHTML = admexamine[i].patient.age == null ? '' : admexamine[i].patient.age;
//                                                    topWin['departments'].innerHTML = admexamine[i].patient.departments == null ? '' : admexamine[i].patient.departments;
//                                                    topWin['hospitalNumber'].innerHTML = admexamine[i].patient.hospitalNumber == null ? '' : admexamine[i].patient.hospitalNumber;
//                                                    topWin['examName'].innerHTML = admexamine[i].report.examName == null ? '' : admexamine[i].report.examName;
//                                                    topWin['photoDate'].innerHTML = admexamine[i].report.photoDate == null ? '' : admexamine[i].report.photoDate;
//                                                    topWin['examDesc'].innerHTML = admexamine[i].report.examDesc == null ? '' : admexamine[i].report.examDesc;
//                                                    topWin['examResultDetail'].innerHTML = admexamine[i].report.examResultDetail == null ? '' : admexamine[i].report.examResultDetail;
//                                                    topWin['examDiagnosis'].innerHTML = admexamine[i].report.examDiagnosis == null ? '' : admexamine[i].report.examDiagnosis;
//                                                    topWin['doctorName'].innerHTML = admexamine[i].report.doctorName == null ? '' : admexamine[i].report.doctorName;
//                                                    topWin['approvePeople'].innerHTML = admexamine[i].report.approvePeople == null ? '' : admexamine[i].report.approvePeople;
//                                                    topWin['reportTime'].innerHTML = admexamine[i].report.reportTime == null ? '' : admexamine[i].report.reportTime;
//                                                }
//                                            }
//                                        }
//                                    } else {
//                                        Ext.Msg.show({
//                                            title: '错误',
//                                            msg: '加载失败！',
//                                            buttons: Ext.Msg.OK,
//                                            icon: Ext.Msg.ERROR
//                                        });
//                                    }
//                                }
//                            });
//                        }
//                    }, 500);
//                }
//            }
        });
        var grid = Ext.create('Ext.grid.Panel', {
            border: 1,
            width: 245,
            region: 'west',
            bodyStyle: 'background: rgb(245, 245, 245)',
            split: {
                size: 5
            },
            minWidth: 220,
            store: clientStore,
            columnLines: true,
            columns: [{
                dataIndex: 'syncId',
                sortable: false,
                hidden: true
            }, {
                text: '检查日期',
                width: '60%',
                dataIndex: 'photoDate',
                sortable: false,
                style: 'text-align:center;font: normal 14px tahoma, 宋体;font-weight:bold;color: darkgreen;',
                renderer: format
            }, {
                text: '检查仪器',
                width: '39%',
                dataIndex: 'devName',
                sortable: false,
                style: 'text-align:center;font: normal 14px tahoma, 宋体;font-weight:bold;color: darkgreen;',
                renderer: format
            }],
            listeners: {
                itemclick: function(view, record, item, index, e) {
                    var topWin = document.getElementById("pictureIframe").contentWindow;
                    Ext.Ajax.request({
                        url: webRoot + '/adm/patient/picture/' + record.data.syncId,
                        method: 'GET',
                        success: function(response) {
                            var reqmsg = Ext.decode(response.responseText);
                           // console.log(response.responseText);
                            if (reqmsg.success === true) {
                                if (reqmsg.data != "") {
                                   // console.log(reqmsg);
                                    var admexamine = Ext.decode(reqmsg.data[0].CONTENT);
                                            topWin['devName'].innerHTML = (admexamine.report.devName == null ? '' : admexamine.report.devName) + '诊断报告';
                                            topWin['examItemName'].innerHTML = admexamine.report.examItemName == null ? '' : admexamine.report.examItemName;
                                            topWin['checkNumber'].innerHTML = admexamine.report.checkNumber == null ? '' : admexamine.report.checkNumber;
                                            topWin['patientName'].innerHTML = admexamine.patient.name == null ? '' : admexamine.patient.name;
                                            topWin['gender'].innerHTML = admexamine.patient.gender == null ? '' : admexamine.patient.gender;
                                            topWin['age'].innerHTML = admexamine.patient.age == null ? '' : admexamine.patient.age;
                                            topWin['departments'].innerHTML = admexamine.patient.departments == null ? '' : admexamine.patient.departments;
                                            topWin['hospitalNumber'].innerHTML = admexamine.patient.hospitalNumber == null ? '' : admexamine.patient.hospitalNumber;
                                            topWin['examName'].innerHTML = admexamine.report.examName == null ? '' : admexamine.report.examName;
                                            topWin['photoDate'].innerHTML = admexamine.report.photoDate == null ? '' : admexamine.report.photoDate;
                                            topWin['examDesc'].innerHTML = admexamine.report.examDesc == null ? '' : admexamine.report.examDesc;
                                            topWin['examResultDetail'].innerHTML = admexamine.report.examResultDetail == null ? '' : admexamine.report.examResultDetail;
                                            topWin['examDiagnosis'].innerHTML = admexamine.report.examDiagnosis == null ? '' : admexamine.report.examDiagnosis;
                                            topWin['doctorName'].innerHTML = admexamine.report.doctorName == null ? '' : admexamine.report.doctorName;
                                            topWin['approvePeople'].innerHTML = admexamine.report.approvePeople == null ? '' : admexamine.report.approvePeople;
                                            topWin['reportTime'].innerHTML = admexamine.report.reportTime == null ? '' : admexamine.report.reportTime;

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
                    });
                }
            }
        });

        function format(value, metadata) {
            metadata.style = "text-align:left;font: normal 12px tahoma, 宋体;color: darkgreen;";
            return value;
        }
        return grid;
    },

    createDdynamic: function() {
        var ddynamic = Ext.createWidget('panel', {
            activeTab: 0,
            border: true,
            region: 'center',
            margin: '0 0 0 0',
            bodyStyle: 'background: rgb(245, 245, 245)',
            items: [{
                xtype: "component",
                id: 'pictureIframe',
                anchor: '100%',
                width: '100%',
                height: '100%',
                autoEl: {
                    tag: 'iframe',
                    frameborder: '0',
                    src: this.getExaminePath()
                }
            }]
        });
        return ddynamic;
    },

    onPrint: function() {
        var pictureIframe = document.getElementById('pictureIframe').contentWindow;
        pictureIframe.print();
    },

    getExaminePath: function() {
        var path = webRoot + '/templates/' + templates + '/medicalrecord/adm-patient-picture.html';
        return path;
    },
    //提取数据
    recoverData:function(btn){
        var me = this;

        if(!btn.ownerCt.ownerCt.patientInfo.SID||btn.ownerCt.ownerCt.patientInfo.SID==''){
            Ext.MessageBox.alert('提示', '该患者没有HIS信息!');
            return;
        }
        btn.disable();
        var params = {};
        params.provider = 'pacs-picture-icu';
        params.timestamp = 'null';
        params.identifier = btn.ownerCt.ownerCt.patientInfo.SID;
        params.timestampEnd = 'null';
        params.model = "HIS";
        params.patientId = btn.ownerCt.ownerCt.patientInfo.PATIENT_ID;
        Ext.Ajax.request({
        	url:parent.webRoot +  '/link/requestSyncPicture/'+params.provider+'/'+params.timestamp+'/'+params.identifier+'/'+params.timestampEnd +'/'+params.model+'/'+params.patientId ,
            method: 'GET',
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                // 接下来加载数据，到现场再弄吧。
                    if(reqmsg.data.success==false&&(reqmsg.data.msg||reqmsg.data.msg=="")){
                        if(reqmsg.data.msg&&'返回数据为空'==reqmsg.data.msg) {
                            btn.enable();
                            return false;
                        }
                        Ext.Msg.alert('加载失败',reqmsg.data.msg);
                        btn.enable();
                        return false;
                    }
                    me.navigation.getStore().load();
                    btn.enable();
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
    }
});