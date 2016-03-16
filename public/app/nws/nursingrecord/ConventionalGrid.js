/**
 * 定义护理记录常规grid
 *
 * @author chm
 * @version 2014-3-3
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalGrid',{
    extend 	: 'Ext.grid.Panel',
    alias	: 'widget.conventionalgrid',

    requires	: ['com.dfsoft.icu.nws.nursingrecord.ConventionalStore',
        'com.dfsoft.icu.nws.nursingrecord.ConventionalToolbar',
        'com.dfsoft.icu.nws.nursingrecord.NursingRecordWindow',
        'com.dfsoft.icu.nws.nursingscores.ScorePopWindow',
        'com.dfsoft.icu.nws.nursingrecord.ConventionalComboStore'],

    initComponent	: function(){
        var me = this;
        // 护理内容窗口是否打开
        me.careContentOpen = false;
        me.careContentPreset = "4db35a85c37611e39dd9e41f1364eb96"; // 护理内容预置项ID
        me.enterNumPreset  = '337d27b9c37611e39dd9e41f1364eb96'; // 入量.量预置项ID
        me.outNumPreset = '278366bfc60e11e395078c89a5769562'; // 出量.量预置项ID

        /*this.conventionalToolbar = new com.dfsoft.icu.nws.nursingrecord.ConventionalToolbar(
            {region: 'north', nursingRecordApp: me});*/

        Ext.apply(this, {
            region 	: 'center',
            header	: false,
            margin  : '0',
            columnLines: true,
            /*viewConfig: {
                markDirty: false
            },*/
            sortableColumns : false,
            enableLocking : true, // 设置可锁定

            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 2
                })
            ],
            selType : 'cellmodel',

            listeners:{
                cellkeydown:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts){
                    var modifiedFieldNames = _this.getGridColumns()[cellIndex].dataIndex;
                    var careTime = record.get('CARE_TIME');
                    console.log('modifiedFieldNames:'+modifiedFieldNames+' careTime:'+careTime);
                    if(e.getKey()==46&&modifiedFieldNames!='CARE_TIME'){

                        if(modifiedFieldNames == me.careContentPreset){
                            Ext.MessageBox.alert('提示', '不能直接删除护理内容，请双击打开窗口操作！');
                            return;
                        }
                        me.parent.batchUpdateFields=true;
                        var oldValue=record.get(modifiedFieldNames);
                        record.set(modifiedFieldNames,"");
                        var scoreId="";
                        if(oldValue.indexOf('scoreId')>0){
                            var obj = Ext.decode(oldValue);
                            scoreId=obj.scoreId;
                        }
                        Ext.Ajax.request({
                            url: webRoot + '/icu/nursingRecord/conventional/1' ,
                            params: {
                                userId    : userInfo.userId,
                                registerId: me.parent.patientInfo.REGISTER_ID,
                                careTime  : Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s'),
                                bedItemId : modifiedFieldNames,
                                careValue : "",
                                careContent : me.careContentPreset,
                                scoreId:scoreId
                            },
                            method: 'PUT',
                            scope: this,
                            success: function(response) {
                                record.commit();
                                me.parent.batchUpdateFields=false;
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                            }
                        });
                    }
                },
                afterrender:function(){
                    me.view.on('cellcontextmenu', function(view, cell, cellIndex, record, row, rowIndex, e) {
                        event.preventDefault();
                        var column= view.getHeaderByCell(cell);
                        var modifiedFieldNames =  column.dataIndex;
                        var modifiedFieldType =  column.inputType;
                        if(modifiedFieldType!=undefined&&modifiedFieldType==2){
                            Ext.create('Ext.menu.Menu', {
                                border: false,
                                plain: true,
                                items: [
                                    {
                                        text: '复制该单元格内容到以下单元格',
                                        iconCls: 'search',
                                        listeners: {
                                            'click': function () {
                                                me.selectField=modifiedFieldNames;
                                                me.parent.copyCelltoDown(record);
                                            }
                                        }
                                    }
                                ]
                            }).showAt(e.getPageX(), e.getPageY());
                        }else{
                            var store=me.getStore();
                            var len=store.getCount();
                            if(modifiedFieldNames!='CARE_TIME'){
                                for(var i=rowIndex-1;i>=0;i--){
                                    var da=store.getAt(i);
                                    if(da.get(modifiedFieldNames)!=null&&da.get(modifiedFieldNames)!=''){
                                        me.parent.batchUpdateFields=true;
                                        record.set(modifiedFieldNames,da.get(modifiedFieldNames));
                                        var id = record.get('id');
                                        var careTime = record.get('CARE_TIME');
                                        var careValue = da.get(modifiedFieldNames);

                                        Ext.Ajax.request({
                                            url: webRoot + '/icu/nursingRecord/conventional/1' ,
                                            params: {
                                                userId    : userInfo.userId,
                                                registerId: me.patientInfo.REGISTER_ID,
                                                careTime  : Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s'),
                                                bedItemId : modifiedFieldNames,
                                                careValue : careValue,
                                                careContent : me.careContentPreset
                                            },
                                            method: 'PUT',
                                            scope: this,
                                            success: function(response) {
                                                //me.getStore().commitChanges();
                                                record.commit();
                                                me.parent.batchUpdateFields=false;
                                            },
                                            failure: function(response, options) {
                                                record.cancelEdit();
                                                Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                                            }
                                        });
                                        break;
                                    }
                                }
                                record.commit();
                            }
                        }

                    });
                },
                validateedit:function(editor, e){
                    me.comboboxValue = ''; // 下拉框对应的护理值,json格式
                    var editor = e.column.getEditor();

                    if(me.inputType ==1 && editor.getValue() != null){
                        me.comboboxValue = "{id: \""+editor.getValue()+"\", name: \""+editor.getRawValue()+"\"}";
                    }
                },
                beforeedit:function(editor, e){
                    me.parent.batchUpdateFields=true;
                    me.inputType = e.column.inputType; // 录入方式
                    if(e.column.inputType ==1){
                        if(e.value != null && e.value.length >0){
                            try{
                                var obj = Ext.decode(e.value);
                                e.value = obj.id;
                                if(obj.id.indexOf(',')!=-1){
                                    e.value = obj.id.split(',');
                                }
                            }catch (e){
                                e.value = null;
                            }
                        }
                    }

                    if(e.column.dataSourceCode == '23hace90fdad11e2b0ab11ca6e32t6x1'){
                        return false;//不可编辑
                    }
                    return true;

                },
                edit:function(editor, e){
                    //如果没有做修改，返回
                     /**
                     * var temp = e.value;
                     //如果本次结果跟上次一样，不进行保存逻辑
                     if (temp == e.originalValue) {
                        return;
                    }
                     if (e.value == null && e.originalValue == '') {
                        e.record.commit();
                        return;
                    }
                     */
                    if(e.value==e.originalValue){
                        e.record.commit();
                        return;
                    }
                    if(typeof e.value=='object'&&(e.value==null||e.value[0]=="")&&e.originalValue==""){
                        e.record.commit();
                        return;
                    }

                    if(e.field=='CHECKHAVE'){
                        return;
                    }
                    /*if(e.value==null&&e.originalValue==''){
                        e.record.commit();
                    }*/

                    var record=e.record;
                    var id = record.get('id');
                    var careTime = record.get('CARE_TIME');
                    var careValue = record.get(e.field);
                    if(e.column.inputType == 1){ // 下拉框
                        careValue = me.comboboxValue;
                    }
                    if(e.field == me.careContentPreset){
                        careValue = careValue.replace(/\r\n|\n/g, '')
                    }

                    record.set(e.field,careValue);
                    Ext.Ajax.request({
                        url: webRoot + '/icu/nursingRecord/conventional/1_grid' ,
                        params: {
                            userId    : userInfo.userId,
                            registerId: me.patientInfo.REGISTER_ID,
                            careTime  : Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s'),
                            bedItemId : e.field,
                            careValue : careValue,
                            careContent : me.careContentPreset
                        },
                        method: 'PUT',
                        scope: this,
                        success: function(response) {
                            //me.getStore().commitChanges();
                            record.commit();
                            me.parent.batchUpdateFields=false;
                        },
                        failure: function(response, options) {
                            record.cancelEdit();
                            Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                        }
                    });

                },
                celldblclick:function(_this, td, cellIndex, res, tr, rowIndex, e, eOpts){
                    var records = _this.getGridColumns();
                    var record = records[cellIndex];
                    me.selectField = record.dataIndex;

                    // 危重评分设置
                    if(record.dataSourceCode == '23hace90fdad11e2b0ab11ca6e32t6x1'){ // 危重评分
                        var scorePopWindow = new com.dfsoft.icu.nws.nursingscores.ScorePopWindow({
                            scoreCode : record.dataSourceValue, patientInfo : this.patientInfo,
                            dataIndex : record.dataIndex, mod: me.nwsApp.id+'_care_record',
                            nwsApp:me.nwsApp,
                            careRecordPanel : me, careTime : Ext.Date.format(new Date(res.get('CARE_TIME')), 'Y-m-d H:i:s')});
                        me.nwsApp.showModalWindow(scorePopWindow);
                    }

                },
                cellclick:function(_this, td, cellIndex, res, tr, rowIndex, e, eOpts ){
                    //me.selectField = _this.getGridColumns()[cellIndex].dataIndex;
                    var records = _this.getGridColumns();
                    var record = records[cellIndex];
                    me.selectField = record.dataIndex;
                    // 护理记录弹出窗口
                    if(me.selectField == me.careContentPreset){
                        me.showCareRecordWin(res.get(me.careContentPreset),Ext.Date.format(new Date(res.get('CARE_TIME')), 'Y-m-d H:i:s'));
                    }


                }
            }
        });
        this.callParent(arguments);
    },
    // 弹出护理记录模板窗口
    showCareRecordWin : function(value,careTime,schedulName){
        var me=this;
        if(me.careContentOpen){
            return;
        }
        var winEdit = new com.dfsoft.icu.nws.nursingrecord.NursingRecordWindow(
                {patientInfo: this.patientInfo, careRecordApp:this,careTimeNow:careTime,typeName:schedulName});
        var form = winEdit.down('panel').down('form').getForm();
        form.reset();

        // 开始时间赋值
        var startTime = me.conventionalToolbar.getBeginDateTime();
        form.findField('startTime').setValue(startTime);

        // 护理内容不空，给护理记录窗口赋值
        if(value != null && value.length >0){
            var obj = Ext.decode(value);
            if(obj.content != undefined && obj.content != ''){
                form.findField('content').setValue(base64_decode(obj.content));
            }
            if(obj.summary != undefined && obj.summary != ''){
                form.findField('summary').setValue(base64_decode(obj.summary));
            }
            if (obj.conclusion != undefined && obj.conclusion != '') {
                winEdit.conclusionContent = base64_decode(obj.conclusion);
                //form.findField('conclusion').setValue(obj.conclusion);
            }
        }
        //this.parent.batchUpdateFields=false;
        me.parent.nwsApp.showModalWindow(winEdit);
        me.careContentOpen=true;
    },
    // 设置评分值
    saveScoreValue : function(dataIndex, scoreValue){
        var records = this.getSelectionModel().getSelection();
        records[0].set(dataIndex, scoreValue);
        Ext.Ajax.request({
            url: webRoot + '/icu/nursingRecord/conventional/1_score',
            params: {
                userId: userInfo.userId,
                registerId: this.patientInfo.REGISTER_ID,
                careTime: records[0].get('CARE_TIME'),
                bedItemId: dataIndex,
                careValue: scoreValue,
                careContent: this.careContentPreset
            },
            method: 'PUT',
            scope: this,
            success: function (response) {
                records[0].commit();
            },
            failure: function (response, options) {
                records[0].cancelEdit();
                Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
            }
        });
    }
});