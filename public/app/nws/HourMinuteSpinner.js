/**
 * 功能说明: 小时分钟选择
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.nws.HourMinuteSpinner', {
    extend: 'Ext.form.field.Spinner',
    requires: [],
    enableKeyEvents: true,
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        // 仅能输入数字
        this.isNumber = function(keyCode) {
            // 数字
            if ( (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) )
                return true
            // Backspace键
            if (keyCode == 8)
                return true
            return false
        }

        this.callParent([{
            width: 50,
            onSpinUp: function() {
                var val = parseInt(proxy.getValue());
                if (isNaN(val)) { //有可能为空
                   val = 0;
                }
                if (val<proxy.maxValue) {
                    proxy.setValue(val + 1);
                }
            },
            onSpinDown: function() {
                var val = parseInt(proxy.getValue());
                if (isNaN(val)) { //有可能为空
                    val = 0;
                }
                if (val>0) {
                    proxy.setValue(val - 1);
                }
            },
            listeners: {
                keyup: function(field, e, eOpts) {
                    if ( !proxy.isNumber(e.getCharCode()) ) {
                        if (proxy.getValue().length>0) {
                            proxy.setValue(proxy.getValue().substring(0, proxy.getValue().length-1));
                        }
                    }
                    if (isNaN(proxy.getValue())) {
                        proxy.setValue(0);
                    }
                    var val = parseInt(proxy.getValue());
                    if (val>proxy.maxValue) {
                        proxy.setValue(proxy.maxValue);
                    }
                }
            }
        }]);
    }


});
