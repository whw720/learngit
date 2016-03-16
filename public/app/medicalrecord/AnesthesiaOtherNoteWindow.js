//麻醉其他文档
Ext.define('com.dfsoft.icu.medicalrecord.AnesthesiaOtherNoteWindow', {
    extend: 'com.dfsoft.icu.medicalrecord.AnesthesiaNoteParentWindow',
    requires: [
        'com.dfsoft.icu.medicalrecord.AnesthesiaNoteParentWindow'
    ],
    constructor: function(config) {
        //住院号
        this.HOSPITAL_NUMBER = '';
        //文档名称
        this.documentName = '';

        Ext.apply(this, config);
        var proxy = this;

        //服务器根目录
        this.anesthesiaWebRoot = this.findAnesthesiaWebRoot();
        //url地址
        this.anesthesiaNoteUrl = '{0}/webservice/icu/jump/document?app=icu&registerId={1}&documentName={2}';

        this.anesthesiaNoteUrl = this.anesthesiaNoteUrl.format(proxy.anesthesiaWebRoot, proxy.HOSPITAL_NUMBER, proxy.documentName);

        proxy.callParent([{
            height: 600,
            width: 1024,
            maximizable: true,
//          maximized: true,
            html: '<iframe src="' +
                proxy.anesthesiaNoteUrl
                + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        }]);
    }

});