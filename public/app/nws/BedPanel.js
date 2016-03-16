/**
 * 功能说明: 床号panel
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.BedPanel', {
    extend: 'Ext.Panel',
    requires: [
        'com.dfsoft.icu.nws.patientdetails.PatientsDetailsWindow',
        'com.dfsoft.icu.nws.bedmanagement.SelectBedWindow'],
    constructor: function(config) {
        //是否隐藏，参数传入
        this.hidden = null;

        Ext.apply(this, config);
        var proxy = this;

        this.isChangeBed = false;//是否切换床位，用于监护中心刷新页面
        this.appendId = this.nwsApp.id;//附加ID，防止多次创建后id重复
        
        //选择床位
        this.selectBed = function(td) {
            var x = td.offsetLeft, y = td.offsetTop, height = td.clientHeight;
            while (td=td.offsetParent) {
                x += td.offsetLeft;
                y += td.offsetTop;
            }
            if (typeof(proxy.selectBedWindow)=="undefined" || proxy.selectBedWindow==null) {
                proxy.selectBedWindow = new com.dfsoft.icu.nws.bedmanagement.SelectBedWindow({
                    x: x,
                    y: y + height,
                    selectPatientInfo : function(patientInfo) {
                        proxy.selectPatientInfo(patientInfo);
                        proxy.selectBedWindow = null;
                        if (proxy.nwsApp.nwsToolbar) {
                            proxy.nwsApp.nwsToolbar.careSettingButton.setDisabled(false);
                        }
                    },
                    listeners: {
                        close: function(panel, eOpts) {
                            proxy.selectBedWindow = null;
                        }
                    }
                });
            }else{
            	proxy.selectBedWindow.close();
            	proxy.selectBedWindow = new com.dfsoft.icu.nws.bedmanagement.SelectBedWindow({
                    x: x,
                    y: y + height,
                    selectPatientInfo : function(patientInfo) {
                        proxy.selectPatientInfo(patientInfo);
                        proxy.selectBedWindow = null;
                        proxy.nwsApp.nwsToolbar.careSettingButton.setDisabled(false);
                    },
                    listeners: {
                        close: function(panel, eOpts) {
                            proxy.selectBedWindow = null;
                        }
                    }
                });
            }
            proxy.selectBedWindow.showAt(x, y + height);
            //设置iframe点击事件，用于关闭选择床位窗口
            for (var i = 0; i < window.frames.length; i++) {
                window.frames[i].document.onclick = function(){
                    if (typeof(proxy.selectBedWindow)!="undefined" && proxy.selectBedWindow!=null) {
                        proxy.selectBedWindow.close();
                    }
                }
            }
        }

        //选择床号，或换床后调用
        this.selectPatientInfo = function(patientInfo) {
            var me = this;
            proxy.patientInfo = patientInfo;
            proxy.displayPatient(patientInfo);
            // 请求查询数据
            var params = [{
                registerId:patientInfo.PATIENT_ID
            }];

            if(this.appendId == 'nws'){
                var socket = io.connect(parent.webRoot);
                socket.emit('careRecordWarning', params[0]);
               // var alarmDiv = document.getElementById('alarm_panel');
                var alarmDiv = Ext.select("div.nwswarningdiv");

                var doctorLogDiv = Ext.select("div.doctorLogdiv");

                doctorLogDiv = doctorLogDiv.elements[0];

                alarmDiv = alarmDiv.elements[0];


                //对于医生工作站没有报警提示框，王小伟，2014-09-05
                if (alarmDiv!=null) {
                    Ext.Ajax.request({
                        url: parent.webRoot + '/nws/getWarning/' + patientInfo.PATIENT_ID,
                        method: 'GET',
                        success: function (response) {
                            var reqmsg = Ext.decode(response.responseText);
                            if (reqmsg.success === true) {

                                var itemObj = reqmsg.data.warningResult;
                                var doctorLog = reqmsg.data.doctorLog;
                                if(doctorLogDiv!=null){
                                    doctorLogDiv.innerHTML = "";
                                }

                                if(alarmDiv!=null){
                                    alarmDiv.innerHTML = "";
                                }
                                //加载未执行医嘱警示
                                if(itemObj.length > 0){
                                    for(var i = 0;i < itemObj.length;i++){
                                      me.nwsApp.recordWarning.insertRecordWarning(alarmDiv,itemObj[i]);

                                    }
                                }
                            // 加载医嘱抽取统计
                                if(doctorLog.length > 0){
                                    me.nwsApp.recordWarning.insertDoctorLog(doctorLogDiv,doctorLog[0]);
                                }
                            } else {
                                request.showErr(reqmsg.errors, '加载');
                            }
                        }
                    });
                }
            }else if(this.appendId == 'cms'){
                //var alarmText = Ext.select("div.cms-warningdiv");
               // alarmText = alarmText.elements[0];
                if (proxy.patientInfo != null) {
                    // console.log(me.bedPanel.patientInfo);

                    var registerId = proxy.patientInfo.REGISTER_ID;
                //加载警示信息
                    var warning=new Ext.ux.IFrame({
                        padding:'0',
                        autoScroll:false,
                        margin:'0',
                        border: false,
                        src:'/app/dws/dws_warning.html?PATIENT_ID='+ registerId
                    });
                    //console.log(this.nwsApp.nwsToolbar);
                    var dwsToolbarItems = this.nwsApp.nwsToolbar.dockedItems.items[0].items.items;

                    var warningItem = "";
                    for(var i = 0;i<dwsToolbarItems.length;i++){
                        var tagObj = dwsToolbarItems[i];
                        if(tagObj.title == "警示"){
                            tagObj.remove(tagObj.items.items[0]);
                            tagObj.add(warning);
                            warningItem = tagObj;
                        }

                    }
                }
            }
            if (proxy.nwsApp.tabPanel.getActiveTab()==proxy.nwsApp.careCenterPanel) {
                if (proxy.nwsApp.careCenterPanel) {
                    //遮罩效果，因为护士工作站和中央监护站共用此模块，需要增加判断
                    proxy.nwsApp.careCenterPanel.loadMask.show();
                    //切换后直接调用工具栏的数据类型：定制、全天、班次，可以刷新定制里的开始截止时间，王小伟，2015-02-04
                    var careCenterToolbar = proxy.nwsApp.careCenterPanel.careCenterToolbar;
                    var dateRadioGroupValue = careCenterToolbar.dateRadioGroup.getValue();
                    careCenterToolbar.dateRadioGroupChange(dateRadioGroupValue[careCenterToolbar.dateRadioGroupName], false);
                    //重新加载监控中心
                    proxy.nwsApp.careCenterPanel.iframePanel.iframe.contentWindow.location.reload();
                    //用来判断是否不在床位管理tab页时更改了病人信息
                    proxy.isChangeBed = 'true';
                }
            } else {
                proxy.isChangeBed = true;
            }
            //记录cookie
            Ext.util.Cookies.set("patientInfo", Ext.encode(patientInfo));
            //循环tab页设置
            for (var i=0; i<proxy.nwsApp.tabPanel.items.items.length; i++) {
                if (typeof(proxy.nwsApp.tabPanel.items.items[i].refreshPatientInfo)!="undefined") {
                    proxy.nwsApp.tabPanel.items.items[i].refreshPatientInfo(patientInfo);
                } else if (typeof(proxy.nwsApp.tabPanel.items.items[i].setPatientInfo)!="undefined") {
                	proxy.nwsApp.tabPanel.items.items[i].setPatientInfo(patientInfo);
                }
            }
        }

        //换床
        this.changeBed = function(fromPatient, toPatient) {
        	if (proxy.patientInfo==null) {
        		return;
        	}
            if (proxy.patientInfo.REGISTER_ID==fromPatient.REGISTER_ID) {
                proxy.patientInfo.BED_ID = fromPatient.BED_ID;
                proxy.patientInfo.BED_NUMBER = fromPatient.BED_NO;
                proxy.selectPatientInfo(proxy.patientInfo);
            } else if (proxy.patientInfo.REGISTER_ID==toPatient.REGISTER_ID) {
                proxy.patientInfo.BED_ID = toPatient.BED_ID;
                proxy.patientInfo.BED_NUMBER = toPatient.BED_NO;
                proxy.selectPatientInfo(proxy.patientInfo);
            }
        }

        //格式化手术日期
        this.formatSurgeryDate = function(surgeryDateDiv, surgeryDate) {
            if (surgeryDate==null || surgeryDate=="") {
                surgeryDateDiv.innerHTML = "";
                surgeryDateDiv.title = "";
            } else {
                var info = "";
                var surgeryDateArray = surgeryDate.split(',');
                for (var i=0; i<surgeryDateArray.length; i++) {
                    var beginDate = surgeryDateArray[i].substring(0,10);
                    var endDate = (new Date()).Format("yyyy-MM-dd");
                    var days = GetDateRegion(beginDate, endDate);
                    info += beginDate + "(" + days + ")";
                    if (i!=surgeryDateArray.length-1) {
                        info += ", ";
                    }
                }
                surgeryDateDiv.innerHTML = info;
                surgeryDateDiv.title = info;
            }

        }

        //根据对象显示患者信息
        this.displayPatient = function(patientInfo) {
            document.getElementById("bedinfo_in_time"+proxy.appendId).innerHTML = patientInfo.IN_TIME==null?null:patientInfo.IN_TIME.substring(0,10);
            document.getElementById("bedinfo_in_days"+proxy.appendId).innerHTML = patientInfo.IN_DAYS;
            document.getElementById("bedinfo_DOCTOR"+proxy.appendId).innerHTML = patientInfo.DOCTOR;
            document.getElementById("bedinfo_NURSE_NAME"+proxy.appendId).innerHTML = patientInfo.NURSE_NAME;
            document.getElementById("bedinfo_CARE_LEVEL"+proxy.appendId).innerHTML = patientInfo.CARE_LEVEL;
            document.getElementById("bedinfo_SURGERY_NAME"+proxy.appendId).innerHTML =
                (patientInfo.SURGERY_NAME==null || patientInfo.SURGERY_NAME=="null") ? "" : patientInfo.SURGERY_NAME;
            document.getElementById("bedinfo_SURGERY_NAME" + proxy.appendId).title = patientInfo.SURGERY_NAME;
            proxy.formatSurgeryDate(document.getElementById("bedinfo_SURGERY_DATE"+proxy.appendId), patientInfo.SURGERY_DATE);
            document.getElementById("bedinfo_NAME"+proxy.appendId).innerHTML = patientInfo.NAME;
            document.getElementById("bedinfo_NAME" + proxy.appendId).title = patientInfo.NAME;
            document.getElementById("bedinfo_DEPT_NAME"+proxy.appendId).innerHTML = patientInfo.IN_DEPT_NAME;
            document.getElementById("bedinfo_GENDER"+proxy.appendId).innerHTML = patientInfo.GENDER;
            document.getElementById("bedinfo_AGE"+proxy.appendId).innerHTML = patientInfo.AGE;
            document.getElementById("bedinfo_AGE"+proxy.appendId).title = patientInfo.AGE;
            document.getElementById("bedinfo_WEIGHT"+proxy.appendId).innerHTML = patientInfo.WEIGHT==null || patientInfo.WEIGHT=="" ? "" : (patientInfo.WEIGHT + "Kg");
            document.getElementById("bedinfo_DIAGNOSIS"+proxy.appendId).innerHTML = patientInfo.DIAGNOSIS;
            document.getElementById("bedinfo_DIAGNOSIS" + proxy.appendId).title = patientInfo.DIAGNOSIS;
            document.getElementById("bedinfo_ALLERGIC_HISTORY"+proxy.appendId).innerHTML = patientInfo.ALLERGIC_HISTORY;
            document.getElementById("bedinfo_bed_no"+proxy.appendId).innerHTML = patientInfo.BED_NUMBER + "<sub class='subBedNo'>床</sub>";
            //原系统ID
            if (patientInfo.SID!=null && patientInfo.SID!="") {
                document.getElementById("bedinfo_SID"+proxy.appendId).innerHTML = "*";
                document.getElementById("bedinfo_SID"+proxy.appendId).title = "his同步时间" + (patientInfo.SYNC_TIME==null?"":patientInfo.SYNC_TIME);
                document.getElementById("bedinfo_NAME" + proxy.appendId).title = "该患者已从his中同步";
            } else {
                document.getElementById("bedinfo_SID"+proxy.appendId).innerHTML = "";
            }
        }
        
      //根据对象显示患者信息，患者详情修改后，患者入科状态改变
        this.displayPatientDetail = function(patientInfo) {
            document.getElementById("bedinfo_in_time"+proxy.appendId).innerHTML = patientInfo.IN_TIME==null?null:patientInfo.IN_TIME.substring(0,10);
            document.getElementById("bedinfo_in_days"+proxy.appendId).innerHTML = patientInfo.IN_DAYS;
            document.getElementById("bedinfo_DOCTOR"+proxy.appendId).innerHTML = patientInfo.DOCTOR;
            document.getElementById("bedinfo_NURSE_NAME"+proxy.appendId).innerHTML = patientInfo.NURSE_NAME;
            document.getElementById("bedinfo_CARE_LEVEL"+proxy.appendId).innerHTML = patientInfo.CARE_LEVEL;
            document.getElementById("bedinfo_SURGERY_NAME"+proxy.appendId).innerHTML = patientInfo.SURGERY_NAME;
            document.getElementById("bedinfo_SURGERY_NAME" + proxy.appendId).title = patientInfo.SURGERY_NAME;
            proxy.formatSurgeryDate(document.getElementById("bedinfo_SURGERY_DATE"+proxy.appendId), patientInfo.SURGERY_DATE);
            //未入科
            if(patientInfo.STATUS_CODE=='a34df80078fd11e39fd9cb7044fca372'){
            	document.getElementById("bedinfo_NAME"+proxy.appendId).innerHTML = patientInfo.NAME + "<br/>待入科";
                document.getElementById("bedinfo_NAME" + proxy.appendId).title = patientInfo.NAME + "待入科";
            }
            //已入科
            else if(patientInfo.STATUS_CODE=='tbge380078fd11e39fd9cb7044fb7954'){
            	document.getElementById("bedinfo_NAME"+proxy.appendId).innerHTML = patientInfo.NAME;
                document.getElementById("bedinfo_NAME" + proxy.appendId).title = patientInfo.NAME;
            }else if(patientInfo.STATUS_CODE=='wty4980078fd11e39fd9cb7044fb795e'){
            	document.getElementById("bedinfo_NAME"+proxy.appendId).innerHTML = patientInfo.NAME + "<br/>已出科";
                document.getElementById("bedinfo_NAME" + proxy.appendId).title = patientInfo.NAME + "已出科";
            }
            document.getElementById("bedinfo_DEPT_NAME"+proxy.appendId).innerHTML = patientInfo.IN_DEPT_NAME;
            document.getElementById("bedinfo_GENDER"+proxy.appendId).innerHTML = patientInfo.GENDER;
            document.getElementById("bedinfo_AGE"+proxy.appendId).innerHTML = patientInfo.AGE;
            document.getElementById("bedinfo_AGE"+proxy.appendId).title = patientInfo.AGE;
            document.getElementById("bedinfo_WEIGHT"+proxy.appendId).innerHTML = patientInfo.WEIGHT==null || patientInfo.WEIGHT=="" ? "" : (patientInfo.WEIGHT + "Kg");
            document.getElementById("bedinfo_DIAGNOSIS"+proxy.appendId).innerHTML = patientInfo.DIAGNOSIS;
            document.getElementById("bedinfo_DIAGNOSIS" + proxy.appendId).title = patientInfo.DIAGNOSIS;
            document.getElementById("bedinfo_ALLERGIC_HISTORY"+proxy.appendId).innerHTML = patientInfo.ALLERGIC_HISTORY;
            if(patientInfo.BED_NUMBER==null){
            	document.getElementById("bedinfo_bed_no"+proxy.appendId).innerHTML ="<sub class=''>床号</sub>";
            }else{
            	document.getElementById("bedinfo_bed_no"+proxy.appendId).innerHTML = patientInfo.BED_NUMBER + "<sub class='subBedNo'>床</sub>";
            }
            //原系统ID
            if (patientInfo.SID!=null && patientInfo.SID!="") {
                document.getElementById("bedinfo_SID"+proxy.appendId).innerHTML = "*";
                document.getElementById("bedinfo_SID"+proxy.appendId).title = "his同步时间" + (patientInfo.SYNC_TIME==null?"":patientInfo.SYNC_TIME);
                document.getElementById("bedinfo_NAME" + proxy.appendId).title = "该患者已从his中同步";
            } else {
                document.getElementById("bedinfo_SID"+proxy.appendId).innerHTML = "";
            }
        }
        

        //患者详情
        this.patientDetail = function() {
        	if(proxy.patientInfo==undefined){
        		Ext.MessageBox.alert('提示', '此患者已经不存在!');
        		return;
        	}
        	Ext.Ajax.request({
                url: webRoot + '/nws/icu_patient/' + proxy.patientInfo.REGISTER_ID,
                method: 'GET',
                async: false,
                success: function(response) {
                    var respText = Ext.decode(response.responseText).data;
                    if(respText.length==0){
                    	Ext.MessageBox.alert('提示', '此患者已经不存在!');
                    }else{
                    	var patientsDetailsWindow = new com.dfsoft.icu.nws.patientdetails.PatientsDetailsWindow({
                        	modal:true,
                            patientInfo: proxy.patientInfo,
                            selectPatientInfo : function(patientInfo) {
                                //计算入科天数
                                patientInfo.IN_DAYS = GetDateRegion(patientInfo.IN_TIME, new Date().Format("yyyy-MM-dd")) + 1;
                                //计算术后天数
                                patientInfo.SURGERY_DAYS = GetDateRegion(patientInfo.SURGERY_DATE, new Date().Format("yyyy-MM-dd"));
                                //计算年龄
                                //patientInfo.AGE = computeAge(patientInfo.BIRTHDAY);
                                Ext.apply(proxy.patientInfo, patientInfo);
                                proxy.displayPatientDetail(proxy.patientInfo);
                                //记录cookie
                                proxy.patientInfo.HOSPITAL_DATE = patientInfo.HOSPITAL_DATE;
                                proxy.patientInfo.SURGERY_DATE = patientInfo.SURGERY_DATE;
                                Ext.util.Cookies.set("patientInfo", Ext.encode(proxy.patientInfo));
                            }
                        });
                        patientsDetailsWindow.show();
                    }
                    proxy.patientInfo = respText[0];
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                }
            });
        }

        //收缩展开
        this.expandCollapse = function(img) {
            if(proxy.nwsApp.nwsToolbar){
                if (proxy.nwsApp.nwsToolbar.isHidden()==false) {
                    proxy.nwsApp.nwsToolbar.hide();
                    img.className = "split downnormal";
                } else {
                    proxy.nwsApp.nwsToolbar.show();
                    img.className = "split normal";
                }
            }else{
                if (proxy.nwsApp.dwsToolbar.isHidden()==false) {
                    proxy.nwsApp.dwsToolbar.hide();
                    img.className = "split downnormal";
                } else {
                    proxy.nwsApp.dwsToolbar.show();
                    img.className = "split normal";
                }
            }
        }

        //检查病人状态
        this.findPatientState = function(registerId) {
            var patientState = false;
            Ext.Ajax.request({
                url: window.parent.webRoot + '/nws/findPatientState',
                method: 'post',
                async: false,
                params: {
                    registerId: registerId
                },
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        patientState = result.data.STATUS_CODE;
                    }
                }
            });
            return patientState;
        }

        this.callParent([{
            padding: "0 0 1 0",
            height: 46,
            hidden: proxy.hidden==null ? false : proxy.hidden,
            html: '<table class="bedTable">' +
                '<tr>' +
                '<td class="bedCell bedLeftTd" rowspan="2"  title="选择床位" style="">' +
                    '<div id="bedinfo_bed_no' + proxy.appendId + '" style="width: 60px; float: left; cursor: pointer;" class="" onclick="Ext.getCmp(\'' + proxy.getId() + '\').selectBed(this)">床号</div>' +
                '</td>' +
                '<td class="nameCell" rowspan="2" >' +
                    '<div id="bedinfo_SID' + proxy.appendId + '" style="margin-top: -15px; height:15px; font-size: 28px; cursor: default;"></div>' +
                    '<div id="bedinfo_NAME' + proxy.appendId + '" class="nameDiv" onclick="Ext.getCmp(\'' + proxy.getId() + '\').patientDetail()"></div>' +
                '</td>' +
                '<td class="bedCell" width="5px">&nbsp;</td>' +
                '<td class="bedCell" style="width: 60px">转入时间:</td>' +
                '<td class="bedCell" style="width: 70px;"><div id="bedinfo_in_time' + proxy.appendId + '" style="width: 70px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 60px; text-align: right;">入科天数:</td>' +
                '<td class="bedCell" style="width: 10px"><div id="bedinfo_in_days' + proxy.appendId + '" style="width: 25px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 40px">医生:</td>' +
                '<td class="bedCell" style="width: 50px"><div id="bedinfo_DOCTOR' + proxy.appendId + '" style="width: 50px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 40px">护士:</td>' +
                '<td class="bedCell" style="width: 60px"><div id="bedinfo_NURSE_NAME' + proxy.appendId + '" style="width: 60px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 60px">监护级别:</td>' +
                '<td class="bedCell" style="width: 60px"><div id="bedinfo_CARE_LEVEL' + proxy.appendId + '" style="width: 60px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 60px">手术名称:</td>' +
                '<td class="bedCell"><div id="bedinfo_SURGERY_NAME' + proxy.appendId + '" style="width: 80px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="width: 60px">手术日期:</td>' +
                '<td class="bedCell" style="width: 80px"><div id="bedinfo_SURGERY_DATE' + proxy.appendId + '" style="width: 95px;" class="limitdiv"></div></td>' +

                '<td class="bedCell" style="width: 33px">&nbsp;</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="bedCell">&nbsp;</td>' +
                '<td class="bedCell">转入科室:</td>' +
                '<td class="bedCell"><div id="bedinfo_DEPT_NAME' + proxy.appendId + '" style="width: 70px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="text-align: right">性别:</td>' +
                '<td class="bedCell"><div id="bedinfo_GENDER' + proxy.appendId + '" style="width: 25px; float: left;" class="limitdiv"></div></td>' +
                '<td class="bedCell">年龄:</td>' +
                '<td class="bedCell"><div id="bedinfo_AGE' + proxy.appendId + '" style="width: 50px;" class="limitdiv"></div></td>' +
                '<td class="bedCell">体重:</td>' +
                '<td class="bedCell"><div id="bedinfo_WEIGHT' + proxy.appendId + '" style="width: 60px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="text-align: right">诊断:</td>' +
                '<td class="bedCell" colspan="3"><div id="bedinfo_DIAGNOSIS' + proxy.appendId + '" style="width: 230px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="text-align: right">过敏史:</td>' +
                '<td class="bedCell" colspan="1"><div id="bedinfo_ALLERGIC_HISTORY' + proxy.appendId + '" style="width: 100px;" class="limitdiv"></div></td>' +
                '<td class="bedCell" style="" valign="middle" align="center"><img src="" align="absbottom" class="split normal" onclick="Ext.getCmp(\'' + proxy.getId() + '\').expandCollapse(this)"></td>' +
                '</tr>' +
                '</table>',
            listeners: {
                afterrender: function(panel, eOpts) {
                    if (proxy.patientInfo!=null) {
                        proxy.displayPatient(proxy.patientInfo);
                    }
                },
                beforedestroy: function(panel, eOpts) {
                    if (proxy.selectBedWindow != null) {
                        proxy.selectBedWindow.close();
                    }
                },
                resize: function(component, width, height, oldWidth, oldHeight, eOpts) {
                    //手术名称
                    var div = document.getElementById("bedinfo_SURGERY_NAME" + proxy.appendId);
                    div.style.width = "80px"; //div先缩小再放大，防止由于div宽度影响td宽度
                    //诊断
                    div = document.getElementById("bedinfo_DIAGNOSIS" + proxy.appendId);
                    div.style.width = "230px"; //div先缩小再放大，防止由于div宽度影响td宽度

                    //手术名称
                    document.getElementById("bedinfo_SURGERY_NAME" + proxy.appendId).style.width =
                        document.getElementById("bedinfo_SURGERY_NAME" + proxy.appendId).parentNode.clientWidth - 5 + "px";
                    //诊断
                    document.getElementById("bedinfo_DIAGNOSIS" + proxy.appendId).style.width =
                        document.getElementById("bedinfo_DIAGNOSIS" + proxy.appendId).parentNode.clientWidth - 5 + "px";
                }
            }
        }]);
    }

});

