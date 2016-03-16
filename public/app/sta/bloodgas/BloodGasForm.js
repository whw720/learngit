/**
 * 血气分析报表查询面板
 * Created by whw on 15-4-9.
 */
Ext.define('com.dfsoft.icu.sta.bloodgas.BloodGasForm', {
    extend: 'Ext.form.Panel',
    alias: 'sta_blood_gas_form',
    id: 'sta_blood_gas_form_panel',
    layout: 'border',
    closable: true,
    title: '血气分析',

    initComponent: function () {
        Ext.util.CSS.swapStyleSheet('stabloodgas.css', webRoot + '/app/sta/bloodgas/css/stabloodgas.css');
        var me = this;
        me.centerOptions = me.createCenter();
        me.rightOptions = me.createRigthCenter();

        Ext.apply(me, {
            html:'<iframe src="about:blank"  style="display:none;" width="200" height="100" id="score_excel_iframe"></iframe>',
            items: [
                {
                    region: 'center',
                    layout: 'fit',
                    style: {
                        'background-color': '#FFF'
                    },
                    split: {
                        size: 5
                    },
                    border: 1,
                    items: [
                        me.centerOptions
                    ]
                },
                {   region: 'east',
                    width: '35%',
                    layout: 'fit',
                    split: {
                        size: 5
                    },
                    style: {
                        'background-color': '#FFF'
                    },
                    border: 1,
                    items: [me.rightOptions]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    //dock: 'top',
                    //border: false,
                    //layout:'fit',
                    padding: '0 0 0 0',
                    items: [
                        {
                            xtype: 'buttongroup',
                            border: false,
                            width:'92%',
                            padding: '0 0 0 0',
                            columns: 6,
                            items: [
                                {
                                    xtype: 'datefield',
                                    name: 'blood-gas-start-time',
                                    fieldLabel: '检验日期',
                                    format: 'Y/m/d',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    trigger2Cls: 'x-form-date-trigger',
                                    onTrigger1Click: function () {
                                        this.setRawValue('');
                                        this.setValue('');
                                    },
                                    //value: new Date(),
                                    width: 185,
                                    editable: false,
                                    msgTarget: 'none',
                                    preventMark: true,
                                    labelWidth: 56,
                                    labelAlign: 'right'
                                },
                                {
                                    xtype: 'datefield',
                                    name: 'blood-gas-end-time',
                                    fieldLabel: '--',
                                    labelSeparator: '',
                                    format: 'Y/m/d',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    trigger2Cls: 'x-form-date-trigger',
                                    onTrigger1Click: function () {
                                        this.setRawValue('');
                                        this.setValue('');
                                    },
                                    //value: new Date(),
                                    width: 135,
                                    editable: false,
                                    msgTarget: 'none',
                                    preventMark: true,
                                    labelWidth: 9,
                                    labelAlign: 'right'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-patient-number',
                                    //width: 100,
                                    fieldLabel: '病历号',
                                    labelWidth: 43
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-patient-name',
                                    //width: 80,
                                    fieldLabel: '姓名',
                                    labelWidth: 30
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-order-doctor',
                                    //width: 110,
                                    fieldLabel: '送检医师',
                                    labelWidth: 56
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-patient-type',
                                    //width: 110,
                                    fieldLabel: '病人类型',
                                    labelWidth: 56
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'blood-gas-start-sample',
                                    fieldLabel: '标本号',
                                    width: 185,
                                    labelWidth: 56,
                                    labelAlign: 'right'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'blood-gas-end-sample',
                                    fieldLabel: '--',
                                    labelSeparator: '',
                                    width: 135,
                                    labelWidth: 9,
                                    labelAlign: 'right'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-patient-bed-number',
                                    //width: 100,
                                    fieldLabel: '床 号',
                                    labelWidth: 43
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-dept-name',
                                    //width: 80,
                                    fieldLabel: '科室',
                                    labelWidth: 30
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-check-doctor',
                                    //width: 110,
                                    fieldLabel: '检验医师',
                                    labelWidth: 56
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'sta-sample-type',
                                    //width: 110,
                                    fieldLabel: '标本类型',
                                    labelWidth: 56
                                }

                            ]
                        },
                        {
                            xtype: 'buttongroup',
                            border: false,
                            width:'8%',
                            height:79,
                            padding: '0 0 0 0',
                            columns: 2,
                            items:[{
                                xtype: 'button',
                                iconCls: 'sta-blood-refresh',
                                scale: 'small',
                                tooltip: '查询',
                                handler: function (btn) {
                                    me.queryOrder();
                                }
                            },
                                {
                                    xtype: 'button',
                                    iconCls: 'sta-blood-excel',
                                    scale: 'small',
                                    tooltip: '导出',
                                    handler: function (btn) {
                                        me.excelCountConsumable();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'sta-blood-print',
                                    scale: 'small',
                                    tooltip: '打印',
                                    handler: function (btn) {
                                        me.printBlood();
                                    }
                                }]
                        }
                    ]
                }
            ]
        });
        me.callParent();
    },
    //刷新按纽，查询数据
    queryOrder: function (pageNum) {
        var me = this;
        var orderForm = me.getForm();
        var beginDate = orderForm.findField('blood-gas-start-time').getValue();
        var endDate = orderForm.findField('blood-gas-end-time').getValue();
        if (beginDate&&endDate&&beginDate.getTime() > endDate.getTime()) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '标本查询开始日期不能大于结束日期',
                width: 200,
                modal: true,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var patientNumber = orderForm.findField('sta-patient-number').getValue();
        var patientName = orderForm.findField('sta-patient-name').getValue();
        var orderDoctor = orderForm.findField('sta-order-doctor').getValue();
        var patientType = orderForm.findField('sta-patient-type').getValue();
        var startSample = orderForm.findField('blood-gas-start-sample').getValue();
        var endSample = orderForm.findField('blood-gas-end-sample').getValue();
        var bedNumber = orderForm.findField('sta-patient-bed-number').getValue();
        var deptName = orderForm.findField('sta-dept-name').getValue();
        var checkDoctor = orderForm.findField('sta-check-doctor').getValue();
        var sampleType = orderForm.findField('sta-sample-type').getValue();

        var treePanel = me.centerOptions;
        var store = treePanel.getStore();
        beginDate = beginDate?beginDate.Format("yyyy-MM-dd"):'';
        endDate = endDate?endDate.Format("yyyy-MM-dd"):'';
        store.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                beginDate: beginDate,
                endDate: endDate,
                patientNumber: patientNumber,
                patientName: patientName,
                orderDoctor: orderDoctor,
                patientType: patientType,
                startSample: startSample,
                endSample: endSample,
                bedNumber: bedNumber,
                deptName: deptName,
                checkDoctor: checkDoctor,
                sampleType: sampleType
            });
        });
        store.loadPage(1);
        var rightStore = me.rightOptions.getStore().removeAll();
    },
    //创建中间treegrid面板
    createCenter: function () {
        var options = Ext.create('com.dfsoft.icu.sta.bloodgas.BloodGasCenter', {
            parent: this
        });
        return options;
    },
    //创建中间grid面板
    createRigthCenter: function () {
        var options = Ext.create('com.dfsoft.icu.sta.bloodgas.BloodGasRight', {
            parent: this
        });
        return options;
    },
//导出excel
    excelCountConsumable:function(){
        var me=this;
        var orderForm = me.getForm();
        var beginDate = orderForm.findField('blood-gas-start-time').getValue();
        var endDate = orderForm.findField('blood-gas-end-time').getValue();
        if (beginDate&&endDate&&beginDate.getTime() > endDate.getTime()) {
            Ext.MessageBox.show({
                title: '提示',
                msg: '标本查询开始日期不能大于结束日期',
                width: 200,
                modal: true,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var patientNumber = orderForm.findField('sta-patient-number').getValue();
        var patientName = orderForm.findField('sta-patient-name').getValue();
        var orderDoctor = orderForm.findField('sta-order-doctor').getValue();
        var patientType = orderForm.findField('sta-patient-type').getValue();
        var startSample = orderForm.findField('blood-gas-start-sample').getValue();
        var endSample = orderForm.findField('blood-gas-end-sample').getValue();
        var bedNumber = orderForm.findField('sta-patient-bed-number').getValue();
        var deptName = orderForm.findField('sta-dept-name').getValue();
        var checkDoctor = orderForm.findField('sta-check-doctor').getValue();
        var sampleType = orderForm.findField('sta-sample-type').getValue();
        //beginDate = beginDate.Format("yyyy-MM-dd") ;
        //endDate = endDate.Format("yyyy-MM-dd");
        beginDate = beginDate?beginDate.Format("yyyy-MM-dd"):'';
        endDate = endDate?endDate.Format("yyyy-MM-dd"):'';
        Ext.Ajax.request({
            url: webRoot + '/sta/bloodgas/exportBloodgas',
            method: 'POST',
            params:{
                beginDate: beginDate,
                endDate: endDate,
                patientNumber: patientNumber,
                patientName: patientName,
                orderDoctor: orderDoctor,
                patientType: patientType,
                startSample: startSample,
                endSample: endSample,
                bedNumber: bedNumber,
                deptName: deptName,
                checkDoctor: checkDoctor,
                sampleType: sampleType
            },
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    var colAllCount=47,
                        rowAllCount=result.data.length+1,
                        arr=me.getExcelColumnArr();
                    var str='';
                    str='createGrid,'+rowAllCount+','+colAllCount+';';
                    for(var i= 0;i<arr.length;i++){
                        str+='cellValue,0,'+i+',' + arr[i] + ';cellFont,0,'+i+',,1;cellAlign,0,'+i+',center;';
                    }
                    for(var i=0;i<rowAllCount;i++){
                        var da=result.data[i];
                        var j=0;
                        for(var d in da){
                            str+='cellValue,'+(i+1)+','+j+',' + (da[d]==null?'':da[d]) + ';cellAlign,'+(i+1)+','+j+',left;';
                            j++;
                        }
                    }

                    var url=hummerurl + '/application/controller/run/ExportExcel.action';
                    var htmlStr = '<form action="'+url+'" method="post" target="_self" id="score_postData_form">'+
                        '<input id="content" name="content" type="hidden" value="'+str+'"/>'+
                        '<input id="name" name="name" type="hidden" value="血气分析统计表"/>'+
                        '</form>';
                    var iframe1=document.getElementById('score_excel_iframe');
                    iframe1.contentWindow.document.open();
                    iframe1.contentWindow.document.write(htmlStr);
                    iframe1.contentWindow.document.close();
                    iframe1.contentWindow.document.getElementById('score_postData_form').submit();
                }
            }
        });


    },
    getExcelColumnArr:function(){
        var arr=[
            "日期","标本号","姓名","病历号","病人类型","性别","年龄","科室","床号","送检医生","送检日期"
            ,"操作员","报告日期","标本","费别","核对人","诊断","备注"
            ,"T","FIO2","pH","pCO2","PO2","K+","Na+","Ca++","Cl-","pH(T)","pCO2(T)","PO2(T)"
            ,"HCO3-","p50(act)","ABE","SBE","CH+","SO2","Anion gap (K+)","SBC","Glu"
            ,"O2Hb","Lac","mOsm","Hct","cBase(Ecf，ox)","tHb","tO2","Anion gap"
        ];
        return arr;
    },
    printBlood: function () {
        var me = this;
        var records = me.centerOptions.getSelectionModel().getSelection();
        if (records.length <= 0) {
            Ext.MessageBox.alert('提示', '请选中需要打印的标本号');
        } else {
            if(records[0].data.SIMPLE_CODE==null||records[0].data.SIMPLE_CODE==""){
                Ext.MessageBox.alert('提示', '标本号不能为空！');
                return;
            }
            printExamine(records[0].get('ID'),records[0].get('TYPE'),me.getEl());
            // console.log(me.patientInfo.DESCRIPTION);
            /*var age = records[0].data.AGE==null?'':records[0].data.AGE,
                NAME = records[0].data.NAME==null?'':records[0].data.NAME,
                GENDER = records[0].data.GENDER==null?'':records[0].data.GENDER,
                BED_NUMBER = records[0].data.BED_NUMBER==null?'':records[0].data.BED_NUMBER,
                DIAGNOSIS=records[0].data.DIAGNOSIS==null?'':records[0].data.DIAGNOSIS,
                DEPT_NAME=records[0].data.DEPT_NAME==null?'':records[0].data.DEPT_NAME,
                HOSPITAL_NUMBER=records[0].data.HOSPITAL_NUMBER==null?'':records[0].data.HOSPITAL_NUMBER,
                SIMPLE_CODE=records[0].data.SIMPLE_CODE==null?'':records[0].data.SIMPLE_CODE,
                p_type=records[0].data.P_TYPE==null?'':records[0].data.P_TYPE,
                dateStr=Ext.Date.format(new Date(records[0].data.SAMPLING_TIME), 'Y/m/d'),
                checkDateStr=records[0].data.SUBMIT_DATE==null?'':Ext.Date.format(new Date(records[0].data.SUBMIT_DATE), 'Y/m/d'),
                reportDateStr=records[0].data.REPORT_TIME==null?'':Ext.Date.format(new Date(records[0].data.REPORT_TIME), 'Y/m/d'),
                examineDateStr=records[0].data.EXAMINE_DATE==null?'':Ext.Date.format(new Date(records[0].data.EXAMINE_DATE), 'Y/m/d'),
                memo=records[0].data.DESCRIPTION==null?'':records[0].data.DESCRIPTION,
                review=records[0].data.REVIEWER==null?'':records[0].data.REVIEWER,
                checker=records[0].data.CHECKER==null?'':records[0].data.CHECKER,
                sumitDoctor=records[0].data.SUBMIT_DOCTOR?records[0].SUBMIT_DOCTOR:'';

            //var dateStr = Ext.Date.format(new Date(records[0].data.SAMPLING_TIME), 'Y/m/d');
            var tableStr = '<table  style="padding:30px;width:30cm;font-size: 14px;" cellpadding=0 cellspacing=0>';
            tableStr += '<tr><td><table style="width: 100%;" border="0" cellspacing="0" cellpadding="0"><tr><td style="font-size: 22px;width:12.5cm;text-align: right;padding-right:20px;padding-bottom:10px;">郑州市中心医院血气酸碱分析报告单</td>' +
                '<td style="text-align: right;width:4.5cm;">标本号:' + SIMPLE_CODE + '&nbsp;&nbsp;</td></tr></table></td></tr>'
            tableStr += '<tr><td><table style="width: 100%;" border="0" cellspacing="0" cellpadding="0">';
            tableStr += '<tr><td style="width: 1.1cm;height: 25px;">姓名:</td><td style="width:6cm;font-weight: bold;font-size:1.2em;">' + NAME + '</td><td style="width: 1.4cm;">病人类型:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">'+p_type+'</td>' +
                '<td style="width: 1.1cm;">床号:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">' + BED_NUMBER + '</td><td style="width: 2cm;">检验日期:</td><td style="width: 6cm;font-weight: bold;font-size:1.2em;">' + dateStr + '</td></tr>';
            tableStr += '<tr><td style="height: 25px;">性别:</td><td style="font-weight: bold;font-size:1.2em;">' + GENDER + '</td><td>住 院 号:</td><td style="font-weight: bold;font-size:1.2em;">' + HOSPITAL_NUMBER + '</td>' +
                '<td>诊断:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width: 5.5cm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> ' + DIAGNOSIS + '</div></td><td>标本类型:</td><td style="font-weight: bold;font-size:1.2em;">' + records[0].data.SIMPLE_TYPE + '</td></tr>';
            tableStr += '<tr><td style="height: 25px;">年龄:</td><td style="font-weight: bold;font-size:1.2em;">' + age + '</td><td >科&nbsp;&nbsp;室:</td><td style="font-weight: bold;font-size:1.2em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + DEPT_NAME + '</td>' +
                '<td>备注:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width: 5.5cm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> '+memo+'</div></td><td>采样时间:</td><td>' + examineDateStr + '</td></tr>';

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
            tableStr += '<td style="width: 1.6cm;">送检医生</td><td style="width: 2.4cm;border-bottom: 1px dashed #000000;">'+sumitDoctor+'</td><td style="width: 1.6cm;">送检日期</td>' +
                '<td style="width: 3cm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + checkDateStr + '</td><td style="width: 1.6cm;">报告日期</td><td style="width: 3cm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + reportDateStr + '</td>' +
                '<td style="width: 1.4cm;padding-top: 10px;">检验员</td><td style="width: 3cm;border-bottom: 1px dashed #000000;padding-top: 10px;">'+checker+'</td><td style="width:1.6cm;">复核员</td><td style="width: 3cm;border-bottom: 1px dashed #000000;">'+review+'</td>';
            tableStr += '</tr></table></td></tr>';
            tableStr += '</table>';
            var titleHtml = tableStr;
            var newwin = window.open('printer.html', '', '');
            if(newwin&&newwin.document){
                newwin.document.write(titleHtml);
                newwin.document.location.reload();



            var store = me.rightOptions.getStore();
            var recordCount = store.getCount();
            for (var i = 0; i < recordCount; i++) {
                var r = store.getAt(i);
                var fr = '';
                if (r.get('name') == '血液温度' && r.get('alias') == 'T(B)') {
                    newwin.document.getElementById('temperature_id').innerText = r.get('care_value');
                } else if (r.get('name') == '吸氧量' && r.get('alias') == 'FIO2') {
                    newwin.document.getElementById('fio2_id').innerText = r.get('care_value');
                } else if (r.get('name') == '酸碱度' && r.get('alias') == 'pH') {
                    if (r.get('care_value') < 7.35) {
                        fr = '↓';
                    } else if (r.get('care_value') > 7.45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('ph_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '分压' && r.get('alias') == 'PCO2') {
                    if (r.get('care_value') < 35) {
                        fr = '↓';
                    } else if (r.get('care_value') > 45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pco2_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '氧分压' && r.get('alias') == 'PO2') {
                    if (r.get('care_value') < 80) {
                        fr = '↓';
                    } else if (r.get('care_value') > 100) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('po2_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == 'pH(T) 酸碱度' && r.get('alias') == 'pH(T)') {
                    if (r.get('care_value') < 7.35) {
                        fr = '↓';
                    } else if (r.get('care_value') > 7.45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pht_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == 'PCO2(T) 二氧化碳分压' && r.get('alias') == 'PCO2(T)') {
                    if (r.get('care_value') < 35) {
                        fr = '↓';
                    } else if (r.get('care_value') > 45) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('pco2t_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == 'PO2(T) 氧分压' && r.get('alias') == 'PO2(T)') {
                    if (r.get('care_value') < 80) {
                        fr = '↓';
                    } else if (r.get('care_value') > 100) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('po2t_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '标准碳酸氢根' && r.get('alias') == 'SBC') {
                    if (r.get('care_value') < 22) {
                        fr = '↓';
                    } else if (r.get('care_value') > 26) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('sbc_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '标准碱剩余' && r.get('alias') == 'SBE') {
                    if (r.get('care_value') < -3) {
                        fr = '↓';
                    } else if (r.get('care_value') > 3) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('sbe_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '实际碱剩余' && r.get('alias') == 'ABE') {
                    if (r.get('care_value') < -3) {
                        fr = '↓';
                    } else if (r.get('care_value') > 3) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('abe_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '血氧含量' && r.get('alias') == 'tO2') {
                    newwin.document.getElementById('to2_id').innerText = r.get('care_value');
                } else if (r.get('name') == '氧饱和度' && r.get('alias') == 'sO2') {
                    if (r.get('care_value') < 95) {
                        fr = '↓';
                    } else if (r.get('care_value') > 99) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('so2_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '总血红蛋白' && r.get('alias') == 'tHb') {
                    newwin.document.getElementById('thb_id').innerText = r.get('care_value');
                } else if (r.get('name') == '钾' && r.get('alias') == 'K+') {
                    if (r.get('care_value') < 3.5) {
                        fr = '↓';
                    } else if (r.get('care_value') > 5) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('k_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '钙' && r.get('alias') == 'Ca++') {
                    if (r.get('care_value') < 1.15) {
                        fr = '↓';
                    } else if (r.get('care_value') > 1.29) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('ca_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '钠' && r.get('alias') == 'Na+') {
                    if (r.get('care_value') < 136) {
                        fr = '↓';
                    } else if (r.get('care_value') > 146) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('na_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '氯' && r.get('alias') == 'Cl-') {
                    if (r.get('care_value') < 95) {
                        fr = '↓';
                    } else if (r.get('care_value') > 107) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('cl_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '红细胞压积' && r.get('alias') == 'Hct') {
                    if (r.get('care_value') < 37) {
                        fr = '↓';
                    } else if (r.get('care_value') > 50) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('hct_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '血浆渗透压' && r.get('alias') == 'mOsm') {
                    if (r.get('care_value') < 275) {
                        fr = '↓';
                    } else if (r.get('care_value') > 305) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('mosm_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '乳酸' && r.get('alias') == 'Lac') {
                    if (r.get('care_value') < 0.5) {
                        fr = '↓';
                    } else if (r.get('care_value') > 1.7) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('lac_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '葡萄糖' && r.get('alias') == 'Glu') {
                    if (r.get('care_value') < 3.9) {
                        fr = '↓';
                    } else if (r.get('care_value') > 6.1) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('glu_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '总氢离子浓度' && r.get('alias') == 'cH+') {
                    newwin.document.getElementById('ch_id').innerText = r.get('care_value');
                } else if (r.get('name') == '阴离子间隙' && r.get('alias') == 'AG') {
                    if (r.get('care_value') < 10) {
                        fr = '↓';
                    } else if (r.get('care_value') > 20) {
                        fr = '↑';
                    }
                    newwin.document.getElementById('anion_id').innerText = r.get('care_value') + fr;
                } else if (r.get('name') == '氧合血红蛋白' && r.get('alias') == 'O2Hb') {
                    newwin.document.getElementById('o2hb_id').innerText = r.get('care_value');
                } else if (r.get('name') == '标准状态下PaO2' && r.get('alias') == 'p50(st)') {
                    newwin.document.getElementById('p50st_id').innerText = r.get('care_value');
                } else if (r.get('name') == 'HCO3-' && r.get('alias') == 'HCO3-') {
                    newwin.document.getElementById('hco3_id').innerText = r.get('care_value');
                } else if (r.get('name') == '阴离子间隙(k+)' && r.get('alias') == 'AG(k+)') {
                    newwin.document.getElementById('aniongap_id').innerText = r.get('care_value');
                }else if(r.get('name') == '血氧饱和度50%时氧分压' && r.get('alias') == 'p50(act)'){
                    newwin.document.getElementById('p50act_id').innerText = r.get('care_value');
                }else if(r.get('name') == '标准状态下pH' && r.get('alias') == 'pH(st)'){
                    newwin.document.getElementById('phst_id').innerText = r.get('care_value');
                }
            }
            newwin.print();
            newwin.close();
            }*/
        }
    }
});
