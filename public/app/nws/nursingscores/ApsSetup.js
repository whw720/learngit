// 评分取数配置文件
exports.ApsSetup =
{
    "ApsSetup": {
        "itemCorr": [
            {
                "apache2":{"badvalue":  {
                    "temp": "41bab010228711e3a5ee59394fbd88a8", // 体温（腋下℃）
                    "pam": "3be687e0228711e3b51663fd81daaf23",//平均血压（mmHg）___dic_monitor_item名称__有创平均动脉压___ART-MAP
                    "fc": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）
                    "fr": "2b2a025ef5e411e3aa1060a44cce2086",//呼吸频率（次/分）___dic_monitor_item名称/呼吸监测-呼吸频率实际值
                    "pao": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    //"aa": "41bab010228711e3a5ee59394fbd88a8",//A-aDO2（mmHg）___dic_monitor_item名称__ 未找到  （目前先对应体温（腋下℃））
                    "pio": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
                    "ph": "45219890e09311e39b39002186f90e51",//动脉血pH___dic_monitor_item名称/血气分析-酸碱度
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血清K（mmol/L）/血气分析-钾
                    "na": "d1e26c63e09911e39b39002186f90e51"//,//血清Na（mmol/L））___dic_monitor_item名称/血气分析-钠
                    //"hc": "41bab010228711e3a5ee59394fbd88a8",//血球压积（%））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"ure": "41bab010228711e3a5ee59394fbd88a8",//血清肌酐Cr（mmol/L））___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    //"gb": "41bab010228711e3a5ee59394fbd88a8"//WBC（x10^9/L））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }}
            },{
                "odin":{"badvalue":{// 大部分配置无对应，先用体温做功能测试
                    "SBP": "41bab010228711e3a5ee59394fbd88a8", // SBP < 90 mmHg 有外周低灌注体征
                    "foie": "41bab010228711e3a5ee59394fbd88a8",//胆红素
                    "jxlsm": "41bab010228711e3a5ee59394fbd88a8",//碱性磷酸酶
                    "coag": "41bab010228711e3a5ee59394fbd88a8",//血小板计数(X10^9/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "pao": "41bab010228711e3a5ee59394fbd88a8",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "hc": "41bab010228711e3a5ee59394fbd88a8",//血球压积（%））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "ure": "41bab010228711e3a5ee59394fbd88a8",//血清肌酐Cr（mmol/L））___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "gb": "41bab010228711e3a5ee59394fbd88a8"//WBC（x10^9/L））___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }, "sumvalue":{
                    "uop": "a4968260dfc711e3a85885597115bccc"// 尿量
                }

                }
            },
            {
                "mpm2": {"badvalue": {
                    "fc":"3b0d8d00228711e39658c92478bc3c10"// 心率
                }}
            },
            {
                "mpm3": {"badvalue": {
                    "ure":"41bab010228711e3a5ee59394fbd88a8",//血清肌酐Cr（mmol/L））___dic_monitor_item名称__ 未找到
                    "pao":"f4e482f4e09311e39b39002186f90e51"//PaO2（mmHg）___dic_monitor_item名称__标准状态下PaO2————p50(st)
                },
                    "sumvalue":{
                        "Urine":"a4968260dfc711e3a85885597115bccc"// 尿————
                    }}
            },
            {
                "timist": {"badvalue": {
                    "sbp":"41bab010228711e3a5ee59394fbd88a8",//SBP
                    "hr":"3b0d8d00228711e39658c92478bc3c10",//HR
                    "pao":"f4e482f4e09311e39b39002186f90e51"//PaO2（mmHg）___dic_monitor_item名称__标准状态下PaO2————p50(st)
                }}
            },
            {
                "timiust": {"badvalue": {
                    "hr":"3b0d8d00228711e39658c92478bc3c10"//HR
                }}
            },
            {
                "mods": {"badvalue": {
                    "PaO2": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "FiO2": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
                    //"foie": "41bab010228711e3a5ee59394fbd88a8",//胆红素(umol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"coag": "41bab010228711e3a5ee59394fbd88a8",//血小板计数(X10^9/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "HR": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分)
                    "CVP": "3c0affd0228711e38639cd0311b5062c",//中心静脉压（mmHg）___dic_monitor_item名称（循环参数-中心静脉压-CVP）
                    "MAP": "3be687e0228711e3b51663fd81daaf23"//,//平均动脉压（mmHg）___dic_monitor_item名称（循环参数-有创平均动脉压-ART-MAP）
                    //"uree": "41bab010228711e3a5ee59394fbd88a8"//血清肌酐Cr（umol/L）___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                }}
            },
            {
                "sofa": {"badvalue": {
                    "resp1": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "resp2": "b379ef19f5f911e3aa1060a44cce2086"//,//FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
                    //"coag": "41bab010228711e3a5ee59394fbd88a8",//血小板计数(X10^9/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"foie": "41bab010228711e3a5ee59394fbd88a8",//胆红素(umol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"uree": "41bab010228711e3a5ee59394fbd88a8"//肌酐或尿量（umol/L）___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                }}
            },
            {
                "lods": {"badvalue": {
                    "hr": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）
                    "bps": "3b9f1ea0228711e394d199dd5901706f",//收缩压（mmHg）___dic_monitor_item名称(循环参数-有创收缩压）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"plt": "41bab010228711e3a5ee59394fbd88a8",//血小板（x10^9/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "pao": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "fio": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（mmHg）___dic_monitor_item名称_/呼吸监测-氧浓度
                    //"su": "41bab010228711e3a5ee59394fbd88a8",//尿素(mmol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"sun": "41bab010228711e3a5ee59394fbd88a8",//尿素氮(mmol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"cr": "41bab010228711e3a5ee59394fbd88a8",//肌酐(umol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"bil": "41bab010228711e3a5ee59394fbd88a8"//胆红素( umol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }, "sumvalue":{
                    "ur": "a4968260dfc711e3a85885597115bccc"// 尿量
                }}
            },
            {
                "ards":{"badvalue":  {
                    "pao": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "fio": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）___dic_monitor_item名称_/呼吸监测-氧浓度
                    "lm": "3a344400228711e38596a780a337b23c",//分钟通气量（L/min）___dic_monitor_item名称_/呼吸监测-分钟通气量-MV
                    "peep": "3ac168d0228711e396c99747d05af567"//,//PEEP（cmHO2）___dic_monitor_item名称_/呼吸监测-呼气末正压通气-PEEP
                    //"mc": "41bab010228711e3a5ee59394fbd88a8"//肺顺应性（ml/cmHO2）__dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }}
            },
            {
                "saps2": {"badvalue": {
                    "fc": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）
                    "pas": "3b9f1ea0228711e394d199dd5901706f",//收缩压（mmHg）___dic_monitor_item名称(循环参数-有创收缩压）
                    "temp": "41bab010228711e3a5ee59394fbd88a8",//体温（腋下℃）
                    "pao": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）___dic_monitor_item名称_/血气分析-氧分压
                    "fio": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）FiO2（mmHg）___dic_monitor_item名称_/呼吸监测-氧浓度
                    //"gb": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"uree": "41bab010228711e3a5ee59394fbd88a8",//BUN（mmol/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "na": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血清K（mmol/L）
                    //"bili": "41bab010228711e3a5ee59394fbd88a8",//胆红素(μmol/L)___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "hc":   "0d2f5e40f07311e39cfe002713c9dd0a"//血清HCO3-（mmol/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }, "sumvalue":{
                    "diu": "a4968260dfc711e3a85885597115bccc"// 尿量（mmol/L）
                }}
            },
            {
                "saps3": {"badvalue": {
                    "fc": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）
                    "pas": "3b9f1ea0228711e394d199dd5901706f",//'收缩压（mmHg）
                    "temp": "41bab010228711e3a5ee59394fbd88a8",//体温（腋下℃）
                    "pao": "f4e482f4e09311e39b39002186f90e51",//PaO2（mmHg）
                    "fio": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）
                    //"gb": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）
                    //"uree": "41bab010228711e3a5ee59394fbd88a8",//BUN（mmol/L）
                    "na": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血清K（mmol/L）
                    //"bili": "41bab010228711e3a5ee59394fbd88a8",//胆红素(μmol/L)
                    "hc": "0d2f5e40f07311e39cfe002713c9dd0a"//血清HCO3-（mmol/L）
                }, "sumvalue":{
                    "diu": "a4968260dfc711e3a85885597115bccc"// 尿量（mmol/L）
                }}
            },
            {
                "possum":{"badvalue":  {
                    //"ur": "a4968260dfc711e3a85885597115bccc",//尿素（mmol/L）
                    //"hb": "41bab010228711e3a5ee59394fbd88a8",//血色素（g/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血钾（mmol/L）
                    "fc": "2bb062a05b0911e3a6ff7d7c27488ccd",//脉搏（bpm）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）__dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "na": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）
                    "pao": "3b9f1ea0228711e394d199dd5901706f"//收缩压（mmHg） 有创收缩压
                }}
            },
            {
                "ppossum": {"badvalue": {
                    //"ur": "a4968260dfc711e3a85885597115bccc",//尿素（mmol/L）
                    //"hb": "41bab010228711e3a5ee59394fbd88a8",//血色素（g/L）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血钾（mmol/L）
                    "fc": "2bb062a05b0911e3a6ff7d7c27488ccd",//脉搏（bpm）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）__dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "na": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）
                    "pao": "3b9f1ea0228711e394d199dd5901706f"//收缩压（mmHg）有创收缩压
                }}
            },
            {
                "opossum": {"badvalue": {
                    //"ur": "a4968260dfc711e3a85885597115bccc",//尿素（mmol/L）
                    //"hb": "41bab010228711e3a5ee59394fbd88a8",//血色素（g/L）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血钾（mmol/L）
                    "fc": "2bb062a05b0911e3a6ff7d7c27488ccd",//脉搏（bpm）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）
                    "na": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）
                    "pao": "3b9f1ea0228711e394d199dd5901706f"//收缩压（mmHg）
                }}
            },
            {
                "crpossum": {"badvalue": {
                    //"ur": "a4968260dfc711e3a85885597115bccc",//尿素（mmol/L）
                    //"hb": "41bab010228711e3a5ee59394fbd88a8",//血色素（g/L）
                    "fc": "2bb062a05b0911e3a6ff7d7c27488ccd",//脉搏（bpm）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）
                    "pao": "3b9f1ea0228711e394d199dd5901706f"//收缩压（mmHg）
                }
                }
            },
            {
                "vpossum": {"badvalue": {
                    //"ur": "a4968260dfc711e3a85885597115bccc",//尿素（mmol/L）
                    //"hb": "41bab010228711e3a5ee59394fbd88a8",//血色素（g/L）
                    "ka": "dd9c1499e09811e39b39002186f90e51",//血钾（mmol/L）
                    "fc": "2bb062a05b0911e3a6ff7d7c27488ccd",//脉搏（bpm）
                    //"wbc": "41bab010228711e3a5ee59394fbd88a8",//WBC（x10^9/L）
                    "na": "d1e26c63e09911e39b39002186f90e51",//'血清Na（mmol/L）
                    "pao": "3b9f1ea0228711e394d199dd5901706f"//收缩压（mmHg）
                }}

            },
            {
                "apache4": {"maxvalue": {
                    "temph": "41bab010228711e3a5ee59394fbd88a8",//体温高 ___dic_monitor_item名称(体温腋下）
                    "nah": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）高 ___dic_monitor_item名称(血气分析Na）
                    "sbph": "3b9f1ea0228711e394d199dd5901706f",//收缩压（mmHg）___dic_monitor_item名称(循环参数-有创收缩压）
                    "glucoseh": "636bd3dce4a211e39b39002186f90e51",//血糖（mmol/L）___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "dbph": "3bc32160228711e38216691e3354258e",//舒张压（mmHg）高 ___dic_monitor_item名称(循环参数-有创舒张压）
                    //"creath": "41bab010228711e3a5ee59394fbd88a8",//血清肌酐Cr（mmol/L）高___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "hrh": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）高  ___dic_monitor_item名称(循环参数-心率）
                    //"bunh": "41bab010228711e3a5ee59394fbd88a8",//尿素氮BUN（mmol/L）高___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "rrh": "2b2a025ef5e411e3aa1060a44cce2086"//,//呼吸频率（次/分）高___dic_monitor_item名称（呼吸监测-呼吸频率实际值）
                    //"hcth": "41bab010228711e3a5ee59394fbd88a8",//血球压积（%）高___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"wbch": "41bab010228711e3a5ee59394fbd88a8"//白细胞（x10^3/mm^3）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }, "minvalue": {
                    "templ": "41bab010228711e3a5ee59394fbd88a8",// 体温低___dic_monitor_item名称(体温腋下）
                    "nal": "d1e26c63e09911e39b39002186f90e51",//血清Na（mmol/L）低 ___dic_monitor_item名称(血气分析Na）
                    "sbpl": "3b9f1ea0228711e394d199dd5901706f",//收缩压（mmHg）低___dic_monitor_item名称(循环参数-有创收缩压）
                    "glucosel": "636bd3dce4a211e39b39002186f90e51",//血糖（mmol/L）低___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "dbpl": "3bc32160228711e38216691e3354258e",//舒张压（mmHg）低___dic_monitor_item名称(循环参数-有创舒张压）
                    //"creatl": "41bab010228711e3a5ee59394fbd88a8",//血清肌酐Cr（mmol/L）低___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "hrl": "3b0d8d00228711e39658c92478bc3c10",//心率（次/分）低___dic_monitor_item名称(循环参数-心率）
                    //"bunl": "41bab010228711e3a5ee59394fbd88a8",//尿素氮BUN（mmol/L）低___dic_monitor_item名称__ 未找到 //目前先对应体温（腋下℃）
                    "rrl": "2b2a025ef5e411e3aa1060a44cce2086"//,//呼吸频率（次/分）低__dic_monitor_item名称（呼吸监测-呼吸频率实际值）
                    //"hctl": "41bab010228711e3a5ee59394fbd88a8",//血球压积（%）低___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    //"wbcl": "41bab010228711e3a5ee59394fbd88a8"//白细胞（x10^3/mm^3）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                }, "badvalue":{
                    //"alb": "41bab010228711e3a5ee59394fbd88a8",//白蛋白（mg/dl）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "fio2": "b379ef19f5f911e3aa1060a44cce2086",//FiO2（%）___dic_monitor_item名称_/血气分析-氧浓度
                    //"bili": "41bab010228711e3a5ee59394fbd88a8",//总胆红素（mg/dl）___dic_monitor_item名称__ 未找到  //目前先对应体温（腋下℃）
                    "acid": "45219890e09311e39b39002186f90e51",//动脉血PH___dic_monitor_item名称/血气分析-酸碱度
                    "po2": "bd0fa999e09511e39b39002186f90e51",//PO2（mmHg）__dic_monitor_item名称/（血气分析-PO2(T) 氧分压）
                    "pco2": "c152c793e09411e39b39002186f90e51"//PCO2（mmHg）__dic_monitor_item名称/（血气分析-PCO2(T) 二氧化碳分压）
                }, "sumvalue":{
                    "uop": "a4968260dfc711e3a85885597115bccc"// 尿量
                }
                }

            }
        ]
    }
}
