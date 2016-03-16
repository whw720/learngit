/**
 * 质量检测指标统计弹出窗口
 * Created by max on 14-8-12.
 */
Ext.define('com.dfsoft.icu.sta.QtisWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    region: 'center',
    border: true,
    padding:'5 5 5 5',
    indexType:null,//指标类型
    initComponent: function(){
        var contentTemplate = new Ext.XTemplate('<b>说明：</b></br>',
                                             '指标名称：{name}</br>',
                                             '对象选择：{target}</br>',
                                             '指标类型：{type}</br>',
                                             '指标改善：{improve}</br>',
                                             '设置理由：{reason}</br>',
                                             '分子：{numerator}</br>',
                                             '分母：{denominator}</br>',
                                             '<tpl if="formula">计算公式：{formula}</br></tpl>'
                                             );
        var data={
            ICU1:{
                name   :'非预期的 24/48 小时重返重症医学科率（%）',
                target :'所有自重症医学科转到其他病房的患者。',
                type   :'过程指标。',
                improve:'比率下降。',
                reason :'在重症患者转出重症医学科之前需要对患者有一个评估。如果评估结果提示目前患者病情稳定，转入重症医学科的病因已经去除或得到控制则患者具备了转出条件。但如果转出 24小时或 48 小时病情就再度出现恶化，并且需要转回重症医学科接受治疗，说明转出前患者潜在问题没有被发现或未受到重视，之前的评估存在缺陷。24/48 小时重返重症医学科率是衡量医疗质量的一个重要指标。',
                numerator:'单位时间内 24/48 小时重返重症医学科的例数。',
                denominator:'单位时间内重症医学科转出患者的总数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单位时间内 24/48 小时重返重症医学科的例数</br>'+
                    '非预期的 24/48 小时重返重症医学科率（%）= —————————————————————— × 100</br>'+
                             '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单位时间内重症医学科转出患者的总数</br>'
            },
            ICU2:{
                name   :'呼吸机相关肺炎（ＶＡＰ）的预防率（‰）',
                target :'ＩＣＵ中所有使用呼吸机的患者。',
                type   :'过程指标。',
                improve:'比率升高。',
                reason :'在ＩＣＵ中，接受呼吸器治疗的患者，全身情况许可无禁忌、应提高床头至 30 度或更大，有助于防止和降低发生院内获得性肺炎与压疮、溃疡的风险。',
                numerator:'ＩＣＵ患者在使用呼吸机情况下抬高床头部≥30 度的日数（每天 2 次）。',
                denominator:'ＩＣＵ患者使用呼吸机的总日数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ患者在使用呼吸机下抬高床头部≥30度的日数（每天2次）</br>'+
                '呼吸机相关肺炎的预防率（‰）= ————————————————————————————— ×1000</br>'+
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ所有患者使用呼吸机的总日数</br>'
            },
            ICU3:{
                name   :'呼吸机相关肺炎（ＶＡＰ）发病率（‰）',
                target :'ＩＣＵ中所有使用呼吸机的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'呼吸机相关肺炎是机械通气的一个频繁发生的医源性并发症。呼吸机相关肺炎明显增加患者的病死率和医疗资源的消耗。呼吸机相关肺炎的发生率差异极大，很大程度上反映了所在科室的医疗和护理质量。</br> 呼吸机相关肺炎定义：</br>感染前 48 小时内使用过呼吸机，有呼吸道感染的全身及呼吸道感染症状，并有胸部Ｘ线症状及实验室依据。',
                numerator:'单位时间内ＩＣＵ所有发生呼吸机相关肺炎的例数。',
                denominator:'单位时间内ＩＣＵ所有患者使用呼吸机的总日数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ呼吸机相关肺炎的例数</br>'+
                    '呼吸机相关肺炎发病率（‰）= ——————————————————————— ×1000</br>'+
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单位时间内ＩＣＵ所有患者使用呼吸机的总日数</br>'
            },
            ICU4:{
                name   :'中心静脉置管相关血流感染发病率（‰）',
                target :'ＩＣＵ中所有使用中心静脉置管的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'中心静脉置管是重症患者救治的重要手段，但也给感染打开了通道。置管和使用过程中无菌操作和管理是预防和降低导管相关感染的重要措施，一旦发生后果严重。临床上必须给予密切监测，并根据监测结果不断改进相关措施，持续降低中心静脉置管相关感染的发生率。</br> 中心静脉置管相关血液感染的定义：</br>是指感染前 48 小时内使用过中心静脉导管。留置中心静脉导管患者的细菌血症（真菌血症）和至少有 1 次外周静脉血培养阳性，具备感染的临床表现[如发热、寒战和（或）低血压等]，除血管内导管外，无其他明确的血液感染源。',
                numerator:'单位时间内ＩＣＵ中中心静脉置管相关血流感染的例数。',
                denominator:'单位时间内ＩＣＵ中所有患者使用中心静脉置管的总日数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ中心静脉置管相关血流感染的例数</br>'+
                    '中心静脉置管相关血流感染发病率（‰）= ————————————————————— ×1000</br>'+
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ所有患者使用中心静脉置管的总日数</br>'
            },
            ICU5:{
                name   :'留置导尿管相关泌尿系感染发病率（‰）',
                target :'ＩＣＵ中所有留置导尿管的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'由留置导尿管导致的泌尿系感染是重症医学科最常见的院内感染之一，但经常会被忽视。注意无菌操作和尽早拔除不需要的尿管是降低发病率的主要措施。</br>留置导尿管相关泌尿系感染的定义：</br>&nbsp;&nbsp;（1）显性尿路感染：有尿路感染的症状、体征，尿培养阳性，细菌数≥105ＣＦＵ/ｍｌ。</br>&nbsp;&nbsp;（2）无症状菌尿症：无尿路感染症状、体征，尿培养阳性，细菌数≥105ＣＦＵ/ｍｌ。',
                numerator:'单位时间内ＩＣＵ中留置导尿管相关泌尿系感染的例数。',
                denominator:'单位时间内ＩＣＵ中所有患者留置导尿管的总日数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ留置导尿管相关泌尿系感染的例数</br>'+
                    '留置导尿管相关泌尿系感染发病率（‰）= ————————————————————— ×1000</br>'+
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ所有患者留置导尿管的总日数</br>'
            },
            ICU6:{
                name   :'重症患者死亡率（%）',
                target :'所有收住ＩＣＵ的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'住院患者死亡率向来是衡量医疗水平的一个关键指标。对于危重患者同样如此。因为患者的危重程度存在较大差异，所以在评价危重患者死亡率时不同危重程度患者之间要区别计算。</br>&nbsp;&nbsp;（1）患者的危重程度是指ＡＰＡＣＨＥⅡ评 15 分以上的患者，或格拉斯哥昏迷评分、或其他评价分类归属于重症的患者。</br>&nbsp;&nbsp;（2）患者的危重程度是指ＡＰＡＣＨＥⅡ评 15 分以下的患者。',
                numerator:'单位时间内收治的同一危重程度患者的死亡人数。',
                denominator:'单位时间内收治的同一危重程度患者的总人数。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ同一危重程度患者的死亡人数</br>'+
                    '重症患者死亡率（%）= ————————————————— ×100</br>'+
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ＩＣＵ同一危重程度患者的总人数</br>'
            },
            ICU7:{
                name   :'重症患者压疮发生率（%）',
                target :'所有收住ＩＣＵ的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'压疮的主要原因有局部受压导致血液循环障碍、局部组织受到剪切力和摩擦导致损害。患者本身因素如营养状态、局部分泌物、排泄物、汗液的浸渍等使压疮更易发生。这些因素都是重症患者频繁存在的。一旦发生压疮，会给患者带来巨大的痛苦以及后续一系列医疗和护理问题。通过合理的医疗和护理，压疮的发生率是可以明显下降甚至是可以避免的。所有压疮发生率是直接反映病房医疗护理水平的重要指标。</br>&nbsp;&nbsp;（1）患者的危重程度是指ＡＰＡＣＨＥⅡ评 15 分以上的患者，或格拉斯哥昏迷评分、或其他评价分类归属于重症的患者。</br>&nbsp;&nbsp;（2）患者的危重程度是指ＡＰＡＣＨＥⅡ评 15 分以下的患者。',
                numerator:'单位时间内收治的同一危重程度患者的发生压疮患者数量。</br>除外病例：进入ＩＣＵ时已判定有“压疮”病例。',
                denominator:'单位时间内收治的同一危重程度患者的总人数。</br>除外病例：进入ＩＣＵ时已判定有“压疮”病例。',
                formula:'</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同一危重程度患者的发生压疮人数</br>'+
                    '重症患者压疮发生率（%）= ————————————————— ×100</br>'+
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同一危重程度患者的总人数</br>'
            },
            ICU8:{
                name   :'人工气道脱出例数。',
                target :'ＩＣＵ中所有置入人工气道的患者。',
                type   :'结果指标。',
                improve:'比率下降。',
                reason :'人工气道是重症患者呼吸路径，一旦脱出可直接导致窒息并威胁生命，必须给予高度重视。由于后果严重，直接以发生的例数作为指标而不是发生率，是评价患者安全的重要指标。',
                numerator:'单位时间内ＩＣＵ发生的人工气道脱出总例数。',
                denominator:'没有分母',
                formula:''
            }
        }
        this.html=contentTemplate.apply(data[this.indexType]);
        this.callParent();
    }
});