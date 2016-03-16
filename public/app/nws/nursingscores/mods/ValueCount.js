/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.mods.ValueCount', {
    /*
     * 方法功能：数值转换分值方法。scoresChang
     * 参数：vobj 验证规则对象 、itemtype 项目类型、itemvalue 项目值
     * */
    scoresChang: function (vobj, itemtype, inputscore) {
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
        for (var ae in eval("vobj.changeitem." + itemtype)) {
            var vstr = '';
            var coefficient = 0;//系数
            vstr = Ext.JSON.encode(eval("vobj.changeitem." + itemtype + "[ae]"));
            coefficient = vstr.substring(vstr.indexOf(":") + 2, vstr.lastIndexOf('"'));
            if (vstr.indexOf("-") >= 0)// 判断在两个值区间
            {
                var cstart = vstr.substring(2, vstr.indexOf("-"));
                var cend = vstr.substring(vstr.indexOf("-") + 1, vstr.indexOf(":") - 1);
                if (Number(atemp) >= Number(cstart) && Number(atemp) <= Number(cend)) {
                    ztemp = coefficient;
                }
            } else if (vstr.indexOf("=") >= 0) {//判断大于等或小于等于设定值
                var cstart = vstr.substring(4, vstr.indexOf(":") - 1);
                var strcon = vstr.substring(2, 3);
                if (strcon == ">") {
                    if (Number(atemp) >= Number(cstart)) {
                        ztemp = coefficient;
                    }
                } else {//判断固定值
                    if (Number(atemp) <= Number(cstart)) {
                        ztemp = coefficient;
                    }
                }
            } else {
                var cstart = vstr.substring(2, vstr.indexOf(":") - 1);
                if (Number(atemp) == Number(cstart)) {
                    ztemp = coefficient;
                }
            }
            if (ztemp != "") {
                break;
            }
        }
        return ztemp;
    },
    /*
     * 方法功能：页面分值合计
     * 参数：ChangeScores 分值，系统折算 对照（json对象）
     *      modsitem 页面分值项，（json对象）.
     *
     *
     * */
    scoresCount: function (ChangeScores, modsitem) {
        var me = this;
        var scorescount = 0;
        var gcsnum = 0;//gcs 分值合计
        var cf = 0;//   血压校正心率计算  公式:( HR*CVP) /MAP
        var hr = 0;
        var cvp = 0;
        var map = 0;
        var resp = 0;   //呼吸功能  PaO2 /  FiO2
        var PaO2 = 0;
        var FiO2 = 0;
        // var
        //昏迷指数合计
        for (var be in modsitem.mods) {
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("modsitem.mods." + be);
            //呼吸功能取值
            if (itemtype == "PaO2") {
                PaO2 = itemscore;
            }
            if (itemtype == "FiO2") {
                FiO2 = itemscore;
            }
            //心血管功能取值
            if (itemtype == "HR") {
                hr = itemscore;
            }
            if (itemtype == "CVP") {
                cvp = itemscore;
            }
            if (itemtype == "MAP") {
                map = itemscore;
            }
            //昏迷指数合计
            if (itemtype == "Eyes" || itemtype == "Language" || itemtype == "Motor") {
                gcsnum = gcsnum + Number(itemscore);
            }
        }
        //心血管功能计算cf  =  心率(HR) * 中心静脉压（CVP) / 平均动脉压(MAP)
        if (hr != "null" && cvp != "null" && map != "null") {
            cf = (hr * cvp) / map;
            cf = cf.toFixed(4);
            if(cf == Infinity ){
                cf = 0;
            }
        }
        //呼吸功能计算  PaO2 /  FiO2
        if (PaO2 != "null" && FiO2 != "null") {
            resp = PaO2 / FiO2;
            resp = resp.toFixed(4);
        }
        for (var be in modsitem.mods) {
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("modsitem.mods." + be);
            if (itemscore != "null") {
                scorescount = scorescount + Number(me.scoresChang(ChangeScores, itemtype, itemscore));
            }
        }
        if (gcsnum != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "glas", gcsnum));
        }
        if (cf != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "pas", cf));
        }
        if (resp != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "resp", resp));
        }

        return scorescount;
    },
    /*
     *功能：死亡率，ICU驻留天数 计算
     * 参数：ChangeScores 分值，系统折算 对照（json对象）
     *      scores 总分值
     *
     *
     * */
    calcDeathIcuDay: function (ChangeScores, scores) {
        var ztemp = '';
        var atemp = scores;

        for (var ae in eval("ChangeScores.ReferToTable")) {
            var death = "";//death 死亡率
            var icuday = "";//icu驻留天数
            var vstr = ChangeScores.ReferToTable[ae].Scores;
            death = ChangeScores.ReferToTable[ae].HDeath;
            icuday = ChangeScores.ReferToTable[ae].ResidentDay;
            if (vstr.indexOf("-") >= 0) {// 判断在两个值区间
                var cstart = vstr.substring(1, vstr.indexOf("-") - 1);
                var cend = vstr.substring(vstr.indexOf("-") + 1, vstr.length);
                if (atemp >= cstart && atemp <= cend) {
                    ztemp = death + ":" + icuday;
                }
            }else{
                var cstart = vstr.substring(1, vstr.indexOf("-") - 1);
                if (atemp == cstart) {
                    ztemp = death + ":" + icuday;
                }
            }
            if (ztemp != "") {
                break;
            }
        }
        return ztemp;
    }
});