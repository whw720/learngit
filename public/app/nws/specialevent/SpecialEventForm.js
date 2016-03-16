/**
 * obese评分页面
 *
 * @author zag
 * @version 2013-3-21
 */
Ext.define('com.dfsoft.icu.nws.specialevent.SpecialEventForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.specialeventform',
    requires: [
        'com.dfsoft.icu.nws.specialevent.SpecialEventStore',
        'com.dfsoft.icu.nws.nursingscores.ScorePopWindow',
        'Ext.data.*'
    ],
    initComponent: function () {
        var me = this;
        me.elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
        Ext.QuickTips.init();
        me.specialScorestore = new com.dfsoft.icu.nws.specialevent.SpecialEventStore();
        me.specialScorestore.proxy.url=webRoot+'/icu/qualitycontrol/specialeventController/listPatientScore/'+this.patientInfo.REGISTER_ID+'';
        me.specialScorestore.load();
        me.specialstore = new com.dfsoft.icu.nws.specialevent.SpecialEventStore();
        me.specialstore.proxy.url=webRoot+'/icu/qualitycontrol/specialeventController/listPatientSpecialEvent/'+this.patientInfo.REGISTER_ID+'';
        me.specialstore.load();
        var panel1=Ext.create('Ext.grid.Panel', {
            xtype: "grid",
            border: true,
            width: '50%',
            region:"center",
            columnLines: true,
            split: true,
            renderTo: Ext.getBody(),
            // 定义该表格包含的所有数据列
            columns: [
                { text: '指标名称',align:'center', dataIndex: 'NAME',flex:1,width:140,minWidth:140,renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                    cellmeta.tdAttr = 'data-qtip='+value+'';
                    return value;
                }},
                {
                    text: '最近一次评分',
                    sortable: false,
                    menuDisabled  : true,
                    align:'center',
                    flex:1,
                    columns: [
                        {
                            text: '结果', align: 'center',tooltip:'查看评分',width:100,minWidth:80,dataIndex: 'RESULT',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(value != null && value.length>0){
                                cellmeta.tdAttr = 'data-qtip="点击查看评分"';
                                return value;
                            }else{
                                var title = "点击查看评分";
                                return '<a href="#" style="cursor:hand">' +
                                    '<img src="/app/nws/nursingrecord/images/dot.png" ' +
                                    'title='+title+' style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
                            }
                        },
                            editor: {
                                xtype: 'checkbox',
                                maxLength: 1
                            }
                        },
                        {
                            text: '时间', align: 'center', dataIndex: 'OCCURRENCE_TIME',width:100,minWidth:90,renderer:Ext.util.Format.dateRenderer('Y-m-d'),
                            editor:new Ext.form.DateField({
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                listeners:{
                                    focus:function(_this,a,b){
                                        _this.expand();
                                    }
                                }
                            })
                        }
                    ]
                },
                {
                    text: '备注',
                    sortable: false,
                    menuDisabled  : true,
                    align:'center',
                    flex:1, dataIndex: 'DESCRIPTION',editor: {
                    xtype: 'textfield',
                    maxLength:1000,
                    width: 70,minWidth:70,
                    maxLengthText: '最多可输入1000个字符'
                }
                },
                {
                    text: '质控标准',
                    sortable: false,
                    menuDisabled  : true,
                    align: 'center',
                    flex:1,
                    columns: [
                        {text: '2011',dataIndex: 'IS_2011',width:77,minWidth:50, align: 'center',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(value==1){
                                return '<img  src=\'/app/sys/desktop/images/grid_Choose_1.png\' height="15" width="15"/>';
                            }
                        }},
                        {text: '2015',dataIndex: 'IS_2015', width:77,minWidth:50,align: 'center',renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(value==1){
                                return '<img  src=\'/app/sys/desktop/images/grid_Choose_1.png\' height="16" width="16"/>';
                            }
                        }}
                    ]
                }
                ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 37,
                items: ['评分类型质控指标'
                ]
            }],
            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing',{
                    clickToEdit : 2,
                    listeners : {
                        'edit' : function(editor,ctx){
                            var RESULT;

                            if(editor.context.record.data.RESULT=='true'||editor.context.record.data.RESULT=='1'){
                                RESULT='1';
                            }else{
                                RESULT='0';
                            }
                            var DESCRIPTION=editor.context.record.data.DESCRIPTION;
                            var OCCURRENCE_TIME=new Date(editor.context.record.data.OCCURRENCE_TIME).Format("yyyy-MM-dd");
                            var ID=editor.context.record.data.ID;
                            if(ID=='')ID=null;
                            if(OCCURRENCE_TIME=='NaN-aN-aN')OCCURRENCE_TIME=null;
                            Ext.Ajax.request({
                                url:webRoot+'/icu/qualitycontrol/specialeventController/savePatientSpecialEvent/'+ID+'',
                                method: 'PUT',
                                params: {
                                    SPECIAL_EVENT_CODE:editor.context.record.data.CODE,
                                    REGISTER_ID:me.patientInfo.REGISTER_ID,
                                    RESULT: RESULT,
                                    OCCURRENCE_TIME:OCCURRENCE_TIME,
                                    DESCRIPTION:DESCRIPTION
                                },
                                success: function(response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    me.specialScorestore.reload();
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                })
            ],
            store: me.specialScorestore,
            listeners: {
                //拖拽之前判断
                beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                },
                drop: function(node, data, dropRec, dropPosition) {
                },
                beforerefresh : function(v) {
                    v.scrollTop = v.el.dom.scrollTop;
                    v.scrollHeight = v.el.dom.scrollHeight
                },
                refresh : function(v) {
                    v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                },
                beforeedit : function(editor, e) {
                    if(e.field=='OCCURRENCE_TIME'){
                        if(e.record.data.OCCURRENCE_TIME!=null){
                            e.value=new Date(e.record.data.OCCURRENCE_TIME).Format("yyyy-MM-dd");
                        }
                    }
                    if(e.record.data.CODE == '1001'){
                        return false;
                    }else if(e.record.data.CODE == '1002'){
                        return false;
                    }else{
                        return true;
                    }
                },
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(modifiedFieldNames=='RESULT'){
                        var scorePopWindow = new com.dfsoft.icu.nws.nursingscores.ScorePopWindow({
                            scoreCode :'9a10f3ebb18811e3aa8800271396a820', patientInfo : me.patientInfo,
                            dataIndex :'dataIndex', mod: me.nwsApp.id+'_specialevent',
                            nwsApp:me.nwsApp,
                            careRecordPanel : me, careTime : Ext.Date.format(new Date(record.data.OCCURRENCE_TIME), 'Y-m-d H:i:s')});
                        me.nwsApp.showModalWindow(scorePopWindow);
                    }
                }
            }
        });
        var panel2=Ext.create('Ext.grid.Panel', {
            xtype: "grid",
            border: true,
            width: '50%',
            region:"east",
            columnLines: true,
            split: true,
            renderTo: Ext.getBody(),
            // 定义该表格包含的所有数据列
            columns: [
                { text: '指标名称',align:'center', dataIndex: 'NAME',flex:1,width:180,minWidth:180,renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                    cellmeta.tdAttr = 'data-qtip='+value+'';
                    return value;
                }},
                {
                    text: '情况',
                    sortable: false,
                    menuDisabled  : true,
                    align:'center',
                    flex:1,
                    columns: [
                        {
                            text: '是否发生', align: 'center',dataIndex: 'RESULT',width:70,minWidth:70,renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(record.data["CODE"]=='1001'||record.data["CODE"]=='1002'){
                                return value;
                            }else{
                                if(value==1){
                                    return '<input type="checkbox" checked/>';
                                }else{
                                    return '<input type="checkbox"/>';
                                }

                            }
                        },
                            editor: {
                                xtype: 'checkbox',
                                maxLength: 1
                            }
                        },
                        {
                            text: '发生时间',align:'center', dataIndex: 'OCCURRENCE_TIME',width:100,minWidth:90,renderer:Ext.util.Format.dateRenderer('Y-m-d'),
                            editor:new Ext.form.DateField({
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                listeners:{
                                    focus:function(_this,a,b){
                                        _this.expand();
                                    }
                                }
                            })
                        }
                    ]
                },
                {
                    text: '备注',
                    sortable: false,
                    menuDisabled  : true,
                    align:'center',
                    flex:1, dataIndex: 'DESCRIPTION',editor: {
                    xtype: 'textfield',
                    maxLength:1000,
                    width: 100,minWidth:70,
                    maxLengthText: '最多可输入1000个字符'
                }
                },
                {
                    text: '质控标准',
                    sortable: false,
                    menuDisabled  : true,
                    align:'center',
                    flex:1,
                    columns: [
                        {text: '2011',dataIndex: 'IS_2011', align: 'center',width:61,minWidth:50,renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(value==1){
                                return '<img  src=\'/app/sys/desktop/images/grid_Choose_1.png\' height="16" width="16"/>';
                            }
                        }},
                        {text: '2015',dataIndex: 'IS_2015', align: 'center',width:61,minWidth:50,renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){
                            if(value==1){
                                return '<img  src=\'/app/sys/desktop/images/grid_Choose_1.png\' height="16" width="16"/>';
                            }
                        }}
                    ]
                }
                ],
            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing',{
                    clickToEdit : 2,
                    listeners : {
                        'edit' : function(editor,ctx){
                            var RESULT;

                            if(editor.context.record.data.RESULT=='true'||editor.context.record.data.RESULT=='1'){
                                RESULT='1';
                            }else{
                                RESULT='0';
                            }
                            var DESCRIPTION=editor.context.record.data.DESCRIPTION;
                            var OCCURRENCE_TIME=new Date(editor.context.record.data.OCCURRENCE_TIME).Format("yyyy-MM-dd");
                            var ID=editor.context.record.data.ID;
                            if(ID=='')ID=null;
                            if(OCCURRENCE_TIME=='NaN-aN-aN')OCCURRENCE_TIME=null;
                            Ext.Ajax.request({
                                url:webRoot+'/icu/qualitycontrol/specialeventController/savePatientSpecialEvent/'+ID+'',
                                method: 'PUT',
                                params: {
                                    SPECIAL_EVENT_CODE:editor.context.record.data.CODE,
                                    REGISTER_ID:me.patientInfo.REGISTER_ID,
                                    RESULT: RESULT,
                                    OCCURRENCE_TIME:OCCURRENCE_TIME,
                                    DESCRIPTION:DESCRIPTION
                                },
                                success: function(response) {
                                    var respText = Ext.decode(response.responseText).data;
                                    me.specialstore.reload();
                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
                                }
                            });
                        }
                    }
                })
            ],
            store: me.specialstore,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                height: 37,
                items: ['记录类型质控指标'
                ]
            }],
            listeners: {

                //拖拽之前判断
                beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                },
                drop: function(node, data, dropRec, dropPosition) {
                },
                beforerefresh : function(v) {
                    v.scrollTop = v.el.dom.scrollTop;
                    v.scrollHeight = v.el.dom.scrollHeight
                },
                refresh : function(v) {
                    v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                },
                beforeedit : function(editor, e) {
                    if(e.field=='OCCURRENCE_TIME'){
                        if(e.record.data.OCCURRENCE_TIME!=null){
                            e.value=new Date(e.record.data.OCCURRENCE_TIME).Format("yyyy-MM-dd");
                        }
                    }
                    if(e.record.data.CODE == '1001'){
                        return false;
                    }else if(e.record.data.CODE == '1002'){
                        return false;
                    }else{
                        return true;
                    }
                },
                cellclick:function(_this, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                    var column=_this.getGridColumns()[cellIndex];
                    var modifiedFieldNames = column.dataIndex;
                    if(record.data.CODE=='1001'||record.data.CODE=='1002')return;
                    if(modifiedFieldNames=='RESULT'){
                        var RESULT;
                        if(e.target.checked==true){
                            RESULT='1';
                        }else{
                            RESULT='0';
                        }
                        var ID=record.data.ID;
                        if(ID=='')ID=null;
                        Ext.Ajax.request({
                            url:webRoot+'/icu/qualitycontrol/specialeventController/savePatientSpecialEventResult/'+ID+'',
                            method: 'PUT',
                            params: {
                                SPECIAL_EVENT_CODE:record.data.CODE,
                                REGISTER_ID:me.patientInfo.REGISTER_ID,
                                RESULT: RESULT
                            },
                            success: function(response) {
                                var respText = Ext.decode(response.responseText).data;
                                me.specialstore.reload();
                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('提示', '修改失败,请求超时或网络故障!');
                            }
                        });
                    }
                }
            }
        });
        Ext.apply(this, {

            title: '质控指标',
            border: true,
            bodyStyle:'overflow-y:auto;',
            id:me.mod + 'specialeventform',
            layout: {
                type: 'border'
            },
            split:{size:5},
            items: [panel1,panel2]
        });
        this.callParent(arguments);
    },
    setPatientInfo:function(patientInfo){
        var me = this;
        me.elm.show();
        me.patientInfo = patientInfo;
        var scoreCode = "63f0a832b18711e3aa8800271396a820";
        me.specialstore.proxy.url=webRoot+'/icu/qualitycontrol/specialeventController/listPatientSpecialEvent/'+me.patientInfo.REGISTER_ID+'';
        me.specialstore.reload();
        me.elm.hide();
        me.specialScorestore.proxy.url=webRoot+'/icu/qualitycontrol/specialeventController/listPatientScore/'+me.patientInfo.REGISTER_ID+'';
        me.specialScorestore.reload();

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
    }
});