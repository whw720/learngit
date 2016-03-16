/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.sapstwo.ValueCount', {
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
            debugger;
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
     *
     * saps3扩展得分
     *
     * */
    scoresKzCount: function (ChangeScores, sapstwoitem) {
        var age = 0;// 年龄
        if (sapstwoitem.sapstwo.age != "null") {
            age = sapstwoitem.sapstwo.age;
        }
        if (age < 40) {
            age = 0;
        } else if (age >= 40 && age <= 59.99) {
            age = 0.1639;
        } else if (age >= 60 && age <= 69.99) {
            age = 0.2739;
        } else if (age >= 70 && age <= 79.99) {
            age = 0.3690;
        } else if (age > 79) {
            age = 0.6645;
        }
        return age;
    },
    scoresSaps3:function(scores,kzScores){
        var saps2 = 0;
        var saps3 = 0;
        if(scores != 0){
            saps2 = scores * 0.0742;
        }
        saps3 = kzScores + saps2;
        return saps3;
    },
    /*
     * 方法功能：页面分值合计
     * 参数：ChangeScores 分值，系统折算 对照（json对象）
     *      apache2item 页面分值项，（json对象）.
     *
     *
     * */
    scoresCount: function (ChangeScores, sapstwoitem) {
        var me = this;
        var scorescount = 0;
        var gcsnum = 0;//gcs 分值合计
        var pao = 0;
        var fio = 0;
        var paofio = 0;//使用MV or CPAP PaO2/FIO2(mmHg) 项目得分
        var chd = 0;//慢性病
        var as = 0; // 入院种类

        // 计算GCS得分。
        for (var be in sapstwoitem.sapstwo) {
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("sapstwoitem.sapstwo." + be);
            if (itemtype == "Eyes" || itemtype == "Language" || itemtype == "Motor") {
                gcsnum = gcsnum + Number(itemscore);
            }
        }
        // 计算 使用MV or CPAP PaO2/FIO2(mmHg) 项目得分
        if (sapstwoitem.sapstwo.pao != "null") {
            pao = sapstwoitem.sapstwo.pao;
        }
        if (sapstwoitem.sapstwo.fio != "null") {
            fio = sapstwoitem.sapstwo.fio;
        }
        if (pao != 0 && fio != 0) {
            paofio = pao / fio;
        }
        // 慢性病chd
        if (sapstwoitem.sapstwo.chd_item != undefined) {
            chd = sapstwoitem.sapstwo.chd_item;
        }
        //入院种类
        if (sapstwoitem.sapstwo.as_item != undefined) {
            as = sapstwoitem.sapstwo.as_item;
        }

        // APS项目得分转换
        for (var be in sapstwoitem.sapstwo) {
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("sapstwoitem.sapstwo." + be);
            if (itemscore != "null") {
                scorescount = scorescount + Number(me.scoresChang(ChangeScores, itemtype, itemscore));
            }
        }
        if (gcsnum != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "gcs", gcsnum));
        }
        if (paofio != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "mv", paofio));
        }else if(paofio == 0){
            scorescount = scorescount + 11;
        }
        if (chd != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "chd", chd));
        }
        if (as != 0) {
            scorescount = scorescount + Number(me.scoresChang(ChangeScores, "as", as));
        }
        return scorescount;
    },
    /*
     * Logit = -3,517+( Apache II) * 0,146
     预测死亡率 =eLogit/(1+eLogit)
     *
     *
     * */
    calcDeath: function (scores) {
        var me = this;
        debugger;
        var z = 0;
        z = scores;
        z = -14.476 + 0.0844*z + 6.6158*(Math.log(z +1))
        z = Math.exp(z) / (1 + Math.exp(z));
        z = me.Fmt(100 * z) + " %";
        return z
    },
    /*计算死亡率*/
    Fmt: function (x) {
        var v = "";
        if (x >= 0) {
            v = '' + (x + 0.05)
        } else {
            v = '' + (x - 0.05)
        }
        return v.substring(0, v.indexOf('.') + 2);
    }

});