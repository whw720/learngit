/**
 * 医嘱管理页面
 * @author:whw
 * @date:2014-3-3.
 */
Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderForm', {
    extend: 'Ext.form.Panel',
    name:'doctor-order-form',
    alias : 'doctor_order_form',
    layout: 'border',
    timeId:-1,
    permissionBtns:[],
    findExecuteOrderById:null,
    firstLoad:true,
    firstLoadTree:true,
    findExecuteOrderByDate:null,
    closable: true,
    title: '医嘱管理',

    initComponent: function() {
        Ext.util.CSS.swapStyleSheet('doctororder.css', webRoot+'/app/nws/doctorordermanagement/css/doctororder.css');
        var me = this;
        var routeStore = Ext.create('Ext.data.TreeStore', {
            // autoLoad: true,
            fields: [{
                name: 'text',
                type: 'string'
            }, {
                name: 'id',
                type: 'string'
            }, {
                name: 'HELPER_CODE',
                type: 'string'
            }],
            proxy: {
                type: 'ajax',
                url: webRoot + '/nws/doctorordermanagement/route_tree',
                actionMethods: { read: 'POST' },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        me.centerOptions =me.createCenter();
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
                        name : 'doctor-order-extract-time',
                        fieldLabel : '提取日期',
                        format: 'Y-m-d',
                        value:new Date(),
                        width:170,
                        editable:false,
                        labelWidth:58,
                        labelAlign:'right'
                    },{
                        xtype : 'combo',
                        name : 'doctor-order-status',
                        fieldLabel : '状态',
                        width:125,
                        editable:false,
                        allowBlank : false,
                        blankText : '请输入执行状态',
                        valueField: 'selValue',
                        value:'-1',
                        displayField: 'disValue',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['disValue','selValue','icon'],
                            data:[{'disValue':'全部','selValue':'-1','icon':'mei'},{'disValue':'未执行','selValue':'0','icon':'circle-black'},{'disValue':'开始执行','selValue':'1','icon':'circle-red'},{'disValue':'完成执行','selValue':'2','icon':'circle-blue'},{'disValue':'交班执行','selValue':'3','icon':'circle-green'}]
                        }),
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:30,
                        labelAlign:'right',
                        listConfig:{
                            getInnerTpl: function() {
                                var tpl = '<div>' +
                                    '<div class="{icon}" style="width: 16px; height: 16px; position: absolute; margin-top: 2px;"></div>' +
                                    '<span style="padding-left: 18px;">{disValue}</span></div>';
                                return tpl;
                            }
                        }
                    },{
                        xtype: 'comboboxtree',
                        //name : 'doctor-order-way',
                        fieldLabel: '途径',
                        labelWidth: 38,
                        //width: 250,
                        rootVisible: false,
                        displayField: 'text',
                        valueField: 'id',
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        trigger2Cls: Ext.baseCSSPrefix ,
                        onTrigger1Click: function() {
                            this.setRawValue('');
                            this.setValue('');
                            me.getForm().findField('doctor-order-way').setValue("");
                            me.getForm().findField('doctor-order-way').orderName = "";
                        },
                        editable: true,
                        allowBlank: true,
                        store: routeStore,
                        listeners:{
                            nodeclick: function(combo, records, eOpts) {
                               me.getForm().findField('doctor-order-way').setValue(records.get('id'));
                                me.getForm().findField('doctor-order-way').orderName = records.get('text');
                            },
                            expand:function(_field, eOpts ){
                                if(!me.firstLoadTree){
                                    routeStore.on('beforeload', function (_store, options) {
                                        Ext.apply(_store.proxy.extraParams, {
                                            help_code:""
                                        });
                                    });
                                    routeStore.load();
                                }else{
                                    me.firstLoadTree=false;
                                }
                            },
                            focus : function(_this){

                            },//change( this, newValue, oldValue, eOpts )
                            change:function(_this,newValue, oldValue,  eOpts ){
                                var combo = _this;
                                var value = newValue;
                                if(value!=''){
                                    routeStore.on('beforeload', function (_store, options) {
                                        Ext.apply(_store.proxy.extraParams, {
                                            help_code:value
                                        });
                                    });
                                    routeStore.load();
                                    //console.log(_this.picker);
                                    //_this.picker.filterBy(value,'HELPER_CODE');
                                    /*combo.store.filterBy(function(record,id){
                                        console.log(record);
                                        console.log('******');
                                        var text = record.get('text');
                                        var helpCode = record.get('HELPER_CODE');
                                        console.log(helpCode);
                                        if(helpCode.length>0){
                                            return (text.indexOf(value.toUpperCase())==0)||(helpCode.indexOf(value.toUpperCase())==0);
                                        }
                                    });*/
                                    value='';
                                    combo.expand();
                                    return false;
                                }else{
                                    me.getForm().findField('doctor-order-way').setValue("");
                                    me.getForm().findField('doctor-order-way').orderName = "";
                                    routeStore.on('beforeload', function (_store, options) {
                                        Ext.apply(_store.proxy.extraParams, {
                                            help_code:""
                                        });
                                    });
                                    routeStore.load();
                                    //combo.expand();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'hidden',
                        name: 'doctor-order-way',
                        value: "",
                        orderName: ""
                    }
                    ,{
                        xtype : 'combo',
                        name : 'doctor-order-type',
                        fieldLabel : '类型',
                        width:120,
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
                        labelWidth:30,
                        labelAlign:'right'
                    },{
                        xtype:'button',
                        iconCls: 'order-refresh',
                        id: me.id+'-refresh',
                        scale: 'small',
                        tooltip: '刷新',
                        handler:function(btn){
                            me.queryOrder();
                        }
                    },'-',{
                        xtype:'button',
                        iconCls: 'order-down',
                        scale: 'small',
                        tooltip: '提取该床位医嘱',
                        handler:function(btn){
                            if(me.patientInfo.SID!=null&&me.patientInfo.SID!=''){

                                btn.setDisabled(true);
                                var colltime=me.getForm().findField('doctor-order-extract-time').getValue();
                                var timeStamp=new Date(Ext.Date.format(colltime,'Y-m-d')).getTime();
                                Ext.Ajax.request({
                                    url: webRoot + '/link/drug/requestSyncOrders' ,
                                    params: {
                                        provider    : 'medical-orders-icu',
                                        timestamp   : timeStamp,
                                        identifier  : me.patientInfo.SID,
                                        timestampEnd : 'null',
                                        model : 'HIS'
                                    },
                                    method: 'GET',
                                    scope: this,
                                    success: function(response) {
                                        btn.setDisabled(false);
                                        var result = Ext.decode(response.responseText);
                                        if (result.data.success) {
                                            me.queryOrder();
                                        }else{
                                            if(result.data.msg!="返回数据为空"){
                                                Ext.MessageBox.alert('提取医嘱失败',result.data.msg);
                                            }
                                        }

                                    },
                                    failure: function(response, options) {
                                        btn.setDisabled(false);
                                        Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                                    }
                                });
                            }
                        }
                    },'-',{
                        xtype:'button',
                        iconCls: 'shift-submit',
                        id: me.id+'-shift',
                        scale: 'small',
                        tooltip: '交班',
                        ids:[],
                        handler:function(btn ){
                            me.shiftState();
                        }
                    },{
                        xtype:'button',
                        iconCls: 'shift-confirm',
                        id: me.id+'-shift-confirm',
                        scale: 'small',
                        disabled:true,
                        tooltip: '交班确认',
                        handler:function(){
                            me.shiftConfirm();
                        }
                    },'-',{
                        xtype:'button',
                        id: me.id+'-ac316f30ae7711e3bbdd93b2d441f435',
                        iconCls: 'nws-order-add',
                        scale: 'small',
                        tooltip: '增加医嘱',
                        handler:function(){
                            me.addOrder();
                        }
                    },'-',{
                        scale: 'small',
                        xtype:'button',
                        iconCls: 'tree-dept',
                        isExpand:true,
                        id: me.id+'-tree-fold',
                        tooltip: '折叠',
                        handler:function(btn){
                            if(this.isExpand){
                                this.isExpand=false;
                                me.centerOptions.collapseAll();
                            }else{
                                this.isExpand=true;
                                me.centerOptions.expandAll();
                            }
                        }
                    },'-',{
                        xtype:'button',
                        iconCls: 'delete',
                        scale: 'small',
                        //disabled: true,
                        id: me.id+'-11b2gh45123bnnm67jkfd9cb7044fb71',
                        tooltip: '删除',
                        handler:function(btn){
                            me.deleteOrder();
                        }
                    }, {
                        scale: 'small',
                        xtype:'button',
                        //disabled: true,
                        iconCls: 'recycle',
                        id: me.id+'-recycle',
                        tooltip: '回收站',
                        handler:function(){
                            me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorRecycleWindow', {
                                'patientInfo':me.patientInfo,
                                parent:me,
                                modal:false
                            }));
                        }
                    },{
                        xtype:'button',
                        iconCls: 'doctor-ask-small',
                        scale: 'small',
                        //disabled: true,
                        id: me.id+'-22c2gh45123bnnm67jkfd9cb7044fc82',
                        tooltip: '提取医嘱',
                        handler:function(){
                            me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorExtractWindow', {}));
                        }
                    },{
                        xtype:'button',
                        iconCls: 'doctor-scan',
                        scale: 'small',
                        id: me.id+'-scan',
                        tooltip: '医嘱扫描',
                        handler:function(){
                            
                            var colltime=me.getForm().findField('doctor-order-extract-time').getValue();
                            me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderScanWindow', {
                                colltime:colltime,
                                parent:me,
                                'patientInfo':me.patientInfo
                            }));
                        }
                    }
                ]
            }],
            listeners:{
                destroy:function(_this, eOpts ){
                    me.firstLoad=true;
                    //me.centerOptions.interval(false);
                    //me.centerOptions.intervalByCareInterval(false);
                },
                afterrender:function(_this, eOpts ){
                    // 权限控制医嘱管理
                    /*var resourceData = userInfo.resource;
                    for (var i = 0; i < resourceData.length; i++) {
                        var currButton = Ext.getCmp(me.id +'-'+ resourceData[i].id);
                        if (currButton != undefined) {
                            // 删除医嘱跟回收站的权限绑定到一块
                            if(resourceData[i].id == '11b2gh45123bnnm67jkfd9cb7044fb71') {
                                Ext.getCmp(me.id+'-recycle').setDisabled(false);
                            }
                            currButton.setDisabled(false);
                        }
                    }

                    me.permissionBtns=[];
                    if(Ext.getCmp(me.id+'-22c2gh45123bnnm67jkfd9cb7044fc82').isDisabled()){
                        me.permissionBtns.push(me.id+'-22c2gh45123bnnm67jkfd9cb7044fc82');
                    }
                    if(Ext.getCmp(me.id+'-11b2gh45123bnnm67jkfd9cb7044fb71').isDisabled()){
                        me.permissionBtns.push(me.id+'-11b2gh45123bnnm67jkfd9cb7044fb71');
                        me.permissionBtns.push(me.id+'-recycle');
                    }*/
                }
            }
        });
            me.items = [
            {
            region: 'center',
            padding: '0 0 0 0',
            margin:'0 -1 -1 -1',
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
    queryOrder:function(page){
        var me=this;
        Ext.getCmp(me.id+'-refresh').setDisabled(true);
        var orderForm=me.getForm();
        var colltime=orderForm.findField('doctor-order-extract-time').getValue();
        var status=orderForm.findField('doctor-order-status').getValue();
        var way=orderForm.findField('doctor-order-way').getValue();
        var long=orderForm.findField('doctor-order-type').getValue();
        var treePanel=me.centerOptions;
        var store=treePanel.getStore();
        var patientId=null;
        if(me.patientInfo!=null){
            patientId=me.patientInfo.PATIENT_ID;
        }
        store.queryBtnId=me.id+'-refresh';
        store.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                type:'query',
                extractDate : colltime,
                excete_status:status,
                route_code:way,
                patientId:patientId,
                order_type:long
            });
        });
        treePanel.selectPath('/root');
        //treePanel.setStateWarning(false);
        if(page!=undefined&&page!=null){
            store.loadPage(page);
        }else{
            store.loadPage(1);
        }
        treePanel.loadColumnSToolTip();
    },
    //交班状态设置与恢复
    shiftState:function(){
        var me=this;
        var btn=Ext.getCmp(me.id+'-shift');

        var treePanel=me.centerOptions;
        var childnodes=treePanel.getRootNode().childNodes;
        Ext.suspendLayouts();
        treePanel.suspendEvents();
        if(btn.iconCls=='shift-submit'){
            btn.setIconCls('shift-canel');
            btn.setTooltip('取消交班');
            Ext.getCmp(me.id+'-refresh').setDisabled(true);
            Ext.getCmp(me.id+'-11b2gh45123bnnm67jkfd9cb7044fb71').setDisabled(true);
            Ext.getCmp(me.id+'-22c2gh45123bnnm67jkfd9cb7044fc82').setDisabled(true);
            Ext.getCmp(me.id+'-ac316f30ae7711e3bbdd93b2d441f435').setDisabled(true);
            Ext.getCmp(me.id+'-recycle').setDisabled(true);
            for(var j=0;j<me.permissionBtns.length;j++){
                Ext.getCmp(me.permissionBtns[j]).setDisabled(true);
            }
            Ext.getCmp(me.id+'-scan').setDisabled(true);
            Ext.getCmp(me.id+'-tree-fold').setDisabled(true);
            Ext.getCmp(me.id+'-shift-confirm').setDisabled(false);

            for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
                var nd = childnodes[i];
                if(nd.get('EXECUTION_STATE')!=2){
                    btn.ids.push(nd.get('ID')+':'+nd.get('EXECUTION_STATE'));
                    nd.set('EXECUTION_STATE',3);
                    me.setStateRecursion(3,nd);
                }
            }
        }else{
            btn.setIconCls('shift-submit');
            btn.setTooltip('交班');
            Ext.getCmp(me.id+'-refresh').setDisabled(false);
            Ext.getCmp(me.id+'-11b2gh45123bnnm67jkfd9cb7044fb71').setDisabled(false);
            Ext.getCmp(me.id+'-22c2gh45123bnnm67jkfd9cb7044fc82').setDisabled(false);
            Ext.getCmp(me.id+'-ac316f30ae7711e3bbdd93b2d441f435').setDisabled(false);
            Ext.getCmp(me.id+'-recycle').setDisabled(false);
            for(var j=0;j<me.permissionBtns.length;j++){
                Ext.getCmp(me.permissionBtns[j]).setDisabled(true);
            }
            Ext.getCmp(me.id+'-scan').setDisabled(false);
            Ext.getCmp(me.id+'-tree-fold').setDisabled(false);
            Ext.getCmp(me.id+'-shift-confirm').setDisabled(true);

            for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
                var nd = childnodes[i];
                if(btn.ids.length>0){
                    for(var j=0;j<btn.ids.length;j++){
                        var temp=btn.ids[j].split(':');
                        if(temp[0]==nd.get('ID')){
                            nd.set('EXECUTION_STATE',temp[1]);
                            me.setStateRecursion(temp[1],nd);
                            break;
                        }
                    }
                }else{
                    break;
                }
            }
            btn.ids=[];
        }
        treePanel.resumeEvents();
        Ext.resumeLayouts(true);
    },
    //交班确认处理
    shiftConfirm:function(){
        var me=this;
        var treePanel=me.centerOptions;
        var childnodes=treePanel.getRootNode().childNodes;
        var orders=[],nds=[];
        var btn=Ext.getCmp(me.id+'-shift');
        for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
            var nd = childnodes[i];
            if(nd.get('EXECUTION_STATE')==2){
                continue;
            }
            if(nd.get('IS_SELECTED')&&nd.get('EXECUTION_STATE')==3){
                orders.push({state:3,id:nd.get('ID')});
                nds.push(treePanel.getView().getRecord(nd));
                for(var j=0;j<btn.ids.length;j++){
                    var temp=btn.ids[j].split(':');
                    if(temp[0]==nd.get('ID')){
                        btn.ids.splice(j,1);
                        break;
                    }
                }
            }
        }
        if(orders.length==0){
            Ext.MessageBox.alert('提示', '请选择需要提交的医嘱!');
            return;
        }
        Ext.MessageBox.show({
            title:'提示',
            msg:'交班成功!',
            width:200,
            modal:true,
            buttons:Ext.MessageBox.OK,
            icon:Ext.MessageBox.INFO
        });
        if(orders.length>0){
            Ext.Ajax.request({
                url : webRoot + '/nws/doctorordermanagement/shift_confirm',
                method: 'POST',
                params:{
                    orders:Ext.encode(orders)
                },
                success : function(response){

                    for(var j=0;j<nds.length;j++){
                        nds[j].commit()
                    }
                }
            });
        }
        //btn.ids={};
        me.shiftState();
    },
    //增加医嘱
    addOrder:function(){
        var me=this;
        var treePanel=me.centerOptions;
        var node=treePanel.getRootNode();
        var childnodes = node.childNodes;
        var select=null,orderTitle;
        for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
            var nd = childnodes[i];
            if(nd.get('IS_SELECTED')&&nd.get('PARENT_ID')==null){
                select=nd.get('ID');
                orderTitle=nd.get('CONTENT');
                break;
            }
        }
        me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorDetailWindow', {
            'record':{},
            addOrderTitle:(select?"添加'"+orderTitle+"'子医嘱":""),
            PARENT_ORDER_ID:select,
            'parent':me,
            modal:false
        }));
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
                    names+=nd.get('CONTENT')+',';
                }else{
                    Ext.MessageBox.show({
                        title:'提示',
                        msg:'开始执行，完成执行，交班执行的医嘱不能删除!',
                        width:200,
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
                            var pageNum=me.centerOptions.store.currentPage;
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
    },
    //创建中间treegrid面板
    createCenter: function(){
        var options = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderCenter', {
            parent:this
        });
        return options;
    },
    //递归修改子节点状态
    setStateRecursion:function(state,nd){
        if(nd.childNodes.length>0){
            for(var i=0;i<nd.childNodes.length;i++){
                var node=nd.childNodes[i];
                node.set('EXECUTION_STATE',state);
                /*if(node.childNodes.length>0){
                    setStateRecursion(state,node);
                }*/
            }
        }
    },
    //设置当前病人信息,换人的操作
    setPatientInfo:function(obj){
        var me=this;
        me.patientInfo=obj;
        me.queryOrder();
    },
    findExecuteOrder:function(id,date){
        var me=this;
        var findDate=new Date(date);
        var orderForm=me.getForm();
        orderForm.findField('doctor-order-extract-time').setValue(findDate);

        if(me.firstLoad&&me.findExecuteOrderById&&me.findExecuteOrderById!=""){
            me.firstLoad=false;
            me.locationOrdersById();
        }else{
            me.findExecuteOrderById=id;
            me.findExecuteOrderByDate=Ext.Date.format(findDate,'Y-m-d');

            /*var status=orderForm.findField('doctor-order-status').getValue();
            var way=orderForm.findField('doctor-order-way').getValue();
            var long=orderForm.findField('doctor-order-type').getValue();*/
            Ext.Ajax.request({
                url : webRoot + '/nws/doctorordermanagement/location_order',
                method: 'POST',
                params:{
                    extractDate : me.findExecuteOrderByDate,
                    findId:me.findExecuteOrderById,
                    patientId:me.patientInfo.PATIENT_ID
                },
                success : function(response){
                    var result=Ext.decode(response.responseText);
                    if(result.success){
                        if(result.data!=1){
                            me.queryOrder(result.data);
                        }else{
                            me.queryOrder();
                        }
                    }
                }
            });
        }

    },
    cancelExcuteOrder:function(){
        var me=this;
        if(me.findExecuteOrderById!=null){
            me.nwsApp.nwsToolbar.cancelWarning(me.findExecuteOrderById);
            me.findExecuteOrderById=null;
            me.findExecuteOrderByDate=null;
        }
    },
    locationOrdersById:function(){
        var me=this;
        if(me.findExecuteOrderById!=null){
            me.nwsApp.nwsToolbar.overLoad();
            var treePanel=me.centerOptions;
            var node=treePanel.getRootNode();
            var childnodes = node.childNodes;
            if(childnodes.length>0){
                for(var i=0;i<childnodes.length;i++) {  //从节点中取出子节点依次遍历
                    var nd = childnodes[i];
                    if(nd.get('ID')==me.findExecuteOrderById){
                        setTimeout(function(){
                            treePanel.getSelectionModel().select(nd);
                            me.findExecuteOrderById=null;
                            me.findExecuteOrderByDate=null;
                        },1000);
                        //treePanel.fireEvent('select',nd);
                        break;
                    }
                }
            }
        }
    }
});
