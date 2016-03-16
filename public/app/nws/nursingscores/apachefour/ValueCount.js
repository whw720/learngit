/**
 * Created by zag on 14-4-1.
 * 说明：
 *  本系统没有 没有旧制单位，一律采用 国际单位 SI---------
 *  本地大气压单位 米　　　不采用英尺单位。
 *  体温采用　oC 不用　oF
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.apachefour.ValueCount', {
    /*得分、死亡率、ICU驻留天数计算 apacheIV主计算函数*/
  apacheIV:function(objItem,mod) {

      var me = this;
      var po = Ext.getCmp(mod + 'apachefourform');
//      po.mr = "123";//死亡率
//      po.scores = "456";// 得分
//      po.icuDay = "789";//ICU驻留天数



      var templ = 0; //体温高
      var temph = 0; // 体温低
      var sbpl = 0; // 收缩压低
      var sbph = 0; // 收缩压高
      var dbpl = 0; // 舒张压低
      var dbph = 0; // 舒张压高
      var hrl = 0; // 心率 低
      var hrh = 0; // 心率高
      var rrl = 0; // 呼吸频率低
      var rrh = 0; // 呼吸频率高
      var fio2= 0; // FIO2
      var po2= 0; // PO2（mmHg）
      var pco2= 0; // PCO2（mmHg）
      var r = 0.8
      var ph2o = 47
      var alt= 0; //当地大气压
      var acid= 0; // 动脉血PH
      var nal= 0; //  血清钠低
      var nah= 0; //   血清钠高
      var glucosel= 0; // 血糖低
      var glucoseh= 0; // 血糖高
      var alb= 0; //  白蛋白
      var bili= 0; // 总胆红素
      var creatl= 0; //血清肌酐 低
      var creath= 0; //血清肌酐高
      var bunl= 0; //  尿素氮BUN低
      var bunh= 0; // 尿素氮BUN高
      var uop= 0; //   尿量
      var hctl= 0; //血球压积低
      var hcth= 0; // 血球压积高
      var wbcl= 0; // 白细胞（x10^3/mm^3）低
      var wbch= 0; // 白细胞（x10^3/mm^3）高
      var gcs= 0; // 昏迷指数---------------三项计算-----------------
      var age= 0; // 年龄
      var admit=0; //ICU前场所
      var los= 0; // ICU前住院天数
      var vent = 0; // 24h内曾用呼吸机
      var readmit = 0; //再次入ICU
      var chc1 =0;
      var chc2 = 0;
      var chc3 = 0;
      var chc4 = 0;
      var chc5 = 0;
      var chc6 = 0;
      var chc7 = 0;
      var chc8 = 0;
      var emergsurg = 0;


      // 计算gcs
      var eyes = 0;
      var language = 0;
      var motor = 0;
//readmit
     // debugger;
      if(objItem.apache4.readmit != 0){
          readmit = objItem.apache4.readmit;
      }
      if(objItem.apache4.emergsurg != 0){
          emergsurg = objItem.apache4.emergsurg;
      }

      if(objItem.apache4.chc1 != 0){
          chc1 = objItem.apache4.chc1;
      }
      if(objItem.apache4.chc2 != 0){
          chc2 = objItem.apache4.chc2;
      }
      if(objItem.apache4.chc3 != 0){
          chc3 = objItem.apache4.chc3;
      }
      if(objItem.apache4.chc4 != 0){
          chc4 = objItem.apache4.chc4;
      }
      if(objItem.apache4.chc5 != 0){
          chc5 = objItem.apache4.chc5;
      }
      if(objItem.apache4.chc6 != 0){
          chc6 = objItem.apache4.chc6;
      }
      if(objItem.apache4.chc7 != 0){
          chc7 = objItem.apache4.chc7;
      }
      if(objItem.apache4.chc8 != 0){
          chc8 = objItem.apache4.chc8;
      }

      if(objItem.apache4.vent != 0){
          vent = objItem.apache4.vent;
      }
               if(objItem.apache4.age != "null"){
                   age = objItem.apache4.age;
               }
              if(objItem.apache4.Eyes != ""){
                  eyes = objItem.apache4.Eyes;
              }
              if(objItem.apache4.Language != ""){
                  language = objItem.apache4.Language;
              }
              if(objItem.apache4.Motor != ""){
                  motor = objItem.apache4.Motor;
              }
              if(objItem.apache4.templ != "null"){
                  templ = objItem.apache4.templ;
              }
              if(objItem.apache4.temph != "null"){
                  temph = objItem.apache4.temph;
              }
              if(objItem.apache4.sbpl != "null"){
                  sbpl = objItem.apache4.sbpl;
              }
              if(objItem.apache4.sbph != "null"){
                  sbph = objItem.apache4.sbph;
              }
              if(objItem.apache4.dbpl != "null"){
                  dbpl = objItem.apache4.dbpl;
              }
              if(objItem.apache4.dbph != "null"){
                  dbph = objItem.apache4.dbph;
              }
              if(objItem.apache4.hrl != "null"){
                  hrl = objItem.apache4.hrl;
              }
              if(objItem.apache4.hrh != "null"){
                  hrh = objItem.apache4.hrh;
              }
              if(objItem.apache4.rrl != "null"){
                  rrl = objItem.apache4.rrl;
              }
              if(objItem.apache4.rrh != "null"){
                  rrh = objItem.apache4.rrh;
              }
              if(objItem.apache4.fio2 != "null"){
                  fio2 = objItem.apache4.fio2;
              }
              if(objItem.apache4.po2 != "null"){
                  po2 = objItem.apache4.po2;
              }
              if(objItem.apache4.pco2 != "null"){
                  pco2 = objItem.apache4.pco2;
              }
              if(objItem.apache4.alt != "null"){
                  alt = objItem.apache4.alt;
              }
              if(objItem.apache4.acid != "null"){
                  acid = objItem.apache4.acid;
              }
              if(objItem.apache4.nal != "null"){
                  nal = objItem.apache4.nal;
              }
              if(objItem.apache4.nah != "null"){
                  nah = objItem.apache4.nah;
              }
              if(objItem.apache4.glucosel != "null"){
                  glucosel = objItem.apache4.glucosel;
              }
              if(objItem.apache4.glucoseh != "null"){
                  glucoseh = objItem.apache4.glucoseh;
              }
              if(objItem.apache4.alb != "null"){
                  alb = objItem.apache4.alb;
              }
              if(objItem.apache4.bili != "null"){
                  bili = objItem.apache4.bili;
              }
              if(objItem.apache4.creatl != "null"){
                  creatl = objItem.apache4.creatl;
              }
              if(objItem.apache4.creath != "null"){
                  creath = objItem.apache4.creath;
              }
              if(objItem.apache4.bunl != "null"){
                  bunl = objItem.apache4.bunl;
              }
              if(objItem.apache4.bunh != "null"){
                  bunh = objItem.apache4.bunh;
              }
              if(objItem.apache4.uop != "null"){
                  uop = objItem.apache4.uop;
              }
              if(objItem.apache4.hctl != "null"){
                  hctl = objItem.apache4.hctl;
              }
              if(objItem.apache4.hcth != "null"){
                  hcth = objItem.apache4.hcth;
              }
              if(objItem.apache4.wbcl != "null"){
                  wbcl = objItem.apache4.wbcl;
              }
              if(objItem.apache4.wbch != "null"){
                  wbch = objItem.apache4.wbch;
              }
              if(objItem.apache4.admitsource != "null"){
                  admit = objItem.apache4.admitsource;
              }
              if(objItem.apache4.los != "null"){
                  los = objItem.apache4.los;
              }

      // 计算GCS　
      gcs = Number(eyes) + Number(language) + Number(motor);

  //  var admitdx= form.admitdx.value // 入ICU诊断  没有此选项，默认值：MULTRAUM
      var admitdx = "";//入ICU诊断  没有此选项，默认值：MULTRAUM
    var tempscore, templscore, temphscore, mapl, maph, maplscore, maphscore, mapscore, hrscore, hrlscore, hrhscore, rrscore, rrlscore, rrhscore, po2score, aagrad, patm, acidscore, nalscore, nahscore, nascore, creatlscore, creathscore, creatscore, hctlscore, hcthscore, wbclscore, wbchscore, wbcscore, hctscore,  agescore, apachescore, bunlscore, bunhscore, bunscore, uopscore, biliscore, albscore, apsscore;
      var logit = 0;

    var age1=0;
    var age2=0;
    var age3=0;
    var age4=0;
    var age5=0;
    var aps=0;
    var aps1=0;
    var aps2=0;
    var aps3=0;
    var aps4=0;
    var aps5=0;
    var los1=0;
    var los2=0;
    var los3=0;
    var los4=0;
    var chcscore=0;//慢性健康状况 系数
    var gcsscore=0;// 昏迷指数系数
      var glucosehscore = 0;
    var glucoselscore = 0;// 血糖指数 目标对比处理
      var glucosescore = 0;//血糖指数系数
// 暂时删除所有判断

//  动脉血PH 没有输入时 设默认值  7.4     -------添加判断 动态更改控件值。
       if(acid == 0){
           acid = 7.4;
       }
//    if ((acid == "")|| (acid == null)) {
//        alert("You left PH field empty, if no ABG's is available a normal value will be assigned automatically");
//        form.acid.value= 7.4;
//        form.acid.select();
//        form.acid.focus()
//        return true
//    }


// pco2 没有录入时，赋默认值 5.3   本系统没有 没有旧制单位，一律采用 国际单位 SI--------- -------添加判断 动态更改控件值。
      if(pco2 == 0){
          pco2 = 5.3;
      }
//    if ((pco2 == "")|| (pco2 == null)) {
//        form.pco2.value= 5.3
//        form.pco2.select();
//        form.pco2.focus()
//        return true
//    }
//-----GCS 判断，如果 GCS 昏迷指数选择了，参与计算，如果GCS项没有一个选择 GCS 不参与计算
//大气压转换
        patm = me.MtoHg(alt);	// Convert meters to mmHg
        patm = me.roundNum(patm,2);
// Convert to STD unit in case of SI
// 取用国际单位，进行转换
        po2 = me.KptoHg(po2);
        pco2 = me.KptoHg(pco2);
        creatl = creatl / 88.4;
        creath = creath / 88.4;
        bunl= bunl/0.357;
        bunh= bunh/0.357;
        glucosel= glucosel/0.0555;
        glucoseh= glucoseh/0.0555;
        alb= alb/10;
        bili= bili/17.1;
// Temp　体温系数转换处理
    if (templ <= 32.9){
        templscore= 20;}
    else if (templ <=33.4){
        templscore=16;}
    else if (templ <=33.9){
        templscore=13;}
    else if (templ <=34.9){
        templscore=8;}
    else if (templ <=35.9){
        templscore=2;}
    else if (templ <=39.9){
        templscore=0;}
    else {
        templscore=4;
    }
    if (temph <= 32.9){
        temphscore= 20;}
    else if (temph <=33.4){
        temphscore=16;}
    else if (temph <=33.9){
        temphscore=13;}
    else if (temph <=34.9){
        temphscore=8;}
    else if (temph <=35.9){
        temphscore=2;}
    else if (temph <=39.9){
        temphscore=0;}
    else {
        temphscore=4;
    }

    if (temphscore>templscore){
        tempscore= temphscore;
    }
    else{
        tempscore=templscore;
    }
// MAP 血压处理（舒张压、收缩压）
    dbpl = parseInt(dbpl);
    sbpl = parseInt(sbpl);
    dbph = parseInt(dbph);
    sbph = parseInt(sbph);

    mapl= (dbpl * 2 + sbpl)/ 3;
    maph= (dbph * 2 + sbph)/ 3;

    if (mapl<= 39){
        maplscore= 23;}
    else if (mapl <=59){
        maplscore=15;}
    else if (mapl <=69){
        maplscore=7;}
    else if (mapl <=79){
        maplscore=6;}
    else if (mapl <= 99){
        maplscore=0;}
    else if (mapl <= 119){
        maplscore=4;}
    else if (mapl <= 129){
        maplscore=7;}
    else if (mapl <= 139){
        maplscore=9;}
    else {
        maplscore=10;

    }
    if (maph<= 39){
        maphscore= 23;}
    else if (maph <=59){
        maphscore=15;}
    else if (maph <=69){
        maphscore=7;}
    else if (maph <=79){
        maphscore=6;}
    else if (maph <= 99){
        maphscore=0;}
    else if (maph <= 119){
        maphscore=4;}
    else if (maph <= 129){
        maphscore=7;}
    else if (maph <= 139){
        maphscore=9;}
    else {
        maphscore=10;
    }

    if (maphscore>maplscore){
        mapscore= maphscore;
    }
    else{
        mapscore= maplscore;
    }
// Heart Rate　心率处理
    if (hrl<= 39){
        hrlscore= 8;}
    else if (hrl <=49){
        hrlscore=5;}
    else if (hrl <=99){
        hrlscore=0;}
    else if (hrl <=109){
        hrlscore=1;}
    else if (hrl <=119){
        hrlscore=5;}
    else if (hrl <=139){
        hrlscore=7;}
    else if (hrl <=154){
        hrlscore=13;}
    else {
        hrlscore=17;
    }
    if (hrh<= 39){
        hrhscore= 8;}
    else if (hrh <=49){
        hrhscore=5;}
    else if (hrh <=99){
        hrhscore=0;}
    else if (hrh <=109){
        hrhscore=1;}
    else if (hrh <=119){
        hrhscore=5;}
    else if (hrh <=139){
        hrhscore=7;}
    else if (hrh <=154){
        hrhscore=13;}
    else {
        hrhscore=17;
    }

    if (hrhscore>hrlscore){
        hrscore= hrhscore;
    }
    else{
        hrscore= hrlscore;
    }
// Respiratory Rate　呼吸频率处理
    if (rrl<= 5){
        rrlscore= 17;}
    else if (rrl <=11){
        rrlscore=8;}
    else if (rrl <=13){
        rrlscore=7;}
    else if (rrl <=24){
        rrlscore=0;}
    else if (rrl <=34){
        rrlscore=6;}
    else if (rrl <=39){
        rrlscore=9;}
    else if (rrl <=49){
        rrlscore=11;}
    else {
        rrlscore=18;
    }
    if (rrh<= 5){
        rrhscore= 17;}
    else if (rrh <=11){
        rrhscore=8;}
    else if (rrh <=13){
        rrhscore=7;}
    else if (rrh <=24){
        rrhscore=0;}
    else if (rrh <=34){
        rrhscore=6;}
    else if (rrh <=39){
        rrhscore=9;}
    else if (rrh <=49){
        rrhscore=11;}
    else {
        rrhscore=18;
    }
    if (rrhscore>rrlscore){
        rrscore= rrhscore;
    }
    else{
        rrscore= rrlscore;
    }
// Oxygenation
//---vent--24小时曾用呼吸机判断。。--添加判断
    if ((fio2>= 50)|| (vent != 0)) {
        aagrad = (fio2/100 * (patm - ph2o)) - (pco2 / r) - po2;
        aagrad = me.roundNum(aagrad,2);
        if (aagrad <100){po2score=0;}
        else if (aagrad <=249){po2score=7;}
        else if (aagrad <=349){po2score=9;}
        else if (aagrad <=499){po2score=11;}
        else { po2score=14;}
    }
    else {
        if (po2 <=49){
            po2score=15;}
        else if (po2 <=69){
            po2score=5;}
        else if (po2 <=79){
            po2score=2;}
        else {po2score= 0;}
    }

// PH
    if (acid <7.2){
        if ( pco2 < 50){
            acidscore= 12;}
        else {
            acidscore=4;
        }
    }
    else if( acid < 7.3) {
        if (pco2 < 30){
            acidscore=9;
        }
        else if (pco2 < 40){
            acidscore=6;
        }
        else if (pco2 < 50) {
            acidscore=3;
        }
        else {
            acidscore=2;
        }
    }
    else if( acid < 7.35) {
        if (pco2 < 30){
            acidscore=9;
        }
        else if (pco2 < 45){
            acidscore=0;
        }
        else {
            acidscore=1;
        }
    }
    else if( acid < 7.45) {
        if (pco2 < 30){
            acidscore=5;
        }
        else if (pco2 < 45){
            acidscore=0;
        }
        else {
            acidscore=1;
        }
    }
    else if( acid < 7.5) {
        if (pco2 < 30){
            acidscore=5;
        }
        else if (pco2 < 35){
            acidscore=0;
        }
        else if (pco2 < 45) {
            acidscore=2;
        }
        else {
            acidscore=12;
        }
    }
    else if( acid < 7.6) {
        if (pco2 < 40){
            acidscore=3;
        }
        else {
            acidscore=12;
        }
    }
    else {
        if (pco2 < 25){
            acidscore=0;
        }
        if (pco2 < 40){
            acidscore=3;
        }
        else {
            acidscore=12;
        }
    }

// Sodium

    if (nal<= 119){
        nalscore= 3;}
    else if (nal <=134){
        nalscore=2;}
    else if (nal <=154){
        nalscore=0;}
    else {
        nalscore=4;
    }
    if (nah<= 119){
        nahscore= 3;}
    else if (nah <=134){
        nahscore=2;}
    else if (nah <=154){
        nahscore=0;}
    else {
        nahscore=4;
    }
    if (nahscore> nalscore){
        nascore= nahscore;
    }
    else{
        nascore= nalscore;
    }

// Creatinine
// No CRF or ARF

    if (creath<= 0.4){
        creathscore= 3;}
    else if (creath <=1.4){
        creathscore=0;}
    else if (creath <=1.94){
        creathscore=4;}
    else {
        creathscore=7;
    }

    if (creatl<= 0.4){
        creatlscore= 3;}
    else if (creatl <=1.4){
        creatlscore=0;}
    else if (creatl <=1.94){
        creatlscore=4;}
    else {
        creatlscore=7;
    }

    if (creathscore> creatlscore){
        creatscore= creathscore;}
    else{
        creatscore= creatlscore;
    }

//In case of CRF
//---------慢性肾衰/透析 选择---添加判断
    if (chc1 != 0){
        if (creath<= 0.4){
            creathscore= 3;}
        else if (creath <=1.4){
            creathscore=0;}
        else if (creath <=1.94){
            creathscore=4;}
        else {
            creathscore=7;
        }

        if (creatl<= 0.4){
            creatlscore= 3;}
        else if (creatl <=1.4){
            creatlscore=0;}
        else if (creatl <=1.94){
            creatlscore=4;}
        else {
            creatlscore=7;
        }

        if (creathscore> creatlscore){
            creatscore= creathscore;}
        else{
            creatscore= creatlscore;
        }
    }
// In case of Acute Renal Failure
    else if ((uop < 410) && (creatl >=1.5 || creath >=1.5)){
        creatscore=10;
    }
//Urine Output

    if (uop<= 399){
        uopscore= 15;}
    else if (uop <=599){
        uopscore=8;}
    else if (uop <=899){
        uopscore=7;}
    else if (uop <=1499){
        uopscore=5;}
    else if (uop <=1999){
        uopscore=4;}
    else if (uop <=3999){
        uopscore=0;}
    else {
        uopscore=1;
    }
//BUN　尿素氮BUN
    if (bunl <= 16.9){
        bunlscore= 0;}
    else if (bunl <= 19){
        bunlscore= 2;}
    else if (bunl <= 39){
        bunlscore= 7;}
    else if (bunl <= 79){
        bunlscore= 11;}
    else {
        bunlscore=12;
    }
    if (bunh <= 16.9){
        bunhscore= 0;}
    else if (bunh <= 19){
        bunhscore= 2;}
    else if (bunh <= 39){
        bunhscore= 7;}
    else if (bunh <= 79){
        bunhscore= 11;}
    else {
        bunhscore=12;
    }
    if (bunlscore > bunhscore) {
        bunscore= bunlscore}
    else{
        bunscore= bunhscore;
    }
//Albumin　　白蛋白
    if (alb <= 1.9){
        albscore= 11;}
    else if (alb <= 2.4){
        albscore= 6;}
    else if (alb <= 4.4){
        albscore= 0;}
    else {
        albscore=4;
    }
//Bilirubin　总胆红素
    if (bili <= 1.9){
        biliscore= 0;}
    else if (bili <= 2.9){
        biliscore= 5;}
    else if (bili <= 4.9){
        biliscore= 6;}
    else if (bili <= 7.9){
        biliscore= 8;}
    else {
        biliscore= 16;
    }
//Glucose　血糖系数处理。

    if (glucosel <= 39){
        glucoselscore= 8;}
    else if (glucosel <= 59){
        glucoselscore= 9;}
    else if (glucosel <= 199){
        glucoselscore= 0;}
    else if (glucosel <= 349){
        glucoselscore= 3;}
    else {
        glucoselscore= 5;
    }
    if (glucoseh <= 39){
        glucosehscore= 8;}
    else if (glucoseh <= 59){
        glucosehscore= 9;}
    else if (glucoseh <= 199){
        glucosehscore= 0;}
    else if (glucoseh <= 349){
        glucosehscore= 3;}
    else {
        glucosehscore = 5;
    }
    if ( glucosehscore > glucoselscore){
        glucosescore = glucosehscore}
    else {
        glucosescore= glucoselscore
    }
// Hematocrit　血球压积　系数处理
    if (hctl< 40.9){
        hctlscore= 3;}
    else if (hctl <=49){
        hctlscore=0;}
    else {
        hctlscore=3;
    }
    if (hcth< 40.9){
        hcthscore= 3;}
    else if (hcth <=49){
        hcthscore=0;}
    else {
        hcthscore=3;
    }
    if (hcthscore> hctlscore){
        hctscore= hcthscore;}
    else{
        hctscore= hctlscore;
    }
// WBC　系数处理。
    if (wbch < 1){
        wbchscore= 19;}
    else if (wbch <=2.9){
        wbchscore=5;}
    else if (wbch <=19.9){
        wbchscore=0;}
    else if (wbch <=24.9){
        wbchscore=1;}
    else {
        wbchscore=5;
    }
    if (wbcl < 1){
        wbclscore= 19;}
    else if (wbcl <=2.9){
        wbclscore=5;}
    else if (wbcl <=19.9){
        wbclscore=0;}
    else if (wbcl <=24.9){
        wbclscore=1;}
    else {
        wbclscore=5;
    }
    if (wbchscore> wbclscore){
        wbcscore= wbchscore;
    }
    else {
        wbcscore= wbclscore;
    }

// GCS   逻辑判断//  处理比较复杂。暂时使用　GCS　得分处理，
// 如果选择，三项都选择　最低　３分，最高　１５　分。后续正式使用配合专家细算。

     // objItem.apache4.chc1;
      //gcs = eyes + language + motor;

   //   alert(eyes);
    //  alert(language);
    //  alert(motor);
    //  return;
    //  gcsscore = gcs;

      /*
      * 对应项
      * eyes 睁眼 yeux    4 分 对应  0 checked
      * language 语言 repver  5分 对应  0 checked
      * motor 运动  repmo   6 分 对应 0 checked
      *
      * */
      // 睁眼反应选择的前三项。
    if ((eyes == 4)||(eyes == 3)||(eyes == 2)) { //睁眼 1 2 3
        if (motor == 6){// 如果运动反应选择了第一个
            if (language == 5){gcsscore=0} // 语言反应选择第一个。
            if (language == 4){gcsscore=3}
            if (language == 3){gcsscore=10}
            if (language == 2){gcsscore=10}
            if (language == 1){gcsscore=15}
        }
        if (motor == 5){ //运动2
            if (language == 5){gcsscore=3}
            if (language == 4){gcsscore=8}
            if (language == 3){gcsscore=13}
            if (language == 2){gcsscore=13}
            if (language == 1){gcsscore=15}
        }
        if ((motor == 4)|| (motor == 3)){ //运动3、4
            if (language == 5){gcsscore=3}
            if (language == 4){gcsscore=13}
            if (language == 3){gcsscore=24}
            if (language == 2){gcsscore=24}
            if (language == 1){gcsscore=24}
        }
        if ((motor == 2)|| (motor == 1)){ //运动5、6
            if (language == 5){gcsscore=3}
            if (language == 4){gcsscore=13}
            if (language == 3){gcsscore=29}
            if (language == 2){gcsscore=29}
            if (language == 1){gcsscore=29}
        }
    }
    if (eyes == 1) { // 睁眼 4
        if ((motor == 6)||(motor == 5)){ // 运动 1 2
            if ((language == 5)||(language == 4)|| (language == 3)||(language == 2)){
               // alert("Unlikely combination of neurological assessment, please recheck your neuro assessment");
                //神经系统的评估不可能的组合，请重新检查您的神经评估
                Ext.Msg.alert("提示", "神经系统的评估不可能的组合，请重新检查您的神经评估！");
                return false
            }
            if (language == 1){gcsscore=16}// 语言 5
        }

        if ((motor == 4)||(motor == 3)){
            if ((language == 5)||(language == 4)|| (language == 3)){
               // alert("Unlikely combination of neurological assessment, please recheck your neuro assessment");
       //神经系统的评估不可能的组合，请重新检查您的神经评估
                Ext.Msg.alert("提示", "神经系统的评估不可能的组合，请重新检查您的神经评估！");
      // alert("神经系统的评估不可能的组合，请重新检查您的神经评估");
                return false
            }
            if (language == 2){gcsscore=24}
            if (language == 1){gcsscore=33}
        }
        if ((motor == 2)||(motor == 1)){
            if ((language == 5)||(language == 4)|| (language == 3)){
                //alert("Unlikely combination of neurological assessment, please recheck your neuro assessment");
                Ext.Msg.alert("提示", "神经系统的评估不可能的组合，请重新检查您的神经评估！");
                return false;
            }
            if (language == 2){gcsscore=29}
            if (language == 1){gcsscore=48}
        }
    }

// Age　处理年龄分值。
    if (age < 16){
    //alert("Not suitable for pediatric population");
        Ext.Msg.alert("提示", "不适合儿童人群！");
        return false;
        //不适合儿童人群
    }
    else if (age <= 44){
        agescore= 0;}
    else if (age <=59){
        agescore=5;}
    else if (age <=64){
        agescore=11;}
    else if (age <=69){
        agescore=13;}
    else if (age <=74){
        agescore=16;}
    else if (age <=84){
        agescore=17;}
    else {
        agescore=24;
    }
// Chronic Helath Condition　---添加判断

    if (chc2 != 0){chcscore = chc2}
    else if (chc3 != 0){chcscore = chc3}
    else if (chc4 != 0){chcscore = chc4}
    else if (chc5 != 0){chcscore = chc5}
    else if (chc6 != 0){chcscore = chc6}
    else if (chc7 != 0){chcscore = chc7}
    else if (chc8 != 0){chcscore = chc8}
    else {chcscore=0}

    chcscore=parseInt(chcscore);

    apachescore= tempscore + mapscore + hrscore + rrscore + po2score + acidscore + nascore + creatscore + hctscore + wbcscore + gcsscore  + uopscore + bunscore + biliscore + albscore + glucosescore + agescore + chcscore;
    aps = tempscore + mapscore + hrscore + rrscore + po2score + acidscore + nascore + creatscore + hctscore + wbcscore + gcsscore  + uopscore + bunscore + biliscore + albscore + glucosescore;
   // 评分完成，以下计算死亡率 ICU 天数

    if ((age - 27) > 0){
        age1 = Math.pow((age - 27), 3);
    }
    if ((age - 51) > 0){
        age2 = Math.pow((age - 51), 3);
    }
    if ((age - 64) > 0){
        age3 = Math.pow((age - 64), 3);
    }
    if ((age - 74) > 0){
        age4 = Math.pow((age - 74), 3);
    }
    if ((age - 86) > 0){
        age5 = Math.pow((age - 86), 3);
    }

    if ((aps - 10) > 0){
        aps1 = Math.pow((aps - 10), 3);
    }
    if ((aps - 22) > 0){
        aps2 = Math.pow((aps - 22), 3);
    }
    if ((aps - 32) > 0){
        aps3 = Math.pow((aps - 32), 3);
    }
    if ((aps - 48) > 0){
        aps4 = Math.pow((aps - 48), 3);
    }
    if ((aps - 89) > 0){
        aps5 = Math.pow((aps - 89), 3);
    }

    logit = -5.950471952;

    logit = logit + (age * 0.024177455);
    logit = logit + (age1 * (-0.00000438862));
    logit = logit + (age2 * 0.0000501422);

    logit = logit + (age3 * (-0.000127787));
    logit = logit + (age4 * 0.000109606);
    logit = logit + (age5 * (-0.0000275723));

    logit = logit + (aps * 0.055634916);
    logit = logit + (aps1 * 0.00000871852);
    logit = logit + (aps2 * (-0.0000451101));
    logit = logit + (aps3 * 0.00005038);
    logit = logit + (aps4 * (-0.0000131231));

    logit = logit + (aps5 * (-8.65349E-07));


//24h内曾用呼吸机 ------添加判断
    if (vent != 0){
        logit= logit + 0.271760036;
    }
    logit= logit + ((po2/(fio2/100))*(-0.000397068));
//ICU前场所
    if(admit==1){
        logit=logit+ 0.017149193;
    }
    else if (admit==2){
        logit=logit+(-0.583828121);
    }
    else if (admit==3){
        logit=logit+ 0.022106266;
    }

//急诊手术判断---添加判断
    if (emergsurg != 0){
        logit=logit+0.249073458;
    }
    los= Math.sqrt(los);

    if ((los - 0.121) > 0){
        los1 = Math.pow((los - 0.121), 3);
    }
    if ((los - 0.423) > 0){
        los2 = Math.pow((los - 0.423), 3);
    }
    if ((los - 0.794) > 0){
        los3 = Math.pow((los - 0.794), 3);
    }
    if ((los - 2.806) > 0){
        los4 = Math.pow((los - 2.806), 3);
    }

    logit= logit + (los *-0.310487496);
    logit= logit + (los1*1.474672511);
    logit= logit + (los2*-2.8618857);
    logit= logit + (los3*1.42165901);
    logit= logit + (los4*-0.034445822);
//慢性健康状况 判断 ----添加判断
    if (chc2 != 0){
        logit= logit + 0.958100516;
    }
    else if (chc3 != 0){
        logit= logit + 1.037379925;
    }
    else if (chc4 != 0){
        logit= logit + 0.743471748;
    }
    else if (chc5 != 0){
        logit= logit + 1.086423752;
    }
    else if (chc6 != 0){
        logit= logit + 0.969308299;
    }
    else if (chc7 != 0){
        logit= logit + 0.435581083;
    }
    else if (chc8 != 0){
        logit= logit + 0.814665088;
    }

      //如果因麻醉、镇静或正在实施其他医疗措施而不能评价GCS时，选择左侧项，不需评价下栏GCS！
      // 变通处理，如果　GCS　为　０　就不处理如果不为　０　处理。昏迷三项有选择。
//      alert(gcsscore);
//      alert(gcs);
//      console.log(gcsscore);
//      console.log(gcs);

      // 此系统默认 算GCS  可设置 算或不算。
    if (gcs == 0){
        logit= logit + 0.785764316;
    }else {
        logit = logit + ((15-gcs)* 0.039117532);
    }
// 入ICU诊断判断　系统没有此项，设置　默认值　　没有此项不参与计算  MULTRAUM
     // logit = logit +	0.018952727;

//是否溶栓过: 系统没有此项，默认没有　溶栓
   // if (form.thrombo.checked){logit=logit+(-0.579874039)}

    var mort = Math.exp(logit) / (1 + Math.exp(logit));

    mort= Math.round(mort * 10000, 2);
    mort= (Math.round(mort,2)/100) + "%";

  //  form.apsscore.value = aps ;
  //  form.logit.value= logit;
      //添加获取
  //  form.apachescore.value = apachescore ;//apache 得分　
//添加获取
  //  form.mortrate.value= mort; // 死亡率
  //  form.code.value= admitdx
      po.mr = mort;//死亡率
      po.scores = apachescore;// 得分



// Predicted LOS Calculations//计算ICU天数

      debugger;
      if ((age - 27) > 0){
          age1 = Math.pow((age - 27), 3);
      }
      if ((age - 51) > 0){
          age2 = Math.pow((age - 51), 3);
      }
      if ((age - 64) > 0){
          age3 = Math.pow((age - 64), 3);
      }
      if ((age - 74) > 0){
          age4 = Math.pow((age - 74), 3);
      }
      if ((age - 86) > 0){
          age5 = Math.pow((age - 86), 3);
      }

      logit =1.673887925;
      logit = logit + (age *0.017603395 );
      logit = logit + (age1 * (-7.68259E-06));
      logit = logit + (age2 * 3.95667E-05);
      logit = logit + (age3 * (-0.000166793));
      logit = logit + (age4 * 0.000228156);
      logit = logit + (age5 * (-9.32478E-05));

    if ((aps - 10) > 0){
        aps1 = Math.pow((aps - 10), 3);
    }
    if ((aps - 22) > 0){
        aps2 = Math.pow((aps - 22), 3);
    }
    if ((aps - 32) > 0){
        aps3 = Math.pow((aps - 32), 3);
    }
    if ((aps - 48) > 0){
        aps4 = Math.pow((aps - 48), 3);
    }
    if ((aps - 89) > 0){
        aps5 = Math.pow((aps - 89), 3);
    }
    logit = logit + (aps *0.04442699 );
    logit = logit + (aps1 * (-5.83049E-05));
    logit = logit + (aps2 * 0.000297008);
    logit = logit + (aps3 * (-0.000404434));
    logit = logit + (aps4 * 0.000189251);
    logit = logit + (aps5 * (-2.35199E-05));
// 24h内曾用呼吸机 判断--添加判断

    if (vent != 0){
        logit= logit +1.835309541;
    }
    logit= logit + ((po2/(fio2/100))*(-0.004581842));

    if(admit==1){
        logit=logit+ 0.006529382;
    }
    else if (admit==2){
        logit=logit+(-0.599591763);
    }
    else if (admit==3){
        logit=logit+ 0.855505043;
    }

//急诊手术 判断 ---添加判断
    if (emergsurg != 0){
        logit=logit+1.040690632;
    }

    los= Math.sqrt(los);

    if ((los - 0.121) > 0){
        los1 = Math.pow((los - 0.121), 3);
    }
    if ((los - 0.423) > 0){
        los2 = Math.pow((los - 0.423), 3);
    }
    if ((los - 0.794) > 0){
        los3 = Math.pow((los - 0.794), 3);
    }
    if ((los - 2.806) > 0){
        los4 = Math.pow((los - 2.806), 3);
    }

    logit= logit + (los *0.459823129);
    logit= logit + (los1*0.397791937);
    logit= logit + (los2*(-0.945210953));
    logit= logit + (los3*0.588651266);
    logit= logit + (los4*(-0.041232251));
//慢性健康状况 判断---添加判断
    if (chc2 != 0){
        logit= logit +-0.10285942;
    }
    else if (chc3 != 0){
        logit= logit + -0.16012995;
    }
    else if (chc4 != 0){
        logit= logit + -0.28079854;
    }
    else if (chc5 != 0){
        logit= logit + -0.491932974;
    }
    else if (chc6 != 0){
        logit= logit + -0.803754341;
    }
    else if (chc7 != 0){
        logit= logit + -0.07438064;
    }
    else if (chc8 != 0){
        logit= logit + 0.362658613;
    }


//再次入ICU 判断----添加判断
    if (readmit != 0){
        logit= logit + 0.540368459;
    }

// 病种处理，默认没有此选项。

//是否溶栓过: 本系统没有此项设置　，默认没有溶栓。
  //  if (form.thrombo.checked){logit=logit + 0.062385214}

//如果因麻醉、镇静或正在实施其他医疗措施而不能评价GCS时，选择左侧项，不需评价下栏GCS
      // 本系统跟据　gcs得分计算。如果　GCS　得到　不为　０　认为有　GCS　选项。

    if (gcs == 0){
        logit= logit + 1.789326613;
    }
    else {
        logit = logit + ((15-gcs)* -0.015182904);
    }

    los= me.roundNum(logit,2);
    los= los + " 天";
      // ICU 驻留天数。　los
    //form.icustay.value= los
      po.icuDay = los;//ICU驻留天数

    return true;
},
//apacheIV辅助计算  判断
    checkNum:function(val){
    if ((val == null) || (isNaN(val)) || (val == "") || (val < 0)) {
        return false;
    }
    return true;
},
//apacheIV辅助计算  CtoF计算
    CtoF:function(grade) {
    var feh = (212-32)/100 * grade + 32;
    return feh;
},
    //apacheIV辅助计算  FtoC计算
    FtoC:function(grade) {
    var c = ((grade-32)*5)/9;
    return c;
},
//apacheIV辅助计算  FttoM计算
    FttoM:function(feet) {
    var meters = feet * 0.3048;
    return meters;
},
//apacheIV辅助计算  MtoHg计算
    MtoHg:function(meters) {
    var mmhg = 760 * Math.exp((-meters)/7924);
    return mmhg;
},
//apacheIV辅助计算  KptoHg计算
    KptoHg:function(kp) {
    var mmhg = kp * 7.5;
    return mmhg;
},
//apacheIV辅助计算  roundNum计算
    roundNum:function(thisNum,dec){
    thisNum = thisNum * Math.pow(10,dec);
    thisNum = Math.round(thisNum);
    thisNum = thisNum / Math.pow(10,dec);
    return thisNum
}
});