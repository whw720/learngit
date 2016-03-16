/**
 * 功能说明: 体温单工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.bodytemperature.BodyTemperatureToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['com.dfsoft.icu.nws.HourMinuteSpinner','com.dfsoft.icu.nws.bodytemperature.BodyTemperatureSendHis'],
    height: 35,
    border: "0 0 1 0",
    margin: "-1 0 0 0",
    constructor: function(config) {
        this.bodyTemperaturePanel = null;//体温单面板，由参数传入

        Ext.apply(this, config);
        var proxy = this;
        this.syncWindow=Ext.create('com.dfsoft.icu.nws.bodytemperature.BodyTemperatureSendHis',{
        });
        this.refreshButton = new Ext.button.Button({
            iconCls: 'refresh-button',
            handler: function() {
                //重新获取病人信息
                proxy.bodyTemperaturePanel.patientInfo = proxy.bodyTemperaturePanel.parentPanel.bedPanel.patientInfo;
                //遮罩效果
                proxy.bodyTemperaturePanel.loadMask.show();
                //重新加载监控中心
                proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.location.reload();
            }
        });
        //刷新
        this.syncButton = new Ext.button.Button({
           /* iconCls: 'refresh-button',*/
            text:'同步',
            handler: function() {
                //重新获取病人信息
                proxy.bodyTemperaturePanel.patientInfo = proxy.bodyTemperaturePanel.parentPanel.bedPanel.patientInfo;
                proxy.syncWindow.patientInfo=proxy.bodyTemperaturePanel.parentPanel.bedPanel.patientInfo;
                proxy.syncWindow.show();
            }
        });

        //打印
        this.printButton = new Ext.button.Button({
            iconCls: 'print-button',
            handler: function() {
                var bodyElement = proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "inherit";
                proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.bodyTemperature.onresize();

                proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.print();

                var bodyElement = proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "auto";
                proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.bodyTemperature.onresize();
            }
        });

        this.callParent([{
            items: ['->',
                this. syncButton, '-', proxy.refreshButton, '-', proxy.printButton]
        }]);
    }
});
