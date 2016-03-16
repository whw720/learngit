/**
 * 功能说明: 体温单panel
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePanel', {
    extend: 'Ext.Panel',
    requires: ['com.dfsoft.icu.nws.bodytemperature.BodyTemperatureToolbar',
        'com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePagingToolbar',
        'com.dfsoft.icu.nws.bodytemperature.BodyTemperatureStore'],
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        Ext.util.CSS.swapStyleSheet('bodytemperature.css', '/app/nws/bodytemperature/css/bodytemperature.css');

        this.bodyTemperatureToolbar = new com.dfsoft.icu.nws.bodytemperature.BodyTemperatureToolbar({
            region: 'north',
            bodyTemperaturePanel: proxy
        });

        this.bodyTemperatureStore = new com.dfsoft.icu.nws.bodytemperature.BodyTemperatureStore({
            id: 'bodyTemperatureStore' + (new Date()).getTime(),
            bodyTemperaturePanel: proxy
        });

        this.bodyTemperaturePagingToolbar = new com.dfsoft.icu.nws.bodytemperature.BodyTemperaturePagingToolbar({
            store: proxy.bodyTemperatureStore
        });

        var urlParam = "?bodyTemperaturePagingToolbarId=" + proxy.bodyTemperaturePagingToolbar.getId()
            + "&bodyTemperaturePanelId=" + proxy.getId() + "&bodyTemperatureStoreId=" + proxy.bodyTemperatureStore.storeId;
        this.iframePanel = new Ext.Panel({
            xtype: 'panel',
            region: 'center',
            html: '<iframe src="/templates/standard/bodytemperature/BodyTemperature.html' + urlParam + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        });

        //创建遮罩效果
        this.loadMask = new Ext.LoadMask(proxy.iframePanel, {
            msg: "数据加载中..."
        });

        //更换病人后触发
        this.setPatientInfo = function(patientInfo) {
            proxy.patientInfo = patientInfo;
            this.bodyTemperatureToolbar.refreshButton.handler();
        };

        var first = true;
        this.callParent([{
            closable: true,
            title: '体温单',
            layout: {
                type: 'border',
                padding: 0
            },
            items: [proxy.bodyTemperatureToolbar, proxy.iframePanel],
            bbar: proxy.bodyTemperaturePagingToolbar,
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
