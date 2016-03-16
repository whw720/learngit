/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.crpossum.ValueCount', {
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
                }else{
                    if(Number(atemp) <= Number(cstart)){
                        ztemp = coefficient;
                    }
                }
            }else{//判断固定值
                var cstart = vstr.substring(2,vstr.indexOf(":") - 1);
                if(atemp == cstart){
                    ztemp = coefficient;
                }
            }
            if(ztemp != ""){
                break;
            }
        }
        return ztemp;
    },
    Fmt:function(x) {
    var v = 0;
    if (x >= 0) {
        v = '' + (x + 0.05);
    } else {
        v = '' + (x - 0.05);
    }
    return v.substring(0, v.indexOf('.') + 2);
},
    //计算并发症概率
    CalcMorta:function(zapa,zapaa) {
        var me = this;
        var czapa = 0;//生理分值
        var czapaa = 0;//手术分值
       var  zmorta = 0;//并发症概率
        czapa = (0.16 * zapa) - 5.91;
        czapa = (zapaa * 0.19) + czapa;
        zmorta = 1 / (1 + Math.exp(-czapa));
        zmorta = me.Fmt(100 * zmorta) + " %";
        return zmorta;
},
// 计算死亡率
    CalcMort:function(zapa,zapaa) {
        var me = this;
        var czapa = 0;//生理分值
        var czapaa = 0;//手术分值
        var  zmort = 0;//死亡率
        czapa = (0.338 * zapa) - 9.167;
        czapaa = (zapaa * 0.308) + czapa;
        zmort = 1 / (1 + Math.exp(-czapaa));
        zmort = me.Fmt(100 * zmort) + " %";
        return zmort;
},
    /*
    * 方法功能：页面分值合计
    * 参数：ChangeScores 分值，系统折算 对照（json对象）
    *      apache2item 页面分值项，（json对象）.
    * */
    scoresCount:function(ChangeScores,crpossumItem){
        var me = this;
        var scorescount = 0;
        var selScore = 0;//选择分值项，不用转换，直接取值
        var zapa = 0;//生理分值
        var zapaa = 0;//手术分值
        /*----手术项目分
        * 手术类型   opetype
         手术性质  surg
         癌症分期 mali
         腹腔污染 perit

         ----aps 选择项

         心脏   cardio
        * */
        var surg = 0;
        var opetype = 0;
        var mali = 0;
        var perit = 0;
        var cardio = 0;
        var gcsnum = 0;//gcs 分值合计

        for(var be in crpossumItem.crpossum){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("crpossumItem.crpossum."+be);
            if(itemtype == "Eyes" ||itemtype == "Language" || itemtype == "Motor"  ){
                gcsnum = gcsnum + Number(itemscore);
            }
            if(itemtype == "opetype"){
                if(itemscore != ""){
                    opetype = itemscore;
                    if(opetype != 0){
                        zapaa = zapaa + Number(opetype);
                    }
                }
            }
            if(itemtype == "surg"){
                if(itemscore != ""){
                    surg = itemscore;
                    if(surg != 0){
                        zapaa = zapaa + Number(surg);
                    }
                }
            }
            if(itemtype == "mali"){
                if(itemscore != ""){
                    mali = itemscore;
                    if(mali != 0){
                        zapaa = zapaa + Number(mali);
                    }
                }
            }
            if(itemtype == "perit"){
                if(itemscore != ""){
                    perit = itemscore;
                    if(perit != 0){
                        zapaa = zapaa + Number(perit);
                    }
                }
            }
            if(itemtype == "cardio"){
                if(itemscore != ""){
                    cardio = itemscore;
                    if(cardio != 0){
                        selScore = selScore + Number(cardio);
                    }
                }
            }
        }
        for(var be in crpossumItem.crpossum){
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("crpossumItem.crpossum."+be);
            if(itemscore != "null" && itemscore != ""){
                scorescount = scorescount + Number(me.scoresChang(ChangeScores,itemtype,itemscore));
            }
        }
//        //加昏迷指数
//        if(gcsnum != 0){
//            scorescount = scorescount + Number(me.scoresChang(ChangeScores,"gcs",gcsnum));
//        }
       // alert(zapaa);
        scorescount = scorescount + selScore;
        return scorescount + ";" + zapaa;
    }
});