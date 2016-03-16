/**
 * 市中心医院特护单
 * Created by whw on 14-6-9.
 */
Ext.Loader.setPath({
    'com.dfsoft.icu.nws.criticalcare.zzszxyy': '/app/nws/criticalcare/zzszxyy'
});
Ext.define('com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCarePage3ZzszxyyPanel', {
    extend: 'Ext.Panel',

    requires: ['com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCarePage3ZzszxyyToolbar'],

    constructor: function(config) {

        Ext.apply(this, config);
        var proxy = this;
        proxy.setPatientInfo = function(patientInfo){
            proxy.patientInfo = patientInfo;
            proxy.criticalCarePage3Toolbar.patientInfo = patientInfo;
            proxy.criticalCarePage3Toolbar.refreshButton.handler();
        }

        Ext.util.CSS.swapStyleSheet('criticalcare.css', '/app/nws/criticalcare/css/criticalcare.css');

        // 工具条
        this.criticalCarePage3Toolbar = new com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCarePage3ZzszxyyToolbar({
            region: 'north',
            criticalCarePage3Panel: proxy,
            beginTime:Ext.Date.format(new Date(this.beginDateTime), 'Y-m-d')+' 07:00',
            endTime:Ext.Date.format(new Date(this.beginDateTime.getTime()+24 * 60 * 60 * 1000), 'Y-m-d')+' 06:59',
            patientInfo : this.patientInfo,
            parentPanel:proxy.parentPanel
        });
            var urlParam = "?startTime="+Ext.Date.format(new Date(this.beginDateTime), 'Y-m-d')+' 07:00' +
                "&endTime="+Ext.Date.format(new Date(this.beginDateTime.getTime()+24 * 60 * 60 * 1000), 'Y-m-d')+' 06:59'+
                "&registerId=" + proxy.patientInfo.REGISTER_ID+
                "&webRoot="+webRoot+
                "&internum="+(proxy.patientInfo.CARE_INTERVAL/proxy.patientInfo.CARE_FREQUENCY/60)+
                "&criticalCarePage3ToolbarId="+this.criticalCarePage3Toolbar.getId();

            this.iframePanel = new Ext.Panel({
                xtype: 'panel',
                region: 'center',

                html: '<iframe src="/templates/zzszxyy/criticalcare/CriticalCare_6.html'+urlParam+'"' +
                    ' style="width: 100%; height:100%;" frameborder="no"></iframe>'
            });
        //创建遮罩效果
        this.loadMask = new Ext.LoadMask(proxy.iframePanel, {
            msg: "数据加载中..."
        });

        var first = true;
        this.callParent([{
            region: 'center',
            layout: {
                type: 'border',
                padding: '0'
            },
            items: [this.criticalCarePage3Toolbar, this.iframePanel,this.iframeA4Panel],
            listeners: {
                show: function(component, eOpts) {
                    if (first==true) {
                        proxy.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        proxy.criticalCarePage3Toolbar.printButton.setDisabled(true);
                        first = false;
                    }
                },
                afterrender: function(panel, eOpts) {
                    //定义iframe对象，不再固定id调用
                    proxy.iframePanel.iframe = getCmpIframe(proxy.iframePanel.el.dom);
                    proxy.iframePanel.iframe.onload = function() {
                        //proxy.criticalCareToolbar.loadA4();
                    }
                }
            }
        }]);

    }
});