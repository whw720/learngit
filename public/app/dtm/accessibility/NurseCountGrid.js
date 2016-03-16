/**
 * 护士月工作量统计
 * @author:whw
 * @date:2014-4-1.
 */
Ext.define('com.dfsoft.icu.dtm.accessibility.NurseCountGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'com.dfsoft.icu.dtm.accessibility.MonthComboBox'
    ],
    fourceFit:true,
    initComponent: function () {
        var me = this;
        me.id = 'accessibility-nurse-count-grid' + (me.owner && me.owner == 'D' ? 'D' : '');
        me.owner = (me.owner && me.owner == 'D' ? 'D' : 'N');
        Ext.QuickTips.init();
        me.field=['ID','NAME','SCORE_ALL'];
        me.startDatefield=Ext.widget({
            xtype:'datefield',
            fieldLabel:'统计日期',
            labelWidth:60,
            format:'Y-m-d',
            value:Ext.Date.format(new Date(),'Y-m-01'),
            width:180,
            editable:false
        });
        me.endDatefield=Ext.widget({
            xtype:'datefield',
            format:'Y-m-d',
            value:new Date(),
            width:110,
            editable:false
        });
        me.column = [
            {
                text: '序号',
                xtype: 'rownumberer',
                width: 40,
                align: 'center'
            },
            { text: '姓名',
                dataIndex: 'NAME',
                style: {
                    'text-align': 'center'
                },
                width: 100,
                align: 'left'
            },
            {
                text: '工作总分',
                dataIndex: 'SCORE_ALL',
                cls:'dtm-consumable-column-css',
                style: {
                    'text-align': 'center'
                },
                width: 80,
                align: 'right',
                renderer: function(value){
                    if(value){
                        return Math.round(value*100)/100;
                    }
                }
            }
        ];
        Ext.apply(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    style:{
                        'border-bottom':'1px solid #C0C0C0 !important'
                    },
                    html: '<iframe src="about:blank"  style="display:none;" width="200" height="100" id="nurse_excel_iframe' + (me.owner && me.owner == 'D' ? 'D' : '') + '"></iframe>',
                    items : ['->',
                            me.startDatefield,'<span style="margin-left: -6px;">至</span>',me.endDatefield,{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-refresh',
                            scale: 'small',
                            tooltip: '查询',
                            handler:function(btn){
                                me.queryNurseCount();
                            }
                        },'-',{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-print',
                            scale: 'small',
                            tooltip: '打印',
                            handler:function(){
                                me.printGrid();
                            }
                        },{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-excel',
                            scale: 'small',
                            tooltip: '导出',
                            handler:function(){
                                me.excelCountConsumable();
                            }
                        }
                    ]
                },
                {
                    xtype:'toolbar',
                    height:56,
                    html:'<div style="width:100%;font-size:24px;text-align: center;font-weight:bold;">' + (me.owner && me.owner == 'D' ? '医生' : '护士') +'工作量统计</div>'+
                        '<div style="font-size:11px;text-align: left" id="report_count_yearmonth">'+me.startDatefield.getRawValue()+'至'+me.endDatefield.getRawValue()+'</div>'
                }
            ],
            columnLines: true,
            border: false,
            store: [],
            columns: [],
            listeners:{
                afterrender:function(_this,e){
                    Ext.Ajax.request({
                        url: webRoot + '/dtm/accessibility/query_nurse_column/' + (me.owner && me.owner == 'D' ? 'D' : 'N'),
                        success: function(response) {
                            var result = Ext.decode(response.responseText);
                            if (result.success){
                                var res=result.data;
                                var reg = /null/g;
                                me.column= [
                                    {
                                        text: '序号',
                                        xtype: 'rownumberer',
                                        width: 40,
                                        align: 'center'
                                    },
                                    { text: '姓名',
                                        dataIndex: 'NAME',
                                        style: {
                                            'text-align': 'center'
                                        },
                                        width: 100,
                                        align: 'left'
                                    },
                                    {
                                        text: '工作总分',
                                        dataIndex: 'SCORE_ALL',
                                        cls:'dtm-consumable-column-css',
                                        style: {
                                            'text-align': 'center'
                                        },
                                        width: 80,
                                        align: 'right',
                                        renderer: function(value){
                                            if(value){
                                                return Math.round(value*100)/100;
                                            }
                                        }
                                    }
                                ];
                                var rex = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;///[^x00-xff]/g;
                                for(var re in res){
                                    console.log(re);
                                    var text = re.replace(reg, '');
                                    if(text=='distinct') break;
                                    var parentLength=text.replace(rex,'aa').length;
                                    var childLength=0;
                                    if(res[re].length==1) {
                                        childLength = res[re][0].text.replace(rex, 'aa').length;
                                        if (parentLength > childLength&&(parentLength-childLength)>=8) {
                                              res[re][0].width=parentLength*8 +(110/(parentLength-childLength))*2;
                                        }
                                    }
                                    me.column.push({
                                        text:text,
                                        cls:'dtm-consumable-column-css',
                                        style: {
                                            'text-align': 'center'
                                        },
                                        columns:res[re]
                                    });

                                    for(var i=0;i<res[re].length;i++){
                                        var fe=res[re][i];
                                        me.field.push(fe.dataIndex);
                                    }
                                }
                                me.groupStore=Ext.create('Ext.data.Store',{
                                    fields:me.field,
                                    proxy: {
                                        type: 'ajax',
                                        url: webRoot + '/dtm/accessibility/query_nurse_count',
                                        extraParams:{
                                            startDate:   me.startDatefield.getRawValue(),
                                            endDate:me.endDatefield.getRawValue(),
                                            owner: me.owner && me.owner == 'D' ? 'D' : 'N'
                                        },
                                        reader: {
                                            type: 'json',
                                            root: 'data'
                                        }
                                    },
                                    autoLoad: true,
                                    listeners: {
                                        beforeload: function () {
                                            me.msgTip = new Ext.LoadMask(me.getEl(), {
                                                msg: 'loading...',
                                                removeMask: true
                                            });
                                            me.msgTip.show();
                                        },
                                        load: function () {
                                            me.msgTip.hide();
                                        }
                                    }
                                });
                                me.reconfigure(me.groupStore, Ext.grid.column.Column(me.column));
                            }
                        }
                    });
                }
            }
        });
        me.callParent();
    },
    queryNurseCount:function(){
        var me=this;
        if( me.endDatefield.getValue().getTime()- me.startDatefield.getValue().getTime()<0){
            Ext.MessageBox.show({
                title:'提示',
                msg:'终止日期不能小于起始日期!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        me.fireEvent('afterrender');
        document.getElementById('report_count_yearmonth').innerText= me.startDatefield.getRawValue()+"至"+me.endDatefield.getRawValue();
        me.groupStore.on('beforeload', function (_store, options) {
            Ext.apply(_store.proxy.extraParams, {
                startDate:   me.startDatefield.getRawValue(),
                endDate:me.endDatefield.getRawValue()
            });
        });
        me.groupStore.load();
    },
    printGrid:function() {
        var me = this;
        if( me.endDatefield.getValue().getTime()- me.startDatefield.getValue().getTime()<0){
            Ext.MessageBox.show({
                title:'提示',
                msg:'终止日期不能小于起始日期!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        var gridcontrol = Ext.getCmp('accessibility-nurse-count-grid' + (me.owner && me.owner == 'D' ? 'D' : ''));
        var cm = me.column;//gridcontrol.getColumnModel();
        var ym=document.getElementById('report_count_yearmonth').innerText;
        var colCount = cm.length;
        var temp_obj = new Array();
        var colAllCount = 0;
        for (var i = 0; i < colCount; i++) {
            if (cm[i].columns != null && cm[i].columns.length > 0) {
                colAllCount += cm[i].columns.length;
                temp_obj = temp_obj.concat(cm[i].columns);
            } else {
                colAllCount++;
                temp_obj.push(cm[i]);
            }
        }
        var tableStr = '<table style="border-top:1px black solid;border-left:1px black solid;"cellpadding=0 cellspacing=0>';

        tableStr += '<tr><td colspan="' + colAllCount + '" style="border-right:1px black solid;font-size:24px;text-align: center;font-weight:bold;">' + (me.owner && me.owner == 'D' ? '医生' : '护士') + '工作量统计</td></tr>';
        tableStr += '<tr><td colspan="' + colAllCount + '" style="border-right:1px black solid;border-bottom:1px black solid;font-size:11px;text-align: left;">' + ym + '</td></tr>';

        tableStr = tableStr + '<tr>';
        for (var i = 0; i < colCount; i++) {
            if (cm[i].columns != null && cm[i].columns.length > 0) {
                tableStr = tableStr + '<td colspan="' + cm[i].columns.length + '" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + cm[i].text + '</td>';
            } else {
                tableStr = tableStr + '<td rowspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + cm[i].text + '</td>';
            }
        }
        tableStr = tableStr + '</tr>';
        tableStr = tableStr + '<tr>';
        for (var i = 0; i < colCount; i++) {
            if (cm[i].columns != null && cm[i].columns.length > 0) {
                for (var j = 0; j < cm[i].columns.length; j++) {
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:70px;">' + cm[i].columns[j].text + '</td>';
                }
            }
        }
        tableStr = tableStr + '</tr>';
        var store = gridcontrol.getStore();
        var recordCount = store.getCount();
        for (var i = 0; i < recordCount; i++) {
            var r = store.getAt(i);
            tableStr = tableStr + '<tr>';
            for (var j = 0; j < temp_obj.length; j++) {
                var dateIndex = temp_obj[j].dataIndex;
                var tdvalue = r.get(dateIndex);
                if (tdvalue == null) {
                    tdvalue = '';
                }
                if (j == 0) {
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + (i + 1) + '</td>';
                } else if (j == 1) {
                    tableStr = tableStr + '<td nowrap style="width:71px;border-right:1px black solid;border-bottom:1px black solid;">' + tdvalue + '</td>';
                } else if (j == 2) {
                    tableStr = tableStr + '<td width="71" align="right" style="border-right:1px black solid;border-bottom:1px black solid;">' + (tdvalue == 0 ? '' : Math.round(tdvalue * 100) / 100);
                    +'</td>';
                } else {
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: right;">' + tdvalue + '</td>';
                }
            }
            tableStr = tableStr + '</tr>';
        }
        tableStr = tableStr + '</table>';
        printHtml(tableStr);
    },
    //导出excel
    excelCountConsumable:function(){
        var me=this;
        if( me.endDatefield.getValue().getTime()- me.startDatefield.getValue().getTime()<0){
            Ext.MessageBox.show({
                title:'提示',
                msg:'终止日期不能小于起始日期!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        var gridcontrol = Ext.getCmp('accessibility-nurse-count-grid' + (me.owner && me.owner == 'D' ? 'D' : ''));

        var cm = me.column;//gridcontrol.getColumnModel();
        var ym=document.getElementById('report_count_yearmonth').innerText;
        var colCount = cm.length;
        var temp_obj = new Array();
        var colAllCount=0;
        for (var i = 0; i < colCount; i++) {
            if(cm[i].columns!=null&&cm[i].columns.length>0){
                colAllCount+=cm[i].columns.length;
                temp_obj=temp_obj.concat(cm[i].columns);
            }else{
                colAllCount++;
                temp_obj.push(cm[i]);
            }
        }
        var str='';
        str+='mergeCell,0,0,0,'+(colAllCount-1)+';cellValue,0,0,' + (me.owner && me.owner == 'D' ? '医生' : '护士') +'工作量统计;cellAlign,0,0,center;cellFont,0,0,20,1;';
        str+='mergeCell,1,1,0,'+(colAllCount-1)+';cellValue,1,0,'+ym+';cellAlign,1,0,left;';
        var tdNum=0;
        for (var i = 0; i < colCount; i++) {
            if(cm[i].columns!=null&&cm[i].columns.length>0){
                str+='mergeCell,2,2,'+tdNum+','+(tdNum+cm[i].columns.length-1)+';cellValue,2,'+tdNum+','+cm[i].text+';cellFont,2,'+tdNum+',,1;cellAlign,2,'+tdNum+',center;';
                for(var j=0;j<cm[i].columns.length;j++){
                    str+='cellValue,3,'+(tdNum+j)+','+cm[i].columns[j].text+';cellFont,3,'+(tdNum+j)+',,1;cellAlign,3,'+(tdNum+j)+',center;'
                    //tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:70px;">' + cm[i].columns[j].text + '</td>';
                }
                tdNum+=cm[i].columns.length;
                //tableStr = tableStr + '<td colspan="'+cm[i].columns.length+'" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + cm[i].text + '</td>';
            }else{
                tdNum++;
                str+='mergeCell,2,3,'+i+','+i+';cellValue,2,'+i+','+cm[i].text+';cellFont,2,'+i+',,1;cellAlign,2,'+i+',center;';
                //tableStr = tableStr + '<td rowspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + cm[i].text + '</td>';
            }
        }
        var store = gridcontrol.getStore();
        var recordCount = store.getCount();
        for (var i = 0; i < recordCount; i++) {
            var r = store.getAt(i);
            for (var j = 0; j < temp_obj.length; j++) {
                var dateIndex = temp_obj[j].dataIndex;
                var tdvalue = r.get(dateIndex);
                if (tdvalue == null) {
                    tdvalue = '';
                }
                if(j==2)tdvalue=(Math.round(tdvalue*100)/100==0?'':Math.round(tdvalue*100)/100);
                if(j==0){
                    str+='cellValue,'+(i+4)+','+j+',' + (i+1) + ';cellAlign,'+(i+4)+','+j+',center;';
                }else if(j==1){
                    str+='cellValue,'+(i+4)+','+j+',' + tdvalue + ';cellAlign,'+(i+4)+','+j+',left;';
                }else{
                    str+='cellValue,'+(i+4)+','+j+',' +tdvalue + ';cellAlign,'+(i+4)+','+j+',right;';
                }
            }
        }

        str='createGrid,'+(recordCount+4)+','+colAllCount+';'+str;
        var url=hummerurl + '/application/controller/run/ExportExcel.action';
        var htmlStr = '<form action="' + url + '" method="post" target="_self" id="nurse_postData_form' + (me.owner && me.owner == 'D' ? 'D' : '') + '">' +
            '<input id="content" name="content" type="hidden" value="'+str+'"/>'+
            '<input id="name" name="name" type="hidden" value="'+ (me.owner && me.owner == 'D' ? '医生' : '护士') +'工作量统计"/>'+
            '</form>';
        var iframe1 = document.getElementById('nurse_excel_iframe' + (me.owner && me.owner == 'D' ? 'D' : ''));
        iframe1.contentWindow.document.open();
        iframe1.contentWindow.document.write(htmlStr);
        iframe1.contentWindow.document.close();
        //iframe1.contentWindow.document.wirte(htmlStr);
        iframe1.contentWindow.document.getElementById('nurse_postData_form' + (me.owner && me.owner == 'D' ? 'D' : '')).submit();
    }
});
