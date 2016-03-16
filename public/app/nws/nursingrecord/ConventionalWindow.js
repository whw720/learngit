/**
 * 功能说明: 护理记录复制窗口
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalWindow', {
    extend: 'Ext.window.Window',
    initComponent 	: function(){
        var proxy = this;
        var grid = proxy.nursingRecordApp;
        var records = grid.gridpanel.getSelectionModel().getSelection();
        proxy.nowDate=new Date();
        if(records.length>0){
            proxy.nowDate=new Date(records[0].get('CARE_TIME'));
        }
        proxy.nowHour=Ext.Date.format(proxy.nowDate, 'H');
        proxy.nowMinu=Ext.Date.format(proxy.nowDate, 'i');
        //开始日期
        proxy.beginDatefield = new Ext.form.field.Date({
            width: 165,
            labelWidth: 58,
            format: 'Y-m-d',
            editable:false,
            labelAlign: 'right',
            fieldLabel: '护理时间',
            value: proxy.nowDate
        });
        //开始小时
        proxy.beginHourSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 23,
            value: proxy.nowHour
        });
        //开始分钟
        proxy.beginMinuteSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 59,
            value: proxy.nowMinu
        });
        Ext.apply(this, {
            title 	  : '新增护理记录',
            height 	  : 150,
            width 	  : 300,
            //modal 	  : true,
            resizable : false,
            //closeAction : 'hide',
            items	  : [{
                xtype	: 'form',
                region 	: 'center',
                bodyPadding	: '5',
                defaults	: {
                    anchor	: '100%'
                },
                items  : [
                    {
                        region: 'center',
                        xtype: 'container',
                        layout: 'vbox',
                        style: {
                            'padding-top': '5px',
                            'background-color': '#FFF'
                        },
                        items: [
                            {
                                xtype: 'fieldcontainer',
                                combineErrors: true,
                                msgTarget: 'side',
                                width: '100%',
                                layout: 'hbox',
                                items: [
                                    proxy.beginDatefield, proxy.beginHourSpinner, proxy.beginMinuteSpinner
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                combineErrors: true,
                                msgTarget: 'side',
                                width: '100%',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype:'checkboxfield',
                                        boxLabel : '复制选中记录',
                                        id:grid.id+'copylast',
                                        labelAlign:'right'
                                    }
                                ]
                            }
                        ]
                    }
                    /*{
                    xtype       : 'datetimefield',
                    labelWidth  : 60,
                    name        : 'careTime',
                    fieldLabel  : '护理时间',
                    format      : 'Y-m-d H:i',
                    editable    : false,
                    value       : new Date()
                }*/]
            }],

            buttons	: [{	// 定义操作按钮
                action	: 'edit_save_button',
                iconCls	: 'icon-submmit',
                text 	: '确定',
                handler : function(btn) {
                    var registerId = grid.patientInfo.REGISTER_ID;
                    var careTime = proxy.getBeginDateTime();//btn.up('window').down('form').getValues()['careTime'];
                    records = grid.gridpanel.getSelectionModel().getSelection();
                    if (new Date(careTime).getTime() > new Date().getTime()) {
                        Ext.MessageBox.show({
                            title: '提示',
                            msg: '执行时间不能大于当前时间！',
                            width: 200,
                            modal: true,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        return;
                    }
                    if (Ext.getCmp(grid.id + 'copylast').getValue()) { // 复制
                        var copyField = grid.gridpanel.selectField;
                        if (copyField == null || copyField == '') {
                            Ext.MessageBox.show({
                                title: '提示',
                                msg: '请选中要复制的记录！',
                                width: 200,
                                modal: true,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                            return;
                        }
                        var copyValue = '';
                        if (records.length > 0) {
                            copyValue = (records[0].get('CARE_TIME') == null ? '' : records[0].get('CARE_TIME'));
                        }else{
                            Ext.MessageBox.show({
                                title: '提示',
                                msg: '请选中要复制的记录！',
                                width: 200,
                                modal: true,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                            return;
                        }
                        var isHaveValue=false;
                        if(records[0]&&records[0].data){
                            for(var tep in records[0].data){
                                if(tep!='ID'&&tep!='CARE_TIME'&&tep!='REGISTER_ID'&&tep!='4db35a85c37611e39dd9e41f1364eb96'&&tep!='CHECKHAVE'){
                                    if(records[0].data[tep]&&records[0].data[tep]!=""&&records[0].data[tep]!=null){
                                        console.log("isHaveValue=true: "+records[0].data[tep]);
                                        isHaveValue=true;
                                        break;
                                    }
                                }
                            }
                        }
                        if(!isHaveValue){
                            Ext.MessageBox.show({
                                title: '提示',
                                msg: '请不要选中空的记录进行复制！',
                                width: 200,
                                modal: true,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                            return;
                        }
                        if (copyValue != '' && copyValue != null) {
                            url = '/icu/nursingRecord/conventional/copyRecords';
                            method = 'post';
                            params = {
                                userId: userInfo.userId,
                                register_id: registerId,
                                newCareTime: Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s'),
                                careTime: copyValue
                            };
                            Ext.Ajax.request({
                                url: webRoot + url,
                                params: params,
                                method: method,
                                scope: this,
                                success: function (response) {
                                    var result = Ext.decode(response.responseText);
                                    var showColumn = proxy.treeSelect.getSelsJson();
                                    grid.queryGrid(showColumn);
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '添加失败,请求超时或网络故障!');
                                }
                            });
                        } else {
                            var careTimeStr = Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s');
                            var da = {CARE_TIME: careTimeStr, REGISTER_ID: registerId};

                            var allLen = grid.store.getCount();
                            var flag = false;
                            for (var m = 0; m < allLen; m++) {
                                if (grid.store.getAt(m).get('CARE_TIME') == careTimeStr) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                grid.store.add(da);
                                grid.store.sort('CARE_TIME', 'ASC');
                            }
                        }

                    } else {
                        var careTimeStr = Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s');
                        var da = {CARE_TIME: careTimeStr, REGISTER_ID: registerId};

                        var allLen = grid.store.getCount();
                        var flag = false;
                        for (var m = 0; m < allLen; m++) {
                            if (grid.store.getAt(m).get('CARE_TIME') == careTimeStr) {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            grid.store.add(da);
                            grid.store.sort('CARE_TIME', 'ASC');
                        }
                    }
                    this.up('window').close();
                }
            }, {
                action	: 'edit_cancel_button',
                iconCls	: 'icon-remove',
                text 	: '取消',
                handler : function() {
                    this.up('window').close();
                }
            }],
            listeners:{
                afterrender:function(){
                    proxy.beginMinuteSpinner.focus();
                },
                close:function(){
                    proxy.destroy();
                }
            }
        });

        this.callParent();
    },
    //得到开始时间
    getBeginDateTime: function () {
        var proxy = this;
        var beginDate = proxy.beginDatefield.getValue();
        var beginHour = proxy.beginHourSpinner.getValue();
        var beginMinute = proxy.beginMinuteSpinner.getValue();
        if (beginDate == null) {
            Ext.MessageBox.alert('提示', '请选择护理日期！');
            return null;
        }
        if (beginHour == null) {
            Ext.MessageBox.alert('提示', '请选择护理时间！');
            return null;
        }
        if (beginMinute == null) {
            Ext.MessageBox.alert('提示', '请选择护理时间！');
            return null;
        }
        beginDate.setHours(beginHour);
        beginDate.setMinutes(beginMinute);
        return beginDate;
    }
});