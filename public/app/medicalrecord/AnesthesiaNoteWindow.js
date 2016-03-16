//麻醉记录单
Ext.define('com.dfsoft.icu.medicalrecord.AnesthesiaNoteWindow', {
    extend: 'com.dfsoft.icu.medicalrecord.AnesthesiaNoteParentWindow',
    requires: [
        'com.dfsoft.icu.medicalrecord.AnesthesiaNoteParentWindow'
    ],
    constructor: function(config) {
        //服务器根目录
        this.anesthesiaWebRoot = this.findAnesthesiaWebRoot();
        //住院号
        this.HOSPITAL_NUMBER = '';
        //文档名称
        this.documentName = 'mds-anesthesia-record';
        
        Ext.apply(this, config);
        var proxy = this;

        //麻醉记录单页码
        proxy.anesthesiaNotePageNum = 1;

        //url地址
        proxy.anesthesiaNoteUrl = '{0}/webservice/icu/jump/document?app=icu&documentName={3}&pageNum={1}&registerId={2}';

        //麻醉文书store
        var states = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"mds-anesthesia-record", "name":"麻醉记录"},
                {"abbr":"mds-appendix", "name":"麻醉小结"}
            ]
        });

        //麻醉文书下拉框
        proxy.anesthesiaNoteComboBox = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '文书',
            store: states,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            editable: false,
            labelAlign: 'right',
            value: proxy.documentName,
            listeners: {
                select: function(combo, records, eOpts) {
                    proxy.documentName = combo.getValue();
                    proxy.prevButton.setDisabled(proxy.documentName=="mds-appendix");
                    proxy.nextButton.setDisabled(proxy.documentName=="mds-appendix");
                    proxy.showAnesthesiaNote();
                }
            }
        });

        //显示文书
        proxy.showAnesthesiaNote = function() {
            var iframe = getCmpIframe(proxy.el.dom);
            iframe.src = proxy.anesthesiaNoteUrl.format(proxy.anesthesiaWebRoot, proxy.anesthesiaNotePageNum, proxy.HOSPITAL_NUMBER, proxy.documentName);
        }

        //设置上一页下一页按钮提示信息
        proxy.setPrevNextButtonTooltip = function() {
            proxy.prevButton.setTooltip('上一页' );
            proxy.nextButton.setTooltip('下一页' );
        }

        //上一页按钮
        proxy.prevButton = Ext.create('Ext.Button', {
            tooltip: '上一页',
            xtype: 'button',
            iconCls: 'up',
            handler: function(button, e) {
                proxy.anesthesiaNotePageNum -= 1;
                if (proxy.anesthesiaNotePageNum<1) {
                    proxy.anesthesiaNotePageNum = 1;
                    proxy.showAnesthesiaNote();
                    proxy.setPrevNextButtonTooltip();
                }
            }
        });

        //下一页按钮
        proxy.nextButton  = Ext.create('Ext.Button', {
            tooltip: '下一页',
            xtype: 'button',
            iconCls: 'down',
            handler: function(button, e) {
                proxy.anesthesiaNotePageNum += 1;
                proxy.showAnesthesiaNote();
                proxy.setPrevNextButtonTooltip();
            }
        });

        proxy.callParent([{
            title: '麻醉记录单',
            height: 600,
            width: 1024,
            tbar: ['->', proxy.anesthesiaNoteComboBox, proxy.prevButton, proxy.nextButton],
            maximizable: true,
            //maximized: true,
            html: '<iframe src="' +
                proxy.anesthesiaNoteUrl.format(proxy.anesthesiaWebRoot, proxy.anesthesiaNotePageNum, proxy.HOSPITAL_NUMBER, proxy.documentName)
                + '" style="width: 100%; height:100%;" frameborder=”no”></iframe>'
        }]);
    }

});