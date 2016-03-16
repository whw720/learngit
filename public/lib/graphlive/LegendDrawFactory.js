/**
 * Created by caoshuaibiao on 14-8-6.
 * 图例绘制工厂，控件里面所有的图例形状在此进行绘制
 * code 图例的形状编码 见图例形状说明文档
 * ctx  CanvasRenderingContext2D
 * stroke 图例的颜色
 * strokeWidth 图例的笔画大小
 * w  绘制的宽 默认是8
 * h  绘制的高 默认是8
 * x  图例的中心位置X轴坐标 默认值为0
 * y  图例的中心位置Y轴坐标 默认值为0
 */
function LegendDrawFactory(code,ctx,stroke,strokeWidth,w,h,x,y){
    var w=w|| 8,stroke=stroke||'black,',strokeWidth=strokeWidth|| 1,isFill=false,h=h|| 8,x=x|| 0,y=y||0;
     ctx.strokeStyle = stroke;
     ctx.lineWidth = strokeWidth;
    if(code==GraphliveConstants.LT001){//下箭头
        ctx.lineWidth=2;
        ctx.moveTo(-w/2+x, -h/2+y);
        ctx.lineTo(1+x,1+y+y/2);
        ctx.lineTo(w/2+2+x, -h/2+y);
    }else if(code==GraphliveConstants.LT002){//上箭头
        ctx.lineWidth=2;
        ctx.moveTo(-w/2+x, h/2+2+y);
        ctx.lineTo(x+1,y+1-y/2);
        ctx.lineTo(x+w/2+2, y+h/2+2);
    }if(code==GraphliveConstants.LT003||code==GraphliveConstants.LT004){//倒三角 003空心/004实心
        if(code==GraphliveConstants.LT004) isFill=true;
        ctx.moveTo(-w/2+x, -h/2+y-0.5);
        ctx.lineTo(1+x,1+y+y/2);
        ctx.lineTo(w/2+2+x, -h/2+y-0.5);
        ctx.lineTo(-w/2+x, -h/2+y-0.5);
    }else if(code==GraphliveConstants.LT005||code==GraphliveConstants.LT006){//正三角 005空心/006实心
        if(code==GraphliveConstants.LT006) isFill=true;
        ctx.moveTo(-w/2+x, h/2+2+y+0.5);
        ctx.lineTo(x+1,y+1-y*2/3);
        ctx.lineTo(x+w/2+2, y+h/2+2+0.5);
        ctx.lineTo(-w/2+x, h/2+2+y+0.5);
    }else if(code==GraphliveConstants.LT007||code==GraphliveConstants.LT008){//圆圈  007空心/008实心
        if(code==GraphliveConstants.LT008) isFill=true;
        ctx.arc(x, y, w/2, 0, 2 * Math.PI, true);

    }else if(code==GraphliveConstants.LT009){//连续的W图标
        ctx.moveTo(-2*w/2+x, 2*h/4+y);
        ctx.lineTo(-2*w/4+x, -2*h/4+y);
        ctx.lineTo(0+x, 2*h/4+y);
        ctx.lineTo(2*w/4+x, -2*h/4+y);
        ctx.lineTo(2*w/2+x, 2*h/4+y);
        ctx.moveTo(2*w/2+x, 2*h/4+y);
    }else if(code==GraphliveConstants.LT010){//X符号
        ctx.lineWidth=2;
        ctx.moveTo(-w/2+x, -h/2+y);
        ctx.lineTo(w/2+x,h/2+y);
        ctx.moveTo(w/2+x, -h/2+y);
        ctx.lineTo(-w/2+x,h/2+y);
    }else if(code==GraphliveConstants.LT011){//圆圈加通过圆心的水平箭头
        ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
        ctx.moveTo(-w/2+x, 0.5+y);
        ctx.lineTo(w/2+x, 0.5+y);
        ctx.moveTo(0.5+x, -3.5+y);
        ctx.lineTo(w/2+x, 0+y);
        ctx.lineTo(0.5+x, 3.5+y);
        ctx.moveTo(0.5+x, 3.5+y);

    }else if(code==GraphliveConstants.LT012){//圆圈加通过圆心的垂直箭头
        ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
        ctx.moveTo(x, y-4);
        ctx.lineTo(x, y+4);
        ctx.moveTo(x, y+4);
        ctx.lineTo(x-3.5, y);
        ctx.moveTo(x, y+4);
        ctx.lineTo(x+3.5, y);

    }else if(code==GraphliveConstants.LT013){//圆圈加内部包含一个实心圆
        ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
        ctx.moveTo(x, y);
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
        ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
    }else if(code==GraphliveConstants.LT014||code==GraphliveConstants.LT030){//014圆圈加内部包含一个X,030圆圈内部包含一个+
        ctx.arc(x, y, w/2+1, 0, 2 * Math.PI, true);
        if(code==GraphliveConstants.LT014){
        	ctx.moveTo(-w/2+x, -h/2+y);
	        ctx.lineTo(w/2+x, h/2+y);
	        ctx.moveTo(w/2+x, -h/2+y);
	        ctx.lineTo(-w/2+x, h/2+y);
        }
        if(code==GraphliveConstants.LT030){
        	ctx.moveTo(-w/2+x, y);
	        ctx.lineTo(w/2+x, y);
	        ctx.moveTo(x, -h/2+y);
	        ctx.lineTo(x, h/2+y);
        }
        
    }else if(code==GraphliveConstants.LT015||code==GraphliveConstants.LT016){//圆圈加内部包含一个R 016多一个外部的水平箭头
        ctx.beginPath();
        ctx.fillStyle = stroke;
        ctx.font = "16px Tahoma";
        ctx.textBaseline = "middle";
        ctx.fillText("®",  x-w+1,y);
        ctx.closePath();
        if(code==GraphliveConstants.LT016){
            ctx.moveTo(w/2+1+x, 0.5+y);
            ctx.lineTo(w/2+9+x, 0.5+y);
            ctx.moveTo(w/2+6+x, -3.5+y);
            ctx.lineTo(w/2+9+x, 0.5+y);
            ctx.lineTo(w/2+6+x, 3.5+y);
        }
    }else if(code==GraphliveConstants.LT017||code==GraphliveConstants.LT018){//两个同心圆圈  017穿过圆心的水平直线 018穿过圆心的垂直直线
        ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI, true);
        if(code==GraphliveConstants.LT017){
            ctx.moveTo(-w/2-5+x, 0.5+y);
            ctx.lineTo(w/2+5+x, 0.5+y);
        }
        if(code==GraphliveConstants.LT018){
            ctx.moveTo(0.5+x, -h/2-5+y);
            ctx.lineTo(0.5+x, h/2+5+y);
        }
    }else if(code==GraphliveConstants.LT019||code==GraphliveConstants.LT020){//圆圈 019穿过圆心的水平直线 020 穿过圆心的垂直直线
        ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
        if(code==GraphliveConstants.LT019){
            ctx.moveTo(-w/2-5+x, 0.5+y);
            ctx.lineTo(w/2+5+x, 0.5+y);
        }
        if(code==GraphliveConstants.LT020){
            ctx.moveTo(0.5+x, -h/2-5+y);
            ctx.lineTo(0.5+x, h/2+5+y);
        }
    }else if(code==GraphliveConstants.GANTT_RUN){//甘特序列进度水平箭头
        ctx.moveTo(-w/2-0.5, -h/2-0.5);
        ctx.lineTo(0, 0);
        ctx.lineTo(-w/2-0.5, h/2+0.5);
        ctx.moveTo(-w/2-0.5, h/2+0.5);
    }else if(code==GraphliveConstants.GANTT_STOP){//甘特序列停止 垂直线段
        ctx.moveTo(0.5, -4);
        ctx.lineTo(0.5, 4);
    }else if(code==GraphliveConstants.LT021){//米字符
        ctx.fillStyle = stroke;
        ctx.font = "20px Tahoma";
        ctx.textBaseline = "hanging";
        ctx.fillText("*", x-w/2-1, y-h/2);
    }else if(code==GraphliveConstants.LT022||code==GraphliveConstants.LT023){//矩形  022空心/023实心
        if(code==GraphliveConstants.LT023) isFill=true;
        ctx.moveTo(-w/2+x, -h/2+y);
        ctx.lineTo(w/2+x, -h/2+y);
        ctx.lineTo(w/2+x, h/2+y);
        ctx.lineTo(-w/2+x, h/2+y);
        ctx.lineTo(-w/2+x, -h/2+y);
    }else if(code==GraphliveConstants.LT026||code==GraphliveConstants.LT027||code==GraphliveConstants.LT031){//菱形  026空心/027实心 031内部十字
    	//if(code==GraphliveConstants.LT027||code==GraphliveConstants.LT026)ctx.lineWidth=2;
        if(code==GraphliveConstants.LT027) isFill=true;
        ctx.moveTo(-w/2+x, y);
        ctx.lineTo(x, -h/2+y);
        ctx.lineTo(w/2+x, y);
        ctx.lineTo(x, h/2+y);
        ctx.lineTo(-w/2+x, y);
        if(code==GraphliveConstants.LT031){
           ctx.moveTo(-w/2+x, y);
           ctx.lineTo(w/2+x, y);
           ctx.moveTo(x, -h/2+y);
           ctx.lineTo(x, h/2+y);
        }
    }else if(code==GraphliveConstants.TIME_LINE){//时间轴图例
        ctx.moveTo(-0.5, -h*0.5-1);
        ctx.lineTo(-0.5, h*0.5+1);
    }else if(code==GraphliveConstants.GUIDE){//辅助虚线
        fabric.util.drawDashedLine(ctx, -w*0.5, 0, w*0.5, 0, [3,2]);
    }else if(code==GraphliveConstants.LT024||code==GraphliveConstants.LT025){//024圆形中有个A 025 圆形中有个V
        ctx.beginPath();
        ctx.fillStyle = stroke;
        ctx.font = "10px Tahoma";
        ctx.textBaseline = "middle";
        if(code==GraphliveConstants.LT024){
            ctx.fillText("A",  x-2*w/3,y);
        }
        if(code==GraphliveConstants.LT025){
            ctx.fillText("V",  x-2*w/3,y);
        }
        ctx.closePath();
        ctx.arc(x, y, w/2+3, 0, 2 * Math.PI, true);
    }else if(code==GraphliveConstants.LT028){//星字符
        ctx.fillStyle = stroke;
        ctx.font = "14px Tahoma";
        ctx.textBaseline = "hanging";
        ctx.fillText("★", x-w/2-1, y-h/2);
    }else if(code==GraphliveConstants.LT029){//心字符
        ctx.fillStyle = stroke;
        ctx.font = "14px Tahoma";
        ctx.textBaseline = "hanging";
        ctx.fillText("♥", x-w/2-1, y-h/2);
    }else if(code==GraphliveConstants.LT032){//圆圈里面有个倒V
        ctx.arc(x, y, w/2+1, 0, 2 * Math.PI, true);
        ctx.moveTo(-w/2+x-0.5, h/2+y+0.5);
        ctx.lineTo(x,y-h/3);
        ctx.lineTo(x+w/2+0.5, y+h/2+0.5);
    }else if(code==GraphliveConstants.LT033){//圆圈包含V
        ctx.arc(x, y, w/2+1, 0, 2 * Math.PI, true);
        ctx.moveTo(-w/2+x-0.5,y-h/2-0.5);
        ctx.lineTo(x,y+h/3);
        ctx.lineTo(x+w/2+0.5, y-h/2-0.5);
    }if(code==GraphliveConstants.LT035||code==GraphliveConstants.LT034){//倒三角 035 下箭头/034加号+
        ctx.moveTo(-w/2+x-3, -h/2+y-0.5-2);
        ctx.lineTo(x,2+y+h/2);
        ctx.lineTo(w/2+3+x, -h/2+y-0.5-2);
        ctx.lineTo(-w/2+x-3, -h/2+y-0.5-2);
        if(code==GraphliveConstants.LT035){
            ctx.moveTo(-w/2+x+2, -h/2+y-1);
            ctx.lineTo(x,y+1);
            ctx.lineTo(w/2-2+x, -h/2+y-1);
        }
        if(code==GraphliveConstants.LT034){
            ctx.moveTo(-w/2+x, y-h/3);
            ctx.lineTo(w/2+x, y-h/3);
            ctx.moveTo(x-0.5, -h/2+y-3);
            ctx.lineTo(x-0.5, h/2+y-1);
        }
    }else if(code==GraphliveConstants.LT036){//正三角 036上箭头
        ctx.moveTo(-w/2+x-3, h/2+y+2+0.5);
        ctx.lineTo(x,y-h/2-2);
        ctx.lineTo(w/2+3+x, h/2+y+2+0.5);
        ctx.lineTo(-w/2+x-3, h/2+y+2+0.5);

        ctx.moveTo(-w/2+x+2, h/2+y+1);
        ctx.lineTo(x,y-1);
        ctx.lineTo(w/2-2+x, h/2+y+1);
    }

    if(isFill){
        ctx.fillStyle=stroke;
        ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
}
