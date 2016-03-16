/**
 * 功能说明: 警示条件 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.bedmanagement.AlertConditionWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.AlertConditionForm'
    ],
    initComponent 	: function(){
    	var me = this,
            currWidth = 248;
        me.alertConditionForm = new com.dfsoft.icu.nws.bedmanagement.AlertConditionForm({parent: me});
        if(me.alertConditionForm.valueMenu && me.alertConditionForm.valueMenu.length > 0) currWidth = 272;
        Ext.apply(me, {
    		title: '警示条件',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 30,
                padding: '3 0 3 0',
                items: ['->', {
                    xtype: 'button',
                    tooltip: '清除',
                    iconCls: 'clean',
                    scope: me,
                    handler: function() {
                        me.alertConditionForm.getForm().setValues({
                            OPERATORS: '',
                            FORMULA_VALUE: '',
                            NON: false
                        });
                    }
                }, {
                    xtype: 'button',
                    tooltip: '提交',
                    iconCls: 'template-submit',
                    scope: me,
                    handler: me.isOk
                }]
            }],
            closable: true,
            iconCls: 'alert-condition',
            layout: 'fit',
            resizable: false,
            width: currWidth,
            height: 155,
            items:[me.alertConditionForm]
        });
        me.callParent();
    },

    // 提交当前警示条件
    isOk: function() {
        var me = this,
            alertGrid = Ext.getCmp('nws-alert-grid'),
            records = alertGrid.getSelectionModel().getSelection()[0],
            form = me.alertConditionForm.getForm(),
            non = form.findField('NON').getValue(),
            currValues = form.getValues();
            
        if(form.isValid()) {
            var currFieldName = Ext.getCmp('nws-alert-grid').parent.getForm().findField('DATASOURCE_VALUE').getDisplayValue(),
                formulaFunction = '';
            if(currValues.OPERATORS == '包含') {
                if(non) {
                    currValues.OPERATORS = '不' + currValues.OPERATORS;
                    formulaFunction = 'function(value) {var curr=\''+currValues.FORMULA_VALUE+'\'.split(",");var boolean=false;for(var i=0;i<curr.length;i++){if(curr[i]==value){boolean=true;}}if(boolean){return false;}else{return "'+records.data.FORMULA.ICON+'";}}'
                }else{
                	formulaFunction = 'function(value) {var curr=\''+currValues.FORMULA_VALUE+'\'.split(",");for(var i=0;i<curr.length;i++){if(curr[i]==value){return "'+records.data.FORMULA.ICON+'";}}return false;}'
                }
            } else {
                // 非
                if(non) {
                    currValues.OPERATORS = '!' + currValues.OPERATORS;
                }
                if(currValues.OPERATORS=='='){
                	formulaFunction = 'function(value) {if(value=='+currValues.FORMULA_VALUE+'){return "'+records.data.FORMULA.ICON+'";}else{return false;}}';
                }else{
                	if(non) {
                		//非得时候，等号是==
                		if(currValues.OPERATORS.substring(1,currValues.OPERATORS.length)=='='){
                			formulaFunction = 'function(value) {if(!(value='+currValues.OPERATORS.substring(1,currValues.OPERATORS.length)+currValues.FORMULA_VALUE+')){return "'+records.data.FORMULA.ICON+'";}else{return false;}}';
                		}else{
                			formulaFunction = 'function(value) {if(!(value'+currValues.OPERATORS.substring(1,currValues.OPERATORS.length)+currValues.FORMULA_VALUE+')){return "'+records.data.FORMULA.ICON+'";}else{return false;}}';
                		}
                	}else{
                		formulaFunction = 'function(value) {if(value'+currValues.OPERATORS+currValues.FORMULA_VALUE+'){return "'+records.data.FORMULA.ICON+'";}else{return false;}}';
                	}
                }
            }
            var formula = {
                ICON: records.data.FORMULA.ICON,
                OPERATORS: currValues.OPERATORS,
                FORMULA_VALUE: currValues.FORMULA_VALUE,
                FORMULA_FUNCTION: formulaFunction
            };
            var des = currFieldName + ' ' + currValues.OPERATORS + ' ' + currValues.FORMULA_VALUE;
            records.data.FORMULA = formula;
            records.data.DESCRIPTION = des;
            records.commit();
            me.close();
        }
    }
});