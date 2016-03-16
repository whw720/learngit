//检验信息
Ext.define('com.dfsoft.icu.medicalrecord.ExamineWindow', {
    extend: 'Ext.window.Window',

    uses: [

    ],

    layout: 'fit',
    title: '检验信息',
    modal: true,
    width: 1080,
    height: 600,
    border: false,
    iconCls: 'examine-info',
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
            },{
                name: 'samplingDate',
                type: 'string'
            }, {
                name: 'instrument',
                type: 'string'
            }],
            proxy: {
                type: 'ajax',
                url: 'adm/patient/examine/store/' + me.PATIENT_ID,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
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
                text: '采样日期',
                width: '51%',
                dataIndex: 'samplingDate',
                sortable: false,
                style: 'text-align:center;font: normal 14px tahoma, 宋体;font-weight:bold;color: darkgreen;',
                renderer: format
            }, {
                text: '分析仪器',
                width: '48%',
                dataIndex: 'instrument',
                sortable: false,
                style: 'text-align:center;font: normal 14px tahoma, 宋体;font-weight:bold;color: darkgreen;',
                renderer: format
            }],
            listeners: {
                itemclick: function(view, record, item, index, e) {
                        Ext.Ajax.request({
                            url: webRoot + '/adm/patient/examine/' + record.data.syncId,
                            success: function(response) {
                                var reqmsg = Ext.decode(response.responseText);
                                if (reqmsg.success === true) {
                                    if (reqmsg.data != "") {
                                    	var topWin = document.getElementById("examineIframe").contentWindow;
                                        var admexamine = Ext.decode(reqmsg.data[0].CONTENT);
                                            	var span = topWin.document.getElementsByTagName('span');
                                                for (var j = 0; j < span.length; j++) {
                                                    if (span[j].id != "") {
                                                        if (eval('admexamine.' + span[j].id) != "") {
                                                            topWin[span[j].id].innerHTML = eval('admexamine.' + span[j].id);
                                                        } else if (eval('admexamine.' + span[j].id) == "") {
                                                            topWin[span[j].id].innerHTML = "&nbsp;";
                                                        }
                                                    }
                                                }
                                                var strD = '';
                                                var dataLength = admexamine.records.length;
                                                for (var k = 0; k < admexamine.records.length; k++) {
                                                    strD += '<div style="display: table-row;">' +
                                                        '<div style="display: table; width: 100%">' +
                                                        '<span style="display: table-cell; width: 35px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (k + 1) + '</span>' +
                                                        '<span style="display: table-cell; width: 230px;">&nbsp;&nbsp;' + (admexamine.records.item == "" ? "&nbsp;" : admexamine.records[k].item) + '</span>' +
                                                        '<span class="tabSpan1" style="display: table-cell; width: 150px;">' + (admexamine.records[k].result == null ? "&nbsp;" : admexamine.records[k].result) + '</span>' +
                                                        '<span class="tabSpan1" style="display: table-cell; width: 50px;">' + (admexamine.records[k].unit == null ? "&nbsp;" : admexamine.records[k].unit) + '</span>' +
                                                        '<span class="tabSpan1" style="display: table-cell; width: 150px;">' + (admexamine.records[k].referenceValue == null ? "&nbsp;" : admexamine.records[k].referenceValue) + '</span>' +
                                                        '<span style="display: table-cell;">' + (admexamine.records[k].prompt == null ? "&nbsp;" : admexamine.records[k].prompt) + '</span>' +
                                                        '</div>' +
                                                        '</div>';
                                                }
                                                strD += '</div>';
                                                var nodeD = topWin["dbody"];
                                                nodeD.style.height = '0px';
                                                var insertedNodeD = document.createElement("div");
                                                insertedNodeD.id = "dtab";
                                                if (dataLength > 9) {
                                                    insertedNodeD.style.height = "auto";
                                                } else {
                                                    insertedNodeD.style.height = "250px";
                                                }
                                                insertedNodeD.innerHTML = strD;
                                                nodeD.innerHTML=strD;
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
//        grid.store.on("load", function() {
//            grid.getSelectionModel().select(0, true, false);
//            grid.getView().focusRow(0);
//            var selectionData = grid.getSelectionModel().getSelection();
//            Ext.Function.defer(function() {
//                var topWin = document.getElementById("examineIframe").contentWindow;
//                if (selectionData.length > 0) {
//                    Ext.Ajax.request({
//                        url: webRoot + '/adm/patient/examine/' + me.PATIENT_ID,
//                        success: function(response) {
//                            var reqmsg = Ext.decode(response.responseText);
//                            if (reqmsg.success === true) {
//                                if (reqmsg.data != "") {
//                                    var admexamine = Ext.decode(reqmsg.data[0].CONTENT);
//                                    for (var i = 0; i < admexamine.length; i++) {
//                                        if (admexamine[i].patient.samplingDate == selectionData[0].data.samplingDate && admexamine[i].report.instrument == selectionData[0].data.instrument) {
//                                            var span = topWin.document.getElementsByTagName('span');
//                                            for (var j = 0; j < span.length; j++) {
//                                                if (span[j].id != "") {
//                                                    if (eval('admexamine[i].' + span[j].id) != "") {
//                                                        topWin[span[j].id].innerHTML = eval('admexamine[i].' + span[j].id);
//                                                    } else if (eval('admexamine[i].' + span[j].id) == "") {
//                                                        topWin[span[j].id].innerHTML = "&nbsp;";
//                                                    }
//                                                }
//                                            }
//                                            var strD = '';
//                                            var dataLength = admexamine[i].records.length;
//                                            for (var k = 0; k < admexamine[i].records.length; k++) {
//                                                strD += '<div style="display: table-row;">' +
//                                                    '<div style="display: table; width: 100%">' +
//                                                    '<span style="display: table-cell; width: 35px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (k + 1) + '</span>' +
//                                                    '<span style="display: table-cell; width: 230px;">&nbsp;&nbsp;' + (admexamine[i].records[k].item == "" ? "&nbsp;" : admexamine[i].records[k].item) + '</span>' +
//                                                    '<span class="tabSpan1" style="display: table-cell; width: 150px;">' + (admexamine[i].records[k].result == "" ? "&nbsp;" : admexamine[i].records[k].result) + '</span>' +
//                                                    '<span class="tabSpan1" style="display: table-cell; width: 50px;">' + (admexamine[i].records[k].unit == "" ? "&nbsp;" : admexamine[i].records[k].unit) + '</span>' +
//                                                    '<span class="tabSpan1" style="display: table-cell; width: 150px;">' + (admexamine[i].records[k].referenceValue == "" ? "&nbsp;" : admexamine[i].records[k].referenceValue) + '</span>' +
//                                                    '<span style="display: table-cell;">' + (admexamine[i].records[k].prompt == "" ? "&nbsp;" : admexamine[i].records[k].prompt) + '</span>' +
//                                                    '</div>' +
//                                                    '</div>';
//                                            }
//                                            strD += '</div>';
//                                            var nodeD = topWin["dbody"];
//                                            nodeD.style.height = '0px';
//                                            var insertedNodeD = document.createElement("div");
//                                            insertedNodeD.id = "dtab";
//                                            if (dataLength > 9) {
//                                                insertedNodeD.style.height = "auto";
//                                            } else {
//                                                insertedNodeD.style.height = "250px";
//                                            }
//                                            insertedNodeD.innerHTML = strD;
//                                            //nodeD.parentNode.appendChild(insertedNodeD);
//                                            nodeD.innerHTML=strD;
//                                        }
//                                    }
//                                }
//                            } else {
//                                Ext.Msg.show({
//                                    title: '错误',
//                                    msg: '加载失败！',
//                                    buttons: Ext.Msg.OK,
//                                    icon: Ext.Msg.ERROR
//                                });
//                            }
//                        }
//                    });
//                }
//            }, 1000);
//        });

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
            id: 'ddynamicPanel',
            region: 'center',
            margin: '0 0 0 0',
            bodyStyle: 'background: rgb(245, 245, 245)',
            items: [{
                xtype: "component",
                id: 'examineIframe',
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
        var examineIframe = document.getElementById('examineIframe').contentWindow;
        examineIframe.print();
    },

    getExaminePath: function() {
        var path = '/templates/' + templates + '/medicalrecord/adm-patient-examine.html';
        return path;
    },
  //提取数据
    recoverData:function(btn){
    	var me = this;
        var params = {};
        params.provider = 'examine-icu';
        params.timestamp = 'null';
        if(btn.ownerCt.ownerCt.patientInfo.SID&&btn.ownerCt.ownerCt.patientInfo.SID!=''){
        	me.setDisabled(true);
        	params.identifier = btn.ownerCt.ownerCt.patientInfo.SID;
        }else{
            Ext.MessageBox.alert('提示', '该患者没有HIS信息!');
        	return;
        }
        params.timestampEnd = 'null';
        params.model = "HIS";
        params.patientId = btn.ownerCt.ownerCt.patientInfo.PATIENT_ID;
        Ext.Ajax.request({
            url:parent.webRoot +  '/link/requestSyncExamine/'+params.provider+'/'+params.timestamp+'/'+params.identifier+'/'+params.timestampEnd +'/'+params.model+'/'+params.patientId ,
            method: 'GET',
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    if(reqmsg.data.success==false&&(reqmsg.data.msg||reqmsg.data.msg=="")){
                        if(reqmsg.data.msg&&'返回数据为空'==reqmsg.data.msg) {
                            btn.enable();
                            me.setDisabled(false);
                            return false;
                        }
                        Ext.Msg.alert('加载失败',reqmsg.data.msg);
                        me.setDisabled(false);
                        return false;
                    }
                	me.setDisabled(false);
                    me.navigation.getStore().load();
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
    }
});