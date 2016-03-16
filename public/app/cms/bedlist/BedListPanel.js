/**
 * 功能说明: 中央监护站 床位列表 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.cms.bedlist.BedListPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['com.dfsoft.icu.cms.bedlist.CmsPagingToolbar',
               'com.dfsoft.icu.cms.bedlist.CmsBedListStore'],
    layout: 'fit',
    region: 'center',
    border: true,
    title: '床位列表',
    getTools: function() {
        var me = this,
            height = ""; //最大化组件原始高度
        var store;
        var portletItem = "",
            allColumnWidth = '';
        return [{
            xtype: 'tool',
            type: 'maximize',
            handler: function(e, target, panelHeader, tool) {

                var portlet = panelHeader.ownerCt;

                var container = me.down('portalpanel'); //获取首页portal组件对象
                //遍历首页portal组件，设置最大化组件充满整个首页，并隐藏其他组件
                container.items.each(function(pitem, index, length) {
                    allColumnWidth += pitem.columnWidth + ",";

                    if (pitem.columnWidth < 1) { //非最大化状态，实现最大化
                        tool.setType('restore');
                        pitem.columnWidth = 1;
                        pitem.items.each(function(item, index, length) {
                            if (item.id == portlet.id) {
                                portletItem = pitem;
                                height = item.height;
                                item.setHeight(container.body.dom.offsetHeight - 10);
                            } else {
                                item.hide();
                            }
                        });

                        if (pitem != portletItem) {
                            pitem.hide();
                        }
                    } else { //最大化状态，还原原始大小
                        tool.setType('maximize');
                        pitem.show();
                        var arrayWidth = allColumnWidth.split(",");
                        pitem.columnWidth = arrayWidth[index];

                        pitem.items.each(function(item, index, length) {
                            if (item.id == portlet.id) {
                                item.setHeight(height);
                            } else {
                                item.show();
                            }
                        });
                    }
                });

                if (tool.type == 'restore') { //如果是最大化
                    centralCurrMaxRecordId = portlet.recordId;
                } else { //如果取消最大化
                    centralCurrMaxRecordId = '';
                }
            }
        }, {
            xtype: 'tool',
            type: 'refresh',
            tooltip: '刷新',
            scope: me,
            handler: function(e, target, panelHeader, tool) {
                // 刷新当前panel 的 iframe
                var portlet = panelHeader.ownerCt,
                    iframe = getCmpIframe(portlet.items.items[1].el.dom);
                iframe.contentWindow.location.reload();
            }
        }];
    },
    initComponent: function() {
        var me = this,
            centralMonitoringItems = [];
        var proxy = this;
        proxy.LIMIT = 4;//每页记录数
        proxy.start = 0;
        this.CmsBedListStore = new com.dfsoft.icu.cms.bedlist.CmsBedListStore({
        	BedListPanel: proxy
        });
        this.CmsPagingToolbar = new com.dfsoft.icu.cms.bedlist.CmsPagingToolbar({
            store: proxy.CmsBedListStore
        });
        me.initBedDatas(0,proxy.LIMIT);
        proxy.CmsBedListStore.removeAll();
        me.getBedtotalCount();
        proxy.CmsBedListStore.loadPageData(me.bedtotalCount.length);
        proxy.CmsBedListStore.isFirstBeforeLoad = false;
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'label',
                html: '危重程度：<img src="/app/nws/bedmanagement/images/dying.png" /><font>病危</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/Ill.png" /><font>病重</font>&nbsp;&nbsp;<img src="/app/nws/bedmanagement/images/mild-disease.png" /><font>一般</font>',
                margin: '-1 0 0 0'
            },'->', {
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
                    me.refreshBedInfo(portal, portal.getWidth());
                    // myMask.hide();
                }
            }]
        }];
        centralMonitoringItems = me.initBedInfo();
        me.items = [{
            xtype: 'portalpanel',
            border: false,
            style: {
                borderTop: '1px solid silver',
                borderBottom: '1px solid silver',
            },
            bodyStyle: {
                background: '#f5f5f5'
            },
            items: centralMonitoringItems
        }]
        me.bbar = proxy.CmsPagingToolbar
        me.callParent();
    },

    initBedInfo: function() {
        var me = this,
            centralMonitoringItems = [],
            isNull = false;
        var patientInfo = me.cmsApp.bedPanel.patientInfo;
        if (patientInfo != null) currSelectBedNo = patientInfo.BED_ID; // 当前选中的床位ID
        else {
            currSelectBedNo = null;
            isNull = true;
        }
        for (var i = 0; i < 2; i++) {
            var item = {
                id: 'cms-col-' + i,
                //width: fixedWidth,
                columnWidth: 0.5,
                items: []
            }
            centralMonitoringItems.push(item);
        }

        // 床位数据模板
        for (var i = 0; i < me.bedDatas.length; i++) {
            var bedNo = me.bedDatas[i].BED_NUMBER,
                bedStatus = me.bedDatas[i].USED === 1; //当前床位状态  false 可用
            var currItem = null,
                checkedBed = false;
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
                // 当前没有病人信息，则默认选中第一个
                if(isNull) {
//                    checkedBed = true;
//                    isNull = false;
//                    var curr = me.getPatientInfo(REGISTER_ID);
//                    curr.BED_NUMBER = bedNo;
//                    me.cmsApp.bedPanel.patientInfo = curr;
                }
                if (me.bedDatas[i].ID == currSelectBedNo) {
                    checkedBed = true;
                }
                var checkid="radio"+me.bedDatas[i].ID;
                currItem = {
                    tools: me.getTools(),
                    header: {
                        padding: '3 5',
                        cls: 'header-radius',
                        items: [{
                        	id:checkid,
                            xtype: 'radio',
                            name: 'cms-bedList',
                            checked: checkedBed
                        }, {
                            xtype: 'tbspacer',
                            width: '44%'
                        }, {
                            xtype: 'label',
                            html: '<font color="white">' + bedNo + '</font>'
                        }]
                    },
                    bodyCls: backgroundCls,
                    border: 1,
                    height: 331,
                    closable: false,
                    collapsible: true,
                    //overflowY: 'auto', 
                    REGISTER_ID: REGISTER_ID,
                    bedNo: bedNo,
                    layout: 'border',
                    items: [{
                        xtype: 'fieldcontainer',
                        region: 'north',
                        height: 26,
                        layout: 'hbox',
                        defaults: {
                            labelWidth: 59,
                            labelAlign: 'right'
                        },
                        items: [{
                            xtype: 'displayfield',
                            fieldLabel: '患者姓名',
                            value: bedObject.patientName,
                            width: 114
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: '患者性别',
                            width: 87,
                            value: bedObject.gender
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: '监护级别',
                            width: 122,
                            value: bedObject.careLevel
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: '责任护士',
                            value: bedObject.nurseName
                        }]
                    }
                    , {
                        xtype: 'panel',
                        region: 'center',
                        border: false,
                        margin: '0 5 5 5',
                        html: '<iframe src="/app/cms/cmsgraphlive/CmsCareCenter.html?REGISTER_ID=' + REGISTER_ID + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
                    }
                    ],
                    listeners: {
                        afterrender: function(_this, eOpts) {
                            _this.header.on('click', function() {
                                var checked = _this.header.items.items[0].getValue();
                                // 选中之后获取病人详细信息
                                if (checked) {
                                    _this.header.items.items[0].setValue(true);
                                    var selectPatientInfo = me.getPatientInfo(_this.REGISTER_ID);
                                    selectPatientInfo.BED_NUMBER = _this.bedNo;
                                    me.selectBed(selectPatientInfo);
                                } else {
                                    //_this.header.items.items[0].setValue(false);
                                    me.selectBed(null);
                                }
                            });
                        }
                    }
                };
            }
            if (i % 2 == 0) {
                var portlet1 = centralMonitoringItems[0];
                portlet1.items.push(currItem);
            } else {
                var portlet2 = centralMonitoringItems[1];
                portlet2.items.push(currItem);
            }
        }
        return centralMonitoringItems;
    },

    //初始化已入科患者portalpanel
    refreshBedInfo: function(_this, width) {
        var me = this;
        var proxy = this;
        // 先删除当前的所有portal
        _this.removeAll(true);
        me.initBedDatas(proxy.start,proxy.LIMIT);
        proxy.CmsBedListStore.removeAll();
        me.getBedtotalCount();
        proxy.CmsBedListStore.loadPageData(me.bedtotalCount.length);
        proxy.CmsBedListStore.isFirstBeforeLoad = true;
        proxy.CmsPagingToolbar.moveFirst();//初始显示最后一页
        //当前所有床位信息
        var centralMonitoringItems = me.initBedInfo();
        _this.add(centralMonitoringItems);
        _this.doLayout();
    },
  //初始化已入科患者portalpanel
    refresh: function(_this, width) {
        var me = this;
        var proxy = this;
        // 先删除当前的所有portal
        _this.removeAll(true);
        //当前所有床位信息
        var centralMonitoringItems = me.initBedInfo();
        _this.add(centralMonitoringItems);
        _this.doLayout();
    },

    // 加载当前床位信息
    initBedDatas: function(start, limit) {
        var me = this;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_beds/listBedList/' + userInfo.deptId,
            method: 'PUT',
            async: false,
            scope: me,
            params : {
                start : start,
                limit : limit
            },
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
               // console.log(respText);
                me.bedDatas = [];
                for (var i = 0; i < respText.length; i++) {
                	if (respText[i].usedInfo != undefined) {
                        me.bedDatas.push(respText[i]);
                    }
//                	if (respText[i].USED == 1) {
//                        me.bedDatas.push(respText[i]);
//                    }
                }
            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取床位信息失败,请求超时或网络故障!');
            }
        });
    },
    
 // 加载当前床位信息
    getBedtotalCount: function() {
        var me = this;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu_beds/list/' + userInfo.deptId,
            method: 'GET',
            async: false,
            scope: me,
            success: function(response) {
                var respText = Ext.decode(response.responseText).data;
                me.bedtotalCount = [];
                for (var i = 0; i < respText.length; i++) {
                	if (respText[i].USED == 1 && respText[i].usedInfo != undefined) {
                        me.bedtotalCount.push(respText[i]);
                    }
//                	if (respText[i].USED == 1) {
//                        me.bedtotalCount.push(respText[i]);
//                    }
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
        me.refresh(portal, portal.getWidth());
    },
  //更改当前病人信息后重新选中与该病人对应的床位
    refreshPatientInfo: function(patientInfo) {
        var me = this,
            portal = me.down('portalpanel');
        for (var i = 0; i < me.bedDatas.length; i++) {
        	var bed_id="radio"+me.bedDatas[i].ID;
        	Ext.getCmp(bed_id).setValue(false);
        }
        var checkid="radio"+patientInfo.BED_ID;
        if(Ext.getCmp(checkid)!=undefined){
        	Ext.getCmp(checkid).setValue(true);
        }
    }
});