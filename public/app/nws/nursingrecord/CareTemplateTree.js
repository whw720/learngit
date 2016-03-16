/**
 * 定义变更明细树管理页面布局
 *
 * @author chm
 * @version 2013-9-26
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.CareTemplateTree', {
    extend	: 'Ext.tree.Panel',
    alias	: 'widget.caretemplatetree',

    //id : 'care_template_tree',
    rootVisible	: false,
    useArrows 	: true,
    border : true,
    margin  : '-1 0 -1 -1',


    initComponent : function() {
        var me = this;

        this.store=Ext.create('Ext.data.TreeStore', {
            fields : ['id', 'text', 'type', 'content','CONCLUSION_TYPE'],
            autoLoad : true,
            proxy	: {
                type: 'ajax',
                url: webRoot + '/icu/nursingRecord/conventional/caretemplate/all',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        this.buttonAdd = Ext.create('Ext.button.Button', {
            action : 'add_changedetail_button',
            tooltip : '套用',
            iconCls : 'icon-right',
            handler : function(btn) {
                var tree = btn.up('treepanel');
                var records = tree.getSelectionModel().getSelection();
                var record = records[0];
                me.setCareContent(record);
            }
        });

        this.tbar = ["模板", '->', this.buttonAdd ];

        this.on('celldblclick', function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            me.setCareContent(record);
        });
        this.on('cellclick', function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            me.setButton(record);
        });

        this.callParent(arguments);
    },

    setButton : function(record){
        if(record.data.leaf){
            var tabPanel = this.up('panel').down('tabpanel');
            if(record.data.type == 0){ // 护理模板
                this.buttonAdd.setDisabled(false);
            }else if(record.data.type == 1){ // 小结模板
                this.buttonAdd.setDisabled(false);
            }else if(record.data.type == 2){ // 总结模板
                this.buttonAdd.setDisabled(true);
            }
        }
    },
    setCareContent : function(record){
        if(!record||!record.data){
            Ext.MessageBox.alert('提示', '请选择模板！');
            return ;
        }
        if(record.data.leaf){
            var tabPanel = this.up('panel').down('tabpanel');

            if(record.data.type == 0){ // 护理模板
                this.buttonAdd.setDisabled(false);
                tabPanel.setActiveTab(0);
                var contentField = tabPanel.getActiveTab();
                if(contentField.getValue() != ''){
                    Ext.MessageBox.confirm('提示', '护理内容不为空，确定要覆盖吗？',function(_btn){
                        if(_btn!='yes'){
                            return;
                        }
                        contentField.setValue(record.data.content);
                    });
                }else{
                    contentField.setValue(record.data.content);
                }
            }else if(record.data.type == 1){ // 小结模板
                this.buttonAdd.setDisabled(false);
                tabPanel.setActiveTab(1);
                var contentField = tabPanel.getActiveTab();
                if(contentField.getValue() != ''){
                    Ext.MessageBox.confirm('提示', '护理小结不为空，确定要覆盖吗？',function(_btn){
                        if(_btn!='yes'){
                            return;
                        }
                        contentField.setValue(record.data.content);
                    });
                }else{
                    contentField.setValue(record.data.content);
                }
            }else if(record.data.type == 2){ // 总结模板
                this.buttonAdd.setDisabled(true);
                tabPanel.setActiveTab(2);
                //var contentField = tabPanel.getActiveTab();
                var window=this.up('panel').up('window');
                var conclusion=Ext.getCmp(window.id+'conclusion');
                if(conclusion!=undefined&&conclusion!=null){

                    if(conclusion.getValue() != ''){
                        Ext.MessageBox.confirm('提示', '护理总结不为空，确定要覆盖吗？',function(_btn){
                            if(_btn!='yes'){
                                return;
                            }
                            conclusion.setValue(record.data.content);
                            //contentField.setValue(record.data.content);
                        });
                    }else{
                        conclusion.setValue(record.data.content);
                        //contentField.setValue(record.data.content);
                    }
                }
            }
        }
    }
})