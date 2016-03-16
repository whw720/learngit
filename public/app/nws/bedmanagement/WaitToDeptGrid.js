/**
 * 功能说明: 待入科患者 grid
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.WaitToDeptGrid', {
    extend: 'Ext.grid.Panel',
    id:'WaitToDeptGrid',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.WaitToDeptStore',
        'com.dfsoft.icu.nws.patientdetails.PatientsAddWindow'
    ],
    //实现拖拽功能
    viewConfig: {
        trackOver: false,
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: 'gridtoportal'
        }
    },
    initComponent: function() {
        var me = this;
         var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
             clicksToEdit: 1,
             listeners: {
                 edit: function(editor, e) {
                     e.record.commit();
                 }
             }
         });
        var waitStore = new com.dfsoft.icu.nws.bedmanagement.WaitToDeptStore();
        waitStore.load({params:{deptId:userInfo.deptId},
            callback: function() {
                var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1];
                Ext.getDom(label.el).innerHTML = '患者：共 ' + waitStore.getCount() + ' 个';
            }
        });
        var noUsedStore= new Ext.data.Store({
            fields: ['value', 'text'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/icu_beds/noUsed/' + userInfo.deptId,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        Ext.apply(me, {
            region: 'west',
            width: '46%',
            id:'waitdeptgrid',
            border: true,
            columnLines: true,
            store: waitStore,
            split: {
                size: 5
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 37,
                items: ['待入科患者：',{
                    xtype: 'button',
                    tooltip: '同步数据',
                    iconCls: 'data-refresh',
                    handler: function() {
                		this.setDisabled(true);
                        Ext.Ajax.request({
                            url:webRoot + '/link/patient/requestSyncPatients/patient-icu/null/'+(!userInfo.deptSid||userInfo.deptSid==''?'null':userInfo.deptSid)+'/null',
                            method: 'get',
                            scope: this,
                            success: function(response) {
                                var respText = Ext.decode(response.responseText).data;
                               if(respText.success==true){
                            	   Ext.Ajax.request({
                                       url:webRoot + '/link/surgery/updatePatientSurgerys/',
                                       method: 'get',
                                       scope: this,
                                       success: function(response) {
                                           var respText = Ext.decode(response.responseText).data;
                                          if(respText.success==true){
                                       	   waitStore.reload({params:{deptId:userInfo.deptId}});
                                          }

                                       },
                                       failure: function(response, options) {
                                           Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                                       }
                                   });
                               }else{
                                   Ext.MessageBox.alert('提示', respText.msg);
                               }

                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', ',请求超时或网络故障!');
                            }
                        });
                        //刷新未使用床位信息
                        this.setDisabled(false);
                        noUsedStore.reload();
                    }
                }, '->',{
                    xtype: 'button',
                    tooltip: '增加患者信息',
                    iconCls: 'add',
                    //disabled: true,
                    scope: me,
                    handler: me.patientAdd
                },'-',
                {
                    xtype: 'button',
                    tooltip: '修改患者信息',
                    iconCls: 'edit',
                    //disabled: true,
                    scope: me,
                    handler: me.updatePatient
                },'-',
                {
                    xtype: 'button',
                    tooltip: '删除患者信息',
                    iconCls: 'delete',
                    //disabled: true,
                    scope: me,
                    handler: me.delPatient
                },'-',
                {
                    xtype: 'button',
                    tooltip: '入科',
                    iconCls: 'right',
                    //disabled: true,
                    scope: me,
                    handler: me.intoDept
                }
                ]
            }, {
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', {
                    xtype: 'label',
                    html: '患者：共 ' + 0 + ' 个',
                    margin: '0 0 6 0'
                }]
            }],
            // style: {
            // 	borderTop: '1px solid silver',
            // 	borderBottom: '1px solid #99BCE8'
            // },
            columns: [{
                xtype: 'checkcolumn',
                text: '选择',
                sortable: true,
                dataIndex: 'select',
                width: 44,
                listeners: {
                    checkchange: function(_this, rowIndex, checked, eOpts) {
                        var currRecord = waitStore.getAt(rowIndex);
                        currRecord.commit();
                    }
                }
            }, {
                text: '床号',
                dataIndex: 'bedNo',
                width: 66,
                sortable: true,
                align: 'left',
                editor: {
                    xtype: 'combo',
                    id: 'wait_dept_bedNo',
                    editable: false,
                    listConfig: {
                        cls: 'border-list',
                        getInnerTpl: function() {
                            return '<span style=\'font-size:12px;color:black;borderColor:black\'>{text}</span>';
                        }
                    },
                    valueField: 'text',
                    displayField: 'text',
                    store: noUsedStore,
                    scope: me,
                    listeners: {
                    	render : function(p) {
                        p.getEl().on('keydown', function(e){ 
                        	if (e.getKey() == 46) { 
                        		p.setRawValue('');
                                p.setValue('');
                                var currRecord = me.getSelectionModel().getSelection();
                                currRecord[0].data.BED_ID='';
                            }
                        }); 
                    	},
                        select: function(_this, records, eOpts) {
                            var currRecord = me.getSelectionModel().getSelection();
                            currRecord[0].data.BED_ID = records[0].data.value;
                            currRecord[0].data.select = true;
                            currRecord[0].commit();
                            noUsedStore.remove(records);
                        },
                        change: function(_this, newValue, oldValue, eOpts) {
                        	if(oldValue!=''){
                            	Ext.Ajax.request({
                            		url: webRoot + '/nws/icu_beds/getNoUsedId/' + oldValue,
                                    method: 'PUT',
                                    params: {
                                        icuId: userInfo.deptId,
                                        bed_no: oldValue
                                    },
                                    async: false,
                                    success: function(response) {
                                        var respText = Ext.decode(response.responseText).data;
                                        if(respText[0]!=undefined){
                                        	var data2=[[respText[0].ID,oldValue]];
                                        	noUsedStore.add(data2);
                                        }
                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                                    }
                                });
                        	}
                        }
                    }
                }
            }, {
                text: '住院号',
                dataIndex: 'hospitalNo',
                width: 66,
                sortable: true,
                align: 'left'
            }, {
                text: '姓名',
                dataIndex: 'patientName',
                width: 66,
                sortable: true,
                align: 'left'
            }, {
                text: '性别',
                dataIndex: 'gender',
                width: 44,
                sortable: true,
                align: 'left'
            }
//            , {
//                text: '科室',
//                dataIndex: 'department',
//                width: 142,
//                sortable: true,
//                align: 'left'
//            }
            , {
                text: '出生日期',
                dataIndex: 'birthday',
                width: 88,
                sortable: true,
                align: 'left'
            }, 
//            {
//                text: '入院日期',
//                dataIndex: 'hospitalDate',
//                width: 88,
//                sortable: true,
//                align: 'left'
//            }, 
            {
                text: '诊断',
                dataIndex: 'diagnosis',
                sortable: true,
                align: 'left'
            }],
            selModel: Ext.create('Ext.selection.RowModel', {
                mode: "MULTI",
                listeners: {
                    select: function(_this, record, index, eOpts) {
                        if (!record.data.select) {
                            record.data.select = true;
                            record.commit();
                        }
                    },
                    deselect: function(_this, record, index, eOpts) {
                        if (record.data.select) {
                            record.data.select = false;
                            record.commit();
                        }
                    }
                }
            }),
            //selType: 'rowmodel',
            plugins:cellEditing
        });

        me.callParent();
    },

    // 入科
    intoDept: function() {
        var me = this,
            waitDeptStore = me.getStore(),
            waitDeptRecords = waitDeptStore.getRange(0, waitDeptStore.getCount()),
            bedColumns = me.up('panel').down('portalpanel').items.items,
            records = [],
            bedAll = [];
        // 勾选的记录
        for (var i = 0; i < waitDeptRecords.length; i++) {
            if (waitDeptRecords[i].data.select) {
                records.push(waitDeptRecords[i]);
            }
        }
        if (records.length < 1) {
            Ext.MessageBox.alert('提示', '请选择待入科患者!');
            return;
        }
        // 获取当前所有的床位信息
        bedAll = getBeds(bedColumns);
        // 当前床位上要显示的信息
        var bedObject = {}
        // 如果选择的是多条记录，则先判断是否有重复床号
        if (records.length > 1) {
            for (var i = 0; i < records.length - 1; i++) {
                if (records[i].data.BED_ID.length == 0 || records[records.length - 1].data.BED_ID.length == 0) {
                    // var intoDeptButton = me.getDockedItems('toolbar[dock="top"]')[0].items.items[3];
                    // intoDeptButton.setDisabled(true);
                    // intoDeptButton.setTooltip('请选择床号，或直接拖拽以绑定床位');
                    Ext.MessageBox.alert('提示', '请选择床号，或直接拖拽以绑定床位!');
                    return;
                }
                for (var j = i + 1; j < records.length; j++) {
                    if (records[i].data.BED_ID == records[j].data.BED_ID) {
                        // var intoDeptButton = me.getDockedItems('toolbar[dock="top"]')[0].items.items[3];
                        // intoDeptButton.setDisabled(true);
                        // intoDeptButton.setTooltip('床号重复，请重新选择床号！');
                        Ext.MessageBox.alert('提示', '床号重复!');
                        return;
                    }
                }
            }
            // 入科，绑定到选定的床位上
            for (var i=records.length-1; i>=0 ; i--) {
                var isFindBed = false;
                for (var j = 0; j < bedAll.length; j++) {
                    var curr = bedAll[j];
                    if (records[i].data.BED_ID == curr.BED_ID) {
                        isFindBed = true;
                    	Ext.Ajax.request({
                    		url: webRoot + '/nws/icu_beds/getUsed/' + records[i].data.BED_ID,
                    		method: 'PUT',
                    		params: {
                    		bedId: records[i].data.BED_ID
                            },
                            success: function(response) {
                            	var respText = Ext.decode(response.responseText).data;
                    			if(respText.flag==false){
                    				Ext.MessageBox.alert('提示',respText.msg);
                    				return false;
                    			}
                            },
                            failure: function(response, options) {
                            }
                        });
                        break;
                    }
                }
                if (isFindBed==false) {
                    records.splice(i, 1);
                }
            }
				batchintoDeptOpera(curr, records, me);
        } else {
            if (records[0].data.BED_ID.length == 0) {
                // var intoDeptButton = me.getDockedItems('toolbar[dock="top"]')[0].items.items[3];
                // intoDeptButton.setDisabled(true);
                // intoDeptButton.setTooltip('请选择床号，或直接拖拽以绑定床位');
                Ext.MessageBox.alert('提示', '请选择床号，或直接拖拽以绑定床位!');
                return;
            }
            for (var i = 0; i < bedAll.length; i++) {
                var curr = bedAll[i];
                if (records[0].data.BED_ID == curr.BED_ID) {
                	Ext.Ajax.request({
                		url: webRoot + '/nws/icu_beds/getUsed/' + records[0].data.BED_ID,
                		method: 'PUT',
                		params: {
                		bedId: records[0].data.BED_ID
                        },
                        success: function(response) {
                        	var respText = Ext.decode(response.responseText).data;
                			if(respText.flag==false){
                				Ext.MessageBox.alert('提示',respText.msg);
                			}else{
                				intoDeptOpera(curr, records[0], me);
                			}
                        },
                        failure: function(response, options) {
                        }
                    });
                }
            }
        }
    },
    patientAdd: function() {
  //患者详情
        //var patientsAddWindow = new com.dfsoft.icu.nws.patientdetails.PatientsAddWindow();
        //patientsAddWindow.show();
    	var me = this;
        var dlg = Ext.create('com.dfsoft.icu.nws.patientdetails.PatientsAddWindow');
        me.parent.nwsApp.showModalWindow(dlg);
        //dlg.show();
    },
    //修改患者信息
    updatePatient: function() {
    	var me = this;
        var waitDeptStore = me.getStore();
        var waitDeptRecords = waitDeptStore.getRange(0, waitDeptStore.getCount());
        var records = [];
     // 勾选的记录
        for (var i = 0; i < waitDeptRecords.length; i++) {
            if (waitDeptRecords[i].data.select) {
                records.push(waitDeptRecords[i]);
            }
        }
        if (records.length < 1) {
            Ext.MessageBox.alert('提示', '请选择待入科患者!');
            return;
        }
        var patientInfo = me.getPatientInfo(records[0].data.REGISTER_ID);
        var dlg = Ext.create('com.dfsoft.icu.nws.patientdetails.PatientsUpdateWindow',{patientInfo:patientInfo});
        //dlg.show();
        me.parent.nwsApp.showModalWindow(dlg);
    },
  //修改患者信息
    delPatient: function() {
        var me = this;
        var waitDeptStore = me.getStore();
        var waitDeptRecords = waitDeptStore.getRange(0, waitDeptStore.getCount());
        var records = [];
     // 勾选的记录
        for (var i = 0; i < waitDeptRecords.length; i++) {
            if (waitDeptRecords[i].data.select) {
                records.push(waitDeptRecords[i]);
            }
        }
        if (records.length < 1) {
            Ext.MessageBox.alert('提示', '请选择待入科患者!');
            return;
        }
        Ext.Msg.confirm('删除患者', '确定删除待入科患者?', function(btn) {
            if (btn == 'yes') {
            	var REGISTER_ID="";
            	var PATIENT_ID="";
            	for(var i=0;i<records.length;i++){
            		REGISTER_ID=REGISTER_ID+records[i].data.REGISTER_ID+",";
            		PATIENT_ID=PATIENT_ID+records[i].data.PATIENT_ID+",";
            	}
            	REGISTER_ID=REGISTER_ID.substring(0,REGISTER_ID.length-1);
            	PATIENT_ID=PATIENT_ID.substring(0,PATIENT_ID.length-1);
            	Ext.Ajax.request({
                	url: webRoot + '/nws/icu_patient/deleteWaitDept/' + records[0].data.REGISTER_ID,
                    method: 'PUT',
                    params: {
                    	REGISTER_ID:REGISTER_ID,
                        PATIENT_ID:PATIENT_ID
                    },
                    success: function(response) {
                        Ext.getCmp('waitdeptgrid').getStore().reload();
                        var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                        if (bedNoCombo != undefined) {
                            bedNoCombo.getStore().reload();
                        }
                    },
                    failure: function(response, options) {
                        myMask.hide();
                        Ext.MessageBox.alert('提示', '请求超时或网络故障!');
                    }
                });
            }
        });
    },
 // 获取病人信息
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
    }
});

// 入科操作时对床位信息的修改
function intoDeptOpera(currBed, record, waitGrid) {
    //var bedObject = {};
	var BED_ID="";
	if(record.data.BED_ID!=""){
		BED_ID=record.data.BED_ID;
	}else{
		BED_ID=currBed.BED_ID;
	}
	Ext.Ajax.request({
		url: webRoot + '/nws/icu_beds/getUsed/' + BED_ID,
		method: 'PUT',
		params: {
		bedId: BED_ID
        },
        success: function(response) {
        	var respText = Ext.decode(response.responseText).data;
			if(respText.flag==false){
				Ext.MessageBox.alert('提示',respText.msg);
				return;
			}else{
				var params = {
				        REGISTER_ID: record.data.REGISTER_ID,
				        ICU_ID: currBed.ICU_ID,
				        IN_DEPT_ID:record.data.IN_DEPT_ID,
				        BED_ID: BED_ID,
				        PATIENT_ID:record.data.PATIENT_ID,
				        patientName:record.data.patientName
				    };
//				    var inDeptInfo = currBed.down('form').items.items;
//				    var nurseName = record.data.nurseName == null ? "" : record.data.nurseName;
//				    inDeptInfo[0].setValue('<div title="' + record.data.patientName + '" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + record.data.patientName + '</div>');
//				    inDeptInfo[1].setValue(record.data.gender);
//				    inDeptInfo[2].setValue(record.data.careLevel);
//				    inDeptInfo[3].setValue(record.data.conditionName);
//				    inDeptInfo[4].setValue('<div title="' + nurseName + '" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + nurseName + '</div>');
//				    var backgroundCls = record.data.conditionName == '病危' ? 'background-dying' : (record.data.conditionName == '病重' ? 'background-Ill' : 'background-mild-disease');
//				    //var bedHtml = currBed.bedTemplate.apply(bedObject);
//				    //Ext.getDom(currBed.items.items[0].el).innerHTML = bedHtml;
//				    Ext.getDom(currBed.header.items.items[2].el).innerHTML = currBed.currStatus + 'icu-doing.png" />';
//				    currBed.bedStatus = true;
//				    currBed.REGISTER_ID = record.data.REGISTER_ID;
//				    currBed.PATIENT_ID = record.data.PATIENT_ID;
//				    currBed.down('form').addBodyCls(backgroundCls);
//				    currBed.down('form').bodyCls = backgroundCls;
				    waitGrid.getStore().remove(record);
				    intoDeptData(params, waitGrid);
			}
        },
        failure: function(response, options) {
        }
    });
}

//批量入科
//入科操作时对床位信息的修改
function batchintoDeptOpera(currBed, record, waitGrid) {
	var bedrecords = [],patientrecords=[],bednorecords=[],registerrecords=[];
	var BED_ID="";
	var REGISTER_ID="";
	var PATIENT_ID="";
	var bedNo="";
	for(var i=0;i<record.length;i++){
		REGISTER_ID=REGISTER_ID+record[i].data.REGISTER_ID+",";
		PATIENT_ID=PATIENT_ID+record[i].data.PATIENT_ID+",";
		BED_ID=BED_ID+record[i].data.BED_ID+",";
		bedNo=bedNo+record[i].data.bedNo+",";
		
	}
	REGISTER_ID=REGISTER_ID.substring(0, REGISTER_ID.length-1);
	PATIENT_ID=PATIENT_ID.substring(0, PATIENT_ID.length-1);
	BED_ID=BED_ID.substring(0, BED_ID.length-1);
	bedNo=bedNo.substring(0, bedNo.length-1);
	Ext.Ajax.request({
        url: webRoot + '/nws/icu_beds/batchintoDept/' +REGISTER_ID,
        method: 'PUT',
        params: {
            icuId: currBed.ICU_ID,
            BED_ID: BED_ID,
            PATIENT_ID:PATIENT_ID,
            BED_NUMBER:bedNo,
            REGISTER_ID:REGISTER_ID
            //USED: 1,
            //IN_TIME: new Date(),
            //CARE_START_TIME:new Date(),
            //STATUS_CODE: 'tbge380078fd11e39fd9cb7044fb7954' // 已入科
        },
        success: function(response) {
        },
        failure: function(response, options) {
            Ext.MessageBox.alert('提示', '入科失败,请求超时或网络故障!');
        }
    });
	for(var i=0;i<record.length;i++){
		waitGrid.getStore().remove(record[i]);
	}
	var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
    if (bedNoCombo != undefined) {
        bedNoCombo.getStore().reload();
    }
    var label = waitGrid.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1];
    Ext.getDom(label.el).innerHTML = '患者：共 ' + waitGrid.getStore().getCount() + ' 个';
    var me=Ext.getCmp('AlreadyDeptPanel');
    var portal = me.down('portalpanel');
    me.locateTarget=null;
    me.initBedDatas();
    me.initBedInfo(portal, portal.getWidth());
    var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
    Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台';
    
    //intoDeptData(params, waitGrid);
}


// 点击入科按钮或拖拽入科后保存数据
function intoDeptData(params, waitGrid) {
	var CARE_START_TIME=new Date().Format("yyyy-MM-dd hh:mm");
    Ext.Ajax.request({
        url: webRoot + '/nws/icu_beds/' + params.REGISTER_ID,
        method: 'PUT',
        params: {
            icuId: params.ICU_ID,
            BED_ID: params.BED_ID,
            bedId: params.BED_ID,
            IN_DEPT_ID:params.IN_DEPT_ID,
            PATIENT_ID:params.PATIENT_ID,
            USED: 1,
            IN_TIME: new Date(),
            CARE_START_TIME:CARE_START_TIME,
            STATUS_CODE: 'tbge380078fd11e39fd9cb7044fb7954' // 已入科
        },
        success: function(response) {
            var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
            if (bedNoCombo != undefined) {
                bedNoCombo.getStore().reload();
            }
            var label = waitGrid.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1];
            Ext.getDom(label.el).innerHTML = '患者：共 ' + waitGrid.getStore().getCount() + ' 个';
            //waitStore.reload();
            //document.getElementById("bedinfo_NAMEnws").innerHTML = params.patientName + "<br/>已入科";
            //document.getElementById("bedinfo_NAMEnws").title = params.patientName + "已入科";;
            //.getStore().reload()
            var me=Ext.getCmp('AlreadyDeptPanel');
            var portal = me.down('portalpanel');
            me.locateTarget=null;
            me.initBedInfo(portal, portal.getWidth());
            var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
            Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.bednum + ' 台';
            Ext.Ajax.request({
        		url: webRoot + '/nws/icu_beds/patientInDep/' + params.BED_ID,
        		method: 'PUT',
        		params: {
                    REGISTER_ID: params.REGISTER_ID,
                    PATIENT_ID:params.PATIENT_ID,
                    BED_ID: params.BED_ID,
                    CARE_INTERVAL:3600,
                    patientName:params.patientName,
                    careStartTime:CARE_START_TIME
                },
                success: function(response) {
                    var me=Ext.getCmp('AlreadyDeptPanel');
                    var portal = me.down('portalpanel');
                    me.initBedInfo(portal, portal.getWidth());
                },
                failure: function(response, options) {
                }
            });
        },
        failure: function(response, options) {
            Ext.MessageBox.alert('提示', '入科失败,请求超时或网络故障!');
        }
    });
}


// 获取当前所有的床位信息
function getBeds(bedColumns) {
    var bedAll = [];
    for (var i = 0; i < bedColumns.length; i++) {
        var currColumn = bedColumns[i].items.items;
        for (var j = 0; j < currColumn.length; j++) {
            bedAll.push(currColumn[j]);
        }
    }
    return bedAll;
}