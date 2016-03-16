/**
 * Created by whw on 15-8-18.
 */

Ext.define('com.dfsoft.icu.sta.qualitycontrol.QualityControlGrid', {
    extend: 'Ext.grid.Panel',

    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['ID','DEPT_ID','DEPT_NAME', 'YEAR', 'QUALITY_CONTROL_CODE',
                'QUALITY_CONTROL_NAME','DESCRIPTION','COMPUTE_TIME',
                'RESULT', 'SORT_NUMBER'],
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                url: webRoot + '/sta/qualitycontrol/queryQualitycontrol',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners: {
                beforeload: function (_store, opration, eOpts) {
                    var nowStr=new Date().Format("yyyy");
                    Ext.apply(_store.proxy.extraParams, {
                        deptId: nowStr,
                        year: nowStr
                    });
                }
            },
            autoLoad: false
        });
        me.col = [
            {
                text: '序号',
                dataIndex:'SORT_NUMBER',
                style: {
                    'text-align': 'center'
                },
                sortable: false,
                width:70,
                align: 'left'
            },
            {
                text: '指标名称',
                dataIndex:'QUALITY_CONTROL_NAME',
                style: {
                    'text-align': 'center'
                },
                width:600,
                sortable: false,
                align: 'left',
                renderer:function(value,metaData ,record ){
                    var str=record.get('QUALITY_CONTROL_CODE'),heightN='232px';
                    if(str=='10011'||str=='10012'){
                        str='1001';
                    }
                    if(str>='1012'){
                        heightN='190px'
                    }else if(str=='1009'){
                        heightN='180px'
                    }else if(str=='1008'||str=='1010'){
                        heightN='203px'
                    }
                    metaData.tdAttr = " data-qtip = '<div style=\"width:520px;height:"+heightN+";margin:0px;padding:0px;\">"+
                        "<iframe src=\"/app/sta/qualitycontrol/tip/"+str+".html\" width=\"100%\" height=\"100%\" "+
                        "</div>'";
                    //return '<span qtip="'+str+'">'+value+'</span>'
                    return value;
                }
            },
            {
                text: '结果',
                dataIndex:'RESULT',
                width:95,
                style: {
                    'text-align': 'center'
                },
                cls:'sta-border-rigth-css',
                sortable: false,
                align: 'right',
                renderer:function(value,metaData ,record ){
                    if(value&&value!=null&&value!=''){
                        var ss=Ext.Date.format(new Date(record.get('COMPUTE_TIME')), 'Y-m-d H:i:s');
                        var str="计算时间: "+ss;
                        var code=record.get('QUALITY_CONTROL_CODE'),per='%';
                        if(code>='1013'){
                            per='‰';
                        }
                        return '<span title="'+str+'">'+value+per+'</span>'
                    }else{
                        return '';
                    }
                }
            }
        ];

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide:false,
            border:false,
            layout:'fit',
            store: me.store,
            columns: me.col,
            listeners:{
                itemclick:function(_this, record, item, index, e, eOpts ){
                }
            }
        });
        me.callParent();
    }
});