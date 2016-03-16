/**
 * 功能说明: 特护单工具栏
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCareZzszxyyToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    height: 35,
    border: "0 0 1 0",
    margin: "-1 0 0 0",
    constructor: function(config) {
        this.criticalCarePanel = null; // 特护单面板，由参数传入

        Ext.apply(this, config);
        var proxy = this;
        proxy.updatePrintInfo = function () {
            var proxy = this;
            Ext.Ajax.request({
                url: webRoot + '/sys/printControl',
                method: 'get',
                async: false,
                params: {
                    REGISTER_ID: proxy.criticalCarePanel.patientInfo.REGISTER_ID,
                    CARE_DATE: Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d')
                },
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    var htmlObj = document.getElementById(proxy.printButton.id);
                    var u;
                    try {
                        u = userInfo;
                    } catch (e) {
                        Ext.QuickTips.init();
                        u = parent.userInfo;
                    }
                    htmlObj = htmlObj || document.getElementById(proxy.printButton.id);
                    if (result.count >= 1 && '1b0a03d0b94811e3917800271396a820,3dba83a1089d11e396021b9f5cdf5941'.indexOf(u.roleId) < 0) {
                        var tip = "可打印" + result.count + "次" + (result.printInfo.length > 0 ? ",<br>已打印" + result.printInfo.length + "次" : '');
                        if (htmlObj) {
                            htmlObj.setAttribute("data-qtip", tip);
                        } else {
                            proxy.printButton.tooltip = tip;
                        }
                    }
                    proxy.printInfo = result.printInfo;
                    proxy.printCount = result.count;
                }
            });
        }
        this.cookieCol = new Ext.state.CookieProvider();
        Ext.state.Manager.setProvider(proxy.cookieCol);
        if(proxy.cookieCol.get('pageColumn')==null){
            proxy.cookieCol.set('pageColumn','a4');
        }
        //数据期间类型
        this.dateRadioGroup = new Ext.form.RadioGroup({
            fieldLabel: '纸张选择',
            labelWidth: 58,
            hidden:true,
            columns: [50, 80],
            items: [
                { boxLabel: 'A3', name: 'careRadio', inputValue: 'a3'},
                { boxLabel: 'A4', name: 'careRadio', inputValue: 'a4'}
            ],
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    proxy.cookieCol.set('pageColumn',newValue['careRadio']);
                    //proxy.dateRadioGroupChange(newValue[proxy.nwsApp.id+'careRadio']);
                }
            }
        });
        //开始日期
        this.beginDatefield = new Ext.form.field.Date({
            width: 220,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '查询日期',
            value:proxy.patientInfo.inTime==undefined?new Date():proxy.patientInfo.inTime
        });

        //得到开始时间
        this.getBeginDateTime = function() {
            var beginDate = proxy.beginDatefield.getValue();
            if (beginDate==null) {
                Ext.MessageBox.alert('提示', '请选择查询日期！');
                return null;
            }
            return beginDate;
        };
        //刷新
        this.refreshButton = new Ext.button.Button({
            iconCls: 'refresh-button',
            tooltip:'查询',
            handler: function() {
                proxy.criticalCarePanel.criticalCareToolbar.printButton.setDisabled(true);
                proxy.criticalCarePanel.loadMask.show();
                var beginDateTime = proxy.getBeginDateTime();
                if (beginDateTime==null) {
                    return;
                }
                if(proxy.cookieCol.get('pageColumn')=='a3') {
                    //遮罩效果
                    proxy.criticalCarePanel.loadMask.show();

                    //重新加载特护单
                    var urlParam = "?registerId=" + proxy.criticalCarePanel.patientInfo.REGISTER_ID +
                        "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' '+proxy.criticalCarePanel.getBeginTime() +
                        "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' '+proxy.criticalCarePanel.getEndTime()) +
                        "&webRoot=" + webRoot +
                        "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                        "&criticalCareToolbarId=" + proxy.criticalCarePanel.criticalCareToolbar.getId();

                    /*var urlParam = "?startTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime()), 'Y-m-d H:i:s') +
                     "&endTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getEndDateTime()), 'Y-m-d H:i:s')+
                     "&registerId=" + proxy.patientInfo.REGISTER_ID+
                     "&webRoot="+webRoot+
                     "&criticalCarePagingToolbarId="+this.criticalCarePagingToolbar.getId()+
                     "&criticalCareToolbarId="+this.criticalCareToolbar.getId();*/
                    proxy.criticalCarePanel.iframePanel.iframe.src
                        = '/templates/'+templates+'/criticalcare/CriticalCare.html' + urlParam;
                }else{
                    //重新加载特护单
                    var urlParam = "?registerId=" + proxy.criticalCarePanel.patientInfo.REGISTER_ID +
                        "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' '+proxy.criticalCarePanel.getBeginTime() +
                        "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' '+proxy.criticalCarePanel.getEndTime()) +
                        "&webRoot=" + webRoot +
                        "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                        "&criticalCareToolbarId=" + proxy.criticalCarePanel.criticalCareToolbar.getId();

                    /*var urlParam = "?startTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getBeginDateTime()), 'Y-m-d H:i:s') +
                     "&endTime="+Ext.Date.format(new Date(this.criticalCareToolbar.getEndDateTime()), 'Y-m-d H:i:s')+
                     "&registerId=" + proxy.patientInfo.REGISTER_ID+
                     "&webRoot="+webRoot+
                     "&criticalCarePagingToolbarId="+this.criticalCarePagingToolbar.getId()+
                     "&criticalCareToolbarId="+this.criticalCareToolbar.getId();*/
                    proxy.criticalCarePanel.iframePanel.iframe.src
                        = '/templates/'+templates+'/criticalcare/CriticalCareA4.html' + urlParam;
                    proxy.updatePrintInfo();
                }
//                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.location.reload();

                //proxy.loadA4();
            }
        });

		//打印特护单
		this.printCriticalCare = function() {
		        var bodyElement = proxy.criticalCarePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "inherit";
                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.criticalCare1.onresize();

                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.print();

                var bodyElement = proxy.criticalCarePanel.iframePanel.iframe.contentWindow.document.body;
                bodyElement.style.margin = "auto";
                proxy.criticalCarePanel.iframePanel.iframe.contentWindow.criticalCare1.onresize();
		}

        //打印
        this.printButton = new Ext.button.Button({
            iconCls: 'print-button',
            disabled: true,
            //tooltip:'打印',
            tooltip:'打印',
            handler: function() {
                var beginDateTime = proxy.getBeginDateTime();
                if (beginDateTime==null) {
                    return;
                }
                var u;
                try {
                    u = userInfo;
                } catch (e) {
                    Ext.QuickTips.init();
                    u = parent.userInfo;
                }
                if (proxy.printCount >= 1 && '1b0a03d0b94811e3917800271396a820,3dba83a1089d11e396021b9f5cdf5941'.indexOf(u.roleId) < 0) {
                    if (proxy.printCount - proxy.printInfo.length > 0) {
                        Ext.Ajax.request({
                            url: webRoot + '/sys/printControl',
                            method: 'POST',
                            params: {
                                REGISTER_ID: proxy.criticalCarePanel.patientInfo.REGISTER_ID,
                                USER_ID: u.userId,
                                CARE_DATE: Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d')
                            },
                            success: function (response) {
                            }
                        });
                        proxy.printCriticalCare();
                        proxy.updatePrintInfo();
                    } else {
                        proxy.printWindow = Ext.create('com.dfsoft.icu.nws.criticalcare.zzszxyy.PrintInfoWindow', {
                            title: '打印日志',
                            height: 300,
                            width: 420,
                            closable: true,
                            constrain: false, // 限制拖动范围
                            modal: true,
                            border: false,
                            layout: 'fit',
                            fitToFrame: true,
                            resizable: false,
                            printInfo: proxy.printInfo
                        });
                        proxy.printWindow.show();
                    }
                    ;
                } else {
                    proxy.printCriticalCare();
                }
                ;

            },
            listeners: {
                beforerender: function () {
                    proxy.updatePrintInfo();
                }
            }
        });
        //弹出窗口
        this.openButton = new Ext.button.Button({
            iconCls: 'consent-button',
            tooltip: '打印到A4纸',
            handler: function () {
                var beginDateTime = proxy.getBeginDateTime();
                if (beginDateTime == null) {
                    return;
                }
                var iframeA4 = document.getElementById('iframeA4Print');
                if(iframeA4){
                    iframeA4.contentWindow.print();
                }
            }
        });

        //导出
        this.exportButton = new Ext.button.Button({
            iconCls: 'export-button',
            handler: function() {
                alert('导出特护单');
            }
        });
        this.loadA4=function(){
            var iframeA4 = document.getElementById('iframeA4Print');
            if (!iframeA4) {
                iframeA4 = document.createElement("iframe");
                iframeA4.id = 'iframeA4Print';
                iframeA4.width = '0px';
                iframeA4.height = '0px';
                iframeA4.frameborder = 'no';
                var urlParam = "?registerId=" + proxy.criticalCarePanel.patientInfo.REGISTER_ID +
                    "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' 07:00' +
                    "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' 06:00') +
                    "&webRoot=" + webRoot +
                    "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                    "&criticalCareToolbarId=" + proxy.criticalCarePanel.criticalCareToolbar.getId();

                document.body.appendChild(iframeA4);
                /*iframeA4.onload = function () {
                 setTimeout(function () {
                 iframeA4.contentWindow.print();
                 }, 1000);
                 };*/
                iframeA4.src = '/templates/zzszxyy/criticalcare/CriticalCareA4.html' + urlParam;
            } else {
                var urlParam = "?registerId=" + proxy.criticalCarePanel.patientInfo.REGISTER_ID +
                    "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' 07:00' +
                    "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' 06:00') +
                    "&webRoot=" + webRoot +
                    "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                    "&criticalCareToolbarId=" + proxy.criticalCarePanel.criticalCareToolbar.getId();

                iframeA4.src = '/templates/zzszxyy/criticalcare/CriticalCareA4.html' + urlParam;
            }
        }

        this.callParent([{
            items: ['->', this.dateRadioGroup,{
                xtype		: 'container',
                layout		: 'hbox',
                items	    : [this.beginDatefield]
            },
                proxy.refreshButton, '-', proxy.printButton],
            listeners : {
                afterRender: function(component, eOpts) {
                    //设置按钮状态
                    if(proxy.cookieCol.get('pageColumn')=='a3'){
                        proxy.dateRadioGroup.items.items[0].setValue(true);
                    }else{
                        proxy.dateRadioGroup.items.items[1].setValue(true);
                    }

                    /*if (proxy.initSechedulingTypeName=="全天") {
                     proxy.dateRadioGroup.items.items[1].setValue(true);
                     } else {
                     proxy.dateRadioGroup.items.items[2].setValue(true);
                     }*/
                }
            }
        }]);
    }
});
