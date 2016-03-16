/**
 * 定义护理内容窗口
 *
 * @author chm
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.NursingRecordWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.nursingrecordwindow',

    requires: ['com.dfsoft.icu.nws.nursingrecord.NursingRecordPanel'],

    initComponent: function () {
        var proxy = this;
        proxy.elm = new Ext.LoadMask(proxy, {
            msg: "数据加载中。。。"
        });
        proxy.nursingRecordPanel = new com.dfsoft.icu.nws.nursingrecord.NursingRecordPanel(
            {patientInfo: proxy.patientInfo, careRecordApp: proxy.careRecordApp,
                windowId: proxy.id, careTimeNow: proxy.careTimeNow, parent: proxy,
                parentWin: proxy});
        var titleVar = '';
        if (proxy.typeName != undefined && proxy.typeName != '') {
            if (proxy.typeName == '夜班') {
                var infoMsg = new Date(new Date(proxy.careTimeNow).getTime() - (1000 * 60 * 60 * 24)).Format('yyyy-MM-dd');
                titleVar = infoMsg + " " + proxy.typeName;
            } else {
                titleVar = proxy.careTimeNow.substr(0, proxy.careTimeNow.indexOf(' ')) + " " + proxy.typeName;
            }
        } else {
            titleVar = proxy.careTimeNow
        }
        Ext.apply(this, {
            title: '护理内容 ' + (titleVar),
            height: 604,//430
            width: 765,//700
            resizable: false,
            conclusionContent: '',
            items: [proxy.nursingRecordPanel],

            buttons: [
                {	// 定义操作按钮
                    action: 'edit_save_button',
                    iconCls: 'icon-submmit',
                    text: '确定',
                    handler: function (btn) {
                        var grid = proxy.careRecordApp;
                        var records = grid.getSelectionModel().getSelection();

                        var tabPanel = this.up('window').down('tabpanel');
                        var tabs = tabPanel.items.items;
                        var careContent = '{';

                        var isWindow = true;
                        for (var i = 0; i < tabs.length; i++) {
                            var tab = tabs[i];
                            if (i != 2) {
                                if (tab.rawValue.length > 600) {
                                    Ext.MessageBox.alert('提示', tab.title + '长度不能大于600!');
                                    return;
                                }
                                careContent += '"' + tab.name + '":"' + base64_encode(tab.rawValue) + '",';

                            } else {
                                careContent += '"conclusion":';
                                var textarea = tab.items.items[0].rawValue;
                                if (textarea != undefined && textarea != null) {
                                    if (textarea.length > 600) {
                                        Ext.MessageBox.alert('提示', '总结长度不能大于600!');
                                        return;
                                    }
                                    careContent += '"' + base64_encode(textarea) + '",';
                                    isWindow = false;
                                } else {
                                    careContent += '"",';
                                }

                            }
                        }
                        if (careContent.indexOf(',') != -1) {
                            careContent = careContent.substring(0, careContent.length - 1);
                        }
                        careContent += "}";
                        if (careContent.length == 2) {
                            careContent = '';
                        }
                        if (isWindow && document.getElementById('couclusionIframe') != null) {
                            var aframe = document.getElementById('couclusionIframe').contentWindow;
                            var couclusionJSON = aframe.savePageData();
                            if (couclusionJSON == false) {
                                Ext.MessageBox.alert('提示', '保存护理总结失败,请注意填写内容是否规范');
                                return;
                            }
                        }
                        var careTimeT = '';
                        if (records.length <= 0) {
                            careTimeT = proxy.careTimeNow;
                            Ext.Ajax.request({
                                url: webRoot + '/icu/nursingRecord/conventional/recordWindow',
                                params: {
                                    userId: userInfo.userId,
                                    registerId: proxy.patientInfo.REGISTER_ID,
                                    careTime: proxy.careTimeNow,
                                    bedItemId: proxy.careRecordApp.careContentPreset,
                                    careValue: careContent,//.replace(/\r\n|\n/g, ''),
                                    careContent: proxy.careRecordApp.careContentPreset,
                                    associateId: '9527'
                                },
                                method: 'PUT',
                                scope: this,
                                success: function (response) {
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                                }
                            });
                            grid.parent.queryGrid();
                        } else {
                            careTimeT = Ext.Date.format(new Date(records[0].get('CARE_TIME')), 'Y-m-d H:i:s');
                            // 设置护理内容值
                            records[0].set(proxy.careRecordApp.careContentPreset, careContent.replace(/\r\n|\n/g, ''));
                            Ext.Ajax.request({
                                url: webRoot + '/icu/nursingRecord/conventional/1_setCare',
                                params: {
                                    userId: userInfo.userId,
                                    registerId: proxy.patientInfo.REGISTER_ID,
                                    careTime: records[0].get('CARE_TIME'),
                                    bedItemId: proxy.careRecordApp.careContentPreset,
                                    careValue: careContent.replace(/\r\n|\n/g, ''),
                                    careContent: proxy.careRecordApp.careContentPreset
                                },
                                method: 'PUT',
                                scope: this,
                                success: function (response) {
                                    records[0].commit();
                                },
                                failure: function (response, options) {
                                    Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                                }
                            });
                        }

                        var selJson = proxy.nursingRecordPanel.bedItemComboBoxTree.getSelsJson();
                        var checkedNodes = Ext.decode(selJson);

                        if (checkedNodes != undefined && checkedNodes != null) {
                            var selNodes = [], str = '';
                            for (var i = 0; i < checkedNodes.length; i++) {
                                var nodeId = checkedNodes[i].code;
                                selNodes.push(nodeId.replace(" ", ""));
                                str += checkedNodes[i].name + ',';
                            }
                            if (checkedNodes.length > 0) {
                                str = str.substring(0, str.length - 1);
                                if (records.length > 0) {
                                    records[0].set('CHECKHAVE', str);
                                }
                            } else {
                                if (records.length > 0) {
                                    records[0].set('CHECKHAVE', "");
                                }
                            }
                            setTimeout(function () {
                                // 保存护理内容到数据库
                                Ext.Ajax.request({
                                    url: webRoot + '/icu/nursingRecord/conventional/save/careSpecialItem',
                                    method: 'post',
                                    params: {
                                        careTime: careTimeT,
                                        registerId: proxy.patientInfo.REGISTER_ID,
                                        selNodes: selNodes
                                    },
                                    scope: this,
                                    success: function (response) {

                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('提示', '保存护理内容失败,请求超时或网络故障!');
                                    }
                                });
                            }, 500);
                        }

                        if (isWindow && document.getElementById('couclusionIframe') != null) {
                            var aframe = document.getElementById('couclusionIframe').contentWindow;
                            var couclusionJSON = aframe.savePageData();

                            console.log(couclusionJSON);
                            if (couclusionJSON.registerId != "") {
                                var jsonStr = JSON.stringify(aframe.savePageData());
                                setTimeout(function () {
                                    Ext.Ajax.request({
                                        url: webRoot + '/nws/conclusion/zzszxyy/saveCare',
                                        params: {
                                            registerId: proxy.patientInfo.REGISTER_ID,
                                            careTime: proxy.careTimeNow,
                                            value: jsonStr,
                                            userId: userInfo.userId,
                                            internum: proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60
                                        },
                                        method: 'POST',
                                        scope: this,
                                        success: function (response) {

                                        }
                                    });
                                }, 300);
                            } else {
                                console.log('护理内容总结返回JSON不对');
                                console.log(couclusionJSON);
                            }
                        }
                        proxy.close();
                    }
                },
                {
                    action: 'edit_cancel_button',
                    iconCls: 'icon-remove',
                    text: '取消',
                    handler: function () {
                        proxy.close();
                    }
                }
            ]
        });
        this.on('close', function () {
            proxy.careRecordApp.careContentOpen = false;
        });
        this.callParent();
    }
});