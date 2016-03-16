/**
 * 固定单元格宽度折线绘图实例
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.FixedXAxisStepSerialGraphLive = function(config) {
    //固定单元格宽度，如果设置则单元格个数不固定，由参数传入
    this.Fixed_X_AXIS_STEP = 20;
    //每个单元格所代表的时间范围，毫秒数, 由参数传入
    this.Fixed_X_AXIS_STEP_Time = 30 * 60 * 1000;

    Ext.apply(this, config);
    var proxy = this;

    //设置折线图div的宽度和高度适合grid的宽高, 高度固定10行，宽度固定61行，覆盖父类方法
    config.setDivTdWidthHeightByGrid = function(canvasTdClientWidth) {
        if (typeof(canvasTdClientWidth) == "undefined") {
            canvasTdClientWidth = proxy.canvasTd.clientWidth;
        }
        //如果左侧图例表格宽度小于170，需要调整宽度
        if (document.body.clientWidth - canvasTdClientWidth < 186) {
            canvasTdClientWidth = document.body.clientWidth - 186;
        }
        if (typeof(proxy.prevChangeWidth) == "undefined") {
            proxy.prevChangeWidth = 0;
        }
        canvasTdClientWidth = canvasTdClientWidth + proxy.prevChangeWidth;
        //设置X轴线间隔，如果使用网格偏移，则加2个网格
        //如果单元格宽度固定，计算可以容纳多少个单元格
        proxy.X_AXIS_STEP = this.Fixed_X_AXIS_STEP;
        var X_AXIS_FIELDS_LENGTH = parseInt(canvasTdClientWidth / proxy.X_AXIS_STEP);
        proxy.X_AXIS_FIELDS_LENGTH = X_AXIS_FIELDS_LENGTH;
        if (proxy.isOffset==true) {
            proxy.X_AXIS_FIELDS_LENGTH -= 2;
        }
        //设置div的宽高取整
        var width = proxy.X_AXIS_STEP * X_AXIS_FIELDS_LENGTH;
        var height = proxy.SERIAL_GRID_Y * proxy.Y_AXIS_FIELDS_LENGTH;
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
            proxy.legendTable.style.width = document.body.clientWidth - width;//22为第一列宽度，预留25防止剩余空间不足
        }
        //记录上次窗口宽度
        proxy.prevBodyWidth = document.body.clientWidth;
        //记录上次多分配给第二列td内的table宽度
        proxy.prevChangeWidth = canvasTdClientWidth - width;

        //计算开始时间和结束时间
        config.computerBeginEndDateTime();

        return {width: width, height: height};
    }

    //根据当前时间，计算开始结束时间
    config.computerBeginEndDateTime = function() {
        proxy.endDateTime = new Date();
        proxy.endDateTime = proxy.timeToHour(proxy.endDateTime);
        proxy.beginDateTime = new Date(proxy.endDateTime.getTime() - proxy.X_AXIS_FIELDS_LENGTH * proxy.Fixed_X_AXIS_STEP_Time);
    }

    com.dfsoft.icu.FixedXAxisStepSerialGraphLive.superclass.constructor.call(this, config);

};

Ext.extend(com.dfsoft.icu.FixedXAxisStepSerialGraphLive, com.dfsoft.icu.SerialGraphLive, {

});
