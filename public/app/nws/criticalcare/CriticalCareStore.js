/**
 * 功能说明: 特护单分页Store，只用于分页，不提供具体数据
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.CriticalCareStore', {
    extend: 'Ext.data.Store',
    fields: ['id'],

    pageSize: 25,
    proxy: {
        type: 'localstorage',
        url: '',//webRoot + '/nws/criticalcare/find/list',
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
                    proxy.criticalCarePanel.loadMask.show();
                    // 分页查询数据
                    proxy.criticalCarePanel.iframePanel.iframe.contentWindow.criticalcare.findPageCriticalCare(operation.start, operation.limit);
                },
                load: function(store, records, successful, eOpts) {
                    store.loadRawData({
                        success: true,
                        totalCount: proxy.currTotalCount, //总记录数
                        data: [{},{},{},{},{}] //每页5条记录，必须有值，否则page控件无效
                    });
                }
            }
        }]);


        //加载分页信息
        this.loadPageData = function(totalCount) {
            proxy.currTotalCount = totalCount;
            proxy.loadRawData({
                success: true,
                totalCount: totalCount, //总记录数
                data: [{},{},{},{},{}] //每页5条记录，必须有值，否则page控件无效
            });
        }

    }
});