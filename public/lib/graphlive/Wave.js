//通用波形绘制组件，隶属于GraphLive组件包。
var GraphLiveWave = function (opts) {
	var z = 0;										//当前绘制进度
	var x = 0;										//当前绘制进度的X轴坐标			
	var wave = 0;									//当前绘制的波形数值
	var waveOld = 0;								//上一次绘制的波形数值
	var clearWidth = opts.style.clearWidth || 40;	//擦除区宽度，默认40
	var step = opts.step || 4;						//绘制步长，默认4
	//绘制波形（私有方法）
	var draw = function() {
		var canvas = document.getElementById(opts.element);
		var data = opts.data.getWave();
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			if (z > data.length) {
				z = 0;
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
				ctx.moveTo(x + 0.5, position - waveOld);
				x = x + 1;
				z = z + 1;
				wave = 0;
				if (z < data.length) {
					wave = data[z];
				}
				ctx.lineTo(x + 0.5, position - wave);
				waveOld = wave;
			}
			ctx.strokeStyle = opts.style.waveColor || 'turquoise';
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
new GraphLiveWave({
	element: 'wave' + i,
	fps: 16,
	step: 2,
	position: 'bottom',
	style: {
		waveColor: 'turquoise',
		bgColor: 'black',
		clearWidth: 30,
		lineWidth: 1
	},
	data: {
		getWave: function() {
			//需要将波形数据转换为屏幕坐标点
			return [1, 3, 5, 7, 9, 11, 14, 16, 18, 20, 25, 26, 27, 26, 25, 24, 22, 20, 18, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 10, 12, 13, 14, 15, 12, 8, 6, 4, 2, 1];
		}
	}
}).start();
*/