/**
 * 功能说明:  已入科患者 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AlreadyToDeptPanel', {
    extend: 'Ext.panel.Panel',
    id:'AlreadyDeptPanel',
    layout: 'fit',
    region: 'center',
    border: true,
    initComponent: function() {
        var me = this;
        me.bednum=0;
        //加载当前所有床位信息
        me.initBedDatas();
        me.locateTarget = null; //记忆上次定位到的病人panel
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: ['已入科患者：', '->', {
                xtype: 'textfield',
                fieldLabel: '姓名',
                labelWidth: 32,
                width: 120
            }, {
                xtype: 'button',
                tooltip: '定位',
                iconCls: 'locate',
                scope: me,
                handler: function() {
                    var patientName = Ext.util.Format.trim(me.down('textfield').getValue()),
                        allBeds = getBeds(me.down('portalpanel').items.items),
                        locateTarget = [],unlocateTarget=[];
                    if (patientName != null &&patientName != ''&& patientName.length > 0) {
                        for (var i = 0; i < allBeds.length; i++) {
                            if (allBeds[i].bedStatus) {
                                if (patientName.indexOf(allBeds[i].patientName) >= 0 || allBeds[i].patientName.indexOf(patientName) >= 0) {
                                	if(allBeds[i].patientName!=""){
                                    	locateTarget.push(allBeds[i]);
                                    }
                                }else{
                                	if(allBeds[i].patientName!=""){
                                		unlocateTarget.push(allBeds[i]);
                                    }
                                }
                            }
                        }
                    }else{
                    	for (var i = 0; i < allBeds.length; i++) {
                            if (allBeds[i].bedStatus) {
                            	if(allBeds[i].patientName!=""){
                            		unlocateTarget.push(allBeds[i]);
                                }
                            }
                        }
                    }
                    if (locateTarget.length > 0) {
                        // 如果当前定位到的床位跟上次定位到的床位是同一个  则不删增样式
                        if (me.locateTarget != null){
                        	me.locateTarget.removeCls('border-location');
                        } 
                        for(var i=0;i<locateTarget.length;i++){
                        	locateTarget[i].addCls('border-location');
                            me.locateTarget = locateTarget[i];
                            me.down('portalpanel').getTargetEl().scrollTo('top', (locateTarget[i].getEl().dom.offsetTop - 5));
                        }
                        
                    } else {
                        if (me.locateTarget != null) me.locateTarget.removeCls('border-location');
                    }
                    
                    if (unlocateTarget.length > 0) {
                        for(var i=0;i<unlocateTarget.length;i++){
                        	unlocateTarget[i].removeCls('border-location');
                            me.unlocateTarget = unlocateTarget[i];
                            me.down('portalpanel').getTargetEl().scrollTo('top', (unlocateTarget[i].getEl().dom.offsetTop - 5));
                        }
                        
                    }
                }
            }, '-', {
                xtype: 'button',
                id: 'bedmanager_6dbb5c90089d11e396021b9f5cdf5sa5',
                //disabled: true,
                tooltip: '当前用户是ICU下的人员才能添加床位',
                iconCls: 'add',
                disabled: true,
                scope: me,
                handler: me.addBed
            },'-',{
                xtype: 'button',
                tooltip: '删除床位',
                iconCls: 'delete',
                //disabled: true,
                scope: me,
                handler: me.delBed
            },'-', {
                xtype: 'button',
                tooltip: '移至待入科患者列表',
                iconCls: 'left',
                scope: me,
                handler: me.returnWaitDept
            }, '-', {
                xtype: 'button',
                id: 'bedmanager_22b5e2b078fd11e39fd9cb7044fb706f',
                disabled: true,
                tooltip: '监护设置',
                iconCls: 'care-setup',
                scope: me,
                handler: me.createCareSettingWindow
            }, '-', {
                xtype: 'button',
                id: 'bedmanager_33c5e2b078fd11e39fd9cb7044fb817g',
                //disabled: true,
                tooltip: '换床',
                iconCls: 'change-bed',
                scope: me,
                handler: me.changeBedOpera
            }, '-', {
                xtype: 'button',
                tooltip: '出科',
                iconCls: 'out-dept',
                scope: me,
                handler: me.createOutDeptWindow
            }]
        }],
        me.items = [{
            xtype: 'portalpanel',
            border: false,
            style: {
                borderTop: '1px solid silver',
            },
            bodyStyle: {
                background: '#f5f5f5'
            },
            //items: centralMonitoringItems,
            listeners: {
                resize: function(_this, width, height, oldWidth, oldHeight, eOpts) {
            		me.locateTarget = null; //记忆上次定位到的病人panel
                    me.initBedInfo(_this, width);
                }
            }
        }]

        me.bbar = [{
            xtype: 'label',
            html: '危重程度：<img src="/app/nws/bedmanagement/images/dying.png" /><font>病危</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/Ill.png" /><font>病重</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/mild-disease.png" /><font>一般</font>',
            margin: '-1 0 6 0'
        }, '->', {
            xtype: 'label',
            html: '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台'
        }]
        me.callParent();
    },


    // 初始化已入科患者portalpanel
    initBedInfo: function(_this, width) {
        var me = this;
      //当前所有床位信息
        me.initBedDatas();
        if (me.parent.patientInfo)
            currSelectBedNo = me.parent.patientInfo.BED_ID; // 当前选中的床位ID
        else currSelectBedNo = null;
        // 先删除当前的所有portal
        _this.removeAll(true);
        var fixedRow = 0,
            fixedWidth = 160,
            centralMonitoringItems = [];
        fixedRow = Math.floor((width - 5) / fixedWidth);
        if(fixedRow>=10)fixedRow=10;
        for (var i = 0; i < fixedRow; i++) {
            var item = {
                width: fixedWidth,
                items: []
            }
            centralMonitoringItems.push(item);
        }
        // 床位数据模板
        for (var i = 0; i < me.bedDatas.length; i++) {
            var bedNo = me.bedDatas[i].BED_NUMBER,
                bedStatus = me.bedDatas[i].USED === 1, //当前床位状态  false 可用
                currStatus = '<img src="/app/nws/bedmanagement/images/',
                checkedBed = false; // 床位是否被选中
//            if(bedNo.length>5){
//            	bedNo=bedNo.substring(0,5)+"...";
//            }
            var REGISTER_ID = '',
                PATIENT_ID = '',
                backgroundCls = '',
                patientName = '',
                statusIco = '',
                bedObject = {
                    patientName: '',
                    gender: '',
                    careLevel: '',
                    conditionName: '',
                    nurseName: ''
                };
            if (me.bedDatas[i].ID == currSelectBedNo) {
                //checkedBed = true;
            }
            //var bedTemplate = new Ext.Template('<div><table><tr><td width="64px">患者姓名:</td><td style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{patientName}</td></tr><tr><td>患者性别:</td><td>{gender}</td></tr><tr><td>监护级别:</td><td>{careLevel}</td></tr><tr><td>危重程度:</td><td>{conditionName}</td></tr><tr><td>责任护士:</td><td>{nurseName}</td></tr></table></div>');
            if (bedStatus) {
                statusIco = currStatus + 'icu-doing.png" />';
                if (me.bedDatas[i].usedInfo) {
                    bedObject.patientName = me.bedDatas[i].usedInfo.patientName;
                    bedObject.gender = me.bedDatas[i].usedInfo.gender;
                    bedObject.careLevel = me.bedDatas[i].usedInfo.careLevel;
                    bedObject.conditionName = me.bedDatas[i].usedInfo.conditionName;
                    bedObject.nurseName = me.bedDatas[i].usedInfo.nurseName == null ? "" : me.bedDatas[i].usedInfo.nurseName;
                    REGISTER_ID = me.bedDatas[i].usedInfo.REGISTER_ID;
                    PATIENT_ID = me.bedDatas[i].usedInfo.PATIENT_ID;
                    patientName = me.bedDatas[i].usedInfo.patientName;
                    backgroundCls = bedObject.conditionName == '病危' ? 'background-dying' : (bedObject.conditionName == '病重' ? 'background-Ill' : 'background-mild-disease');
                }
            } else {
                statusIco = currStatus + 'icu-idle.png" />';
            }
            //var bedHtml = bedTemplate.apply(bedObject);
            var currItem = {
                header: {
                    padding: '0 5 0 5',
                    items: [{
                        xtype: 'checkboxfield',
                        checked: checkedBed,
                        onBoxClick: function(e) {
                            var me = this;
                            if (!me.disabled && !me.readOnly) {
                                this.setValue(!this.checked);
                            }
                            e.stopPropagation();
                        }
                    }, {
                        xtype: 'label',
                        html: '<font color="white" >' + bedNo + '</font>&nbsp;&nbsp;&nbsp;&nbsp;'+statusIco+'',
                        margin: '0 35'
                    }]
                },
                border: 1,
                height: 126,
                closable: false,
                collapsible: false,
                ICU_ID: me.bedDatas[i].ICU_ID,
                BED_ID: me.bedDatas[i].ID,
                REGISTER_ID: REGISTER_ID,
                PATIENT_ID: PATIENT_ID,
                bedNo: bedNo,
                patientName: patientName,
                //bedTemplate: bedTemplate,
                bedStatus: bedStatus,
                currStatus: currStatus,
                // items: [{
                //     xtype: 'label',
                //     html: bedHtml,
                //     margin: 0
                // }],
                items: [{
                    xtype: 'form',
                    bodyCls: backgroundCls,
                    //autoScroll: true,
                    //overflowX: 'auto',
                    //padding: '3 0 0 2',
                    defaults: {
                        width: 121,
                        labelWidth: 59,
                        labelAlign: 'right'
                    },
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: '患者姓名',
                        value: '<div title="' + bedObject.patientName + '" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + bedObject.patientName + '</div>',
                        margin: '-2 0 0 2'
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: '患者性别',
                        margin: '-5 0 0 2',
                        value: bedObject.gender
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: '监护级别',
                        margin: '-5 0 0 2',
                        value: bedObject.careLevel,
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: '危重程度',
                        margin: '-5 0 0 2',
                        value: bedObject.conditionName,
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: '责任护士',
                        margin: '-5 0 0 2',
                        value: '<div title="' + bedObject.nurseName + '" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + bedObject.nurseName + '</div>',
                    }],
                }],
                listeners: {
                    render: function(v) {
                        me.initializeAlreadyToDeptDropZone(v, me);
                    },
                    afterrender: function(_this, eOpts) {
                        _this.header.on('click', function() {
                            var checked = _this.header.items.items[0].getValue();
                            if (!checked) {
                                _this.header.items.items[0].setValue(true);
                            } else {
                                _this.header.items.items[0].setValue(false);
                            }
                        });
                        _this.header.on('dblclick', function() {
                        	if(_this.bedStatus==true){
                        		Ext.MessageBox.alert('提示', '不能修改正在使用中的床号!');
                                return;
                        	}
                        	var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.AddBedWindow',{status:'update',parent: me,ICU_ID:userInfo.deptId,BED_NUMBER:_this.bedNo,BED_ID:_this.BED_ID});
                        	me.parent.nwsApp.showModalWindow(dlg);
                        	//dlg.show();
                        });
                    }
                }
            };
            	if (i % fixedRow == 0) {
                    var portlet1 = centralMonitoringItems[0];
                    portlet1.items.push(currItem);
                } else if (i % fixedRow == 1) {
                    var portlet2 = centralMonitoringItems[1];
                    portlet2.items.push(currItem);
                } else if (i % fixedRow == 2) {
                    var portlet3 = centralMonitoringItems[2];
                    portlet3.items.push(currItem);
                } else if (i % fixedRow == 3) {
                    var portlet4 = centralMonitoringItems[3];
                    portlet4.items.push(currItem);
                } else if (i % fixedRow == 4) {
                    var portlet5 = centralMonitoringItems[4];
                    portlet5.items.push(currItem);
                } else if (i % fixedRow == 5) {
                    var portlet6 = centralMonitoringItems[5];
                    portlet6.items.push(currItem);
                } else if (i % fixedRow == 6) {
                    var portlet7 = centralMonitoringItems[6];
                    portlet7.items.push(currItem);
                } else if (i % fixedRow == 7) {
                    var portlet8 = centralMonitoringItems[7];
                    portlet8.items.push(currItem);
                } else if (i % fixedRow == 8) {
                    var portlet9 = centralMonitoringItems[8];
                    portlet9.items.push(currItem);
                } else {
                    var portlet10 = centralMonitoringItems[9];
                    portlet10.items.push(currItem);
                }
        }
        _this.add(centralMonitoringItems);
        _this.doLayout();

        //边框样式，用于定位后 改变页面大小后记录当前定位到的床位
        if (me.locateTarget != null) {
            var bedsAll = getBeds(_this.items.items);
            for (var i = 0; i < bedsAll.length; i++) {
                if (me.locateTarget.BED_ID === bedsAll[i].BED_ID) {
                    bedsAll[i].addCls('border-location');
                    me.locateTarget = bedsAll[i];
                }
            }
        }
    },

    // 加载当前床位信息
    initBedDatas: function() {
        var me = this;
        me.bednum=0;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_beds/list/' + userInfo.deptId,
            method: 'GET',
            async: false,
            scope: me,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                me.bedDatas = respText;
                me.maxbedid=0;
                for(var i=0;i<me.bedDatas.length;i++){
                	if(parseInt(me.bedDatas[i].BED_NUMBER)>me.maxbedid){
                		me.maxbedid=parseInt(me.bedDatas[i].BED_NUMBER);
                	}
                	if(me.bedDatas[i].USED==1){
                		me.bednum=me.bednum+1;
                	}
                }
                me.maxbedid=parseInt(me.maxbedid)+1;
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取床位信息失败,请求超时或网络故障!');
            }
        });
    },

    // 创建出科window
    createOutDeptWindow: function() {
        var me = this,
            bedAll = getBeds(me.down('portalpanel').items.items),
            selectBed = []; // 选中的床位
        for (var i = 0; i < bedAll.length; i++) {
            var checked = bedAll[i].header.items.items[0].getValue();
            if (checked) {
                selectBed.push(bedAll[i]);
            }
        }

        // 只能选择正在使用中的床位
        if (selectBed.length > 1) {
            Ext.MessageBox.alert('提示', '只能选择一个正在使用中的床位!');
            return;
        }
        if (selectBed.length < 1) {
            Ext.MessageBox.alert('提示', '请选择一个正在使用中的床位!');
            return;
        }
        if (!selectBed[0].bedStatus) {
            Ext.MessageBox.alert('提示', '请选择正在使用中的床位!');
            return;
        }
        var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.OutDeptWindow', {
            parent: me,
            BED_ID: selectBed[0].BED_ID,
            REGISTER_ID: selectBed[0].REGISTER_ID,
            PATIENT_ID:selectBed[0].PATIENT_ID,
            patientName:selectBed[0].patientName
        });
        me.parent.nwsApp.showModalWindow(dlg);
        //dlg.show();
    },

    // 创建监护设置window
    createCareSettingWindow: function() {
        var me = this,
            bedAll = getBeds(me.down('portalpanel').items.items),
            selectBed = [], // 选中的床位
            hasPatient = true; //该床位上是否有病人
        for (var i = 0; i < bedAll.length; i++) {
            var checked = bedAll[i].header.items.items[0].getValue();
            if (checked) {
                selectBed.push(bedAll[i]);
            }
        }
        if (selectBed.length > 1) {
            Ext.MessageBox.alert('提示', '只能选择一个床位!');
            return;
        }
        if (selectBed.length < 1) {
            Ext.MessageBox.alert('提示', '请选择一个床位!');
            return;
        }
        if (selectBed[0].PATIENT_ID.length == 0) {
            hasPatient = false;
        }
        var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.CareSettingWindow', {
        	modal: true,
            parent: me,
            REGISTER_ID: selectBed[0].REGISTER_ID,
            PATIENT_ID: selectBed[0].PATIENT_ID,
            BED_ID: selectBed[0].BED_ID,
            patientName: selectBed[0].patientName
        });
        //me.parent.nwsApp.showModalWindow(dlg);
        dlg.show();

        // 加载当前床位上的信息
        var basicSettingsForm = dlg.careSettingTabPanel.basicSettingsForm.getForm();
        if (selectBed[0].PATIENT_ID.length > 0) {
            Ext.Ajax.request({
                url: webRoot + '/nws/icu_patient/' + selectBed[0].REGISTER_ID,
                method: 'GET',
                success: function(response) {
                    var respText = Ext.decode(response.responseText).data;
                    respText[0].CARE_START_TIME = Ext.util.Format.date(respText[0].CARE_START_TIME, "Y-m-d H:i");
                    var CARE_START_TIME = respText[0].CARE_START_TIME;
                    //if (CARE_START_TIME == null || CARE_START_TIME.length == 0) {
                   //     CARE_START_TIME = new Date();
                    //}
                    if (respText[0].CARE_LEVEL_CODE == null) respText[0].CARE_LEVEL_CODE = 'bt64f80078fd11e39fd9cb7044fca582';
                    basicSettingsForm.findField('NURSE_ID').setValue(respText[0].NURSE_NAME);
                    basicSettingsForm.findField('HIDDEN_NURSE_ID').setValue(respText[0].NURSE_ID);
                    basicSettingsForm.setValues({
                        PATIENT_NAME: respText[0].NAME,
                        HEIGHT: respText[0].HEIGHT,
                        WEIGHT: respText[0].WEIGHT,
                        CONDITION_CODE: respText[0].CONDITION_CODE,
                        ALLERGIC_HISTORY: respText[0].ALLERGIC_HISTORY,
                        DIAGNOSIS: respText[0].DIAGNOSIS,
                        //NURSE_ID: respText[0].NURSE_ID,
                        //NURSE_NAME:respText[0].NURSE_NAME,
                        CARE_LEVEL: respText[0].CARE_LEVEL_CODE,
                        CARE_START_TIME: CARE_START_TIME,
                        CARE_INTERVAL: respText[0].CARE_INTERVAL,
                        CARE_FREQUENCY: respText[0].CARE_FREQUENCY
                    });
                },
                failure: function(response, options) {
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
        equipmentStore.proxy.url = webRoot + '/nws/icu_beds/adapterList/' + selectBed[0].BED_ID;
        equipmentStore.load();
        // 加载当前床上的监护项目树
        var careProjectTreeGrid = dlg.careSettingTabPanel.careProjectTreeGrid;
        if (careProjectTreeGrid) {
            var careProjectTreeStore = careProjectTreeGrid.getStore();
            careProjectTreeStore.proxy.url = webRoot + '/nws/icu_beds/items/' + selectBed[0].BED_ID;
            careProjectTreeStore.load();
        }

    },

    // 换床操作 只能选取两个都在使用中的床位，或一个使用、一个未使用的
    changeBedOpera: function() {
        var me = this,
            bedAll = getBeds(me.down('portalpanel').items.items),
            useBed = [], // 选中的使用中的床位
            noUseBed = []; // 选中的未使用中的床位
        for (var i = 0; i < bedAll.length; i++) {
            var checked = bedAll[i].header.items.items[0].getValue();
            if (checked) {
                if (bedAll[i].bedStatus) {
                    useBed.push(bedAll[i]);
                } else {
                    noUseBed.push(bedAll[i]);
                }
            }
        }
        // 只能选取两个都在使用中的床位，或一个使用、一个未使用的
        if ((useBed.length == 2 && noUseBed.length == 0) || (useBed.length == 1 && noUseBed.length == 1)) {
            var changeData = {
                from: {
                    REGISTER_ID: useBed[0].REGISTER_ID,
                    PATIENT_ID: useBed[0].PATIENT_ID,
                    BED_ID: useBed[0].BED_ID,
                    USER_ID: userInfo.userId,
                    BED_NO: useBed[0].bedNo,
                    patientName:useBed[0].patientName
                }
            };
            if (useBed.length == 2) {
                changeData.to = {
                    REGISTER_ID: useBed[1].REGISTER_ID,
                    PATIENT_ID: useBed[1].PATIENT_ID,
                    BED_ID: useBed[1].BED_ID,
                    USER_ID: userInfo.userId,
                    BED_NO: useBed[1].bedNo,
                    patientName:useBed[1].patientName
                }
            } else {
                changeData.to = {
                    REGISTER_ID: noUseBed[0].REGISTER_ID,
                    PATIENT_ID: noUseBed[0].PATIENT_ID,
                    BED_ID: noUseBed[0].BED_ID,
                    USER_ID: userInfo.userId,
                    BED_NO: noUseBed[0].bedNo,
                    patientName:noUseBed[0].patientName
                }
            }
            me.changeBedServerOpera(JSON.stringify([changeData]));
        } else {
            Ext.MessageBox.alert('提示', '只能选取两个都在使用中的床位，或一个使用、一个未使用的床位!');
            return;
        }
    },

    // 换床后台操作
    changeBedServerOpera: function(changeData) {
        var me = this;
        var myMask = new Ext.LoadMask(me, {
            msg: '换床中'
        });
        myMask.show();
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_bed_change',
            method: 'POST',
            params: {
                changeInfo: changeData
            },
            success: function(response) {
                var portal = me.down('portalpanel');
                me.locateTarget=null;
                me.initBedInfo(portal, portal.getWidth());
                var currChangeData = eval(changeData);
                var from = {
                    REGISTER_ID: currChangeData[0].from.REGISTER_ID,
                    BED_ID: currChangeData[0].to.BED_ID,
                    BED_NO: currChangeData[0].to.BED_NO
                },
                    to = {
                        REGISTER_ID: currChangeData[0].to.REGISTER_ID,
                        BED_ID: currChangeData[0].from.BED_ID,
                        BED_NO: currChangeData[0].from.BED_NO
                    }
                var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                if (bedNoCombo != undefined) {
                    bedNoCombo.getStore().reload();
                }
                me.parent.changeBedCallback(from, to);
                myMask.hide();
            },
            failure: function(response, options) {
                myMask.hide();
                Ext.MessageBox.alert('提示', '换床失败,请求超时或网络故障!');
            }
        });
    },

    // 添加床位
    addBed: function() {
        var me = this;
        if(connectUserNumber>0){
            if(connectUserNumber<=me.bedDatas.length){
                Ext.MessageBox.alert('床位限制', '只能添加'+connectUserNumber+'台床位!');
                return false;
            }
        }
//        var myMask = new Ext.LoadMask(me, {
//            msg: '保存中'
//        });
//        myMask.show();
//        Ext.Ajax.request({
//            url: webRoot + '/nws/icu_beds',
//            method: 'POST',
//            params: {
//                ICU_ID: userInfo.deptId,
//                BED_NUMBER: me.maxbedid
//            },
//            success: function(response) {
//                var respText = Ext.decode(response.responseText).data;
//                var portal = me.down('portalpanel');
//                me.locateTarget=null;
//                me.initBedInfo(portal, portal.getWidth());
//                // 床位添加成功后更新下方床位总数
//                var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
//                Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + ' 台';
//                var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
//                if (bedNoCombo != undefined) {
//                    bedNoCombo.getStore().reload();
//                }
//                myMask.hide();
//            },
//            failure: function(response, options) {
//                myMask.hide();
//                Ext.MessageBox.alert('提示', '添加床位失败,请求超时或网络故障!');
//            }
//        });
    	var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.AddBedWindow',{status:'add',parent: me,ICU_ID:userInfo.deptId,BED_NUMBER:me.maxbedid});
    	me.parent.nwsApp.showModalWindow(dlg);
    	//dlg.show();
    },
    
  	//删除床位
    delBed: function() {
    	var me = this,
        bedAll = getBeds(me.down('portalpanel').items.items),
        useBed = [], // 选中的使用中的床位
        noUseBed = []; // 选中的未使用中的床位
    	var myMask = new Ext.LoadMask(me, {
            msg: '删除中'
        });
	    for (var i = 0; i < bedAll.length; i++) {
	        var checked = bedAll[i].header.items.items[0].getValue();
	        if (checked) {
	            if (bedAll[i].bedStatus) {
	                useBed.push(bedAll[i]);
	            } else {
	                noUseBed.push(bedAll[i]);
	            }
	        }
	    }
	    if (useBed.length >0) {
            Ext.MessageBox.alert('提示', '床位上已有患者，不能删除!');
            return;
        }
        if (noUseBed.length < 1) {
            Ext.MessageBox.alert('提示', '请选择床位!');
            return;
        }
        Ext.Msg.confirm('删除床位', '确定删除床位?', function(btn) {
            if (btn == 'yes') {
            	myMask.show();
            	var noUsebed_id="";
            	for(var i=0;i<noUseBed.length;i++){
            		noUsebed_id=noUsebed_id+noUseBed[i].BED_ID+",";
            	}
            	noUsebed_id=noUsebed_id.substring(0,noUsebed_id.length-1);
            	Ext.Ajax.request({
                	url: webRoot + '/nws/icu_beds/deleteBed/' + noUsebed_id,
                    method: 'PUT',
                    success: function(response) {
            		var respText = Ext.decode(response.responseText).data;
                    var portal = me.down('portalpanel');
                    me.locateTarget=null;
                    me.initBedInfo(portal, portal.getWidth());
                    //删除床位更新下方床位总数
                    var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                    Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台';
                    var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                    if (bedNoCombo != undefined) {
                        bedNoCombo.getStore().reload();
                    }
                    myMask.hide();
                    },
                    failure: function(response, options) {
                    	myMask.hide();
                        Ext.MessageBox.alert('提示', '删除床位失败,请求超时或网络故障!');
                    }
                });
            }
        });
    },

    // 移至待入科患者列表
    returnWaitDept: function() {
        var me = this,
            bedAll = getBeds(me.down('portalpanel').items.items),
            selectBed = []; // 选中的床位
        for (var i = 0; i < bedAll.length; i++) {
            var checked = bedAll[i].header.items.items[0].getValue();
            if (checked) {
                selectBed.push(bedAll[i]);
            }
        }

        // 只能选择正在使用中的床位
        if (selectBed.length > 0) {
            for (var i = 0; i < selectBed.length; i++) {
                if (!selectBed[i].bedStatus) {
                    Ext.MessageBox.alert('提示', '请选择正在使用中的床位!');
                    return;
                }
            }
        } else {
            Ext.MessageBox.alert('提示', '请至少选择一个正在使用中的床位!');
            return;
        }
        for (var i = 0; i < selectBed.length; i++) {
            me.returnWaitData(selectBed[i]);
        }
    },

    // 移至待入科请求操作
    returnWaitData: function(selectBed) {
        var me = this;
        var bedAll = getBeds(me.down('portalpanel').items.items);
        for (var i = 0; i < bedAll.length; i++) {
        	bedAll[i].header.items.items[0].setValue(false);
        }
        Ext.Ajax.request({
    		url: webRoot + '/nws/icu_beds/waitDeptDep/' + selectBed.BED_ID,
    		method: 'PUT',
    		params: {
                REGISTER_ID: selectBed.REGISTER_ID,
                patientName:selectBed.patientName
            },
            success: function(response) {},
            failure: function(response, options) {
            }
        });
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_beds/' + selectBed.REGISTER_ID,
            method: 'PUT',
            params: {
                icuId: selectBed.ICU_ID,
                BED_ID: selectBed.BED_ID,
                bedId: null,
                USED: 0,
                IN_TIME: null,
                STATUS_CODE: 'a34df80078fd11e39fd9cb7044fca372' // 未入科
            },
            success: function(response) {
                //增加异常处理，防止多个患者移到待入科时报错，王小伟2015-04-20
                try {
                    var bedNoCombo = Ext.getCmp('wait_dept_bedNo'),
                        waitGrid = me.parent.waitDept;
                    if (bedNoCombo != undefined) {
                        bedNoCombo.getStore().reload();
                    }
                    waitGrid.getStore().reload();
                    // waitGrid.getStore().add()
                    // var label = waitGrid.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1];
                    // Ext.getDom(label.el).innerHTML = '患者：共 ' + waitGrid.getStore().getCount() + ' 个';
                    var inDeptInfo = selectBed.down('form').items.items;
                    inDeptInfo[0].setValue(null);
                    inDeptInfo[1].setValue(null);
                    inDeptInfo[2].setValue(null);
                    inDeptInfo[3].setValue(null);
                    inDeptInfo[4].setValue(null);
                    // var bedHtml = selectBed.bedTemplate.apply({
                    //     patientName: '',
                    //     gender: '',
                    //     careLevel: '',
                    //     conditionName: '',
                    //     nurseName: ''
                    // });
                    // Ext.getDom(selectBed.items.items[0].el).innerHTML = bedHtml;
                    Ext.getDom(selectBed.header.items.items[2].el).innerHTML = selectBed.currStatus + 'icu-idle.png" />';
                    var REGISTER_ID=selectBed.REGISTER_ID;
                    selectBed.bedStatus = false;
                    selectBed.REGISTER_ID = '';
                    selectBed.PATIENT_ID = '';
                    selectBed.down('form').removeBodyCls(selectBed.down('form').bodyCls);
                } catch(e) {

                }
                me.parent.returnWaitCallback(REGISTER_ID);
                var portal = me.down('portalpanel');
                me.locateTarget=null;
                me.initBedInfo(portal, portal.getWidth());
                var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台';
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '移至待入科患者失败,请求超时或网络故障!');
            }
        });
    },

    // 初始化每个小panel可拖拽
    initializeAlreadyToDeptDropZone: function(v, alreadyPanel) {
        var waitGrid = alreadyPanel.parent.waitDept;
        v.dropTarget = new Ext.dd.DropTarget(v.el, {
            ddGroup: 'gridtoportal',
            notifyOver: function(source, e, data) {
                // 不能拖动到正在使用中的床位
                if (!v.bedStatus)
                    return "x-dd-drop-ok";
                else
                    return "x-dd-drop-nodrop";
            },
            notifyDrop: function(source, e, data) {
                var records = data.records,
                    bedAll = [],
                    bedColumns = v.up('portalpanel').items.items;
                // 获取当前所有的床位信息
                bedAll = getBeds(bedColumns);
                var bedObject = {}
                // 如果有拖动的是多条记录，若全部有床号，则绑定。否则提示错误
                if (records.length > 1) {
                    for (var i = 0; i < records.length - 1; i++) {
                        if (records[i].data.BED_ID.length == 0 || records[records.length - 1].data.BED_ID.length == 0) {
                            Ext.MessageBox.alert('提示', '拖动多条记录，必须全部选择床号！');
                            return;
                        }
                        for (var j = i + 1; j < records.length; j++) {
                            if (records[i].data.BED_ID == records[j].data.BED_ID) {
                                Ext.MessageBox.alert('提示', '床号重复，请重新选择床号!');
                                return;
                            }
                        }
                    }
                    // 入科，绑定到选定的床位上
                    for (var i = 0; i < records.length; i++) {
                        for (var j = 0; j < bedAll.length; j++) {
                            var curr = bedAll[j];
                            if (records[i].data.BED_ID == curr.BED_ID) {
                                intoDeptOpera(curr, records[i], waitGrid);
                            }
                        }
                    }
                } else {
                    // 如果已选床号，则不管拖放目标在哪儿，都绑定到选择的床位上
                    if (records[0].data.BED_ID) {
                        for (var i = 0; i < bedAll.length; i++) {
                            var curr = bedAll[i];
                            if (records[0].data.BED_ID == curr.BED_ID) {
                                intoDeptOpera(curr, records[0], waitGrid);
                            }
                        }
                        // 没选床号则直接绑定到拖放的目标床位上
                    } else {
                        if (!v.bedStatus) {
                            intoDeptOpera(v, records[0], waitGrid);
                        }
                    }
                }
                return true;
            }
        });
    }
});


//监测项目维护窗口 hasParent : 是否有父节点
function createCareProjectMaintainWindow(hasParent) {
    var careItemTreeGrid = Ext.getCmp('nws-care-project-treegrid'),
        records = careItemTreeGrid.getSelectionModel().getSelection();
    var type='';
    if (hasParent == 'update') {
    	type='edit';
    }
    var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.CareProjectMaintainWindow', {
    	type:type,
        addNode: function(node) {
            if (hasParent == 'update') {
                Ext.apply(records[0].data, node);
                for (var i = 0; i < records[0].childNodes.length; i++) {
                	records[0].childNodes[i].data.DISPLAY_TO_CENTRAL=records[0].data.DISPLAY_TO_CENTRAL;
                	records[0].childNodes[i].data.DISPLAY_TO_RECORDS=records[0].data.DISPLAY_TO_RECORDS;
                	records[0].childNodes[i].data.IS_DAILY=records[0].data.IS_DAILY;
                	Ext.apply(records[0].childNodes[i].data, records[0].childNodes[i]);
                }
                var curr;
                var currRecord;
                currRecord= records[0];
//                if (!currRecord.isExpanded()) {
//                    currRecord.expand();
//                    curr=records[0];
//                }
                //currRecord.expand();
                  var currRecord=careItemTreeGrid.getSelectionModel().getSelection();
                  currRecord[0].data.select = true;
                  currRecord[0].commit();
                //careItemTreeGrid.getSelectionModel().select(node);
                //careItemTreeGrid.getView().refresh();
            } else {
                node.ID = '';
                node.WIDTH = 60;
                node.iconCls = 'care-child';
                node.leaf = false;
                var currRecord;
                if (hasParent == true) {
                    node.PARENT_ID = records[0].data.ID;
                    currRecord = records[0];
                } else if (hasParent == false) {
                    node.PARENT_ID = '';
                    currRecord = careItemTreeGrid.getStore().getRootNode();
                }
                var child = Ext.create('com.dfsoft.icu.nws.bedmanagement.CareProjectTreeModel', node);
                child.data.alertStr = child.raw.alertStr;
                var curr = currRecord.appendChild(child);
                if (!currRecord.isExpanded()) {
                    currRecord.expand();
                }
                careItemTreeGrid.getSelectionModel().select(curr);
            }
        }
    });
    //dlg.show();
    careItemTreeGrid.parent.showModalWindow(dlg);
    var careProjectMaintainForm = dlg.careProjectMaintainForm,
        datasourceCode = careProjectMaintainForm.getForm().findField('DATASOURCE_CODE'), //数据来源
        datasourceValue = careProjectMaintainForm.getForm().findField('DATASOURCE_VALUE'); //数据来源 值
    // 点击操作列上的加号 则数据来源为必填项
    if (hasParent == true) {
        datasourceCode.allowBlank = false;
        datasourceValue.allowBlank = false;
        careProjectMaintainForm.getForm().setValues({
            SUPERIOR_PRESET_CODE: records[0].data.PRESET_CODE,
            SUPERIOR_NAME: records[0].data.NAME,
            SUPERIOR_ALIAS: records[0].data.ALIAS,
            SUPERIOR_UNIT_CODE: records[0].data.UNIT_CODE,
            SUPERIOR_DATASOURCE_VALUE: records[0].data.DATASOURCE_VALUE,
        });
        // 点击右上角的加号 则数据来源可以不为必填项
    } else if (hasParent == false) {
        datasourceCode.allowBlank = true;
        datasourceValue.allowBlank = true;
    } else if (hasParent == 'update') { // 修改监护项目
        var currItemValues = {
            PRESET_CODE: records[0].data.PRESET_CODE,
            NAME: records[0].data.NAME,
            ALIAS: records[0].data.ALIAS,
            UNIT_CODE: records[0].data.UNIT_CODE,
            DATASOURCE_CODE: records[0].data.DATASOURCE_CODE,
            //DATASOURCE_VALUE: records[0].data.DATASOURCE_VALUE,
            DISPLAY_TO_CENTRAL: records[0].data.DISPLAY_TO_CENTRAL == 1 ? true : false,
            DISPLAY_TO_RECORDS: records[0].data.DISPLAY_TO_RECORDS == 1 ? true : false,
            IS_DAILY: records[0].data.IS_DAILY == 1 ? true : false,
            SUM_POSITION: records[0].data.SUM_POSITION
        };
        if (records[0].data.PARENT_ID.length > 0) {
            currItemValues.SUPERIOR_PRESET_CODE = records[0].parentNode.data.PRESET_CODE;
            currItemValues.SUPERIOR_NAME = records[0].parentNode.data.NAME;
            currItemValues.SUPERIOR_ALIAS = records[0].parentNode.data.ALIAS;
            currItemValues.SUPERIOR_UNIT_CODE = records[0].parentNode.data.UNIT_CODE;
        }
        careProjectMaintainForm.getForm().setValues(currItemValues);
        // 根据数据来源的不同，加载不同的下拉树
        var preName = careProjectMaintainForm.getForm().findField('NAME'),
            datasourceValueStore = datasourceValue.getPicker().getStore();
        if (records[0].data.DATASOURCE_CODE == '56d2ce90fdad11e2b0ab11ca6e0o12d8') { //手工录入
            // 父节点是生命体征的 数据来源还是监护项
            if (records[0].parentNode.data.PRESET_CODE == 'bt64f80078fd11e39fd9cb7044fca582') {
                datasourceValueStore.proxy.url = webRoot + '/dic/monitor/items/tree';
                datasourceValue.setFieldLabel('监护项');
            } else {
                datasourceValueStore.proxy.url = webRoot + '/dic/dic_care_item/tree/all';
                datasourceValue.setFieldLabel('字典');
            }
        } else if (records[0].data.DATASOURCE_CODE == '7992ce90fdad11e2b0ab11ca6e98dc94') { //自动获取
            datasourceValueStore.proxy.url = webRoot + '/dic/monitor/items/tree';
            datasourceValue.setFieldLabel('监护项');
        } else if (records[0].data.DATASOURCE_CODE == '23hace90fdad11e2b0ab11ca6e32t6x1') { //危重评分
            dlg.careProjectMaintainForm.alertGrid.setDisabled(true);
            datasourceValueStore.proxy.url = webRoot + '/nws/icu/care_scores/getScores';
            datasourceValue.setFieldLabel('评分');
        }
        // 如过当前项是预置项，则打开后名称前显示预置项图标
        if (currItemValues.PRESET_CODE == '1c4267adc60e11e395078c89a5769562' || currItemValues.PRESET_CODE == '24550929c37611e39dd9e41f1364eb96' || currItemValues.PRESET_CODE == '278366bfc60e11e395078c89a5769562' || currItemValues.PRESET_CODE == '337d27b9c37611e39dd9e41f1364eb96' || currItemValues.PRESET_CODE == '4223357dc37611e39dd9e41f1364eb96' || currItemValues.PRESET_CODE == '4db35a85c37611e39dd9e41f1364eb96'|| currItemValues.PRESET_CODE == 'a452f80078fd11e39fd9cb7044fhu458'|| currItemValues.PRESET_CODE == 'bt64f80078fd11e39fd9cb7044fca582'|| currItemValues.PRESET_CODE == 'cxe4f80078fd11e39fd9cb704412gt89') {
            careProjectMaintainForm.presetItemSelect(careProjectMaintainForm, currItemValues.PRESET_CODE, preName);
        }
        // 回调设置 数据来源 下拉树的值
        datasourceValueStore.load({
            callback: function() {
                var datasourceRecord = datasourceValueStore.getNodeById(records[0].data.DATASOURCE_VALUE);
                if (datasourceRecord != undefined) {
                    datasourceValue.setDefaultValue(datasourceRecord.data.id, datasourceRecord.data.text);
                }
            }
        });


        // 如果修改之后再次打开，则填充上次修改的警示信息
        var alertStore = dlg.careProjectMaintainForm.alertGrid.getStore();
        if (records[0].data.alertStr) {
            var alertItems = records[0].data.alertStr.split('|');
            for (var i = 0; i < alertItems.length; i++) {
                var currItem = alertItems[i].split('~');
                var alert = [{
                    'ID': '',
                    'ITEM_ID': '',
                    'FORMULA': Ext.decode(currItem[0]),
                    'COLOR': currItem[1],
                    'DESCRIPTION': currItem[2]
                }];
                alertStore.loadData(alert, true);
            }
            // 否则第一次打开 则加载url
        } else {
            // 加载警示grid
            if (records[0].data.ID && records[0].data.ID.length > 0) {
                alertStore.proxy.url = webRoot + '/nws/icu_bed_item/getAlertItem/' + records[0].data.ID;
                alertStore.load();
            }
        }
    }
}

// 删除监测项目
function deleteCareItem() {
    var careItemTreeGrid = Ext.getCmp('nws-care-project-treegrid'),
        selectRecord = careItemTreeGrid.getSelectionModel().getSelection();
    if (selectRecord.length == 0) {
        Ext.MessageBox.alert('提示', '请选择一条监护项目!');
        return;
    }
    if (selectRecord[0].hasChildNodes()) {
        Ext.Msg.alert("删除节点", "请先删除所有子节点，再删除该节点！");
        // 如果有子节点，且未展开，则展开
        if (!selectRecord[0].isExpanded()) {
            selectRecord[0].expand();
        }
        return;
    }
    var content = '确定删除监护项: ' + selectRecord[0].raw.NAME + ' ?';
    Ext.Msg.confirm('删除节点', content, function(btn) {
        if (btn == 'yes') {
            var id = selectRecord[0].data.ID;
            if (id.length > 0) {

//                Ext.Ajax.request({
//                    url: webRoot + '/nws/icu_bed_item/' + id,
//                    method: 'DELETE',
//                    success: function(response) {
//                        var respText = Ext.decode(response.responseText);
//                        selectRecord[0].remove();
//                    },
//                    failure: function(response, options) {
//                        Ext.MessageBox.alert('提示', '删除监护项失败,请求超时或网络故障!');
//                    }
//                });
            	selectRecord[0].remove();
            } else {
                selectRecord[0].remove();
            }
        }
    });
}


// 创建警示条件窗口
// params: operators 当前列的运算符  formulaValue： 警示值
function createAlertConditionWindow(operators, formulaValue) {
    // 如果是手工录入 且设置的字典的录入方式 为下拉框
    var careProjectMaintainForm = Ext.getCmp('nws-alert-grid').parent, //监护项目维护Form
        dataSourceField = careProjectMaintainForm.getForm().findField('DATASOURCE_VALUE'),
        dataSourceValue = dataSourceField.getSubmitValue(),
        dataSourceLabel = dataSourceField.getFieldLabel(),
        INPUT_TYPE = null,
        DATA_FORMAT = null;
    if (dataSourceLabel == '字典') {
        Ext.Ajax.request({
            url: webRoot + '/dic/dic_care_item/' + dataSourceValue,
            method: 'GET',
            async: false, //同步
            success: function(response) {
                var respText = Ext.decode(response.responseText);
                //  录入方式为下拉选择 
                if (respText.data.length > 0) {
                    INPUT_TYPE = respText.data[0].INPUT_TYPE;
                    // 根据设置的数据格式选择不同的运算符
                    DATA_FORMAT = respText.data[0].DATA_FORMAT;
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取失败,请求超时或网络故障!');
            }
        });
    }
    // 创建警示条件窗口
    var dlg = Ext.create('com.dfsoft.icu.nws.bedmanagement.AlertConditionWindow', {
        INPUT_TYPE: INPUT_TYPE,
        DATA_FORMAT: DATA_FORMAT,
        dataSourceValue: dataSourceValue,
        FORMULA_VALUE: formulaValue
    });

    //dlg.show();
    careProjectMaintainForm.parent.showModalWindow(dlg);
    // 非
    var non = false,
        newOperators = operators.replace(/!/g, '');
    if (operators.indexOf('!') >= 0) {
        non = true;
    } else if (operators.indexOf('不') >= 0) {
        non = true;
        newOperators = operators.replace('不', '');
    }

    dlg.alertConditionForm.getForm().setValues({
        NON: non,
        OPERATORS: newOperators,
        FORMULA_VALUE: formulaValue
    });
}