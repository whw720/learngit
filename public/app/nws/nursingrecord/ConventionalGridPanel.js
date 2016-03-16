/**
 * Created by whw on 14-6-20.
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalGridPanel',{
    extend 	: 'Ext.panel.Panel',
    alias	: 'widget.conventionalgridpanel',

    requires	: ['com.dfsoft.icu.nws.nursingrecord.ConventionalStore',
        'com.dfsoft.icu.nws.nursingrecord.ConventionalToolbar',
        'com.dfsoft.icu.nws.nursingrecord.NursingRecordWindow',
        'com.dfsoft.icu.nws.nursingscores.ScorePopWindow',
        'com.dfsoft.icu.nws.nursingrecord.ConventionalComboStore'],
    initComponent: function () {
        var me = this;

        me.careContentPreset = "4db35a85c37611e39dd9e41f1364eb96"; // 护理内容预置项ID
        me.enterNumPreset  = '337d27b9c37611e39dd9e41f1364eb96'; // 入量.量预置项ID
        me.outNumPreset = '278366bfc60e11e395078c89a5769562'; // 出量.量预置项ID

        Ext.QuickTips.init();
        me.conventionalToolbar = new com.dfsoft.icu.nws.nursingrecord.ConventionalToolbar(
            {region: 'north', nursingRecordApp: me});
        Ext.apply(me,{
            layout:'fit',
            batchUpdateFields:false,
            dockedItems	: me.conventionalToolbar,
            items:[{
                xtype:'panel'
            }
            ],
            listeners:{
                afterrender:function(){
                    if(Ext.util.Cookies.get("monitorItemStr")!=null){
                        Ext.Ajax.request({
                            url: '/nws/nursingRecord/conventional/beditem',
                            scope: this,
                            method: 'POST',
                            params: {
                                json:me.conventionalToolbar.getMonitorCookie(),
                                register_id: me.patientInfo.REGISTER_ID
                            },
                            success: function (response) {
                                var result = Ext.decode(response.responseText);
                                if(result.data!=null&&result.data!="") {
                                    me.conventionalToolbar.bedItemTree.selectCode(result.data,me.patientInfo.BED_ID);
                                    me.queryGrid(result.data);
                                }else{
                                    me.queryGrid();
                                }
                            }
                        });
                    }else{
                        me.queryGrid();
                    }
                    me.reConnectSocket();
                }
            }
        });
        me.callParent();
    },
    queryGrid:function(showColumn){
        var me=this;
        //遮罩效果
        //me.conventionalToolbar.loadMask.show();
        me.bedItemArray = [];
        me.bedItemArray.push(me.careContentPreset);
       // me.bedItemArray.push(null);
        var year = me.conventionalToolbar.getEndDateTime().getFullYear();

        //请求护理记录列
        Ext.Ajax.request({
            url: '/icu/nursingRecord/conventional/columns',
            method: 'POST',
            scope: this,
            params: {
                registerId:me.patientInfo.REGISTER_ID,
                careContent:me.careContentPreset,
                showcolumns:showColumn
            },
            success: function(response) {
                var resJson = Ext.decode(response.responseText);
                var data = resJson.data;
                me.fields = data[0].fields;
                me.columns = me.analyzeColumn(data[0].columns, me);

                var timeColumn = {
                    text     : year+'年',
                    locked   : true,
                    menuDisabled:true,
                    columns  : [{
                        text     : '日期',
                        align    : 'center',
                        width    : 55,
                        sortable : false,
                        menuDisabled:true,
                        dataIndex: 'CARE_TIME',
                        renderer : me.formatDate
                    },{
                        text     : '时分',
                        align    : 'center',
                        width    : 55,
                        sortable : false,
                        menuDisabled:true,
                        dataIndex: 'CARE_TIME',
                        renderer : me.formatTime
                    }]};

                me.columns.unshift(timeColumn);
                me.columns.push({
                    text     : '护理内容',
                    align    : 'left',
                    style    : 'text-align:center',
                    width    : 100,
                    cls:'icon-care-record-column-css',
                    sortable : false,
                    menuDisabled:true,
                    dataIndex: me.careContentPreset,
                    renderer : me.formatCare
                });

                //添加分页代码开始
                if(me.store){
                    me.store.model.setFields(me.fields);
                    me.gridpanel.reconfigure(me.store,me.columns);
                    me.pagingBar.bindStore(me.store);
                    me.gridpanel.patientInfo=me.patientInfo;
                    /*Ext.Ajax.request({
                        url: webRoot + '/icu/nursingRecord/conventional/all',
                        params: {
                            registerId: this.patientInfo.REGISTER_ID,
                            startTime: this.conventionalToolbar.getBeginDateTime(),
                            endTime: this.conventionalToolbar.getEndDateTime(),
                            careContent: this.careContentPreset,
                            bedItemArray: this.bedItemArray,
                            //userId : userInfo.userId,
                            start: 0,
                            limit: 25
                        },
                        method: 'POST',
                        scope: this,
                        success: function (response) {
                            var result = Ext.decode(response.responseText);
                            me.store.loadData(result.data);
                        }
                    });*/
                }else{
                    Ext.define('careRecordModel',{
                        extend : 'Ext.data.Model',
                        fields : me.fields
                    });
                    me.store = Ext.create('com.dfsoft.icu.nws.nursingrecord.ConventionalStore',
                        {model : 'careRecordModel', nursingRecordApp: me});
                    me.pagingBar= Ext.create('Ext.PagingToolbar', {
                        store: me.store,
                        displayMsg: '共{2}条',
                        displayInfo: true,
                        emptyMsg: '无数据',
                        items: [  '->', '提示：点击"Delete"键进行删除']
                    });
                    me.gridpanel=Ext.create('com.dfsoft.icu.nws.nursingrecord.ConventionalGrid', {
                        parent:me,
                        patientInfo:me.patientInfo,
                        conventionalToolbar:me.conventionalToolbar,
                        columns:me.columns,
                        nwsApp:me.nwsApp,
                        store:me.store,
                        bbar:me.pagingBar
                    });
                    me.remove(me.down('panel'));
                    me.add(me.gridpanel);
                }
                me.store.loadPage(1);
                //me.store.loadData(1);
                //添加分页代码结束

                //请求护理记录数据
                /*Ext.Ajax.request({
                    url: webRoot + '/icu/nursingRecord/conventional/all',
                    params: {
                        registerId : this.patientInfo.REGISTER_ID,
                        startTime : this.conventionalToolbar.getBeginDateTime(),
                        endTime: this.conventionalToolbar.getEndDateTime(),
                        careContent : this.careContentPreset,
                        bedItemArray : this.bedItemArray,
                        //userId : userInfo.userId,
                        start:0,
                        limit:25
                    },
                    method: 'POST',
                    scope: this,
                    success: function(response) {
                        var result = Ext.decode(response.responseText);
                        me.store = Ext.create('com.dfsoft.icu.nws.nursingrecord.ConventionalStore',
                            {fields : me.fields, nursingRecordApp: me});//, data : result.data
                        me.pagingBar= Ext.create('Ext.PagingToolbar', {
                            store: me.store,
                            displayMsg: '共{2}条',
                            displayInfo: true,
                            emptyMsg: '无数据'
                        });
                        me.gridpanel=Ext.create('com.dfsoft.icu.nws.nursingrecord.ConventionalGrid', {
                            parent:me,
                            patientInfo:me.patientInfo,
                            conventionalToolbar:me.conventionalToolbar,
                            columns:me.columns,
                            nwsApp:me.nwsApp,
                            store:me.store,
                            bbar:me.pagingBar
                        });
                        me.remove(me.down('panel'));
                        me.add(me.gridpanel);
                        me.store.loadData(result.data);
                        //隐藏loadmask
                        me.conventionalToolbar.loadMask.hide();

                    },
                    failure: function(response, options) {
                        Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                    }
                });*/


            },
            failure: function(response, options) {
                Ext.MessageBox.alert('提示', '获取护理记录常规表头失败,请求超时或网络故障!');
            }
        });
    },
    // 解析表头，设置下拉框编辑器和报警
    analyzeColumn : function(columns, me){
        if(null != columns && columns.length>0){
            for(var i=0; i<columns.length; i++){
                var col = columns[i];
                if(col.text=='出量'){
                    col.text+='&nbsp;<a href="javascript:Ext.getCmp(\''+me.getId()+'\').addQuliangItem(\''+me.patientInfo.REGISTER_ID+'\')"><img src="/images/add.png" title="增加出量项目" style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>'
                }
                if(col.columns){
                    if(col.columns.length==1){
                        col.cls='care-record-column';
                    }
                    me.analyzeColumn(col.columns, me);
                }else{
                    if(col.dataIndex != 'CARE_TIME'){
                        me.bedItemArray.push(col.dataIndex);
                    }
                    // 添加下拉框
                    if(col.inputType == 1){
                        // 取值范围类型：M，手工维护，S系统字典
                        if(col.rangeType == 'M'){
                            var comboStore = Ext.create('com.dfsoft.icu.nws.nursingrecord.ConventionalComboStore',{
                                registerId : this.patientInfo.REGISTER_ID, dataIndex : col.dataIndex
                            });
                            col.editor = {
                                xtype: 'combobox',
                                typeAhead: true,
                                displayField:'DISPLAY_NAME',
                                valueField  :'ITEM_VALUE',
                                queryMode: 'local',
                                listConfig:{
                                    cls:'care-combo-list-color'
                                },
                                editable : (col.allowEdit==1 ? true:false),
                                store   : comboStore,
                                listeners : {
                                    focus : function(_this){
                                        _this.store.filterBy(function(record,id){
                                            return true;
                                        });
                                        _this.expand();
                                    },
                                    beforequery:function(e, eOpts ){
                                        var combo = e.combo;
                                        var value = e.query;
                                        if(value!=''){

                                            if(value.indexOf(',')>0){
                                                var arrV=value.split(',');
                                                value=arrV[arrV.length-1];
                                            }
                                            if(!e.forceAll){
                                                combo.store.filterBy(function(record,id){
                                                    var text = record.get('DISPLAY_NAME');
                                                    var helpCode = record.get('HELPER_CODE');
                                                    if(helpCode.length>0){
                                                        return (text.indexOf(value.toUpperCase())==0)||(helpCode.indexOf(value.toUpperCase())==0);
                                                    }
                                                });
                                            }
                                            value='';
                                            combo.expand();
                                            return false;
                                        }else{
                                            combo.store.filterBy(function(record,id){
                                                return true;
                                            });
                                            combo.expand();
                                        }
                                    },
                                    beforeselect:function(_combo, record, index, eOpts){
                                        var re=_combo.findRecordByDisplay(_combo.getRawValue());
                                        if(!re){
                                            _combo.editValue=_combo.getRawValue();
                                        }

                                    },
                                    select:function(_combo, records, eOpts ){
                                        if(_combo.editValue&&_combo.editable&&_combo.multiSelect){
                                            var rStr='';
                                            if(_combo.editValue.lastIndexOf(',')==_combo.editValue.length-1){
                                                rStr=_combo.editValue+_combo.getRawValue()
                                            }else if(_combo.editValue.lastIndexOf(',')>0){
                                                rStr=_combo.editValue.substr(0,_combo.editValue.lastIndexOf(',')) +','+_combo.getRawValue()
                                            }else{
                                                rStr=_combo.getRawValue();
                                            }
                                            //var rStr=_combo.editValue+','+_combo.getRawValue();
                                            var rawArr=rStr.split(','),ra={},reStr='';
                                            for(var i=0;i<rawArr.length;i++){
                                                var r=rawArr[i].trim();
                                                if(ra[r]==null){
                                                    ra[r]=r;
                                                }
                                            }
                                            for(var s in ra){
                                                reStr+=ra[s]+', '
                                            }
                                            reStr=reStr.substr(0,reStr.length-2);

                                            _combo.setRawValue(reStr);
                                            _combo.editValue=null;
                                        }
                                        console.log(_combo.getRawValue());
                                        console.log(_combo.getValue());
                                    }
                                }
                            };
                            (function(col, comboStore) {
                                col.renderer = function(value) {
                                    return comboStore.toComboxValue(value, comboStore);
                                };
                            })(col, comboStore);

                            if(col.allowMulit == 1){
                                col.editor.multiSelect = true;
                            }else {
                                col.editor.multiSelect = false;
                            }

                        }else{
                            // 添加数据字典控件
                            if(col.rangeSource = 'dic_drugs_route'){
                                var store = new Ext.data.Store({
                                    fields: ['code', 'name'],
                                    proxy: {
                                        type: 'ajax',
                                        url: webRoot+'/nws/doctorordermanagement/drugs_rote?dic=ROUTE',
                                        reader: {
                                            type: 'json',
                                            root: 'data'
                                        }
                                    },
                                    autoLoad:true,
                                    toDictionaryValue : function(value){
                                        if(value != null && value.length>0){
                                            try{
                                                var obj = Ext.decode(value);
                                                if(obj.name == undefined){
                                                    value = me.formatCombox(value, 'name', 'code', store);
                                                }else{
                                                    value = obj.name;
                                                }
                                            }catch (e){
                                                value = me.formatCombox(value, 'name', 'code', store);
                                            }
                                        }
                                        return value;
                                    }
                                })
                                col.editor = {
                                    xtype: 'combobox',
                                    typeAhead: true,
                                    autoShow : true,
                                    displayField:'name',
                                    valueField  :'code',
                                    queryMode: 'local',
                                    listConfig:{
                                        cls:'care-combo-list-color'
                                    },
                                    editable : false,
                                    store   : store,
                                    listeners : {
                                        focus: function (_this) {
                                            _this.expand();
                                        }
                                    }
                                };
                                if(col.allowMulit == 1){
                                    col.editor.multiSelect = true;
                                }else {
                                    col.editor.multiSelect = false;
                                }
                                col.renderer = col.editor.store.toDictionaryValue;
                            }
                        }
                    }else if(col.inputType == 2){
                        col.xtype = 'checkcolumn';
                        col.editor = {
                            xtype: 'checkbox',
                            cls: 'x-grid-checkheader-editor'
                        };
                        /*col.renderer=function(value,metaData ,record ) {
                         return (new Ext.grid.column.CheckColumn).renderer(value);
                         }*/
                    }
                    if(col.dataFormat != undefined&&col.dataFormat==2){
                        col.renderer=function(value){
                            return value?Ext.Date.format(new Date(value), 'Y-m-d H:i'):'';
                        }

                    }
                    // 添加报警
                    (function(formulaStr,colWarn){
                        var description = colWarn.description;
                        if(formulaStr != null && formulaStr != ''){
                            var formulaRes = false;
                            var desText = '';
                            var arrStr = formulaStr.split('|');
                            var arrDes = description.split('|');

                            colWarn.renderer = function(value){
                                if(value != null && value != ''){
                                    for(var i=0; i<arrStr.length; i++){
                                        var formulaObj = Ext.decode(arrStr[i]);
                                        var f2;
                                        try {
                                            f2=(new Function("return "+formulaObj.FORMULA_FUNCTION))();
                                        } catch (e) {
                                            f2=null;
                                        }
                                        if(f2==null){
                                            return value;
                                        }
                                        //var f2=(new Function("return "+formulaObj.FORMULA_FUNCTION))();
                                        var res =null;
                                        if(colWarn.inputType == 1){
                                            var valStr=Ext.decode(value).id;
                                            if(valStr.indexOf(',')>0){
                                                var valStrArr=valStr.split(',');
                                                for(var m=0;m<valStrArr.length;m++){

                                                    res=f2(valStrArr[m]);
                                                    if(res!=false){
                                                        break;
                                                    }
                                                }
                                            }else{
                                                try {
                                                    res=f2(Ext.decode(value).id);
                                                } catch (e) {
                                                    return value;
                                                }

                                            }
                                        }else{
                                            try {
                                                res=f2(value);
                                            } catch (e) {
                                                return value;
                                            }
                                        }
                                        if(res != false){
                                            formulaRes = res;
                                            desText = arrDes[i];
                                            break;
                                        }else{
                                            formulaRes = false;
                                        }
                                    }
                                    if(colWarn.inputType == 2){
                                        value=(new Ext.grid.column.CheckColumn).renderer(value);
                                    }else if(colWarn.inputType == 1){
                                        if(colWarn.rangeType == 'M'){
                                            value=colWarn.editor.store.toComboxValue(value, colWarn.editor.store);
                                        }else if(colWarn.rangeSource = 'dic_drugs_route'){
                                            value=colWarn.editor.store.toDictionaryValue
                                        }
                                    }
                                    if(formulaRes != false){

                                        return '<img src="/app/sys/settings/images/colors/'+formulaRes+'.png"' +
                                            ' style="margin-top: -1px; margin-left: -5px;" align="left" title="'+desText+'">' + value;
                                    }else{
                                        return value;
                                    }
                                }else{
                                    if(colWarn.inputType == 2){
                                        value=(new Ext.grid.column.CheckColumn).renderer(value);
                                    }
                                    return value;
                                }

                            };
                            colWarn.align = 'right';
                        }
                    })(col.formula,col);

                    // 评分
                    if(col.dataSourceCode == '23hace90fdad11e2b0ab11ca6e32t6x1'){
                        col.renderer = me.formatScore;
                    }

                    // 护理内容renderer : me.formatCare
                    if(col.dataIndex == '4db35a85c37611e39dd9e41f1364eb96'){
                        col.renderer = me.formatCare;
                    }
                }
            }
        }
        return columns;
    },
    formatDate : function (value, metaData, record, rowIdx, colIdx, store, view){
        metaData.tdAttr = 'data-qtip="' + Ext.Date.format(new Date(value), 'Y-m-d H:i:s') + '"';
        var monday = value ? Ext.Date.format(new Date(value), 'm-d') : '';
        if(rowIdx != 0){
            var upRecord = store.getAt(rowIdx-1);
            var upMonday = upRecord.get('CARE_TIME') ? Ext.Date.format(new Date(upRecord.get('CARE_TIME')), 'm-d') : '';
            if(monday == upMonday){
                return '';
            }else {
                return monday;
            }
        }else{
            return monday;
        }
    },
    formatTime : function (value, metaData){
        metaData.tdAttr = 'data-qtip="' + Ext.Date.format(new Date(value), 'Y-m-d H:i:s') + '"';
        return value ? Ext.Date.format(new Date(value), 'H:i') : '';
    },
    formatCare : function(value, metaData, record, rowIdx, colIdx, store, view){
        if(value !=null && value.length > 0){
            var obj = Ext.decode(value);
            if(obj != null){
                if(obj.content != undefined && obj.content != ''){
                    value = base64_decode(obj.content);
                }else if(obj.summary != undefined && obj.summary != ''){
                    value = base64_decode(obj.summary);
                }else if(obj.conclusion != undefined && obj.conclusion != ''){
                    if(typeof obj.conclusion == "object"){
                        value= record.get('CHECKHAVE');
                    }else{
                        value = base64_decode(obj.conclusion);
                    }
                }else{
                    value= record.get('CHECKHAVE');
                }
            }
        }
        var title = "设置护理内容";
        if(value != '' &&value != ' ' && value !=null){
            metaData.tdAttr = 'data-qtip="' + value + '"';
        }else{
            metaData.tdAttr = 'data-qtip=""';
        }

        if(value != null && value != '' && value != ' '){
            return value;
        }else{
            return '<a href="#">' +
                '<img src="/app/nws/nursingrecord/images/dot.png" ' +
                'title='+title+' style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
        }
    },
    formatScore : function(value){
        if(value != null && value.length>0){
            try {
                var jsonObj = Ext.decode(value);
                if(jsonObj.showType == 1){
                    value = jsonObj.score;
                }else{
                    value = jsonObj.items;
                }
            }catch (e){
                var title = "设置护理评分";
                return '<a href="#">' +
                    '<img src="/app/nws/nursingrecord/images/dot.png" ' +
                    'title='+title+' style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
            }
            return value;
        }else{
            var title = "设置护理评分";
            return '<a href="#">' +
                '<img src="/app/nws/nursingrecord/images/dot.png" ' +
                'title='+title+' style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
        }
    },
    // 下拉框值解析
    formatCombox : function (value, displayField, valueField, store){
        if(typeof value == 'object'){
            var str = "";
            for(var i=0; i<value.length; i++){
                var index = store.find(valueField, value[i]);
                if(index == -1){
                    return '';
                }
                str += store.getAt(index).get(displayField)+",";
            }
            value = str.substring(0, str.length-1);
        }else{
            var index = store.find(valueField, value);
            if(index == -1){
                return '';
            }
            value = store.getAt(index).get(displayField);
        }
        return value;
    },
    //重新请求SOCKET连接，连接数据
    reConnectSocket:function(){
        var me=this;
        var end_itme=me.conventionalToolbar.getEndDateTime();
        setTimeout(function(){
            var socket = io.connect(parent.webRoot);

            socket.emit('careRecordFindDataStop', params);
            // 请求查询数据
            var params = {registerId: me.patientInfo.REGISTER_ID,
                careTime : Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                careContent : me.careContentPreset, bedItemArray : me.bedItemArray,endTime:Ext.Date.format(end_itme, 'Y-m-d H:i:s')};
            socket.emit('careRecordFindData', params);
            socket.on('getCareRecordData', function(dt) {
                end_itme=me.conventionalToolbar.getEndDateTime();
                if(new Date(end_itme).getTime()>new Date().getTime()){
                    // 判断数据是否在查询条件的时间段内
                    var allLen=me.store.getCount();
                    for(var i=0; i<dt.length; i++){
                        var flag=false;
                        for(var m=0;m<allLen;m++){
                            if(me.store.getAt(m).get('CARE_TIME')==dt[i].CARE_TIME&&me.store.getAt(m).get('REGISTER_ID')==dt[i].REGISTER_ID){
                                flag=true;
                                break;
                            }
                        }
                        if(!flag){
                            me.store.add(dt[i]);
                        }
                    }

                }
            });
        },5000);
    },
    copyCelltoDown:function(record){
        var me=this;
        var modifiedFieldNames = me.gridpanel.selectField;
        var care_value = (record.get(modifiedFieldNames)==null?'':record.get(modifiedFieldNames));
        var careTime = null;
        var id = record.get('CARE_TIME');
        if(modifiedFieldNames=='CARE_TIME'){
            Ext.MessageBox.alert('提示', '不能一键复制时间列!');
            return;
        }
        if(modifiedFieldNames==me.careContentPreset){
            Ext.MessageBox.alert('提示', '不能一键复制护理内容!');
            return;
        }
        Ext.Msg.confirm('提示', '确定要复制该单元格内容到以下单元格？', function(btn) {
            if (btn === 'yes') {
                var end_itme='';


                //关掉EXT页面重绘功能
                Ext.suspendLayouts();
                me.gridpanel.suspendEvents();
                me.store.suspendEvents();

                var len=me.store.getCount();
                var start=false;
                var changeRecords=[];
                for(var i=0;i<len;i++){
                    var da=me.store.getAt(i);
                    if(da.get('CARE_TIME')==id){
                        start=true;
                        continue;
                    }
                    if(start){
                        if(careTime==null){
                            careTime=da.get('CARE_TIME');
                        }
                        da.set(modifiedFieldNames,care_value);
                        changeRecords.push(da.get('CARE_TIME'));
                        end_itme=da.get('CARE_TIME');
                    }
                }
                me.store.commitChanges();
                //打开EXT页面重绘
                me.store.resumeEvents();
                me.gridpanel.reconfigure(me.store);
                me.gridpanel.resumeEvents();
                Ext.resumeLayouts(true);


                Ext.Ajax.request({
                    url : webRoot + '/icu/nursingRecord/conventional/copy_records',
                    method: 'POST',
                    params:{
                        userId:userInfo.userId,
                        care_value:care_value,
                        register_id:me.patientInfo.REGISTER_ID,
                        dataIndex:modifiedFieldNames,
                        start_time:careTime,
                        end_time:end_itme,
                        changeRecords:changeRecords
                    },
                    success : function(response){
                        //me.store.commitChanges();
                    }
                });
            }
        });
    },
    addQuliangItem:function(id, type, name, code) {
        var me=this;
        var dlg = Ext.create('com.dfsoft.icu.nws.nursingrecord.AddQuliangWindow', {
            registerId: id,
            parent:me
        });
        me.nwsApp.showModalWindow(dlg);
        //dlg.show();
    }

});
