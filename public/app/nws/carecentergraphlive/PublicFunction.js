/**
 * 公共方法
 * @author 王小伟
 */
Ext.namespace('com.dfsoft.icu');

com.dfsoft.icu.PublicFunction = function(config) {

    Ext.apply(this, config);
    var proxy = this;

    //删除所有子节点
    this.deleteAllChild = function(parentObj) {
        var childs = parentObj.childNodes;
        for(var i = childs.length - 1; i >= 0; i--) {
            parentObj.removeChild(childs[i]);
        }
    }

    //得到默认时间数组，供初始化X轴使用，后期根据实际情况进行改动
    this.getDefaultTimeArray = function() {
        if (typeof(proxy.xAxisBeginDate) == "undefined") {
            proxy.xAxisBeginDate = new Date("2014/03/05 00:00:00");
        }
        var date05 = proxy.minuteTo05(proxy.xAxisBeginDate);
        var timeObj = proxy.getTimesByMinuteStep(date05, 1, proxy.X_AXIS_FIELDS_LENGTH);
        return [timeObj.times];
    }

    /**
     * 格式化时间小时分钟，格式：08:39  08:05 。
     **/
    this.getTime = function(date) {
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return hour + ':' + min;
    }

    /**
     * 按照分钟间隔从指定事件往后取得一个时间数组，毫秒单位。ok
     **/
    this.getTimesByMinuteStep = function(date, step, num) {
        //如果页面当前不显示iframe时，会出现计算时间个数错误
        if (num<0) {
            num = 15;
        }
        var arr = new Array(num);
        arr[0] = date.getTime();
        for (var i = 1; i < num+1; i++) {
            date.setMinutes(date.getMinutes() + step);
            arr[i] = date.getTime();
        }
        return {
            times: arr
        };
    }

    /**
     * 小时间隔处理
     **/
    this.timeToHour = function(date) {
        var result = new Date();
        result.setTime(date.getTime());
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);
        result.setTime(result.getTime() + 60 * 60 * 1000);
        return result;
    }

    /**
     * 时间5分钟间隔处理：0--4 为0；5--9为5。 ok
     **/
    this.minuteTo05 = function(date) {
        var result = new Date();
        result.setTime(date.getTime());
        var min = result.getMinutes();
        min = proxy.numTo05(min);
        result.setMinutes(min);
        result.setSeconds(0);
        result.setMilliseconds(0);
        return result;
    }

    /**
     * 时间5分钟间隔处理：0--4 为0；5--9为5。
     **/
    this.minuteTo05ByStr = function minuteTo05ByStr(timeStr) {
        var timeArr = timeStr.split(':');
        var min = proxy.numTo05(parseInt(timeArr[1]));
        if (min < 10) min = '0' + min;
        var time_05 = timeArr[0] + ':' + min;
        return time_05;
    }

    /**
     * 时间5分钟间隔处理：0--4 为0；5--9为5。ok
     **/
    this.numTo05 = function(n) {
        var n1 = n % 10;
        if (n1 >= 0 && n1 < 5) n -= n1;
        else n = n - n1 + 5;
        return n;
    }

    /**
     * 格式化时间字符串分钟，格式：8:39  8:05 。
     **/
    this.formatTime = function(timeStr) {
        var timeArr = timeStr.split(':');
        var min = parseInt(timeArr[1]);
        if (min < 10) min = '0' + min;
        timeStr = timeArr[0] + ':' + min;
        return timeStr;
    }

    /**
     * 把时间字符串（19:08）转换成Date对象，年月日为当前日期，秒和毫秒为0。
     **/
    this.toDate = function(timeStr) {
        var timeArr = timeStr.split(':');
        var hour = parseInt(timeArr[0]);
        var min = parseInt(timeArr[1]);
        var date = new Date();
        date.setHours(hour);
        date.setMinutes(min);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    /**
     * 得到对象绝对位置
     * @param obj
     */
    this.getAbsPoint = function(obj){
        var oRect =  obj.getBoundingClientRect();
        return {
            x: oRect.left,
            y: oRect.top
        }
    }

    com.dfsoft.icu.PublicFunction.superclass.constructor.call(this, {

    });
};

Ext.extend(com.dfsoft.icu.PublicFunction, Ext.Base, {

});
