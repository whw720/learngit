/**
 * 功能说明:  护理评分 tree
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.NursingScoresTreePanel', {
    extend: 'Ext.tree.Panel',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.NursingScoresTreeStore'
    ],
    initComponent 	: function(){
        var me = this;
        me.nursingScoresTreeStore = new com.dfsoft.icu.nws.nursingscores.NursingScoresTreeStore();

        Ext.apply(me, {
            region: 'west',
            border: true,
            width: 220,
            minWidth: 205,
            split: {
                size: 5
            },
            store: me.nursingScoresTreeStore,
            rootVisible: false,
            autoScroll: true,
            containerScroll: true,
            listeners:{itemclick:function(node,record,item,index,e,eOpts){
                   var tabObj = Ext.getCmp("tadsfsad");

             //   console.log(tabObj.items.items);

                //    alert(tabObj.items.items.length);

                for (var i=0; i<tabObj.items.length; i++) {
                //    alert(tabObj.items.items[i].title);

                }


//                    if (tabObj.items[i].title == record.data.text) {
//                        tabObj.setActiveTab(i);
//                        return;
//                    }
//                }
//               // me.tisstwentyeight = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm();
//                me.tiss = new com.dfsoft.icu.nws.nursingscores.tiss.TissForm();
//                tabObj.add(me.tiss);
//                tabObj.setActiveTab(me.tiss);
//

               // console.log(record.text);
               // alert(record.data.text);
            }}
        });

        me.on('itemexpand', me.onItemexpand);
        me.callParent();
    },

    onItemexpand: function(_this, eOpts) {

        this.getStore().proxy.url = '';
    }
});
