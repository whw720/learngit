Ext.define('com.dfsoft.lancet.sys.desktop.Timing', {
    extend: 'Ext.Component',

    requires: [
        'com.dfsoft.lancet.sys.desktop.SlideMessage'
    ],

    id: 'timing',

    timing: function() {
        Ext.Ajax.request({
            url: webRoot + '/sys/now',
            method: 'GET',
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success === true) {
                    var serverDate = new Date(result.data);
                    var localDate = new Date();
                    var diff = Math.abs(Math.round((serverDate.getTime() - localDate.getTime()) / 1000));
                    if (diff >= 60) {
                        myDesktopApp.diffTime = true;
                        var msg = Ext.create('com.dfsoft.lancet.sys.desktop.SlideMessage');
                        msg.popup('警告：', '服务器当前时间 ' + Ext.util.Format.date(serverDate, "Y-m-d H:i") + ' ,您的电脑与服务器时间不一致，请校时后重新登录！');
                    }
                }
            }
        });
    }
});