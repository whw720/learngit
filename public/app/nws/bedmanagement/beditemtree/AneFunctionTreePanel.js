/*
 系统设置，麻醉方法panel。
 */
Ext.define(
    'com.dfsoft.icu.nws.bedmanagement.beditemtree.AneFunctionTreePanel',
    {
        extend: 'Ext.tree.Panel',
        alias: 'widget.anefunctiontree',
        requires: [
            'com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore'
        ],
        selN: 0,
        textWidth:195,
        constructor: function(config) {
       	 Ext.apply(this, config);
            var me = this;
            me.store = new com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore();
            me.store.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBox/' + me.bed_id; 
            me.store.load();
            //me.store.addListener('load',afterrender);
//            function afterrender( st,node,records,successful,eOpts){
//                if(this.getSelsJson!= undefined){
//                    me.allChild(node, me.selafCodes);
//                    node.getOwnerTree().down('textfield').setValue("麻醉方法(" + me.selN + ")");
//                }
//            }
            
            this.getSelsJson=function () {
                var me = this;
                var records = me.getView().getChecked();
                var codeNames = "";
                Ext.Array.each(records, function (rec) {
                    codeNames = codeNames + '{"code":"' + rec.get('id') + '","name":"' + rec.get('text') + '"},';
                });
                codeNames = '[' + codeNames.substr(0, codeNames.length - 1) + ']';
                return codeNames;
            }
            
            me.callParent([{
              border: true,
              width: 220,
              height: 200,
              margin: 3,
              split: {
                  size: 5
              },
              root: {
                  id: '999',
                  text: '监护项目',
                  expand: true
              },
              dockedItems: [
                  {
                      xtype: 'toolbar',
                      height: 28,
                      padding: 0,
                      items: {
                          xtype: 'textfield',
                          value: '已过滤',
                          margin: '0 0 0 2',
                          editable: false,
                          minWidth: me.textWidth
                      }
                  }
              ],
              store: me.store,
              autoScroll: true,
              listeners: {
                  'checkchange': function (node, checked, eOpts) {

                      if (node.hasChildNodes()) {
                          var selCount = 0;
                          for (var j = 0; j < node.childNodes.length; j++) {
                              var child = node.childNodes[j];
                              if (!child.get('checked')) {
                                  selCount = selCount+1;
                              }
                              child.set('checked', checked);
                          }
                          if(!node.data.leaf){
                              if (node.data.checked) {
                                  me.selN = me.selN+selCount;
                              }else{
                                  me.selN =me.selN-node.childNodes.length+selCount;
                              }
                          }
                      }else{
                          if (node.data.checked) {
                              me.selN = me.selN + 1;
                          } else {
                              me.selN = me.selN - 1;
                          }
                      }

                      //node.getOwnerTree().down('textfield').setValue("麻醉方法(" + me.selN + ")");
                  }
              },
              buttons: [{
                  text: '确定',
                  iconCls: 'save',
                  scope: me
              }]
          }]);
            //me.callParent(arguments);
            me.collapseAll();
        }
    });