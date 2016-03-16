/**
 * 监护中心SerialGraphLive
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.CareCenterSerialGraphLive = function(config) {

    Ext.apply(this, config);
    var proxy = this;

    proxy.legendDefineArray = null;//图例定义，保存用于刷新时间使用

    //初始化数据
    proxy.init = function(bedId, beginDateTime, endDateTime, X_AXIS_FIELDS_LENGTH, careInterval, xAxisInterval, initResult) {
        proxy.bedId = bedId;
        //清除原有生命体征静态数据
        var tableObj = document.getElementById("vitalSignLegendCellTable");
        proxy.deleteAllChild(tableObj);
        //检查是否选择床号
        if (proxy.bedId==null) {
            document.getElementById("vitalSignTable").style.visibility = "hidden";
            return;
        }
        //加载图形
        proxy.vitalSignGraphLive = new com.dfsoft.icu.SerialGraphLive({
            isAllowEdit: true,
            canvasDivId: "vitalSignCanvasDiv",
            canvasTdId: "vitalSignTd",
            legendTableId: "vitalSignLegendTable",
            v1Fields: [
                [20, 40, 60, 80, 100, 120, 140, 160, 180, 200].reverse(),
                [0, 10, 20].reverse(),//不均分会出现问题，暂时无法处理
            ],
            v2Fields: [
                [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].reverse(),
                [0, 36].reverse()
            ],
            v3Fields: [
                [82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102].reverse(),
                [0, 82].reverse()
            ],
            beginDateTime: new Date(beginDateTime.replace(/-/,"/")),
            endDateTime: new Date(endDateTime.replace(/-/,"/")),
            X_AXIS_FIELDS_LENGTH: X_AXIS_FIELDS_LENGTH, //X轴间隔数
            xAxisTimeInterval: careInterval, //间隔分钟数
            xAxisInterval: xAxisInterval //轴线间隔
        });

        //计算执行时间
        var startTime,endTime;
        var d=new Date();
        startTime=d.getTime();

        //图形批量开始
        proxy.vitalSignGraphLive.graphlive.batchRenderStart();

        //重绘时间轴
        proxy.vitalSignGraphLive.time(proxy.vitalSignGraphLive.graphlive, proxy.vitalSignGraphLive.canvasDiv);
        //滚动时间轴
        proxy.vitalSignGraphLive.scrollTimeLabels();
        //检索生命体征Legend数据
        proxy.legendDefineArray = initResult.vitalSignLegendData.data;
        //设置生命体征图例
        proxy.setVitalSignLegend(proxy.legendDefineArray);
        //根据图例加载序列
        proxy.addVitalSignSerials(proxy.legendDefineArray);
        //添加序列数据
        proxy.doAddVitalSignData(initResult.vitalSignLegendCareCenterData);
        //添加血气序列数据
        proxy.doAddBloodVitalSignData(initResult.bloodCareCenterData);
        //添加降温数据
        proxy.doAddCoolingVitalSignData(initResult.coolingCareCenterData);

        //屏蔽冲突项
        proxy.vitalSignGraphLive.hideConflict();
        //图形批量结束
        proxy.vitalSignGraphLive.graphlive.batchRenderEnd();

        //计算执行时间
        d=new Date();
        endTime=d.getTime();
        console.log("CareCenterSerialGraphLive重绘画布执行时间：" + ((endTime-startTime)/1000));

    }

    //设置生命体征图例
    proxy.setVitalSignLegend = function(vitalSignLegendData) {
        //清除原有生命体征静态数据
        var tableObj = document.getElementById("vitalSignLegendCellTable");
        //最大图例数按10处理，防止表格撑开
        for (var i=0; i<vitalSignLegendData.length && i<=10; i++) {
            var tr  = tableObj.insertRow(i);
            //第一列，不再显示星图标，王小伟2014-06-19
            var td  = tr.insertCell();
            if (vitalSignLegendData[i].isStar==1) {
                td.innerHTML = '';//'<img src="images/star.png">';
            }
            //td.className = "vitalSignLegendCell vitalSignLegendCellColumn1 vitalSignLegendCellMiddleRow";
            //第二列
            td  = tr.insertCell(1);

            var alias = sb_substr(vitalSignLegendData[i].alias, 0, 15);//只取15个字符，防止换行
            td.innerHTML = alias;
            td.title = vitalSignLegendData[i].alias;
            td.noWrap = true;//不允许换行
            td.className = "vitalSignLegendCell vitalSignLegendCellColumn1 vitalSignLegendCellMiddleRow";
            //第三列
            td  = tr.insertCell(2);
            td.innerHTML = ""; //'<img src="../sys/settings/images/legend/' + vitalSignLegendData[i].legend + '.png" style="width: 8px; height: 8px;" onerror="javascript:this.src=\'\'">';
            td.className = "vitalSignLegendCell  vitalSignLegendCellMiddleRow";
            //手工绘制图例
            var canvasDiv = document.createElement("div");
            canvasDiv.style.width = 16;
            canvasDiv.style.height = 16;
            td.appendChild(canvasDiv);
//            td.title = vitalSignLegendData[i].legend;

            var canvas = document.createElement("canvas");
            canvasDiv.appendChild(canvas);

            var legendIcon = {x:8,y:8,width:14,height:14,stroke:vitalSignLegendData[i].color,
                type:vitalSignLegendData[i].legend, strokeWidth: 1};
            customDraw(canvas, legendIcon);
            //第四列
            td  = tr.insertCell(3);
            td.innerHTML = vitalSignLegendData[i].unit;
            td.className = "vitalSignLegendCell vitalSignLegendCellColumn1 vitalSignLegendCellMiddleRow alignLeft";
        }
        //设置图例父对象宽度
        tableObj.parentNode.style.width = tableObj.clientWidth;
    }

    //添加序列定义
    proxy.addVitalSignSerials = function(vitalSignLegendData) {
        for (var i=0; i<vitalSignLegendData.length; i++) {
            var bindYAxisName = "V1";
            if (vitalSignLegendData[i].unit=="°C") {
                bindYAxisName = "V2";
            } else if (vitalSignLegendData[i].alias=="SpO2") {
                bindYAxisName = "V3";
            }
            var serialData = {
                xField: [], //绑定的水平轴业务值
                yField: [], //绑定垂直轴业务值/坐标值
                bindYAxisName: bindYAxisName, //图例垂直绑定轴名称，即xField中的值集合是其上的散列点值集
                id: vitalSignLegendData[i].id, //序列的唯一标识
                name: vitalSignLegendData[i].legend, //序列的名称
                color: vitalSignLegendData[i].color, //序列颜色
                legendTypeAliasName: vitalSignLegendData[i].alias, //序列名称
                legendTypeUnit: vitalSignLegendData[i].unit//序列单位
            };
            proxy.vitalSignGraphLive.addSerials(serialData);
        }
    }

    //根据结果添加序列数据
    proxy.doAddVitalSignData = function(vitalSignDataArray) {
        for (var i=0; i<vitalSignDataArray.length; i++) {
            var serialId = "serial_" + vitalSignDataArray[i].bedItemId;
            for (var j=0; j<vitalSignDataArray[i].data.length; j++) {
                var legendData = {
                    id: vitalSignDataArray[i].data[j].careId,
                    xField: new Date(vitalSignDataArray[i].data[j].careTime),
                    yField: vitalSignDataArray[i].data[j].careValue,
                    orgValue: vitalSignDataArray[i].data[j].orgValue,
                    isBreath: vitalSignDataArray[i].data[j].isBreath
                };
                proxy.vitalSignGraphLive.addLegend(serialId, legendData);
            }
        }
    }

    //判断值是否在正常范围内，如果大于正常范围，返回↑；如果小于正常范围，返回↓；其他返回空字符串
    proxy.judgeNormalRange = function(careValue, normalRange) {
        if (careValue==null || careValue==="" || normalRange==null || normalRange==="") {
            return "";
        }
        var pos = normalRange.indexOf("~");
        if (pos===-1) {
            return "";
        }
        var minValue = parseFloat(normalRange.substring(0, pos));
        var maxValue = parseFloat(normalRange.substring(pos+1));
        var value = parseFloat(careValue);
        if (value<minValue) {
            return "↓";
        } else if (value>maxValue) {
            return "↑";
        } else {
            return "";
        }
    }

    //添加血气描点
    proxy.doAddBloodVitalSignData = function(bloodArray) {
        var prevCareTime = null;
        var mark = "";
        for (var i=0; i<bloodArray.length; i++) {
            //上一记录值和本次不一值，按新纪录处理
            if (prevCareTime!=bloodArray[i].care_time && i!=0) {
                proxy.vitalSignGraphLive.addIsolateLegend({
                    xField: new Date(prevCareTime),
                    yField: 10,
                    id: Math.uuid(),
                    mark: '',
                    isBreath: false,
                    isLock: true,
                    customICUValue: "化验检查(" + new Date(prevCareTime).Format("hh:mm") + ")<Br>" +
                        "----------------------" +
                        mark
                });
                mark = "";
            }
            prevCareTime = bloodArray[i].care_time;
            mark += "<br>" + bloodArray[i].alias + ": " + bloodArray[i].care_value;
            //范围判断
            var normalRange = proxy.judgeNormalRange(bloodArray[i].care_value, bloodArray[i].normal_range);
            mark += " " +normalRange;
        }
        if (bloodArray.length!=0) {
            proxy.vitalSignGraphLive.addIsolateLegend({
                xField: new Date(prevCareTime),
                yField: 10,
                id: Math.uuid(),
                mark: '',
                isBreath: false,
                isLock: true,
                customICUValue: "化验检查(" + new Date(prevCareTime).Format("hh:mm") + ")<Br>" +
                    "----------------------" +
                    mark
            });
        }
    }

    //添加降温描点
    proxy.doAddCoolingVitalSignData = function(coolingArray) {
        proxy.vitalSignGraphLive.coolingConnectingLineArray = [];
        for (var i=0; i<coolingArray.length; i++) {
            proxy.vitalSignGraphLive.addIsolateLegend({
                xField: new Date(coolingArray[i].care_time),
                bindYAxisName: 'V2',
                legendType: "LT008",
                yField: coolingArray[i].toCareValue,
                id: Math.uuid(),
                mark: '',
                isBreath: false,
                isLock: true,
                customICUValue: "时间: " + new Date(coolingArray[i].care_time).Format("hh:mm") +
                    "<br>降温后：" + coolingArray[i].toCareValue + "℃"
            });

            var coolingConnectLine = proxy.vitalSignGraphLive.graphlive.addConnectingLine({
                bindYAxisName: 'V2',
                bindXAxisName: 'H0',
                fromXField: (new Date(coolingArray[i].care_time)).getTime(),
                fromYField: coolingArray[i].fromCareValue,
                toXField: (new Date(coolingArray[i].care_time)).getTime(),
                toYField: coolingArray[i].toCareValue,
                stroke:'blue'});
            proxy.vitalSignGraphLive.coolingConnectingLineArray.push(coolingConnectLine);
        }
    }

    com.dfsoft.icu.CareCenterSerialGraphLive.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.CareCenterSerialGraphLive, com.dfsoft.icu.PublicFunction, {

});
