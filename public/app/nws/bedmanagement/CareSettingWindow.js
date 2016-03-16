/**
 * 功能说明:  监护设置 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.CareSettingWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.CareSettingTabPanel'
    ],
    initComponent: function() {
        var me = this;
        me.nurseInfo=[];
        me.careSettingTabPanel = new com.dfsoft.icu.nws.bedmanagement.CareSettingTabPanel({
            parent: me
        });
        Ext.apply(me, {
            title: '监护设置',
            iconCls: 'care-setup',
            layout: 'fit',
            width: 630,
            height: 460,
            //modal: true,
            items: [me.careSettingTabPanel],
            buttons: [{
                text: '保存',
                iconCls: 'save',
                scope: me,
                handler: me.saveData
            }, {
                text: '取消',
                iconCls: 'cancel',
                scope: me,
                handler: function() {
                    me.close();
                }
            }]
        });
        me.callParent();
    },


    // 保存监护设置
    saveData: function() {
        var me = this;
        var basicSettingsForm = me.careSettingTabPanel.basicSettingsForm,
            form = basicSettingsForm.getForm(),
            equipmentGrid = basicSettingsForm.equipmentGrid,
            equipmentStore = equipmentGrid.getStore(),
            bed_adapterStr = '',bed_nouseadapterStr = '';
        var careProjectTreeGrid = me.careSettingTabPanel.careProjectTreeGrid;
        var careProjectTreeStore = careProjectTreeGrid.getStore();
        var flag=false;
        if(me.REGISTER_ID!=''&&me.REGISTER_ID!=null&&me.REGISTER_ID!=undefined){
        	me.patientInfo=me.getPatientInfo(me.REGISTER_ID);
        }
        
     // 循环整棵树, 深度处理
        var childs = careProjectTreeStore.getRootNode().childNodes;
        for (var i = 0; i < childs.length; i++) {
        	var currNode=childs[i];
        	var width=parseInt(currNode.data.WIDTH);
        	if(width>99999){
        		flag=true;
        	}
        	if (currNode.hasChildNodes()) {
                for (var k = 0; k < currNode.childNodes.length; k++) {
                	var width=parseInt(currNode.childNodes[k].data.WIDTH);
                	if(width>99999){
                		flag=true;
                	}
                }
            }
        }
//        var tree=basicSettingsForm.BedItemComboBoxTree;
//        var showColumn=tree.getSelsJson();
//        console.log(showColumn);
//        Ext.Ajax.request({
//    		url: webRoot + '/nws/icu_bed_item/updateItemRecordStatus/' + me.BED_ID,
//    		method: 'PUT',
//    		params: {
//        	showColumn: showColumn
//            },
//            success: function(response) {},
//            failure: function(response, options) {
//            }
//        });
        // 仪器设备数组
        for (var i = 0; i < equipmentStore.getCount(); i++) {
            var curr = equipmentStore.getAt(i);
            if (curr.get('ID').length > 0 && curr.get('USE')==true) {
                bed_adapterStr += curr.get('ID') + ',';
            }
            if (curr.get('ID').length > 0 && curr.get('USE')==false) {
            	bed_nouseadapterStr += curr.get('ID') + ',';
            }
        }
        //var saveButton = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0];
        if (form.isValid()) {
        	var CARE_START_TIME=new Date(form.findField('CARE_START_TIME').getValue()).Format("yyyy-MM-dd hh:mm");
        	var nowtime=new Date().Format("yyyy-MM-dd hh:mm");
        	if(me.patientInfo && me.patientInfo.HOSPITAL_DATE!=null){
        		if(CARE_START_TIME<new Date(me.patientInfo.HOSPITAL_DATE).Format("yyyy-MM-dd hh:mm")){
            		Ext.MessageBox.alert('提示', '护理记录开始时间不能小于入院时间!');
                	return false;
            	}
        	}
        	if(CARE_START_TIME>nowtime){
        		Ext.MessageBox.alert('提示', '护理记录开始时间不能大于当前时间!');
            	return false;
        	}
        	if(form.findField('NURSE_ID').getRawValue()!=null&&form.findField('NURSE_ID').getRawValue()!=""){
        		var nurseInfo=me.getNurseInfo(userInfo.deptId);
        		for(var i=0;i<nurseInfo.data.length;i++){
        			if(form.findField('NURSE_ID').getRawValue()==nurseInfo.data[i].text){
        				form.findField('NURSE_ID').setValue(nurseInfo.data[i].value);
        			}
        		}
            	if(form.findField('NURSE_ID').getValue().length!=32){
                	Ext.MessageBox.alert('提示', '主管护士不存在!');
                	return false;
                }
            }
            //saveButton.setDisabled(true);
            //遮罩效果
            var myMask = new Ext.LoadMask(me, {
                msg: "保存中..."
            });
            myMask.show();
            var IN_DEPT_ID="";
            var IN_DEPT_NAME = "";
            if(me.REGISTER_ID==null||me.REGISTER_ID==''){
            	IN_DEPT_ID=null;
            }else{
            	IN_DEPT_ID=me.patientInfo.IN_DEPT_ID;
                IN_DEPT_NAME = me.patientInfo.IN_DEPT_NAME;
            }
            form.submit({
                url: webRoot + '/nws/icu_beds/adapter/' + me.BED_ID,
                method: 'PUT',
                params: {
                    REGISTER_ID: me.REGISTER_ID,
                    PATIENT_ID: me.PATIENT_ID,
                    bed_adapterStr: bed_adapterStr,
                    bed_nouseadapterStr:bed_nouseadapterStr,
                    IN_DEPT_ID: IN_DEPT_ID,
                    IN_DEPT_NAME: IN_DEPT_NAME
                },
                success: function(form, action) {
                    //在床位保存模板id，如果没有打开tab页，不再保存模板
                    try {
                        var TEMPLATE_ID = me.careSettingTabPanel.careProjectTreeGrid.getDockedItems('toolbar[dock="top"]')[0].items.items[1].valueModels[0].data.ID;
                        Ext.Ajax.request({
                            url: webRoot + '/nws/icu_beds/updateBedtemplateID',
                            method: 'POST',
                            params: {
                                BED_ID: me.BED_ID,
                                TEMPLATE_ID: TEMPLATE_ID
                            },
                            success: function(response) {

                            },
                            failure: function(response, options) {
                                myMask.hide();
                                Ext.MessageBox.alert('提示', '保存床位模板失败!');
                            }
                        });
                    } catch(e) {

                    }
                	if(me.REGISTER_ID!=''&&me.REGISTER_ID!=null&&me.REGISTER_ID!=undefined){
                		var CARE_INTERVAL=parseInt(form.findField('CARE_INTERVAL').getValue());
                		var NEW_TIME=new Date(form.findField('CARE_START_TIME').getRawValue()).Format("yyyy-MM-dd hh:mm");
                        var CARE_START_TIME=new Date(me.patientInfo.CARE_START_TIME).Format("yyyy-MM-dd hh:mm");
                        if(NEW_TIME==CARE_START_TIME){
                          Ext.Ajax.request({
                    		url: webRoot + '/nws/icu_beds/changNurseItem/' + me.BED_ID,
                    		method: 'PUT',
                    		params: {
                                REGISTER_ID: me.REGISTER_ID,
                                PATIENT_ID: me.PATIENT_ID,
                                BED_ID:me.BED_ID,
                                CARE_INTERVAL:CARE_INTERVAL,
                                patientName:me.patientName,
                                CARE_START_TIME:CARE_START_TIME,
                                
                            },
                            success: function(response) {},
                            failure: function(response, options) {
                            }
                        });
                        }else {
                        	Ext.Ajax.request({
                        		url: webRoot + '/nws/icu_beds/changNurseHaveTime/' + me.BED_ID,
                        		method: 'PUT',
                        		params: {
                                    REGISTER_ID: me.REGISTER_ID,
                                    PATIENT_ID: me.PATIENT_ID,
                                    BED_ID:me.BED_ID,
                                    CARE_INTERVAL:CARE_INTERVAL,
                                    patientName:me.patientName,
                                    changFrontTime:CARE_START_TIME,
                                    changBackTime:NEW_TIME
                                },
                                success: function(response) {},
                                failure: function(response, options) {
                                }
                            });
                        }
                        me.patientInfo.CARE_START_TIME=NEW_TIME;
                        me.patientInfo.IN_TIME=NEW_TIME;
                        Ext.util.Cookies.set("patientInfo", Ext.encode(me.patientInfo));
                	}
                    //saveButton.setDisabled(false);
                    var mes=Ext.getCmp('AlreadyDeptPanel');
                    if (mes!= undefined) {
                        var portal = mes.down('portalpanel');
                        mes.locateTarget=null;
                        if(portal.getWidth()>0){
                        	mes.initBedInfo(portal, portal.getWidth());
                        }
                        
                    }
                    var templateItems = careProjectTreeGrid.getDockedItems('toolbar[dock="top"]')[0].items.items[1].getValue();
                    if (careProjectTreeGrid) {
                        // 应用模板后 在保存时则先删除当前床位上的所有监护项
                        //if (templateItems != null && templateItems.length > 0) {
                            Ext.Ajax.request({
                                url: webRoot + '/nws/icu_bed_item/deleteItemsByBedId/' + me.BED_ID,
                                method: 'DELETE',
                                async: false,
                                success: function(response) {},
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '删除监护项失败,请求超时或网络故障!');
                                }
                            });
                        //}
                        var addtrees=[];
                        var updatetrees=[];
                        for (var i = 0; i < childs.length; i++) {
                            childs[i].data.SORT_NUMBER = i + 1;
                            if(childs[i].data.ID=='root')childs[i].data.ID='';
                            // 修改
                            if (childs[i].data.ID.length > 0) {
                                me.careProjectTreeUpdateData(childs[i], 'PUT', null,addtrees,updatetrees);
                            } else {
                                me.careProjectTreeAddData(childs[i], 'POST', null,addtrees,updatetrees);
                            }
                        }
                    	Ext.Ajax.request({
                		url:webRoot + '/nws/icu_bed_item/' + me.BED_ID,
                        method: 'PUT',
                        async: false,
                        params: {
                    		addtrees: JSON.stringify(addtrees),
                    		updatetrees:JSON.stringify(updatetrees),
                    		BED_ID:me.BED_ID
                    		},
                        success: function(response) {
                        },
                        failure: function(response, options) {
                            Ext.MessageBox.alert('提示', '监护项目保存失败,请求超时或网络故障!');
                        }
                    	});
//                        if(!boolean){
//                        	Ext.Ajax.request({
//                        		url:webRoot + '/nws/icu_bed_item/',
//                                method: 'POST',
//                                async: false,
//                                params: {
//                            		trees: JSON.stringify(addtrees)
//                            		},
//                                success: function(response) {
//                                },
//                                failure: function(response, options) {
//                                    Ext.MessageBox.alert('提示', '监护项目保存失败,请求超时或网络故障!');
//                                }
//                            });
//                        }else{
//                        	Ext.Ajax.request({
//                        		url:webRoot + '/nws/icu_bed_item/' + me.BED_ID,
//                                method: 'PUT',
//                                async: false,
//                                params: {
//                            		trees: JSON.stringify(trees)
//                            		},
//                                success: function(response) {
//                                },
//                                failure: function(response, options) {
//                                    Ext.MessageBox.alert('提示', '监护项目保存失败,请求超时或网络故障!');
//                                }
//                            });
//                        }
                        myMask.hide();
                        me.close();
                        try{
                            if(me.parentPanel.bedPanel){
                                me.parentPanel.bedPanel.selectPatientInfo(me.patientInfo);
                            }
                        }catch(e){}
                    }
                },
                failure: function(form, action) {
                    myMask.hide();
                    //saveButton.setDisabled(false);
                    Ext.MessageBox.alert('提示', '基本设置保存失败,请求超时或网络故障!');
                }
            });
        }
    },

    // 监护项目格式
    getCurrItem: function(record) {
        var me = this;
        var curr = {
            BED_ID: me.BED_ID,
            PRESET_CODE: record.data.PRESET_CODE,
            NAME: record.data.NAME,
            ALIAS: record.data.ALIAS,
            UNIT_CODE: record.data.UNIT_CODE,
            DATASOURCE_CODE: record.data.DATASOURCE_CODE,
            DATASOURCE_VALUE: record.data.DATASOURCE_VALUE,
            WIDTH: record.data.WIDTH,
            DISPLAY_TO_CENTRAL: record.data.DISPLAY_TO_CENTRAL,
            DISPLAY_TO_RECORDS: record.data.DISPLAY_TO_RECORDS,
            IS_DAILY:record.data.IS_DAILY,
            SUM_POSITION: record.data.SUM_POSITION,
            SORT_NUMBER: record.data.SORT_NUMBER,
            alertStr:record.data.alertStr
        }
        return curr;
    },


    // 循环保存树 深度处理
    careProjectTreeAddData: function(currNode, method, pid,addtrees,updatetrees) {
        var me = this;
        var uuid = Ext.create('Ext.data.UuidGenerator').generate().replace(/-/g,'');
        // 如果当前节点有子节点
        var params = me.getCurrItem(currNode);
//        if (currNode.data.alertStr != undefined) {
//            params.alertStr = currNode.data.alertStr;
//        }
        //删除数据库中不存在的对象属性
        //params.REGISTER_ID=me.REGISTER_ID;
        params.PARENT_ID = pid;
        params.VALID=1;
        	//新增
        	params.ID =uuid;
        	currNode.data.ID =params.ID;
        	addtrees.push(params);
            if (currNode.hasChildNodes()) {
                for (var i = 0; i < currNode.childNodes.length; i++) {
                    currNode.childNodes[i].data.SORT_NUMBER = i + 1;
                    if(currNode.childNodes[i].data.ID=='root')currNode.childNodes[i].data.ID='';
                    if (currNode.childNodes[i].data.ID.length > 0) {
                    	//updatetrees.push(params);
                        me.careProjectTreeUpdateData(currNode.childNodes[i], 'PUT', currNode.data.ID,addtrees,updatetrees);
                    } else {
                    	//addtrees.push(params);
                        me.careProjectTreeAddData(currNode.childNodes[i], 'POST', currNode.data.ID,addtrees,updatetrees);
                    }
                }
            }
    },
    
    // 循环保存树 深度处理
    careProjectTreeUpdateData: function(currNode, method, pid,addtrees,updatetrees) {
        var me = this;
        var uuid = Ext.create('Ext.data.UuidGenerator').generate().replace(/-/g,'');
        // 如果当前节点有子节点
        var params = me.getCurrItem(currNode);
        if (currNode.data.alertStr != undefined) {
            params.alertStr = currNode.data.alertStr;
        }
        //删除数据库中不存在的对象属性
        //params.REGISTER_ID=me.REGISTER_ID;
        params.PARENT_ID = pid;
        params.VALID=1;
        //修改
        	params.ID=currNode.data.ID;
        	updatetrees.push(params);
            if (currNode.hasChildNodes()) {
                for (var i = 0; i < currNode.childNodes.length; i++) {
                    currNode.childNodes[i].data.SORT_NUMBER = i + 1;
                    if(currNode.childNodes[i].data.ID=='root')currNode.childNodes[i].data.ID='';
                    if (currNode.childNodes[i].data.ID.length > 0) {
                    	//updatetrees.push(params);
                        me.careProjectTreeUpdateData(currNode.childNodes[i], 'PUT', currNode.data.ID,addtrees,updatetrees);
                    } else {
                    	//addtrees.push(params);
                        me.careProjectTreeAddData(currNode.childNodes[i], 'POST', currNode.data.ID,addtrees,updatetrees);
                    }
                }
            }
    },

    //显示模态窗口
    showModalWindow: function(win) {
        var me = this;
        //创建遮罩效果
        me.loadMask = new Ext.LoadMask(me, {
            msg: "数据加载中...",
            useMsg: false
        });
        me.hasModalChild = true;
        me.loadMask.show();
        win.on("close", function(_panel, eOpts) {
            me.loadMask.hide();
            me.hasModalChild = false;
        }, this);
        win.show();
    },
    getPatientInfo: function(registerId) {
        var patientInfo = null;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_patient/' + registerId,
            method: 'GET',
            async: false,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                patientInfo = respText[0];
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
            }
        });
        return patientInfo;
    },
    getNurseInfo: function(deptId) {
    	var nurseInfo = null;
        Ext.Ajax.request({
        	url: webRoot + '/sys/searchUser/' + 'all/nurse/'+deptId,
            method: 'GET',
            async: false,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                nurseInfo=respText;
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
            }
        });
        return nurseInfo;
    }
});