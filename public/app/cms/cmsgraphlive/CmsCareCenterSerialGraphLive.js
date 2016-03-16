/**
 * 中央监护站床位监护中心SerialGraphLive
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.CmsCareCenterSerialGraphLive = function(config) {

    Ext.apply(this, config);
    var proxy = this;

    proxy.legendDefineArray = null;//图例定义，保存用于刷新时间使用

    //初始化数据
    proxy.init = function(bedId) {
        proxy.bedId = bedId;
        //清除原有生命体征静态数据
        var tableObj = document.getElementById("vitalSignLegendCellTable");
        proxy.deleteAllChild(tableObj);
        //检索生命体征Legend数据和间隔时间
        proxy.legendDefineArray = proxy.findVitalSignLegend();
        //加载图形
        proxy.vitalSignGraphLive = new com.dfsoft.icu.FixedXAxisStepSerialGraphLive({
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
            firstTdWidth: 3,
            timelineOffsetLeft: 45,
            isOffset: false,
            Fixed_X_AXIS_STEP_Time: proxy.interval
        });
        //检查是否选择床号
        if (proxy.bedId==null) {
            return;
        }
        //设置生命体征图例
        proxy.setVitalSignLegend(proxy.legendDefineArray);
        //根据图例加载序列
        //proxy.addVitalSignSerials(proxy.legendDefineArray);

        //添加序列数据 resize时添加
//        proxy.addVitalSignData(proxy.legendDefineArray, proxy.vitalSignGraphLive.beginDateTime, proxy.vitalSignGraphLive.endDateTime);
    }

    //检索生命体征Legend数据
    proxy.findVitalSignLegend = function() {
        var vitalSignLegendData = [];
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/vitalsignlegend/' + proxy.bedId,
            method: 'get',
            async: false,
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    vitalSignLegendData = result.data;
                    proxy.interval = result.interval;
                }
            }
        });
        return vitalSignLegendData;
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
        proxy.vitalSignGraphLive.graphlive.batchRenderStart();
        for (var i=0; i<vitalSignDataArray.length; i++) {
            var serialId = "serial_" + vitalSignDataArray[i].bedItemId
            for (var j=0; j<vitalSignDataArray[i].data.length; j++) {
                var legendData = {
                    xField: new Date(vitalSignDataArray[i].data[j].careTime),
                    yField: vitalSignDataArray[i].data[j].careValue,
                    isBreath: vitalSignDataArray[i].data[j].isBreath
                };
                proxy.vitalSignGraphLive.addLegend(serialId, legendData);
            }
        }
        //屏蔽冲突项
        proxy.vitalSignGraphLive.hideConflict();
        proxy.vitalSignGraphLive.graphlive.batchRenderEnd();
    }


    //添加序列数据
    proxy.addVitalSignData = function(vitalSignLegendData, beginDateTime, endDateTime) {
        var bedItemIdArray = [];//需要查询的序列ID
        for (var k=0; k<vitalSignLegendData.length; k++) {
            bedItemIdArray.push(vitalSignLegendData[k].id);
        }
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/carecenterdata',
            method: 'post',
            params : {
                bedItemIdArray: bedItemIdArray,
                bedId: proxy.bedId,
                beginDateTime: beginDateTime,
                endDateTime: endDateTime
            },
            success : function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    proxy.doAddVitalSignData(result.data);
                }
            }
        });
    }

    com.dfsoft.icu.CmsCareCenterSerialGraphLive.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.CmsCareCenterSerialGraphLive, com.dfsoft.icu.PublicFunction, {

});
