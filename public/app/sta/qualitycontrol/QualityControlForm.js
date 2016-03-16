/**
 * Created by whw on 15-8-18.
 */

Ext.define('com.dfsoft.icu.sta.qualitycontrol.QualityControlForm', {
    extend: 'Ext.form.Panel',
    name:'quality-control-form',
    id:'quality-control-form-1',
    alias : 'quality_control_form',
    layout: 'border',
    closable: true,
    title: '质量控制指标',
    require:[
        'Ext.ux.tree.plugin.MonthComboBox'
    ],

    initComponent: function() {
        Ext.util.CSS.swapStyleSheet('qualitycontrol.css', webRoot+'/app/sta/qualitycontrol/css/qualitycontrol.css');
        var me = this;
        me.centerOptions =me.createCenter();
        me.northOptions =me.createNorth();

        Ext.define('deptModel', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'deptId',
                    type: 'string'
                },
                {
                    name: 'deptName',
                    type: 'string'
                }
            ]
        });
        me.deptStore = Ext.create('Ext.data.Store', {
            model: 'deptModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: webRoot + '/sta/qualitycontrol/getDeptList',
                actionMethods: { read: 'POST' },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        me.monthComBox=Ext.create('Ext.ux.tree.plugin.MonthComboBox',{
            fieldLabel : '年份',
            labelWidth:58,
            format:'Y',
            id:me.id+'quality-year',
            labelAlign:'right'
        });
        me.monthComBox.setDefaultValue(new Date().Format('yyyyMM'));
        Ext.apply(me,{
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                height:35,
                border:false,
                padding:'0 0 0 3',
                items : [{
                        xtype : 'combo',
                        name : 'quality-control-dept',
                        fieldLabel : 'ICU科室',
                        width:255,
                        editable:false,
                        allowBlank : false,
                        value:userInfo.deptId,
                        blankText : '请选择科室',
                        valueField: 'deptId',
                        displayField: 'deptName',
                        store: me.deptStore,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:60,
                        labelAlign:'right'
                    }
                    ,me.monthComBox/*{
                        xtype : 'datefield',
                        fieldLabel : '年份',
                     labelWidth:58,
                     labelAlign:'right',
                        format: 'Y',
                        name:'quality-year',
                        value:new Date(),
                        width:150,
                        editable:false
                    }*/,'->',{
                        xtype:'button',
                        tooltip: '查询',
                        id:me.id+'queryBtn',
                        text: '查询',
                        handler:function(btn){
                            me.queryQualityControl();
                        }
                    },'-',{
                        xtype:'button',
                        tooltip: '重新计算',
                        text: '重新计算',
                        handler:function(btn){
                            btn.setDisabled(true);
                            Ext.getCmp(me.id+'queryBtn').setDisabled(true);
                            me.computeQualityControl(btn);
                        }
                    }
                ]
            }]
        });
        me.items = [
            {
                region: 'north',
                padding: '0 0 0 0',
                margin:'0 0 -1 0',
                layout: 'fit',
                style:{
                    'background-color':'#FFF'
                },
                height:90,
                border:1,
                items: [
                    me.northOptions
                ]
            },
            {
                region: 'center',
                padding: '0 0 0 0',
                layout: 'fit',
                style:{
                    'background-color':'#FFF'
                },
                border:1,
                items: [
                    me.centerOptions
                ]
            }];
        me.callParent();

    },
    //刷新按纽，查询数据
    computeQualityControl:function(btn){
        var me=this;

        var orderForm = me.getForm();
        var year = Ext.getCmp(me.id+'quality-year').getValue();
        Ext.Ajax.request({
            url: webRoot + '/sta/qualitycontrol/computeQualitycontrol',
            method: 'POST',
            params:{
                year: year
            },
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {

                    setTimeout(function(){
                        Ext.MessageBox.alert('提示', '重新计算成功!');
                        btn.setDisabled(false);
                        Ext.getCmp(me.id+'queryBtn').setDisabled(false);
                        me.queryQualityControl();
                    },5000);

                }
            }
        });
    },
    //刷新按纽，查询数据
    queryQualityControl:function(page){
        var me=this;
        var orderForm = me.getForm();
        var year = Ext.getCmp(me.id+'quality-year').getValue();
        var deptId = orderForm.findField('quality-control-dept').getValue();
        var store=me.centerOptions.getStore();
        store.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                deptId : deptId,
                year:year
            });
        });
        store.load();
        var northstore=me.northOptions.getStore();
        northstore.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                deptId : deptId,
                year:year
            });
        });
        northstore.load();
    },
    //创建中间treegrid面板
    createCenter: function(){
        var options = Ext.create('com.dfsoft.icu.sta.qualitycontrol.QualityControlGrid', {
            parent:this
        });
        return options;
    },
    //创建中间treegrid面板
    createNorth: function(){
        var options = Ext.create('com.dfsoft.icu.sta.qualitycontrol.QualityControlParamGrid', {
            parent:this
        });
        return options;
    }
});
