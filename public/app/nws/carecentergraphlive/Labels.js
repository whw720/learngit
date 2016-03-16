/**
 * 绘图标签标签
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.TimeLabel = function(config) {

    //时间标签div
    this.timelineDIV = document.getElementById('timelineDIV');
    //滚动时间标签div id
    this.timeBackgroundDivId = "timeBackground";
    //时间标签偏移量
    this.timelineOffsetLeft = 33;
    //画布整体左侧偏移量
    this.canvasOffsetLeft = 13;

    Ext.apply(this, config);
    var proxy = this;


    /**
     * 初始化时间轴标签
     */
    this.time = function (graphliveDemo, canvasDiv){
        //删除原有子对象
        proxy.deleteAllChild(proxy.timelineDIV);
        // 根据轴名称获取对应的轴对象，参数：轴对应的模型配置的 name 名称
        var h0 = graphliveDemo.getAxis('H0');
        // 获取轴对象中显示标签，返回值：包含 AxisLabel 对象的集合
        var timeLabels = h0.getDisplayLabels();
        //取画布div，以保证每次相对坐标一致
        var offsetLeft = proxy.getAbsPoint(canvasDiv).x - 20 + proxy.canvasOffsetLeft;
        if (proxy.isOffset==true) {
            offsetLeft = proxy.getAbsPoint(canvasDiv).x - proxy.timelineOffsetLeft + proxy.X_AXIS_STEP + proxy.canvasOffsetLeft;
        }
        for (var i = 0;i < timeLabels.length;i++){
            // label 为 AxisLabel 对象
            var label = timeLabels[i];
            var span = document.createElement("span");
            span.style.position = "absolute";
            span.style.width = "40px";
            span.style.lineHeight = proxy.TIME_HEIGHT + "px";
            span.style.top = (0) + "px";
            span.style.cursor = "pointer";
            span.title = (new Date(label.getValue())).Format("yyyy-MM-dd hh:mm");
            // getX() 方法返回 Label 标签相对于编辑器左上角的像素值
            span.style.left = label.getX() + offsetLeft + "px";
            // getDisplayText 方法返回要显示的标签内容
            span.innerHTML = label.getDisplayText();
            span.ondblclick = function(event){
//                alert(span.innerText);
            }
            span.onselectstart = function(){
                return false;
            }
            proxy.timelineDIV.appendChild(span);
        }
    }

    /**
     * 初始化时间标签滚动
     **/
    this.scrollTimeLabels = function() {
        var timeTop = proxy.timelineDIV.offsetTop;
        // 添加时间标签浮动背景层
        var timeBackground = document.getElementById(proxy.timeBackgroundDivId);
        if (!timeBackground) {
            var timeBackground = document.createElement("div");
            timeBackground.style.position = "absolute";
            timeBackground.id = "timeBackground";
            timeBackground.className = "no-print transparent_class";
            timeBackground.style.zIndex = 999;
            timeBackground.style.height = proxy.timelineDIV.offsetHeight + "px";
            document.body.appendChild(timeBackground);
        }
        // 时间标签随页面滚动处理
        window.onscroll = function() {
            proxy.moveTimelabels(this.scrollY, timeTop);
        }
    };

    /**
     * 移动时间标签
     **/
    this.moveTimelabels = function(scrollY, timeTop) {
        proxy.scrollY = scrollY;//记录滚动位置，用于手工调用
        var timeBackground = document.getElementById(proxy.timeBackgroundDivId);
        // 时间标签从可视区消失时让其随着页面滚动
        if (scrollY > (timeTop + proxy.timelineDIV.offsetHeight)) {
            var timeLabels = proxy.timelineDIV.children;
            for (var i = 0; i < timeLabels.length; i++) {
                timeLabels[i].style.top = scrollY + 2 + "px";
                timeLabels[i].style.zIndex = 1000;
                if (i == 0) {
                    timeBackground.style.top = scrollY + 0 + "px";
                    timeBackground.style.left = timeLabels[0].offsetLeft + "px";
                    timeBackground.style.width = (timeLabels[timeLabels.length - 1].offsetLeft - timeLabels[0].offsetLeft) + timeLabels[timeLabels.length - 1].offsetWidth + "px";
                }
            }
            // 重置时间标签随页面的滚动
        } else {
            var timeLabels = proxy.timelineDIV.children;
            timeBackground.style.top = -100 + "px";
            for (var i = 0; i < timeLabels.length; i++) {
                timeLabels[i].style.top = 0 + "px";
            }
        }
    };

    /**
     * 初始化血压轴标签
     */
    this.bp = function (graphliveDemo){
        // 根据轴名称获取对应的轴对象，参数：轴对应的模型配置的 name 名称
        var V0 = graphliveDemo.getAxis('V0');
        // 获取轴对象中显示标签，返回值：包含 AxisLabel 对象的集合
        var timeLabels = V0.getDisplayLabels();
        var timelineDIV = document.getElementById('bpDIV');
        var old = timelineDIV.parentNode.parentNode.parentNode.parentNode;
        var offsetLeft = old.offsetLeft + 2;
        var offsetTop = 65;
        for (var i = 0;i < timeLabels.length;i++){
            // label 为 AxisLabel 对象
            var label = timeLabels[i];
            var span = document.createElement("span");
            span.style.position = "absolute";
            span.style.left = offsetLeft + "px";
            // getY() 方法返回 Label 标签相对于编辑器左上角的像素值
            span.style.top = label.getY() + offsetTop + "px";
            // getDisplayText 方法返回要显示的标签内容
            var text = label.getDisplayText();
            if (text >= 10 && text <= 99){
                text = "<span style='visibility: hidden;'>0</span>" + text;
            }
            if (text >= 0 && text <= 9){
                text = "<span style='visibility: hidden;'>00</span>" + text;
            }
            span.innerHTML = text;
            timelineDIV.appendChild(span);
        }
    }

    /**
     * 初始化体温轴标签
     */
    this.tmp = function (graphliveDemo){
        // 根据轴名称获取对应的轴对象，参数：轴对应的模型配置的 name 名称
        var V1 = graphliveDemo.getAxis('V1');
        // 获取轴对象中显示标签，返回值：包含 AxisLabel 对象的集合
        var timeLabels = V1.getDisplayLabels();
        var timelineDIV = document.getElementById('tmpDIV');
        var old = timelineDIV.parentNode.parentNode.parentNode.parentNode;
        var offsetTop = old.offsetTop + 11;
        var offsetLeft = old.offsetLeft + old.offsetWidth - 25;
        for (var i = (timeLabels.length - 1);i >= 0;i--){
            // label 为 AxisLabel 对象
            var label = timeLabels[i];
            var span = document.createElement("span");
            span.style.position = "absolute";
            span.style.left = offsetLeft + "px";
            // getY() 方法返回 Label 标签相对于编辑器左上角的像素值
            span.style.top = label.getY() + offsetTop + "px";
            // getDisplayText 方法返回要显示的标签内容
            span.innerHTML = label.getDisplayText();
            timelineDIV.appendChild(span);
        }
    }

    com.dfsoft.icu.TimeLabel.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.TimeLabel, com.dfsoft.icu.PublicFunction, {

});
