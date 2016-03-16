/**
 * 功能说明: 出科情况 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.OutDeptWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.OutDeptForm'
    ],
    initComponent: function() {
        var me = this;
        me.outDeptForm = new com.dfsoft.icu.nws.bedmanagement.OutDeptForm();
        var patientInfo=me.getPatientInfo(me.REGISTER_ID);
        var DIE_DATE=new Date();
        if(patientInfo.DIE_DATE!=null){
        	var form = me.outDeptForm;
        	DIE_DATE=new Date(patientInfo.DIE_DATE);
        }
        var checked1=false;
        var checked2=false;
        var checked3=false;
        var checked4=false;
        var checked5=false;
        if(patientInfo.OUT_CODE!=null){
        	if(patientInfo.OUT_CODE=='c3cf2625ff0811e2b69eef705ed7331d'){
        		checked1=true;
            }else if(patientInfo.OUT_CODE=='d2be1525ff0811e2b69eef705ed7220c'){
            	checked2=true;
            }else if(patientInfo.OUT_CODE=='e4be1525ff0811e2b69eef705ed7442d'){
            	checked3=true;
            }else if(patientInfo.OUT_CODE=='e4be1525ff0811e2b69eef705ed7442c'){
            	checked4=true;
            }else if(patientInfo.OUT_CODE=='f5dg1525ff0811e2b69eef705ed7553e'){
            	checked5=true;
            }
		}
        Ext.apply(me, {
            title: '出科情况',
            closable: false,
            tools: [{
                type: 'save',
                tooltip: '确认出科',
                scope: me,
                handler: me.confirmOutDept
            }, {
                type: 'close',
                tooltip: '取消',
                handler: function() {
                    me.close();
                }
            }],
            iconCls: 'out-dept',
            layout: 'fit',
            resizable: false,
            //modal: true,
            width: 300,
            height: 210,
            items: [{
                padding: '0 5 0 5',
                //layout: 'fit',
                items: [{
                    xtype:'fieldset',
                    title: '归转',
                    margin: '0 0 5 0',
                    height:160,
                    allowBlank: false,
                    blankText: '必须选择一项',
                    items: [{
                        xtype: 'radiogroup',
                        columns: 1,
                        vertical: true,
                        items : [{
                        	id : 'radiocheck1',
                        	boxLabel : "病房",
                        	checked:checked1,
                        	value:'c3cf2625ff0811e2b69eef705ed7331d',
                        	name : 'whereabouts',
                        	listeners : {
                           	 change:function(_this, newValue, oldValue, eOpts ){
                        		if(newValue==true){
	                            	 document.getElementById('dietime').style.display='none';
	                             }
                                },
                                afterrender:function(a,b){
                                	if(patientInfo.OUT_CODE=='c3cf2625ff0811e2b69eef705ed7331d'){
                                		Ext.getCmp('radiocheck1').checked=true;
                                    }
                                }
                                              //监听事件
                           	}
                        },
                        {
                        	id : 'radiocheck2',
                        	boxLabel : "门/急诊观察室",
                        	checked:checked2,
                        	value:'d2be1525ff0811e2b69eef705ed7220c',
                        	name : 'whereabouts',
                        	listeners : {
                           	 change:function(_this, newValue, oldValue, eOpts ){
                        		if(newValue==true){
	                            	 document.getElementById('dietime').style.display='none';
	                             }
                                }
                                              //监听事件
                           	}
                        },
                        {
                        	id : 'radiocheck3',
                        	value:'e4be1525ff0811e2b69eef705ed7442d',
                        	boxLabel : "出院",
                        	checked:checked3,
                        	name : 'whereabouts',
                        	listeners : {
                           	 change:function(_this, newValue, oldValue, eOpts ){
                        		if(newValue==true){
	                            	 document.getElementById('dietime').style.display='none';
	                             }
                                }
                                              //监听事件
                           	}
                        },
                        {
                        	id : 'radiocheck4',
                        	value:'e4be1525ff0811e2b69eef705ed7442c',
                        	boxLabel : "转院",
                        	checked:checked4,
                        	name : 'whereabouts',
                        	listeners : {
                           	 change:function(_this, newValue, oldValue, eOpts ){
       	                             if(newValue==true){
       	                            	 document.getElementById('dietime').style.display='none';
       	                             }
                                }
                                              //监听事件
                           	}
                        },
                        {
                        	id : 'radiocheck5',
                        	value:'f5dg1525ff0811e2b69eef705ed7553e',
                        	checked:checked5,
                        	boxLabel : "<table style='margin-left:-3px;margin-top:-3px;'><tr><td>死亡</td><td id='dietime' style='display:none;'></td></tr></table>",
                        	name : 'whereabouts',
                        	listeners:{
                        	change:function(_this, newValue, oldValue, eOpts ){
                        		 if(newValue==true){
	                            	 document.getElementById('dietime').style.display='block';
	                             }
                        	},
                        		afterrender:function(a,b){
		                        	Ext.widget({
		                        		id:'DIE_DATE',
		                        		margin:'-5,0,0,0',
		                        		fieldLabel:'&nbsp;',
		                        		labelWidth:10,
		                        		labelAlign: 'center',
		                            	xtype:'datetimefield',
		                                name: 'DIE_DATE',
		                                value:DIE_DATE,
		                                format: 'Y-m-d H:i',
		                                width: 160,
		                                renderTo:'dietime'
		                            });
                        		}
                        	}
                        	//html:''
                        }]
                                      
                    }]
                }]
            }]
        });
        me.callParent();
    },

    // 出科操作
    confirmOutDept: function() {
        var me = this,
            form = me.outDeptForm,
            select = form.down('radiogroup').getChecked();
        if(Ext.getCmp('radiocheck1').getValue()==true){
        	OUT_CODE="c3cf2625ff0811e2b69eef705ed7331d";
        }else if(Ext.getCmp('radiocheck2').getValue()==true){
        	OUT_CODE="d2be1525ff0811e2b69eef705ed7220c";
        }else if(Ext.getCmp('radiocheck3').getValue()==true){
        	OUT_CODE="e4be1525ff0811e2b69eef705ed7442d";
        }else if(Ext.getCmp('radiocheck4').getValue()==true){
        	OUT_CODE="e4be1525ff0811e2b69eef705ed7442c";
        }else if(Ext.getCmp('radiocheck5').getValue()==true){
        	OUT_CODE="f5dg1525ff0811e2b69eef705ed7553e";
        	if(Ext.getCmp('DIE_DATE')){
        		if(Ext.getCmp('DIE_DATE').getValue()==''||Ext.getCmp('DIE_DATE').getValue()==null){
        			Ext.MessageBox.alert('提示', '死亡时间不能为空!');
        			return;
        		}
        	}
        }else{
        	Ext.MessageBox.alert('提示', '请选择出科情况!');
        	return;
        }
        
            if (form.getForm().isValid()) {
            	var DIE_DATE;
            	if(Ext.getCmp('DIE_DATE')){
            		if(Ext.getCmp('DIE_DATE').getValue()!=''){
            			//只有死亡才赋值
            			if(Ext.getCmp('radiocheck5').getValue()==true){
            				DIE_DATE=new Date(Ext.getCmp('DIE_DATE').getValue()).Format("yyyy-MM-dd hh:mm:ss");
            			}else{
            				var patientInfo=me.getPatientInfo(me.REGISTER_ID);
            				if(patientInfo.DIE_DATE!=null){
            					DIE_DATE=new Date(patientInfo.DIE_DATE);
            				}else{
            					DIE_DATE=null;
            				}
            				
            			}
            		}
            	}
            	//出科调用link2接口
            	Ext.Ajax.request({
            		url: webRoot + '/nws/icu_beds/patientOutDep/' + me.BED_ID,
            		method: 'PUT',
            		params: {
                        REGISTER_ID: me.REGISTER_ID,
                        patientName:me.patientName
                    },
                    success: function(response) {},
                    failure: function(response, options) {
                    }
                });
                Ext.Ajax.request({
                    url: webRoot + '/nws/icu_beds/OutDept/' + me.BED_ID,
                    method: 'PUT',
                    async: false,
                    params:{
                        REGISTER_ID: me.REGISTER_ID,
                        PATIENT_ID:me.PATIENT_ID,
                        OUT_TIME: new Date(),
                        OUT_CODE: OUT_CODE,
                        BED_ID:me.BED_ID,
                        DIE_DATE:DIE_DATE,
                        STATUS_CODE: 'wty4980078fd11e39fd9cb7044fb795e' // 已出科
                    },
                    success: function(response) {
                        var portal = me.parent.down('portalpanel');
                        me.parent.locateTarget=null;
                        me.parent.initBedInfo(portal, portal.getWidth());
                        var label = me.parent.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                        Ext.getDom(label.el).innerHTML = '床位：共 ' + me.parent.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.parent.bednum + ' 台';
                        var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
	                    if (bedNoCombo != undefined) {
	                        bedNoCombo.getStore().reload();
	                    }
                        me.close();
                        me.parent.parent.outCallback(me.REGISTER_ID);
                    },
                    failure: function(response, options) {
                        Ext.MessageBox.alert('提示', '出科失败,请求超时或网络故障!');
                    }
                });
            }
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