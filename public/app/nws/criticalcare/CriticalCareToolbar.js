/**
 * 功能说明: 特护单工具栏
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.CriticalCareToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['com.dfsoft.icu.nws.HourMinuteSpinner'],
    height: 35,
    border: "0 0 1 0",
    margin: "-1 0 0 0",
    constructor: function(config) {
        this.criticalCarePanel = null; // 特护单面板，由参数传入

        Ext.apply(this, config);
        var proxy = this;

        //开始日期
        this.beginDatefield = new Ext.form.field.Date({
            width: 220,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '从',
            value: new Date()/*,
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    proxy.endDatefield.setValue(newValue);
                }
            }*/
        });

        //开始小时
        this.beginHourSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 23,
            value: 0
        });

        //开始分钟
        this.beginMinuteSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 59,
            value: 0
        });

        //结束日期
        this.endDatefield = new Ext.form.field.Date({
            width: 135,
            labelWidth: 15,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '到',
            value: new Date()/*,
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    proxy.beginDatefield.setValue(newValue);
                }
            }*/
        });

        //结束小时
        this.endHourSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 23,
            value: 23
        });

        //结束分钟
        this.endMinuteSpinner = new com.dfsoft.icu.nws.HourMinuteSpinner({
            maxValue: 59,
            value: 59
        });

        //得到开始时间
        this.getBeginDateTime = function() {
            var beginDate = proxy.beginDatefield.getValue();
            var beginHour = proxy.beginHourSpinner.getValue();
            var beginMinute = proxy.beginMinuteSpinner.getValue();
            if (beginDate==null) {
                Ext.MessageBox.alert('提示', '请选择开始日期！');
                return null;
            }
            if (beginHour==null) {
                Ext.MessageBox.alert('提示', '请选择开始时间！');
                return null;
            }
            if (beginMinute==null) {
                Ext.MessageBox.alert('提示', '请选择开始时间！');
                return null;
            }
            beginDate.setHours(beginHour);
            beginDate.setMinutes(beginMinute);
            return beginDate;
        }

        //得到开始时间
        this.getEndDateTime = function() {
            var endDate = proxy.endDatefield.getValue();
            var endHour = proxy.endHourSpinner.getValue();
            var endMinute = proxy.endMinuteSpinner.getValue();
            if (endDate==null) {
                Ext.MessageBox.alert('提示', '请选择结束日期！');
                return null;
            }
            if (endHour==null) {
                Ext.MessageBox.alert('提示', '请选择结束时间！');
                return null;
            }
            if (endMinute==null) {
                Ext.MessageBox.alert('提示', '请选择结束时间！');
                return null;
            }
            endDate.setHours(endHour);
            endDate.setMinutes(endMinute);
            return endDate;
        }

        //刷新
        this.refreshButton = new Ext.button.Button({
            iconCls: 'refresh-button',
            handler: function() {
                var beginDateTime = proxy.getBeginDateTime();
                var endDateTime = proxy.getEndDateTime();
                if (beginDateTime==null || endDateTime==null) {
                    return;
                }
                if (beginDateTime > endDateTime) {
                    Ext.MessageBox.alert('提示', '开始时间不能大于结束时间！');
                    return;
                }

                //遮罩效果
                proxy.criticalCarePanel.loadMask.show();

                //重新加载特护单
                var urlParam = "?registerId=" + proxy.criticalCarePanel.patientInfo.REGISTER_ID+
                    "&startTime="+Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d H:i:s') +
                    "&endTime="+Ext.Date.format(new Date(proxy.getEndDateTime()), 'Y-m-d H:i:s')+
                    "&criticalCarePagingToolbarId="+proxy.criticalCarePanel.criticalCarePagingToolbar.getId()+
                    "&criticalCareToolbarId="+proxy.criticalCarePanel.criticalCareToolbar.getId();

                proxy.criticalCarePanel.iframePanel.iframe.src
                    = '/templates/standard/criticalcare/CriticalCareA4.html'+urlParam;
//                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.location.reload();
            }
        });

        //打印
        this.printButton = new Ext.button.Button({
            iconCls: 'print-button',
            handler: function() {
                var beginDateTime = proxy.getBeginDateTime();
                var endDateTime = proxy.getEndDateTime();
                if (beginDateTime==null || endDateTime==null) {
                    return;
                }
                if (beginDateTime > endDateTime) {
                    Ext.MessageBox.alert('提示', '开始时间不能大于结束时间！');
                    return;
                }

                var bodyElement = proxy.criticalCarePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "inherit";
                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.criticalCare1.onresize();

                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.print();

                var bodyElement = proxy.criticalCarePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "auto";
                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.criticalCare1.onresize();
            }
        });

        //导出
        this.exportButton = new Ext.button.Button({
            iconCls: 'export-button',
            handler: function() {
                alert('导出特护单');
            }
        });

        this.callParent([{
            items: ['->', {
                xtype		: 'container',
                layout		: 'hbox',

                items	    : [this.beginDatefield, this.beginHourSpinner, this.beginMinuteSpinner]
            },{
                xtype		: 'container',
                layout		: 'hbox',

                items	    : [this.endDatefield,this.endHourSpinner, this.endMinuteSpinner]
            },
                proxy.refreshButton, '-', proxy.printButton, this.exportButton]
        }]);
    }
});
