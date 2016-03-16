/**
 * 功能说明:  选择床位 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.SelectBedPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
               'com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientStore'
           ],
    layout: 'fit',
    region: 'center',
    border: true,
    initComponent: function() {
        var me = this;
        me.items = [{
            xtype: 'portalpanel',
            // bodyStyle: {
            //     background: '#f5f5f5'
            // },
            //items: centralMonitoringItems,
            listeners: {
                resize: function(_this, width, height, oldWidth, oldHeight, eOpts) {
                    // 先删除当前的所有portal
                    _this.removeAll(true);
                    var fixedRow = 0,
                        fixedWidth = 120,
                        centralMonitoringItems = [];
                    fixedRow = Math.floor((width - 5) / fixedWidth);
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
                            bedStatus = me.bedDatas[i].USED === 1; //当前床位状态  false 可用
//                        if(bedNo.length>5){
//                        	bedNo=bedNo.substring(0,5)+"...";
//                        }
                        //bedHtml = '';
                        var REGISTER_ID = '',SID='',font='',
                            currItem = null,OutDeptcurrItem;

                        //var bedTemplate = new Ext.Template('<div><table><tr><td width="38px">姓名:</td><td>{patientName}</td></tr><tr><td>性别:</td><td>{gender}</td></tr></table></div>');
                        if (bedStatus) {
                            // bedHtml = bedTemplate.apply({
                            //     patientName: me.bedDatas[i].usedInfo.patientName,
                            //     gender: me.bedDatas[i].usedInfo.gender
                            // });
                            REGISTER_ID = me.bedDatas[i].usedInfo.REGISTER_ID;
                            SID=me.bedDatas[i].usedInfo.SID;
                            if(SID!=""&&SID!=null){
                            	font='<div title="该患者已从his中同步" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"><font color="blue">*</font>' + me.bedDatas[i].usedInfo.patientName + '</div>';
                            }else{
                            	font='<div title="' + me.bedDatas[i].usedInfo.patientName + '" style="cursor: default;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + me.bedDatas[i].usedInfo.patientName + '</div>';
                            }
                            currItem = {
                                header: {
                                    padding: '0 5 0 5',
                                    items: [{
                                        xtype: 'label',
                                        html: '<font color="white">' + bedNo + '</font>',
                                        margin: '0 30'
                                    }]
                                },
                                border: 1,
                                height: 62,
                                closable: false,
                                collapsible: false,
                                //autoScroll: true,
                                //overflowY: 'auto',
                                bedNo: bedNo,
                                REGISTER_ID: REGISTER_ID,
                                // items: [{
                                //     xtype: 'label',
                                //     cls: 'cursor',
                                //     html: bedHtml
                                // }],
                                items: [{
                                    xtype: 'form',
                                    cls: 'cursor',
                                    defaults: {
                                        width: 90,
                                        labelWidth: 34,
                                        labelAlign: 'right'
                                    },
                                    items: [{
                                        xtype: 'displayfield',
                                        fieldLabel: '姓名',
                                        value: font,
                                        margin: '-2 0 0 0'
                                    }, {
                                        xtype: 'displayfield',
                                        fieldLabel: '性别',
                                        margin: '-5 0 0 0',
                                        value: me.bedDatas[i].usedInfo.gender
                                    }],
                                }],
                                listeners: {
                                    afterrender: function(_this, eOpts) {
                                        // 点击title和body都触发选中病人事件
                                        _this.body.on('click', function() {
                                            var patientInfo = me.getPatientInfo(_this.REGISTER_ID);
                                            patientInfo.BED_NUMBER = _this.bedNo;
                                            me.parent.selectPatientInfo(patientInfo);
                                            me.parent.close();
                                        });
                                        _this.header.on('click', function() {
                                            var patientInfo = me.getPatientInfo(_this.REGISTER_ID);
                                            patientInfo.BED_NUMBER = _this.bedNo;
                                            me.parent.selectPatientInfo(patientInfo);
                                            me.parent.close();
                                        });
                                    }
                                }
                            };
                        }
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
                    var  OutDeptcurrItem = {
                            header: {
                                padding: '0 5 0 5',
                                items: [{
                                    xtype: 'label',
                                    html: '<font color="yellow">选择出科患者</font>',
                                    margin: '0 10'
                                }]
                            },
                            border: 1,
                            height: 62,
                            closable: false,
                            collapsible: false,
                            items: [{
                                xtype: 'form',
                                cls: 'cursor',
                                defaults: {
                                    width: 90,
                                    labelWidth: 50,
                                    labelAlign: 'right'
                                },
                            }],
                            listeners: {
                                afterrender: function(_this, eOpts) {
                                    // 点击title和body都触发选中病人事件
                                    _this.body.on('click', function() {
                                    	me.openOutPatientWindow(me);
                                        me.parent.close();
                                    });
                                    _this.header.on('click', function() {
                                        me.parent.close();
                                    });
                                }
                            }
                        };
                    if(userInfo.roleId=='1b0a03d0b94811e3917800271396a820'||userInfo.roleId=='3dba83a1089d11e396021b9f5cdf5941'){
                    	if (i % fixedRow == 0) {
                        	centralMonitoringItems[0].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 1) {
                        	centralMonitoringItems[1].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 2) {
                        	centralMonitoringItems[2].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 3) {
                        	centralMonitoringItems[3].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 4) {
                        	centralMonitoringItems[4].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 5) {
                        	centralMonitoringItems[5].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 6) {
                        	centralMonitoringItems[6].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 7) {
                        	centralMonitoringItems[7].items.push(OutDeptcurrItem);
                        } else if (i % fixedRow == 8) {
                        	centralMonitoringItems[8].items.push(OutDeptcurrItem);
                        } else {
                        	centralMonitoringItems[9].items.push(OutDeptcurrItem);
                        }
                    }
                    _this.add(centralMonitoringItems);
                    _this.doLayout();
                }
            }
        }]
        me.callParent();
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
    
    //打开医嘱药加水详细页
    openOutPatientWindow:function (me){
    	var store = new com.dfsoft.icu.nws.bedmanagement.beditemtree.OutPatientStore();
    	store.proxy.url=webRoot+'/nws/icu_patient/queryOutPatientList/null/null/'+userInfo.deptId;
    	store.load();
       var panel=Ext.create('Ext.grid.Panel', {
           width: 700, // 指定表单宽度
           height:330,
           region:"center",
           renderTo: Ext.getBody(),
           // 定义该表格包含的所有数据列
           columns: [
                 { text: '姓名', dataIndex: 'NAME' , width:100 }, // 第1个数据列
                 { text: '性别', dataIndex: 'GENDER', width:80},
                 { text: '年龄', dataIndex: 'AGE',width:80 },
                 { text: '住院号', dataIndex: 'HOSPITAL_NUMBER',width:120 },
                 { text: '入科时间', dataIndex: 'IN_TIME',width:150 },
                 { text: '出科时间', dataIndex: 'OUT_TIME',width:150 }
           ],
           dockedItems: [{
               xtype: 'toolbar',
               dock: 'top',
               items: [{
                   xtype: 'textfield',
                   name:'NAME',
                   fieldLabel: '姓名',
                   labelWidth: 60,
                   width: 200
               },{
                   xtype: 'textfield',
                   name:'HOSPITAL_NUMBER',
                   fieldLabel: '住院号',
                   labelWidth: 60,
                   width: 200
               },'->',
               {
                   xtype: 'button',
                   tooltip: '查询',
                   iconCls: 'search',
                   handler: function(){
          			var me=this;
          			var NAME=panel.dockedItems.items[1].items.items[0].value;
          			var HOSPITAL_NUMBER=panel.dockedItems.items[1].items.items[1].value;
          			NAME=stripscript(NAME);
          			HOSPITAL_NUMBER=stripscript(HOSPITAL_NUMBER);
          			if(NAME.indexOf("/")==0)NAME="a";
          			if(NAME.indexOf("\\")==0)NAME="a";
          			if(HOSPITAL_NUMBER.indexOf("/")==0)HOSPITAL_NUMBER="a";
          			if(HOSPITAL_NUMBER.indexOf("\\")==0)HOSPITAL_NUMBER="a";
          			if(NAME==undefined||NAME=='')NAME=null;
          			if(HOSPITAL_NUMBER==undefined||HOSPITAL_NUMBER=='')HOSPITAL_NUMBER=null;
          			store.proxy.url=webRoot+'/nws/icu_patient/queryOutPatientList/'+NAME+'/'+HOSPITAL_NUMBER+'/'+userInfo.deptId;
          	    	store.reload();
                   }
               },'-',{
                   xtype: 'button',
                   tooltip: '移至待入科患者列表',
                   iconCls: 'left',
                   scope: me,
                   handler:function(){
            	      var currRecord = panel.getSelectionModel().getSelection();
            	      if(currRecord.length < 1) {
            	            Ext.MessageBox.alert('提示', '请选择患者!');
            	            return;
            	      }
            	      Ext.Msg.confirm('移至待入科', '确定将该患者移至待入科?', function(btn) {
            	            if (btn == 'yes') {
            	            	Ext.Ajax.request({
                      	          url: webRoot + '/nws/icu_patient/returnWaitPatient/' + currRecord[0].data.REGISTER_ID,
                      	          method: 'PUT',
                      	          params:{
                      	    	  		REGISTER_ID:currRecord[0].data.REGISTER_ID
          							},
                      	          success: function(response) {
          								dlg.close();
                      	          },
                      	          failure: function(response, options) {
                      	              Ext.MessageBox.alert('提示', '入科失败,请求超时或网络故障!');
                      	          }
                      	      });
            	            }
            	        });
                   }
               }]
           }],
           store: store,
           bbar: Ext.create('Ext.PagingToolbar', {
               store: store,
               displayInfo: true,
               displayMsg: '共{2}条',
               emptyMsg: '无记录'
           })
      });
      var dlg = new Ext.Window({
   		title: '出科患者列表',
   		resizable: false,
   		width: 710,	
   		height:410,
   		modal: true,
   		//autoDestroy: true,
   		bodyStyle:'overflow-y:auto;',
   		//closeAction: 'hide',
   		layout:"border",
   		items: [panel]
   	  });
       dlg.show();
       panel.addListener('itemdblclick', conItemDblclick);
//       panel.addListener('itemclick', conItemclick);
       function conItemDblclick(grid, record, item, index, e, eOpts){
    	     var patientInfo = me.getPatientInfo(record.data.REGISTER_ID);
             me.parent.selectPatientInfo(patientInfo);
  			 dlg.close();
       };
       function stripscript(s) {
           var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
           var rs = "";
           if(s!=null){
        	   for (var i = 0; i < s.length; i++) {
                   rs = rs + s.substr(i, 1).replace(pattern,"a");
               }
           }
           return rs;
       }
//       function conItemclick(grid, record, item, index, e, eOpts){
//  	     var patientInfo = me.getPatientInfo(record.data.REGISTER_ID);
//           me.parent.selectPatientInfo(patientInfo);
//			 dlg.close();
//     };
    }
});