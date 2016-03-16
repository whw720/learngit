/**
 * 血气分析Panel
 * Created by whw on 14-5-21.
 */
Ext.define('com.dfsoft.icu.nws.bloodgas.BloodGasPanel', {
    extend: 'Ext.grid.Panel',

    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        me.store = Ext.create('Ext.data.Store', {
            fields: ['id', 'record_date','SEL', 'record_time', 'care_value', 'name','code','normal_range', 'associate_id', 'alias'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/bloodgas/query-blood',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: false
        });

        Ext.apply(me, {
            columnLines: true,
            enableColumnHide:false,
            forceFit: true,
            store: me.store,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [
                { header: '检测代码',
                    dataIndex: 'code',
                  hidden:true},

                {
                    xtype: 'checkcolumn',
                    text: '&nbsp;&nbsp;&nbsp;&nbsp;',
                    sortable: false,
                    dataIndex: 'SEL',
                    fixed:true,
                    width: '58px',
                    listeners: {'checkchange': function (aa, rowIndex, checked, eOpts) {
                        var itemCodes = [];
                        var itemGrid = aa.ownerCt.grid.getStore();
                        var re = itemGrid.getAt(rowIndex);
                        if(re.data.care_value == ""){
                            Ext.MessageBox.alert('提示', '你选择的检验项目本次值为空，将不在趋势中显示！');
                        }
                        for(var i = 0;i< itemGrid.getCount();i++){
                            var recordOne = itemGrid.getAt(i);
                            if(recordOne.get("SEL")){
                                itemCodes.push(recordOne.get("code"));
                            }
                        }
                        if(itemCodes == ""){
                            itemCodes = "null";
                        }
                        me.parent.elm.show();
                        me.parent.loadTrendData(me.parent.patientInfo.PATIENT_ID,itemCodes);
                        re.commit();
                        me.parent.elm.hide();
                    }}
                },
                { header: '检验项目',
                    dataIndex: 'name',
                   // width: 130,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left' }, { header: '别名',
                    dataIndex: 'alias',
                     width: 60,
                    style: {
                        'text-align': 'center'
                    },

                    align: 'left' },
                { header: '参考值',
                    dataIndex: 'normal_range',
                    fixed:true,
                    width: '98px',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right' },
                { header: '检验值',
                    dataIndex: 'care_value',
                    fixed:true,
                    width: '75px',
                    style: {
                        'text-align': 'center'
                    },
                    align: 'right',
                    editor: {
                        xtype: 'numberfield',
                        hideTrigger: true
                    } }
            ],
            listeners: {
                select: function (_this, record, index, eOpts) {
                    if (record.get('associate_id') != null && record.get('associate_id') != 'null') {
                        me.setLableValue(record.get('associate_id'));
                    }
                },
                edit: function (editor, e) {
                    me.parent.elm.show();
                    if(editor.context.record.data.care_value == null){
                        Ext.MessageBox.alert('提示', '不允许修改为空值！');
                        me.parent.elm.hide();
                        editor.context.record.set('care_value',editor.context.originalValue);
                        editor.context.record.commit();
                        return false;

                    }else{
                        Ext.Ajax.request({
                            url: webRoot + '/nws/bloodgas/save-care-blood',
                            method: 'POST',
                            params: {
                                value: e.value,
                                recorder: userInfo.userId,
                                id: e.record.get('id')
                            },
                            success: function (response) {
                                me.getStore().load({
                                    scope: this,
                                    callback: function(records, operation, success) {
                                        for(var i = 0;i<records.length;i++){
                                            var itemcodes = records[i].data.code;
                                            for(var di = 0;di < me.parent.defaultItems.length;di++){
                                                var defaultCode = me.parent.defaultItems[di];
                                                if(itemcodes == defaultCode){
                                                    records[i].set("SEL",true);
                                                    records[i].commit();

                                                    me.parent.loadTrendData(me.parent.patientInfo.PATIENT_ID,me.parent.defaultItems);
                                                    me.parent.elm.hide();
                                                }
                                            }
                                        }


                                    }
                                });


                                // me.getStore().load();
                            }
                        });
                    }


                }
            }
        });
        me.callParent();
    },
    setLableValue: function (text) {
        /*var me=this;
         var lable=Ext.getCmp(me.parent.id+'nwslabel');
         var te=me.parent.str+text;
         lable.setText(te);*/

    }
});