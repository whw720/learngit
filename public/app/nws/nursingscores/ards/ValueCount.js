/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.ards.ValueCount', {
    /*
    * 方法功能：数值转换分值方法。scoresChang
    * 参数：vobj 验证规则对象 、itemtype 项目类型、itemvalue 项目值
    * */
    scoresChang:function(vobj,itemtype,inputscore){
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
    scoresCount:function(ChangeScores,ardsitem){
        var me = this;
        var scorescount = 0;
        var pfnum = 0;//呼吸
        var pao = 0;
        var fio = 0;
        var foie = 0;
        for(var be in ardsitem.ards){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("ardsitem.ards."+be);
            if(itemtype == "pao"){
                pao = itemscore;
            }
            if(itemtype == "fio"){
                fio = itemscore;
            }
            if(itemtype == "foie"){
                foie = itemscore;
            }
        }
        //呼吸计算
        if(pao != "" && fio != ""){
            if(fio == 0){
                pfnum = 0;
            }else{
                pfnum = pao / fio;
            }

        }
        for(var be in ardsitem.ards){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("ardsitem.ards."+be);
            if(itemscore != "" && itemscore != "null"){
                scorescount = scorescount + Number(me.scoresChang(ChangeScores,itemtype,itemscore));
            }
        }
        if(pfnum != 0){
            scorescount = scorescount + Number(me.scoresChang(ChangeScores,"pf",pfnum));
        }else{
            scorescount = scorescount + 4;// 0除以0 等于 0 ，小于80  得分系数 4.
        }
        if(foie != "null"){
        scorescount = scorescount + Number(foie);
        }

        return scorescount;
    }
});