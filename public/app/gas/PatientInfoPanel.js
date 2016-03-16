/**
 * 功能说明: 医生工作站 床位列表 panel
 * @author: 杨祖文
 */
Ext.define('com.dfsoft.icu.gas.PatientInfoPanel', {
    extend: 'Ext.panel.Panel',
    region: 'center',
    border: true,
    layout:'border',
    buttonAlign:'left',
    initComponent: function() {
        var me = this;
        me.icu_id = userInfo.deptId;
        me.bloodGasPanel=Ext.create('com.dfsoft.icu.gas.BloodGasPanel',{});
        me.buttons = [{
                xtype: 'button',
                text:'新增',
                handler: function(field) {
                    var fieldsets=me.form.query('fieldset');
                    var form=me.form.getForm();
                    var hostitalNumber=form.findField('HOSPITAL_NUMBER').getValue();
                    var editButton = me.query('toolbar')[3].query('button')[1];
                    fieldsets[0].setDisabled(true);
                    fieldsets[1].setDisabled(false);
                    if(this.text=='新增'){
                        var sampleData = new Date();
                        form.findField('SUBMIT_DATE').setValue(sampleData);
                        form.findField('SAMPLING_TIME').setValue(sampleData);
                        form.findField('REPORT_DATE').setValue(sampleData);
                        form.findField('EXAMINE_DATE').setValue(null);
                        form.findField('SAMPLE_CODE').setValue('');
                        field.setText('保存');
                        editButton.setText('编辑');
                    }else{
                        if(me.form.isValid()){
                            Ext.Ajax.request({
                                url: webRoot + '/gas/getExamineList',
                                method:'post',
                                params : {
                                    HOSPITAL_NUMBER:hostitalNumber,
                                    IS_ADD: 'true',
                                    ICU_ID: me.icu_id
                                },
                                success : function(response) {
                                    var result = Ext.decode(response.responseText);
                                    if (result.success) {
                                        if(result.data.length>0){
                                            Ext.MessageBox.alert('提示', '病人信息已添加！');
                                            field.setText('新增');
                                            fieldsets[1].setDisabled(true);
                                            fieldsets[0].setDisabled(true);
                                        }else{
                                            var values = me.form.getValues();
                                            values.ICU_ID = me.icu_id;
                                            Ext.Ajax.request({
                                                url: webRoot + '/gas/addExamine',
                                                method:'post',
                                                params: values,
                                                success : function(response) {
                                                    var result = Ext.decode(response.responseText);
                                                    if (result.success) {
                                                        if(result.data.length>0){
                                                            Ext.MessageBox.alert('提示', '病人信息已添加！');
                                                        }else{
                                                            field.setText('新增');
                                                            fieldsets[1].setDisabled(true);
                                                            fieldsets[0].setDisabled(true);
                                                            me.examineList.getStore().load({params: {ICU_ID: me.icu_id}});
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }

                }
        },{
            xtype: 'button',
            tooltip: '编辑',
            text: '编辑',
            handler: function (field) {
                var type = me.form.getForm().findField('TYPE').getValue();
                var id = me.form.getForm().findField('ID').getValue();
                if (!id) {
                    Ext.MessageBox.alert('提示', '请选择要编辑的病人!');
                    return;
                }
                if (type == 'ICU') {
                    Ext.MessageBox.alert('提示', '病人是在科病人!');
                    return;
                }
                var fieldsets = me.form.query('fieldset');
                var form = me.form.getForm();
                var hostitalNumber = form.findField('HOSPITAL_NUMBER').getValue();
                var addButton = me.query('toolbar')[3].query('button')[0];
                fieldsets[0].setDisabled(true);
                fieldsets[1].setDisabled(false);
                if (this.text == '编辑') {
                    field.setText('保存');
                    addButton.setText('新增');
                } else {
                    if (me.form.isValid()) {
                        var values = me.form.getValues();
                        values.ID = id;
                        values.ICU_ID = me.icu_id;
                        Ext.Ajax.request({
                            url: webRoot + '/gas/editExamine',
                            method: 'post',
                            params: values,
                            success: function (response) {
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
                                    field.setText('编辑');
                                    fieldsets[1].setDisabled(true);
                                    fieldsets[0].setDisabled(true);
                                    me.examineList.getStore().load({params: {EXAMINE_DATE: form.findField('EXAMINE_DATE').getSubmitValue(), SAMPLE_CODE: form.findField('SAMPLE_CODE').getValue(), ICU_ID: me.icu_id}});
                                }
                            }
                        });
                    }
                }
            }
        },
            {
                action: 'cancel_button',
                text: '取消',
                labelAlign: 'right',
                handler: function () {
                    var addButton = me.query('toolbar')[3].query('button')[0];
                    var editButton = me.query('toolbar')[3].query('button')[1];
                    var fieldsets = me.form.query('fieldset');
                    if (addButton.text == '保存' || editButton.text == '保存') {
                        var records = me.examineList.getSelectionModel().getSelection();
                        if (records.length <= 0) {
                            me.form.getForm().loadRecord(Ext.create('com.dfsoft.icu.gas.ExamineModel', {}));
                        } else {
                            me.form.getForm().loadRecord(records[0]);
                        }
                        addButton.text == '保存' ? addButton.setText('新增') : '';
                        editButton.text == '保存' ? editButton.setText('编辑') : '';
                        fieldsets[1].setDisabled(true);
                        fieldsets[0].setDisabled(true);
                    }
                }
        },
            {
            action: 'back_button',
            text:'打印',
            labelAlign: 'right',
            handler: function () {
                me.printBlood();
            }
        }];
        me.examineList=Ext.widget('grid',{
            region:'east',
            width:'30%',
            viewConfig: {
                listeners: {
                    beforerefresh : function(v) {
                        v.scrollTop = v.el.dom.scrollTop;
                        v.scrollHeight = v.el.dom.scrollHeight
                    },
                    refresh : function(v) {
                        v.el.dom.scrollTop = v.scrollTop+(v.scrollTop == 0? 0: v.el.dom.scrollHeight- v.scrollHeight);
                    }
                }
            },
           // padding:'0 5 0 0',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['列表', '->', {
                    xtype: 'button',
                    tooltip: '查询',
                    text: '查询',
                    scope: me,
                    handler: function () {
                        var store = me.examineList.getStore(),
                            toolbar = me.query('toolbar')[0];
                        var buttons = me.query('toolbar')[3].query('button');
                        if (buttons[0].text == '新增' && buttons[1].text == '编辑') {
                        } else {
                            var fieldsets = me.form.query('fieldset');
                            fieldsets[0].setDisabled(true);
                            fieldsets[1].setDisabled(false);
                            buttons[0].text == '保存' ? buttons[0].setText('新增') : buttons[1].setText('编辑');
                            fieldsets[0].setDisabled(true);
                            fieldsets[0].setDisabled(true);
                        }
                        var EXAMINE_DATE_START = toolbar.down('datefield[name=EXAMINE_DATE_START]').getRawValue(),
                            EXAMINE_DATE_END = toolbar.down('datefield[name=EXAMINE_DATE_END]').getRawValue(),
                            HOSPITAL_NUMBER = toolbar.down('textfield[name=HOSPITAL_NUMBER]').getValue(),
                            PATIENT_NAME = toolbar.down('textfield[name=PATIENT_NAME]').getValue(),
                            SUBMIT_DOCTOR = toolbar.down('textfield[name=SUBMIT_DOCTOR]').getValue(),
                            PATIENT_TYPE = toolbar.down('textfield[name=PATIENT_TYPE]').getValue(),
                            SAMPLE_CODE_START = toolbar.down('textfield[name=SAMPLE_CODE_START]').getValue(),
                            SAMPLE_CODE_END = toolbar.down('textfield[name=SAMPLE_CODE_END]').getValue(),
                            BED_NUMBER = toolbar.down('textfield[name=BED_NUMBER]').getValue(),
                            IN_DEPT = toolbar.down('textfield[name=IN_DEPT]').getValue(),
                            CHECKER = toolbar.down('textfield[name=CHECKER]').getValue(),
                            SAMPLE_TYPE = toolbar.down('textfield[name=SAMPLE_TYPE]').getValue();
                        var params = {ICU_ID: me.icu_id};
                        if (EXAMINE_DATE_START && EXAMINE_DATE_START != "") params.EXAMINE_DATE_START = EXAMINE_DATE_START;
                        if (EXAMINE_DATE_END && EXAMINE_DATE_END != "") params.EXAMINE_DATE_END = EXAMINE_DATE_END;
                        if (HOSPITAL_NUMBER && HOSPITAL_NUMBER != "") params.HOSPITAL_NUMBER = HOSPITAL_NUMBER;
                        if (PATIENT_NAME && PATIENT_NAME != "") params.PATIENT_NAME = PATIENT_NAME;
                        if (SUBMIT_DOCTOR && SUBMIT_DOCTOR != "") params.SUBMIT_DOCTOR = SUBMIT_DOCTOR;
                        if (PATIENT_TYPE && PATIENT_TYPE != "") params.PATIENT_TYPE = PATIENT_TYPE;
                        if (SAMPLE_CODE_START && SAMPLE_CODE_START != "") params.SAMPLE_CODE_START = SAMPLE_CODE_START;
                        if (SAMPLE_CODE_END && SAMPLE_CODE_END != "") params.SAMPLE_CODE_END = SAMPLE_CODE_END;
                        if (BED_NUMBER && BED_NUMBER != "") params.BED_NUMBER = BED_NUMBER;
                        if (IN_DEPT && IN_DEPT != "") params.IN_DEPT = IN_DEPT;
                        if (CHECKER && CHECKER != "") params.CHECKER = CHECKER;
                        if (SAMPLE_TYPE && SAMPLE_TYPE != "") params.SAMPLE_TYPE = SAMPLE_TYPE;
                        store.load({params: params});
                    }
                },
                {
                    xtype: 'button',
                    tooltip: '刷新',
                    iconCls: 'data-refresh',
                    handler: function() {
                        var store=me.examineList.getStore(),
                            form=me.form.getForm();
                        //form.findField('SAMPLE_CODE').setValue('');
                        store.reload();
                        //store.load({params:{EXAMINE_DATE:form.findField('EXAMINE_DATE').getSubmitValue()}});
                    }
                },{
                        xtype: 'button',
                        tooltip: '删除',
                        iconCls: 'delete',
                        handler: function() {
                            var store=me.examineList.getStore();
                            var records = me.examineList.getSelectionModel().getSelection();
                            if (records.length < 1) {
                                Ext.MessageBox.alert('提示', '请选择要删除的病人信息!');
                                return;
                            }
                            if(records[0].get('TYPE')=='ICU'){
                                Ext.MessageBox.alert('提示', '病人是在科病人!');
                                return;
                            }
                            Ext.Msg.confirm('删除', '确认要删除吗？', function(btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: webRoot + '/gas/deleteExamine',
                                        method: 'post',
                                        params : {
                                            ID:records[0].get('ID')
                                        },
                                        scope: this,
                                        success: function(response) {
                                            var respText = Ext.decode(response.responseText).data,
                                                form=me.form.getForm();
                                            store.reload();
                                            var examineModel = Ext.create('com.dfsoft.icu.gas.ExamineModel', {
                                                EXAMINE_DATE:form.findField('EXAMINE_DATE').getSubmitValue()
                                            });
                                            me.form.getForm().loadRecord(examineModel);
                                            me.bloodGasPanel.getStore().removeAll();
                                        },
                                        failure: function(response, options) {
                                            Ext.MessageBox.alert('提示', '删除失败,请求超时或网络故障!');
                                        }
                                    });
                                }
                            });
                        }
                    }]
            }],
            store:Ext.create('com.dfsoft.icu.gas.ExamineStore',{
                autoLoad: false,
                listeners: {
                    beforeload: function (store, options) {
                        Ext.apply(store.proxy.extraParams, {
                            ICU_ID: me.icu_id
                        });
                    }
                }
            }),
            columns:[{
                text:'标本号',
                width:60,
                dataIndex:'SAMPLE_CODE'
            },{
                text: '检验日期',
                width: 85,
                hidden: true,
                dataIndex: 'EXAMINE_DATE'
            },
                {
                text:'姓名',
                width:70,
                dataIndex:'PATIENT_NAME'
            },{
                text:'病历号',
                width:90,
                dataIndex:'HOSPITAL_NUMBER'
            },{
                text:'病人类型',
                width:70,
                dataIndex:'PATIENT_TYPE'
            },{
                text:'床号',
                width:70,
                dataIndex:'BED_NUMBER'
            },{
                text:'科室',
                width:100,
                dataIndex:'IN_DEPT'
            }],
            listeners:{
                select:function(_this, record,  index, e, eOpts ) {
                    var buttons = me.query('toolbar')[3].query('button');
                    if (buttons[0].text == '新增' && buttons[1].text == '编辑') {
                        //  buttons[1].text=='新增'?buttons[1].setText('保存'):buttons[2].setText('保存');
                    }else {
                        var fieldsets = me.form.query('fieldset');
                        fieldsets[0].setDisabled(true);
                        fieldsets[0].setDisabled(true);
                        buttons[0].text == '保存' ? buttons[0].setText('新增') : buttons[1].setText('编辑');
                        fieldsets[1].setDisabled(true);
                        fieldsets[0].setDisabled(true);
                    }
                    var store = me.bloodGasPanel.getStore();
                    store.on('beforeload',function (store, options) {
                        Ext.apply(store.proxy.extraParams, {
                            TYPE:record.get('TYPE'),
                            EXAMINE_ID: record.get('ID')
                        });
                    });
                    if (record.get('DIAGNOSIS') == 'null')record.set('DIAGNOSIS', '');
                    me.form.getForm().loadRecord(record)
                    store.load();
                }
            }
        });
        me.form=Ext.create('Ext.form.Panel',{
            width:230,
            layout:'border',
            region:'west',
            items:[{
                xtype:'fieldset',
                region: 'north',
                margin:'5 5 3 5',
                padding:'5 3 0 3',
                disabled: true,
                fieldDefaults :{
                    labelWidth:56,
                    labelAlign:'right',
                    height:22
                },
                items:[{
                    xtype:'hidden',
                    name:'ID'
                },{
                    xtype: 'hidden',
                    name: 'TYPE'
                },
                    {
                        xtype:'datefield',
                        format:'Y-m-d',
                        name:'EXAMINE_DATE',
                        fieldLabel:'检验日期'
                    },{
                        xtype:'textfield',
                        name:'SAMPLE_CODE',
                        fieldLabel:'标本号',
                        maxLength:50
                    }
                ]
            },{
                xtype:'fieldset',
                disabled:true,
                fieldDefaults : {
                    labelWidth: 56,
                    labelAlign: 'right',
                    height: 22
                },
                region: 'center',
                margin:'0 5 5 5',
                padding:'5 3 3 3',
                items:[
                    {
                        xtype:'textfield',
                        name:'PATIENT_TYPE',
                        fieldLabel:'病人类型',
                        maxLength:32
                    },{
                        xtype:'textfield',
                        name:'HOSPITAL_NUMBER',
                        allowBlank:false,
                        fieldLabel:'病历号',
                        maxLength:100,
                        listeners:{
                            blur:function(field){
                                var hostpitalNumber=field.getValue();
                                if (hostpitalNumber && hostpitalNumber != '') {
                                    Ext.Ajax.request({
                                        url: webRoot + '/gas/getExamineList',
                                        method: 'post',
                                        params: {
                                            HOSPITAL_NUMBER: hostpitalNumber,
                                            IS_AUTO_FILL: true
                                        },
                                        success: function (response) {
                                            var result = Ext.decode(response.responseText);
                                            if (result.success) {
                                                if (result.data.length > 0) {
                                                    result.data[0].SAMPLING_TIME = '';
                                                    result.data[0].SUBMIT_DATE = '';

                                                    var sampleData = new Date();
                                                    result.data[0].SUBMIT_DATE = sampleData;
                                                    result.data[0].SAMPLING_TIME = sampleData;
                                                    result.data[0].REPORT_DATE = sampleData;
                                                    var examineModel = Ext.create('com.dfsoft.icu.gas.ExamineModel', result.data[0]);
                                                    me.form.getForm().loadRecord(examineModel);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        xtype:'textfield',
                        name:'PATIENT_NAME',
                        allowBlank:false,
                        fieldLabel:'姓名',
                        maxLength:100
                    },{
                        xtype:'fieldcontainer',
                        layout:'column',
                        padding:'0 1 0 0',
                        fieldDefaults :{
                            labelAlign:'right',
                            height:23
                        },
                        items:[{
                            columnWidth:'0.55',
                            xtype:'textfield',
                            labelWidth:56,
                            name:'AGE',
                            maxLength:100,
                            fieldLabel:'年龄'
                        },{
                            columnWidth:'0.45',
                            xtype:'textfield',
                            name:'GENDER',
                            padding:'0 0 0 6',
                            fieldLabel:'性别',
                            labelWidth:30,
                            maxLength:2
                        }]
                    },{
                        xtype:'textfield',
                        name:'FEE_TYPE',
                        fieldLabel:'费别',
                        maxLength:100
                    },{
                        xtype:'textfield',
                        name:'IN_DEPT',
                        fieldLabel:'科室',
                        maxLength:'200'
                    },{
                        xtype:'textfield',
                        name:'BED_NUMBER',
                        fieldLabel:'床号',
                        maxLength:200
                    },{
                        xtype:'textfield',
                        name:'SAMPLE_TYPE',
                        fieldLabel:'标本类型',
                        maxLength:200
                    },{
                        xtype:'textfield',
                        name:'SUBMIT_DOCTOR',
                        fieldLabel:'送检医师',
                        maxLength:200
                    },{
                        xtype:'textfield',
                        name:'REQUEST_NUMBER',
                        fieldLabel:'申请单号',
                        maxLength:50
                    },{
                        xtype:'datetimefield',
                        format:'Y-m-d H:i',
                        name:'SUBMIT_DATE',
                        fieldLabel:'送检时间'
                    },{
                        xtype:'datetimefield',
                        format:'Y-m-d H:i',
                        name:'SAMPLING_TIME',
                        fieldLabel:'采样时间'
                    },{
                        xtype:'datetimefield',
                        format:'Y-m-d H:i',
                        name:'REPORT_DATE',
                        fieldLabel:'报告日期'
                    },{
                        xtype:'textfield',
                        name:'CHECKER',
                        fieldLabel:'检验医师',
                        maxLength:200
                    },{
                        xtype:'textfield',
                        name:'REVIEWER',
                        fieldLabel:'核对医师',
                        maxLength:200
                    },{
                        xtype:'textfield',
                        name:'DIAGNOSIS',
                        fieldLabel:'临床诊断',
                        maxLength:200,
                        listeners : {
                            render : function(field) {

                            },
                            change:function( field, newValue, oldValue, eOpts ){

                            }
                        }
                    },{
                        xtype:'textfield',
                        name:'DESCRIPTION',
                        fieldLabel:'备注',
                        maxLength:4000
                    }
                ]
            }]
        });
        me.items = [
            {
                region: 'center',
                layout: 'border',
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        border: false,
                        layout: 'fit',
                        padding: '0 0 0 0',
                        items: [
                            {
                                xtype: 'buttongroup',
                                border: false,
                                padding: '0 0 0 0',
                                margin: '0 0 0 0',
                                columns: 6,
                                items: [
                                    {
                                        xtype: 'datefield',
                                        columnWidth: 0.2,
                                        name: 'EXAMINE_DATE_START',
                                        fieldLabel: '检验日期',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        trigger2Cls: 'x-form-date-trigger',
                                        onTrigger1Click: function () {
                                            this.setRawValue('');
                                            this.setValue('');
                                        },
                                        format: 'Y-m-d',
                                        editable: false,
                                        msgTarget: 'none',
                                        preventMark: true,
                                        labelWidth: 56,
                                        labelAlign: 'right'
                                    },
                                    {
                                        xtype: 'datefield',
                                        columnWidth: 0.2,
                                        name: 'EXAMINE_DATE_END',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        trigger2Cls: 'x-form-date-trigger',
                                        onTrigger1Click: function () {
                                            this.setRawValue('');
                                            this.setValue('');
                                        },
                                        fieldLabel: '--',
                                        labelSeparator: '',
                                        format: 'Y-m-d',
                                        editable: false,
                                        msgTarget: 'none',
                                        preventMark: true,
                                        labelWidth: 9,
                                        labelAlign: 'right'
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'HOSPITAL_NUMBER',
                                        fieldLabel: '病历号',
                                        labelWidth: 43
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'PATIENT_NAME',
                                        fieldLabel: '姓名',
                                        labelWidth: 30
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'SUBMIT_DOCTOR',
                                        fieldLabel: '送检医师',
                                        labelWidth: 56
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'PATIENT_TYPE',
                                        fieldLabel: '病人类型',
                                        labelWidth: 56
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'SAMPLE_CODE_START',
                                        fieldLabel: '标本号',
                                        labelWidth: 56,
                                        labelAlign: 'right'
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'SAMPLE_CODE_END',
                                        fieldLabel: '--',
                                        labelSeparator: '',
                                        labelWidth: 9,
                                        labelAlign: 'right'
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'BED_NUMBER',
                                        fieldLabel: '床 号',
                                        labelWidth: 43
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'IN_DEPT',
                                        fieldLabel: '科室',
                                        labelWidth: 30
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'CHECKER',
                                        fieldLabel: '检验医师',
                                        labelWidth: 56
                                    },
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 0.2,
                                        name: 'SAMPLE_TYPE',
                                        fieldLabel: '标本类型',
                                        labelWidth: 56
                                    }
                                ]
                            }
                        ]
                    }
                ],
                items: [me.form, me.bloodGasPanel, me.examineList]
            }
        ];
        me.callParent();
    },
    printBlood: function () {
        var me = this;
        var records = me.examineList.getSelectionModel().getSelection();
        if (records.length <= 0) {
            Ext.MessageBox.alert('提示', '请选中需要打印的标本号');
        } else {
                printExamine(records[0].get('ID'),records[0].get('TYPE'),me.getEl());
        }
       /*     var dateStr = records[0].data.EXAMINE_DATE?Ext.Date.format(new Date(records[0].data.EXAMINE_DATE), 'Y/m/d'):'',
                submitDateStr=records[0].data.SUBMIT_DATE?Ext.Date.format(new Date(records[0].data.SUBMIT_DATE), 'Y/m/d'):'',
                reportDateStr=records[0].data.REPORT_DATE?Ext.Date.format(new Date(records[0].data.REPORT_DATE), 'Y/m/d'):'',
                sampleDateStr = records[0].data.SAMPLING_TIME ? Ext.Date.format(new Date(records[0].data.SAMPLING_TIME), 'Y/m/d H:i') : '',
                age = records[0].data.AGE, sampleCode = records[0].data.SAMPLE_CODE;
            if (dateStr == '' || !sampleCode) {
                Ext.Ajax.request({
                    url: webRoot + '/gas/getExamineList',
                    method: 'post',
                    async: false,
                    params: {
                        ID: records[0].get('ID')
                    },
                    success: function (response) {
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            if (result.data.length > 0) {
                                var examineModel = Ext.create('com.dfsoft.icu.gas.ExamineModel', result.data[0]);
                                dateStr = result.data[0].EXAMINE_DATE ? Ext.Date.format(new Date(result.data[0].EXAMINE_DATE), 'Y/m/d') : '';
                                sampleCode = result.data[0].SAMPLE_CODE ? result.data[0].SAMPLE_CODE : '';
                            }
                        }
                    }
                });
            }

            if (age && age.indexOf('月') < 0 && age.indexOf('岁') < 0 && age.indexOf('天') < 0) {
                age = age + '岁';
            } else if (age == null || age == "null") {
                age = "";
            }
            var tableStr = '<table  style="padding:30px;width:30cm;font-size: 14px;" cellpadding=0 cellspacing=0>';
            tableStr += '<tr><td><table style="width: 100%;" border="0" cellspacing="0" cellpadding="0"><tr><td style="font-size: 22px;width:12.5cm;text-align: right;padding-right:20px;padding-bottom:10px;">郑州市中心医院血气酸碱分析报告单</td>' +
                '<td style="text-align: right;width:4.5cm;">标本号:' + sampleCode + '&nbsp;&nbsp;</td></tr></table></td></tr>'
            tableStr += '<tr><td><table style="width: 100%;" border="0" cellspacing="0" cellpadding="0">';
            tableStr += '<tr><td style="width: 1.1cm;height: 25px;">姓名:</td><td style="width:6cm;font-weight: bold;font-size:1.2em;">' + records[0].data.PATIENT_NAME + '</td><td style="width: 1.4cm;">病人类型:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;"><div style="width: 5.5cm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> ' + records[0].data.PATIENT_TYPE + '</div>' +
                '<td style="width: 1.1cm;">床号:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">' + (records[0].data.BED_NUMBER != null ? records[0].data.BED_NUMBER : '') + '</td><td style="width:2cm;">检验日期:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">' + dateStr + '</td></tr>';
            tableStr += '<tr><td style="height: 25px;">性别:</td><td style="font-weight: bold;font-size:1.2em;">' +  records[0].data.GENDER + '</td><td>住 院 号:</td><td style="font-weight: bold;font-size:1.2em;">' +  records[0].data.HOSPITAL_NUMBER + '</td>' +
                '<td>诊断:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width: 5.5cm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> ' +  records[0].data.DIAGNOSIS + '</div></td><td>标本类型:</td><td style="font-weight: bold;font-size:1.2em;">' + records[0].data.SAMPLE_TYPE + '</td></tr>';
            tableStr += '<tr><td style="height: 25px;">年龄:</td><td style="font-weight: bold;font-size:1.2em;">' + age + '</td><td >科&nbsp;&nbsp;室:</td><td style="font-weight: bold;font-size:1.2em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + records[0].data.IN_DEPT + '</td>' +
                '<td>备注:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width: 5.5cm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> '+ (records[0].data.DESCRIPTION!=null?records[0].data.DESCRIPTION:'')+'</div></td><td>采样时间:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">' + sampleDateStr + '</td></tr>';

            tableStr += '</table></td></tr>'
            tableStr += '<tr><td><table style="width: 30cm;" border="0" cellspacing="0" cellpadding ="0"><tr><td><table style="width: 15cm;" border="0" cellspacing="0" cellpadding="0">' +
                '<tr>' +
                '<td style="height:35px;border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 1.2cm;">代号</td><td style="width:4cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">项&nbsp;&nbsp;&nbsp;&nbsp;目</td>' +
                '<td style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">结&nbsp;果</td><td style="width:1.2cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">单位</td>' +
                '<td style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">参&nbsp;考&nbsp;值</td>' +
                '</tr>' +
                '<tr><td style="height:25px;">T</td><td>体温</td><td id="temperature_id"></td><td>度</td><td></td></tr>' +
                '<tr><td style="height:25px;">FIO2</td><td>吸氧量</td><td id="fio2_id"></td><td>%</td><td></td></tr>' +
                '<tr><td style="height:25px;">pH</td><td>酸碱度</td><td id="ph_id"></td><td></td><td>7.35--7.45</td></tr>' +
                '<tr><td style="height:25px;">pCO2</td><td>CO2分压</td><td id="pco2_id"></td><td>mmHg</td><td>35--45</td></tr>' +
                '<tr><td style="height:25px;">pO2</td><td>氧分压</td><td id="po2_id"></td><td>mmHg</td><td>80--100</td></tr>' +
                '<tr><td style="height:25px;">pH(T)</td><td>酸碱度</td><td id="pht_id"></td><td></td><td>7.35--7.45</td></tr>' +
                '<tr><td style="height:25px;">pCO2(T)</td><td>二氧化碳分压</td><td id="pco2t_id"></td><td>mmHg</td><td>35--45</td></tr>' +
                '<tr><td style="height:25px;">pO2(T)</td><td>氧分压</td><td id="po2t_id"></td><td>mmHg</td><td>80--100</td></tr>' +
                '<tr><td style="height:25px;">SBC</td><td>标准碳酸氢根</td><td id="sbc_id"></td><td>mmol/L</td><td>22--26</td></tr>' +
                '<tr><td style="height:25px;">SBE</td><td>标准碱剩余</td><td id="sbe_id"></td><td>mmol/L</td><td>-3--3</td></tr>' +
                '<tr><td style="height:25px;">ABE</td><td>实际碱剩余</td><td id="abe_id"></td><td>mmol/L</td><td>-3--3</td></tr>' +
                '<tr><td style="height:25px;">tO2</td><td>血氧含量</td><td id="to2_id"></td><td>vol</td><td></td></tr>' +
                '<tr><td style="height:25px;">sO2</td><td>氧饱和度</td><td id="so2_id"></td><td>%</td><td>95--99</td></tr>' +
                '<tr><td style="height:25px;">tHb</td><td>总血红蛋白</td><td id="thb_id"></td><td>g/dL</td><td></td></tr>' +
                '<tr><td style="height:25px;border-bottom: 2px solid #000000;">K+</td><td style="border-bottom: 2px solid #000000;">钾</td><td style="border-bottom: 2px solid #000000;" id="k_id"></td><td style="border-bottom: 2px solid #000000;">mmol/L</td><td style="border-bottom: 2px solid #000000;">3.5--5</td></tr>' +
                '</table></td><td><table style="width: 15cm;" border="0" cellspacing="0" cellpadding="0">' +
                '<tr>' +
                '<td style="height:35px;padding-left: 2px;border-left: 1px solid #000000;border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 1.2cm;">代号</td><td style="width:4cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">项&nbsp;&nbsp;&nbsp;&nbsp;目</td>' +
                '<td style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">结&nbsp;果</td><td style="width:1.2cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">单位</td>' +
                '<td style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">参&nbsp;考&nbsp;值</td>' +
                '</tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Ca++</td><td>钙</td><td id="ca_id"></td><td>mmol/L</td><td>1.15--1.29</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Na+</td><td>钠</td><td id="na_id"></td><td>mmol/L</td><td>136--146</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Cl-</td><td>氯</td><td id="cl_id"></td><td>mmol/L</td><td>95--107</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Hct</td><td>红细胞压积</td><td  id="hct_id"></td><td>%</td><td>37--50</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">mOsm</td><td>血浆渗透压</td><td id="mosm_id"></td><td>mmol/kg</td><td>275--305</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Lac</td><td>乳酸</td><td id="lac_id"></td><td>mmol/L</td><td>0.5--1.7</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Glu</td><td>葡萄糖</td><td id="glu_id"></td><td>mmol/L</td><td>3.9--6.1</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">cH+</td><td>总氢离子浓度</td><td id="ch_id"></td><td>nmol/L</td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">Anion</td><td>阴离子间隙</td><td id="anion_id"></td><td>mmol/L</td><td>10--20</td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">O2Hb</td><td>氧合血红蛋白</td><td id="o2hb_id"></td><td>%</td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">p50(st)</td><td>标准状态下P50</td><td id="p50st_id"></td><td></td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">pH(st)</td><td>pH(st)</td><td id="phst_id"></td><td></td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">p50(act)</td><td>p50(act)</td><td id="p50act_id"></td><td></td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;padding-left: 2px;">HCO3-</td><td>HCO3-</td><td id="hco3_id"></td><td></td><td></td></tr>' +
                '<tr><td style="height:25px;border-left: 1px solid #000000;border-bottom: 2px solid #000000;padding-left: 2px;">Anion gap</td><td style="border-bottom: 2px solid #000000;">Anion gap</td>' +
                '<td style="border-bottom: 2px solid #000000;" id="aniongap_id"></td><td style="border-bottom: 2px solid #000000;"></td><td style="border-bottom: 2px solid #000000;"></td></tr>' +
                '</table></td></tr>';

            tableStr += '</table></td></tr>';
            tableStr += '<tr><td><table style="height:25px;width:30cm;padding-top: 5px;" border="0" cellspacing="0" cellpadding="0"><tr>';
            tableStr += '<td style="width: 1.6cm;">送检医生</td><td style="width: 2.4cm;border-bottom: 1px dashed #000000;">'+(records[0].data.SUBMIT_DOCTOR!=null?records[0].data.SUBMIT_DOCTOR:'')+'</td><td style="width: 1.6cm;">送检日期</td>' +
                '<td style="width: 3cm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + submitDateStr + '</td><td style="width: 1.6cm;">报告日期</td><td style="width: 3cm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + reportDateStr + '</td>' +
                '<td style="width: 1.4cm;padding-top: 10px;">检验员</td><td style="width: 3cm;border-bottom: 1px dashed #000000;padding-top: 10px;">'+(records[0].data.CHECKER!=null?records[0].data.CHECKER:'')+'</td><td style="width:1.6cm;">复核员</td><td style="width: 3cm;border-bottom: 1px dashed #000000;">'+(records[0].data.REVIEWER!=null?records[0].data.REVIEWER:'')+'</td>';
            tableStr += '</tr></table></td></tr>';
            tableStr += '</table>';
            var titleHtml = tableStr;
            var newwin = window.open('printer.html', '', '');
            newwin.document.write(titleHtml);
            newwin.document.location.reload();

            var store = me.bloodGasPanel.getStore();
            var recordCount = store.getCount();
            for (var i = 0; i < recordCount; i++) {
                var r = store.getAt(i);
                var fr = '';
                if (r.get('NAME') == '血液温度' && r.get('ALIAS') == 'T(B)') {
                    newwin.document.getElementById('temperature_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '吸氧量' && r.get('ALIAS') == 'FIO2') {
                    newwin.document.getElementById('fio2_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '酸碱度' && r.get('ALIAS') == 'pH') {
                    if (r.get('CARE_VALUE') < 7.35) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 7.45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('ph_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '分压' && r.get('ALIAS') == 'PCO2') {
                    if (r.get('CARE_VALUE') < 35) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pco2_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '氧分压' && r.get('ALIAS') == 'PO2') {
                    if (r.get('CARE_VALUE') < 80) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 100) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('po2_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == 'pH(T) 酸碱度' && r.get('ALIAS') == 'pH(T)') {
                    if (r.get('CARE_VALUE') < 7.35) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 7.45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pht_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '标准状态下pH' && r.get('ALIAS') == 'pH(st)') {
                    newwin.document.getElementById('phst_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == 'PCO2(T) 二氧化碳分压' && r.get('ALIAS') == 'PCO2(T)') {
                    if (r.get('CARE_VALUE') < 35) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pco2t_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == 'PO2(T) 氧分压' && r.get('ALIAS') == 'PO2(T)') {
                    if (r.get('CARE_VALUE') < 80) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 100) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('po2t_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '标准碳酸氢根' && r.get('ALIAS') == 'SBC') {
                    if (r.get('CARE_VALUE') < 22) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 26) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('sbc_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '标准碱剩余' && r.get('ALIAS') == 'SBE') {
                    if (r.get('CARE_VALUE') < -3) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 3) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('sbe_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '实际碱剩余' && r.get('ALIAS') == 'ABE') {
                    if (r.get('CARE_VALUE') < -3) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 3) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('abe_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '血氧含量' && r.get('ALIAS') == 'tO2') {
                    newwin.document.getElementById('to2_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '氧饱和度' && r.get('ALIAS') == 'sO2') {
                    if (r.get('CARE_VALUE') < 95) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 99) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('so2_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '总血红蛋白' && r.get('ALIAS') == 'tHb') {
                    newwin.document.getElementById('thb_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '钾' && r.get('ALIAS') == 'K+') {
                    if (r.get('CARE_VALUE') < 3.5) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 5) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('k_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '钙' && r.get('ALIAS') == 'Ca++') {
                    if (r.get('CARE_VALUE') < 1.15) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 1.29) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('ca_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '钠' && r.get('ALIAS') == 'Na+') {
                    if (r.get('CARE_VALUE') < 136) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 146) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('na_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '氯' && r.get('ALIAS') == 'Cl-') {
                    if (r.get('CARE_VALUE') < 95) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 107) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('cl_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '红细胞压积' && r.get('ALIAS') == 'Hct') {
                    if (r.get('CARE_VALUE') < 37) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 50) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('hct_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '血浆渗透压' && r.get('ALIAS') == 'mOsm') {
                    if (r.get('CARE_VALUE') < 275) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 305) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('mosm_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '乳酸' && r.get('ALIAS') == 'Lac') {
                    if (r.get('CARE_VALUE') < 0.5) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 1.7) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('lac_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '葡萄糖' && r.get('ALIAS') == 'Glu') {
                    if (r.get('CARE_VALUE') < 3.9) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 6.1) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('glu_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '总氢离子浓度' && r.get('ALIAS') == 'cH+') {
                    newwin.document.getElementById('ch_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '阴离子间隙' && r.get('ALIAS') == 'AG') {
                    if (r.get('CARE_VALUE') < 10) {
                        fr = '↓';
                    } else if (r.get('CARE_VALUE') > 20) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('anion_id').innerText = r.get('CARE_VALUE') + fr;
                } else if (r.get('NAME') == '氧合血红蛋白' && r.get('ALIAS') == 'O2Hb') {
                    newwin.document.getElementById('o2hb_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '标准状态下PaO2' && r.get('ALIAS') == 'p50(st)') {
                    newwin.document.getElementById('p50st_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == 'HCO3-' && r.get('ALIAS') == 'HCO3-') {
                    newwin.document.getElementById('hco3_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '阴离子间隙(k+)' && r.get('ALIAS') == 'AG(k+)') {
                    newwin.document.getElementById('aniongap_id').innerText = r.get('CARE_VALUE');
                } else if (r.get('NAME') == '血氧饱和度50%时氧分压' && r.get('ALIAS') == 'p50(act)') {
                    newwin.document.getElementById('p50act_id').innerText = r.get('CARE_VALUE');
                }
            }
            newwin.print();
            newwin.close();
        }*/
    }
});