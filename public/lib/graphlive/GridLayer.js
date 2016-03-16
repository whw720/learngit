/*
 *绘图区背景的虚线网格层定义
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.Grid) {
    console.warn('grid is already defined');
    return;
  };
  
  
  fabric.Grid = fabric.util.createClass(fabric.Rect, {
    //定义类型
    type: GraphliveConstants.GRID,
    //水平间距，以像素为单位
    gridX:   13,
    //垂直间距，以像素为单位
    gridY:   21,
    //是否有垂直网格线
    hasVertical:true,
    //是否有水平网格线
    hasHorizontal:true,
    //网格线的类型 ,支持虚线(dash)以及实线(solid)
    lineType:'dash',
    //Grid单个网格调整大小比率，即当前单个网格宽高调整为当前的多少
    resizeRate:new ResizeRate(1,1),
    // 是否绘制边框
    isBorder:false,
    //自定义绘制模型
    customDraw:null,
    /**
     * Used to specify dash pattern for stroke on this object
     * @type Array
     */
    dashArray: [3,2],
    
    /**
     * 设置调整比率
     */
    setResizeRate:function(rr,gridCell){
       this.resizeRate=rr;
       this.gridX = gridCell.width||this.gridX;
       this.gridY = gridCell.height||this.gridY;
    },

    /**
     * 编辑器大小调整后通知事件
     */
    resizeChanged:function(graphLive){
      this.width = graphLive.getDimensions().width;
      this.height = graphLive.getDimensions().height;
      this.setResizeRate(graphLive.getResizeRate(),graphLive.getGridCell());
    },

    /**
     * @private
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var x = -this.width/2,
          y = -this.height/2 + 1, //处理网格线和左边表格框偏移一像素，王小伟2014-05-30,
          gx = this.gridX,
          gy = this.gridY,
          w = this.width,
          xCount = Math.round(this.width / gx),
          h = this.height,
          yCount = Math.round(this.height / gy);

      ctx.beginPath();
      //绘制边框
      if (this.isBorder){
        ctx.moveTo(x, y);
        ctx.lineTo(w, y);
        ctx.lineTo(w, h);
        ctx.lineTo(x,h);
        ctx.lineTo(x,y);
      }

      // 绘制网格线
      if(this.hasVertical){
        // 处理间距缩放
        for (var i = 1;i < xCount;i++){
          if (this.lineType=='dash'){
            fabric.util.drawDashedLine(ctx, x + (i * gx), y, x + (i * gx), y + (yCount * gy), this.dashArray);
          }else{
            ctx.moveTo(x + (i * gx), y);
            ctx.lineTo(x + (i * gx), y + (yCount * gy));
          }
        }
      }
      if(this.hasHorizontal){
        // 处理间距缩放
       // gx = Math.round(this.gridX * this.resizeRate.widthRate);
        //gy =  Math.round(this.gridY * this.resizeRate.heightRate);
        for (var j = 1;j < yCount;j++){
          if (this.lineType=='dash') {
            fabric.util.drawDashedLine(ctx, x, y + (j * gy) - 1, x + (xCount * gx), y + (j * gy) - 1, this.dashArray);
          }else{
            ctx.moveTo(x, y + (j * gy) - 1);
            ctx.lineTo(x + (xCount * gx), y + (j * gy) - 1);
          }
        }
      }
      ctx.closePath();
      ctx.stroke();
      if(this.customDraw){
          var cd=this.customDraw,rr=this.resizeRate;
          if(cd.VLine){//垂直的线
             var s=cd.VLine.start*rr.widthRate,e=cd.VLine.end*rr.widthRate,st=cd.VLine.step*rr.widthRate,tp=cd.VLine.lineType,lw=cd.VLine.lineWidth||1;
              ctx.beginPath();
              ctx.lineWidth=lw;
              for(var v = s;v <=e;v=v+st){
                 var tx=Math.floor(x + v)+0.5;
                 if (tp=='dash'){
                     fabric.util.drawDashedLine(ctx, tx, y, tx, h/2, this.dashArray);
                 }else{
                     ctx.moveTo(tx, y);
                     ctx.lineTo(tx, h/2);
                 }
             }
              ctx.closePath();
              ctx.stroke();
          }
          if(cd.HLine){//水平的线
              var s=cd.HLine.start*rr.heightRate,e=cd.HLine.end*rr.heightRate,st=cd.HLine.step*rr.heightRate,tp=cd.HLine.lineType,lw=cd.HLine.lineWidth||1;
              ctx.beginPath();
              ctx.lineWidth=lw;
              for(var v = s;v <=e;v=v+st){
                  var ty=Math.floor(y+v)+0.5;
                  if (tp=='dash'){
                      fabric.util.drawDashedLine(ctx, x, ty, w/2, ty, this.dashArray);
                  }else{
                      ctx.moveTo(x, ty);
                      ctx.lineTo(w/2, ty);
                  }
              }
              ctx.closePath();
              ctx.stroke();
          }
          if(cd.DLine){//自定义的点到点的线
              var loa=cd.DLine;
              for(var dl= 0;dl<loa.length;dl++){
                 var lo=loa[dl];
                  var lw=lo.lineWidth||1;
                  ctx.beginPath();
                  ctx.lineWidth=lw;
                  if (lo.lineType=='dash'){
                      fabric.util.drawDashedLine(ctx, x+lo.spx, y + lo.spy, x+lo.epx, y + lo.epy, this.dashArray);
                  }else{
                      ctx.moveTo(x+lo.spx, y + lo.spy);
                      ctx.lineTo(x+lo.epx, y + lo.epy);
                  }
                  ctx.closePath();
                  ctx.stroke();
              }

          }
      }
      //ctx.closePath();
      //ctx.stroke();
      //笔触
     // this._renderStroke(ctx);
    }

  });

})(typeof exports !== 'undefined' ? exports : this);
