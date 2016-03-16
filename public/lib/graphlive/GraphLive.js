/*
 *绘图编辑器
 */
 function GraphLive(conf){
 	var conf=conf||{},
 	    gridCanvas=null,//网格及轴线在此层，fabric.Canvas对象
 	    seriesCanvas=null,//序列线在此层 fabric.Canvas对象
        legendsCanvas=null,//图列在此层 fabric.Canvas 对象
        xAxis=[],//横轴，是Axis对象
        yAxis=[],//纵轴，是Axis对象
        childs=[],//编辑器中的子元件
        resizeListener=[],//编辑器更改大小后监听者
        dimensions=null,//编辑器的尺寸，为Dimensions对象
        timeLine=null,
        gridRowCount=0, // 网格初始行数
        gridColumnCount=0, // 网格初始列数
        gridCell = {width:13,height:21}, // 网格的单个格子的宽高 gridCell.width 默认 13 gridCell.height 默认 21
        guidesEditor=[],
        isScaleLegend=false, // 图例大小是否跟随画布缩放
        locked=false, // 是否锁定
        noTip=false,//是否显示tip
        tip=null,flagTip=null,//图例上的tip对象
        topExtend=false,//向上扩展，
        legendAvoid=false,//添加图例时进行避让避免重叠
        batchRender=false,//批量渲染标注
        startFlag=null,endFlag=null,buttonDown=false,inDrag=false,dragObject={},guideFlag=true,lineFlag=null,//对于拖拽派发出去的对象
        resizeRate=new ResizeRate(1,1);//缩放比率，即当前绘图编辑器的宽高有初始化绘图宽高的比值
    /**
     * 
     * 初始化绘图编辑器，创建出网格层、序列层、图例层、创建轴、以及初始化存在的序列等
     */
    this.initialize=function(){
      // 初始化原始单元格宽高
      gridCell = {width:conf.grid.gridX,height:conf.grid.gridY};
      topExtend=0;
      if(conf.topExtend) topExtend=conf.topExtend;
      if(conf.legendAvoid) legendAvoid=conf.legendAvoid;
      if(conf.hasTip===false) noTip=true;
      guideFlag=conf.guideFlag;
      // 初始化画布原始大小
      dimensions = new Dimensions(conf.width,conf.height);
      // 初始化网格行数和列数
      this.setGridHVCount();
      // 生成 DIV 和 Cavas
      this.initializeContainer(dimensions);
      // 创建 Canvas
      this.creatCanvas();
      // 创建绘图
      this.initializeConfig();

      this.creatComplete();
    };

     /**
      *        批量渲染开始
      **/
     this.batchRenderStart = function(){
         batchRender=true;
         seriesCanvas.renderOnAddRemove=false;
         legendsCanvas.renderOnAddRemove=false;
     }

     /**
      *        批量渲染结束
      **/
     this.batchRenderEnd = function(){
         batchRender=false;
         seriesCanvas.renderOnAddRemove=true;
         legendsCanvas.renderOnAddRemove=true;
         seriesCanvas.renderAll();
         legendsCanvas.renderAll();
     }
     /**
      *    是否批量渲染
      **/
     this.isBatchRender = function(){
         return batchRender;
     }
    /**
     * 初始化计算网格的行数和列数
     */
    this.setGridHVCount = function(){
      // 初始化网格列数
      gridColumnCount = Math.floor(conf.width / conf.grid.gridX);
      gridRowCount = Math.floor(conf.height / conf.grid.gridY);
    };

    /**
     * 返回单个单元格
     */
    this.getGridCell = function(){
      return gridCell;
    }

    /**
     * 返回网格行数列数
     */
    this.getGridCount = function(){
      return {xCount:gridColumnCount,yCount:gridRowCount};
    }

    /**
     * 设置是否图例跟随画布的缩放而改变大小
     */
    this.setIsScaleLegend = function(isScale) {
      isScaleLegend = isScale;
    }

    /**
     * 获取是否图例跟随画布的缩放而改变大小
     */
    this.getIsScaleLegend = function() {
      return isScaleLegend;
    }

    /**
     *
     * 触发编辑器改变，例如：Resize
     */
    this.fireResizeChange = function(){
      
      for (var i = 0; i < resizeListener.length; i++) {
        resizeListener[i].resizeChanged(this);
      };
      /*
      this.changeContainer(this.getDimensions());
      gridCanvas.setDimensions(this.getDimensions());
      seriesCanvas.setDimensions(this.getDimensions());
      legendsCanvas.setDimensions(this.getDimensions());
      */
      var od=this.getDimensions(),exh=0;
      if(topExtend) exh=topExtend;
      var nd={width:od.width+16,height:od.height+exh};
      this.changeContainer(this.getDimensions());
      gridCanvas.setDimensions(nd);
      seriesCanvas.setDimensions(nd);
      legendsCanvas.setDimensions(nd);
    };

    /**
     * 根据对象类型从指定canvas中查对象并返回
     */
    this.getObjectByType = function(canvas,type){
      if (!canvas||!type){
        return null;
      }
      var gtms = canvas.getObjects();
      var returnObj = new Array();
      for (var i = 0;i < gtms.length;i++){
        var obj = canvas.item(i);
        if (obj.get("type") === type){
          returnObj.push(obj);
        }
      }
      return returnObj;
    };

    /**
     *
     * 修改绘图容器大小
     */
    this.changeContainer = function(d){
      // 修改网格层 //
      var canvas1 = document.getElementById(conf.renderTo + '_gridCanvas');
      // 修改图列层 //
      var canvas2 = document.getElementById(conf.renderTo + '_seriesCanvas');
      // 修改序列线层 //
      var canvas3 = document.getElementById(conf.renderTo + '_legendsCanvas');
            // 指定 Canvas 的 宽度
      canvas1.setAttribute("width",d.width+16);
      canvas2.setAttribute("width",d.width+16);
      canvas3.setAttribute("width",d.width+16);
      // 指定 Canvas 的 高度
      if(topExtend){
        canvas1.setAttribute("height",d.height+topExtend);
        canvas2.setAttribute("height",d.height+topExtend);
        canvas3.setAttribute("height",d.height+topExtend);
      }else{
        canvas1.setAttribute("height",d.height);
        canvas2.setAttribute("height",d.height);
        canvas3.setAttribute("height",d.height);
      }
    };

    /**
     *
     * 初始化原始容器
     */
    this.initializeContainer=function(d){
      // 获取绘图容器
      var panel = document.getElementById(conf.renderTo);
      // 创建 DIV
      var div1 = document.createElement("div");
      var div2 = document.createElement("div");
      var div3 = document.createElement("div");
      var tipDiv = document.createElement("div");
      var tipText=document.createElement("div");
      // DIV 指定样式
      div1.className = "gridCanvas";
      div2.className = "seriesCanvas";
      div3.className = "legendsCanvas";
      tipDiv.className="graphliveTipContainer";
      tipText.className="graphliveTipText";
      // 设置 DIV 层级关系
      div1.appendChild(div2);
      div2.appendChild(div3);
      tipDiv.appendChild(tipText);
      div3.appendChild(tipDiv);
      tipDiv.setAttribute("id",conf.renderTo + "_tip");
      tip=tipDiv;
      tipDiv.style.display="none";
      tip.setPosition=function(pos){
        tipDiv.style.top=(pos.y-70)+"px";
        tipDiv.style.left=(pos.x-42)+"px";
      };
      tip.hide=function(){
        tipDiv.style.display="none";
      };
      tip.show=function(){
        tipDiv.style.display=(noTip?"none":"block");
      };
      tip.updateText=function(s){
        //var w=s.length*9;
        //if(s.indexOf("br")!=-1) w=w*0.5;
        tipText.innerHTML=s;
       // tipDiv.style.width=w+"px";
        //tipText.style.width=w+"px";
      };
      tip.isHide=function(){
        return tipDiv.style.display=="none";
      }
      if(guideFlag){
          var flagTipDiv = document.createElement("div");
          var flagTipText=document.createElement("div");
          flagTipDiv.className="graphliveTipContainer";
          flagTipText.className="graphliveTipText";

          flagTipDiv.appendChild(flagTipText);
          div3.appendChild(flagTipDiv);
          flagTipDiv.setAttribute("id",conf.renderTo + "_flagTipDiv");
          flagTip=flagTipDiv;
          flagTipDiv.style.display="none";
          flagTip.setPosition=function(pos){
              flagTipDiv.style.top=(pos.y-70)+"px";
              flagTipDiv.style.left=(pos.x-42)+"px";
          };
          flagTip.hide=function(){
              flagTipDiv.style.display="none";
          };
          flagTip.show=function(){
              flagTipDiv.style.display="block";
          };
          flagTip.updateText=function(s){
              flagTipText.innerHTML=s;
          };
          flagTip.isHide=function(){
              return flagTipDiv.style.display=="none";
          }
      }
      // 创建 Canvas 
      var canvas1 = document.createElement("canvas");
      var canvas2 = document.createElement("canvas");
      var canvas3 = document.createElement("canvas");
      // 指定 Canvas 的 ID
      canvas1.setAttribute("id",conf.renderTo + "_gridCanvas");
      canvas2.setAttribute("id",conf.renderTo + "_seriesCanvas");
      canvas3.setAttribute("id",conf.renderTo + "_legendsCanvas");
      // 指定 Canvas 的 宽度
      canvas1.setAttribute("width",d.width+16);
      canvas2.setAttribute("width",d.width+16);
      canvas3.setAttribute("width",d.width+16);
      
      // 设置 DIV 和 Canvas 的层级关系
      if(topExtend){
        // 指定 Canvas 的 高度
        canvas1.setAttribute("height",d.height+topExtend);
        canvas2.setAttribute("height",d.height+topExtend);
        canvas3.setAttribute("height",d.height+topExtend);
        div1.setAttribute("style","margin-left:-8px;margin-top:"+(0-topExtend)+"px");
        //div1.setAttribute("style","margin-left:-8px;margin-top:"+(0-topExtend)+"px");
        //div1.setAttribute("style","margin-left:-8px;margin-top:"+(0-topExtend)+"px");
      }else{
        // 指定 Canvas 的 高度
        canvas1.setAttribute("height",d.height);
        canvas2.setAttribute("height",d.height);
        canvas3.setAttribute("height",d.height);
        div1.setAttribute("style","margin-left:-8px");
        //canvas2.setAttribute("style","margin-left:-8px");
        //canvas3.setAttribute("style","margin-left:-8px");
      }
      div1.appendChild(canvas1);
      div2.appendChild(canvas2);
      div3.appendChild(canvas3);
      // 将 DIV 和 Canvas 添加到绘图容器
      panel.appendChild(div1);
      
    };
    /**
     * 
     * 创建所有绘图层
     */
    this.creatCanvas=function(){
      // 初始化网格层 //
      gridCanvas = new fabric.StaticCanvas(conf.renderTo + '_gridCanvas',{

      });
      // 初始化图列层 //
      seriesCanvas = new fabric.StaticCanvas(conf.renderTo + '_seriesCanvas',{
          renderOnAddRemove:false
      });
      // 初始化序列线层 //
      legendsCanvas = new fabric.Canvas(conf.renderTo + '_legendsCanvas',{
        selection:false,renderOnAddRemove:false
      });
    };
    /**
     * 
     * 包装相应层的事件机制
     */
    this.on=function(triggerName,triggerFn){
        legendsCanvas.on(triggerName,triggerFn);
    }
    /**
     * 
     * 包装相应层的事件机制
     */
    this.fire=function(triggerName,event){
        legendsCanvas.fire(triggerName,event);
    }
    /**
     * 根据 Mouse 事件，取得鼠标当前 XY 坐标
     */
    this.getXYByEvent = function(e){
        var x,y;
        // 取得 x 坐标
        if (e.layerX !== null && e.layerX !== 'undefined'){
          x = e.layerX;
        } else if (e.offsetX !== null && e.offsetX !== 'undefined') {
          x = e.offsetX;
        }
        // 取得 y 坐标
        if (e.layerY !== null && e.layerY !== 'undefined'){
          y = e.layerY;
        } else if (e.offsetY !== null && e.offsetY !== 'undefined') {
          y = e.offsetY;
        }
        e.graphLiveX=x,e.graphLiveY=y;
        return {mx:x,my:y};
    }

    /**
     * 
     * 初始化轴以及时间线等依赖于canvas的功能
     */
    this.initializeConfig=function(){
      //配置画布相应事件，主要是图例层，其他两层都为静态层暂时不需要配置事件
      var c=legendsCanvas,that=this;
      //画布增加hove事件
      c.findTarget = (function(originalFn) {
          return function() {
              var target = originalFn.apply(this, arguments);
              if (target) {
                if (this._hoveredTarget !== target) {
                  c.fire('object:over', { target: target });
                  if (this._hoveredTarget) {
                    c.fire('object:out', { target: this._hoveredTarget });
                  }
                  this._hoveredTarget = target;
                }
              }
              else if (this._hoveredTarget) {
                c.fire('object:out', { target: this._hoveredTarget });
                this._hoveredTarget = null;
              }
              return target;
          };
       })(c.findTarget);

      //画布增加扩展事件
      
      c.on('object:over', function(obj) {
        if(flagTip&&!flagTip.isHide()) return;
        var o=obj.target;
        obj.e = {layerX:o.left,layerY:o.top};
        var mxy = that.getXYByEvent(obj.e);
        obj.graphLive=that;
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        // 图例时
        if(o.type==GraphliveConstants.LEGEND) {
          c.fire(GraphliveConstants.LEGEND_OVER,obj);
          o.fire(GraphliveConstants.LEGEND_OVER,obj);
        }
      });

      c.on('object:out', function(obj) {
        if(flagTip&&!flagTip.isHide()) return;
        var t=obj.target;
        obj.e = {layerX:t.left,layerY:t.top};
        var mxy = that.getXYByEvent(obj.e);
        obj.graphLive=that;
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        // 图例时
        if(t.type==GraphliveConstants.LEGEND) {
          c.fire(GraphliveConstants.LEGEND_OUT,obj);
          t.fire(GraphliveConstants.LEGEND_OUT,obj);
        }
      });

      c.on('mouse:down', function(obj) {
        var o=obj.target;
        var mxy = that.getXYByEvent(obj.e);
        obj.graphLive=that;
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});

        // 图例时
        if(o&&o.type==GraphliveConstants.LEGEND) {
            c.fire(GraphliveConstants.LEGEND_DOWN,obj);
        }
        c.fire(GraphliveConstants.BUTTON_DOWN,obj);
      });

      c.on('mouse:up', function(obj) {
        var t=obj.target;
        var mxy = that.getXYByEvent(obj.e);
        obj.graphLive=that;
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        if(guideFlag&&buttonDown){
          buttonDown=false;
          if(inDrag){
              dragObject.endLocation={x:mxy.mx,y:dragObject.startLocation.y};
              var endAxisValue=that.coordinateToAllAxis(dragObject.endLocation);
              if(dragObject.startLocation.x>dragObject.endLocation.x){
                  dragObject.endAxisValues=dragObject.startAxisValues;
                  dragObject.startAxisValues=endAxisValue;
              }else{
                  dragObject.endAxisValues=endAxisValue;
              }
              c.fire(GraphliveConstants.DND,dragObject);
          }
          that.eraseFlag();
        }
        // 图例时
        if(t&&t.type==GraphliveConstants.LEGEND) {
          //if(obj.e.target.tagName!='canvas'&&obj.e.target.tagName!='CANVAS'){
              obj.axisValues=that.coordinateToAllAxis({x: t.left,y: t.top});
          //}
          c.fire(GraphliveConstants.LEGEND_UP,obj);
          if(t.guide) c.fire(GraphliveConstants.GUIDE_UP,obj);
        }
        c.fire(GraphliveConstants.BUTTON_UP,obj);
      });
       //画布上的图形移动事件派发
      c.on('object:moving', function(obj) {
        var t=obj.target;
        obj.e = {layerX:t.left,layerY:t.top};
        var mxy = that.getXYByEvent(obj.e);
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        obj.graphLive=that;
        if(t.type==GraphliveConstants.LEGEND){
           if(t.lockMovementY&&t.lockMovementX) return;
           t.fire(GraphliveConstants.LEGEND_MOVE,obj);
           obj.axisValues=that.coordinateToAllAxis({x:t.left,y: t.top});
           c.fire(GraphliveConstants.LEGEND_MOVE,obj);
        }
        if(t.shadowShape){
           var bbr=t.shadowShape;
           bbr.set({left:t.left,top:t.top,width:t.width*t.scaleX,height:t.height*t.scaleY,angle:t.angle}).setCoords();
        }
        //批量拖动坐标问题带以后处理暂时不支持批量拖动
        /*
        if((t instanceof fabric.Group)&&t.getObjects()){
          var objs=t.getObjects();
          for (var i = 0; i < objs.length; i++) {
            objs[i].setCoords();
            objs[i].fire(GraphliveConstants.LEGEND_MOVE,obj);
          };
        }
        */
      });
      //鼠标在画布上移动事件派发
      c.on('mouse:move', function(obj) {
        var mxy = that.getXYByEvent(obj.e);
        if(mxy.mx<6) return;
        obj.graphLive=that;
        obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        if(buttonDown&&(obj.e.target.tagName=='canvas'||obj.e.target.tagName=='CANVAS')){
            if(Math.abs(mxy.mx-dragObject.startLocation.x)>1){
                inDrag=true;
                tip.show();
                lineFlag.set({x1:dragObject.startLocation.x,y1:dragObject.startLocation.y,x2:mxy.mx,y2:dragObject.startLocation.y,visible:true});
                endFlag.set({left:mxy.mx,top:dragObject.startLocation.y,visible:true});
                flagTip.setPosition({x:mxy.mx,y:(Math.abs(dragObject.startLocation.x-mxy.mx)>73?dragObject.startLocation.y+22:dragObject.startLocation.y-10)});
                var tm="到",sm="从";
                if(dragObject.startLocation.x>mxy.mx){
                    tm="从";
                    sm="到";
                }
                flagTip.updateText(tm+"："+translateTimeToText(obj.axisValues.H0));
                tip.updateText(sm+"："+translateTimeToText(dragObject.startAxisValues.H0));
                flagTip.show();
                endFlag.canvas.renderAll();
            }
        }
        c.fire(GraphliveConstants.MOUSE_MOVE,obj);
      });

      fabric.util.addListener(c.upperCanvasEl,"mousedown", function(e){
         if(e.button==2||e.button==3){//右键
             var obj={};
             var mxy = that.getXYByEvent(e);
             obj.graphLive=that;
             obj.axisValues=that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
             //增加拖拽
             if(guideFlag){
                 buttonDown=true;
                 dragObject.startLocation={x:mxy.mx,y:mxy.my};
                 dragObject.startAxisValues=obj.axisValues;
                 startFlag.set({left:dragObject.startLocation.x,top:dragObject.startLocation.y,visible:true});
                 tip.setPosition({x:mxy.mx,y:mxy.my+22});
                 tip.updateText("从："+translateTimeToText(obj.axisValues.H0));
                 tip.show();
                 startFlag.canvas.renderAll();
             }
              c.fire(GraphliveConstants.RIGHTCLICK,e);
         }
      });
      fabric.util.addListener(c.upperCanvasEl, GraphliveConstants.DBLCLICK, function(e){
        if(locked) return;
        var mxy = that.getXYByEvent(e);
        e.graphLive=that;
        //获取双击的坐标转换为所有轴对应的值的对象
        e.axisValues= that.coordinateToAllAxis({x:mxy.mx,y:mxy.my});
        var target=c.findTarget(e);
        if(target&&target.type=='text'){
            if(target.ownerLegend) target=target.ownerLegend;
        }
        if(target&&target.type==GraphliveConstants.LEGEND){//双击图例时不派发双击画布事件
          e.legend=target;
          c.fire(GraphliveConstants.LEGEND_DB_CLICK,e);
          return;
        }else if(!target){
          //console.log("查找序列线");
          var p={x:mxy.mx,y:mxy.my};
          var as=that.getAllSeries();
          for (var i = 0; i < as.length; i++) {
            var s=as[i];
            if(!(s instanceof fabric.GanttSeries)) continue;
            var points=s.points;
            //如果不在点集的最小矩形内，直接进行下一条
            var minx=maxx=points[0].x,miny=maxy=points[0].y;
            for (var k = 0; k < points.length; k++) {
              var tp=points[k];
              if(tp.x<minx) minx=tp.x;
              if(tp.y<miny) miny=tp.y;
              if(tp.x>maxx) maxx=tp.x;
              if(tp.y>maxy) maxy=tp.y;
            };
            //处理在一天水平或者垂直线上不容易选中问题
            if((maxx-minx<7)) {
              minx=minx-3;
              maxx=maxx+3;
            }
            if((maxy-miny<7)) {
              miny=miny-3;
              maxy=maxy+3;
            }
            if(p.x>=minx&&p.x<=maxx&&p.y>=miny&&p.y<=maxy){
              for (var j = 1; j < points.length; j++) {
                var pe=points[j],ps=points[j-1];
                var a=Math.pow( (pe.y-ps.y)*p.x-(pe.x-ps.x)*p.y+ps.y*pe.x-pe.y*ps.x  ,2);
                var b=Math.pow((pe.y-ps.y),2)+Math.pow((pe.x-ps.x),2);
                if(36*b>=a){//找到线便停止并派发序列被点击事件
                  target=s;
                  e.series=e.target=target;
                  c.fire(GraphliveConstants.SERIES_DB_CLICK,e);
                  return;
                }
              };
            }
          };
        }

       c.fire(GraphliveConstants.DBLCLICK,e);

      });
      //解决缩放线变宽问题，方案是为缩放对象增加一个"影子"对象
      c.on('object:scaling', function(e) {
        var o=e.target;
        e.graphLive=that;
        if(o.shadowShape){
           var bbr=o.shadowShape;
           bbr.set({left:o.left,top:o.top,width:o.width*o.scaleX,height:o.height*o.scaleY,angle:o.angle}).setCoords();
        }
      });

      c.on('object:rotating', function(e) {
        var o=e.target;
        e.graphLive=that;
        if(o.shadowShape){
           var bbr=o.shadowShape;
           bbr.set({left:o.left,top:o.top,width:o.width*o.scaleX,height:o.height*o.scaleY,angle:o.angle}).setCoords();
        }
      });


    };
    /**
     * 
     * 绘图编辑器，创建完成后通知，显示初始化的序列等
     */
    this.creatComplete=function(){
      this.batchRenderStart();
      // 初始化网格
      var mt=0;
      if(topExtend) mt=topExtend;
      if(conf.grid){
	      var grid = new fabric.Grid({
	          left: 7,
	          top: mt,
	          width:conf.width,
	          height:conf.height,
	          isBorder:false,
	          opacity: 0.7,
	          gridX:conf.grid.gridX,//水平间距，以像素为单位
	          gridY:conf.grid.gridY, //垂直间距，以像素为单位
	          hasVertical:conf.grid.hasVertical,//是否有垂直网格线
	          hasHorizontal:conf.grid.hasHorizontal,//是否有水平网格线
	          lineType:conf.grid.lineType,//网格线的类型 ,支持虚线(dash)以及实线(solid)
	          customDraw:conf.grid.customDraw,
	          stroke:conf.grid.color//网格线的颜色
	      });
	      gridCanvas.add(grid);
	      this.addResizeListener(grid);
      }
      // 初始化轴线
      if(conf.xAxis){
      for (var i = 0;i < conf.xAxis.length;i++) {
        var axisX = new fabric.Axis({
            left: -conf.width/2,
            top: -conf.height/2+mt,
            width:conf.width,
            height:conf.height,
            stroke:conf.grid.color, //线的颜色
            strokeWidth:conf.xAxis[i].lineWidth||1,
            isHorizontal:true,
            hasBorders:false,
            hasControls:false,
            locationXCount:conf.xAxis[i].locationX/conf.grid.gridX,
            locationYCount:conf.xAxis[i].locationY/conf.grid.gridY,
            stepCount:conf.xAxis[i].step/conf.grid.gridX,
            axisType: conf.xAxis[i].type,//轴值值为数字，数字是毫秒数，显示轴值的时候需要转换为时间显示
            name: conf.xAxis[i].name,//轴名用于序列绑定
            step: conf.xAxis[i].step,//相邻轴值间隔像素
            interval: conf.xAxis[i].interval,//每多少个轴值显示一次轴标签值
            hasTimeLine:conf.xAxis[i].hasTimeLine,//是否显示时间线
            fields: conf.xAxis[i].fields,//水平轴的轴值数组,单轴率情况下，复合轴率是第二个数组，值一共是61个
            length: conf.xAxis[i].length,//轴长
            isDrawAxis: conf.xAxis[i].drawAxis,//是否绘制轴线
            lineType: conf.xAxis[i].lineType,//轴线绘制类型
            displayLabels: conf.xAxis[i].displayLabels, //是否显示轴的标签
            locationX: conf.xAxis[i].locationX+7, //轴的水平位置
            locationY: conf.xAxis[i].locationY //轴的垂直位置
        });
        gridCanvas.add(axisX);
        xAxis.push(axisX);
        this.addResizeListener(axisX);
      }
    }
	if(conf.yAxis){
      for (var j = 0;j < conf.yAxis.length;j++) {
        var axisY = new fabric.Axis({
            left: -conf.width/2+7,
            top: -conf.height/2+mt,
            width:conf.width,
            height:conf.height,
            stroke:conf.grid.color, //线的颜色
            strokeWidth:conf.yAxis[i].lineWidth||1,
            isHorizontal:false,
            hasBorders:false,
            hasControls:false,
            locationXCount:conf.yAxis[j].locationX/conf.grid.gridX,
            locationYCount:conf.yAxis[j].locationY/conf.grid.gridY,
            stepCount:conf.yAxis[j].step/conf.grid.gridY,
            axisType: conf.yAxis[j].type,//轴值值为数字，数字是毫秒数，显示轴值的时候需要转换为时间显示
            name: conf.yAxis[j].name,//轴名用于序列绑定
            step: conf.yAxis[j].step,//相邻轴值间隔像素
            interval: conf.yAxis[j].interval,//每多少个轴值显示一次轴标签值
            hasTimeLine:conf.yAxis[j].hasTimeLine,//是否显示时间线
            fields: conf.yAxis[j].fields,//水平轴的轴值数组,单轴率情况下，复合轴率是第二个数组，值一共是61个
            length: conf.yAxis[j].length,//轴长
            isDrawAxis: conf.yAxis[j].drawAxis,//是否绘制轴线
            lineType: conf.yAxis[j].lineType,//轴线绘制类型
            displayLabels: conf.yAxis[j].displayLabels, //是否显示轴的标签
            locationX: conf.yAxis[j].locationX, //轴的水平位置
            locationY: conf.yAxis[j].locationY //轴的垂直位置
        });
        gridCanvas.add(axisY);
        yAxis.push(axisY);
        this.addResizeListener(axisY);
      }
  }
      //创建两个辅助红旗，用于快速创建序列
     if(guideFlag){
          //创建红旗及连线
          fabric.Image.fromURL('../../../lib/graphlive/flag.png', function(oImg) {
              startFlag=oImg;
              oImg.set({visible:false,originY: 'bottom',originX: 'left',width:14,height:14});
              seriesCanvas.add(oImg);
          });
          fabric.Image.fromURL('../../../lib/graphlive/flag.png', function(oImg) {
              endFlag=oImg;
              oImg.set({visible:false,originY: 'bottom',originX: 'left',width:14,height:14});
              seriesCanvas.add(oImg);
          });
          lineFlag=new fabric.Line([0,0,0,0], {
              stroke: '#CC0D00',
              strokeWidth: 1,
              visible:false,
              originY: 'top',
              originX: 'center',
              selectable: false
          });
         seriesCanvas.add(lineFlag);
     }
      //根据水平轴是否有时间轴配置项创建时间轴
      this.buildTimeLine();
      //初始化模型中存在的序列
      this.buildSeries();
      this.batchRenderEnd();
    };

    /**
     * 
     * 构建绘图编辑器模型中的序列
     */
    this.buildSeries=function(){
      var seriesModels=conf.serials||[];
      for (var s = 0; s < seriesModels.length; s++) {
           this.addSerial(seriesModels[s]);
      };
    };

    /**
     * 
     * 构建时间线
     */
  this.buildTimeLine = function() {
    if(timeLine) this.removeChild(timeLine);
    if (conf.hasTimeLine) {
       var allAxis = this.getAllAxis(),
        left = -1;
      for (var i = 0; i < allAxis.length; i++) {
        if (allAxis[i].axisType == 'Time') left = allAxis[i].getNowXPos();
      };
      if (left&&left>-1) {
        var now=(new Date()).getTime();
        var timeModel = {
          xField: now,
          stroke: '#2a8dd4',
          strokeWidth: 1,
          yField: 0,
          height: seriesCanvas.height,
          width:1,
          legendType: GraphliveConstants.TIME_LINE,
          lockMovementX: false,
          lockMovementY: true,
          selectable: false
        }
        
        var timeModel=simplemMergeJSON(timeModel, GraphliveConstants.LEGEND_MODEL);
        timeLine=new fabric.AutoRunLegend(timeModel);
        timeLine.setGraphlive(this);
        timeLine.setModel(timeModel);
        timeLine.set({originX:'left',originY:'top'});
        this.addChild(timeLine,seriesCanvas);
      }
    }
  };

    /**
     * 
     * 获取时间轴,没有时间轴时返回null
     */
    this.getTimeLine=function(){
      return timeLine;
    };
    /**
     * 
     * 把坐标转换为坐标轴的数值，返回格式为{轴的名称:轴的值，....}
     */
    this.coordinateToAllAxis=function(point){
        var axisValues = {},
            xvalue = point.x,
            yvalue = point.y;

        for (var i = 0; i < xAxis.length; i++) {
          var tx = xAxis[i];
          axisValues[tx.name] = tx.coordinateToAxis(xvalue);
        };

        for (var i = 0; i < yAxis.length; i++) {
          var ty = yAxis[i];
          axisValues[ty.name] = ty.coordinateToAxis(yvalue);
        };

        return axisValues;
    };

    /**
     * 
     * 添加绘图编辑器调整大小监听者
     */
    this.addResizeListener=function(listener){
       if(resizeListener.indexOf(listener)==-1&&listener.resizeChanged) resizeListener.push(listener);
    };
    //设置编辑器尺寸，缩放,设置后需要对绘图区轴率更新等操作
    this.setDimensions=function(d){
      var isRerender = true;
      if (d.height==dimensions.height&&d.width==dimensions.width){
        isRerender = false;
      }
      if(dimensions&&d&&d.width){
        //绘图编辑器的宽度根据卫生部的标准文件为60列，在非网格整除的像素下，网格线会出现锯齿，因此根据传入的宽度计算非锯齿的宽度。
        gridCell.width=Math.floor(d.width/gridColumnCount);
        resizeRate.widthRate=gridColumnCount*gridCell.width/dimensions.width;
        dimensions.width = gridColumnCount*gridCell.width;
      }
      if(dimensions&&d&&d.height){//高度暂时不进行缩放处理
        gridCell.height=Math.floor(d.height/gridRowCount);
        resizeRate.heightRate=gridRowCount*gridCell.height/dimensions.height;
        dimensions.height = gridRowCount*gridCell.height;
      }
      if (isRerender){
        // 触发编辑器改变
        this.fireResizeChange();
      }
    };
    // 设置/更改网格的
    this.changeGridByCell=function(grid){
      gridColumnCount = grid.columnCount;
      gridRowCount = grid.rowCount;
      var d = new Dimensions(grid.cell.width * grid.columnCount , grid.cell.height * grid.rowCount);
      this.setDimensions(d);
    };
    //获取缩放比率
    this.getResizeRate=function(){
      return resizeRate;
    };
    //获取编辑器尺寸，主要用于缩放
    this.getDimensions=function(){
      return dimensions;
    };
    //获取编辑器中指定名称的轴
    this.getAxis=function(axisName){
      var as=xAxis.concat(yAxis);
      for (var i = 0; i < as.length; i++) {
        var ax = as[i];
        if(ax.name==axisName) return ax;
      };
    return null;
    };
    // 设置指定轴的轴值:1 轴值数组 2 轴名称;
    this.setAxisFields = function(valueArray,axisName){
      var targetAxis = this.getAxis(axisName);
      targetAxis.setAxisFields(valueArray);
      this.buildTimeLine();
    };
    //获取编辑器中所有的轴
    this.getAllAxis=function(){
      return xAxis.concat(yAxis);
    };
    //添加子显示图元，序列及时间轴添加到序列层，图例添加到图例层
    this.addChild = function (child,parent) {
      childs.push(child);
      if (parent) {
        parent.add(child);
      } else {
        if (child instanceof fabric.Series) {
          seriesCanvas.add(child);
        } else {
          legendsCanvas.add(child);
        }
      }

      if (child.addNotify) child.addNotify();
      return child;
    };
    //移除子显示图元,并删除编辑器中的子对象列表
    this.removeChild = function (child) {
      var index=childs.indexOf(child);
      if(index==-1) return;
      childs.splice(index,1);
      child.canvas.remove(child);
      if(child.removeNotify) child.removeNotify();
    };
    //按名称移除子图元
    this.removeChildByName = function(childName){
        for (var i = childs.length-1; i >=0 ; i--) {
          if(childs[i].name==childName) this.removeChild(childs[i]);
        };
    };
    //按ID移除子图元
    this.removeChildById = function(childId){
      for (var i = childs.length-1; i >=0 ; i--) {
          if(childs[i].id==childId) this.removeChild(childs[i]);
        };
    };
    //删除所有的子图元
    this.removeAllChilds = function(){
        for (var i = childs.length-1; i >=0 ; i--) {
          if(childs[i]) this.removeChild(childs[i]);
        };
    };

    //重置绘图编辑器，即清除绘图中的后来操作添加的数据，并再次初始化编辑器
    this.reset = function(){
      this.batchRenderStart();
      this.removeAllChilds();
      this.buildTimeLine();
      this.buildSeries();
      this.batchRenderEnd();
    };
    //获取所有的序列,是绘图组件定义的Series对象非约定的序列JSON模型
    this.getAllSeries = function(){
      var series=[];
      for (var i = 0; i < childs.length; i++) {
        if(childs[i] instanceof fabric.Series) series.push(childs[i]);
      };
      return series;
    };
    //获取所有的图例，是绘图组件定义的Legend对象非约定的图例JSON模型
    this.getAllLegends = function(){
      var legends=[];
      for (var i = 0; i < childs.length; i++) {
        if((childs[i] instanceof fabric.Legend)&&childs[i].legendType!=GraphliveConstants.TIME_LINE) legends.push(childs[i]);
      };
      return legends;
    };
    //设置指定序列的终止时间，主要用于用药进度等gantt类型的序列，不适用于折线类型的序列
    this.setSeriesEndTimeByName = function(seriesName,endTime){
       var gantt=this.getChildByName(seriesName);
       gantt.setSeriesEndTime(endTime);
    };
	//增加序列，serial是序列约定的模型json
    this.addSerial = function(serial){
      var seriesModel=simplemMergeJSON(serial,GraphliveConstants.SERIES_MODEL),series=null;
      if(seriesModel.type=='line') series=new fabric.Series([{x:0,y:0}],seriesModel);
      if(seriesModel.type=='gantt') series=new fabric.GanttSeries([{x:0,y:0}],seriesModel);
      if(series){
        series.setGraphlive(this);
        series.setModel(seriesModel);
        this.addChild(series);
      }
      return series;
    };
    //增加图例，参数是图例约定的模型JSON
    this.addLegend = function(legend){
        var legendModel = simplemMergeJSON(legend, GraphliveConstants.LEGEND_MODEL),
          legend = null;
        if (legendModel.legendType == GraphliveConstants.GANTT_RUN||legendModel.legendType == GraphliveConstants.AUTO_RUN) {
          legend = new fabric.AutoRunLegend(legendModel);
        } else {
          legend = new fabric.Legend(legendModel);
        }
        legend.setGraphlive(this);
        legend.setModel(legendModel);
        this.addChild(legend);
        return legend;
    };
    //获取编辑器中所有的子图元
    this.getAllChilds = function(){
       return childs;
    };
    //获取指定名称的图元
    this.getChildByName = function(sn){
      for (var i = 0; i < childs.length; i++) {
        var s=childs[i];
        if(s.name==sn) return s;
      };
      return null;
    };
    //获取指定ID的序列
    this.getChildById = function(id){
      for (var i = 0; i < childs.length; i++) {
        var s=childs[i];
        if(s.id==id) return s;
      };
      return null;
    };

    //添加注释性显示对象，暂时包括矩形、直线、文字。
  this.addMark = function(mark) {
    var markType = mark.markType,
      left = mark.left,
      top = mark.top,
      markColor=mark.color||'black',
      child = null;
    if (markType == GraphliveConstants.LINE) { //线
      var sl = this.addSerial({
        xField: [left, left + 60], //绑定的水平轴业务值集合 只有序列是line类型的菜有值，甘特(gantt)类型的永远为空数组
        yField: [top, top - 30], //绑定垂直轴业务值集合 序列是line类型的时候存在bind的Y轴时是没个序列值的Y轴轴值，甘特类型的时候是一个垂直Y坐标值
        bindXAxisName: null, //序列水平绑定轴名称，
        bindYAxisName: null, //序列垂直绑定轴名称，
        type: 'line', //序列类型，支持两种渲染方式，一种是甘特图(gantt)类型，另一种是折线图(line)类型
        id: GraphliveConstants.MARK_LINE, //序列的唯一标识
        name: GraphliveConstants.MARK_LINE, //序列的名称
        color:'black'
      });
      for (var i = 0; i < sl.legends.length; i++) {
        var tl=sl.legends[i];
        tl.set({lockMovementX:false,lockMovementY:false});
      };
    } else if (markType == GraphliveConstants.RECT) { //矩形
      child = new fabric.Rect(simplemMergeJSON({
        left: left,
        top: top,
        fill: '',
        opacity: 0,
        width: 75,
         originX:'center',
        originY:'center',
        centeredRotation:true,
        height: 25
      },mark));
      child.shadowShape = new fabric.Rect({
        left: left,
        top: top,
        fill: '',
        centeredRotation:true,
        originX:'center',
        originY:'center',
        stroke: markColor,
        strokeWidth: 1,
        width: 75,
        selectable: false,
        height: 25
      });
    } else if (markType == GraphliveConstants.LABEL) { //文字
      //文字暂时先写死，应该从外界交互传入
      child = new fabric.IText('添加文字', simplemMergeJSON({
        fontSize: 9,
        fontFamily:'Tahoma',
        left: left,
        top: top - 12,
        selectable: true
      },mark));
    }
    if (child) {
      child.set({
        borderColor: '0C71B3',
        cornerColor: '0C71B3',
        cornerSize: 6,
        transparentCorners: false
      });

      if (child.shadowShape) legendsCanvas.add(child.shadowShape);

      child.removeNotify = function() {
        if (child.shadowShape) legendsCanvas.remove(child.shadowShape);
      }
      this.addChild(child);
    }
  };
  //显示绘图编辑器的辅助线，guid为辅助线模型
  this.showGuides = function(guides) {
    for (var i = 0; i < guides.length; i++) {
      var gm = simplemMergeJSON(guides[i], GraphliveConstants.GUIDE_MODEL);
      //存在序列的情况下直接用原序列，不存在的情况下进行创建
      var s = this.getChildByName(gm.seriesName);
      if (!s) { //不存在序列的情况下创建序列
        var sm = {
          bindXAxisName: gm.bindXAxisName,
          bindYAxisName: gm.bindYAxisName,
          type: 'line',
          id: gm.seriesId,
          name: gm.seriesName,
          color: gm.stroke
        }
        s = this.addSerial(sm);
      };
      //开始进行数据插入
      var seriesXField=s.xField,timeField=[],af=s.bindXAxis.fields;
      for (var k = 0; k < af.length; k++) {
         timeField=timeField.concat(af[k]);
      }; 
      for (var n = 0; n < timeField.length; n++) {
        var t=timeField[n],hasInsert=false, sv={xField:t,yField:gm.yField,guide:gm.yField,stroke:'#808080'};
        for (var j = 0; j < seriesXField.length; j++) {
          var st=seriesXField[j];
          if(st>=t) {
            if(st>t) s.insertSeriesValueAt(sv,j);
            hasInsert=true;
            break;
          } 
        };
        if(!hasInsert) s.insertSeriesValueAt(sv,n);
      };

    }
    
  };
  //擦处辅助线,过滤序列中所有的辅助点，生成真正的序列模型
  this.eraseGuides=function(){
    for (var i = 0; i < childs.length; i++) {
      var s=childs[i];
      if(s.removeGuideLegends) s.removeGuideLegends();
    };
  };
  // 锁定
  this.lock = function(){
    locked=true;
    var legends = this.getObjectByType(legendsCanvas,GraphliveConstants.LEGEND);
    //console.log(legends.length);
    for (var i = 0;i < legends.length;i++){
      var leg = legends[i];
      leg.lock();
    }
  };
  // 解锁
  this.unlock = function(){
    var legends = this.getObjectByType(legendsCanvas,GraphliveConstants.LEGEND);
    for (var i = 0;i < legends.length;i++){
      var leg = legends[i];
      leg.unlock();
    }
    locked=false;
  };
  //获取图例的tip
  this.getTip=function(){
    return tip;
  };
  //是否图例避让
  this.isAvoidLegend=function(){
    return legendAvoid;
  };
 //擦除辅助红旗，还原操作状态
  this.eraseFlag=function(){
      inDrag=false;
      buttonDown=false;
      dragObject={};
      tip.hide();
      flagTip.hide();
      lineFlag.set({visible:false});
      startFlag.set({visible:false});
      endFlag.set({visible:false});
      startFlag.canvas.renderAll();
   };
     //添加连接线
  this.addConnectingLine=function(cm){
        var sm = {
             bindXAxisName: cm.bindXAxisName,
             bindYAxisName: cm.bindYAxisName,
             type: 'line',
             id: "connectingLine",
             strokeWidth: 2,
             name: GraphliveConstants.NO_LENGED,
             color: cm.stroke
         }
         var s = this.addSerial(sm);
      var fl={xField:cm.fromXField,yField:cm.fromYField,guide:cm.fromYField,lockMovementY:true,legendType:GraphliveConstants.NO_LENGED},el={xField:cm.toXField,yField:cm.toYField,guide:cm.toYField,lockMovementY:true,legendType:GraphliveConstants.NO_LENGED};
         s.insertSeriesValueAt(fl,0).sendToBack();
         s.insertSeriesValueAt(el,1).sendToBack();
      return s;
     };

 }

 /**
  *简单JSON对象合并，主要用于绘图编辑器默认模型与传入模型合并，生成新的配置模型，两个JSON都存在同名属性时以第一个参数为准，只做一层合并不进行深度合并
  */

  function simplemMergeJSON(mj1,mj2){
    var mergeJson={};
    for(var pro in mj2){
      var v=mj2[pro];
      if(v instanceof Array) v=v.concat();
      mergeJson[pro]=v;
    }
    for(var pro in mj1){
      var v1=mj1[pro];
      if(v1 instanceof Array) v1=v1.concat();
      mergeJson[pro]=v1;
    }
    return mergeJson;
  }
  /**   把毫秒数翻译成时间标签**/
  function translateTimeToText(s){
      var time = new Date(s);
      var hour = time.getHours();
      if (hour < 10) {
          hour = "0" + hour;
      }
      var minute = time.getMinutes();
      if (minute < 10){
          minute = "0" + minute;
      }
     return hour + ":" + minute;;
  }


//自定义绘制开始
function customDraw(canvas,drawModel){
    var ctx = canvas.getContext("2d");
    var lt=drawModel.type,fill=drawModel.fill||'',stroke=drawModel.stroke,strokeWidth=drawModel.strokeWidth||1,w=drawModel.width||8,h=drawModel.height||8,x=drawModel.x||4,y=drawModel.y||4;
    ctx.beginPath();
    LegendDrawFactory(lt,ctx,stroke,strokeWidth,8,8,8,8);
}

  