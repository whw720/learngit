/*
 *绘图中根据某种规则可以定时前进的图例对象定义，继承自图例
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.AutoRunLegend) {
    console.warn('fabric.AutoRunLegend is already defined');
    return;
  }

  /**
   * AutoRunLegend class
   * @class fabric.AutoRunLegend
   * @extends fabric.Legend
   * @return {fabric.AutoRunLegend} thisArg
   */
  fabric.AutoRunLegend = fabric.util.createClass(fabric.Legend, /** @lends fabric.AutoRunLegend.prototype */ {

    hasLock:false,
   /**
     * 被添加到画布后的通知行为,增加了添加后便自动前进的功能
     * 
     */
    addNotify:function(){
      //调用父类后增加自动前进定时器
       this.callSuper('addNotify', {});
       this.start();
    },

    /**
     * 自动前进开始
     * 
     */
    start:function(){
      if(this.intervalId){
         this.stop();
         if(this.legendType==GraphliveConstants.GANTT_STOP) this.legendType=GraphliveConstants.GANTT_RUN;
      }
      if(this.legendType==GraphliveConstants.TIME_LINE){//事件轴开始设置颜色为#2a8dd4
          this.stroke='#2a8dd4';
          this.canvas.renderAll();
       }
      var step=1,legend=this,xar=this.bindXAxis.axisRates,xa=this.bindXAxis;
      this.intervalId=setInterval(function(){
        //变更自动前进逻辑，由原来与距离绑定变为与当前时间绑定
        var nowTime=(new Date()).getTime();
        if(legend.owner&&legend.owner.endValue&&nowTime>=legend.owner.endValue){
            legend.stop();
        }
        legend.setAxisLocation(nowTime,legend.yField);
        /*
         //计算当前处于哪个轴率范围中
        var xRate;
        for (var i = 0; i < xar.length; i++) {
             xRate = xar[i];
          if (xRate.isContainCoordinate(legend.left)) {
            step = xRate.getRate()*GraphliveConstants.FREQUENCY;
            break;
          }
        }
        var left=legend.left+step;
        if(legend.owner&&legend.owner.endValue) {
         if(xa.coordinateToAxis(legend.left+step)>=legend.owner.endValue){
            legend.stop();
            legend.setLocation(xa.axisToCoordinate(Math.floor(legend.owner.endValue)),legend.top);
            return;
          }
        }
        legend.setLocation(legend.left+step,legend.top);
        */
      },GraphliveConstants.FREQUENCY);    
      if(this&&this.owner){
        this.startBreath();
        this.owner.startBreath();
      } 
    },
    /**
     * 自动前进停止
     * 
     */
    stop:function(){
       if(this.intervalId) clearInterval(this.intervalId);
       if(this&&this.owner){
        this.endBreath();
        this.owner.endBreath();
       }
       if(this.legendType==GraphliveConstants.GANTT_RUN||this.legendType==GraphliveConstants.AUTO_RUN){//普通前进甘特图派发停止事件
        if(this.legendType==GraphliveConstants.GANTT_RUN&&(!this.hasLock)) this.legendType=GraphliveConstants.GANTT_STOP;
        var legend=this,graphLive=this.getGraphlive();
        graphLive.fire(GraphliveConstants.LEGEND_STOP,{target:legend,graphLive:graphLive});
       }
       if(this.legendType==GraphliveConstants.TIME_LINE){//事件轴停止改变时间线的颜色为红色
          this.stroke='red';
           this.canvas.renderAll();
       } 
    },
    /**
     * 被移除到画布后的通知行为
     * 
     */
    removeNotify:function(){
       //调用父类后，移除自动前进定时器
       this.stop();
       this.callSuper('removeNotify', {});
       
    },
    /**
     * 设置时间线停止到的时间点
     * 
     */
    setTime:function(time){
       var x=this.bindXAxis.axisToCoordinate(time);
       this.set({left:x}).setCoords();
       this.xField=time;
       this.canvas.renderAll();
    },

    /**
     * 锁定图例
     */
    lock:function(){
      this.callSuper('lock', {});
      this.hasLock=true;
      this.stop();
    },
    /**
     * 解锁图例
     */
    unlock:function(){
      this.callSuper('unlock', {});
      this.start();
    }
  });

  
})(typeof exports !== 'undefined' ? exports : this);
