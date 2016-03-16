/*
 *绘图的gannt序列对象定义
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      toFixed = fabric.util.toFixed,
      min = fabric.util.array.min;

  if (fabric.GanttSeries) {
    fabric.warn('fabric.GanttSeries is already defined');
    return;
  }

  /**
   * GanttSeries class
   * @class fabric.GanttSeries
   * @extends fabric.Object
   */
  fabric.GanttSeries = fabric.util.createClass(fabric.Series, /** @lends fabric.GanttSeries.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: GraphliveConstants.GANTTSERIES,
    /**
     * 甘特序列的中间值，用于起点到中间值是静态绘制，中间值到终点是动态前进
     */
    medianValue:false,
    /**
     * 甘特序列的起点值
     */
    startValue:false,
    /**
     * 甘特序列的终点值
     */
    endValue:false,
   
    /**
     * 设置序列停止时间，主要用于存在序列且没有设置终止时间，进行设置终止时间操作
     */
    setSeriesEndTime:function(entTime){
      this.endValue=entTime;
      this.seriesEndNotify();
    },
    /**
     * 序列到达终点后事件派发，用于通知序列上不断前进的legens
     */
    seriesEndNotify:function(){
       var legend=this.legends[1];
       if(this.bindXAxis.coordinateToAxis(legend.left)>=legend.owner.endValue){
            legend.stop();
            legend.setLocation(this.bindXAxis.axisToCoordinate(Math.floor(legend.owner.endValue)),legend.top);
        }
    },

    addNotify:function(){
       //根据甘特图的特性，进行图例创建
       //创建起止点图例
       var s=this.startValue,m=this.medianValue,e=this.endValue,y=this.yField,lh=this.lockHead,le=this.lockEnd;
       var isStill=(m&&e&&((m+10)>=e));
       if(this.seriesType==GraphliveConstants.ST004||this.seriesType==GraphliveConstants.ST003){
        this.set({originX:'center',originY:'center'});
        this.addLegend({xField:s,yField:y,legendIndex:0,legendType:GraphliveConstants.NO_LENGED,lockMovementX:lh,lockMovementY:true});
        this.addLegend({xField:m?m:s,yField:y,legendIndex:1,legendType:isStill?GraphliveConstants.NO_LENGED:GraphliveConstants.AUTO_RUN,lockMovementX:le,lockMovementY:true});
       }else{
        this.addLegend({xField:s,yField:y,legendIndex:0,legendType:GraphliveConstants.GANTT_STOP,lockMovementX:lh,lockMovementY:true});
        this.addLegend({xField:m?m:s,yField:y,legendIndex:1,legendType:isStill?GraphliveConstants.GANTT_STOP:GraphliveConstants.GANTT_RUN,lockMovementX:le,lockMovementY:true});
       }
       //this.updateSeriesPath();
       
       this.callSuper('addNotify', {});
    },
    /**
     * 绘制定制非直线的甘特序列
     */
    _render: function(ctx) {
      if(this.seriesType==GraphliveConstants.ST004){
        if(this.points.length<2) return;
         ctx.beginPath();
        var p1=this.points[0],p2= this.points[1],step=2,flag=1,start=this.points[0].x;
        ctx.moveTo(p1.x, p1.y);
        if(start>p2.x-6){
          ctx.lineTo(start+2, p1.y-4);
          ctx.lineTo(start+4, p1.y+4);
          ctx.lineTo(start+6, p2.y);
        }else{
          while(start<p2.x-step){
          start=start+2;
           ctx.lineTo(start, p1.y-4*flag);
           flag=-flag;
          }
          ctx.lineTo(p2.x, p2.y);
        }
        
        this._renderFill(ctx);
        this._renderStroke(ctx);
      }else{
         this.callSuper('_render', ctx);
      }
      
    },
    

  });

})(typeof exports !== 'undefined' ? exports : this);