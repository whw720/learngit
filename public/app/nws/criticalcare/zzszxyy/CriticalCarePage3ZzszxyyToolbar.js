/**
 * 功能说明: 特护单工具栏
 * @author: chm
 */
Ext.define('com.dfsoft.icu.nws.criticalcare.zzszxyy.CriticalCarePage3ZzszxyyToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    height: 35,
    border: "0 0 1 0",
    margin: "-1 0 0 0",
    constructor: function(config) {
        this.criticalCarePage3Panel = null; // 特护单面板，由参数传入

        Ext.apply(this, config);
        var proxy = this;

        //this.cookieCol = new Ext.state.CookieProvider();
        //Ext.state.Manager.setProvider(proxy.cookieCol);
  /*      if(proxy.cookieCol.get('pageColumn')==null){
            proxy.cookieCol.set('pageColumn','a3');
        }*/
        //数据期间类型
        /*this.dateRadioGroup = new Ext.form.RadioGroup({
            fieldLabel: '纸张选择',
            labelWidth: 58,
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
        });*/
        //开始日期
      /*  this.beginDatefield = new Ext.form.field.Date({
            width: 220,
            format: 'Y-m-d',
            labelAlign: 'right',
            fieldLabel: '查询日期',
            value:proxy.patientInfo.inTime==undefined?new Date():proxy.patientInfo.inTime
        });*/

        //得到开始时间
     /*   this.getBeginDateTime = function() {
            var beginDate = proxy.beginDatefield.getValue();
            if (beginDate==null) {
                Ext.MessageBox.alert('提示', '请选择查询日期！');
                return null;
            }
            return beginDate;
        };*/
        //刷新
        this.refreshButton = new Ext.button.Button({
            iconCls: 'refresh-button',
            tooltip:'查询',
            handler: function() {
                if (proxy.beginTime==null) {
                    return;
                }
                proxy.printButton.setDisabled(true);
                var urlParam = "?registerId=" + proxy.criticalCarePage3Panel.patientInfo.REGISTER_ID +
                    "&startTime=" + proxy.beginTime+
                    "&endTime=" + proxy.endTime
                    "&webRoot=" + webRoot +
                    "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                    "&criticalCarePage3ToolbarId=" + proxy.criticalCarePage3Panel.criticalCarePage3Toolbar.getId();


                proxy.criticalCarePage3Panel.iframePanel.iframe.src
                    = '/templates/zzszxyy/criticalcare/CriticalCarePage3A4.html' + urlParam;
                proxy.criticalCarePage3Panel.loadMask.show();
                proxy.criticalCarePage3Panel.iframePanel.iframe.contentWindow.location.reload();

            }
        });

        //打印
        this.printButton = new Ext.button.Button({
            iconCls: 'print-button',
            tooltip:'打印',
            handler: function() {
                var beginDateTime = proxy.beginTime;
                if (beginDateTime==null) {
                    return;
                }
                proxy.criticalCarePage3Panel.iframePanel.iframe.contentWindow.print();
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
                var iframeA4 = document.getElementById('iframePage3A4Print');
                if(iframeA4){
                    iframeA4.contentWindow.print();
                }
            }
        });
        /*this.page3Button = new Ext.button.Button({
          //  iconCls: 'consent-button',
            text:'显示第3页',
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
        });*/
        //导出
       /* this.exportButton = new Ext.button.Button({
            iconCls: 'export-button',
            handler: function() {
                alert('导出特护单');
            }
        });*/
        this.loadA4=function(){
            var iframeA4 = document.getElementById('iframePage3A4Print');
            if (!iframeA4) {
                iframeA4 = document.createElement("iframe");
                iframeA4.id = 'iframeA4Print';
                iframeA4.width = '0px';
                iframeA4.height = '0px';
                iframeA4.frameborder = 'no';
                var urlParam = "?registerId=" + proxy.criticalCarePage3Panel.patientInfo.REGISTER_ID +
                    "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' 07:00' +
                    "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' 06:59') +
                    "&webRoot=" + webRoot +
                    "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                    "&criticalCarePage3ToolbarId=" + proxy.criticalCarePage3Panel.criticalCarePage3Toolbar.getId();

                document.body.appendChild(iframeA4);
                /*iframeA4.onload = function () {
                    setTimeout(function () {
                        iframeA4.contentWindow.print();
                    }, 1000);
                };*/
                iframeA4.src = '/templates/zzszxyy/criticalcare/CriticalCareA4.html' + urlParam;
            } else {
                var urlParam = "?registerId=" + proxy.criticalCarePage3Panel.patientInfo.REGISTER_ID +
                    "&startTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime()), 'Y-m-d') + ' 07:00' +
                    "&endTime=" + Ext.Date.format(new Date(proxy.getBeginDateTime().getTime() + 24 * 60 * 60 * 1000), 'Y-m-d' + ' 06:59') +
                    "&webRoot=" + webRoot +
                    "&internum=" + (proxy.patientInfo.CARE_INTERVAL / proxy.patientInfo.CARE_FREQUENCY / 60) +
                    "&criticalCarePage3ToolbarId=" + proxy.criticalCarePage3Panel.criticalCarePage3Toolbar.getId();

                iframeA4.src = '/templates/zzszxyy/criticalcare/CriticalCareA4.html' + urlParam;
            }
        }

        this.callParent([{
            items: ['->',
            proxy.refreshButton,'-',  proxy.printButton],
            listeners : {
                afterRender: function(component, eOpts) {
                    //设置按钮状态
         /*           if(proxy.cookieCol.get('pageColumn')=='a3'){
                        proxy.dateRadioGroup.items.items[0].setValue(true);
                    }else{
                        proxy.dateRadioGroup.items.items[1].setValue(true);
                    }*/

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
