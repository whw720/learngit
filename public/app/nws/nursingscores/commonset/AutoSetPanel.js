/**
 * 评分通用窗口设置
 * @author:whw
 * date:2014-3-5.
 */
Ext.define('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetPanel', {
    extend: 'Ext.grid.Panel',
    padding: '5 5 5 5',
    border: 1,
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();

        me.store = Ext.create('Ext.data.Store', {
            fields: ['NAME','DATASOURCE_VALUE', 'CARE_TIME', 'AVG_VALUE', 'MAX_VALUE', 'MIN_VALUE',
                'C_NUMBER','USE_VALUE','ITEM_NAME','SHOW_NAME'
            ],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/getApsRange',
                actionMethods: { read: 'POST' },
                extraParams:{
                    registerId:me.parent.registerId,
                    startTime:me.parent.startTime,
                    endTime:me.parent.endTime,
                    scoreCode:me.parent.scoreCode
                },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        Ext.apply(me, {
            columnLines: true,
            enableColumnHide: false,
            store: me.store,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [
                /*{
                    text: '项目名称',
                    dataIndex: 'NAME',
                    width: 108,
                    style: {
                        'text-align': 'center'
                    },
                    align: 'left'
                },*/
                {
                    text: '显示名称',
                    dataIndex: 'SHOW_NAME',
                    width: 138,
                    style: {
                        'text-align': 'center'
                    },
                    align: 'left'
                },
                {
                    text: '最近检验时间',
                    width: 128,
                    dataIndex: 'CARE_TIME',
                    renderer: function (value) {
                        if(!value||value.indexOf('0000')>-1){
                            return ' ';
                        }else{
                            return Ext.Date.format(new Date(value), 'Y-m-d H:i')
                        }

                    },
                    sortable: false
                },
                {
                    text: '样本数量',
                    dataIndex: 'C_NUMBER',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    width: 65,
                    sortable: false
                },
                {
                    text: '平均值',
                    dataIndex: 'AVG_VALUE',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    width: 55,
                    sortable: false
                },
                {
                    text: '最高值',
                    dataIndex: 'MAX_VALUE',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    width: 55,
                    sortable: false
                },
                {
                    text: '最低值',
                    dataIndex: 'MIN_VALUE',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    width: 55,
                    sortable: false
                },
                {
                    text: '取用值',
                    dataIndex: 'USE_VALUE',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    width: 80,
                    sortable: false,
                    editor:{
                        xtype: 'textfield',
                        /*decimalPrecision: 3,
                        minValue:0,
                        negativeText:'不能输入负数',*/
                        maxLength:10,
                        maxLengthText:"最大不能超过10位数",
                        hideTrigger: true
                    }
                }
            ]
        });
        me.callParent();
    }
});