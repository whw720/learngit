/**
 * 功能说明:  护理评分 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.NursingScoresPanel', {
    extend: 'Ext.tab.Panel',
    requires: [
       // 'com.dfsoft.icu.nws.nursingscores.tiss.TissForm',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm'
    ],
    id:"tadsfsad",
    initComponent: function(){
        var me = this;

       // me.tiss = new com.dfsoft.icu.nws.nursingscores.tiss.TissForm();
        me.tisstwentyeight = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm();
        Ext.apply(me, {
            region: 'center',
            border: true,
            plain: true,
            layout: 'fit',
            items: [me.tisstwentyeight]
            //me.tisstwentyeight
        });
        me.callParent();
    }
});