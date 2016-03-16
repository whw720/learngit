/*
 *绘图区所定义的轴及轴与外界交互所用到的实体定义
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Axis) {
    console.warn('fabric.Axis is already defined');
    return;
  }

  /**
   * 轴标签定义
   */
  function AxisLabel(x,y,value,translateToTime) {
  	
    var x=x||0,//相对轴左上角的水平值
    	y=y||0,//相对轴左上角的垂直值
    	value=value||0;//标签值
    this.getX=function(){
    	return x;
    };
    this.getY=function(){
    	return y;
    };
    this.getValue=function(){
    	return value;
    };
    this.getDisplayText=function(){
    	var text=value;
    	if(translateToTime){//把值翻译成时间格式用于时间轴格式为HH:mm 如08:30
        var time = new Date(value);
        var hour = time.getHours();
        if (hour < 10) {
          hour = "0" + hour;
        }
        var minute = time.getMinutes();
        if (minute < 10){
          minute = "0" + minute;
        }
        text = hour + ":" + minute;
    	}
    	return text;
    };
  };

   /**
	*轴率定义
	**/
  function AxisRate(rate,startCoordinate,endCoordinate,startAxisValue,endAxisValue){
	  if(arguments.length!=5&&arguments.length!=0){
	  	throw new Error('轴率初始化错误，请检查参数个数');
	  } 
	  var rate=rate||0,
        startCoordinate=startCoordinate||0,
	  	  endCoordinate=endCoordinate||0,
	  	  startAxisValue=startAxisValue||0,
	  	  endAxisValue=endAxisValue||0;
	  this.getRate=function(){
	  	return rate;
	  };
	  //传入的坐标值是否包含在此轴率内
	  this.isContainCoordinate=function(cv){
      return cv >= startCoordinate && cv <= endCoordinate;
	  };
	  //传入的轴值是否在此轴率内
	  this.isContainAxisValue=function(av){
      return (av >= startAxisValue && av <= endAxisValue)||(av <= startAxisValue && endAxisValue <= av);
	  };
	  //添加存取成员
	  this.getStartCoordinate=function(){
	  	return startCoordinate;
	  };
	  this.getEndCoordinate=function(){
	  	return endCoordinate;
	  };
	  this.getStartAxisValue=function(){
	  	return startAxisValue;
	  };
	  this.getEndAxisValue=function(){
	  	return endAxisValue;
	  };
	  this.setStartCoordinate=function(scv){
	  	startCoordinate=scv;
	  };
	  this.setEndCoordinate=function(ecv){
	  	endCoordinate=ecv;
	  };
	  this.setStartAxisValue=function(sav){
	  	startAxisValue=sav;
	  };
	  this.setEndAxisValue=function(eav){
	  	endAxisValue=eav;
	  };
	};

  /**
   * Axis class
   * @class fabric.Axis
   * @extends fabric.Object
   * @return {fabric.Axis} thisArg
   */
  fabric.Axis = fabric.util.createClass(fabric.Object, /** @lends fabric.Axis.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: GraphliveConstants.AXIS,
    /**
     * Type of an object
     * @type String
     * @default
     */
    axisType: 'Numeric',

    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx:   0,

    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry:   0,

    /**
     * Used to specify dash pattern for stroke on this object
     * @type Array
     */
    strokeDashArray: null,
    /**
    *轴的名称 用于序列与轴之间的映射
    **/
    name: 'H0',
    /**
    *轴的显示名称，用于显示轴所代表的含义名称
    **/
    displayName: '',
    /**
    *轴的刻度值，即轴的模型值
    **/
    fields: [],
    /**
    *轴的显示标签值，即在轴上显示的刻度标签
    **/
    axisLabels: [],
    /**
    *轴上每多长(像素)显示一个轴值，即出现一个fields中的标签
    **/
    step:42,
    // step 所对应的的行数
    stepCount:0,
    /**
    *fields中的值相隔几个显示一个，1表示连续显示
    **/
    interval: 1,
    /**
    *轴的水平位置
    **/
  	locationX:0,
    // locationX 对应的行数
    locationXCount:0,
  	/**
      *轴的类型，是否为水平轴，true为水平，false是垂直轴
      **/
  	isHorizontal:true,
    /**
      *缩放是反向轴，即空间坐标值越大时轴值越小，即越靠近容器上边轴值越大
      **/
    isReverse:false,
  	/**
      *轴的垂直位置
      **/
  	locationY:0,
    // locationY 对应的行数
    locationYCount:0,
  	/**
      *轴的长度，即所能转换的区域的大小
      **/
  	length:0,
      /**
       *轴的线型，支持虚线(dash)以及实线(solid)
       **/
    lineType:'solid',
  	/**
      *是否绘制轴的刻度线
      **/
  	isDrawAxis:true,
    /**
      *是否显示轴的标签，false的时候不进行标签的位置计算
      **/
    isDisplayLabels:false,
  	/**
      *轴率列表，即轴线上多少刻度代表多少业务含义值，其中的对象是AxisRate
      **/
  	axisRates:[],
    /**
      *调整大小比率，即调整绘图编辑器前后的宽高比值
      **/
    resizeRate:new ResizeRate(1,1),

    resizeDimensions:null,
    /**
      *调整大小比率，即调整绘图编辑器前后的宽高比值
      **/
    axisRateChangedListeners:[],
    /**
     * Constructor 
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };

      this._initStateProperties();
      this.callSuper('initialize', options);
      this._initRxRy();
      this.axisLabels=[];
      this.axisRates=[];
      this.axisRateChangedListeners=[];
      this.x = 0;
      this.y = 0;
      this.refreshAxisRate();
    },

    /**
     * 获取轴上显示的标签列表，列表中的元素对象为AxisLabel
     * 
     */
    getDisplayLabels: function() {
      return this.axisLabels;
    },
    /**
     * 添加轴率改变监听者
     * 
     */
    addRateChangedListeners: function(listener) {
      //加验证代码
      if(this.axisRateChangedListeners.indexOf(listener)==-1&&listener.axisRateChanged) this.axisRateChangedListeners.push(listener);
    },
    /**
     * 移除轴率改变监听者
     * 
     */
    removeRateChangedListeners: function(listener) {
      //加验证代码并移除
      var index=this.axisRateChangedListeners.indexOf(listener);
      if(index!=-1) this.axisRateChangedListeners.splice(index,1);
    },
    /**
     * 刷新轴率用于生成轴率及刷新轴率
     * 
     */
    refreshAxisRate:function(){
      this.axisRates.length=0;
      var xoffset = this.isHorizontal?this.locationX:this.locationY,
          fields = this.fields;
      for (var i = 0; i < fields.length; i++) {
        var sub = fields[i];
        var f = sub[0],
            s = sub[1];
        var absX = Math.abs(s - f);
        var xRate={};
        //rateValue代表的是轴上某一轴率，多长代表单位业务值
        xRate.rateValue = this.step / absX;
        //start,end代表的是轴上某一轴率的起止坐标x值
        xRate.start = xoffset;
        xRate.end = xRate.start + this.step * (sub.length - 1);
        //startValue,endValue代表轴上某一段轴的起止值(业务值)
        xRate.startValue = f
        xRate.endValue = sub[sub.length - 1];
        this.axisRates.push(new AxisRate(xRate.rateValue,xRate.start,xRate.end,xRate.startValue,xRate.endValue));
        xoffset=xRate.end;
      };
      //更新轴的标签对象
      var xf = this.fields || [];
      this.axisLabels.length=0;
      var lableCount = 0;
      for (var i = 0; i < xf.length; i++) {
        var sub = xf[i];
        //是否要添加分段轴的第一个元素进行显示，待定
        for (var j = 0; j < sub.length; j++) {
          if(i>0&&j==0) continue;
          if (j % this.interval == 0) {
            //添加AxisLabel至axisLabels中
            var x=0,y=0,v=sub[j],t=this.axisType=='Time';
            if(this.isHorizontal){
              //x=this.step*lableCount+this.locationX,y=this.locationY;
              x=this.step*lableCount,y=this.locationY;
            }else{
              x=this.locationX, y=this.step*lableCount+this.locationY;
            }
            this.axisLabels.push(new AxisLabel(x,y,v,t));
          }
          lableCount++;
        };
      };
      //派发轴更新事件，并把此轴作为参数派发出去
      for (var i = 0; i < this.axisRateChangedListeners.length; i++) {
          this.axisRateChangedListeners[i].axisRateChanged(this);
      };
    },

    /**
     * 设置轴的模型值，格式为二维数组格式，如[[a1,a2...],[b1,b2...]],如果不存在多轴率数组中只有一个轴值数组
     * 
     */
    setAxisFields:function(axisFields){
      this.fields=axisFields.concat();
      this.refreshAxisRate();
      this.canvas.renderAll();
    },
    /**
     * 坐标值转为轴值,cv为坐标轴的X轴值或者Y轴值，根据当前坐标轴是水平轴还是垂直轴
     * 
     */
    coordinateToAxis:function(cv){
      var av = cv,xRate,translated=false; //转换后的轴值
      for (var i = 0; i < this.axisRates.length; i++) {
        xRate = this.axisRates[i];
        if (xRate.isContainCoordinate(cv)) {
          if(xRate.getEndAxisValue()>xRate.getStartAxisValue()) av = (cv - xRate.getStartCoordinate())/xRate.getRate() + xRate.getStartAxisValue();
          if(xRate.getStartAxisValue()>xRate.getEndAxisValue()) av = xRate.getStartAxisValue() - (cv - xRate.getStartCoordinate())/xRate.getRate();
          translated=true;
          break;
        }
      }
      //对于超出轴测量范围的进行默认处理，不区分轴率，以第一个轴率计算，一般只有垂直轴
      if(!translated&&this.canvas){
        var rx=this.axisRates[0];
        av=rx.getStartAxisValue()+Math.abs((cv-rx.getStartCoordinate()))/rx.getRate();
      }
      return av;
    },
    /**
     * 轴值转为坐标值,av为轴值，根据当前值是水平或是垂直轴转换为坐标系的X轴或者Y轴
     * 
     */
    axisToCoordinate:function(av){
      var cv = av,xRate,translated=false; //转换后的轴值
      for (var i = 0; i < this.axisRates.length; i++) {
        xRate = this.axisRates[i];
        if (xRate.isContainAxisValue(av)) {
          cv =xRate.getStartCoordinate()+Math.abs((av-xRate.getStartAxisValue()))*xRate.getRate();
          translated=true;
          break;
        }
      }
      //对于超出轴测量范围的进行默认处理，不区分轴率，以第一个轴率算
      if(!translated&&this.canvas){
        var rx=this.axisRates[0];
        //当前坐标有可能存在小于开始坐标的情况，王小伟 2015-03-30
        cv=rx.getStartCoordinate()-Math.abs((av-rx.getStartAxisValue()))*rx.getRate();
      }
      return Math.round(cv);
    },

    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Axis` -specific ones to it
     * (such as "rx", "ry", etc.)
     * @private
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat(['rx', 'ry']);
    },

    /**
     * Initializes rx/ry attributes
     * @private
     */
    _initRxRy: function() {
      if (this.rx && !this.ry) {
        this.ry = this.rx;
      }
      else if (this.ry && !this.rx) {
        this.rx = this.ry;
      }
    },

    /**
     * 设置调整比率
     */
    setResizeRate:function(rr,gridCell){
        this.resizeRate=rr;
        if (this.isHorizontal) {
          this.step = this.stepCount * gridCell.width;
          this.locationX = this.locationXCount * gridCell.width+7;
        } else {
          this.step = this.stepCount * gridCell.height;
          this.locationY = this.locationYCount * gridCell.height;
        }
        this.refreshAxisRate();
    },

    /**
     * 编辑器大小调整后通知事件
     */
    resizeChanged:function(graphLive){
      this.setResizeRate(graphLive.getResizeRate(),graphLive.getGridCell());
      this.setDimensions(graphLive.getDimensions());
    },

    /**
     * 设置调整大小
     */
    setDimensions:function(d){
      this.resizeDimensions = d;
    },
    
    /**
     * 绘制轴线
     * @private
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var rx = this.rx || 0,
        ry = this.ry || 0,
        x = 0,
        y = 0,
        w = this.width,
        h = this.height,
        fieldsLength = 0,
        lx = this.locationX,
        ly = this.locationY,
        axisCount, // 要画多少条轴
        stp = this.step, // 轴间距
        offset = 2;

      // 计算 Fields 中数组的总长度，用以计算绘图的轴次。
      for (var f = 0;f < this.fields.length;f++){
        fieldsLength = fieldsLength + this.fields[f].length;
      }

      // 计算要画多少条轴，如果除不尽只取其前一条。
      axisCount = Math.ceil(fieldsLength / this.interval)-1;

      ctx.beginPath();

      if (!this.isDrawAxis) {
        // 不需要显示轴的刻度线
        return;
      }

      if (this.isHorizontal) {
        if (this.resizeDimensions){
          h = this.resizeDimensions.height;
        }
        // 水平轴线
        for (var i = 0;i < axisCount;i++) {
            if(this.lineType=="dash"){//虚线轴
                fabric.util.drawDashedLine(ctx, lx + (i * stp * this.interval), ly, lx + (i * stp * this.interval), h - ly, [3,2]);
            }else{//实线轴
                ctx.moveTo(lx + (i * stp * this.interval),ly);
                ctx.lineTo(lx + (i * stp * this.interval),h - ly);
            }
        }
      } else {
        if (this.resizeDimensions){
          w = this.resizeDimensions.width;
        }
        // 垂直轴线
        for (var j = 0;j < axisCount;j++){

            if (lx == 0) { // 此判断可能存在漏洞，当 lx 较接近 0 值时。
              var autoY = (j * stp * this.interval) - 1
              if ((j * stp * this.interval) == (fieldsLength - 1) * this.step){
                autoY = (j * stp * this.interval);
              } else {
                autoY = (j * stp * this.interval) - 1;
              }
             if(this.lineType=="dash"){//虚线轴
                 fabric.util.drawDashedLine(ctx, lx, ly+autoY,w-lx, ly+autoY, [3,2]);
             }else{
                 ctx.moveTo(lx,ly + autoY);
                 ctx.lineTo(w - lx,ly + autoY);
             }

            } else {
              var autoY = (j * stp * this.interval) - 1
              if ((j * stp * this.interval) == (fieldsLength - 1) * this.step){
                autoY = (j * stp * this.interval);
              } else {
                autoY = (j * stp * this.interval) - 1;
              }
           if(this.lineType=="dash"){//虚线轴
               fabric.util.drawDashedLine(ctx, w , ly+autoY, 0, ly+autoY, [3,2]);
             }else{
              ctx.moveTo(w,ly + autoY);
              ctx.lineTo(0,ly + autoY);
             }
            }

        }
      }
      ctx.closePath();
      this._renderStroke(ctx);
    },

    /**
     * 
     * 获取当前时间的水平坐标位置，只对水平轴并且是时间类型的起作用，如果时间不在此区域内，则亦返回false
     * 
     */
    getNowXPos: function() {
      if (this.axisType == 'Time') {
        var nt = (new Date()).getTime();
        for (var i = 0; i < this.axisRates.length; i++) {
          var xRate = this.axisRates[i];
          if (xRate.isContainAxisValue(nt)) {
            return this.axisToCoordinate(nt);
          }
        }

      }
      return false;
    },

    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });


})(typeof exports !== 'undefined' ? exports : this);

