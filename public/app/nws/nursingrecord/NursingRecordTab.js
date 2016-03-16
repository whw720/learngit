/**
 * 定义护理记录面板
 *
 * @author chm
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.NursingRecordTab',{
    extend 	: 'Ext.tab.Panel',
    alias	: 'widget.nursingrecordtab',

    requires: ['com.dfsoft.icu.nws.nursingrecord.ConventionalGridPanel',
            'com.dfsoft.icu.nws.nursingrecord.PipelineGrid',
            'com.dfsoft.icu.nws.nursingrecord.PipelineForm'],

    initComponent : function(){
        Ext.util.CSS.swapStyleSheet('nursingrecord.css', '/app/nws/nursingrecord/css/nursingrecord.css');
        var proxy = this;

        Ext.apply(this, {
            title       : '护理记录',
            region 		: 'center',
            activeTab	: 0,
            tabPosition : 'bottom',
            plain       : true,
            closable    : true,

            items:[]
        });

        this.on('render', function(_this, eOpts){
            if(proxy.patientInfo == null){
                proxy.removeAll(false);
            }else{
                proxy.add({
                    xtype	: 'conventionalgridpanel',
                    patientInfo : this.patientInfo,
                    title	: '常规',
                    nwsApp : proxy.nwsApp
                },{
                    xtype	: 'pipelineform',
                    patientInfo : this.patientInfo,
                    autoScroll : true,
                    title	: '管道',
                    layout 	: 'border',
                    nwsApp : proxy.nwsApp
                });
                proxy.setActiveTab(0);
            }
        });
        //更换病人
        proxy.setPatientInfo = function(patientInfo){
            if(proxy.patientInfo == null){
                proxy.patientInfo = patientInfo;
                proxy.add({
                    xtype	: 'conventionalgridpanel',
                    patientInfo : patientInfo,
                    title	: '常规',
                    nwsApp : proxy.nwsApp
                },{
                    xtype	: 'pipelineform',
                    patientInfo : patientInfo,
                    autoScroll : true,
                    title	: '管道',
                    layout 	: 'border',
                    nwsApp : proxy.nwsApp
                });
                proxy.setActiveTab(0);
            }

            var gridPanel = proxy.items.items[0];
            var pipelineForm = proxy.items.items[1];
            // 刷新常规tab
            gridPanel.patientInfo = patientInfo;
            gridPanel.conventionalToolbar.refreshButton.handler(null,null,true);
            gridPanel.reConnectSocket();
            // 刷新管道tab
            pipelineForm.patientInfo = patientInfo;
            pipelineForm.fireEvent('beforerender', pipelineForm);
            pipelineForm.down('chart').store.patientInfo = patientInfo;
            pipelineForm.down('chart').store.load();
        }

        this.callParent(arguments);
    }
});