/**
 * 功能说明: PossumStoreGrid
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.vpossum.VPossumStoreGrid', {
    extend: 'Ext.grid.Panel',
    columnLines:true,
    forceFit: true,
    autoScroll:true,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            border: false,
            autoScroll: true,
            enableColumnHide:false,
            forceFit: true,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                align: 'center'
            }, {
                text: '评分时间',
                dataIndex: 'ITEM',
                sortable: false,
                align: 'left'

            }, {
                text: '并发症发生率',
                dataIndex: 'SCORES',
                width: 150,
                sortable: false,
                align: 'center',
                renderer:function(val,meta,records){
                    if(val == 0){
                        return "";
                    }else{
                        return val;
                    }

                }
            }, {
                text: '死亡率',
                dataIndex: 'SCORE',
                width: 80,
                sortable: false,
                align: 'center',
                renderer:function(val,meta,records){
                    if(val == 0){
                        return "";
                    }else{
                        return val;
                    }

                }

            }]
        });
        me.callParent();
    }

});