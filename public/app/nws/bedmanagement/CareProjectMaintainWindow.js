/**
 * 功能说明:  监护项目维护 window
 * @author: 杨祖文
 */

Ext.define('com.dfsoft.icu.nws.bedmanagement.CareProjectMaintainWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.CareProjectMaintainForm'
    ],
    initComponent: function() {
        var me = this;
        me.careProjectMaintainForm = new com.dfsoft.icu.nws.bedmanagement.CareProjectMaintainForm({
            parent: me
        });
        Ext.apply(me, {
            title: '监护项目维护',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->', {
                    xtype: 'button',
                    tooltip: '提交',
                    iconCls: 'template-submit',
                    scope: me,
                    handler: me.sumbitItem
                }]
            }],
            layout: 'fit',
            width: 502,
            height: 395,
            //modal: true,
            items: [me.careProjectMaintainForm]
        });
        me.callParent();
    },

    //提交 到监护项目tab
    sumbitItem: function() {
        var me = this,
            careProjectMaintainForm = me.careProjectMaintainForm.getForm(),
            alertGrid = me.careProjectMaintainForm.alertGrid,
            alertStore = alertGrid.getStore(),
            alertStr = '';
        var displayCenter = careProjectMaintainForm.findField('DISPLAY_TO_CENTRAL').getValue(),
            displayRecords = careProjectMaintainForm.findField('DISPLAY_TO_RECORDS').getValue(),
            isDaily = careProjectMaintainForm.findField('IS_DAILY').getValue(),
            nameField = careProjectMaintainForm.findField('NAME'),
            careItemValues = careProjectMaintainForm.getValues();
        careItemValues.DISPLAY_TO_CENTRAL = displayCenter ? 1 : 0;
        careItemValues.DISPLAY_TO_RECORDS = displayRecords ? 1 : 0;
        careItemValues.IS_DAILY = isDaily ? 1 : 0;
        // 对同名的监护项目进行限制
        var careItemName = Ext.util.Format.trim(careItemValues.NAME);
        // 名称为空格符也算是未输入
        if (careItemName.length == 0) {
            nameField.setValue(careItemName);
        }
        if (careItemValues.SUM_POSITION=='') {
        	careItemValues.SUM_POSITION = 0;
        }
        if (!careItemValues.NAME) {
            careItemValues.NAME = nameField.getValue();
        }
        var careProjectTreeGrid = Ext.getCmp('nws-care-project-treegrid');
        // 当前床位的所有监护项
        var recordsAll = me.getChild(careProjectTreeGrid.getRootNode());
        // 当前选中的监护项目
        var records = careProjectTreeGrid.getSelectionModel().getSelection();
        //如果是修改的，则删除该记录
        if (me.type=='edit') {
            for (var i = 0; i < recordsAll.length; i++) {
                if (recordsAll[i].data.NAME == records[0].data.NAME) {
                    recordsAll.splice(i, 1);
                }
            }
        }
        // 判断是否有同名监护项
        for (var i = 0; i < recordsAll.length; i++) {
            // 如果重复 ，则提示出量.量允许重复添加
        	if(careItemValues.ALIAS!=''){
        		if (careItemValues.ALIAS == recordsAll[i].data.NAME) {
                	if(recordsAll[i].data.PRESET_CODE!='278366bfc60e11e395078c89a5769562'){
                		Ext.MessageBox.alert('提示', '监护项名称 ' + careItemValues.NAME + ' 重复，请重新输入!', function() {
                            nameField.focus();
                        });
                        return;
                	}
                }
        	}
            
        }
        // 获取警示grid 记录
        for (var i = 0; i < alertStore.getCount(); i++) {
            var curr = alertStore.getAt(i);
            if(curr.data.FORMULA.FORMULA_FUNCTION!=undefined){
            	if (curr.data.FORMULA.FORMULA_FUNCTION.length > 0) {
                    curr.data.FORMULA = Ext.encode(curr.data.FORMULA);
                    if (alertStr.length > 0) {
                        alertStr += '|';
                    }
                    alertStr += curr.data.FORMULA + '~' + curr.data.COLOR + '~' + curr.data.DESCRIPTION;
                }
            }
        }
        careItemValues.alertStr = alertStr;
        if (careProjectMaintainForm.isValid()) {
            me.addNode(careItemValues);
            me.close();
        }
    },

    //获取所有的监护项目
    getChild: function(node) {
        var me = this,
            childs = [];
        var childNodes = node.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            childs.push(childNodes[i]);
            if (childNodes[i].hasChildNodes()) {
                childs = childs.concat(me.getChild(childNodes[i]));
            }
        }
        return childs;
    },
    
    //显示模态窗口
    showModalWindow: function(win) {
        var me = this;
        //创建遮罩效果
        me.loadMask = new Ext.LoadMask(me, {
            msg: "数据加载中...",
            useMsg: false
        });
        me.hasModalChild = true;
        me.loadMask.show();
        win.on("close", function(_panel, eOpts) {
            me.loadMask.hide();
            me.hasModalChild = false;
        }, this);
        win.show();
    }
});