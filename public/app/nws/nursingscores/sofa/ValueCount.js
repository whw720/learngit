/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.sofa.ValueCount', {
    /*
    * 方法功能：数值转换分值方法。scoresChang
    * 参数：vobj 验证规则对象 、itemtype 项目类型、itemvalue 项目值
    * */
    scoresChang:function(vobj,itemtype,inputscore){
        /*
         呼吸功能----resp
         凝血功能----coag
         GCS 昏迷指数---gcs
         胆红素(umol/L)---foie
         肌酐或尿量---uree
         * */
        var ztemp = '';
        var atemp = inputscore;
        for(var ae in eval("vobj.changeitem." + itemtype)){
            var vstr = '';
            var cstart="";
            var strcon = "";
            var cend = "";
            var coefficient = 0;//系数
            vstr =  Ext.JSON.encode(eval("vobj.changeitem." + itemtype + "[ae]"));
            coefficient = vstr.substring(vstr.indexOf(":") + 2,vstr.lastIndexOf('"'));
            if(vstr.indexOf("-") >= 0 )// 判断在两个值区间
            {
                 cstart = vstr.substring(2,vstr.indexOf("-"));
                 cend = vstr.substring(vstr.indexOf("-") + 1,vstr.indexOf(":") - 1);
                if(Number(atemp) >= Number(cstart) && Number(atemp) <= Number(cend)){
                    ztemp = coefficient;
                }
            }else if(vstr.indexOf("=") >= 0){//判断大于等或小于等于设定值
                 cstart = vstr.substring(4,vstr.indexOf(":") - 1);
                 strcon = vstr.substring(2,3);
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
                 cstart = vstr.substring(2,vstr.indexOf(":") - 1);
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
    * */
    scoresCount:function(ChangeScores,sofaItem){
        var me = this;
        var scorescount = 0;
        var gcsnum = 0;//gcs 分值合计
        var va = 0;//降压药分值
       // var uree = 0;//肌酐或尿量（umol/L）
        var respnum = 0; // 呼吸功能  = resp1 / resp2
        var resp1 = 0; //PaO2（mmHg）
        var resp2 = 0; //FiO2（%）
        for(var be in sofaItem.sofa){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("sofaItem.sofa."+be);
            if(itemtype == "Eyes" ||itemtype == "Language" || itemtype == "Motor"  ){
                gcsnum = gcsnum + Number(itemscore);
            }

            if(itemtype == "pas"){//升压药系数
                if(itemscore != ""){
                    va = itemscore;
                }
            }
            if(itemtype == "uree"){//肌酐或尿量（umol/L）
                if(itemscore != ""&&itemscore != "null"){
                    scorescount = Number(itemscore);
                   // uree = itemscore;
                    //alert(scorescount);
                }
            }
            if(itemtype == "resp1"){//PaO2（mmHg）
                if(itemscore != ""){
                    resp1 = itemscore;
                }
            }
            if(itemtype == "resp2"){//FiO2（%）
                if(itemscore != ""){
                    resp2 = itemscore;
                }
            }
        }
        //计算呼吸功能
        if(resp1 != 0 && resp2 != 0){
            respnum = resp1 / resp2;
            respnum = respnum.toFixed(5);
        }
        for(var be in sofaItem.sofa){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("sofaItem.sofa."+be);
            if(itemscore != "null"){
                scorescount = scorescount + Number(me.scoresChang(ChangeScores,itemtype,itemscore));
            }
        }
        // 加呼吸功能
        if(respnum != 0){
            scorescount = scorescount + Number(me.scoresChang(ChangeScores,"resp",respnum));
        }
        //加昏迷指数
        if(gcsnum != 0){
            scorescount = scorescount + Number(me.scoresChang(ChangeScores,"gcs",gcsnum));
        }
        return scorescount + Number(va);
    }
});