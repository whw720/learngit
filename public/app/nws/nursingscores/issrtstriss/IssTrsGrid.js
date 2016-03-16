/**
 * 功能说明: iss grid
 * @author: zag
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.issrtstriss.IssTrsGrid', {
	extend: 'Ext.grid.property.Grid',
   // id:'isstrsgrid',
    width: 302,
    border:true,
	initComponent: function() {
		var me = this;
        function getPropertyTextByValue(paramName, value) {
            switch(paramName) {
                case 'Combo1' :
                    var combo1Value = comboStore.getById(value);
                    return combo1Value ? combo1Value.get('text') : '';
                case 'sbpbo':
                 var sbpValue = SbpStore.getById(value);
                    return sbpValue ? sbpValue.get('text') : '';
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
                { value: '0', text: '0' },
                { value: '1', text: '1~5' },
                { value: '2', text: '6~9' },
                { value: '4', text: '10~29' },
                { value: '3', text: '≥30' }
            ]
        });
        var SbpStore = Ext.create('Ext.data.Store', {
            model: 'VALUE_TEXT_MODEL',
            data: [
                { value: '0', text: '0' },
                { value: '1', text: '1~49' },
                { value: '2', text: '50~75' },
                { value: '3', text: '76~89' },
                { value: '4', text: '≥90' }
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
                Rr: Ext.create('Ext.ux.PropertyCombo', {
                    store: comboStore
                }),
                Sbp: Ext.create('Ext.ux.PropertyCombo', {
                    store: SbpStore
                })
            },
            customRenderers: {
                Rr: function(v) {
                    return getPropertyTextByValue('Combo1', v);
                },
                Sbp: function(v) {
                    return getPropertyTextByValue('sbpbo', v);
                }
            },
            propertyNames: {
                Rr: '呼吸频率',
                Sbp:'收缩压'
            },
            source: {
                Rr: '',
                Sbp:''
            }
        });
		me.callParent();
	}
});