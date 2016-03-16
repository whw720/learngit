/**
 * 分组工作量统计
 * @author:whw
 * @date:2014-3-31.
 */

Ext.define('com.dfsoft.icu.dtm.accessibility.ScoreGroupCount', {
    extend: 'Ext.grid.Panel',
    initComponent: function () {
        this.id = 'accessibility-score-group-grid' + (this.owner && this.owner == 'D' ? 'D' : '');
        var me = this;
        me.owner = (me.owner && me.owner == 'D' ? 'D' : 'N');
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
        Ext.QuickTips.init();
        me.groupStore=Ext.create('Ext.data.Store',{
            fields:['CATEGORY','ITEM_ID','NAME','SCORES','WORK_COUNT','WORK_SCORE'],
            proxy: {
                type: 'ajax',
                url: webRoot + '/dtm/accessibility/query_group',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners:{
                beforeload:function(store, options){
                    var startDate=me.startDatefield.getSubmitValue();
                    var endDate=me.endDatefield.getSubmitValue();
                    document.getElementById('report_count_date' + (me.owner && me.owner == 'D' ? 'D' : '')).innerHTML = startDate+'至'+endDate;
                    Ext.apply(store.proxy.extraParams, {
                        'startDate':startDate,
                        'endDate':endDate,
                        'owner': me.owner
                    });
                },
                load:function(){
                    me.gridSum();
                    me.mergeCell([2]);
                    /*me.mergeCol([2]);
                    me.mergeDefineCol(3,'hello world');*/
                }
            },
            autoLoad: true
        });
        me.column=[
            {
                text: '序号',
                xtype: 'rownumberer',
                width: 40,
                align: 'center'
            },{ text: '分组',
                dataIndex: 'CATEGORY',
                style:{
                    'text-align':'center'
                },
                tdCls:'dtm-grid-td',
                width:80,
                align:'left'
            },{ text: '护理项目',
                dataIndex: 'NAME',
                style:{
                    'text-align':'center'
                },
                flex:1,
                align:'left'
            },
            {
                text: '分值',
                dataIndex: 'SCORES',
                style:{
                    'text-align':'center'
                },
                flex:1,
                align:'right'
            },
            {
                text: '工作量',
                dataIndex: 'WORK_COUNT',
                style:{
                    'text-align':'center'
                },
                flex:1,
                align:'right'
            },
            {
                text: '工作分',
                dataIndex: 'WORK_SCORE',
                style:{
                    'text-align':'center'
                },
                flex:1,
                align:'right'
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
                    html: '<iframe src="about:blank"  style="display:none;" width="200" height="100" id="score_excel_iframe' + (me.owner && me.owner == 'D' ? 'D' : '') + '"></iframe>',
                    items : ['->',
                        me.startDatefield,'<span style="margin-left: -6px;">至</span>',me.endDatefield,{
                            xtype:'button',
                            iconCls: 'dtm-accessibility-refresh',
                            scale: 'small',
                            tooltip: '查询',
                            handler:function(btn){
                                me.queryGroupCount();
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
                    html:'<div style="width:100%;font-size:24px;text-align: center;font-weight:bold;">分项工作量统计表</div>'+
                        '<div style="font-weight:normal;font-size:11px;text-align: left;padding-left: 5px;" id="report_count_date' + (me.owner && me.owner == 'D' ? 'D' : '') + '"></div>'
                }
            ],
            columnLines: true,
            border: false,
            sortableColumns:false,
            store: me.groupStore,
            columns:me.column
        });
        me.callParent();
    },
    //查询
    queryGroupCount:function(){
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
        this.groupStore.load();
    },
    //合并单元格，@params cols 指定需要合并的列 [2]
    mergeCell:function(cols){
        var grid=this;
        //==>ExtJs4.2的<tbody>改到上层<table>的lastChild . <tbody>是各个<tr>的集合
        var arrayTr = document.getElementById(grid.getId()+"-body").firstChild.firstChild.lastChild.getElementsByTagName('tr');
        var trCount = arrayTr.length;  //<tr>总行数
        var arrayTd;
        var td;
        //==>显示层将目标格的样式改为.display='none';
        var merge = function( rowspanObj , removeObjs ){//定义合并函数
            if( 0 != rowspanObj.rowspan ){
                arrayTd = arrayTr[ rowspanObj.tr ].getElementsByTagName("td"); //合并行
                td = arrayTd[rowspanObj.td-1];
                td.rowSpan = rowspanObj.rowspan;
                //td.vAlign = "middle";
                //隐身被合并的单元格
                Ext.each(removeObjs,function(obj){
                    arrayTd = arrayTr[obj.tr].getElementsByTagName("td");
                    arrayTd[obj.td-1].style.display='none';
                });
            }
        };
        //==>显示层将目标格的样式改为.display='none';

        var rowspanObj = {}; //要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
        var removeObjs = []; //要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
        var col;
        //==>逐列靠表内具体数值去合并各个<tr> (表内数值一样则合并)
        Ext.each( cols , function( colIndex ){
            var rowspan = 1;
            var divHtml = null;//单元格内的数值
            for( var i=0 ; i < trCount ; i++){//==>从第一行数据0开始
                //==>一个arrayTr[i]是一整行的所有数据, 一个arrayTd是 <td xxxx ><div>具体数值</div></td> ,
                arrayTd = arrayTr[i].getElementsByTagName("td");
                var cold=0;
                col = colIndex + cold;//跳过RowNumber列和check列
                if( !divHtml ){
                    divHtml = arrayTd[col-1].innerHTML;
                    rowspanObj = { tr:i,td:col,rowspan:rowspan }
                }else{
                    var cellText = arrayTd[col-1].innerHTML;
                    var addf = function(){
                        rowspanObj["rowspan"] = rowspanObj["rowspan"]+1;
                        removeObjs.push({ tr:i,td:col });
                        if( i == trCount-1)
                        {
                            merge(rowspanObj,removeObjs);//执行合并函数
                        }
                    };
                    var mergef = function(){
                        merge(rowspanObj,removeObjs);//执行合并函数
                        divHtml = cellText;
                        rowspanObj = {tr:i,td:col,rowspan:rowspan}
                        removeObjs = [];
                    };
                    if( cellText == divHtml ){
                        if( colIndex != cols[0] ){
                            var leftDisplay = arrayTd[col-2].style.display;//判断左边单元格值是否已display
                            if( leftDisplay == 'none' ){
                                addf();
                            }else{
                                mergef();
                            }
                        }else{
                            addf();
                        }
                    }else{
                        mergef();
                    }
                }
            }
        });
    },
    //合并行,@params rows 指定需要合并的行  [2]
    mergeCol:function(rows){
        var grid=this;
        var arrayTr = document.getElementById(grid.getId()+"-body").firstChild.firstChild.lastChild.getElementsByTagName('tr');
        var trCount = arrayTr.length;  //<tr>总行数
        var arrayTd;
        //==>显示层将目标格的样式改为.display='none';
        var merge = function( rowspanObj , removeObjs ){//定义合并函数
            if( 0 != rowspanObj.rowspan ){
                arrayTd = arrayTr[ rowspanObj.tr ].getElementsByTagName("td"); //合并行
                td = arrayTd[rowspanObj.td];
                td.colSpan = rowspanObj.rowspan;
                //td.vAlign = "middle";
                //隐身被合并的单元格
                Ext.each(removeObjs,function(obj){
                    arrayTd = arrayTr[obj.tr].getElementsByTagName("td");
                    arrayTd[obj.td].style.display='none';
                });
            }
        };
        var rowspanObj = {}; //要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
        var removeObjs = []; //要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
        Ext.each(rows, function (colIndex) {
            debugger;
            var rowspan = 1;
            var divHtml = null;//单元格内的数值
            for (var i = 0; i < trCount; i++) {//==>从第一行数据0开始
                if(i==colIndex){ //如果行数相等
                    arrayTd = arrayTr[i].getElementsByTagName("td"); //得到这一行的所有单元格
                    for(var j=0;j<arrayTd.length;j++){//遍历单元格
                        var td=arrayTd[j];  //取到当前单元格对象
                        if( !divHtml ){
                            divHtml = td.innerHTML; //取得单元格的值
                            rowspanObj = { tr:i,td:j,rowspan:rowspan }
                        }else{
                            var cellText = td.innerHTML;
                            var addf = function(){
                                rowspanObj["rowspan"] = rowspanObj["rowspan"]+1;
                                removeObjs.push({ tr:i,td:j });
                                if( j == arrayTd.length-1)
                                {
                                    merge(rowspanObj,removeObjs);//执行合并函数
                                }
                            };
                            var mergef = function(){
                                merge(rowspanObj,removeObjs);//执行合并函数
                                divHtml = cellText;
                                rowspanObj = {tr:i,td:j,rowspan:rowspan};
                                removeObjs = [];
                            };
                            if( cellText == divHtml ){
                                /*if( colIndex != j ){
                                    var leftDisplay = arrayTd[j-1].style.display;//判断左边单元格值是否已display
                                    if( leftDisplay == 'none' ){
                                        addf();
                                    }else{
                                        mergef();
                                    }
                                }else{*/
                                    addf();
                                //}
                            }else{
                                mergef();
                            }
                        }
                    }
                }
            }
        });
    },
    //合并定义的行，将一行合并成一个单元格。
    // @params col 指定行, 指定内容。
    mergeDefineCol:function(col,text){
        var grid=this;
        var arrayTr = document.getElementById(grid.getId()+"-body").firstChild.firstChild.lastChild.getElementsByTagName('tr');
        var trCount = arrayTr.length;  //<tr>总行数
        for (var i = 0; i < trCount; i++) {//==>从第一行数据0开始
            if(i==(col-1)){
                arrayTd = arrayTr[i].getElementsByTagName("td"); //合并行
                var td = arrayTd[0];
                td.colSpan = 2;
                var divT=td.getElementsByTagName("div")[0];
                divT.innerText = text;
                divT.style.textAlign="center";
                divT.style.fontWeight ='bold';

                //隐身被合并的单元格
                for(var j=1;j<2;j++){
                    arrayTd[j].style.display='none';
                }
            }
        }
    },
    //最后生成合计列
    gridSum: function () {
        var grid=this;
        var sum1 = 0; //存储第一个列的合计值
        var sum2 = 0; //存储第二个列的合计值
        //...有几个列需要合计就声明几个变量
        grid.store.each(function (record) {              //函数grid.store.each(record))相当于一个for循环，遍历整个record
            sum1 += Number(record.data.WORK_COUNT); //把money1列下面的所有值进行加和运算
            sum2 += Number(record.data.WORK_SCORE); //把money2列下面的所有值进行加和运算
        });
        if(sum2){
            sum2 = Math.round(sum2*100)/100;
        }
        var p =
            {
               // NAME:'<strong>合计</strong>',
                WORK_COUNT: '<strong>'+sum1+'</strong>',  //把money1列与合计后得到的值对应起来
                WORK_SCORE: '<strong>'+sum2+'</strong>'   //把money2列与合计后得到的值对应起来
            };
        //grid.store.insert(0, p);// 插入到当前页的第一行
        grid.store.insert(grid.getStore().getCount(), p);  //插入到当前页的最后一行，函数 grid.getStore().getCount()用来获得当前页的记录行数
        grid.mergeDefineCol(grid.getStore().getCount(),'合计');
    },
    //打印
    printGrid:function(){
            var me=this;
        var dataString=document.getElementById('report_count_date' + (me.owner && me.owner == 'D' ? 'D' : '')).innerText;
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
        var gridcontrol = Ext.getCmp('accessibility-score-group-grid' + (me.owner && me.owner == 'D' ? 'D' : ''));
        var date = me.startDatefield.getSubmitValue()+"至"+me.endDatefield.getSubmitValue();
            var cm = me.column;//gridcontrol.getColumnModel();
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
            var tableStr = '<table  style="border-top:1px black solid;border-left:1px black solid; width:100%;"cellpadding=0 cellspacing=0>';

            tableStr+='<tr><td colspan="'+colAllCount+'" style="border-right:1px black solid;border-bottom:1px black solid;font-size:24px;text-align: center;font-weight:bold;padding-top:5px;">' + (me.owner && me.owner == 'D' ? '医生' : '护士') +'分项工作量统计表<div style="font-weight:normal;font-size:11px;text-align: left;padding-left: 5px;">'+dataString+'</div></td></tr>';

            for (var i = 0; i < colCount; i++) {
                if(i==0){
                    tableStr = tableStr + '<tr><td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:40px;">' + cm[i].text + '</td>';
                }else if(i==1){
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:80px;">' + cm[i].text + '</td>';
                }else if(i>=3){
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;width:100px;">' + cm[i].text + '</td>';
                }else{
                    tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + cm[i].text + '</td>';
                }

            }
            tableStr = tableStr + '</tr>';
        var arrayTr = document.getElementById("accessibility-score-group-grid" + (me.owner && me.owner == 'D' ? 'D' : '') + "-body").firstChild.firstChild.lastChild.getElementsByTagName('tr');
            for(var i=0;i<arrayTr.length;i++){
                var arryTd=arrayTr[i].getElementsByTagName("td");
                for(var j=0;j<arryTd.length;j++){
                    var td=arryTd[j];
                    if(j==0){
                        if(i==arrayTr.length-1){
                            tableStr = tableStr + '<tr><td colspan="2" style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + td.innerText + '</td>';
                        }else{
                            tableStr = tableStr + '<tr><td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + td.innerText + '</td>';
                        }

                    }else if(j==1){
                        if(td.style.display!='none'){
                            tableStr = tableStr + '<td rowspan="'+td.rowSpan+'" style="border-right:1px black solid;border-bottom:1px black solid;">' + td.innerText + '</td>';
                        }
                    }else if(j==2){
                        tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;">' + td.innerText + '</td>';
                    }else{
                        tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: right;">' + td.innerText + '</td>';
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
        var dataString=document.getElementById('report_count_date' + (me.owner && me.owner == 'D' ? 'D' : '')).innerText;
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
        var gridcontrol = Ext.getCmp('accessibility-score-group-grid' + (me.owner && me.owner == 'D' ? 'D' : ''));

        var cm = me.column;//gridcontrol.getColumnModel();
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
        str+='mergeCell,0,0,0,'+(colAllCount-1)+';cellValue,0,0,'+(me.owner=='D'?'医生':'护士')+'分项工作量统计表;cellAlign,0,0,center;cellFont,0,0,20,1;';
        for (var i = 0; i < colCount; i++) {
            str+='cellValue,1,'+i+',' + cm[i].text + ';cellFont,1,'+i+',,1;cellAlign,1,'+i+',center;';
        }
        var arrayTr = document.getElementById("accessibility-score-group-grid" + (me.owner && me.owner == 'D' ? 'D' : '') + "-body").firstChild.firstChild.lastChild.getElementsByTagName('tr');
        for(var i=0;i<arrayTr.length;i++){
            var arryTd=arrayTr[i].getElementsByTagName("td");
            for(var j=0;j<arryTd.length;j++){
                var td=arryTd[j];
                if(j==0){
                    if(i==arrayTr.length-1){
                        str+='mergeCell,'+(i+2)+','+(i+2)+',0,1;cellValue,'+(i+2)+','+j+',' + td.innerText + ';cellAlign,'+(i+2)+','+j+',center;';
                    }else{
                        str+='cellValue,'+(i+2)+','+j+',' + td.innerText + ';cellAlign,'+(i+2)+','+j+',center;';
                    }

                    //tableStr = tableStr + '<tr><td style="border-right:1px black solid;border-bottom:1px black solid;text-align: center;">' + td.innerText + '</td>';
                }else if(j==1){
                    if(td.style.display!='none'){
                        str+='mergeCell,'+(i+2)+','+(i+1+Number(td.rowSpan))+','+j+','+j+';cellValue,'+(i+2)+','+j+',' + td.innerText + ';cellAlign,'+(i+2)+','+j+',left;';
                        //tableStr = tableStr + '<td rowspan="'+td.rowSpan+'" style="border-right:1px black solid;border-bottom:1px black solid;">' + td.innerText + '</td>';
                    }
                }else if(j==2){
                    str+='cellValue,'+(i+2)+','+j+',' + td.innerText + ';cellAlign,'+(i+2)+','+j+',left;';
                    //tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;">' + td.innerText + '</td>';
                }else{
                    str+='cellValue,'+(i+2)+','+j+',' + td.innerText + ';cellAlign,'+(i+2)+','+j+',right;';
                    //tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: right;">' + td.innerText + '</td>';
                }
            }

            //tableStr = tableStr + '</tr>';
        }
        str='createGrid,'+(arrayTr.length+2)+','+colAllCount+';'+str;
        var url=hummerurl + '/application/controller/run/ExportExcel.action';
        var htmlStr = '<form action="' + url + '" method="post" target="_self" id="score_postData_form' + (me.owner && me.owner == 'D' ? 'D' : '') + '">' +
            '<input id="content" name="content" type="hidden" value="'+str+'"/>'+
            '<input id="name" name="name" type="hidden" value="'+(me.owner && me.owner == 'D' ? '医生' : '护士')+'分项工作量统计表"/>'+
            '</form>';
        var iframe1 = document.getElementById('score_excel_iframe' + (me.owner && me.owner == 'D' ? 'D' : ''));
        iframe1.contentWindow.document.open();
        iframe1.contentWindow.document.write(htmlStr);
        iframe1.contentWindow.document.close();
        iframe1.contentWindow.document.getElementById('score_postData_form' + (me.owner && me.owner == 'D' ? 'D' : '')).submit();
    }
});
/*var store = gridcontrol.getStore();
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
 }else if(j==1||j==2){
 tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;">' + tdvalue + '</td>';
 }else{
 tableStr = tableStr + '<td style="border-right:1px black solid;border-bottom:1px black solid;text-align: right;">' + tdvalue + '</td>';
 }
 }
 tableStr = tableStr + '</tr>';
 }*/