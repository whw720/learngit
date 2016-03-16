Ext.define('com.dfsoft.icu.medicalrecord.CaseWindow', {
    extend: 'Ext.window.Window',

    uses: [

    ],

    layout: 'fit',
    title: '病历信息',
    modal: true,
    width: 1080,
    height: 600,
    border: false,
    iconCls: 'case-history',
    maximizable: true,

    initComponent: function(config) {
        Ext.apply(this.config);
        var me = this;
        me.id='new_casewindow_medicalrecord',
        me.buttons = [{
            xtype: 'splitbutton',
            hidden: true,
            text: '打印',
            iconCls: 'print',
            handler: me.onPrint,
            scope: me,
            menu: [{
                text: '直接打印',
                iconCls: 'print',
                handler: me.onPrint,
                scope: me
            }, {
                text: '打印预览',
                iconCls: 'print-preview',
                handler: me.onPrint,
                scope: me
            }]
        }, {
            text: '取消',
            iconCls: 'cancel',
            handler: me.close,
            scope: me
        }];
        me.items = [{
            anchor: '100%',
            border: false,
            layout: 'fit',
            items: [
                me.createTabs()
            ]
        }];
        me.callParent();
    },

    createTabs: function() {
        var me = this;
        var tabs = Ext.createWidget('tabpanel', {
            id: 'caseTabPanel',
            activeTab: 0,
            plain: true,
            padding: 5,
            layout: 'fit',
            items: [{
                title: '入院记录单',
                layout: 'border',
                items: [
                    Ext.createWidget('panel', {
                        activeTab: 0,
                        border: true,
                        region: 'center',
                        margin: '-1 0 0 0',
                        items: [{
                            xtype: "component",
                            //id: 'caseHistoryIframe',
                            anchor: '100%',
                            width: '100%',
                            height: '100%',
                            html: '<iframe style="display:block" id="caseHistoryIframe" frameborder="0" src="/templates/' + templates + '/medicalrecord/adm-patient-case-history.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID + '" width="100%" height="100%"></iframe>'
                            // autoEl: {
                            //     tag: 'iframe',
                            //     frameborder: '0',
                            //     src: this.getCaseHistoryPath()
                            // }
                        }],
                        listeners: {
                            render: function() {

                            }
                        }
                    })
                ]
            }, {
                title: '病程记录单',
                layout: 'fit',
                items: [
                    Ext.createWidget('panel', {
                        activeTab: 0,
                        border: true,
                        region: 'center',
                        margin: '-1 0 0 0',
                        items: [{
                            xtype: "component",
                            //id: 'courseRecordIframe',
                            anchor: '100%',
                            width: '100%',
                            height: '100%',
                            html: '<iframe style="display:block" id="courseRecordIframe" frameborder="0" src="/templates/' + templates + '/medicalrecord/adm-patient-case-history-course-record.html?SURGERY_ID=' + me.SURGERY_ID + '&PATIENT_ID=' + me.PATIENT_ID + '" width="100%" height="100%"></iframe>'
                            // autoEl: {
                            //     tag: 'iframe',
                            //     frameborder: '0',
                            //     src: this.getcourseRecordPath()
                            // }
                        }],
                        listeners: {
                            render: function() {

                            }
                        }
                    })
                ]
            }]
        });
        return tabs;
    },

    onPrint: function() {
        var caseTabPanel = Ext.getCmp('caseTabPanel').getActiveTab();
        if (caseTabPanel.title == "入院记录单") {
            var caseHistoryIframe = document.getElementById('caseHistoryIframe').contentWindow;
            caseHistoryIframe.print();
        } else if (caseTabPanel.title == "病程记录单") {
            var courseRecordIframe = document.getElementById('courseRecordIframe').contentWindow;
            courseRecordIframe.print();
        }
    },

    // getCaseHistoryPath: function() {
    //     var path = '/templates/' + templates + '/adm-patient-case-history.html';
    //     return path;
    // },

    // getcourseRecordPath: function() {
    //     var path = '/templates/' + templates + '/adm-patient-case-history-course-record.html';
    //     return path;
    // }
});