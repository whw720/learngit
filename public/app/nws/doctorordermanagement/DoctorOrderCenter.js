/**
 * 医嘱管理中间页面
 * @author: whw
 * @date: 2014-3-4.
 */

Ext.define('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderCenter', {
    extend: 'Ext.tree.Panel',

    require:[
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderStore',
        'com.dfsoft.icu.dws.doctorordermanagement.PageTreeStore',
    ],
    initComponent: function() {
        var me = this;
        Ext.QuickTips.init();
        var colors={0:'black',1:'red',2:'blue',3:'green'};
        var patientId=null;
        if(me.parent.patientInfo!=null){
            patientId=me.parent.patientInfo.PATIENT_ID;
        }

        me.cookieCol = new Ext.state.CookieProvider();
        Ext.state.Manager.setProvider(me.cookieCol);
        if(me.cookieCol.get('hideColumn')==null){
            me.cookieCol.set('hideColumn',[]);
        }


        me.numberHide=Number(globalBeginTime.substring(0,2));

        me.store = Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderStore',{
            isCenter:true,
            locationDate:me.parent.locationDate,
            findId:me.parent.findExecuteOrderById,
            locationStart:me.parent.locationStart,
            locationPage:me.parent.locationPage,
            centerPanel:me,
            patientId:patientId
        });
        me.indexNum=0;
        me.col=[
            {
                text: '序号',
                dataIndex:'NUM',
                width: 42,
                cls: 'doctor-order-column',
                align: 'center',
                locked: true
            }, {
            text: '选择',
            xtype:'checkcolumn',
            width: 38,
            cls:'doctor-order-column',
            locked:true,
            dataIndex:'IS_SELECTED',
            sortable: false,
            renderer:function(value,metaData ,record ) {
                if (record.data.PARENT_ID==null){
                    return (new Ext.grid.column.CheckColumn).renderer(value);
                } else{
                    return '';
                }
            }
        }, {
            text: '进度',
            width: 38,
            cls:'doctor-order-column',
            tdCls:'doctor-order-td',
            align: 'center',
            dataIndex: 'COMPLETED_PROCESS',
            locked:true,
                autoSizeColumn: false,
            sortable: false,
            renderer:function(value,metaData ,record ){
                if(record.data.PARENT_ID==null){
                    var str='提取日期:'+Ext.Date.format(new Date(record.get('COLLECT_TIME')), 'Y-m-d');
                    if(record.get('EXECUTION_TIME')!=null){
                        str+='   开始时间:'+Ext.Date.format(new Date(record.get('EXECUTION_TIME')), 'Y-m-d H:i');
                    }

                    str+='  完成进度'+((value>=30?30:value)/0.3).toFixed(2)+"%";
                    if(record.get('IS_PUMPS')){
                        str+='\n默认流速:'+record.get('PUMPS_SPEED');
                    }

                    if(record.get('logs')!=null&&record.get('logs').length>0){
                        for(var i=0;i<record.get('logs').length;i++){
                            var log=record.get('logs')[i];
                            str+='\n执行时间:'+log.EXECUTION_TIME.substring(0,log.EXECUTION_TIME.lastIndexOf(':'))+
                                '   完成时间:'+log.EXECUTION_TIME.substring(0,log.EXECUTION_TIME.lastIndexOf(':'))+
                                '   执行量:'+log.DOSAGE+(record.get('IS_PUMPS')?'   执行流速:'+(log.PUMPS_SPEED==undefined?'':log.PUMPS_SPEED):'');
                        }
                    }
                    if(value>30){
                        value=30;
                    }
                    return '<div class="archives-process-green" title="'+str+'"><div class="archives-process-inner-green" style="width: '+value+'px;"></div></div>';
                }else{
                    return '';
                }
            }
        },
            {
                text: '医嘱内容',
                xtype: 'treecolumn',
                dataIndex: 'CONTENT',
                align: 'left',
                minWidth: 195,
                maxWidth: 295,
                flex :1,
                autoSizeColumn: true,
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                locked:true,
                sortable: false,
                renderer:function(val, meta,record){
                    var str=record.get('CONTENT')+(record.get('INSTRUCTION')==null||record.get('INSTRUCTION')==""?"":"\n  执行说明: "+record.get('INSTRUCTION'));
                    var addLine=false;
                    var sn=Ext.Date.format(me.parent.getForm().findField('doctor-order-extract-time').getValue(), 'Y-m-d');
                    if(record.data.PARENT_ID==null){
                        if(record.get('COMPLETION_TIME')!=null&&record.get('TYPE')=='L'){
                            var ss=Ext.Date.format(new Date(record.get('COMPLETION_TIME')), 'Y-m-d');
                            if(ss==sn){
                                addLine=true;
                            }
                        }
                        var text = '<span class="content_a"  title="'+str+'" style="'+(addLine?'text-decoration:line-through':'')+';color:'+colors[record.get('EXECUTION_STATE')]+'">' + val+'</span>' ;
                        return text;
                    }else{
                        if(record.parentNode.get('COMPLETION_TIME')!=null&&record.get('TYPE')=='L'){
                            var ss=Ext.Date.format(new Date(record.parentNode.get('COMPLETION_TIME')), 'Y-m-d');
                            if(ss==sn){
                                addLine=true;
                            }
                        }
                        //record.parentNode
                        var text = '<span class="content_a"  title="'+str+'" style="'+(addLine?'text-decoration:line-through':'')+';color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + val+'</span>' ;
                        return text;
                    }

                }
            }, {
                text: '提取日期',
                width: 75,
                dataIndex: 'COLLECT_TIME',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                locked:true,
                align:'center',
                sortable: false,
                renderer	: 	function(value, meta,record){
                    if(record.data.PARENT_ID==null){
                        if(value.indexOf('0000')>-1){
                            return '';
                        }
                        var dates=String(Ext.Date.format(new Date(value), 'm-d H:i'));
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' +dates+ '</span>';
                    }else{
                        if(value.indexOf('0000')>-1){
                            return '';
                        }
                        var dates=String(Ext.Date.format(new Date(value), 'm-d H:i'));
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' +dates+ '</span>';
                    }
                                    }
            }, {
                text: '剂量',
                dataIndex: 'DOSAGE',
                cls:'doctor-order-column-time',
                tdCls:'doctor-order-td',
                align:'right',
                width: 38,
                locked:true,
                sortable: false,
                renderer:function(val, meta,record){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' + (val==null?"":val) + '</span>';
                    }else{
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + (val==null?"":val) + '</span>';
                    }
                }
            }, {
                text: '单位',
                dataIndex: 'UNIT_CODE',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                width: 38,
                locked:true,
                sortable: false,
                renderer:function(val, meta,record){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' + (val==null?'':val) + '</span>';
                    }else{
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + (val==null?'':val) + '</span>';
                    }

                }
            }, {
                text: '途径',
                dataIndex: 'ROUTE',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                width: 90,
                locked:true,
                sortable: false,
                renderer:function(val, meta,record){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' + (val==null?"":val) + '</span>';
                    }else{
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + (val==null?"":val) + '</span>';
                    }

                }
            }, {
                text: '频次',
                dataIndex: 'FREQUENCY_NAME',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                locked:true,
                width: 50,
                sortable: false,
                renderer:function(val, meta,record){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' + (val==null?'':val) + '</span>';
                    }else{
                        return '<span style="color:'+colors[record.parentNode.get('EXECUTION_STATE')]+'">' + (val==null?'':val) + '</span>';
                    }

                }
            }, {
                text: '总剂量',
                dataIndex: 'DOSAGE_ALL',
                width: 45,
                align:'right',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                locked:true,
                sortable: false,
                renderer:function(value,metaData ,record ){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' +((value==null||value==0)?"":value)+ '</span>';
                    }else{
                        return '';
                    }
                }
            }, {
                text: '交班余量',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                dataIndex: 'YesterdayDosage',
                locked:true,
                sortable: false,
                align:'right',
                width: 55,
                renderer:function(value,metaData ,record ){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' +((value==null||value==0)?"":value)+ '</span>';
                    }else{
                        return '';
                    }
                }
            }, {
                text: '完成量',
                dataIndex: 'DOSAGE_COMPLETED_ALL',
                width: 45,
                align:'right',
                cls:'doctor-order-column',
                tdCls:'doctor-order-td',
                locked:true,
                sortable: false,
                renderer:function(value,metaData ,record ){
                    if(record.data.PARENT_ID==null){
                        return '<span style="color:'+colors[record.get('EXECUTION_STATE')]+'">' +(value==null?'':value)+ '</span>';
                    }else{
                        return '';
                    }
                }
            }];

        Ext.apply(me, {
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            columnLines: true,
            enableColumnHide:true,
            rowLines: true,
            autoScroll:true,
            viewConfig: {
                stripeRows: true
            },
            padding:0,
            border:false,
            autoHeight:true,
            loadMask:false,
            store: me.store,
            defaultAlign:'left',
            selType: 'cellmodel',
            columns: me.col,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 2
                })
            ],
            bbar: Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorOrderPagingToolbar', {
                store: me.store
            }),
            listeners:{
                columnhide:function(ct, column, eOpts){
                    for (var i = 0; i < me.col.length; i++) {
                        var heard = me.col[i];
                        if (heard.dataIndex == column.dataIndex) {
                            me.col[i].hidden=true;

                            var cols=me.cookieCol.get('hideColumn');
                            cols.push(heard.dataIndex);
                            me.cookieCol.set('hideColumn',cols);
                            break;
                        }
                    }
                },
                columnshow:function(ct, column, eOpts){
                    for (var i = 0; i < me.col.length; i++) {
                        var heard = me.col[i];
                        if (heard.dataIndex == column.dataIndex) {
                            me.col[i].hidden = false;
                            break;
                        }
                    }
                    var cols=me.cookieCol.get('hideColumn');
                    for(var i=0;i<cols.length;i++){
                        if(cols[i]==column.dataIndex){
                            cols.splice(i,1);
                            break;
                        }
                    }
                    me.cookieCol.set('hideColumn',cols);
                },

                cellkeydown:function(_this, td, cellIndex, record, tr, rowIndex,e,eOpts){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(e.getKey()==46&&record.get('CONTENT_TYPE')!=2&&(modifiedFieldNames.indexOf('v')==0||modifiedFieldNames.indexOf('hide') == 0)) {
                        me.EditStartCommonHandler(me,record);

                        record.set(modifiedFieldNames, "");
                        var comNum=me.ComputeComNumCommonHandler(record);
                        comNum = Math.round(comNum * 1000) / 1000;




                        var exceteDate = column.tooltip;
                        var completionDate = column.tooltip;
                        var userId = userInfo.userId;
                        var orderId = record.get('ID');
                        var dosage = "";

                        me.EditLogsCommonHandler(record,dosage,exceteDate);

                        //设置完成量
                        record.set('DOSAGE_COMPLETED_ALL', comNum);
                        var precent = (record.get('DOSAGE_ALL') == 0 ?  (comNum > 0 ? 1 : 0) : comNum / record.get('DOSAGE_ALL')) * 100 * 0.3;
                        //设置完成进度，计算出百分比
                        record.set('COMPLETED_PROCESS', precent);

                        //修改状态，递归修改
                        var state = record.get('DOSAGE_ALL') <= comNum ? 2 : 1;
                        if (state == 1 && record.get('EXECUTION_STATE') == 3) {
                            state = record.get('EXECUTION_STATE');
                        }else if(comNum==0){
                            state=0;
                            record.set('EXECUTION_STATE', 0);
                            me.parent.setStateRecursion(0, record);
                        } else {
                            if(state!=record.get('EXECUTION_STATE')){
                                record.set('EXECUTION_STATE', state);
                                me.parent.setStateRecursion(state, record);
                            }
                        }
                        me.EditStopCommonHandler(me,record);
                        var tempPar={
                            url:webRoot + '/nws/doctorordermanagement/add_orderslog',
                            params:{
                                exceteDate: exceteDate,
                                completionDate: completionDate,
                                userId: userId,
                                orderId: orderId,
                                complte: comNum,
                                dosage: dosage,
                                contentType:record.get('CONTENT_TYPE'),
                                state: state
                            }};
                        me.AjaxCommonFun(tempPar,function(result){
                            record.commit();
                        });
                    }
                },
                beforeedit:function( editor, e, eOpts ){
                    if(e.record.data.PARENT_ID!=null){
                        return false;
                    }
                    if(e.record.get('CONTENT_TYPE')==2){
                        return false;
                    }
                },
                edit: function (editor, e) {

                    var temp = e.value;
                    //如果本次结果跟上次一样，不进行保存逻辑
                    if (temp == e.originalValue) {
                        return;
                    }
                    if (e.value == null && e.originalValue == '') {
                        e.record.commit();
                        return;
                    }
                    //如果不是顶级节点，编辑也无效
                    if (e.record.data.PARENT_ID == null) {

                        var comNum=me.ComputeComNumCommonHandler(e.record);
                        comNum = Math.round(comNum * 1000) / 1000;

                        me.EditStartCommonHandler(me, e.record);
                        var exceteDate = e.column.tooltip;//Ext.Date.format(new Date(),'Y-m-d')+' '+ e.column.text;
                        var completionDate = e.column.tooltip;//Ext.Date.format(new Date(),'Y-m-d H:i:s');
                        var userId = userInfo.userId;
                        var orderId = e.record.get('ID');
                        var dosage = temp;

                        me.EditLogsCommonHandler(e.record,dosage,exceteDate);

                        //设置完成量
                        e.record.set('DOSAGE_COMPLETED_ALL', comNum);
                        var precent = (e.record.get('DOSAGE_ALL') == 0 ?  (comNum > 0 ? 1 : 0) : comNum / e.record.get('DOSAGE_ALL')) * 100 * 0.3;
                        //设置完成进度，计算出百分比
                        e.record.set('COMPLETED_PROCESS', precent);

                        //修改状态，递归修改
                        var state = e.record.get('DOSAGE_ALL') <= comNum ? 2 : 1;
                        /*if (state == 1 && e.record.get('EXECUTION_STATE') == 3) {
                            state = 2;//e.record.get('EXECUTION_STATE');
                            e.record.set('EXECUTION_STATE', state);
                            me.parent.setStateRecursion(state, e.record);
                        }else */if(comNum==0){
                            state=0;
                            e.record.set('EXECUTION_STATE', 0);
                            me.parent.setStateRecursion(0, e.record);
                        } else if(state!=e.record.get('EXECUTION_STATE')){
                            if(e.record.get('EXECUTION_STATE')==0){
                                me.parent.cancelExcuteOrder();
                            }
                            e.record.set('EXECUTION_STATE', state);
                            me.parent.setStateRecursion(state, e.record);
                        }
                        me.EditStopCommonHandler(me, e.record);
                        var tempPar={
                            url:webRoot + '/nws/doctorordermanagement/add_orderslog',
                            params:{
                                exceteDate: exceteDate,
                                completionDate: completionDate,
                                userId: userId,
                                orderId: orderId,
                                dosage: dosage,
                                contentType: e.record.get('CONTENT_TYPE'),
                                complte: comNum,
                                state: state
                            }};
                        me.AjaxCommonFun(tempPar,function(result){
                            e.record.commit();
                        });
                        //设置滚动条位置，
                        if((e.colIdx+20)!=me.col.length){
                            me.scrollSuitable(e.view,e.view.el.getScroll(), e.colIdx);
                        }
                    }
                },
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var btn = e.getTarget('.content_a');
                    if(btn){
                        me.createDetail(record);
                    }
                    if(record.get('CONTENT_TYPE')==2&&record.data.PARENT_ID==null){
                        var column=_this.getGridColumns()[cellIndex];
                        var modifiedFieldNames = column.dataIndex;
                        var tooltip = column.tooltip;
                        var dosage=record.get(modifiedFieldNames)==""?1:"";

                        if(modifiedFieldNames.indexOf('v') == 0||modifiedFieldNames.indexOf('hide') == 0){
                            me.EditStartCommonHandler(me,record);
                            //计算完成量
                            var comNum=me.ComputeComNumCommonHandler(record);
                            if(record.get('TYPE')=='L'&&modifiedFieldNames.indexOf('hide') == 0){

                            }else{
                                comNum = Math.round((comNum+(dosage==1?1:-1)) * 1000) / 1000;
                            }

                            //计算完成量结束
                            //添加日志
                            me.EditLogsCommonHandler(record,dosage,tooltip);
                            //添加日志结束
                            //修改状态
                            var state;
                            if(comNum>0){//大于0 完成状态
                                state=2;
                            }else{ //等于0，未执行状态
                                state=0;
                            }
                            if(state!=record.get('EXECUTION_STATE')){
                                record.set('EXECUTION_STATE', state);
                                record.set('COMPLETED_PROCESS', (state==2?30:0));
                                me.parent.setStateRecursion(state, record);
                            }
                            //修改状态结束
                            //修改完成量
                            record.set('DOSAGE_COMPLETED_ALL', comNum);
                            //设置完成量

                            //设置完成量结束

                            record.set(modifiedFieldNames,(dosage==1?true:false));
                            var tempPar={
                                url:webRoot + '/nws/doctorordermanagement/add_orderslog',
                                params:{
                                    exceteDate: tooltip,
                                    completionDate: tooltip,
                                    userId: userInfo.userId,
                                    orderId: record.get('ID'),
                                    content:record.get('CONTENT'),
                                    patientId:record.get('PATIENT_ID'),
                                    dosage: dosage,
                                    contentType:record.get('CONTENT_TYPE'),
                                    complte: comNum,
                                    state: state
                                }};
                            me.AjaxCommonFun(tempPar,function(result){
                                record.commit();
                            });
                            me.EditStopCommonHandler(me,record);
                            //设置滚动条位置，
                            var view=_this;
                            me.scrollSuitable(view,view.el.getScroll(), cellIndex);
                        }

                    }
                },
                afterrender: function (_this, eOpts) {
                    /*var allwidth = _this.up('panel').up('panel').getWidth(),
                        leftwin = me.lockedGrid.getWidth()+100;
                    var startIndex = Math.floor((allwidth - leftwin-40) / 40)-1;*/

                    //增加动态数列，dataInde开始于"date2",共startIndex列
                    me.addColumnsBatchTime();
                    //页面推送设置
                    //me.reConnectSocket();
                    //右键复制
                    var arrCol=me.getCareTimeArrayIndex();
                    me.view.on('cellcontextmenu', function(view, cell, cellIndex, record, row, rowIndex, event) {
                        event.preventDefault();
                        var modifiedFieldNames =  view.getHeaderByCell(cell).dataIndex;

                        if(record.get('CONTENT_TYPE')!=2){

                            for(var i=arrCol.length-1;i>=0;i--){
                                var col=arrCol[i];
                                if(col==modifiedFieldNames){
                                    for(var j=i-1;j>=0;j--){
                                        var findCol=arrCol[j];
                                        var copyValue=record.get(findCol);
                                        if(copyValue!=''&&copyValue!=null){

                                            me.EditStartCommonHandler(me,record);
                                            record.set(modifiedFieldNames,copyValue);
                                            var comNum=me.ComputeComNumCommonHandler(record);
                                            comNum=Math.round(comNum*1000)/1000;

                                            var tooltip= view.getHeaderByCell(cell).tooltip;
                                            var userId=userInfo.userId;
                                            var orderId=record.get('ID');
                                            var dosage=copyValue;

                                            me.EditLogsCommonHandler(record,dosage,tooltip);
                                            //设置完成量
                                            record.set('DOSAGE_COMPLETED_ALL',comNum);
                                            var precent=(record.get('DOSAGE_ALL')==0? (comNum > 0 ? 1 : 0):comNum/record.get('DOSAGE_ALL'))*100*0.3;
                                            //设置完成进度，计算出百分比
                                            record.set('COMPLETED_PROCESS',precent);

                                            //修改状态，递归修改
                                            var state=record.get('DOSAGE_ALL')<=comNum?2:1;
                                            /*if(state==1&&record.get('EXECUTION_STATE')==3){
                                             state=record.get('EXECUTION_STATE');
                                             }else */if(state!=record.get('EXECUTION_STATE')){
                                                record.set('EXECUTION_STATE',state);
                                                me.parent.setStateRecursion(state, record);
                                            }
                                            me.EditStopCommonHandler(me,record);
                                            var tempPar={
                                                url:webRoot + '/nws/doctorordermanagement/add_orderslog',
                                                params:{
                                                    exceteDate:tooltip,
                                                    completionDate:tooltip,
                                                    userId:userId,
                                                    orderId:orderId,
                                                    complte:comNum,
                                                    dosage:dosage,
                                                    contentType:record.get('CONTENT_TYPE'),
                                                    state:state
                                                }};
                                            me.AjaxCommonFun(tempPar,function(result){
                                                record.commit();
                                            });
                                            //滚动条位置
                                            me.scrollSuitable(view,view.el.getScroll(), cellIndex);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    });
                    //从Cookie里面取出值
                    me.setHiddenColumns();
                }
            }
        });
        me.callParent();
    },
    //重新请求SOCKET连接，连接数据
    reConnectSocket:function(){
        var me=this;
        setTimeout(function(){
            var socket = io.connect(parent.webRoot);

            var status=me.parent.getForm().findField('doctor-order-status').getValue();
            var way=me.parent.getForm().findField('doctor-order-way').getValue();
            var long=me.parent.getForm().findField('doctor-order-type').getValue();
            var colltime=Ext.Date.format(me.parent.getForm().findField('doctor-order-extract-time').getValue(), 'Y-m-d')+' 23:59:59';
            // 请求查询数据
            var params = {patientId: me.parent.patientInfo.PATIENT_ID,
                excete_status:status,
                route_code:way,
                order_type:long,
                careTime : Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                endTime:colltime};
            var root=me.getRootNode();
            if(new Date(colltime).getTime()>new Date().getTime()){
                socket.emit('orderFindDataStop', params);
                socket.emit('orderFindData', params);
                socket.on('getOrderData', function (dt) {

                    me.indexNum=root.childNodes.length;
                    for(var i=0;i<dt.length;i++){
                        (function(insertData){
                            if(insertData.PATIENT_ID!=me.parent.patientInfo.PATIENT_ID){
                                return;
                           }
                            var isHave=true;
                            for(var m=0;m<root.childNodes.length;m++){
                                if(root.childNodes[m].get('ID')==insertData.ID){
                                    isHave=false;
                                    break;
                                }
                            }
                            if(isHave){
                                insertData.NUM=me.indexNum;
                                me.indexNum++;
                                var child =root.appendChild(insertData);
                                if(insertData.child_count!=0){
                                    (function(childAdd){
                                        var tempPar={
                                            url:webRoot + '/nws/doctorordermanagement/doctor_orders',
                                            params:{
                                            type: 'scan',
                                                resourceId:insertData.ID,
                                                extractDate: colltime,
                                                patientId: me.parent.patientInfo.PATIENT_ID,
                                                barcode: code
                                        }};
                                        me.AjaxCommonFun(tempPar,function(result){
                                            if (result.length > 0) {
                                                for(var j=0;j<result.length;j++){
                                                    childAdd.appendChild(result[j]);
                                                }
                                            }
                                        });
                                    })(child);

                                }
                            }
                        })(dt[i]);

                    }

                });
            }
        },5000);
    },
    //当编辑完成后，滚动条计算编辑的单元格，并移动滚动条到适当的位置
    scrollSuitable: function (viewL, scr, colIndex) {
        var me = this;
        var leftWidth = me.normalGrid.getWidth(), cellWidth = 40;
        var startCol = scr.left / cellWidth;
        var endCol = Math.round(leftWidth / cellWidth) - 1;
        if (colIndex <= startCol) {
            viewL.scrollBy(-40, 0, true);
        } else if (colIndex >= (endCol + Math.round(startCol))) {
            viewL.scrollBy(40, 0, true);
        }
    },
    //从cookie里面取出隐藏列，设置
    setHiddenColumns:function() {
        var me=this;
        if (me.cookieCol.get('hideColumn').length > 0) {
            for (var i = 0; i <me.cookieCol.get('hideColumn').length;i++){
                var colName=me.cookieCol.get('hideColumn')[i];
                for (var m = 0; m < me.col.length; m++) {
                    var heard = me.col[m];
                    if (heard.dataIndex == colName) {
                        me.col[m].hidden=true;
                        break;
                    }
                }
            }
            me.reconfigure(me.store, me.col);

        }
    },
    //详细医嘱弹出提示框
    createDetail:function(record){
        var me=this;
        me.parent.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.doctorordermanagement.DoctorDetailWindow', {
            'record':record.data,
            parent:me.parent,
            modal:false
        }));
    },

    /**
     * 页面加载时批量生成时间列，时间列不能超过当前日期
     */
    addColumnsBatchTime:function(){
        var me=this;
        var arrCol=me.getCareTimeArray();
        var arrColIndex=me.getCareTimeArrayIndex();
        var colltime=me.parent.getForm().findField('doctor-order-extract-time').getValue();
        var datestr=Ext.Date.format(colltime, 'Y-m-d');
        var nowTime=new Date();
        var displayHidden=((Number(Ext.Date.format(nowTime, 'H'))>=me.numberHide)?true:false);
        for (var i = 0; i <arrCol.length; i++) {
            if(i>=24){
                datestr=Ext.Date.format(new Date(colltime.getTime()+24 * 60 * 60 * 1000), 'Y-m-d');
            }
            if(new Date(datestr+' '+arrCol[i]).getTime()<nowTime.getTime()){
                me.col.push(me.getColumnNumber(arrCol,arrColIndex,i,displayHidden,datestr));
            }
        }
        me.reconfigure(me.store, me.col);
    },
    /**
     * 查询时，根据查询日期生成时间列,但是列不能超过当前时间
     */
    loadColumnSToolTip:function(){
        var me=this;
        var arrCol=me.getCareTimeArray();
        var arrColIndex=me.getCareTimeArrayIndex();
        var colltime=me.parent.getForm().findField('doctor-order-extract-time').getValue();
        var datestr=Ext.Date.format(colltime, 'Y-m-d');
        var nowTime=new Date();
        var displayHidden=((Number(Ext.Date.format(nowTime, 'H'))>=me.numberHide)?true:false);
        for (var i = 0; i <arrCol.length; i++) {
            if(i>=24){
                datestr=Ext.Date.format(new Date(colltime.getTime()+24 * 60 * 60 * 1000), 'Y-m-d');
            }
            if(new Date(datestr+' '+arrCol[i]).getTime()<nowTime.getTime()){
                if(me.col.length<=12+i){
                    me.col.push(me.getColumnNumber(arrCol,arrColIndex,i,displayHidden,datestr));
                }else{
                    me.col[12+i].tooltip=datestr+' '+arrCol[i];
                }
            }else{
                if(me.col.length>12+i){

                    var delCount=me.col.length-12-i;
                    me.col.splice(12+i,delCount);
                }
            }

        }
        me.reconfigure(me.store, me.col);
    },
    /**
     * 返回添加column的对象。免得loadColumnSToolTip再重写一遍
     * @param arrCol
     * @param arrColIndex
     * @param i
     * @param displayHidden
     * @param datestr
     */
    getColumnNumber: function (arrCol, arrColIndex, i, displayHidden, datestr) {
        var me=this;

        var returnCol = {
            text: arrCol[i] == '00:00' ? '24:00' : arrCol[i],
            dataIndex: arrColIndex[i],
            sortable: false,
            lockable: false,
            hidden: ((i < me.numberHide && displayHidden) ? true : false),
            cls: 'doctor-order-column-time',
            tdCls: 'doctor-order-td-time',
            tooltip: datestr + ' ' + arrCol[i],
            width: 40,
            align: 'right',
            editor: {xtype: 'numberfield',
                decimalPrecision: 3,
                minValue:0,
                negativeText:'不能输入负数',
                maxLength:10,
                maxLengthText:"最大不能超过10位数",
                hideTrigger: true
            },
            renderer: function (value, metaData, record, rowIndex, colIndex) {
                if (record.get('CONTENT_TYPE') == 2) {
                    if (record.get('PARENT_ID') == null) {
                        return '<span style="padding-right:12px;display:block;padding-top: 3px;">' + (new Ext.grid.column.CheckColumn).renderer((value == 1 ? 'checked' : false)) + '</span>';
                    } else {
                        return "";
                    }
                } else {
                    if (record.get('DOSAGE_ALL') != 0 && record.get('DOSAGE_ALL') < record.get('DOSAGE_COMPLETED_ALL')) {
                        return '<span style="color:#FF8000">' + (value == null ? '' : value) + '</span>';
                    } else {
                        return value;
                    }
                }
            }
        };
        return returnCol;
    },
    /**
     * 重构代码，将AJAX请求做统一函数处理。节省时间
     * @param paramsObj
     * @param callback
     * @constructor
     */
    AjaxCommonFun:function(paramsObj,callback){
        Ext.Ajax.request({
            url: paramsObj.url,
            method: 'POST',
            params: paramsObj.params,
            success: function (response) {
                var result1 = Ext.decode(response.responseText);
                if (result1.success) {
                    callback(result1.data);
                }
            }
        });
    },
    /**
     * 重构代码，对完成量计算做统一的处理
     * @param me
     * @param record
     * @param dosage
     * @param tooltip
     * @constructor
     */
    ComputeComNumCommonHandler:function(record){
        //计算完成量
        var comNum = record.get('DOSAGE_COMPLETED');
        for (var valueName  in  record.data) {
            if (valueName.indexOf('v') == 0) {
                comNum += Number(record.get(valueName));
            }

            if(record.get('TYPE')=='S'&&valueName.indexOf('hide') == 0){
                comNum += Number(record.get(valueName));
            }
        }
        //计算完成量结束
        return comNum;
    },
    /**
     * 重构代码，对日志的增删改做处理计算做统一的处理
     * @param me
     * @param record
     * @param dosage
     * @param tooltip
     * @constructor
     */
    EditLogsCommonHandler:function(record,dosage,tooltip){
        //添加日志
        var logss = record.get('logs'), flag = false;
        for (var i = 0; i < logss.length; i++) {
            var log = logss[i];
            if (Ext.Date.format(new Date(log.EXECUTION_TIME), 'Y-m-d H:i') == tooltip) {
                if (dosage == null || dosage == '') {
                    logss.splice(i, 1);
                } else {
                    log.DOSAGE = dosage;
                }
                flag = true;
                break;
            }
        }
        if (!flag) {
            logss.push({EXECUTION_TIME: tooltip + ":00", COMPLETION_TIME: tooltip + ":00", DOSAGE: dosage, PUMPS_SPEED: record.get('PUMPS_SPEED')})
        }
    },
    /**
     * 重构代码，对开始做编辑，关掉页面重绘，面板和record的事件处理，加快编辑速度
     * @param me
     * @param record
     * @param dosage
     * @param tooltip
     * @constructor
     */
    EditStartCommonHandler:function(me,record){
        //关掉EXT页面重绘功能
        Ext.suspendLayouts();
        me.suspendEvents();
        me.store.suspendEvents();
        record.suspendEvents();
    },
    /**
     * 重构代码，对结束做编辑，打开页面重绘，面板和record的事件处理，加快编辑速度
     * @param me
     * @param record
     * @param dosage
     * @param tooltip
     * @constructor
     */
    EditStopCommonHandler:function(me,record){
        //打开EXT页面重绘
        record.resumeEvents();
        me.store.resumeEvents();
        me.resumeEvents();
        Ext.resumeLayouts(true);
    },
    /**
     * 得到护理列的数组
     */
     getCareTimeArray:function(){
        var endTime = globalEndTime.substring(0, 2)+":00";
        var arrCol=['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
            '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'
            ];
       if(endTime=="23:00"){
           return arrCol;
       }
       for(var i=0;i<24;i++){
            var str=(i>=10?i+":00":"0"+i+":00");
            if(str<=endTime){
                arrCol.push(str);
            }else{
                break;
            }
        }
        return arrCol;
    },
    /**
     * 得到护理列的数组
     */
    getCareTimeArrayIndex:function(){
        var arrColIndex=[];
        for(var i=0;i<24;i++){
            var str=(i>=10?"hide"+i:"hide0"+i);
            var beginTimeStr="hide"+globalBeginTime.substring(0, 2);
            if(str<beginTimeStr){
                arrColIndex.push(str);
            }else{
                var vstr=(i>=10?"v"+i:"v0"+i);
                arrColIndex.push(vstr);
            }
        }
        if(globalBeginTime.indexOf('00')==0){
            return arrColIndex;
        }
        for(var i=0;i<24;i++){
            var str=(i>=10?"v"+i:"v0"+i);
            var endTimeStr="v"+globalEndTime.substring(0, 2);
            if(str<=endTimeStr){
                arrColIndex.push(str);
            }else{
                break;
            }
        }
        return arrColIndex;
    }
})

