/**
 * 市中心医院特护单
 * Created by whw on 14-6-9.
 */
Ext.Loader.setPath({
    'com.dfsoft.icu.nws.criticalcare.zzszxyy': '/app/nws/criticalcare/zzszxyy'
});
Ext.define('com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyPanel', {
    extend: 'Ext.Panel',

    requires: ['com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyToolbar'],

    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;
        proxy.setPatientInfo = function(patientInfo){
            proxy.patientInfo = patientInfo;
            proxy.criticalCareToolbar.patientInfo = patientInfo;
            proxy.criticalCareToolbar.refreshButton.handler();
        }
        proxy.getBeginTime=function(){
            return globalBeginTime.substring(0,5);
        }
        proxy.getEndTime=function(){
            return globalEndTime.substring(0,5);
        }
        if(proxy.templates){
            templates=proxy.templates;
        }
        Ext.util.CSS.swapStyleSheet('criticalcare.css', '/app/nws/criticalcare/css/criticalcare.css');

        // 工具条
        this.criticalCareToolbar = new com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyToolbar({
            region: 'north',
            criticalCarePanel: proxy,
            patientInfo : this.patientInfo
        });
        if(this.criticalCareToolbar.cookieCol.get('pageColumn')=='a3'){
            var urlParam = "?startTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime()), 'Y-m-d')+' '+proxy.getBeginTime() +
                "&endTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime().getTime()+24 * 60 * 60 * 1000), 'Y-m-d')+' '+proxy.getEndTime()+
                "&registerId=" + proxy.patientInfo.REGISTER_ID+
                "&webRoot="+webRoot+
                "&internum="+(proxy.patientInfo.CARE_INTERVAL/proxy.patientInfo.CARE_FREQUENCY/60)+
                "&criticalCareToolbarId="+this.criticalCareToolbar.getId();


            this.iframePanel = new Ext.Panel({
                xtype: 'panel',
                region: 'center',

                html: '<iframe src="/templates/'+templates+'/criticalcare/CriticalCare.html'+urlParam+'"' +
                    ' style="width: 100%; height:100%;" frameborder=”no”></iframe>'
            });
        }else{
            var urlParam = "?startTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime()), 'Y-m-d')+' '+proxy.getBeginTime() +
                "&endTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime().getTime()+24 * 60 * 60 * 1000), 'Y-m-d')+' '+proxy.getEndTime()+
                "&registerId=" + proxy.patientInfo.REGISTER_ID+
                "&webRoot="+webRoot+
                "&internum="+(proxy.patientInfo.CARE_INTERVAL/proxy.patientInfo.CARE_FREQUENCY/60)+
                "&criticalCareToolbarId="+this.criticalCareToolbar.getId();

            this.iframePanel = new Ext.Panel({
                xtype: 'panel',
                region: 'center',

                html: '<iframe src="/templates/'+templates+'/criticalcare/CriticalCareA4.html'+urlParam+'"' +
                    ' style="width: 100%; height:100%;" frameborder=”no”></iframe>'
            });
        }



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
            items: [this.criticalCareToolbar, this.iframePanel,this.iframeA4Panel],
            listeners: {
                show: function(component, eOpts) {
                    if (first==true) {
                        proxy.loadMask.show();//只触发一次，避免最小化后最大化重复调用
                        proxy.criticalCareToolbar.printButton.setDisabled(true);
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