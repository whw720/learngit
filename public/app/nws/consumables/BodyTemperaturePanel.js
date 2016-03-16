/**
 * 功能说明: 体温单panel
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.consumables.BodyTemperaturePanel', {
    extend: 'Ext.Panel',
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        Ext.util.CSS.swapStyleSheet('bodytemperature.css', '/app/nws/bodytemperature/css/bodytemperature.css');

        this.iframePanel = new Ext.Panel({
            xtype: 'panel',
            region: 'center',
            //html: '<iframe src="/templates/standard/bodytemperature/BodyTemperature.html' + urlParam + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
            html: '<iframe src="/templates/standard/consumables_use.html?register_id=111&time=2014" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        });

        //更换病人后触发
        this.setPatientInfo = function(patientInfo) {
            proxy.patientInfo = patientInfo;
        };

        var first = true;
        this.callParent([{
            closable: true,
            title: '一次性材料',
            layout: {
                type: 'border',
                padding: 0
            },
            items: [proxy.iframePanel],
            listeners: {
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
