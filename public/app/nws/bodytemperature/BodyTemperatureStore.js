/**
 * 功能说明: 体温单分页Store，只用于分页，不提供具体数据
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.bodytemperature.BodyTemperatureStore', {
    extend: 'Ext.data.Store',
    fields: ['id'],
//    autoLoad:  true,
    pageSize: 7,
    proxy: {
        type: 'localstorage',
        url: '',//webRoot + '/nws/bodytemperature/findpage',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    },
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        //是否是第一次执行beforeload事件
        this.isFirstBeforeLoad = true;

        this.callParent([{
            listeners: {
                //对于手工loadRawData，第一次不会执行beforeLoad
                beforeload: function(store, operation, eOpts) {
                    if (store.getCount()==0 || proxy.isFirstBeforeLoad==true) {
                        proxy.isFirstBeforeLoad = false;
                        return;
                    }
                    proxy.bodyTemperaturePanel.loadMask.show();
                    proxy.bodyTemperaturePanel.iframePanel.iframe.contentWindow.bodyTemperature.findPageBodyTemperature(operation.start, operation.limit);
                },
                load: function(store, records, successful, eOpts) {
                    store.loadRawData({
                        success: true,
                        totalCount: proxy.currTotalCount, //总记录数，以住院天数为总记录数，对于未出院病人，结束时间为当前时间.
                        data: [{},{},{},{},{},{},{}] //每页7条记录，必须有值，否则page控件无效
                    });
                }
            }
        }]);


        //加载分页信息
        this.loadPageData = function(totalCount) {
            proxy.currTotalCount = totalCount;
            proxy.loadRawData({
                success: true,
                totalCount: totalCount, //总记录数，以住院天数为总记录数，对于未出院病人，结束时间为当前时间.
                data: [{},{},{},{},{},{},{}] //每页7条记录，必须有值，否则page控件无效
            });
        }

    }
});