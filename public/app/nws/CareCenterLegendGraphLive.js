/**
 * 监护中心LegendGraphLive
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.CareCenterLegendGraphLive = function(config) {

    Ext.apply(this, config);
    var proxy = this;

    this.graphLiveArray = [];//绘图对象数组
    this.ganttRowArray = [];//甘特图行号和图例对应关系数组
    proxy.legendDefineArray = null;//图例定义，保存用于刷新时间使用

    //初始化
    proxy.init = function(bedId, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH, careInterval, xAxisInterval, initResult) {
        proxy.bedId = bedId;
        //清除Legend静态数据
        proxy.clearOtherLegend();
        //检查是否选择床号
        if (proxy.bedId==null) {
            return;
        }
        //检索其他Legend数据
        proxy.legendDefineArray = initResult.otherLegendData;

        //计算执行时间
        var startTime,endTime;
        var d=new Date();
        startTime=d.getTime();

        //设置Legend和图形
        for (var i=0; i<proxy.legendDefineArray.length; i++) {
            //设置Legend
            var totalRow = proxy.setOtherLegend(proxy.legendDefineArray[i]);
            //加载图形
            proxy.setOtherGraphLive(proxy.legendDefineArray[i].id, totalRow, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH, careInterval, xAxisInterval);
            //设置图形、行号、图例的关系对象，只取子节点组成一维数组
            var legendRowRelation = proxy.setLegendRowRelation(proxy.legendDefineArray[i]);
            proxy.ganttRowArray.push(legendRowRelation);
            //获取数据
            proxy.doAddVitalSignData(legendRowRelation, proxy.legendDefineArray[i].otherLegendCareCenterData);
        }

        //计算执行时间
        d=new Date();
        endTime=d.getTime();
        console.log("CareCenterLegendGraphLive重绘画布执行时间：" + ((endTime-startTime)/1000));
    }

    //设置图形、行号、图例的关系对象，只取子节点组成一维数组
    proxy.setLegendRowRelation = function(otherLegendData) {
        var result = {};
        result.graphLiveId = "gantt_" + otherLegendData.id;
        result.name = otherLegendData.name;
        result.alias = otherLegendData.alias;
        result.data = [];
        var rowNo = 1;
        proxy.recursionSetChildLegendRowRelation(otherLegendData.lengendArray, rowNo,result.data)
        return result;
    }

    //递归设置图形、行号、图例的关系对象
    proxy.recursionSetChildLegendRowRelation = function(lengendArray, rowNo, dataArray) {
        for (var i=0; i<lengendArray.length; i++) {
            if (lengendArray[i].children==false) {
                var item = {};
                item.id = lengendArray[i].id;
                item.name = lengendArray[i].name;
                item.alias = lengendArray[i].alias;
                item.rowNo = lengendArray[i].rowNo;//rowNo放到创建表格时设置，防止补空行导致错位，王小伟 2014-08-25
                dataArray.push(item);
                rowNo = rowNo + 1;
            } else {
                rowNo = proxy.recursionSetChildLegendRowRelation(lengendArray[i].children, rowNo, dataArray)
            }
        }
        return rowNo;
    }

    //根据字数判断最小行数
    proxy.computeMinRowNum = function(name) {
        return name.length;
    }

    //清除其他项目的静态页面数据
    proxy.clearOtherLegend = function() {
        var table = document.getElementById("vitalSignTable");
        //删除除第一行外的数据
        for (var i=table.rows.length-1; i>0; i--) {
            var tr = table.rows[i];
            proxy.deleteAllChild(tr);
            tr.parentNode.removeChild(tr);
        }
    }

    //设置其他项目，神志、入量、出量、护理措施等
    proxy.setOtherLegend = function(otherLegendData) {
        //计算最小行数
        var MIN_ROW_NUM = proxy.computeMinRowNum(otherLegendData.alias);
        var tableObj = document.getElementById("vitalSignTable");
        //第一列
        var tr  = tableObj.insertRow(tableObj.rows.length);
        var td  = tr.insertCell();
        td.innerHTML = otherLegendData.alias;
        td.className = "vitalSignTd vitalSignColumn1 cellColor";
//        //是否是预制项
//        if (otherLegendData.preset_code==null) {
//            td.className += "noPresetCellColor";
//        } else {
//            td.className += "cellColor";
//        }
        //第二列
        var td  = tr.insertCell(1);
        td.innerHTML = "";
        td.className = "vitalSignTd vitalSignColumn2";
        //第二列图例表格
        var table = document.createElement("table");
        table.id = otherLegendData.id + "LegendTable";
        table.className = "vitalSignTable";
        td.appendChild(table);
        var totalRow = 0;
        for (var i=0; i<otherLegendData.lengendArray.length; i++) {
            var legendTr = table.insertRow(i);
            //名称
            var td  = legendTr.insertCell();
            td.innerHTML = otherLegendData.lengendArray[i].alias;
            if (otherLegendData.lengendArray[i].children != false) {
//                td.className = "vitalSignTd consciousnessLengendCell consciousnessLengendMergeCell";
//                var currParentIsLastRow = (i==otherLegendData.lengendArray.length-1);
//                totalRow = totalRow + this.setChildOtherLegend(legendTr, otherLegendData.lengendArray[i].children,
//                    otherLegendData.lengendArray[i].alias.length, currParentIsLastRow);
//                //如果是最后一行td
//                if (i==otherLegendData.lengendArray.length-1 && (otherLegendData.lengendArray.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM) ) {
//                    td.className = td.className + " consciousnessLengendBottomCell";
//                }
                //对于拆分单元格，防止一像素下边框问题，改为td内嵌table的处理方式
                td.innerHTML = "";
                var className = "vitalSignTd consciousnessLengendSplitCell consciousnessLengendMergeCell consciousnessLengendCell";
                //计算当前节点的下级节点总数
                var childRowCount = proxy.getChildRowCount(otherLegendData.lengendArray[i].children,
                    proxy.computeMinRowNum(otherLegendData.lengendArray[i].alias));
                var currParentIsLastRow = (i==otherLegendData.lengendArray.length-1 && (otherLegendData.lengendArray.length + childRowCount -1) >=MIN_ROW_NUM);
                //解析下级
                var childrenRowCount = proxy.setChildOtherLegend(legendTr, otherLegendData.lengendArray[i].children,
                    proxy.computeMinRowNum(otherLegendData.lengendArray[i].alias), currParentIsLastRow, i==0, totalRow);
                totalRow = totalRow + childrenRowCount;
                //如果是最后一行td
                if ( i==otherLegendData.lengendArray.length-1 && (otherLegendData.lengendArray.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM) ) {
                    className = className + " consciousnessLengendBottomCell";
                }
                proxy.insertTdTable(td, otherLegendData.lengendArray[i].alias, className, childrenRowCount, i==0);
                continue;//有子节点的不存在星星标志
            } else {
                td.className = "vitalSignTd consciousnessLengendCell";
                td.noWrap = true;//子节点不允许换行
                //上一个节点是拆分节点，像素减1
                if (i!=0 && otherLegendData.lengendArray[i-1].children != false) {
                    td.className = td.className + " ganttTdTableCell";
                } else {
                    td.className = td.className + " ganttCell";
                }
                totalRow = totalRow + 1;
                //如果是最后一行td
                if (i==otherLegendData.lengendArray.length-1 && (otherLegendData.lengendArray.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM) ) {
                    td.className = td.className + " consciousnessLengendBottomCell";
                }
                td.colSpan = 2;
                //设置图例行号，王小伟 2014-08-25
                otherLegendData.lengendArray[i].rowNo = totalRow;
            }
            //星星标志
            var td  = legendTr.insertCell(1);
            td.className = "vitalSignTd consciousnessLengendCell consciousnessLengendStarCell";
            //上一个节点是拆分节点，像素减1
            if (i!=0 && otherLegendData.lengendArray[i-1].children != false) {
                td.className = td.className + " ganttTdTableCell";
            } else {
                td.className = td.className + " ganttCell";
            }
            //如果是最后一行td
            if (i==otherLegendData.lengendArray.length-1 && (otherLegendData.lengendArray.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM) ) {
                td.className = td.className + " consciousnessLengendBottomCell";
            }
            if (otherLegendData.lengendArray[i].isStar == true) {
                td.innerHTML = '<img src="images/star.png">';
            } else {
                td.innerHTML = '&nbsp;';
            }
        }
        //第二列空行
        for (var i=0; i<MIN_ROW_NUM-totalRow; i++) {
            var legendTr = table.insertRow(table.rows.length);
            var td  = legendTr.insertCell();
            td.innerHTML = "&nbsp;";
            td.className = "vitalSignTd consciousnessLengendCell ganttCell";
            //如果是最后一行td
            if (i==MIN_ROW_NUM-totalRow-1) {
                td.className = td.className + " consciousnessLengendBottomCell";
            }
            td.colSpan = 3;
        }
        //第三列
        var td  = tr.insertCell(2);
        td.id = otherLegendData.id + "Td";
        td.innerHTML = "";
        td.className = "vitalSignTd canvasPadding";
        //第三列绘图区
        var div = document.createElement("div");
        div.id = otherLegendData.id + "CanvasDiv";
        div.style.width = "100%";
        div.style.height = "100%";
        td.appendChild(div);
        //创建绘图对象
        if (totalRow<MIN_ROW_NUM) {
            totalRow = MIN_ROW_NUM;
        }

        return totalRow;
    }

    //td内嵌单行table，对于拆分单元格，防止一像素下边框问题
    proxy.insertTdTable = function(td, innerHtml, className, childrenRowCount, firstRow) {
        td.className = "cellPadding consciousnessLengendMergeCell";
        var table = document.createElement("table");
        table.className = "vitalSignTable";
        td.appendChild(table);

        var tr = table.insertRow(0);
        var innerTd  = tr.insertCell();
        innerTd.innerHTML = innerHtml;
        innerTd.className = className;
        innerTd.height = childrenRowCount*22;
        if (firstRow==false) {
            innerTd.height = innerTd.height - 1;
        }
    }

    //计算下级节点总行数
    proxy.getChildRowCount = function(otherLegendData, MIN_ROW_NUM) {
        var totalRow = 0;
        for (var i=0; i<otherLegendData.length; i++) {
            //子节点
            if (otherLegendData[i].children != false) {
                var childrenRowCount = proxy.getChildRowCount(otherLegendData[i].children, proxy.computeMinRowNum(otherLegendData[i].alias));
                totalRow = totalRow + childrenRowCount;
            } else {
                totalRow = totalRow + 1;
            }
        }
        //第二列空行
        var blankRowNum = MIN_ROW_NUM - totalRow;
        for (var i=0; i<blankRowNum; i++) {
            totalRow = totalRow + 1;
        }
        return totalRow;
    }

    //设置其他项目的子节点，神志、入量、出量、护理措施等
    proxy.setChildOtherLegend = function(tr, otherLegendData, MIN_ROW_NUM, parentIsLastRow, firstRow, allTotalRow) {
        //添加td
        var td  = tr.insertCell(tr.cells.length);
        td.colSpan = 2;
        td.className = "cellPadding";
        //添加table
        var table = document.createElement("table");
        table.className = "vitalSignTable";
        td.appendChild(table);
        var totalRow = 0;
        for (var i=0; i<otherLegendData.length; i++) {
            var tr = table.insertRow(i);
            //名称
            var td  = tr.insertCell();
            td.innerHTML = otherLegendData[i].alias;
            //子节点
            if (otherLegendData[i].children != false) {
//                td.className = td.className + "vitalSignTd consciousnessLengendSplitCell consciousnessLengendMergeCell";
//                var currParentIsLastRow = (i==otherLegendData.length-1);
//                totalRow = totalRow + proxy.setChildOtherLegend(tr, otherLegendData[i].children,
//                    otherLegendData[i].alias.length, currParentIsLastRow);
//                //如果是最后一行td
//                if ( i==otherLegendData.length-1 && (otherLegendData.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM)
//                    && parentIsLastRow==true) {
//                    td.className = td.className + " consciousnessLengendBottomCell";
//                }
                //对于拆分单元格，防止一像素下边框问题，改为td内嵌table的处理方式
                td.innerHTML = "";
                var className = "vitalSignTd consciousnessLengendSplitCell consciousnessLengendMergeCell";
                var currParentIsLastRow = (i==otherLegendData.length-1 && parentIsLastRow==true);
                var childrenRowCount = proxy.setChildOtherLegend(tr, otherLegendData[i].children,
                    proxy.computeMinRowNum(otherLegendData[i].alias), currParentIsLastRow, firstRow==true && i==0, allTotalRow+totalRow);
                totalRow = totalRow + childrenRowCount;
                //如果是最后一行td
                if ( i==otherLegendData.length-1 && (otherLegendData.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM)
                    && parentIsLastRow==true) {
                    className = className + " consciousnessLengendBottomCell";
                }
                proxy.insertTdTable(td, otherLegendData[i].alias, className, childrenRowCount, firstRow==true && i==0);

                continue;//非子节点没有星星图标
            } else {
                td.className = "vitalSignTd consciousnessLengendSplitCell";
                td.noWrap = true;//子节点不允许换行
                //第一个子节点像素减1，或上一个节点是拆分节点，但对于全局第一个子节点除外
                if ((i==0 && firstRow==false) || (i!=0 && otherLegendData[i-1].children != false) ) {
                    td.className = td.className + " ganttTdTableCell";
                } else {
                    td.className = td.className + " ganttCell";
                }
                //如果是最后一行td
                if (i==otherLegendData.length-1 && (otherLegendData.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM)
                    && parentIsLastRow==true) {
                    td.className = td.className + " consciousnessLengendBottomCell";
                }
                totalRow = totalRow + 1;
                td.colSpan = 2;
                //设置图例编号，王小伟 2014-08-25
                otherLegendData[i].rowNo = totalRow + allTotalRow;
            }
            //星星标志
            var td  = tr.insertCell(1);
            td.className = "vitalSignTd consciousnessLengendCell consciousnessLengendStarCell";
            //第一个子节点像素减1，或上一个节点是拆分节点，但对于全局第一个子节点除外
            if ((i==0 && firstRow==false) || (i!=0 && otherLegendData[i-1].children != false) ) {
                td.className = td.className + " ganttTdTableCell";
            } else {
                td.className = td.className + " ganttCell";
            }
            //如果是最后一行td
            if (i==otherLegendData.length-1 && (otherLegendData.length>=MIN_ROW_NUM || totalRow>=MIN_ROW_NUM)
                && parentIsLastRow==true) {
                td.className = td.className + " consciousnessLengendBottomCell";
            }
            if (otherLegendData[i].isStar == true) {
                td.innerHTML = '<img src="images/star.png">';
            } else {
                td.innerHTML = '&nbsp;';
            }
        }
        //判断空行前最后一条记录是否有子节点
        var lastRowHasChildren = (otherLegendData.length>0 && otherLegendData[otherLegendData.length-1].children != false);
        //第二列空行
        var blankRowNum = MIN_ROW_NUM - totalRow;
        for (var i=0; i<blankRowNum; i++) {
            var legendTr = table.insertRow(table.rows.length);
            var td  = legendTr.insertCell();
            td.innerHTML = "&nbsp;";
            td.className = "vitalSignTd consciousnessLengendSplitCell";
            //空行上一节点存在子节点，则第一个空行高度减1
            if (i==0 && lastRowHasChildren==true) {
                td.className = td.className + " ganttTdTableCell";
            } else {
                td.className = td.className + " ganttCell";
            }
            //如果是最后一行td
            if (i==blankRowNum-1 && parentIsLastRow==true) {
                td.className = td.className + " consciousnessLengendBottomCell";
            }
            td.colSpan = 3;
            totalRow = totalRow + 1;
        }
        return totalRow;
    }

    //设置绘图对象
    proxy.setOtherGraphLive = function(id, rowNum, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH, careInterval, xAxisInterval) {
        proxy["gantt_" + id] = new com.dfsoft.icu.LegendGraphLive({
            drawXAxis: true,
            canvasDivId: id + "CanvasDiv",
            canvasTdId: id + "Td",
            legendTableId: id + "LegendTable",
            Y_AXIS_FIELDS_LENGTH: rowNum,
            beginDateTime: new Date(beginDateTime.replace(/-/,"/")),
            endDateTime: new Date(endDateTime.replace(/-/,"/")),
            X_AXIS_FIELDS_LENGTH: X_AXIS_FIELDS_LENGTH, //X轴间隔数
            xAxisTimeInterval: careInterval, //间隔分钟数
            xAxisInterval: xAxisInterval //轴线间隔
        });
        this.graphLiveArray.push(proxy["gantt_" + id]);
    }

    //添加点数据根据对象
    proxy.doAddVitalSignData = function(legendRowRelation, vitalSignDataArray) {
        proxy[legendRowRelation.graphLiveId].graphlive.batchRenderStart();
        for (var i=0; i<vitalSignDataArray.length; i++) {
            //计算行号
            var rowNo = -1;
            for (var k=0; k<legendRowRelation.data.length; k++) {
                if (legendRowRelation.data[k].id==vitalSignDataArray[i].bedItemId) {
                    rowNo = legendRowRelation.data[k].rowNo;
                    break;
                }
            }
            //未找到行号，继续下一条记录
            if (rowNo==-1) {
                continue;
            }
            for (var j=0; j<vitalSignDataArray[i].data.length; j++) {
                var legendData = {
                    xField: new Date(vitalSignDataArray[i].data[j].careTime),
                    rowNum: rowNo,
                    id: vitalSignDataArray[i].data[j].careId,
                    mark: vitalSignDataArray[i].data[j].careValue,
                    isBreath: vitalSignDataArray[i].data[j].isBreath
                };
                proxy[legendRowRelation.graphLiveId].addLegend(legendData);
            }
        }
        proxy[legendRowRelation.graphLiveId].graphlive.batchRenderEnd();
    }

    com.dfsoft.icu.CareCenterLegendGraphLive.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.CareCenterLegendGraphLive, com.dfsoft.icu.PublicFunction, {

});
