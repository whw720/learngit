/**
 * 功能说明: 添加床位 window
 * @author: jikui
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AddBedWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.AddBedForm'
    ],
    initComponent: function() {
        var me = this;
        me.AddBedForm = new com.dfsoft.icu.nws.bedmanagement.AddBedForm();
        var form = me.AddBedForm.getForm();
        var title;
        if(me.status=='add'){
        	title='添加床位';
        	if(isNaN(me.BED_NUMBER))me.BED_NUMBER="";
        }
        if(me.status=='update'){
        	title='修改床位';
        }
        form.findField('BedNumber').setValue(me.BED_NUMBER);
        Ext.apply(me, {
            title: title,
            closable: false,
            iconCls: 'out-dept',
            layout: 'fit',
            resizable: false,
            width: 230,
            height: 115,
            items: [me.AddBedForm],
            buttons: [{
                text: '保存',
                iconCls: 'save',
                scope: me,
                handler: me.save
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

    //保存
    save: function() {
    	var me = this;
        var form = me.AddBedForm.getForm();
        var BedNumber=form.findField('BedNumber').getValue();
        var ICU_ID=me.ICU_ID;
        if (form.isValid()) {
        	if(me.status=='add'){
              var myMask = new Ext.LoadMask(me, {
              msg: '保存中'
          });
          myMask.show();
          Ext.Ajax.request({
      		 url: webRoot + '/nws/icu_beds/getBedNo',
              method: 'POST',
              params: {
                  ICU_ID: me.ICU_ID,
                  BED_NUMBER: BedNumber
              },
              success: function(response) {
                  var respText = Ext.decode(response.responseText).data;
                  if(respText.length>0){
                	  Ext.MessageBox.alert('提示', '该床号已存在!');
                	  myMask.hide();
                	  return;
                  }
                	  Ext.Ajax.request({
                          url: webRoot + '/nws/icu_beds',
                          method: 'POST',
                          params: {
                              ICU_ID: me.ICU_ID,
                              BED_NUMBER: BedNumber
                          },
                          success: function(response) {
                              var respText = Ext.decode(response.responseText).data;
                              var portal = me.parent.down('portalpanel');
                              me.parent.locateTarget=null;
                              me.parent.initBedInfo(portal, portal.getWidth());
                              // 床位添加成功后更新下方床位总数
                              var label = me.parent.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                              Ext.getDom(label.el).innerHTML = '床位：共 ' + me.parent.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.parent.bednum + ' 台';
                              var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                              if (bedNoCombo != undefined) {
                            	  bedNoCombo.getStore().reload();
//                            	  Ext.Ajax.request({
//                              		url: webRoot + '/nws/icu_beds/getNoUsedId/' + BedNumber,
//                                      method: 'PUT',
//                                      async: false,
//                                      success: function(response) {
//                                          var respText = Ext.decode(response.responseText).data;
//                                          var data2=[[respText[0].ID,BedNumber]];
//                                          bedNoCombo.getStore().add(data2);
//                                      },
//                                      failure: function(response, options) {
//                                          Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
//                                      }
//                                  });
                              }
                              myMask.hide();
                              me.close();
                          },
                          failure: function(response, options) {
                              myMask.hide();
                              Ext.MessageBox.alert('提示', '添加床位失败,请求超时或网络故障!');
                          }
                      });
              },
              failure: function(response, options) {
                  Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
              }
          });
        	}
        	if(me.status=='update'){
        		var myMask = new Ext.LoadMask(me, {
                    msg: '保存中'
                });
                myMask.show();
                Ext.Ajax.request({
            		 url: webRoot + '/nws/icu_beds/getBedNo',
                    method: 'POST',
                    params: {
                        ICU_ID: me.ICU_ID,
                        BED_NUMBER: BedNumber
                    },
                    success: function(response) {
                        var respText = Ext.decode(response.responseText).data;
                        if(respText.length>0){
                          if(me.BED_ID!=respText[0].ID){
                        	  Ext.MessageBox.alert('提示', '该床号已存在!');
                          	  myMask.hide();
                          	  return;
                          }
                        }
                      	  Ext.Ajax.request({
                                url: webRoot + '/nws/icu_beds/updateBedNo',
                                method: 'POST',
                                params: {
                                    ID: me.BED_ID,
                                    BED_NUMBER: BedNumber
                                },
                                success: function(response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    var portal = me.parent.down('portalpanel');
                                    me.parent.locateTarget=null;
                                    me.parent.initBedInfo(portal, portal.getWidth());
                                    // 床位添加成功后更新下方床位总数
                                    var label = me.parent.getDockedItems('toolbar[dock="bottom"]')[0].items.items[2];
                                    Ext.getDom(label.el).innerHTML = '床位：共 ' + me.parent.bedDatas.length + '台'+'&nbsp;&nbsp;已使用： ' + me.parent.bednum + ' 台';
                                    var bedNoCombo = Ext.getCmp('wait_dept_bedNo');
                                    if (bedNoCombo != undefined) {
                                    	Ext.Ajax.request({
                                      		url: webRoot + '/nws/icu_beds/getNoUsedId/' + BedNumber,
                                              method: 'PUT',
                                              async: false,
                                              success: function(response) {
                                                  var respText = Ext.decode(response.responseText).data;
                                                  var data1=[[me.BED_ID,me.BED_NUMBER]];
                                                  //var data2=[[respText[0].ID,BedNumber]];
                                                  //var store=bedNoCombo.getStore();
                                                  //var index=0
                                                  //store.each(function(record) {
                                                	//    index++;
                                                	//  	if(record.get('value')==me.BED_ID){
                                                	//  		store.remove(store.getAt(index-1));
                                                	//  	}
                                                	//});
                                                  bedNoCombo.getStore().reload();
                                                  //bedNoCombo.getStore().add(data2);
                                              },
                                              failure: function(response, options) {
                                                  Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                                              }
                                          });
                                    }
                                    myMask.hide();
                                    me.close();
                                },
                                failure: function(response, options) {
                                    myMask.hide();
                                    Ext.MessageBox.alert('提示', '添加床位失败,请求超时或网络故障!');
                                }
                            });
                    },
                    failure: function(response, options) {
                        Ext.MessageBox.alert('提示', '获取病人信息失败,请求超时或网络故障!');
                    }
                });
        	}
        }
    }
});