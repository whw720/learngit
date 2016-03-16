/**
 * 功能说明: 医生工作站 床位列表 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.dws.BedListPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    region: 'center',
    border: true,
    initComponent: function() {
        var me = this;
        me.initBedDatas();
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: ['->', {
                xtype: 'button',
                tooltip: '刷新',
                iconCls: 'data-refresh',
                scope: me,
                handler: function() {
                    var portal = me.down('portalpanel');
                    // var myMask = new Ext.LoadMask(me, {
                    //     msg: '获取数据中...'
                    // });
                    // myMask.show();
                    me.initBedInfo(portal, portal.getWidth());
                  //删除床位更新下方床位总数
                    var label = me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                    Ext.getDom(label.el).innerHTML = '床位：共 ' + me.bedDatas.length + ' 台';
                    // myMask.hide();
                }
            }]
        }],
        me.items = [{
            xtype: 'portalpanel',
            border: false,
            style: {
                borderTop: '1px solid silver',
                borderBottom: '1px solid silver'
            },
            bodyStyle: {
                background: '#f5f5f5'
            },
            listeners: {
                resize: function(_this, width, height, oldWidth, oldHeight, eOpts) {
                    me.initBedInfo(_this, width);
                }
            }
        }]
        me.bbar = [{
            xtype: 'label',
            html: '危重程度：<img src="/app/nws/bedmanagement/images/dying.png" /><font>病危</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/Ill.png" /><font>病重</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/mild-disease.png" /><font>一般</font>',
            margin: '-1 0 0 0'
        }, '->', {
            xtype: 'label',
            html: '床位：共 ' + me.bedDatas.length + ' 台'
        }]
        me.callParent();
    },

    //初始化已入科患者portalpanel
    initBedInfo: function(_this, width) {
        var me = this;
        // 先删除当前的所有portal
        if(width!=0){
        	_this.removeAll(true);
        }
        var fixedRow = 0,
            fixedWidth = 180,
            centralMonitoringItems = [],
            isNull = false;
        fixedRow = Math.floor((width - 5) / fixedWidth);
        var patientInfo = me.dwsApp.bedPanel.patientInfo;
        if (patientInfo != null) currSelectBedNo = patientInfo.BED_ID; // 当前选中的床位ID
        else {
            currSelectBedNo = null;
            isNull = true;
        }
        for (var i = 0; i < fixedRow; i++) {
            var item = {
                width: fixedWidth,
                items: []
            }
            centralMonitoringItems.push(item);
        }

        //当前所有床位信息
        me.initBedDatas();
        // 床位数据模板
        for (var i = 0; i < me.bedDatas.length; i++) {
            var bedNo = me.bedDatas[i].BED_NUMBER,
                bedStatus = me.bedDatas[i].USED === 1, //当前床位状态  false 可用
                currStatus = '<img src="/app/nws/bedmanagement/images/icu-doing.png" />'; // 床位是否被选中
            var currItem = null,
                checkedBed = false;
            bedTemplate = new Ext.Template('<div><table><tr><td width="64px">患者姓名:</td><td>{patientName}</td></tr><tr><td>患者性别:</td><td>{gender}</td></tr><tr><td>监护级别:</td><td>{careLevel}</td></tr><tr><td>危重程度:</td><td>{conditionName}</td></tr><tr><td>责任护士:</td><td>{nurseName}</td></tr></table></div>');
            if (bedStatus) {
                if (me.bedDatas[i].usedInfo) {
                    var bedObject = {
                        patientName: me.bedDatas[i].usedInfo.patientName,
                        gender: me.bedDatas[i].usedInfo.gender,
                        careLevel: me.bedDatas[i].usedInfo.careLevel,
                        conditionName: me.bedDatas[i].usedInfo.conditionName,
                        nurseName: me.bedDatas[i].usedInfo.nurseName
                    };
                    var REGISTER_ID = me.bedDatas[i].usedInfo.REGISTER_ID,
                        PATIENT_ID = me.bedDatas[i].usedInfo.PATIENT_ID,
                        backgroundCls = bedObject.conditionName == '病危' ? 'background-dying' : (bedObject.conditionName == '病重' ? 'background-Ill' : 'background-mild-disease');
                }
                var bedHtml = bedTemplate.apply(bedObject);
                // 当前没有病人信息，则默认选中第一个
                if (isNull) {
//                    checkedBed = true;
//                    isNull = false;
//                    var curr = me.getPatientInfo(REGISTER_ID);
//                    curr.BED_NUMBER = bedNo;
//                    me.dwsApp.bedPanel.displayPatient(curr);
                }
                if (me.bedDatas[i].ID == currSelectBedNo) {
                    checkedBed = true;
                }
                currItem = {
                    header: {
                        padding: '0 5 0 5',
                        items: [{
                            xtype: 'radio',
                            name: 'dws-bedList',
                            checked: checkedBed
                        }, {
                            xtype: 'label',
                            html: '<font color="white">' + bedNo + '</font>',
                            margin: '0 35'
                        }, {
                            xtype: 'label',
                            html: currStatus
                        }]
                    },
                    bodyCls: backgroundCls,
                    border: 1,
                    height: 132,
                    closable: false,
                    collapsible: false,
                    overflowY: 'auto',
                    ICU_ID: me.bedDatas[i].ICU_ID,
                    BED_ID: me.bedDatas[i].ID,
                    REGISTER_ID: REGISTER_ID,
                    PATIENT_ID: PATIENT_ID,
                    bedNo: bedNo,
                    items: [{
                        xtype: 'label',
                        html: bedHtml
                    }],
                    listeners: {
                        afterrender: function(_this, eOpts) {
                            _this.header.on('click', function() {
                                var checked = _this.header.items.items[0].getValue();
                                if (checked) {
                                    _this.header.items.items[0].setValue(true);
                                    var patientInfo = me.getPatientInfo(_this.REGISTER_ID);
                                    patientInfo.BED_NUMBER = _this.bedNo;
                                    me.dwsApp.setPatientInfo(patientInfo);
                                } else {
                                    //_this.header.items.items[0].setValue(false);
                                    me.dwsApp.setPatientInfo(null);
                                }
                            });
                        }
                    }
                };
            }
            if(centralMonitoringItems.length>0){
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
            
        }
        _this.add(centralMonitoringItems);
        _this.doLayout();
    },

    // 加载当前床位信息
    initBedDatas: function() {
        var me = this;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_beds/list/' + userInfo.deptId,
            method: 'GET',
            async: false,
            scope: me,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                me.bedDatas = [];
                for (var i = 0; i < respText.length; i++) {
                	if (respText[i].USED == 1 && respText[i].usedInfo != undefined) {
                		if(respText[i].usedInfo.nurseName==null)respText[i].usedInfo.nurseName="";
                        me.bedDatas.push(respText[i]);
                    }
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取床位信息失败,请求超时或网络故障!');
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
    },

    //更改当前病人信息后重新选中与该病人对应的床位
    setPatientInfo: function(patientInfo) {
        var me = this,
            portal = me.down('portalpanel');
        if (patientInfo != null){
            //加载警示信息
            var warning=new Ext.ux.IFrame({
                padding:'0',
                autoScroll:false,
                margin:'0',
                border: false,
                src:'/app/dws/dws_warning.html?PATIENT_ID='+ patientInfo.REGISTER_ID
            });
            var dwsToolbarItems = me.dwsApp.dwsToolbar.dockedItems.items[0].items.items;
            var warningItem = "";
            for(var i = 0;i<dwsToolbarItems.length;i++){
                var tagObj = dwsToolbarItems[i];
                if(tagObj.title == "警示"){
                   tagObj.remove(tagObj.items.items[0]);
                    tagObj.add(warning);
                    warningItem = tagObj;
                }

            }
            me.initBedInfo(portal, portal.getWidth());
        }
    }
});