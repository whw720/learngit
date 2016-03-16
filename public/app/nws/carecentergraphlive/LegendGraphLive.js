/**
 * Legend绘图实例
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.LegendGraphLive = function(config) {
    //画布div id，有参数传入
    this.canvasDivId = null;
    //绘图td id, 由参数传入
    this.canvasTdId = null;
    //y轴个数，由参数传入
    this.Y_AXIS_FIELDS_LENGTH = 6;
    //图例列table 由参数传入
    this.legendTableId = null;
    //是否有垂直网格线
    this.hasVertical = false;
    //固定X轴网格线的间隔值，为了与上面的网格线对齐
    this.FIXED_X_AXIS_STEP = null;
    //图例类型
    this.legendType = "LT008";
    //是否有水平网格线
    this.hasHorizontal = true;
    //是否使用网格偏移,画布左右各空出一个网格，用于完全显示点
    this.isOffset = true;
    //是否绘制X轴轴线
    this.drawXAxis = false;
    //是否显示时间线
    this.hasTimeLine = true;

    Ext.apply(this, config);
    var proxy = this;

    //画布DIV
    this.canvasDiv = document.getElementById(proxy.canvasDivId);
    //画布Td
    this.canvasTd = document.getElementById(proxy.canvasTdId);
    //图例列table
    this.legendTable  = document.getElementById(proxy.legendTableId);

    //设置甘特图div的宽度和高度适合grid的宽高, 高度
    this.setDivTdWidthHeightByGrid = function(canvasDivClientWidth) {
        if (typeof(canvasDivClientWidth) == "undefined") {
            canvasDivClientWidth = proxy.canvasDiv.clientWidth;
        }
        if (typeof(proxy.prevChangeWidth) == "undefined") {
            proxy.prevChangeWidth = 0;
        }
//        canvasDivClientWidth = canvasDivClientWidth + proxy.prevChangeWidth;//上级serialGraphlive图形已经考虑过改变值
        //设置X轴线间隔，如果使用网格偏移，则加2个网格
        var X_AXIS_FIELDS_LENGTH = proxy.X_AXIS_FIELDS_LENGTH
        if (proxy.isOffset==true) {
            X_AXIS_FIELDS_LENGTH += 2;
        }
        proxy.X_AXIS_STEP = parseInt(canvasDivClientWidth / X_AXIS_FIELDS_LENGTH);
        //检查最小间隔
        if (proxy.MIN_X_AXIS_STEP!=null && proxy.X_AXIS_STEP<proxy.MIN_X_AXIS_STEP) {
            proxy.X_AXIS_STEP = proxy.MIN_X_AXIS_STEP;
        }
        //设置div的宽高取整
        var width = proxy.X_AXIS_STEP * X_AXIS_FIELDS_LENGTH;
        var height = proxy.GANTT_GRID_Y * proxy.Y_AXIS_FIELDS_LENGTH;
        proxy.canvasDiv.style.width = width;
        proxy.canvasDiv.style.height = height;
        //设置td的宽高和div保持一致
        proxy.canvasTd.style.width = width;
        proxy.canvasTd.style.height = height;
        //设置第二列td内的table宽度
        if (proxy.legendTable!=null) {
            proxy.legendTable.style.width = document.body.clientWidth - width - 25;//22为第一列宽度，预留25防止剩余空间不足
        }
        //记录上次窗口宽度
        proxy.prevBodyWidth = document.body.clientWidth;
        //记录上次多分配给第二列td内的table宽度
        proxy.prevChangeWidth = canvasDivClientWidth - width;
        return {width: width, height: height};
    }

    //改变窗口大小事件触发，由于生命体征绘图td变化后，后面的td会随之发生变化，所有不用再调整td的宽度。
    this.onresize = function(firstCanvasWidth) {
        if (typeof(proxy.prevChangeWidth) == "undefined") {
            proxy.prevChangeWidth = 0;
        }
        var currBodyWidth = document.body.clientWidth;
        var changeBodyWidth = currBodyWidth - proxy.prevBodyWidth;
        var X_AXIS_FIELDS_LENGTH = proxy.X_AXIS_FIELDS_LENGTH
        if (proxy.isOffset==true) {
            X_AXIS_FIELDS_LENGTH += 2;
        }
        if (Math.abs(changeBodyWidth + proxy.prevChangeWidth)>=X_AXIS_FIELDS_LENGTH || changeBodyWidth==0) {
            //直接取第一个画布(生命体征)的宽度
            var divWidthHeight = proxy.setDivTdWidthHeightByGrid(firstCanvasWidth);
            //重新绘制网格
            proxy.graphlive.setDimensions({width: divWidthHeight.width, height: divWidthHeight.height});
        } else {
            //设置图例列的宽度
            if (proxy.legendTable!=null) {
                proxy.legendTable.style.width = proxy.legendTable.clientWidth + changeBodyWidth;
            }
            //记录上次多分配给第二列td内的table宽度
            proxy.prevChangeWidth = proxy.prevChangeWidth + changeBodyWidth;
        }
        //为了保持网格线，取父节点实际宽度
        if (proxy.legendTable!=null) {
            proxy.legendTable.style.width = proxy.legendTable.parentNode.clientWidth;
        }
        //记录上次窗口宽度
        proxy.prevBodyWidth = document.body.clientWidth;
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
                length: divWidth-(proxy.isOffset==true?(proxy.X_AXIS_STEP*2):0), //轴长
                drawAxis: proxy.drawXAxis, //是否绘制轴线
                displayLabels: false, //是否显示轴的标签
                locationX: proxy.isOffset==true?proxy.X_AXIS_STEP:0, //轴的水平位置
                locationY: 0 //轴的垂直位置
            }], //每一个数组对象代表一个水平轴
            yAxis: [], //垂直轴，每个数组对象代表一个垂直轴
            grid: {
                gridX: proxy.X_AXIS_STEP, //水平间距，以像素为单位
                gridY: proxy.GANTT_GRID_Y, //垂直间距，以像素为单位
                hasVertical: proxy.hasVertical, //是否有垂直网格线
                hasHorizontal: proxy.hasHorizontal, //是否有水平网格线
                lineType: 'solid', //网格线的类型 ,支持虚线(dash)以及实线(solid)
                color: 'darkgreen' //网格线的颜色
            }
        };
    }

    //添加单点
    this.addLegend = function(legendData) {
        if (typeof(legendData) == "undefined") {
            var legendData = {
                xField: new Date("2014/03/05 00:05:00"),
                rowNum: 1,
                id: Math.uuid(),
                mark: '标签值',
                isBreath: true
            };
        }
        //防止重复画点
        if (typeof(legendData.id)!="undefined") {
            if (proxy.graphlive.getChildById(legendData.id)!=null) {
                return;
            }
        }
        //对于护理记录中下拉框数据进行特殊处理：{id: '', name: ''}
        //护理评分{"showType":1,"score":23,items:"E2V4M5"}
        var mark;
        try {
            var result = Ext.decode(legendData.mark);
            if (result.hasOwnProperty('name')) {
                mark = result.id;//显示name值会过长，改为显示id值，王小伟2014-06-19，result.name;
            } else if (result.hasOwnProperty('showType')) {
                if (result.showType==1) {
                    mark = result.score;
                } else {
                    mark = result.items;
                }
            } else {
                mark = legendData.mark;
            }
        } catch(e) {
            mark = legendData.mark;
        }
        var lengend = proxy.graphlive.addLegend({
            legendType: legendData.legendType ? legendData.legendType : proxy.legendType,
            xField: legendData.xField.getTime(),
            yField: proxy.GANTT_GRID_Y * legendData.rowNum - 5,
            fill: '',
            stroke: '#CC0000',
            name: legendData.id,
            id: legendData.id,
            mark: mark,
            width: 6,
            height: 6,
            //扩展属性，用于鼠标提示信息，绘图组件不存储原始值
            extData: {
                initialData: {
                    realXField: legendData.xField.getTime()
                }
            }
//            ,legendTypeAliasName: '自定义属性名称'
        });

        if (typeof(legendData.isBreath) != "undefined" && legendData.isBreath==true) {
//            lengend.startBreath();//非生命体征节点不闪动
        }
        //禁止拖动
        this.graphlive.lock();
    }
    
    com.dfsoft.icu.LegendGraphLive.superclass.constructor.call(this, config);

    //初始化
    //设置宽高
    this.setDivTdWidthHeightByGrid();
    this.dataModel = this.createModel();
    this.graphlive = new GraphLive(this.dataModel);
    this.initGraphlive();

    //添加鼠标提示
    this.addTip();
    //添加单个点
//    this.addLegend();
    //锁定
    this.graphlive.lock();
};

Ext.extend(com.dfsoft.icu.LegendGraphLive, com.dfsoft.icu.GraphLiveParent, {

});
