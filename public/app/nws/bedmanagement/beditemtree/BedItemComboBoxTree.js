Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemComboBoxTree', {
    extend: 'Ext.ux.ComboBoxTree',
    alias: 'widget.beditemcomboboxtree',
    requires: [
               'com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore'
           ],
  constructor: function(config) {
	 Ext.apply(this, config);
        var me = this;
        var BedItemStore = new com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore();
        BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBox/' + me.bed_id; 
        BedItemStore.load();
        this.getSelsJson=function (){
            if(me.picker==undefined){
                return "";
            }else{
                var records = me.picker.getView().getChecked();
                var codeNames = "";
                Ext.Array.each(records, function (rec) {
                    codeNames = codeNames + '{"code":"' + rec.get('id') + '","name":"' + rec.get('text') + '"},';
                });
                codeNames = '[' + codeNames.substr(0, codeNames.length - 1) + ']';
                return codeNames;
            }
        }
        me.callParent([{
            hiddenName:'department',
            width:280,
            //matchFieldWidth:false,
            //listConfig : { width: 280},
            labelWidth:58,
            fieldLabel:'监护项目',
            rootVisible: false,
            displayField: 'text',
            editable: false,
            multiSelect : true,
            store:BedItemStore
        }]);
    }
});