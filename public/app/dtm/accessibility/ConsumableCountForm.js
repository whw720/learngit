/**
 * 耗材统计查询form
 * @author:whw
 * @date:2014-3-29.
 */

Ext.define('com.dfsoft.icu.dtm.accessibility.ConsumableCountForm', {
    extend: 'Ext.form.Panel',
    name: 'accessibility-consumable-count-form',
    id:'accessibility-consumable-count-form',
    initComponent: function () {
        var me = this;
        Ext.QuickTips.init();
        Ext.apply(me,{
            border:true,
            closable: true,
            layout:'fit',
            dockedItems:[{
                xtype: 'toolbar',

                dock: 'top',
                height:35,
                style:{
                    'border-bottom':'1px solid #C0C0C0 !important'
                },
                padding:'0 0 0 3',
                html:'<iframe src="about:blank"  style="display:none;" width="200" height="100" id="excel_iframe"></iframe>',
                items : ['->',
                    {
                        xtype : 'datefield',
                        name : 'accessibility-start-time',
                        fieldLabel : '起始日期',
                        format: 'Y-m-d',
                        value: new Date( (new Date()).setDate( (new Date()).getDate() + 1 - (new Date()).getDay() ) ),
                        width:190,
                        editable:false,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:58,
                        labelAlign:'right',
                        listeners:{
                            select:function(){
                                me.queryCountConsumable();
                            }
                        }
                    },{
                        xtype : 'datefield',
                        name : 'accessibility-end-time',
                        fieldLabel : '终止日期',
                        format: 'Y-m-d',
                        value:new Date(),
                        width:190,
                        editable:false,
                        msgTarget:'none',
                        preventMark:true,
                        labelWidth:58,
                        labelAlign:'right',
                        listeners:{
                            select:function(){
                                me.queryCountConsumable();
                            }
                        }
                    },{
                        xtype:'button',
                        iconCls: 'dtm-accessibility-refresh',
                        scale: 'small',
                        tooltip: '查询',
                        handler:function(btn){
                            me.queryCountConsumable();
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
            }],
            items:[{
                xtype:'panel'
            }
            ],
            listeners:{
                afterrender:function(){
                    me.queryCountConsumable();
                }
            }
        });
        me.callParent();
    },
    //查询统计的耗材
    queryCountConsumable:function(){
        var me=this;
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        if(endDate.getTime()-beginDate.getTime()<0){
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
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        if(days>31){
            Ext.MessageBox.show({
                title:'提示',
                msg:'查询时间间隔不能超过31天!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        //定义要生成的columns;
        var startDateField=beginDate.Format("dd");
        var dateStr=beginDate.Format("yyyy-MM-dd");
        var startDateParams=beginDate.Format("yyyy-MM-dd")+" 00:00:00";
        var endDateParams=endDate.Format("yyyy-MM-dd")+" 23:59:59";
        var startDateStr=beginDate.Format("yyyy年MM月dd日");
        var endDateStr=endDate.Format("yyyy年MM月dd日");
        var column=[
            {
                text: '序号',
                xtype: 'rownumberer',
                width: 40,
                align: 'center'
            },{
                text: '耗材',
                style:{
                    'text-align':'center'
                },
                dataIndex:'NAME',
                align: 'left'
            }
        ];
        var fields=['NAME'];
        column.push({
            text: dateStr,
            cls:'dtm-consumable-column-css',
            columns: [
                {
                    text: '日班',
                    width: 55,
                    dataIndex: 'dz_be0df177abf011e396e800271396a820_' + startDateField,
                    align: 'right'
                },
                {
                    text: '夜班',
                    width: 55,
                    dataIndex: 'dz_c7605a40abf011e396e800271396a820_' + startDateField,
                    align: 'right'
                }
            ]
        });
        fields.push('dz_be0df177abf011e396e800271396a820_' + startDateField);
        fields.push('dz_c7605a40abf011e396e800271396a820_' + startDateField);
        if(days>1){
            for(var i=1;i<days;i++){
                beginDate.setDate(beginDate.getDate()+1);
                var dateField=beginDate.Format("dd");
                dateStr=beginDate.Format("yyyy-MM-dd");
                column.push({
                    text:dateStr,
                    cls:'dtm-consumable-column-css',
                    columns:[{
                        text: '日班',
                        dataIndex:'dz_be0df177abf011e396e800271396a820_'+dateField,
                        width:55,
                        align:'right'
                    },{
                        text: '夜班',
                        dataIndex:'dz_c7605a40abf011e396e800271396a820_'+dateField,
                        width:55,
                        align:'right'
                    }
                    ]
                });
                fields.push('dz_be0df177abf011e396e800271396a820_'+dateField);
                fields.push('dz_c7605a40abf011e396e800271396a820_'+dateField);
            }
        }
        Ext.Ajax.request({
            url: webRoot + '/dtm/accessibility/query_count_consumable',
            method: 'POST',
            params:{beginDate : startDateParams,endDate:endDateParams},
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    //if(result.data.length>0){
                        var store=new Ext.data.Store({
                            fields: fields,
                            data: result.data
                        });
                        var gridpanel=Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableCountGrid', {
                            parent:me,
                            columns:column,
                            store:store,
                            startDate:startDateStr,
                            endDate:endDateStr
                        });
                        me.remove(me.down('panel'));
                        me.add(gridpanel);
                    //}
                }
            }
        });

    },
    //导出excel
    excelCountConsumable:function(){
        var me=this;
        var gridCol=Ext.getCmp('accessibility-consumable-count-grid');
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        var startDateStr=beginDate.Format("yyyy年MM月dd日");
        var endDateStr=endDate.Format("yyyy年MM月dd日");
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        var dateStr=beginDate.Format("yyyy-MM-dd");
        var startDateStr=beginDate.Format("yyyy年MM月dd日");
        var endDateStr=endDate.Format("yyyy年MM月dd日");
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        if(endDate.getTime()-beginDate.getTime()<0){
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
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        if(days>31){
            Ext.MessageBox.show({
                title:'提示',
                msg:'查询时间间隔不能超过31天!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        var cm = gridCol.getView().getGridColumns();//gridcontrol.getColumnModel();
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
        str+='mergeCell,0,0,0,'+(colAllCount-1)+';cellValue,0,0,耗材使用情况;cellAlign,0,0,center;cellFont,0,0,20,1;';
        str+='mergeCell,1,1,0,'+(colAllCount-1)+';cellValue,1,0,从 '+startDateStr+' 到 '+endDateStr+';cellAlign,1,0,left;';
        for (var i = 0; i < 3; i++) {
            if(i>=2){
                str+='mergeCell,2,2,2,3;cellValue,2,2,'+dateStr+';cellFont,2,2,,1;cellAlign,2,2,center;';
            }else{
                str+='mergeCell,2,3,'+i+','+i+';cellValue,2,'+i+','+cm[i].text+';cellFont,2,'+i+',,1;cellAlign,2,'+i+',center;';
            }
        }
        if(days>1){
            for(var i=1;i<days;i++){
                beginDate.setDate(beginDate.getDate()+1);
                var dateField=beginDate.Format("dd");
                dateStr=beginDate.Format("yyyy-MM-dd");
                str+='mergeCell,2,2,'+(i*2+2)+','+(i*2+3)+';cellValue,2,'+(i*2+2)+','+dateStr+';cellFont,2,'+(i*2+2)+',,1;cellAlign,2,'+(i*2+2)+',center;';
            }
        }
        for (var i = 0; i < colCount; i++) {
            if(i>=2&&i%2==0){
                str+='cellValue,3,'+i+',日班;cellFont,3,'+i+',,1;cellAlign,3,'+i+',center;'
                str+='cellValue,3,'+(i+1)+',夜班;cellFont,3,'+(i+1)+',,1;cellAlign,3,'+(i+1)+',center;'
            }
        }
        var store = gridCol.getStore();
        var recordCount = store.getCount();
        for (var i = 0; i < recordCount; i++) {
            var r = store.getAt(i);
            for (var j = 0; j < temp_obj.length; j++) {
                var dateIndex = temp_obj[j].dataIndex;
                var tdvalue = r.get(dateIndex);
                if (tdvalue == null) {
                    tdvalue = '';
                }
                if(j==0){
                    str+='cellValue,'+(i+4)+','+j+',' + (i+1) + ';cellAlign,'+(i+4)+','+j+',center;';
                }else if(j==1){
                    str+='cellValue,'+(i+4)+','+j+',' + tdvalue + ';cellAlign,'+(i+4)+','+j+',left;';
                }else{
                    str+='cellValue,'+(i+4)+','+j+',' + tdvalue + ';cellAlign,'+(i+4)+','+j+',right;';
                }
            }
        }
        str='createGrid,'+(recordCount+4)+','+colAllCount+';'+str;
        var url=hummerurl + '/application/controller/run/ExportExcel.action';
        var htmlStr = '<form action="'+url+'" method="post" target="_self" id="postData_form">'+
            '<input id="content" name="content" type="hidden" value="'+str+'"/>'+
            '<input id="name" name="name" type="hidden" value="耗材使用情况"/>'+
            '</form>';
        var iframe1=document.getElementById('excel_iframe');
        iframe1.contentWindow.document.open();
        iframe1.contentWindow.document.write(htmlStr);
        iframe1.contentWindow.document.close();
        iframe1.contentWindow.document.getElementById('postData_form').submit();

        /*Ext.Ajax.request({
            url: hummerurl + '/application/controller/run/ExportExcel.action',
            method: 'POST',
            params:{row : colAllCount,col:recordCount+4,name:'耗材使用情况',content:str},
            success: function(response) {

            }
        });*/
        /*var me=this;
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        if(endDate.getTime()-beginDate.getTime()<0){
            Ext.MessageBox.show({
                title:'提示',
                msg:'终止日期不能小于起始日期!',
                width:200,
                scope:me,
                modal:false,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        if(days>31){
            Ext.MessageBox.show({
                title:'提示',
                msg:'导出时间间隔不能超过31天!',
                width:200,
                scope:me,
                modal:false,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        //定义要生成的columns;
        var startDateStr=beginDate.Format("yyyy-MM-dd");
        var endDateStr=endDate.Format("yyyy-MM-dd");
        var url=webRoot + '/dtm/accessibility/excel_count_consumable?startDate:'+startDateStr+'&endDate='+endDateStr;
        document.getElementById('excel_iframe').src=url;*/
    },
    printGrid:function(){
        var me=this;
        var gridCol=Ext.getCmp('accessibility-consumable-count-grid');
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        var startDateStr=beginDate.Format("yyyy年MM月dd日");
        var endDateStr=endDate.Format("yyyy年MM月dd日");
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        var dateStr=beginDate.Format("yyyy-MM-dd");

        var cm = gridCol.getView().getGridColumns();//gridcontrol.getColumnModel();
        var colCount = cm.length;
        var temp_obj = new Array();
        var colAllCount=0;
        var beginDate=me.getForm().findField('accessibility-start-time').getValue();
        var endDate=me.getForm().findField('accessibility-end-time').getValue();
        if(endDate.getTime()-beginDate.getTime()<0){
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
        var days=(endDate.getTime()-beginDate.getTime())/86400000+1;
        if(days>31){
            Ext.MessageBox.show({
                title:'提示',
                msg:'查询时间间隔不能超过31天!',
                width:200,
                scope:me,
                modal: true,
                buttons:Ext.MessageBox.OK,
                icon:Ext.MessageBox.INFO
            });
            return;
        }
        for (var i = 0; i < colCount; i++) {
            if(cm[i].columns!=null&&cm[i].columns.length>0){
                colAllCount+=cm[i].columns.length;
                temp_obj=temp_obj.concat(cm[i].columns);
            }else{
                colAllCount++;
                temp_obj.push(cm[i]);
            }
        }
        var tableStr = '<table  style="border-top:1px black solid;border-left:1px black solid; width:100%;"cellpadding=0 cellspacing=0>';

        tableStr+='<tr><td colspan="'+colAllCount+'" style="border-right:1px black solid;font-size:24px;text-align: center;font-weight:bold;">耗材使用情况统计</td></tr>';
        tableStr+='<tr><td colspan="'+colAllCount+'" style="border-right:1px black solid;border-bottom:1px black solid;font-size:11px;text-align: left;">从 '+startDateStr+' 到 '+endDateStr+'</td></tr>';


        for (var i = 0; i < 3; i++) {
            if(i>=2){
                tableStr = tableStr + '<td colspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + dateStr + '</td>';
            }else{
                tableStr = tableStr + '<td rowspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:'+(i==0?40:100)+'px;">' + cm[i].text + '</td>';
            }
        }
        if(days>1){
            for(var i=1;i<days;i++){
                beginDate.setDate(beginDate.getDate()+1);
                var dateField=beginDate.Format("dd");
                dateStr=beginDate.Format("yyyy-MM-dd");
                tableStr = tableStr + '<td colspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + dateStr + '</td>';
            }
        }
        tableStr = tableStr + '</tr>';
        for (var i = 0; i < colCount; i++) {
            if(i>=2&&i%2==0){
                tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:50px;">日班</td>';
                tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:50px;">夜班</td>';
            }
        }
        tableStr = tableStr + '</tr>';
        var store = gridCol.getStore();
        var recordCount = store.getCount();
        for (var i = 0; i < recordCount; i++) {
            var r = store.getAt(i);
            for (var j = 0; j < temp_obj.length; j++) {
                var dateIndex = temp_obj[j].dataIndex;
                var tdvalue = r.get(dateIndex);
                if (tdvalue == null) {
                    tdvalue = '';
                }
                if(j==0){
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + (i+1) + '</td>';
                }else if(j==1){
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;">' + tdvalue + '</td>';
                }else{
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: right;">' + tdvalue + '</td>';
                }
            }
            tableStr = tableStr + '</tr>';
        }
        tableStr = tableStr + '</table>';
        var titleHtml = tableStr;
        printHtml(titleHtml);
    }
});