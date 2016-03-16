/*
 *绘图的序列对象定义
 */
 (function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      toFixed = fabric.util.toFixed,
      min = fabric.util.array.min;

  if (fabric.Series) {
    fabric.warn('fabric.Series is already defined');
    return;
  }

  /**
   * Series class
   * @class fabric.Series
   * @extends fabric.Object
   */
  fabric.Series = fabric.util.createClass(fabric.Polyline, /** @lends fabric.Series.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: GraphliveConstants.SERIES,
    /**
     * 序列的名字
     */
    name:'',
    /**
     * 序列的标题对象是fabric.Text
     */
    title:[],
    /**
     * 序列的唯一标识
     */
    id:'',
    /**
     * 序列的水平轴值集合
     */
    xField:[],
    /**
     * 序列的垂直轴值集合
     */
    yField:[],
    /**
     * 序列绑定的水平轴,是Axis定义的对象
     */
    bindXAxis:null,
    /**
     * 序列绑定的垂直轴,是Axis定义的对象
     */
    bindYAxis:null,
    /**
     * 序列上的图例
     */
    legends:[],
    /**
     * 序列的原生模型,及描述序列的JSON串
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
      /**
       * 序列是否可见
       */
    visible:true,
    /**
     * 序列所允许的的最大值
     */
    maxSeriesValue:null,
    /**
     * 序列所允许的的最小值
     */
    minSeriesValue:null,
    /**
     * 序列所存在的graphlive编辑器
     */
    graphlive:null,
    //线的显示类型 ,支持虚线(dash)以及实线(solid)
    lineStyle:'solid',
    //线的显示类型 ,支持虚线(dash)以及实线(solid)
    lineHide:false,
    /**
     * 设置序列的模型
     */
    setModel:function(m){
            this.model = m;
            this.set({
                stroke: m.color,
                left: 0,
                top: 0,
                legends:[],
                fill:'',
                selectable: false,
                originX:'left',
                originY:'top',
                efAlpha:1,
                efTimerId:null,
                title:[],
                ef:false,
                bindXAxis: this.graphlive.getAxis(m.bindXAxisName),
                bindYAxis: this.graphlive.getAxis(m.bindYAxisName)
            });
            this.extData=m.extData;
    },

    /**
     * 获取序列初始化时的JSON
     */
    getModel:function(){
      return this.model;
    },
    /**
     * 序列添加后的通知
     */
    addNotify:function(){
            //如果序列已经存在业务值，进行业务图例增加
            var m = this.model;
            if (m.xField.length > 0) {
                for (var i = 0; i < m.xField.length; i++) {
                    var xf = m.xField[i],
                        yf;
                    /*if (this.bindYAxis != null) {
                        yf = m.yField[i];
                    } else {
                        yf = m.yField;
                    }*/
                    if (m.yField instanceof Array) {
                        yf = m.yField[i];
                    } else {
                        yf = m.yField;
                    }
                    this.addLegend({
                        xField: xf,
                        yField: yf,
                        legendTipRender: m.legendTipRender,
						extData:{initialData:{xField: xf,yField: yf}},
                        legendIndex: i
                    });
                };
            }
            //如果序列存在标题，增加标题,添加的标题并不对外暴漏即不存在绘图编辑器的子列表中
            if(m.label && (!(m.label instanceof Array))){
                m.label.position='top';
                m.label=[m.label];
            } 
            if (m.label && m.label.length>0) {
                var titiles=m.label;
                for (var j = 0; j < titiles.length; j++) {
                    var t=titiles[j];
                    if(!t.field) continue;
                    var ttext=new fabric.Text(t.field+'', {
                        fontSize: 9,
                        left: 0,
                        top: 0,
                        fontStyle:'normal',
                        fontFamily:'Tahoma',
                        selectable: true
                    });
                    ttext.pos=t.position;
                    this.canvas.add(ttext);
                    ttext.ownerSeries=this;
                    this.title.push(ttext);
                };
                this.relocateTitle();
            }
            
    },
    /**
     * 重定位序列的标题位置
     */
    relocateTitle:function(){
       var ps = this.points,
                    mx = 0,
                    my = 0;
        if(ps.length<=0) return;
        var sp = ps[0],left=0,top=0,
            ep = ps[ps.length - 1];
            mx = (sp.x + ep.x) * 0.5, my = (sp.y + ep.y) * 0.5;
        for (var i = 0; i < this.title.length; i++) {
            var t=this.title[i];
            if(t.pos=='top'){
                left=mx-t.width*0.5;
                top=my-t.height-2;
            }else if(t.pos=='left'){
                left=sp.x-t.width-2;
                top=my-t.height*0.5;
            }else if(t.pos=='right'){
                left=ep.x+2;
                top=my-t.height*0.5;;
            }else if(t.pos=='botton'){
                left=mx-t.width*0.5;
                top=my+t.height*0.5;
            } 
            t.set({left:left,top:top}).setCoords();
        };
        if(this.graphlive.isBatchRender()) return;
        this.canvas.renderAll();

    },
    /**
     * 删除前调用序列被删除后的通知
     */
    removeNotify:function(){
       if(this.title.length>0){
        for (var i = 0; i < this.title.length; i++) {
            var t=this.title[i];
             t.canvas.remove(t);
        };
       } 
       this.removeAllLegends();
    },
    /**
     * 序列值集合转换为绘图坐标系点集,暂时先不实现，直接取图例中的top，left
     */
    translateToCoordinate:function(){

    },
    /**
     * 获取序列的路径
     */
    getSeriesPath:function(){
        var path=[];
        for (var i = 0; i < this.legends.length; i++) {
            var l=this.legends[i];
            path.push({x:l.left,y:l.top});
        };
        return path;
    },
    /**
     * 为轴上添加图例，返回添加后的图例 seriesValue为SeriesValue对象
     */
    addLegend:function(legendModel){
        var that=this;
        var legendOther={
            legendType:that.legendType,
            bindXAxisName:that.bindXAxis==null?'':that.bindXAxis.name,
            bindYAxisName:that.bindYAxis==null?'':that.bindYAxis.name,
            maxLegendValue:that.maxSeriesValue,
            minLegendValue:that.minSeriesValue,
            stroke:that.stroke,
            opacity:that.opacity,
            lockMovementY:false,
            legendTipRender: that.model.legendTipRender,
            owner:that
        };
        legendModel=simplemMergeJSON(legendModel,legendOther);
        var legend=this.graphlive.addLegend(legendModel);
        //this.legends.push(legend);
        this.legends.splice(legendModel.legendIndex,0,legend);
        this.updateSeriesPath();
        return legend;
    },
    /**
     * 对于存在辅助点的部分进行虚线绘制
     */
    _render: function(ctx) {
      var point;
      if(this.points.length<2||this.lineHide) return;
      ctx.beginPath();
      //分析序列中那些未知的辅助图例，用虚线表示，规则：连续的图例中下一点为辅助图例及上一点为辅助图例则连线为虚线
      var allLegends=this.legends,l;
      if(this.ef) ctx.globalAlpha=this.efAlpha;
      if(!this.visible) ctx.globalAlpha=0;
      ctx.moveTo(allLegends[0].left, allLegends[0].top);
      for (var i = 1; i < allLegends.length; i++) {
          l=allLegends[i], point = this.points[i];
          ctx.beginPath();
          if(this.lineStyle=='dash'||l.guide||(allLegends[i-1]&&allLegends[i-1].guide)){
            ctx.strokeStyle=l.guide?l.stroke:allLegends[i-1].stroke;
            fabric.util.drawDashedLine(ctx, this.points[i-1].x-0.5, this.points[i-1].y-0.5, point.x-0.5, point.y-0.5, [3,2]);
          }else{
            ctx.strokeStyle=this.stroke;
            ctx.moveTo(this.points[i-1].x-0.5, this.points[i-1].y-0.5);
            if((!l.visible)||(!allLegends[i-1].visible)){
               ctx.moveTo(point.x-0.5, point.y-0.5);
            }else{
               ctx.lineTo(point.x-0.5, point.y-0.5);
            }
            if(this.name==GraphliveConstants.MARK_LINE){//绘制末端箭头
                        var toPoint= new fabric.Point(point.x,point.y);
                        var fromPoint= new fabric.Point(this.points[i-1].x,this.points[i-1].y);
                        var vDistance= toPoint.y - fromPoint.y; //起始点垂直距离  
                        var sDistance =toPoint.distanceFrom(fromPoint); //起始点直线距离  

                        var sinValue= vDistance / sDistance; //起始点间的夹角的sin值  

                        /**两点间直线与水平线的角度(弧度)*/
                        var radian= Math.asin(sinValue);
                        /**用于计算三角形顶点与目标点水平距离的夹角(弧度)*/
                        var hRadian= radian - Math.PI / 7;

                        /**用于计算三角形顶点与目标点垂直距离的夹角(弧度)*/
                        var vRadian= radian + Math.PI / 7;
                        /**上顶点与目标点的垂直距离*/
                        var topYDis= 10*Math.sin(vRadian);
                        /**上顶点与目标点的水平距离*/
                        var topXDis=  10*Math.cos(vRadian);
                        /**下顶点与目标点的垂直距离*/
                        var botYDis= 10*Math.sin(hRadian);
                        /**下顶点与目标点的水平距离*/
                        var botXDis= 10*Math.cos(hRadian);

                        /**计算三角形上下顶点坐标*/
                        var topPointX= toPoint.x - topXDis;
                        var topPointY= toPoint.y - topYDis;

                        var botPointX= toPoint.x - botXDis;
                        var botPointY= toPoint.y - botYDis;
                        if (toPoint.x < fromPoint.x) {
                            topPointX = toPoint.x + topXDis;
                            botPointX = toPoint.x + botXDis;
                        }
                        ctx.moveTo(topPointX - 0.5, topPointY - 0.5);
                        ctx.lineTo(point.x - 0.5, point.y - 0.5);
                        ctx.lineTo(botPointX - 0.5, botPointY - 0.5);
            }
          }
          ctx.stroke();
      };
    },
    /**
     * 移除指定legend
     */
    removeLegend:function(legend){
        var index=this.legends.indexOf(legend);
        if(index==-1) return;
        legend.owner=null;
        this.legends.splice(index,1);
        if(this.bindXAxis) this.xField.splice(index,1);
        if(this.bindYAxis&&(this.yField instanceof Array)) this.yField.splice(index,1);
        this.graphlive.removeChild(legend);
        this.updateSeriesPath();
    },
    /**
     * 移除指定legend
     */
    removeAllLegends:function(){
        for (var i = this.legends.length-1; i >=0 ; i--) {
            this.graphlive.removeChild(this.legends[i]);
        };
        this.legends.length=0;
        this.updateSeriesPath();
    },
    /**
     * 在指定位置添加序列值，index不传入默认是最后，返回由值生成后的图例
     */
    insertSeriesValueAt:function(seriesValue,index){
        seriesValue.legendIndex=(index>=0?index:this.legends.length);
        //对插入点进行校验，发现在同一时间已经存在并且插入点是非guide类型的情景进行图例值的覆盖
        if(!seriesValue.guide&&this.name!='connectingLine'){
            var l=this.getLegendByXField(seriesValue.xField);
            if(l){
                l.setAxisLocation(seriesValue.xField,seriesValue.yField);
                 return l;
            } 
        }
        var al= this.addLegend(seriesValue);
        if(this.bindXAxis) this.xField.splice(index,0,seriesValue.xField);
        if(this.bindYAxis) this.yField.splice(index,0,seriesValue.yField);
        //this.updateSeriesPath();
        return al;
    },
    /**
     * 更新序列的路径
     */
    updateSeriesPath:function(){
        var points=this.getSeriesPath();
        if(points.length==0) points=[{x:0,y:0}];
        this.set({points:points});
        if(this.title.length>0){
           this.relocateTitle();
        }
        if(this.graphlive.isBatchRender()) return;
        this.canvas.renderAll();
    },

    /**
     * 设置序列所存在的graphlive编辑器
     */
    setGraphlive:function(gl){
      this.graphlive=gl;
    },    
    /**
     * 获取序列所存在的graphlive编辑器
     */
    getGraphlive:function(){
      return this.graphlive;
    },

    /**
     * 序列上图例移动后事件处理
     */
    onLegendMoved:function(e){
       this.updateSeriesPath();
    },
    /**
     * 设置序列的最小值
     */
    setMinSeriesValue:function(min){
       this.minSeriesValue=min;
       for (var i = 0; i < this.legends.length; i++) {
           this.legends[i].minLegendValue=min;
       };
    },
    /**
     * 设置序列的最大值
     */
    setMaxSeriesValue:function(max){
       this.maxSeriesValue=max;
       for (var i = 0; i < this.legends.length; i++) {
           this.legends[i].maxLegendValue=max;
       };
    },

    /**
     * 移除辅助图例
     */
    removeGuideLegends:function(){
       for (var i = this.legends.length-1; i >=0 ; i--) {
          var g=this.legends[i];
          if(g.guide) this.removeLegend(g);
       };
    },
    /**
     * 获取指定xfield的legend
     */
    getLegendByXField:function(xField){
       for (var i = this.legends.length-1; i >=0 ; i--) {
          var l=this.legends[i];
          if(l.xField==xField) return l;
       };
       return null;
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
                    if(s.efAlpha>=1.1){
                        sw='down';
                    } 
                }
                if(sw=='down'){
                    s.efAlpha=s.efAlpha-0.1;
                    if(s.efAlpha<=0.3){
                        sw='up';
                    } 
                }
                if(s.title.length){
                    for (var i = 0; i < s.title.length; i++) {
                        s.title[i].opacity=s.efAlpha;
                    };
                }
                if(s.graphlive.isBatchRender()) return;
                s.canvas.renderAll();
            }, 100);
    },

    /**
     * 结束淡入淡出效果
     */
        endBreath: function() {
            if (this.efTimerId) {
                this.ef = false;
                this.efAlpha = 1;
                clearInterval(this.efTimerId);
                if (this.title.length) {
                    for (var i = 0; i < this.title.length; i++) {
                        this.title[i].opacity = this.efAlpha;
                    };
                }
                if(this.graphlive.isBatchRender()) return;
                this.canvas.renderAll();
            }
        },
      /**
       * 隐藏序列
       */
      hide: function() {
          this.visible=false;
          if(this.title.length>0){
            for (var i = 0; i < this.title.length; i++) {
                var t=this.title[i];
                 t.setOpacity(0);;
            };
           }
          for (var i = this.legends.length-1; i >=0 ; i--) {
              this.legends[i].hide();
          };
          if(this.graphlive.isBatchRender()) return;
          this.canvas.renderAll();
      },
      /**
       * 显示序列
       */
      show: function() {
          this.visible=true;
          if(this.title.length>0){
            for (var i = 0; i < this.title.length; i++) {
                var t=this.title[i];
                 t.setOpacity(1);;
            };
           }
          for (var i = this.legends.length-1; i >=0 ; i--) {
              this.legends[i].show();
          };
          if(this.graphlive.isBatchRender()) return;
          this.canvas.renderAll();
      }

  });

})(typeof exports !== 'undefined' ? exports : this);