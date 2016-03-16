/**
 * 功能说明: iss评分 grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.IssIssGrid', {
	extend: 'Ext.grid.property.Grid',
   // id:'propertytest',
    width: 200,
    border:true,
	initComponent: function() {
		var me = this;
      //  me.id = me.mod + "",
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
//
        var comboStore = Ext.create('Ext.data.Store', {
            model: 'VALUE_TEXT_MODEL',
            data: [
                { value: '1', text: '轻微' },
                { value: '2', text: '轻度' },
                { value: '3', text: '中度' },
                { value: '4', text: '重度' },
                { value: '5', text: '严重' },
                { value: '6', text: '极重' }
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
                Head: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
               }),
                Facial: Ext.create('Ext.ux.PropertyCombo', {
                   store: comboStore
               }),
                Chestt: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                }),
                Aap: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                }),
                Lapf: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                }),
                Sur: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                })
            },
            customRenderers: {
                Head: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Facial: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Chestt: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Aap: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Lapf: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Sur: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                }
            },
            propertyNames: {
                Head: '头部',
                Facial:'面部',
                Chestt:'胸部',
                Aap:'腹部和盆腔',
                Lapf:'四肢和骨盆架',
                Sur:'体表'
            },
            source: {
                Head: '',
                Facial:'',
                Chestt:'',
                Aap:'',
                Lapf:'',
                Sur:''
            }
        });
		me.callParent();
	}
});