/**
 * 折线绘图实例
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.SerialGraphLive = function(config) {
    //绘图div id，由参数传入
    this.canvasDivId = null;
    //绘图td id, 由参数传入
    this.canvasTdId = null;
    //Y轴线个数
    this.Y_AXIS_FIELDS_LENGTH = 11;
    //改变窗口大小前宽度
    this.prevBodyWidth = 0;
    //图例列table id，又参数传入
    this.legendTableId = null;
    //脉搏坐标值，由参数传入
    this.v1Fields = null;
    //体温坐标值，有参数传入
    this.v2Fields = null;
    //固定X轴网格线的间隔值，为了与上面的网格线对齐
    this.FIXED_X_AXIS_STEP = null;
    //Y轴间隔值,如果y轴间隔和grid不一致时使用，由参数传入
    this.yAxisStep = null;
    //是否绘制Y轴线
    this.drawYAxis = false;
    //是否使用网格偏移,画布左右各空出一个网格，用于完全显示点
    this.isOffset = true;
    //第一列宽度，22为第一列宽度，预留25防止剩余空间不足
    this.firstTdWidth = 25;
    //网格线类型，默认虚线
    this.gridLineType = "dash";
    //是否显示时间线
    this.hasTimeLine = true;
    //X坐标轴偏移量
    this.xAxislocationX = 0;
    //是否有垂直网格线
    this.hasVerticalGrid = true;
    //X轴线类型
    this.xAxisLineType = "solid";
    //自定义网格线
    this.customDraw = {};
    //高度缩小
    this.canvasHeightSubtract = 0;
    //是否绘制X轴线
    this.drawXAxis = true;
    //是否有水平网格线
    this.hasHorizontalGrid = true;
    //Y轴高度
    this.yAxisLength = null;
    //第三个坐标轴
    this.v3Fields = [0, 1, 2];
    //y轴纵坐标
    this.yAxisLocationY = 0;
    //是否允许编辑
    this.isAllowEdit = false;
    //网格颜色
    this.gridColor = "darkgreen";

    var heartRateId = "3b0d8d00228711e39658c92478bc3c10";//心率
    var pulseId = "2bb062a05b0911e3a6ff7d7c27488ccd"; //脉搏

    //设置折线图div的宽度和高度适合grid的宽高, 高度固定10行，宽度固定61行，可以被子类覆盖
    this.setDivTdWidthHeightByGrid = function(canvasTdClientWidth) {
        if (typeof(canvasTdClientWidth) == "undefined") {
            canvasTdClientWidth = proxy.canvasTd.clientWidth;
        }
        if (typeof(proxy.prevChangeWidth) == "undefined") {
            proxy.prevChangeWidth = 0;
        }
        canvasTdClientWidth = canvasTdClientWidth + proxy.prevChangeWidth;
        //设置X轴线间隔，如果使用网格偏移，则加2个网格
        var X_AXIS_FIELDS_LENGTH = proxy.X_AXIS_FIELDS_LENGTH;
        if (proxy.isOffset==true) {
            X_AXIS_FIELDS_LENGTH += 2;
        }
        proxy.X_AXIS_STEP = parseInt(canvasTdClientWidth / X_AXIS_FIELDS_LENGTH);
        //检查最小间隔
        if (proxy.MIN_X_AXIS_STEP!=null && proxy.X_AXIS_STEP<proxy.MIN_X_AXIS_STEP) {
            proxy.X_AXIS_STEP = proxy.MIN_X_AXIS_STEP;
        }
        //设置div的宽高取整
        var width = proxy.X_AXIS_STEP * X_AXIS_FIELDS_LENGTH;
        var height = proxy.SERIAL_GRID_Y * proxy.Y_AXIS_FIELDS_LENGTH - this.canvasHeightSubtract;
        proxy.canvasDiv.style.width = width;
        proxy.canvasDiv.style.height = height;
        //设置时间轴宽度
        if (proxy.timelineDIV!=null) {
            proxy.timelineDIV.style.width = width;
        }
        //设置td的宽高和div保持一致
        proxy.canvasTd.style.width = width;
        proxy.canvasTd.style.height = height + this.TIME_HEIGHT;
        //设置第二列td内的table宽度
        if (proxy.legendTable!=null) {
            proxy.legendTable.style.width = document.body.clientWidth - width - proxy.firstTdWidth;//22为第一列宽度，预留25防止剩余空间不足
        }
        //记录上次窗口宽度
        proxy.prevBodyWidth = document.body.clientWidth;
        //记录上次多分配给第二列td内的table宽度
        proxy.prevChangeWidth = canvasTdClientWidth - width;
        return {width: width, height: height};
    }

    Ext.apply(this, config);
    var proxy = this;

    //画布DIV    
    this.canvasDiv = document.getElementById(proxy.canvasDivId);
    //画布Td
    this.canvasTd = document.getElementById(proxy.canvasTdId);
    //图例列table
    this.legendTable  = document.getElementById(proxy.legendTableId);

    //添加折线序列
    this.addSerials = function(serialData) {
        if (typeof(serialData) == "undefined") {
            serialData = {
                xField: [new Date("2014/03/05 00:00:00"), new Date("2014/03/05 00:05:00"), new Date("2014/03/05 00:10:00")], //绑定的水平轴业务值
                yField: [67, 86, 102], //绑定垂直轴业务值/坐标值
                bindYAxisName: 'V1', //图例垂直绑定轴名称，即xField中的值集合是其上的散列点值集
                id: 'serial_V1_SBP', //序列的唯一标识
                name: 'SBP', //序列的名称
                color: 'black' //序列颜色
                ,legendTypeAliasName: '舒张压'
                ,legendTypeUnit: 'mmHg'//序列单位
            };
        }

        //对于体温序列不显示折线
        if (serialData.legendTypeUnit == "°C") {
            serialData.lineHide = true;
        }
        //绘图库修改后更新相关代码，王小伟 2014-08-21
        serialData.seriesType = 'ST001';//序列的类型细分代码
        serialData.legendType = serialData.name;//gantt类型的序列线上
        var addObj = {
//            xField: [new Date("2014/03/05 00:00:00"), new Date("2014/03/05 00:05:00"), new Date("2014/03/05 00:10:00")], //绑定的水平轴业务值
//            yField: [67, 86, 102], //绑定垂直轴业务值/坐标值
            bindXAxisName: 'H0', //图例水平绑定轴名称，即xField中的值集合是其上的散列点值集
//            bindYAxisName: 'V1', //图例垂直绑定轴名称，即xField中的值集合是其上的散列点值集
            type: 'line', //序列类型，支持两种渲染方式，一种是甘特图(gantt)类型，另一种是折线图(line)类型
//            id: 'serial_V1_SBP', //序列的唯一标识
//            name: 'SBP', //序列的名称
            createMMTime: new Date().getTime(), //此序列创建的毫秒时间
            maxSeriesValue: false, //最大序列值
            minSeriesValue: false, //最小序列值
            label: false, //序列的标题
//            color: 'black', //序列颜色
            opacity: 0.93, //透明度
            medianValue: false, //gantt类型的中值点
            startValue: false, //gantt类型的起点
            endValue: false, //gantt类型的终点
            extData: {} //扩展数据
        };
        Ext.apply(addObj, serialData);
        this["serial_" + serialData.id] = this.graphlive.addSerial(addObj);

        proxy.heartPlusLineArray = [];//心率脉搏连线数组
        //添加菜单项
        this["menuitem_" + serialData.id] = new Ext.menu.CheckItem({
            text: serialData.legendTypeAliasName, //序列名称
            serialId: serialData.id, //序列id
            haveData: false, //是否有数据
            checked: true,
            handler: function(item) {
                //隐藏已有心率脉搏连线
                for (var i=proxy.heartPlusLineArray.length-1; i>=0; i--) {
                    proxy.heartPlusLineArray[i].hide();
                    proxy.heartPlusLineArray.pop();
                }

                var serial = proxy["serial_" + item.serialId];
                if (serial.visible) {
                    serial.hide();
                }else{
                    serial.show();
                }

                //判断心率和脉搏是否都显示，如果是，屏蔽掉相同值的脉搏点，王小伟2014-12-08
                if ( 'serial_' + heartRateId in proxy
                    && 'serial_' + pulseId in proxy
                    && proxy["serial_" + heartRateId].visible==true
                    && proxy["serial_" + pulseId].visible==true ) {

                    for (var i=0; i<proxy["serial_" + heartRateId].legends.length; i++) {
                        for (var j=0; j<proxy["serial_" + pulseId].legends.length; j++) {
                            if (proxy["serial_" + heartRateId].legends[i].xField == proxy["serial_" + pulseId].legends[j].xField) {
                                if (proxy["serial_" + heartRateId].legends[i].yField == proxy["serial_" + pulseId].legends[j].yField) {
                                    proxy["serial_" + pulseId].legends[j].hide();
                                } else {
                                    //添加心率脉搏连接线，王小伟，2014-12-15
                                    var line = proxy.graphlive.addConnectingLine({
                                        bindYAxisName: 'V1',
                                        bindXAxisName: 'H0',
                                        fromXField: proxy["serial_" + heartRateId].legends[i].xField,
                                        fromYField: proxy["serial_" + heartRateId].legends[i].yField,
                                        toXField: proxy["serial_" + pulseId].legends[j].xField,
                                        toYField: proxy["serial_" + pulseId].legends[j].yField,
                                        stroke:'red'});
                                    proxy.heartPlusLineArray.push(line);
                                }
                                break;
                            }
                        }
                    }
                    proxy["serial_" + pulseId].updateSeriesPath();
                }
            }
        });
        proxy.contextMenu.add(this["menuitem_" + serialData.id]);
    }

    //折线上添加点
    this.addLegend = function(serialId, legendData) {
        if (typeof(legendData) == "undefined") {
            legendData ={
                xField: new Date("2014/03/05 00:15:00"),
                yField: 99
//              ,isBreath: true
            };
        }
        //不允许编辑时不闪烁
        if (this.isAllowEdit!=true) {
            legendData.isBreath = false;
        }
        //防止重复画点
        if (typeof(legendData.id)!="undefined") {
            if (proxy.graphlive.getChildById(legendData.id)!=null) {
                return;
            }
        }
        this[serialId].insertSeriesValueAt({
            id: typeof(legendData.id)=="undefined" ? Math.uuid() : legendData.id,
            xField: legendData.xField.getTime(),
            yField: legendData.yField,
            //扩展属性，用于鼠标提示信息，绘图组件不存储原始值
            extData: {
                initialData: {
                    realXField: legendData.realXField ? legendData.realXField.getTime() : legendData.xField.getTime(),
                    xField: legendData.xField.getTime(),
                    yField: legendData.yField,
                    orgValue: legendData.orgValue
                },
                isDirty: false //是否被修改过
            },//序列的注释数组，每个元素是一个注释
            mark: typeof(legendData.mark) == "undefined" ? false : legendData.mark
        });
        if (typeof(legendData.isBreath) != "undefined" && legendData.isBreath==true) {
            this.startBreath(serialId, [legendData.xField]);
        }
        //禁止拖动
        if (this.isAllowEdit!=true) {
            this.graphlive.lock();
        }

        //设置菜单项属性，判断菜单项是否有数据
        if (this["menuitem_" + serialId.substring(7)].haveData==false) {
            this["menuitem_" + serialId.substring(7)].haveData = true;
            for (var i=0; i<proxy.contextMenu.items.getCount(); i++) {
                var menuItem = proxy.contextMenu.items.getAt(i);
                if (menuItem.serialId==serialId.substring(7)) {
                    menuItem.haveData = true;
                    break;
                }
            }
        }
    }

    //添加孤立单点
    this.addIsolateLegend = function(legendData) {
        if (typeof(legendData) == "undefined") {
            var legendData = {
                xField: new Date("2014/03/05 00:05:00"),
                yField: 10,
                id: Math.uuid(),
                mark: '标签值',
                isBreath: true,
                customICUValue: '自定义属性'
            };
        }
        //防止重复画点
        if (typeof(legendData.id)!="undefined") {
            if (proxy.graphlive.getChildById(legendData.id)!=null) {
                return;
            }
        }
        var lengend = proxy.graphlive.addLegend({
            legendType: typeof(legendData.legendType)!='undefined' ? legendData.legendType : "LT008",
            bindYAxisName: typeof(legendData.bindYAxisName)!='undefined' ? legendData.bindYAxisName : null,
            xField: legendData.xField.getTime(),
            yField: legendData.yField,
            fill: '',
            stroke: '#0099CC',
            name: legendData.id,
            id: legendData.id,
            mark: legendData.mark,
            markpos: typeof(legendData.markpos)!='undefined' ? legendData.markpos : "top",
            customICUValue: legendData.customICUValue
//            ,legendTypeAliasName: '自定义属性名称'
        });

        if (typeof(legendData.isBreath) != "undefined" && legendData.isBreath==true) {
            lengend.startBreath();
        }

        lengend.set({lockMovementY:false});
        //禁止拖动
        if (this.isAllowEdit!=true || legendData.isLock==true) {
            lengend.lock();
        }
    }

    //这线上某点闪烁
    this.startBreath = function(serialId, timeArray) {
        for (var i=0; i<this[serialId].legends.length; i++) {
            for (var j=0; j<timeArray.length; j++) {
                if (this[serialId].legends[i].xField==timeArray[j].getTime()) {
                    this[serialId].legends[i].startBreath();
                }
            }
        }
    }

    //改变窗口大小事件触发
    this.onresize = function(graphLiveArray) {
        if (typeof(proxy.prevChangeWidth) == "undefined") {
            proxy.prevChangeWidth = 0;
        }
        var currBodyWidth = document.body.clientWidth;
        var changeBodyWidth = currBodyWidth - proxy.prevBodyWidth;
        var X_AXIS_FIELDS_LENGTH = proxy.X_AXIS_FIELDS_LENGTH
        if (proxy.isOffset==true) {
            X_AXIS_FIELDS_LENGTH += 2;
        }
        if (Math.abs(changeBodyWidth + proxy.prevChangeWidth)>=X_AXIS_FIELDS_LENGTH) {
            if (proxy.legendTable!=null) {
                //缩小序列表格宽度，同时需要缩小子序列表格宽度，否则td不会缩放
                proxy.legendTable.style.width = proxy.legendTable.clientWidth - proxy.prevChangeWidth;
                for(var i=0; i<graphLiveArray.length; i++) {
                    graphLiveArray[i].legendTable.style.width = graphLiveArray[i].legendTable.clientWidth - proxy.prevChangeWidth;
                }
            }
            //设置div宽度，直接缩小div或td的宽度不起作用，因为尚未重绘网格
            var divWidthHeight = proxy.setDivTdWidthHeightByGrid(proxy.canvasDiv.clientWidth + changeBodyWidth);
            //更改网格大小
            proxy.graphlive.changeGridByCell({
                cell:{
                    width: proxy.X_AXIS_STEP,
                    height: proxy.SERIAL_GRID_Y
                },
                columnCount: proxy.isOffset==true?proxy.X_AXIS_FIELDS_LENGTH + 2:proxy.X_AXIS_FIELDS_LENGTH,
                rowCount: divWidthHeight.height / proxy.SERIAL_GRID_Y
            });
            //重新绘制网格，只改变画布不改变单元格大小
//            proxy.graphlive.setDimensions({width: divWidthHeight.width, height: divWidthHeight.height});
        } else {
            if (proxy.legendTable!=null) {
                //设置图例列的宽度
                proxy.legendTable.style.width = proxy.legendTable.clientWidth + changeBodyWidth;
            }
            //记录上次多分配给第二列td内的table宽度
            proxy.prevChangeWidth = proxy.prevChangeWidth + changeBodyWidth;
        }
        if (proxy.legendTable!=null) {
            //为了保持网格线，取父节点实际宽度，会存在下面的图形图例比上面宽
            proxy.legendTable.style.width = proxy.legendTable.parentNode.clientWidth;
        }
        //记录上次窗口宽度
        proxy.prevBodyWidth = document.body.clientWidth;
        //返回画布的宽度
        return proxy.canvasDiv.clientWidth;
    }

    /**
     * 创建模型
     */
    this.createModel = function (){
        // 时间数组
        var timeArray;
        if (proxy.xAxisTimeInterval==null) {
            timeArray = proxy.getTimeArray();
        } else {
            timeArray = proxy.getTimeArrayByStep(proxy.xAxisTimeInterval);
        }

        //宽度
        var divWidth = proxy.canvasDiv.clientWidth;
        //高度
        var divHeight = proxy.canvasDiv.clientHeight;

        //y轴LocationY
        var yAxisLocationY = proxy.yAxisLocationY;

        var yAxisStep;
        if (this.yAxisStep==null) {
            //y轴step=y轴长度/yAxis.fields数组长度
            var yAxisStep = parseInt((divHeight-yAxisLocationY+proxy.canvasHeightSubtract) / this.Y_AXIS_FIELDS_LENGTH);
        } else {
            var yAxisStep = proxy.yAxisStep;
        }

        // 声明模型 //
        return {
            hasTip: false, //不显示默认tip
            width: divWidth, //绘图编辑器宽
            height: divHeight, //编辑器高
            renderTo: proxy.canvasDivId, //在何处渲染，要求是绘图编辑器所在DIV的id
            hasTimeLine: proxy.hasTimeLine, //是否显示时间线
            xAxis: [{
                type: 'Time', //轴值值为数字，数字是毫秒数，显示轴值的时候需要转换为时间显示
                name: 'H0', //轴名用于序列绑定
                step: proxy.X_AXIS_STEP, //相邻轴值间隔像素
                interval: proxy.xAxisInterval, //每多少个轴值显示一次轴标签值
                fields: timeArray, //水平轴的轴值数组,单轴率情况下，复合轴率是第二个数组，值一共是61个
                length: proxy.xAxislocationX==0 ? (divWidth-(proxy.isOffset==true?(proxy.X_AXIS_STEP*2):0)) : (divWidth-proxy.xAxislocationX*2), //轴长
                drawAxis: proxy.drawXAxis, //是否绘制轴线
                displayLabels: false, //是否显示轴的标签
                locationX: proxy.xAxislocationX==0 ? (proxy.isOffset==true?proxy.X_AXIS_STEP:0) : proxy.xAxislocationX, //轴的水平位置
                locationY: 0, //轴的垂直位置
                lineType: 'dash'//proxy.xAxisLineType
            }], //每一个数组对象代表一个水平轴
            yAxis: [{
                type: 'Numeric',
                name: 'V1',
                fields: proxy.v1Fields, //轴绑定字段
                step: yAxisStep,
                interval: 1,
                length: proxy.yAxisLength==null ? (divHeight-yAxisLocationY) : proxy.yAxisLength,
                locationX: 0,
                locationY: yAxisLocationY,
                drawAxis: proxy.drawYAxis, //是否绘制轴线
                displayLabels: false //是否显示轴的标签
            }, {
                type: 'Numeric',
                name: 'V2',
                fields: proxy.v2Fields, //轴绑定字段
                step: yAxisStep,
                interval: 1,
                length: proxy.yAxisLength==null ? (divHeight-yAxisLocationY) : proxy.yAxisLength,
                locationX: 0,
                locationY: yAxisLocationY,
                drawAxis: false, //是否绘制轴线
                displayLabels: false //是否显示轴的标签
            }, {
                type: 'Numeric',
                name: 'V3',
                fields: proxy.v3Fields, //轴绑定字段
                step: yAxisStep,
                interval: 1,
                length: proxy.yAxisLength==null ? (divHeight-yAxisLocationY) : proxy.yAxisLength,
                locationX: 0,
                locationY: yAxisLocationY,
                drawAxis: false, //是否绘制轴线
                displayLabels: false //是否显示轴的标签
            }], //垂直轴，每个数组对象代表一个垂直轴
            grid: {
                gridX: proxy.X_AXIS_STEP, //水平间距，以像素为单位
                gridY: proxy.SERIAL_GRID_Y, //垂直间距，以像素为单位
                hasVertical: proxy.hasVerticalGrid, //是否有垂直网格线
                hasHorizontal: proxy.hasHorizontalGrid, //是否有水平网格线
                lineType: proxy.gridLineType, //网格线的类型 ,支持虚线(dash)以及实线(solid)
                color: proxy.gridColor, //网格线的颜色
                customDraw: proxy.customDraw //自定义网格线
            }
        };
    }

    com.dfsoft.icu.SerialGraphLive.superclass.constructor.call(this, config);

    //设置宽高，高度固定10行
    this.setDivTdWidthHeightByGrid();
    //初始化
    this.dataModel = this.createModel();

    this.graphlive = new GraphLive(this.dataModel);
    this.initGraphlive();

    //添加鼠标提示
    this.addTip();
    //设置X轴,Y轴前需要重置
//    this.graphlive.reset();
    //重置Y轴
//    this.setYAxis();
    //重置X轴
//    this.setXAxis();
    //添加序列
//    this.addSerials();
    //添加点
//    this.addLegend();
    //时间轴
//    this.time(this.graphlive, proxy.canvasDiv);
    //锁定
//    this.graphlive.lock();
//    //滚动时间轴
//    this.scrollTimeLabels()

    //右键菜单
    proxy.contextMenu = Ext.create('Ext.menu.Menu', {
        items: []
    });

    //移除所有右键菜单项
    proxy.clearContextMenu = function() {
        for (var i=0; i<proxy.contextMenu.items.getCount(); i++) {
            var menuItem = proxy.contextMenu.items.getAt(i);
            delete this["menuitem_" + menuItem.serialId];
        }
        proxy.contextMenu.removeAll();
        proxy.contextMenu.hide();
    };

    //当鼠标移动到图例上
    proxy.graphlive.on(GraphliveConstants.RIGHTCLICK, function(e) {
        var visibleCount = 0;
        for (var i=0; i<proxy.contextMenu.items.getCount(); i++) {
            var menuItem = proxy.contextMenu.items.getAt(i);
            menuItem.setVisible(menuItem.haveData==true);
            if (menuItem.haveData==true) {
                visibleCount++;
            }
        }
        if (visibleCount==0) {
            return;
        }
        proxy.contextMenu.showAt(e.x + window.scrollX, e.y + window.scrollY);
        e.stopPropagation();
    });

    //自动屏蔽冲突项
    this.hideConflict = function() {
        //如果心率脉搏同时存在，并且心率脉搏都有数据
        if ( 'menuitem_' + heartRateId in proxy
            && 'menuitem_' + pulseId in proxy
            && proxy["menuitem_" + heartRateId].haveData==true
            && proxy["menuitem_" + pulseId].haveData==true ) {
            //隐藏脉搏序列
            proxy["serial_" + pulseId].hide();
            //脉搏菜单复选框
            for (var i=0; i<proxy.contextMenu.items.getCount(); i++) {
                var menuItem = proxy.contextMenu.items.getAt(i);
                if (menuItem.serialId==pulseId) {
                    menuItem.setChecked(false);
                    break;
                }
            }
        }
    };
};

Ext.extend(com.dfsoft.icu.SerialGraphLive, com.dfsoft.icu.GraphLiveParent, {

});
