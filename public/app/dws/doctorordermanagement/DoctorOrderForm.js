/**
 * 医嘱管理页面
 * @author:whw
 * @date:2014-3-3.
 */

Ext.define('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderForm', {
    extend: 'Ext.form.Panel',
    alias : 'dws_doctor_order_form',
    layout: 'border',
    closable: true,
    title: '医嘱管理',

    initComponent: function() {
        Ext.util.CSS.swapStyleSheet('order.css', webRoot+'/app/dws/doctorordermanagement/css/order.css');
        var me = this;
        me.centerOptions =me.createCenter();
        me.rightOptions =me.createRigthCenter();

        Ext.apply(me,{
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                height:35,
                border:false,
                padding:'0 0 0 3',
                items : ['->',
                    {
                        xtype : 'datefield',
                        name : 'doctor-order-start-time',
                        fieldLabel : '提取日期',
                        format: 'Y-m-d',
                        value:new Date(),
                        width:170,
                        editable:false,
                        labelWidth:58,
                        labelAlign:'right'
                    }
                    /*{
                        xtype : 'datefield',
                        name : 'doctor-order-start-time',
                        fieldLabel : '从',
                        format: 'Y-m-d',
                        value:new Date(),
                        width:150,
                        editable:false,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:20,
                        labelAlign:'right'
                    },{
                        xtype : 'datefield',
                        name : 'doctor-order-end-time',
                        fieldLabel : '到',
                        format: 'Y-m-d',
                        value:new Date(),
                        width:150,
                        editable:false,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:20,
                        labelAlign:'right'
                    }*/,{
                        xtype : 'combo',
                        name : 'doctor-order-type',
                        fieldLabel : '医嘱类型',
                        width:160,
                        editable:false,
                        allowBlank : false,
                        blankText : '请输入类型',
                        valueField: 'value',
                        value:'A',
                        displayField: 'text',
                        store: new Ext.data.SimpleStore({
                            fields: ['value', 'text'],
                            data: [
                                ['A', '全部'],
                                ['L', '长期医嘱'],
                                ['S', '临时医嘱']
                            ]
                        }),
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:58,
                        labelAlign:'right'
                    },{
                        xtype: 'textfield',
                        name: 'dws-patient-name',
                        width:120,
                        fieldLabel: '患者姓名',
                        labelWidth:58  // requires a non-empty value
                    },{
                        xtype: 'textfield',
                        name: 'dws-order-doctor',
                        width:120,
                        fieldLabel: '开嘱医师',
                        labelWidth:58  // requires a non-empty value
                    },{
                        xtype:'button',
                        iconCls: 'dws-order-refresh',
                        id: me.id+'-refresh',
                        disabled:true,
                        scale: 'small',
                        tooltip: '查询',
                        handler:function(btn){
                            me.queryOrder();
                        }
                    },'-',{
                        xtype:'button',
                        id: me.id+'-ac316f30ae7711e3bbdd93b2d441f435',
                        //disabled: true,
                        iconCls: 'dws-order-add',
                        scale: 'small',
                        tooltip: '增加医嘱',
                        handler:function(){
                            me.dwsApp.showModalWindowDws(Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailWindow', {
                                'record':{},
                                'parent':me,
                                modal:false
                            }));
                            /*var options1 = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorDetailWindow', {
                                'record':{},
                                'parent':me,
                                modal:false
                            });
                            options1.show();*/
                        }
                    },'-',{
                        scale: 'small',
                        xtype:'button',
                        iconCls: 'dws-tree-dept',
                        isExpand:true,
                        tooltip: '折叠',
                        handler:function(btn){
                            btn.setDisabled(true);
                            if(this.isExpand){
                                this.isExpand=false;
                                me.centerOptions.collapseAll();
                            }else{
                                this.isExpand=true;
                                me.centerOptions.expandAll();
                            }
                            setTimeout(function(){
                                btn.setDisabled(false);
                            },500);

                        }
                    },{
                        xtype:'button',
                        id: me.id+'-ba316f30ae7711e3bbdd93b2d441f546',
                        //disabled: true,
                        iconCls: 'dws-delete',
                        scale: 'small',
                        tooltip: '删除',
                        handler:function(btn){
                            me.deleteOrder();
                        }
                    }, {
                        scale: 'small',
                        id: me.id+'-recycle',
                        //disabled: true,
                        xtype:'button',
                        iconCls: 'dws-recycle',
                        tooltip: '回收站',
                        handler:function(){
                            me.dwsApp.showModalWindowDws(Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorRecycleWindow', {
                                modal:false,
                                parent:me
                            }));
                        }
                    }
                ]
            }],
            listeners:{
                afterrender: function (_this, eOpts) {
                    setTimeout(function () {
                        Ext.getCmp(me.id+'-refresh').setDisabled(false);
                    },1000);


                }
            }
        });
        me.items = [
            {
                region: 'center',
                padding: '0 0 0 0',
                margin: '0 0 -1 -1',
                layout: 'fit',
                style: {
                    'background-color': '#FFF'
                },
                border: 1,
                items: [
                    me.centerOptions
                ]
            },
            {   region: 'east',
                padding: '0 0 0 5',
                width:'25%',
                margin: '0 -1 -1 0',
                layout: 'fit',
                style: {
                    'background-color': '#FFF'
                },
                border: 1,
                items: [me.rightOptions]
            }
        ];
        me.callParent();
        // 权限控制医嘱管理
       /* var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp(me.id +'-'+ resourceData[i].id);
            if (currButton != undefined) {
                // 删除医嘱跟回收站的权限绑定到一块
                if(resourceData[i].id == 'ba316f30ae7711e3bbdd93b2d441f546') {
                    Ext.getCmp(me.id+'-recycle').setDisabled(false);
                }
                currButton.setDisabled(false);
            }
        }*/
    },
    //刷新按纽，查询数据
    queryOrder:function(pageNum){
        var me=this;
        var orderForm=me.getForm();
        var beginDate=orderForm.findField('doctor-order-start-time').getValue();
        var endDate=orderForm.findField('doctor-order-start-time').getValue();
         /*if(beginDate.getTime()>endDate.getTime()){
            Ext.MessageBox.show({
                title:'提示',
                msg:'查询开始日期不能大于结束日期',
                width:200,
                modal:true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return ;
        }*/
        Ext.getCmp(me.id+'-refresh').setDisabled(true);
        var orderType=orderForm.findField('doctor-order-type').getValue();
        var name=orderForm.findField('dws-patient-name').getValue();
        var doctor=orderForm.findField('dws-order-doctor').getValue();
        var treePanel=me.centerOptions;
        var store=treePanel.getStore();
        beginDate=beginDate.Format("yyyy-MM-dd")+' 00:00';
        endDate=endDate.Format("yyyy-MM-dd")+' 23:59';
        store.queryBtnId=me.id+'-refresh';
        store.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                type:'query',
                beginDate : beginDate,
                endDate:endDate,
                userId: userInfo.userId,
                orderType:orderType,
                name:name,
                doctor:doctor
            });
        });
        treePanel.selectPath('/root');
        if(pageNum){
            store.loadPage(pageNum);
        }else{
            store.loadPage(1);
        }
        var rightStore=me.rightOptions.getStore().removeAll();
    },
    //创建中间treegrid面板
    createCenter: function(){
        var me=this;
        var options = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderCenter', {
            parent:this
        });
        return options;
    },
    //创建中间treegrid面板
    createRigthCenter: function(){
        var options = Ext.create('com.dfsoft.icu.dws.doctorordermanagement.DoctorOrderRightGridPanel', {
            parent:this
        });
        return options;
    },
    //删除数据
    deleteOrder:function(){
        var me=this;
        var treePanel=me.centerOptions;
        var node=treePanel.getRootNode();
        var childnodes = node.childNodes;
        var str='',names='',select=false;
        for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
            var nd = childnodes[i];
            if(nd.get('IS_SELECTED')){
                select=true;
                if(nd.get('EXECUTION_STATE')==0){
                    str+='"'+nd.get('ID')+'",';
                    names+=nd.get('SHORT_NAME')+',';
                }else{
                    Ext.MessageBox.show({
                        title:'提示',
                        msg:'开始执行，完成执行，交班执行的医嘱不能删除!',
                        width:200,
                        //plain:true,
                        //toFrontOnShow:true,
                        //renderTo:me.getEl(),
                        scope:me,
                        modal:true,
                        buttons:Ext.MessageBox.OK,
                        icon:Ext.MessageBox.INFO
                    });
                    return;
                }
            }
        }
        if(!select){
            Ext.MessageBox.show({
                title:'提示',
                msg:'请选择要删除的医嘱!',
                width:200,
                scope:me,
                modal:true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        if(str.length>1){
            str=str.substr(0,str.length-1);
            names=names.substr(0,names.length-1);
            Ext.Msg.confirm('提示', '确定要删除医嘱 '+names+' 吗？删除后可以在回收站恢复', function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url : webRoot + '/nws/doctorordermanagement/delete_orders',
                        method: 'POST',
                        params:{
                            ids:str,
                            flag:0
                        },
                        success : function(response){
                            var pageNum=treePanel.store.currentPage;
                            me.queryOrder(pageNum);

                        }
                    });
                }
            });
        }else{
            Ext.MessageBox.show({
                title:'提示',
                msg:'只可以删除未执行的医嘱!',
                width:200,
                modal:true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.WARNING
            });
            return;
        }
    }

});
