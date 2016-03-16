/**
 * 功能说明: 特护单panel
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.CriticalCarePanel', {
    extend: 'Ext.Panel',
    requires: ['com.dfsoft.icu.nws.criticalcare.CriticalCareToolbar',
    'com.dfsoft.icu.nws.criticalcare.CriticalCareStore',
    'com.dfsoft.icu.nws.criticalcare.CriticalCarePagingToolbar'],

    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;
        proxy.setPatientInfo = function(patientInfo){
            proxy.patientInfo = patientInfo;
            proxy.criticalCareToolbar.patientInfo = patientInfo;
            proxy.criticalCareToolbar.refreshButton.handler();
        }

        Ext.util.CSS.swapStyleSheet('criticalcare.css', '/app/nws/criticalcare/css/criticalcare.css');

        // 工具条
        this.criticalCareToolbar = new com.dfsoft.icu.nws.criticalcare.CriticalCareToolbar({
            region: 'north',
            criticalCarePanel: proxy,
            patientInfo : this.patientInfo
        });

        // store
        this.criticalCareStore = new com.dfsoft.icu.nws.criticalcare.CriticalCareStore({
            criticalCarePanel: proxy,
            criticalCareToolbar : this.criticalCareToolbar,
            patientInfo : this.patientInfo
        });

        // 分页条
        this.criticalCarePagingToolbar = new com.dfsoft.icu.nws.criticalcare.CriticalCarePagingToolbar({
            store: proxy.criticalCareStore
        });

        var urlParam = "?registerId=" + proxy.patientInfo.REGISTER_ID+
            "&startTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime()), 'Y-m-d H:i:s') +
            "&endTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getEndDateTime()), 'Y-m-d H:i:s')+
            "&criticalCarePagingToolbarId="+this.criticalCarePagingToolbar.getId()+
            "&criticalCareToolbarId="+this.criticalCareToolbar.getId();

        this.iframePanel = new Ext.Panel({
            xtype: 'panel',
            region: 'center',

            html: '<iframe src="/templates/standard/criticalcare/CriticalCare.html'+urlParam+'"' +
                ' style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        });


        //创建遮罩效果
        this.loadMask = new Ext.LoadMask(proxy.iframePanel, {
            msg: "数据加载中..."
        });

        var first = true;
        this.callParent([{
            closable: true,
            title: '特护单',
            layout: {
                type: 'border',
                padding: '0'
            },
            items: [this.criticalCareToolbar, this.iframePanel],
            bbar: proxy.criticalCarePagingToolbar,
            listeners: {
                show: function(component, eOpts) {
                    if (first==true) {
                        proxy.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        first = false;
                    }
                },
                afterrender: function(panel, eOpts) {
                    //定义iframe对象，不再固定id调用
                    proxy.iframePanel.iframe = getCmpIframe(proxy.iframePanel.el.dom);
                    proxy.iframePanel.iframe.onload = function() {

                    }
                }
            }
        }]);

    }
});
