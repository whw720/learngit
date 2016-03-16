//麻醉文书父窗口
Ext.define('com.dfsoft.icu.medicalrecord.AnesthesiaNoteParentWindow', {
    extend: 'Ext.window.Window',

    //查找根目录
    findAnesthesiaWebRoot: function() {
        var anesthesiaWebRoot = '';
        Ext.Ajax.request({
            url: webRoot + '/nws/medicalrecord/findAdapter',
            method: 'post',
            async: false,
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    anesthesiaWebRoot = result.data;
                }
            }
        });
        return anesthesiaWebRoot;
    },

    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;

        proxy.callParent([config]);
    }

});