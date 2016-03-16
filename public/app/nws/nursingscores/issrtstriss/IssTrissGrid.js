/**
 * 功能说明: iss评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrissGrid', {
	extend: 'Ext.grid.property.Grid',
   // id:'isstrissgrid',
    width: 302,
    border:true,
	initComponent: function() {
		var me = this;
        function getPropertyTextByValue(paramName, value) {
            switch(paramName) {
                case 'Combo1' :
                    var combo1Value = comboStore.getById(value);
                    return combo1Value ? combo1Value.get('text') : '';
                default :
                    return value;
            }
        };
        var value_text_array = ['value', 'text'];
        Ext.define('VALUE_TEXT_MODEL', {
            extend: 'Ext.data.Model',
            fields: value_text_array,
            idProperty: 'value'
        });
        var comboStore = Ext.create('Ext.data.Store', {
            model: 'VALUE_TEXT_MODEL',
            data: [
                { value: '1', text: '15 > 年龄' },
                { value: '2', text: '15 ≤ 年龄 < 55' },
                { value: '3', text: '年龄 > 55' }
            ]
        });
        Ext.define('Ext.ux.PropertyCombo', {
                  extend:'Ext.form.field.ComboBox',
            config: {
                valueField: 'value',
                displayField: 'text',
                editable: false,
                queryMode: 'local',
                selectOnFocus:true
            },
            constructor: function(config) {
                this.initConfig(config);
                this.callParent([config]);
            }
        });
		Ext.apply(me, {
            sortableColumns:false,
            customEditors: {

                age: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                })
            },
            customRenderers: {
                age: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                }
            },
            propertyNames: {
                age: '年龄'
            },
            source: {
                age:''
            }
        });
		me.callParent();
	}
});