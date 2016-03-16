// 评分取数配置文件
exports.ApsSetupNames =
{
    "apache2": {
        "41bab010228711e3a5ee59394fbd88a8": '体温(腋下℃)',
        "3be687e0228711e3b51663fd81daaf23": '平均血压(mmHg)',//___dic_monitor_item名称__有创平均动脉压___ART-MAP
        "3b0d8d00228711e39658c92478bc3c10": "心率(次/分)",
        "2b2a025ef5e411e3aa1060a44cce2086": "呼吸频率(次/分)",//"fr": ___dic_monitor_item名称/呼吸监测-呼吸频率实际值
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//___dic_monitor_item名称_/呼吸监测-氧浓度
        "45219890e09311e39b39002186f90e51": "动脉血pH",//___dic_monitor_item名称/血气分析-酸碱度
        "dd9c1499e09811e39b39002186f90e51": "血清K(mmol/L)",///血气分析-钾
        "d1e26c63e09911e39b39002186f90e51": "血清Na(mmol/L)"//___dic_monitor_item名称/血气分析-钠
    },
    "odin": {// 大部分配置无对应，先用体温做功能测试
        "41bab010228711e3a5ee59394fbd88a8": "SBP", //"SBP":   < 90 mmHg 有外周低灌注体征
        "41bab010228711e3a5ee59394fbd88a8": "胆红素",//"foie":
        "41bab010228711e3a5ee59394fbd88a8": "碱性磷酸酶",//碱性磷酸酶"jxlsm":
        "41bab010228711e3a5ee59394fbd88a8": "血小板计数(X10^9/L)",//"coag": 血小板计数(X10^9/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
        "41bab010228711e3a5ee59394fbd88a8": "PaO2（mmHg）",//"pao": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "41bab010228711e3a5ee59394fbd88a8": "血球压积（%）",//"hc": 血球压积（%））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
        "41bab010228711e3a5ee59394fbd88a8": "血清肌酐Cr（mmol/L）",//"ure": 血清肌酐Cr（mmol/L））___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
        "41bab010228711e3a5ee59394fbd88a8": "WBC（x10^9/L）",//"gb": WBC（x10^9/L））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
        "a4968260dfc711e3a85885597115bccc": "尿量"//"uop":  尿量
    },
    "mpm2": {
        "3b0d8d00228711e39658c92478bc3c10": "心率"//"fc":
    },
    "mpm3": {
        "41bab010228711e3a5ee59394fbd88a8": "血清肌酐Cr（mmol/L）",//"ure":）___dic_monitor_item名称__ 未找到
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"pao":___dic_monitor_item名称__标准状态下PaO2————p50(st)
        "a4968260dfc711e3a85885597115bccc": "尿"//"Urine":// ———
    },
    "timist": {
        "41bab010228711e3a5ee59394fbd88a8": "SBP",// "sbp":SBP
        "3b0d8d00228711e39658c92478bc3c10": "HR",//HR"hr":
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）"//"pao":PaO2（mmHg）___dic_monitor_item名称__标准状态下PaO2————p50(st)
    },
    "timiust": {
        "3b0d8d00228711e39658c92478bc3c10": "HR"// "hr":HR
    },
    "mods": {
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"PaO2": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//"FiO2": FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
        "3b0d8d00228711e39658c92478bc3c10": "心率（次/分)",//"HR": 心率（次/分)
        "3c0affd0228711e38639cd0311b5062c": "中心静脉压（mmHg）",//"CVP": 中心静脉压（mmHg）___dic_monitor_item名称（循环参数-中心静脉压-CVP）
        "3be687e0228711e3b51663fd81daaf23": "平均动脉压（mmHg）"//"MAP": ,//平均动脉压（mmHg）___dic_monitor_item名称（循环参数-有创平均动脉压-ART-MAP）
    },
    "sofa": {
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"resp1": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2(%)"//"resp2": ,//FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
    },
    "lods": {
        "3b0d8d00228711e39658c92478bc3c10": "心率（次/分）",//"hr": 心率（次/分）
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）",//"bps": 收缩压（mmHg）___dic_monitor_item名称(循环参数-有创收缩压）
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"pao": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（mmHg）",//"fio": FiO2（mmHg）___dic_monitor_item名称_/呼吸监测-氧浓度
        "a4968260dfc711e3a85885597115bccc": "尿量(L/24H)"//"ur":  尿量
    },
    "ards": {
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"pao": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//"fio": FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
        "3a344400228711e38596a780a337b23c": "分钟通气量（L/min）",//"lm": 分钟通气量（L/min）___dic_monitor_item名称_/呼吸监测-分钟通气量-MV
        "3ac168d0228711e396c99747d05af567": "PEEP（cmHO2）"//"peep": ,//PEEP（cmHO2）___dic_monitor_item名称_/呼吸监测-呼气末正压通气-PEEP
    },
    "saps2": {
        "3b0d8d00228711e39658c92478bc3c10": "心率（次/分）",//"fc": 心率（次/分）
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）",//"pas": 收缩压（mmHg）___dic_monitor_item名称(循环参数-有创收缩压）
        "41bab010228711e3a5ee59394fbd88a8": "体温（腋下℃）",//"temp": 体温（腋下℃）
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"pao": PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//"fio": FiO2（%）FiO2（mmHg）___dic_monitor_item名称_/呼吸监测-氧浓度
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//"na": 血清Na（mmol/L）
        "dd9c1499e09811e39b39002186f90e51": "血清K（mmol/L）",//"ka": 血清K（mmol/L）
        "0d2f5e40f07311e39cfe002713c9dd0a": "血清HCO3-（mmol/L）",//"hc":   血清HCO3-（mmol/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
        "a4968260dfc711e3a85885597115bccc": "尿量（mmol/L）"// "diu": 尿量（mmol/L）
    },
    "saps3": {
        "3b0d8d00228711e39658c92478bc3c10": "心率（次/分）",//"fc": 心率（次/分）
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）",//"pas": '收缩压（mmHg）
        "41bab010228711e3a5ee59394fbd88a8": "体温（腋下℃）",//"temp": 体温（腋下℃）
        "f4e482f4e09311e39b39002186f90e51": "PaO2（mmHg）",//"pao": PaO2（mmHg）
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//"fio": FiO2（%）
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//"na": 血清Na（mmol/L）
        "dd9c1499e09811e39b39002186f90e51": "血清K（mmol/L）",//"ka": 血清K（mmol/L）
        "0d2f5e40f07311e39cfe002713c9dd0a": "血清HCO3-（mmol/L）",//"hc": 血清HCO3-（mmol/L）
        "a4968260dfc711e3a85885597115bccc": "尿量（mmol/L）"// 尿量（mmol/L）
    },
    "possum": {
        "dd9c1499e09811e39b39002186f90e51": "血钾（mmol/L）",//血钾（mmol/L）
        "2bb062a05b0911e3a6ff7d7c27488ccd": "脉搏（bpm）",//"fc":
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",// "na":
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）"// 有创收缩压"pao":
    },
    "ppossum": {
        "dd9c1499e09811e39b39002186f90e51": "血钾（mmol/L）",//"ka":
        "2bb062a05b0911e3a6ff7d7c27488ccd": "脉搏（bpm）",//"fc":
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//"na":
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）"//有创收缩压"pao":
    },
    "opossum": {
        "dd9c1499e09811e39b39002186f90e51": "血钾（mmol/L）",//"ka":
        "2bb062a05b0911e3a6ff7d7c27488ccd": "脉搏（bpm）",//"fc":
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//"na":
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）"//"pao":
    },
    "crpossum": {
        "2bb062a05b0911e3a6ff7d7c27488ccd": "脉搏（bpm）",//"fc":
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）"//"pao":
    },
    "vpossum": {
        "dd9c1499e09811e39b39002186f90e51": "血钾（mmol/L）",//"ka":
        "2bb062a05b0911e3a6ff7d7c27488ccd": "脉搏（bpm）",//"fc":
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//'"na":
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）"//"pao":
    },
    "apache4": {
        "41bab010228711e3a5ee59394fbd88a8": "体温（℃）",//"temph": 高 ___dic_monitor_item名称(体温腋下）
        "d1e26c63e09911e39b39002186f90e51": "血清Na（mmol/L）",//"nah": 高 ___dic_monitor_item名称(血气分析Na）
        "636bd3dce4a211e39b39002186f90e51":"血糖（mmol/L）", //bs
        "3b9f1ea0228711e394d199dd5901706f": "收缩压（mmHg）",//___dic_monitor_item名称(循环参数-有创收缩压）"sbph":
        "3bc32160228711e38216691e3354258e": "舒张压（mmHg）",//高 ___dic_monitor_item名称(循环参数-有创舒张压）"dbph":
        "3b0d8d00228711e39658c92478bc3c10": "心率（次/分）",//高  ___dic_monitor_item名称(循环参数-心率）"hrh":
        "2b2a025ef5e411e3aa1060a44cce2086": "呼吸频率（次/分）",//,//高___dic_monitor_item名称（呼吸监测-呼吸频率实际值）"rrh":
        "b379ef19f5f911e3aa1060a44cce2086": "FiO2（%）",//___dic_monitor_item名称_/血气分析-氧浓度"fio2":
        "45219890e09311e39b39002186f90e51": "动脉血PH",//___dic_monitor_item名称/血气分析-酸碱度"acid":
        "bd0fa999e09511e39b39002186f90e51": "PO2（mmHg）",//__dic_monitor_item名称/（血气分析-PO2(T) 氧分压）"po2":
        "c152c793e09411e39b39002186f90e51": "PCO2（mmHg）",//__dic_monitor_item名称/（血气分析-PCO2(T) 二氧化碳分压）"pco2":
        "a4968260dfc711e3a85885597115bccc": "尿量（ml/24hrs）"//"uop":
    }
}

