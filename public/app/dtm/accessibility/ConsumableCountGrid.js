/**
 * 耗材统计查询form
 * @author:whw
 * @date:2014-3-29.
 */

Ext.define('com.dfsoft.icu.dtm.accessibility.ConsumableCountGrid', {
    extend: 'Ext.grid.Panel',
    id: 'accessibility-consumable-count-grid',
    initComponent: function () {
        var me = this;

        Ext.QuickTips.init();
        Ext.apply(me,{
            startDate:parent.startDate,
            endDate:parent.endDate,
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                items : [{
                    xtype:'panel',
                    width:'100%',
                    html:'<div style="width:100%;font-size:24px;text-align: center;font-weight:bold;">耗材使用情况统计</div>'+
                        '<div style="font-size:11px;text-align: left">从 '+me.startDate+' 到 '+me.endDate+'</div>'
                }
                ]
            }],
            columnLines: true,
            //layout:'fit',
            autoScroll:true,
            border: false
        });
        me.callParent();
    }
});