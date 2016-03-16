Ext.define('com.dfsoft.icu.dtm.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.JsonStore'
    ],

    id: 'dtm',

    init: function() {
        Ext.util.CSS.swapStyleSheet('dtm.css', '/app/dtm/css/dtm.css');
        Ext.util.CSS.swapStyleSheet('accessibility.css', webRoot+'/app/dtm/accessibility/css/accessibility.css');
        this.launcher = {
            text: '科室事务管理',
            iconCls: 'dtm-small'
        }
    },

    createNewWindow: function(isMaxWindow) {
        var me = this,
            desktop = me.app.getDesktop(),
            isMaxWindow = isMaxWindow == 'true';

        return desktop.createWindow({
            id: 'dtm',
            title: '科室事务管理',
            iconCls: 'dtm-small',
            width: 1045,
            height: 600,
            //maximized: isMaxWindow, //自动最大化
            animCollapse: false,
            constrainHeader: true,
            border: false,
            layout: {
                type: 'border',
                padding: 5
            },
            items: [{
                region: 'west',
                layout: 'fit',
                border: true,
                split: {
                    size: 5
                },
                items: [
                    this.createPan()
                ]
            }, {
                region: 'center',
                layout: 'fit',
                border: true,
                split: {
                    size: 5
                },
                items: [
                    this.createReport()
                ]
            }]
        });
    },

    createWindow: function(isMaxWindow) {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow(isMaxWindow);
        }
        return win;
    },
    createPan: function() {
        var me = this;
        var sourceMap = {'c5b76689c0a611e4865700262dff6a9e': true,
            'db985b8fc0a611e4865700262dff6a9e': true,
            '1b21037cc0a711e4865700262dff6a9e': true,
            '1f65a22bc0a711e4865700262dff6a9e': true,
            '3bc823cac0a711e4865700262dff6a9e': true,
            '42b4638ee18511e48d5c00262dff6a9e': true,
            '45d96037e18511e48d5c00262dff6a9e': true,
            '491c67d3e18511e48d5c00262dff6a9e': true,
            '4c65b4eee18511e48d5c00262dff6a9e': true,
            '4fae65f2e18511e48d5c00262dff6a9e': true
        };
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            if (sourceMap[resourceData[i].id] == true) {
                sourceMap[resourceData[i].id] = false;
            }
        }
        var panel = Ext.create('Ext.panel.Panel', {
            width: 210,
            minWidth: 220,
            layout: {
                type: 'accordion',
                animate: true
            },
            items: [ {
                xtype: 'treepanel',
                title: '护士管理',
                rootVisible: false,
                plugins: [
                    {
                        ptype: 'nodedisabled'
                    }
                ],
                useArrows: true,
                autoScroll: false,
                store: new Ext.data.TreeStore({
                    root: {
                        expanded: true,
                        children: [{
                            text: '排班管理',
                            expanded: true,
                            children: [
                                {
                                    disabled: sourceMap['c5b76689c0a611e4865700262dff6a9e'],
                                    text: '排班类型',
                                    id: '21',
                                    leaf: true
                                }, {
                                    disabled: sourceMap['db985b8fc0a611e4865700262dff6a9e'],
                                    text: '排班日历',
                                    id: '22',
                                    leaf: true
                                }
                            ]
                        }, {
                            text: '工作量统计',
                            id: '31',
                            expanded:true,
                            leaf: false,
                            children: [{
                                disabled: sourceMap['1b21037cc0a711e4865700262dff6a9e'],
                                text: '分值设置',
                                id: '311',
                                leaf: true
                            }, {
                                text: '统计报表',
                                id: '312',
                                leaf: false,
                                expanded:true,
                                children: [{
                                    disabled: sourceMap['1f65a22bc0a711e4865700262dff6a9e'],
                                    text: '分项工作量统计',
                                    id: '3121',
                                    leaf: true
                                }, {
                                    disabled: sourceMap['3bc823cac0a711e4865700262dff6a9e'],
                                    text: '工作量统计',
                                    id: '3122',
                                    leaf: true
                                }]
                            }]
                        }]
                    }
                }),
                listeners: {
                    itemclick: function(_this, record, item, index, e, eOpts) {
                        if (record.raw.disabled == true)
                            return;
                        var id = record.data.id;
                        var panel = Ext.getCmp(id);
                        if (id && id === '21') {
                            var url = '/app/dtm/SchedulingType.html';
                            dtmShowInTab(id, '护士' + record.data.text, url);
                        } else if (id && id == '22') {
                            var url = '/app/dtm/Scheduling.html?userId='+userInfo.userId;
                            dtmShowInTab(id, '护士' + record.data.text, url);
                        } else if (id && id === '311') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ScoreSetting', {
                                    parent: this
                                });
                            }
                            dtmShowInTab(id, '护士-' + record.data.text, panel);
                        }else if(id && id === '321') {
                            panel=Ext.getCmp('accessibility-consumable-grid');
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableGridPanel', {
                                    parent: this
                                });
                            }
                            dtmShowInTab(id, '护士-' + record.data.text, panel);
                        }else if(id && id === '322') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableCountForm', {
                                    parent: this
                                });
                            }
                            dtmShowInTab(id, '护士-' + record.data.text, panel);
                        }else if(id && id === '3121') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ScoreGroupCount', {
                                    parent: this
                                });
                            }
                            dtmShowInTab(id, '护士-' + record.data.text, panel);
                            /*var url = '/app/dtm/accessibility/ScoreGroupCount.html';
                             dtmShowInTab(id, '辅助功能-' + record.data.text, url);*/
                        }else if(id && id === '3122') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.NurseCountGrid', {
                                    parent: this
                                });
                            }
                            dtmShowInTab(id, '护士-' + record.data.text, panel);
                            /*var url = '/app/dtm/accessibility/NurseCountGrid.html';
                             dtmShowInTab(id, '辅助功能-' + record.data.text, url);*/
                        }
                    }
                }
            },{
                xtype: 'treepanel',
                title: '医生管理',
                rootVisible: false,
                plugins: [
                    {
                        ptype: 'nodedisabled'
                    }
                ],
                useArrows: true,
                autoScroll: false,
                store: new Ext.data.TreeStore({
                    root: {
                        expanded: true,
                        children: [{
                            text: '排班管理',
                            expanded: true,
                            children: [
                                {
                                    disabled: sourceMap['42b4638ee18511e48d5c00262dff6a9e'],
                                    text: '排班类型',
                                    id: '11D',
                                    leaf: true
                                }, {
                                    disabled: sourceMap['45d96037e18511e48d5c00262dff6a9e'],
                                    text: '排班日历',
                                    id: '12D',
                                    leaf: true
                                }
                            ]
                        }, {
                            text: '工作量统计',
                            id: '31D',
                            expanded:true,
                            leaf: false,
                            children: [{
                                disabled: sourceMap['491c67d3e18511e48d5c00262dff6a9e'],
                                text: '分值设置',
                                id: '111D',
                                leaf: true
                            }, {
                                text: '统计报表',
                                id: '112D',
                                leaf: false,
                                expanded:true,
                                children: [{
                                    disabled: sourceMap['4c65b4eee18511e48d5c00262dff6a9e'],
                                    text: '分项工作量统计',
                                    id: '1121D',
                                    leaf: true
                                }, {
                                    disabled: sourceMap['4fae65f2e18511e48d5c00262dff6a9e'],
                                    text: '工作量统计',
                                    id: '1122D',
                                    leaf: true
                                }]
                            }]
                        }]
                    }
                }),
                listeners: {
                    itemclick: function(_this, record, item, index, e, eOpts) {
                        if (record.raw.disabled == true)
                            return;
                        var id = record.data.id;
                        var panel = Ext.getCmp(id);
                        if (id && id === '11D') {
                            var url = '/app/dtm/SchedulingType.html?owner=D';
                            dtmShowInTab(id, '医生' + record.data.text, url);
                        } else if (id && id == '12D') {
                            var url = '/app/dtm/Scheduling.html?owner=D&userId=' + userInfo.userId;
                            dtmShowInTab(id, '医生' + record.data.text, url);
                        } else if (id && id === '111D') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ScoreSetting', {
                                    parent: this,
                                    owner: 'D'
                                });
                            }
                            dtmShowInTab(id, '医生-' + record.data.text, panel);
                        } else if (id && id === '121D') {
                            panel = Ext.getCmp('accessibility-consumable-gridD');
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableGridPanel', {
                                    parent: this,
                                    owner: 'D'
                                });
                            }
                            dtmShowInTab(id, '医生-' + record.data.text, panel);
                        } else if (id && id === '122D') {
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableCountForm', {
                                    parent: this,
                                    owner: 'D'
                                });
                            }
                            dtmShowInTab(id, '医生-' + record.data.text, panel);
                        } else if (id && id === '1121D') {
                            panel = Ext.getCmp('accessibility-score-group-gridD');
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ScoreGroupCount', {
                                    parent: this,
                                    owner: 'D'
                                });
                            }
                            dtmShowInTab(id, '医生-' + record.data.text, panel);
                            /*var url = '/app/dtm/accessibility/ScoreGroupCount.html';
                             dtmShowInTab(id, '辅助功能-' + record.data.text, url);*/
                        } else if (id && id === '1122D') {
                            panel = Ext.getCmp('accessibility-nurse-count-gridD');
                            if (!panel) {
                                panel = Ext.create('com.dfsoft.icu.dtm.accessibility.NurseCountGrid', {
                                    parent: this,
                                    owner: 'D'
                                });
                            }
                            dtmShowInTab(id, '医生-' + record.data.text, panel);
                            /*var url = '/app/dtm/accessibility/NurseCountGrid.html';
                             dtmShowInTab(id, '辅助功能-' + record.data.text, url);*/
                        }
                    }
                }
            }]
        });
        return panel;
    },
    createReport: function() {
        var me = this;
        var panel = Ext.create('Ext.tab.Panel', {
            id: 'dtm-report-panel',
            plain: true,
            padding: 5,
            tabBar: {
                height: 30,
                defaults: {
                    height: 27
                }
            }
        });
        return panel;
    }
});

function dtmShowInTab(tabId, tabName, url) {
    var panel = Ext.getCmp(tabId),
        main = Ext.getCmp('dtm-report-panel');
    if (!panel) {
        if (typeof url == 'string') {
            //iframe html 模板
            var iframeTemplate = new Ext.Template('<iframe style="display:block"' +
                ' id="iframe_{id}" name="iframe_{name}" frameborder="0" src="{url}"' +
                ' width="100%" height="100%"></iframe>');
            var iframeHtml = iframeTemplate.apply({
                id: tabId,
                name: tabId,
                url: url
            });
            panel = {
                id: tabId,
                title: "<div style='padding-top: 1px;'>" + tabName + "</div>",
                closable: true,
                border: true,
                layout: 'fit',
                html: iframeHtml
            }
        } else {
            panel = {
                id: tabId,
                title: "<div style='padding-top: 1px;'>" + tabName + "</div>",
                closable: true,
                border: true,
                layout: 'fit',
                items: [url]
            }
        }
        var p = main.add(panel);
        main.setActiveTab(p);
    } else {
        main.setActiveTab(panel);
    }
}