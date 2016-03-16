/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.lods.ValueCount', {
    /*
     * 方法功能：数值转换分值方法。scoresChang
     * 参数：vobj 验证规则对象 、itemtype 项目类型、itemvalue 项目值
     * */
    scoresChang: function (vobj, itemtype, inputscore) {
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
     *      apache2item 页面分值项，（json对象）.
     *
     *
     * */
    scoresCount: function (ChangeScores, lodsitem) {
        var me = this;
        var scorescount = 0;
        var sumAll = 0;
        var gcsnum = 0;//gcs 分值合计
        var fio = 0;//fio2
        var pao = 0;//pao
        var fiopao = 0;
        var car = 0; // 心血管得分--
        var blo = 0; //血液得分--
        var liv = 0;//肝功得分--
        var ner = 0;//神经得分--
        var ren = 0; // 肾功能得分
        var bre = 0; // 呼吸功能得分--
        var bil = 0;//胆红素( umol/L)  ---bil
        var pt = 0; //凝血酶原时间  ---pt
        var hr = 0; //HR
        var bps = 0;//收缩压(mmHg)---bps
        var wbc = 0;
        var plt = 0;
        var su = 0;
        var sun = 0;
        var cr = 0;
        var ur = 0;

        for (var be in lodsitem.lods) {
            var itemtype = "";
            var itemscore = 0;
            itemtype = be;
            itemscore = eval("lodsitem.lods." + be);
            if (itemtype == "Eyes" || itemtype == "Language" || itemtype == "Motor") {
                gcsnum = gcsnum + Number(itemscore);
            }
        }

        // var ren = 0; // 肾功能得分计算
        su = lodsitem.lods.su;
        sun = lodsitem.lods.sun;
        cr = lodsitem.lods.cr;
        ur = lodsitem.lods.ur;
        su = Number(me.scoresChang(ChangeScores, "su", su));
        sun = Number(me.scoresChang(ChangeScores, "sun", sun));
        cr = Number(me.scoresChang(ChangeScores, "cr", cr));
        ur = Number(me.scoresChang(ChangeScores, "ur", ur));
        ren = Math.max(su, sun, cr, ur);
        //血液得分计算
        wbc = lodsitem.lods.wbc;
        plt = lodsitem.lods.plt;
        wbc = Number(me.scoresChang(ChangeScores, "wbc", wbc));
        plt = Number(me.scoresChang(ChangeScores, "plt", plt));
        if (wbc > plt) {
            blo = wbc;
        } else {
            blo = plt;
        }
        //car = 0; // 心血管得分计算
        hr = lodsitem.lods.hr;
        bps = lodsitem.lods.bps;
        hr = Number(me.scoresChang(ChangeScores, "hr", hr));
        bps = Number(me.scoresChang(ChangeScores, "bps", bps));
        if (hr > bps) {
            car = hr;
        } else {
            car = bps;
        }
        //肝功得分计算
        bil = lodsitem.lods.bil;
        pt = lodsitem.lods.pt;
        if(pt == ""){
            pt = 2;
        }
        bil = Number(me.scoresChang(ChangeScores, "bil", bil));
        pt = Number(me.scoresChang(ChangeScores, "pt", pt));
        if (bil == 0 && pt == 0) {
            liv = 0;
        } else {
            liv = 1;
        }
        // ner 神经得分
        if (gcsnum >= 3 && gcsnum <= 5) {
            ner = 5;
        } else if (gcsnum >= 6 && gcsnum <= 8) {
            ner = 3;
        } else if (gcsnum >= 9 && gcsnum <= 13) {
            ner = 1;
        } else if (gcsnum >= 14 && gcsnum <= 15 && gcsnum == 0) {
            ner = 0;
        }
        // 呼吸功能得分计算
        fio = lodsitem.lods.fio;
        pao = lodsitem.lods.pao;
        if (fio != 0 && pao != 0) {
            fiopao = pao / fio;
        }
        fiopao = fiopao.toFixed(5);

        bre = Number(me.scoresChang(ChangeScores, "fiopao", fiopao));// 呼吸功能得分
        sumAll = car + blo + liv + ner + ren + bre;
        scorescount = '{"car":"' + car +'","blo":"' + blo +'","liv":"' + liv +'","ner":"' + ner +'","ren":"' + ren +'","bre":"' + bre +'","sumAll":"' + sumAll +'"}';
        scorescount = Ext.JSON.decode(scorescount);
        return scorescount;
    },
    /*
     *
     预测死亡率
     * */
    CalcMort:function(sumAll){
        var me = this;
    var z = sumAll;
    z = Math.exp(3.4043 - 0.4173 * z );
    z = 100 * z / ( 1 + z );
    z = me.Fmt(100 - z) + " %";
    return z;
},
    /*格式化死亡率*/
    Fmt: function (x) {
        var v
        if (x >= 0) {
            v = '' + (x + 0.05)
        } else {
            v = '' + (x - 0.05)
        }
        return v.substring(0, v.indexOf('.') + 2);
    }

});