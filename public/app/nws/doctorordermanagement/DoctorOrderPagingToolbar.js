/**
 * 重构代码，将 DoctorOrderCenter 里面的pagingToolbar抽取出来，做为一个单独的文件
 * Created by whw on 2015-2-7.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderPagingToolbar', {
    extend: 'Ext.PagingToolbar',
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;
        this.callParent([{
            store: proxy.store,
            displayMsg: '共{2}条',
            displayInfo: true,
            emptyMsg: '无数据',
            style: 'border-top: 1px solid #157fcc !important',
            items: [  '->', '<span style="font-size:13px;">执行状态:</span> ', {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-black.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '未执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-red.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '开始执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-blue.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '完成执行'
            }, {
                xtype: 'label',
                html: '<img src="/app/dws/doctorordermanagement/images/circle-green.png" />',
                width: '10px'}, {
                xtype: 'label',
                text: '交班执行'
            }
            ]

        }]);
    }

});