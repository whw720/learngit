/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.apachetwo.ValueCount', {
    /*
    * 方法功能：数值转换分值方法。scoresChang
    * 参数：vobj 验证规则对象 、itemtype 项目类型、itemvalue 项目值
    * */
    scoresChang:function(vobj,itemtype,inputscore){
        /*
         年龄  -----age
         温度 (°C)----temp
         平均压---pam
         心率(bpm)---fc
         呼吸率(bpm)---fr
         Fio2  ---fio
         (A-a) O2 mmHg  ---aa
         PaO2 mmHg ----pao
         血清 HCO3----hco
         动脉pH ----ph
         血钠 (mmol/L) ----na
         血钾----ka
         肌酐(umol/L)---ure
         血球压积 (%)----hc
         W.B.C------gb
         * */
        var ztemp = '';
        var atemp = inputscore;
        for(var ae in eval("vobj.changeitem." + itemtype)){
            var vstr = '';
            var coefficient = 0;//系数
            vstr =  Ext.JSON.encode(eval("vobj.changeitem." + itemtype + "[ae]"));
            coefficient = vstr.substring(vstr.indexOf(":") + 2,vstr.lastIndexOf('"'));
            if(vstr.indexOf("-") >= 0 )// 判断在两个值区间
            {
                var cstart = vstr.substring(2,vstr.indexOf("-"));
                var cend = vstr.substring(vstr.indexOf("-") + 1,vstr.indexOf(":") - 1);
                if(Number(atemp) >= Number(cstart) && Number(atemp) <= Number(cend)){
                    ztemp = coefficient;
                }
            }else if(vstr.indexOf("=") >= 0){//判断大于等或小于等于设定值
                var cstart = vstr.substring(4,vstr.indexOf(":") - 1);
                var strcon = vstr.substring(2,3);
                if(strcon == ">"){
                    if(Number(atemp) >= Number(cstart)){
                        ztemp = coefficient;
                    }
                }else{//判断固定值
                    if(Number(atemp) <= Number(cstart)){
                        ztemp = coefficient;
                    }
                }
            }else{
                var cstart = vstr.substring(2,vstr.indexOf(":") - 1);
                if(Number(atemp) == Number(cstart)){
                    ztemp = coefficient;
                }
            }
            if(ztemp != ""){
                break;
            }
        }
        return ztemp;
    },
    /*
    * 方法功能：页面分值合计
    * 参数：ChangeScores 分值，系统折算 对照（json对象）
    *      apache2item 页面分值项，（json对象）.
    *
    *
    * */
    scoresCount:function(ChangeScores,apache2item){
        var me = this;
        var scorescount = 0;
        var gcsnum = 0;//gcs 分值合计
        var Surgerynum = 0;//手术选择分值
        for(var be in apache2item.apache2){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("apache2item.apache2."+be);
            if(itemtype == "Eyes" ||itemtype == "Language" || itemtype == "Motor"  ){
                gcsnum = gcsnum + Number(itemscore);
            }
            if(itemtype == "Surgery"){
                Surgerynum = itemscore;
            }
        }
        for(var be in apache2item.apache2){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("apache2item.apache2."+be);
           if(be != 'ure'){
               if(itemscore != "null"){
                   scorescount = scorescount + Number(me.scoresChang(ChangeScores,itemtype,itemscore));
               }
           }else{
               var jxss = false;// 急性肾衰选项。
               jxss = apache2item.apache2.arf;
               if(jxss == "true"){
                   scorescount = scorescount + Number(me.scoresChang(ChangeScores,itemtype,itemscore));
               }else{
                   scorescount = scorescount + Number(me.scoresChang(ChangeScores,"jure",itemscore));
               }
           }
        }
        if(gcsnum != 0){
            scorescount = scorescount + Number(me.scoresChang(ChangeScores,"gcs",gcsnum));
        }
        if(Surgerynum != 0){
            scorescount = scorescount + Number(Surgerynum);
        }
        return scorescount;
    },
    /*
    * Logit = -3,517+( Apache II) * 0,146
        预测死亡率 =eLogit/(1+eLogit)
    *
    *
    * */
    calcDeath:function(scores){
        var me = this;
        debugger;
        var z = 0;
        z = scores;
        z = -3.517 + z * (0.146);
        z = Math.exp(z) / (1 + Math.exp(z));
        z = me.Fmt(100 * z) + " %";
        return z
    },
    /*计算死亡率*/
    Fmt:function(x){
        var v
        if(x>=0) { v=''+(x+0.05) } else { v=''+(x-0.05) }
        return v.substring(0,v.indexOf('.')+2);
    }

});