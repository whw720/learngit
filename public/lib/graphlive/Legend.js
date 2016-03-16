/*
 *绘图的图例对象定义
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Legend) {
    console.warn('fabric.Legend is already defined');
    return;
  }

  /**
   * Legend class
   * @class fabric.Legend
   * @extends fabric.Object
   * @return {fabric.Legend} thisArg
   */
  fabric.Legend = fabric.util.createClass(fabric.Object, /** @lends fabric.Legend.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: GraphliveConstants.LEGEND,

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
     * GraphliveConstants中定义的类型常量值
     * @type String
     */
    legendType:'',

     /**
     * legentd所属的序列
     * @type Series
     */
    owner:null,
      /**
       *
       * 是否可见
       */
    visible:true,
    /**
     * legentd的标签显示对象
     * @type Series
     */
    mark:'',
    /**
     * legentd的标签显示位置
     * 
     */
    markpos:'top',
     /**
     * legentd的编号
     * @type Series
     */
    legendIndex:0,
    /**
     * legentd所代表的序列值
     * @type Series
     */
    xField:null,
   /**
     * legentd所代表的序列值
     * @type Series
     */
    yField:null,
    /**
     * legentd的唯一标示
     * @type String
     */
    id:'',
    /**
     * legentd的名称
     * @type String
     */
    name:'',
     /**
     * 图例所存在的graphlive编辑器
     */
    graphlive:null,
    /**
     * 图例绑定的水平轴,是Axis定义的对象
     */
    bindXAxis:null,
    /**
     * 图例绑定的垂直轴,是Axis定义的对象
     */
    bindYAxis:null,
    /**
     * 图例的生成模型
     */
    model:null,
    /**
     * 序列的特效透明度
     */
    efAlpha:1,
    /**
     * 序列特效
     */
    ef:false,
    /**
     * 序列特效定时器
     */
    efTimerId:null,
    maxLegendValue:false,//最大图例值
    minLegendValue:false,//最小图例值
    /**
     * 图例是否是辅助产生的
     */
    guide:null,
    /**
     * 图例是否可以被解锁，如果图例初始化
     * 状态为可操作的，则认为是可以被解锁的
     * 否则，认为是不可被解锁的。
     */
    isUnlockable:true,
     /**
     * 图例的文字填充，用于图例由绘制和文字混合表示的
     */
    textFill:null,
    /**
     * 是否显示tip
     */
    showTip:'on',

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };
      this._initStateProperties();
      this.callSuper('initialize', options);
      //this.tipRender=options.tipRender||this.tipRender;
      if(typeof(options.legendTipRender)!="function"){
          this.tipRender=this.tipRender;
      } else{
          this.tipRender=options.legendTipRender;
      }
      this.showTip=options.showTip||'on';
      this.markpos=options.markpos||'top';
      var lt=this.legendType;
      
      this.x = 0;
      this.y = 0;
      this.textFill=null;
      
      // 初始化锁定状态
      if (this.selectable) {
        this.isUnlockable = true;
      } else {
        this.isUnlockable = false;
      }
    },
    /**
     * 锁定图例
     */
    lock:function(){
      if (this.selectable) {
        // 设置图例不可选中，即无法进行操作。
        this.selectable = false;
      }
    },
    /**
     * 解锁图例
     */
    unlock:function(){
      if (!this.selectable && this.isUnlockable) {
        // 设置图例可被选中，即可以进行操作。
        this.selectable = true;
      }
    },
    /**
     * 设置图例的模型
     */
    setModel:function(m){
            this.model = m;
            var bx=this.graphlive.getAxis(m.bindXAxisName),by=this.graphlive.getAxis(m.bindYAxisName),top=m.yField,left=m.xField;
            if(bx) left=bx.axisToCoordinate(left);
            if(by) top=by.axisToCoordinate(top); 
            this.set({
                left: left,
                top: top,
                bindXAxis:bx, 
                bindYAxis: by,
                efAlpha:1,
                efTimerId:null,
                ef:false,
                originX:'center',
                originY:'center'
            });
            this.extData=m.extData;
    },
    /**
     * 获取图例初始化时的JSON
     */
    getModel:function(){
      return this.model;
    },

    /**
     * 获取图例初始化时的JSON
     */
    tipRender:function(legend){
      var disPlayText="时间: "+legend.getTimeLabel();
      var ytext='';
      if(this.owner&&(this.owner.seriesType==GraphliveConstants.ST001)) ytext=this.owner.name;
      var num=Number(legend.yField);
      if(num%1>0){
        if(legend.legendType==GraphliveConstants.TP){
          num=num.toFixed(1);
        }else{
          num=Math.round(num);
        } 
      } 
      if(ytext){
        if(this.bindYAxis){
          disPlayText=disPlayText+"<br>"+ytext+": "+num;
        } else{
          disPlayText=disPlayText+"<br>"+ytext;
        }
      }else{
        if(this.bindYAxis) disPlayText=disPlayText+"<br>"+"数值: "+num;
      }
      return disPlayText;
    },

    /**
     * 获取图例初始化时的JSON
     */
    getTimeLabel:function(){
      var text=this.xField;
       var time = new Date(text);
        var hour = time.getHours();
        if (hour < 10) {
          hour = "0" + hour;
        }
        var minute = time.getMinutes();
        if (minute < 10){
          minute = "0" + minute;
        }
        text = hour + ":" + minute;
      return text;
    },
    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Rect` -specific ones to it
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
     * @private 不同图例的绘制方式
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var rx = this.rx || 0,
          ry = this.ry || 0,
          x = 0,
          y = 0,
          w = this.width,
          h = this.height,
          lt=this.legendType,
          isInPathGroup = this.group && this.group.type !== 'group';

      ctx.beginPath();
      ctx.globalAlpha = isInPathGroup ? (ctx.globalAlpha * this.opacity) : this.opacity;
      if(this.ef) ctx.globalAlpha=this.efAlpha;
      if(!this.visible) ctx.globalAlpha=0;
      //根据不同的类型绘制legentd
      LegendDrawFactory(lt,ctx,this.stroke,1,w,h,x,y);
     },

    /**
     * 重定位序列的标题位置
     */
    relocateMark:function(){
    	var mtop=this.top - this.height-3;
        var mleft=this.left;
        var markpos=this.markpos;
        if(this.legendType==GraphliveConstants.CHAR){
             mtop=this.top-1;
           	 mleft=this.left;
        }else{
           if(markpos=='top') {
           	 mtop=this.top-this.height-3;
           	 mleft=this.left;
           }
           if(markpos=='left'){
           	 mtop=this.top;
           	 mleft=this.left-this.width-2;
           } 
           if(markpos=='right'){
           	 mtop=this.top;
           	 mleft=this.left+this.width+2;
           } 
           if(markpos=='bottom'){
           	 mtop=this.top+this.height+2;
           	 mleft=this.left;
           }
        }
        this.mark.set({left:mleft,top:mtop}).setCoords();
        if(this.graphlive.isBatchRender()) return;
        this.canvas.renderAll();
    },

    /**
     * 被添加到画布后的通知行为
     * 
     */
    addNotify:function(){
       //添加图例标签等
        if(this.mark){
          var m=this.mark,size=12,mt=0;
          if(GraphliveConstants.CHAR_SIZE_15.indexOf(m)>=0){
	          size=15;
	          mt=1;
          }
          this.mark=this.mark+'';
          this.mark=new fabric.Text(this.mark,{
            fontSize:size,left:0,top:0,
            selectable:false,
            fontFamily:'Tahoma',
            originY: 'center',
            originX: 'center'
          });
          this.relocateMark();
          this.canvas.add(this.mark);
          this.mark.ownerLegend=this;
          this.bringToFront();
        }
        
        //添加事件相应
        var legend=this,c=this.canvas;
        var tip=legend.graphlive.getTip();
        //鼠标放置到上面改变成相应的操作样式
        this.on(GraphliveConstants.LEGEND_OVER,function(e){
           if(legend.lockMovementX&&!legend.lockMovementY) c.hoverCursor = c.moveCursor='n-resize';
           if(legend.lockMovementY&&!legend.lockMovementX) c.hoverCursor = c.moveCursor='w-resize';
           if(legend.showTip==='on'){
              if(this.owner&&(this.owner.name==GraphliveConstants.MARK_LINE)) return;
              var disText=legend.tipRender(legend),subt=0;
              if(disText.indexOf("br")==-1) subt=16;
              tip.setPosition({x:legend.left,y:legend.top+subt});
              tip.updateText(disText);
              tip.show();
           }
        });
        //鼠标放置到上面改变成相应的操作样式
        this.on(GraphliveConstants.LEGEND_OUT,function(e){
           if(legend.owner) c.hoverCursor = c.moveCursor='move';
           tip.hide();
        });
        this.on(GraphliveConstants.LEGEND_MOVE,function(e){
           legend.setLocation(legend.left,legend.top);
          if(legend.showTip==='on'){
            if(this.owner&&(this.owner.name==GraphliveConstants.MARK_LINE)) return;
            var disText=legend.tipRender(legend),subt=0;
            if(disText.indexOf("br")==-1) subt=16;
            tip.setPosition({x:legend.left,y:legend.top+subt});
            tip.updateText(legend.tipRender(legend));
          }
        });
        this.on(GraphliveConstants.LEGEND_DOWN,function(e){
           
        });
        //添加轴率改变监听
        if(this.bindXAxis) this.bindXAxis.addRateChangedListeners(this);
        if(this.bindYAxis) this.bindYAxis.addRateChangedListeners(this);
        this.autoLayout();
        this.setLocation(this.left,this.top); //防止图例超过画布范围，2015-01-12
    },
    /**
     * 被移除到画布后的通知行为
     * 
     */
    removeNotify:function(){
       //移除图例标签回收资源等操作
        if(this.mark){
          this.mark.canvas.remove(this.mark);
          this.mark=null;
        }
        if(this.textFill){
          this.textFill.canvas.remove(this.textFill);
          this.textFill=null;
        } 
        //移除轴率监听
        if(this.bindXAxis) this.bindXAxis.removeRateChangedListeners(this);
        if(this.bindYAxis) this.bindYAxis.removeRateChangedListeners(this);
        if(this.owner) this.owner.removeLegend(this);
        this.autoLayout();
    },

    //图例自动布局，只对于避让图例的画布图例有效
   autoLayout:function(){
        if(this.graphlive.isAvoidLegend()){
            var lengends=this.graphlive.getAllLegends();
            //只对Y轴进行处理，X轴不变
            var testLegend=lengends.pop(),flag;
            while(lengends.length>0){
                flag=true;
               for(var i=lengends.length-1;i>=0;i--){
                  if(testLegend==lengends[i]) continue;
                  //两个图例的中心垂直水平距离小于6像素时对当前的检测图例向上偏移使两者的垂直距离有6像素
                  if(Math.abs(testLegend.left-lengends[i].left)<10&&Math.abs(testLegend.top-lengends[i].top)<12){
                      //testLegend.set({top:lengends[i].top-6}).setCoords();
                      testLegend.setAxisLocation(testLegend.xField,lengends[i].top-12);
                      flag=false;
                      break;
                  }
               }
               if(flag) testLegend=lengends.pop();
            }
        }
   },
    /**
     * 向导图例应用
     * 
     */
    guideApply: function() {
      this.guide=null;
      this.stroke=this.owner.stroke;
      this.setAxisLocation(this.xField,this.yField);
    },
    /**
     * 向导图例撤销，恢复到原来的位置
     * 
     */
    guideCancel: function() {
      this.setAxisLocation(this.xField,this.guide);
    },
    /**
     * 设置图例的位置，此处派发图例移动事件
     * 
     */
    setLocation:function(x,y){
       var verifyPoint=this.verifyLocation(x,y);
       if(this.lockMovementY||this.lockMovementX){
          if(this.lockMovementY&&this.bindXAxis) this.xField=this.bindXAxis.coordinateToAxis(verifyPoint.x);
          if(this.lockMovementX&&this.bindYAxis) this.yField=this.bindYAxis.coordinateToAxis(verifyPoint.y);
       }
        //更新图例位置
        this.set({left:verifyPoint.x,top:verifyPoint.y}).setCoords();
        //存在标签时更新标签位置
        if(this.mark){
          // 如果水平未锁定，则更改标签的位置，否则，不更改。
          if (!this.lockMovementX||!this.owner){
            var l=this.left;
            if(this.owner&&this.owner.points) l+=this.owner.points[0].x;
            this.mark.set({left:Math.floor(l)}).setCoords();
          }
          if(this.graphlive.isAvoidLegend()){
              this.mark.set({top:(this.legendType==GraphliveConstants.NO_LENGED?(this.top-1):this.top - 9)}).setCoords();
          }
          this.relocateMark();
        }
        /*
        if(this.textFill){
          var txt=this.textFill.text, ft=verifyPoint.y-2;
            if(txt=='▽'){
                ft=ft+8;

            }
            if(txt=='▲'||txt=='△'){
                ft=ft-8;

            }
          this.textFill.set({left:verifyPoint.x,top:ft}).setCoords();
        }
        */
        if(this.owner&&this.owner.onLegendMoved) this.owner.onLegendMoved(this);
        if(this.graphlive.isBatchRender()) return;
        this.canvas.renderAll();
    },
    /**
     * 校验是否超出最大最小范围，超出返回校验值，否则直接返回
     * 
     */
    verifyLocation:function(x,y){
      //锁定不能水平移动的情况下，进行的是垂直校验，若没有设置则不Y不能超过画布的高,反之亦然
       var ar=this.graphlive.getResizeRate();
       if(this.lockMovementX&&!this.lockMovementY){
          var maxy=this.canvas.height*ar.heightRate-this.height*0.5,miny=this.height*0.5+1;
          //计算出最大最小值
          if(this.maxLegendValue&&this.bindYAxis){
            maxy=this.bindYAxis.axisToCoordinate(this.maxLegendValue);
          }
          if(this.minLegendValue&&this.bindYAxis) {
            miny=this.bindYAxis.axisToCoordinate(this.minLegendValue);
          }
          if(y<=miny) y=miny;
          if(y>maxy&&maxy>=miny) y=maxy;
       }
       if(this.lockMovementY&&!this.lockMovementX){
          var maxx=(this.canvas.width-16)*ar.widthRate+7,minx=7;
          //计算出最大最小值
          if(this.maxLegendValue&&this.bindXAxis){
            maxx=this.bindXAxis.axisToCoordinate(this.maxLegendValue);
          }
          if(this.bindXAxis&&this.legendIndex==0&&this.legendType==GraphliveConstants.GANTT_STOP
              &&this.owner){
              var otherLegend=this.owner.legends[1];
              if(otherLegend.legendType==GraphliveConstants.GANTT_RUN){
                  maxx=this.bindXAxis.axisToCoordinate(otherLegend.xField);
              }
          }
          if(this.minLegendValue&&this.bindXAxis) {
            minx=this.bindXAxis.axisToCoordinate(this.minLegendValue);
          }
          if(x<=minx) x=minx;
          if(x>=maxx&&maxx>=minx) x=maxx;
       }
       return {x:x,y:y};
    },
    /**
     * 绘图区轴率改变后通知事件，在此处根据图例中的业务值重新计算图例的location，并设置
     */
    axisRateChanged:function(axis){
      //轴率更新重新定位图例的位置
      var ar=this.graphlive.getResizeRate();
      if(axis==this.bindXAxis&&ar.widthRate!=1){
        var left=this.bindXAxis.axisToCoordinate(this.xField);
        this.setLocation(left,this.top);
        if (this.graphlive.getIsScaleLegend()){
          this.width = this.width * ar.widthRate;
        }
      }
      if(axis==this.bindYAxis&&ar.heightRate!=1){
        var top=this.bindYAxis.axisToCoordinate(this.yField);
        this.setLocation(this.left,top);
        if (this.graphlive.getIsScaleLegend()){
          this.height = this.height * ar.heightRate;
        }
      }
    },
    /**
     * 设置图例的轴坐标系非空间坐标系，参数是xField 代表水平轴值，yField代表垂直轴值
     */
    setAxisLocation:function(xField,yField){
       var left=xField,top=yField;
       if(this.bindXAxis) left=this.bindXAxis.axisToCoordinate(left);
       if(this.bindYAxis) top=this.bindYAxis.axisToCoordinate(top);
       this.setLocation(left,top);
    },
    /**
     * 设置序列所存在的graphlive编辑器
     */
    setGraphlive:function(gl){
      this.graphlive=gl;
    },
    /**
     * 获取图例所存在的graphlive编辑器
     */
    getGraphlive:function(){
      return this.graphlive;
    },
      /**
       * 设置图例的最小值
       */
      setMinValue:function(min){
          this.minLegendValue=min;
      },
      /**
       * 设置图例的最大值
       */
      setMaxValue:function(max){
           this.maxLegendValue=max;
      },


    /**
     * @private 图例的边框绘制，当前需求无要求出现边框
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _renderDashedStroke: function(ctx) {
     var x = -this.width/2,
         y = -this.height/2,
         w = this.width,
         h = this.height;

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, x, y, x+w, y, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x+w, y, x+w, y+h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x+w, y+h, x, y+h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x, y+h, x, y, this.strokeDashArray);
      ctx.closePath();
    },

    /**
     * 开始淡入淡出效果
     */
    startBreath:function(){
            if(this.efTimerId) this.endBreath();
            this.ef='down';
            var sw=this.ef,s=this;
            this.efTimerId = setInterval(function() {
                if(sw=='up') {
                    s.efAlpha=s.efAlpha+0.1;
                    if(s.efAlpha>=1){
                        sw='down';
                    } 
                }
                if(sw=='down'){
                    s.efAlpha=s.efAlpha-0.1;
                    if(s.efAlpha<=0.2){
                        sw='up';
                    } 
                }
                if(s.graphlive.isBatchRender()) return;
                s.canvas.renderAll();
            }, 100);
    },

    /**
     * 结束淡入淡出效果
     */
    endBreath:function(){
        if(this.efTimerId){
          this.ef=false;
          this.efAlpha=1;
          clearInterval(this.efTimerId);
          if(this.graphlive.isBatchRender()) return;
          this.canvas.renderAll();
        } 
    },

      /**
       * 隐藏图例
       */
      hide: function() {
          this.visible=false;
          if(this.mark){
          	this.mark.setOpacity(0);
          }
          if(this.graphlive.isBatchRender()) return;
          this.canvas.renderAll();
      },
      /**
       * 显示图例
       */
      show: function() {
          this.visible=true;
          if(this.mark){
          	this.mark.setOpacity(1);
          }
          if(this.graphlive.isBatchRender()) return;
          this.canvas.renderAll();
      }

  });

  
})(typeof exports !== 'undefined' ? exports : this);
