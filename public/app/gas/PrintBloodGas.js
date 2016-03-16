/**
 * Created by Max on 2015/5/4.
 */
/**
 *
 * @param examineId 检验id                         required
 * @param type      ICU为科内检验，OTHER为外科室   required
 * @param maskElement         optional
 */
function printExamine(examineId,type,maskElement){
    if(maskElement) maskElement.mask('正在获取打印数据...', 'loading');
    var examine={};
    Ext.Ajax.request({
        url: webRoot + '/gas/getExamineList',
        method: 'post',
        async: false,
        params: {
            ID: examineId
        },
        success: function (response) {
            var result = Ext.decode(response.responseText);
            if (result.success) {
                if (result.data.length > 0) {
                    examine=result.data[0];
                }
            }
        }
    });
    if(examine.SAMPLE_CODE==null||examine.SAMPLE_CODE=='') {
        Ext.MessageBox.alert('提示', '选中的记录暂无分析结果！');
        if(maskElement) maskElement.unmask();
        return false;
    }
    Ext.Ajax.request({
        url: webRoot + '/gas/getExaminePrintData',
        method:'post',
        params : {
            EXAMINE_ID:examineId,
            TYPE: type
        },
        success : function(response) {
            var result = Ext.decode(response.responseText);
            if (result.success) {
                doPrint(result.data,examineId,examine);
                if(maskElement) maskElement.unmask();
            }
        }
    });
}
function doPrint(data,examineId,examine){
    if(!data||data.length<=0) {
        Ext.MessageBox.alert('提示', '选中的记录暂无分析结果！');
        return false;
    }
    var me = this;
    var records =examine;
        var dateStr = records.EXAMINE_DATE?Ext.Date.format(new Date( records.EXAMINE_DATE), 'Y/m/d'):'',
            submitDateStr= records.SUBMIT_DATE?Ext.Date.format(new Date( records.SUBMIT_DATE), 'Y/m/d'):'',
            reportDateStr= records.REPORT_DATE&&records.REPORT_DATE!=''&&records.REPORT_DATE!=null&&records.REPORT_DATE!='null'?Ext.Date.format(new Date( records.REPORT_DATE), 'Y/m/d'):'',
            sampleDateStr = records.SAMPLING_TIME ? Ext.Date.format(new Date( records.SAMPLING_TIME), 'Y/m/d H:i') : '',
            age = records.AGE, sampleCode = records.SAMPLE_CODE;
        if (dateStr == '' || !sampleCode) {
            Ext.Ajax.request({
                url: webRoot + '/gas/getExamineList',
                method: 'post',
                async: false,
                params: {
                    ID: examineId
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
        //郑州市中心医院血气酸碱分析报告单
        var tableStr = '<table  style="page-break-after:always;width:200mm;font-size:14px;padding-top:15px;" cellpadding=0 cellspacing=0>';
        tableStr += '<tr><td><table style="table-layout:fixed;width: 200mm;" border="0" cellspacing="0" cellpadding="0" style="font-size: 1.05em;"><tr><td style="font-size: 1.38em;font-weight:900;width:158mm;text-align: right;padding-right:105px;padding-bottom:15px;" valign="top">'+hospitalName+'报告单&nbsp;&nbsp;</td>' +
            '<td style="text-align: right;width:5.0cm;font-size: 14px;">标本号:<span style="font-size:1.15em;">' + sampleCode + '</span>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table></td></tr>'
        tableStr += '<tr><td><table style="font-size: 1.05em;padding-left: 25px;" border="0" cellspacing="0" cellpadding="0">';
        tableStr += '<tr><td style="width: 11mm;height: 25px;">姓名:</td><td style="width:40mm;font-weight: bold;font-size:1.2em;" align="left">' + records.PATIENT_NAME + '</td><td style="width:19mm;">病人类型:</td><td style="width: 40mm;font-weight: bold;font-size:1.2em;"><div style="width: 40mm;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> ' + records.PATIENT_TYPE + '</div>' +
            '<td style="width: 11mm;">床号:</td><td style="width: 40mm;font-weight: bold;font-size:1.2em;">' + ( records.BED_NUMBER != null ? records.BED_NUMBER : '') + '</td><td style="width:19mm;">检验日期:</td><td style="width: 40mm;font-weight: bold;font-size:1.2em;">' + dateStr + '</td></tr>';
        tableStr += '<tr><td style="height: 25px;">性别:</td><td style="font-weight: bold;font-size:1.2em;">' +  records.GENDER + '</td><td>住 院 号:</td><td style="font-weight: bold;font-size:1.2em;">' +  records.HOSPITAL_NUMBER + '</td>' +
            '<td>诊断:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width:40mm ;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> ' +  records.DIAGNOSIS + '</div></td><td>标本类型:</td><td style="font-weight: bold;font-size:1.2em;">' + records.SAMPLE_TYPE + '</td></tr>';
        tableStr += '<tr><td style="height: 25px;">年龄:</td><td style="font-weight: bold;font-size:1.2em;">' + age + '</td><td >科&nbsp;&nbsp;室:</td><td style="font-weight: bold;font-size:1.2em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + records.IN_DEPT + '</td>' +
            '<td>备注:</td><td style="font-weight: bold;font-size:1.2em;"><div style="width: ;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"> '+ ( records.DESCRIPTION!=null? records.DESCRIPTION:'')+'</div></td><td>采样时间:</td><td style="width: ;font-weight: bold;font-size:1.2em;">' + sampleDateStr + '</td></tr>';

        tableStr += '</table></td></tr>'
        tableStr += '<tr><td><table style="width:200mm;padding-left: 25px;" border="0" cellspacing="0" cellpadding ="0"><tr><td>' +
            '<table id="group-print-left"   class="itemFont" style="table-layout:fixed;width:110mm" border="0" cellspacing="0" cellpadding="0">' +
            '<tr>' +
            '<td  class="itemFontHeadder" style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 1.5cm;">代号</td><td  class="itemFontHeadder" style="width:3.0cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">项&nbsp;&nbsp;&nbsp;目</td>' +
            '<td  class="itemFontHeadder" style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">结&nbsp;果</td><td  class="itemFontHeadder" style="width:1.6cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">单位</td>' +
            '<td  class="itemFontHeadder" style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2.3cm;">参&nbsp;考&nbsp;值</td>' +
            '</tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="temperature_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="fio2_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="pht_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="pco2t_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="po2t_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="sbc_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="sbe_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="abe_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="to2_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="so2_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;"></td><td></td><td id="thb_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-bottom: 2px solid #000000;"></td><td style="border-bottom: 2px solid #000000;"></td><td style="border-bottom: 2px solid #000000;" id="k_id"></td><td style="border-bottom: 2px solid #000000;"></td><td style="border-bottom: 2px solid #000000;"></td></tr>' +
            '</table></td><td><table class="itemFont" id="group-print-right" style="table-layout:fixed;width:110mm;" border="0" cellspacing="0" cellpadding="0">' +
            '<tr>' +
            '<td  class="itemFontHeadder" style="padding-left: 2px;border-left: 1px solid #000000;border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 1.5cm;overflow: hidden;">代号</td><td  class="itemFontHeadder" style="width:3.0cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">项&nbsp;&nbsp;&nbsp;目</td>' +
            '<td  class="itemFontHeadder" style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2cm;">结&nbsp;果</td><td  class="itemFontHeadder" style="width:1.6cm;border-top: 2px solid #000000;border-bottom: 2px solid #000000;">单位</td>' +
            '<td  class="itemFontHeadder" style="border-top: 2px solid #000000;border-bottom: 2px solid #000000;width: 2.3cm;">参&nbsp;考&nbsp;值</td>' +
            '</tr>' +
             '<tr><td style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="ca_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="na_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="cl_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td  id="hct_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="mosm_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="lac_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="o2hb_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="p50st_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="phst_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="p50act_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;padding-left: 2px;"></td><td></td><td id="hco3_id"></td><td></td><td></td></tr>' +
             '<tr><td  style="height:25px;overflow:hidden;;white-space:nowrap;word-break:keep-all;border-left: 1px solid #000000;border-bottom: 2px solid #000000;padding-left: 2px;"></td><td style="border-bottom: 2px solid #000000;"></td>' +
            '<td style="border-bottom: 2px solid #000000;" id="aniongap_id"></td><td style="border-bottom: 2px solid #000000;"></td><td style="border-bottom: 2px solid #000000;"></td></tr>' +
            '</table></td></tr>';

        tableStr += '</table></td></tr>';
        tableStr += '<tr><td><table   class="itemFontFooter"  style="height:28px;width:200mm;padding-top: 0px;padding-left: 25px;" border="0" cellspacing="0" cellpadding="0"><tr>';
        tableStr += '<td style="width: 20mm;" valign="bottom">送检医生</td><td  valign="bottom" style="width: 30mm;border-bottom: 1px dashed #000000;">'+( records.SUBMIT_DOCTOR!=null? records.SUBMIT_DOCTOR:'')+'</td><td  valign="bottom" style="width: 20mm;">送检日期</td>' +
            '<td  valign="bottom" style="width: 30mm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + submitDateStr + '</td><td style="width: 20mm;" valign="bottom">报告日期</td><td  valign="bottom" style="width:30mm;border-bottom: 1px dashed #000000;padding-left: 5px;">' + reportDateStr + '</td>' +
            '<td valign="bottom" style="width: 15mm;padding-top: 10px;">检验员</td><td  valign="bottom" style="width: 30mm;border-bottom: 1px dashed #000000;padding-top: 10px;">'+( records.CHECKER!=null? records.CHECKER:'')+'</td><td  valign="bottom" style="width:15mm;">复核员</td><td  valign="bottom" style="width: 30mm;border-bottom: 1px dashed #000000;">'+( records.REVIEWER!=null? records.REVIEWER:'')+'</td>';
        tableStr += '</tr></table></td></tr>';
        tableStr += '</table>';

        var titleHtml = tableStr;
        var iframe = document.createElement("iframe");
        iframe.src = '';
        iframe.style.display = "none";
        iframe.style.height = "0px;";
        iframe.style.width = "0px;";
        window.document.body.appendChild(iframe);
        var iDocument=iframe.contentWindow.document;
         var printTableLeft,printTableRight;
        iDocument.write("<style> .itemFont{font-size:1.0em;} .itemFontFooter{font-size:14px;} .itemFont .itemFontHeadder{font-size:14px;font-weight: 900;height:30px;}</style>");
        for(var i=0;i<data.length;i++){
            var dataTable=tableStr;
            var result=data[i];
            dataTable=dataTable.replace('group-print-right',((i+1)+'-print-right')).replace('group-print-left',((i+1)+'-print-left'));
            if(i==data.length-1){dataTable=dataTable.replace('page-break-after:always;','')}
            iDocument.write(dataTable);
            printTableLeft=iDocument.getElementById(((i+1)+'-print-left'));
            printTableRight=iDocument.getElementById(((i+1)+'-print-right'));
            for(var j=0;j<result.length;j++){
                var range="";
                var fr="";
                if(j<12){
                    var cells = printTableLeft.rows[j+1].cells;
                    cells[0].innerText=result[j].ALIAS;
                    cells[1].innerText=result[j].NAME;
                    if(result[j].NORMAL_RANGE!=null&&result[j].NORMAL_RANGE!=""){
                        range=result[j].NORMAL_RANGE.replace('~','--');
                        if(result[j].CARE_VALUE!=null&&result[j].CARE_VALUE!="") {
                            var start=parseFloat(range.split('--')[0]);
                            var end=parseFloat(range.split('--')[1]);
                            if (result[j].CARE_VALUE < start) {
                                fr = '↓';
                            } else if (result[j].CARE_VALUE > end) {
                                fr = '↑';
                            }
                        }
                    }
                    cells[2].innerHTML=result[j].CARE_VALUE+fr;
                    cells[3].innerText=result[j].UNIT;
                    cells[4].innerText=range;
                }else if(j<30){
                    var cells = printTableRight.rows[j-12+1].cells;
                    cells[0].innerText=result[j].ALIAS;
                    cells[1].innerText=result[j].NAME;
                    if(result[j].NORMAL_RANGE!=null&&result[j].NORMAL_RANGE!=""){
                        range=result[j].NORMAL_RANGE.replace('~','--');
                        if(result[j].CARE_VALUE!=null&&result[j].CARE_VALUE!="") {
                            var start=parseFloat(range.split('--')[0]);
                            var end=parseFloat(range.split('--')[1]);
                            if (result[j].CARE_VALUE < start) {
                                fr = '↓';
                            } else if (result[j].CARE_VALUE > end) {
                                fr = '↑';
                            }
                        }
                    }
                    cells[2].innerText=result[j].CARE_VALUE+fr;
                    cells[3].innerText=result[j].UNIT;
                    cells[4].innerText=range;
                }
            }
        }
        iframe.contentWindow.print();
        window.document.body.removeChild(iframe);
}
function printHtml(html){
    var titleHtml = html;
    var iframe = document.createElement("iframe");
    iframe.src = '';
    iframe.style.display = "none";
    iframe.style.height = "0px;";
    iframe.style.width = "0px;";
    window.document.body.appendChild(iframe);
    var iDocument=iframe.contentWindow.document;
    iDocument.write(titleHtml);
    iframe.contentWindow.print();
    window.document.body.removeChild(iframe);
}
