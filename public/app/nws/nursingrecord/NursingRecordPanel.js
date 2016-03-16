/**
 * 定义护理记录编辑页面
 *
 * @author chm
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.NursingRecordPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.nursingrecordpanel',
    requires: ['com.dfsoft.icu.nws.nursingrecord.CareTemplateTree'],
    //创建显示面板
    createPan: function (url) {
        var panel = Ext.createWidget('panel', {
            padding: 0,
            layout: 'fit',
            items: [
                {
                    xtype: "component",
                    anchor: '100%',
                    width: '100%',
                    height: '100%' }
            ]
        });
        if (document.getElementById('couclusionIframe') != null) {
            document.getElementById('couclusionIframe').parentNode.removeChild(document.getElementById('couclusionIframe'));
            panel.down("component").html = '<iframe id="couclusionIframe" frameborder="0" src="' + url + '" width="100%" height="100%"></iframe>';
        } else {
            panel.down("component").html = '<iframe id="couclusionIframe" frameborder="0" src="' + url + '" width="100%" height="100%"></iframe>';
        }
        return panel;
    },
    createSpecialPanel: function () {
        var bedItemComboBoxTree = '';
        Ext.Ajax.request({
            url: webRoot + '/icu/nursingRecord/conventional/get/specialItem/all',
            params: {
                registerId: this.patientInfo.REGISTER_ID,
                careTime: this.careTimeNow
            },
            method: 'GET',
            scope: this,
            async: false,
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {

                    if (result.data.length > 0) {
                        bedItemComboBoxTree = Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialItemTreePanel', {
                            treeid: result.data[0], windowId: this.windowId
                        });
                    } else {
                        bedItemComboBoxTree = Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialItemTreePanel', {
                            treeid: '35fb69e8074011e4ad56002713c9dd0a,99aa33ba074111e4ad56002713c9dd0a', windowId: this.windowId
                        });
                    }

                }
            }
        });
        return bedItemComboBoxTree;
        /*var bedItemComboBoxTree = Ext.create('com.dfsoft.icu.nws.bedmanagement.beditemtree.SpecialItemTreePanel', {
         treeid: '35fb69e8074011e4ad56002713c9dd0a,99aa33ba074111e4ad56002713c9dd0a'
         });
         return bedItemComboBoxTree;*/
    },
    initComponent: function () {
        var proxy = this;
        var records = proxy.careRecordApp.getSelectionModel().getSelection();
        proxy.bedItemComboBoxTree = proxy.createSpecialPanel();
        proxy.wStore = new Ext.data.Store({
            fields: ['item_value', 'display_name']
        });
        /*var careTime ='';
         if(records.length<=0){
         careTime =proxy.careTimeNow;
         }else{
         careTime = Ext.Date.format(new Date(records[0].data.CARE_TIME), 'Y-m-d H:i:s')
         }*/


        Ext.apply(this, {
            //region : 'center',
            layout: 'fit',

            border: true,
            margin: '5',
            defaults: {
                split: true
            },

            items: [
                {
                    region: 'west',
                    hidden: true,
                    xtype: "caretemplatetree",
                    width: 170,
                    split: {
                        size: 5
                    }
                },
                {
                    xtype: 'form',
                    region: 'center',
                    border: true,
                    margin: '-1 -1 -1 -1',
                    bodyPadding: '5',
                    width: 200,

                    items: [
                        {
                            xtype: 'fieldset',
                            title: '出入液量',
                            collapsible: false,
                            width: '100%',
                            padding: '0 5 0 5',
                            items: [
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            minWidth: 200,
                                            width: 230,

                                            items: [
                                                {
                                                    xtype: 'datetimefield',
                                                    fieldLabel: '开始时间',
                                                    labelWidth: 60,
                                                    width: 220,
                                                    name: 'startTime',
                                                    editable: false,
                                                    format: 'Y-m-d H:i'
                                                },
                                                {
                                                    xtype: 'datetimefield',
                                                    fieldLabel: '结束时间',
                                                    labelWidth: 60,
                                                    width: 220,
                                                    name: 'endTime',
                                                    editable: false,
                                                    format: 'Y-m-d H:i',
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: '0 0 5 175',
                                                    text: '统计',
                                                    handler: function (btn) {
                                                        var startTime = btn.up('panel').down('[name=startTime]').getValue();
                                                        var endTime = btn.up('panel').down('[name=endTime]').getValue();
                                                        var results = btn.up('panel').up('panel').down('[name=statisticalResults]');

                                                        if (startTime.getTime() > endTime.getTime()) {
                                                            Ext.MessageBox.alert('提示', '统计开始时间不能大于结束时间!');
                                                            return;
                                                        }
                                                        Ext.Ajax.request({
                                                            url: webRoot + '/icu/nursingRecord/conventional/stathumoral',
                                                            method: 'POST',
                                                            params: {
                                                                registerId: proxy.patientInfo.REGISTER_ID,
                                                                startTime: startTime,
                                                                endTime: endTime,
                                                                outNum: proxy.careRecordApp.outNumPreset,
                                                                enterNum: proxy.careRecordApp.enterNumPreset
                                                            },
                                                            success: function (response) {
                                                                var result = Ext.decode(response.responseText);
                                                                if (result.success) {
                                                                    if (result.data.length > 0) {
                                                                        var out = 0, inLin = 0;
                                                                        if (result.data[0].out != null) {
                                                                            out = Number(result.data[0].out);
                                                                            out = Math.round(out * 100) / 100;
                                                                        }
                                                                        if (result.data[0].enter != null) {
                                                                            inLin = Number(result.data[0].enter);
                                                                            inLin = Math.round(inLin * 100) / 100;
                                                                        }
                                                                        var str = '出量：' + out + 'ml \n' +
                                                                            '入量：' + inLin + "ml";
                                                                        results.setValue(str);
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            columnWidth: 1,
                                            margin: '0 0 0 3',
                                            items: [
                                                {
                                                    xtype: 'textareafield',
                                                    name: 'statisticalResults',
                                                    readOnly: true,
                                                    autoWidth: true,
                                                    height: 80,
                                                    width: 420
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'button',
                                            text: '套用',
                                            margin: '55 0 0 0',
                                            width: 60,
                                            labelAlign: 'right',
                                            handler: function (btn) {
                                                var results = btn.up('panel').up('panel').down('[name=statisticalResults]');
                                                var str = results.getValue();
                                                console.log(str);
                                                var tabPanel = proxy.up('panel').down('tabpanel');
                                                var contentField = tabPanel.getActiveTab();

                                                if (tabPanel.activeTab.title == "内容") {
                                                    contentField.setValue(str);
                                                } else if (tabPanel.activeTab.title == "小结") {
                                                    contentField.setValue(str);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout: 'column',
                            margin: '-5 0 0 0',
                            items: [
                                proxy.bedItemComboBoxTree, {
                                    columnWidth: 1,
                                    layout: 'anchor',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    margin: '0 0 0 5',
                                    items: [
                                        {
                                            xtype: 'tabpanel',
                                            name: 'otherTab',
                                            region: 'center',
                                            activeTab: 0,
                                            plain: true,
                                            height: 394,//237 +18
                                            dockedItems: [
                                                {
                                                    xtype: 'toolbar',
                                                    dock: 'top',
                                                    items: ['->',
                                                        {
                                                            xtype: 'combo',
                                                            editable: false,
                                                            id: proxy.id + 'typename',
                                                            maxLength: 20,
                                                            maxLengthText: '最长允许输入20个字符',
                                                            queryMode: 'local',
                                                            fieldLabel: '模板',
                                                            labelWidth: 38,
                                                            typeAhead: true,
                                                            valueField: 'item_value',
                                                            displayField: 'display_name',
                                                            store: proxy.wStore
                                                        },
                                                        {
                                                            action: 'refresh_button',
                                                            //text: '应用模板',
                                                            tooltip:'套用模板',
                                                            iconCls: 'shift-submit',
                                                            id: proxy.id + 'appli_btn',
                                                            labelAlign: 'right',
                                                            handler: function () {

                                                                var record = Ext.getCmp(proxy.id + 'typename').getValue();
                                                                if (!record || record == '') {
                                                                    Ext.MessageBox.alert('提示', '请选择模板！');
                                                                    return;
                                                                }
                                                                var contentTab = '';
                                                                var tabPanel = this.up('tabpanel');
                                                                var contentField = tabPanel.getActiveTab();

                                                                if (tabPanel.activeTab.title == "内容") {
                                                                    for (var i = 0; i < proxy.firstValue.length; i++) {
                                                                        if (proxy.firstValue[i].get('id') == record) {
                                                                            contentTab = proxy.firstValue[i].get('content');
                                                                        }
                                                                    }
                                                                } else if (tabPanel.activeTab.title == "小结") {
                                                                    for (var i = 0; i < proxy.secValue.length; i++) {
                                                                        if (proxy.secValue[i].get('id') == record) {
                                                                            contentTab = proxy.secValue[i].get('content');
                                                                        }
                                                                    }
                                                                } else if (tabPanel.activeTab.title == "总结") {
                                                                    for (var i = 0; i < proxy.thrValue.length; i++) {
                                                                        if (proxy.thrValue[i].get('id') == record) {
                                                                            contentTab = proxy.thrValue[i].get('content');
                                                                        }
                                                                    }
                                                                }
                                                                if (contentTab.indexOf('/templates') == -1) {
                                                                    if (contentField.getValue() != '') {
                                                                        Ext.MessageBox.confirm('提示', '护理' + tabPanel.activeTab.title + '不为空，确定要覆盖吗？', function (_btn) {
                                                                            if (_btn != 'yes') {
                                                                                return;
                                                                            }
                                                                            contentField.setValue(contentTab);
                                                                        });
                                                                    } else {
                                                                        contentField.setValue(contentTab);
                                                                    }
                                                                }

                                                            }
                                                        }
                                                    ]
                                                }
                                            ],
                                            items: [
                                                {
                                                    xtype: 'textareafield',
                                                    id: proxy.windowId + 'contentField',
                                                    title: '内容',
                                                    name: 'content',
                                                    emptyText: "内容",
                                                    maxLength: 600,
                                                    maxLengthText: '最长允许输入600为字符'
                                                },
                                                {
                                                    xtype: 'textareafield',
                                                    id: proxy.windowId + 'summaryField',
                                                    title: '小结',
                                                    name: 'summary',
                                                    emptyText: "小结",
                                                    maxLength: 600,
                                                    maxLengthText: '最长允许输入600为字符'
                                                },
                                                {
                                                    xtype: 'panel',
                                                    title: '总结',
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'panel'
                                                        }
                                                    ],
                                                    listeners: {
                                                        afterrender: function (_this, eOpts) {
                                                            var treePanel = proxy.down('treepanel');
                                                            //默认选中总结模板第一个。
                                                            var record = treePanel.getStore().getNodeById('2').childNodes[0];
                                                            treePanel.getSelectionModel().select(record);


                                                            proxy.parentWin.elm.show();
                                                            if (treePanel != undefined && treePanel.getRootNode().childNodes.length > 0) {
                                                                for (var i = 0; i < treePanel.getRootNode().childNodes.length; i++) {
                                                                    var node = treePanel.getRootNode().childNodes[i];
                                                                    if (node.get('id') == 2 && node.childNodes.length > 0) {
                                                                        var template = node.childNodes[0];
                                                                        if (template.get('CONCLUSION_TYPE') == 1 && template.get('content').length > 1) {
                                                                            _this.remove(_this.down('panel'));
                                                                            _this.add(proxy.createPan(template.get('content')));
                                                                            Ext.Ajax.request({
                                                                                url: webRoot + '/nws/conclusion/zzszxyy/queryCare',
                                                                                params: {
                                                                                    registerId: proxy.patientInfo.REGISTER_ID,
                                                                                    careTime: proxy.careTimeNow,
                                                                                    internum: proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60
                                                                                },
                                                                                method: 'POST',
                                                                                scope: this,
                                                                                success: function (response) {
                                                                                    var result = Ext.decode(response.responseText);
                                                                                    if (result.success) {
                                                                                        var str = '', conclusionJSON = {};
                                                                                        if (result.data.length > 0) {
                                                                                            var content = JSON.parse(result.data);
                                                                                            if (content.conclusion == null || content.conclusion == "") {
                                                                                                var schedul = proxy.careRecordApp.conventionalToolbar.scheduling;
                                                                                                if (schedul != null && schedul != '') {
                                                                                                    conclusionJSON.scheduling = schedul.TYPE_NAME == '日班' ? 'day' : 'night';
                                                                                                }
                                                                                                conclusionJSON.conclusionDate = proxy.careTimeNow;
                                                                                                conclusionJSON.registerId = proxy.patientInfo.REGISTER_ID;
                                                                                                conclusionJSON.userName = userInfo.name;
                                                                                                conclusionJSON.userId = userInfo.userId;
                                                                                                str = JSON.stringify(conclusionJSON);
                                                                                            } else {
                                                                                                content.conclusion.userName = userInfo.name;
                                                                                                content.conclusion.userId = userInfo.userId;
                                                                                                str = JSON.stringify(content.conclusion);
                                                                                            }
                                                                                        } else {
                                                                                            var schedul = proxy.careRecordApp.conventionalToolbar.scheduling;

                                                                                            if (schedul != null && schedul != '') {
                                                                                                conclusionJSON.scheduling = schedul.TYPE_NAME == '日班' ? 'day' : 'night';
                                                                                            }
                                                                                            conclusionJSON.conclusionDate = proxy.careTimeNow;
                                                                                            conclusionJSON.registerId = proxy.patientInfo.REGISTER_ID;
                                                                                            conclusionJSON.userName = userInfo.name;
                                                                                            conclusionJSON.userId = userInfo.userId;
                                                                                            str = JSON.stringify(conclusionJSON);
                                                                                        }
                                                                                        setTimeout(function () {
                                                                                            var aframe = document.getElementById('couclusionIframe').contentWindow;
                                                                                            //console.log(aframe.loadPageData);
                                                                                            if (aframe.loadPageData != undefined) {
                                                                                                //  console.log(str);
                                                                                                aframe.loadPageData(str);
                                                                                            }

                                                                                            proxy.parentWin.elm.hide();

                                                                                        }, 2000);
                                                                                    }
                                                                                },
                                                                                failure: function (response, options) {
                                                                                    Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                                                                                }
                                                                            });
                                                                        } else {
                                                                            _this.remove(_this.down('panel'));
                                                                            _this.add({
                                                                                xtype: 'textareafield',
                                                                                title: '总结',
                                                                                value: proxy.parent.conclusionContent,
                                                                                name: 'conclusion',
                                                                                id: proxy.windowId + 'conclusion',
                                                                                emptyText: "总结",
                                                                                maxLength: 600,
                                                                                maxLengthText: '最长允许输入600为字符'
                                                                            });
                                                                            proxy.parentWin.elm.hide();
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                            ],
                                            listeners: {
                                                afterrender: function (_this, eOpts) {
                                                    if (records.length <= 0) {
                                                        Ext.Ajax.request({
                                                            url: webRoot + '/nws/conclusion/zzszxyy/queryCareByTime',
                                                            params: {
                                                                registerId: proxy.patientInfo.REGISTER_ID,
                                                                careTime: proxy.careTimeNow
                                                            },
                                                            method: 'POST',
                                                            scope: this,
                                                            success: function (response) {
                                                                var result = Ext.decode(response.responseText);
                                                                if (result.success) {
                                                                    if (result.data.length > 0) {
                                                                        var content = JSON.parse(result.data);
                                                                        Ext.getCmp(proxy.windowId + 'contentField').setValue(base64_decode(content.content));
                                                                        Ext.getCmp(proxy.windowId + 'summaryField').setValue(base64_decode(content.summary));
                                                                        proxy.parent.conclusionContent = base64_decode(content.conclusion);
                                                                        /*setTimeout(function(){
                                                                         console.log(Ext.getCmp(proxy.windowId+'conclusion'));
                                                                         if(Ext.getCmp(proxy.windowId+'conclusion')){
                                                                         Ext.getCmp(proxy.windowId+'conclusion').setValue(content.conclusion);
                                                                         }

                                                                         },1000);*/

                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                    setTimeout(function () {
                                                        var treePanel = proxy.down('treepanel');

                                                        if (treePanel != undefined && treePanel.getRootNode().childNodes.length > 0) {
                                                            proxy.firstArry = [];
                                                            proxy.secArry = [];
                                                            proxy.thrArry = [];
                                                            proxy.firstValue = [];
                                                            proxy.secValue = [];
                                                            proxy.thrValue = [];
                                                            for (var i = 0; i < treePanel.getRootNode().childNodes.length; i++) {
                                                                var node = treePanel.getRootNode().childNodes[i];
                                                                if (node.get('id') == 2 && node.childNodes.length > 0) {
                                                                    for (var j = 0; j < node.childNodes.length; j++) {
                                                                        var template = node.childNodes[j];
                                                                        proxy.thrArry.push([template.get('id'), template.get('text')]);
                                                                        proxy.thrValue.push(template);
                                                                    }
                                                                } else if (node.get('id') == 1 && node.childNodes.length > 0) {
                                                                    for (var j = 0; j < node.childNodes.length; j++) {
                                                                        var template = node.childNodes[j];
                                                                        proxy.secArry.push([template.get('id'), template.get('text')]);
                                                                        proxy.secValue.push(template);
                                                                    }
                                                                } else if (node.get('id') == 0 && node.childNodes.length > 0) {
                                                                    for (var j = 0; j < node.childNodes.length; j++) {
                                                                        var template = node.childNodes[j];
                                                                        proxy.firstArry.push([template.get('id'), template.get('text')]);
                                                                        proxy.firstValue.push(template);
                                                                    }
                                                                }
                                                            }
                                                            proxy.wStore.loadData(proxy.firstArry);
                                                        }
                                                    }, 1000);

                                                },
                                                tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                                                    var careTemplateTree = Ext.ComponentQuery.query("caretemplatetree")[0];

                                                    if (tabPanel.activeTab.title == "总结") {
                                                        var record = careTemplateTree.getStore().getNodeById('6565cccc-ac16-11e3-96e8-00271396');
                                                        careTemplateTree.getSelectionModel().select(record);
                                                    }
                                                    Ext.getCmp(proxy.id + 'typename').clearValue();

                                                    if (tabPanel.activeTab.title == "总结") {
                                                        proxy.wStore.loadData(proxy.thrArry);
                                                        Ext.getCmp(proxy.id + 'appli_btn').setDisabled(true);
                                                    } else if (tabPanel.activeTab.title == "小结") {
                                                        proxy.wStore.loadData(proxy.secArry);
                                                        Ext.getCmp(proxy.id + 'appli_btn').setDisabled(false);
                                                    } else if (tabPanel.activeTab.title == "内容") {
                                                        Ext.getCmp(proxy.id + 'appli_btn').setDisabled(false);
                                                        proxy.wStore.loadData(proxy.firstArry);
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }]
                        }
                    ]
                }
            ]
        });
        this.callParent();
    }
});