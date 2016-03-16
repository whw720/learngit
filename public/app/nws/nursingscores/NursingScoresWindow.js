/**
 * 功能说明:  护理评分主 window
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.NursingScoresWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.NursingScoresTreePanel',
        'com.dfsoft.icu.nws.nursingscores.NursingScoresPanel'
    ],
    initComponent 	: function(){
        Ext.util.CSS.swapStyleSheet('nursingscores.css', '/app/nws/nursingscores/css/nursingscores.css');
        var me = this;
        me.nursingScoresTreePanel = new com.dfsoft.icu.nws.nursingscores.NursingScoresTreePanel();
        me.nursingScoresPanel = new com.dfsoft.icu.nws.nursingscores.NursingScoresPanel();
        Ext.apply(me, {
            title: '护理评分',
            padding: 5,
            iconCls: 'grade',
            layout: 'border',
            width: 1014,
            height: 576,
            maximizable: true,
            items:[me.nursingScoresTreePanel,me.nursingScoresPanel]
        });
        me.callParent();
    }
});