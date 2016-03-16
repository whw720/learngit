//心电图绘制组件，隶属于GraphLive组件包。
var GraphLiveECG = function (opts) {
	var z = 0;										//当前绘制进度
	var x = 0;										//当前绘制进度的X轴坐标			
	var ecg = 0;									//当前绘制的心电图数值
	var ecgOld = 0;									//上一次绘制的心电图数值
	var hr = opts.data.getHR() || 80;				//心率，默认80
	var clearWidth = opts.style.clearWidth || 40;	//擦除区宽度，默认40
	var step = opts.step || 4;						//绘制步长，默认4
	//绘制心电图（私有方法）
	var draw = function() {
		var canvas = document.getElementById(opts.element);
		var p = opts.data.getP();
		var qrs = opts.data.getQRS();
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			//判断当前绘制进度是否超出心率期间，如是，则认为当前波形周期绘制完成，重新获取心率。
			if (z > hr - step) {
				z = 0;
				hr = opts.data.getHR();
			}
			ctx.beginPath();
			//计算波形显示位置
			var position = 0;
			if(opts.position && opts.position === 'bottom') {
				position = canvas.height;
			} else {
				position = canvas.height / 2 + 0.5;
			}
			//按照步长设置进行绘制
			for (i = 0; i <= step; i++) {
				ctx.moveTo(x + 0.5, position - ecgOld);
				x = x + 1;
				z = z + 1;
				xx = z % hr;	//对当前绘制进度和心率求模取余数，拿到当前需要绘制的波形数据的数组索引。
				ecg = 0;
				if (xx < p.length) {
					ecg = p[xx];
				}
				if (xx >= p.length + step && xx < (p.length + step + qrs.length)) {
					ecg = qrs[xx - (p.length + step)];
				}
				ctx.lineTo(x + 0.5, position - ecg);
				ecgOld = ecg;
			}
			ctx.strokeStyle = opts.style.ecgColor || 'chartreuse';
			ctx.lineWidth = opts.style.lineWidth || 1;
			ctx.stroke();
			//如果X轴坐标超出画布范围，则重新开始绘制。
			if (x >= canvas.width) {
				x = 0;
			}
			//实现擦除区
			ctx.beginPath();
			for (i = 0; i <= step; i++) {
				ctx.moveTo(clearWidth + 0.5, 0);
				ctx.lineTo(clearWidth + 0.5, canvas.height);
				clearWidth = clearWidth + 1;
			}
			ctx.strokeStyle = opts.style.bgColor || 'black';
			ctx.stroke();
			if (clearWidth >= canvas.width) {
				clearWidth = 0;
			}
		}
	};
	var painter = null;
	//返回公有方法定义结构
	return {
		//启动绘制
		start : function() {
			painter = setInterval(draw, opts.fps ? (1000 / opts.fps) : 60);
		},
		//关闭绘制，注意该方法在窗口销毁时必须调用，否则会造成定时器内存泄露。
		stop : function() {
			clearInterval(painter);
		}
	};
};

/* 调用方法示例
new GraphLiveECG({
	element: 'ecg',
	fps: 16,
	step: 2,
	position: 'center',
	style: {
		ecgColor: 'chartreuse',
		bgColor: 'black',
		clearWidth: 30,
		lineWidth: 1
	},
	data: {
		//获取当前心率数据
		getHR: function() {
			//模拟获取心率，70到110之间
			var low = 70, high = 110;
			return low + Math.floor(Math.random() * (high - low));
		},
		//获取当前P波数据
		getP: function() {
			//需要将波形数据转换为屏幕坐标点
			return [1, 1, 2, 4, 5, 5, 4, 2, 1, 1];
		},
		//获取当前QRS波数据
		getQRS: function() {
			//需要将波形数据转换为屏幕坐标点
			return [-3, 47, 26, -10, -8, -1, 0, 1, 2, 4, 6, 8, 11, 13, 14, 13, 9, 5, 2, 1];
		}
	}
}).start();
*/