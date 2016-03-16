/**
 * 功能说明:  护理评分 tree
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.NursingScoresMenu', {
    extend: 'Ext.menu.Menu',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.tiss.TissForm',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm',
        'com.dfsoft.icu.nws.nursingscores.apachetwo.ApacheTwoForm',
        'com.dfsoft.icu.nws.nursingscores.apachefour.ApacheFourForm',
        'com.dfsoft.icu.nws.nursingscores.mods.ModsForm',
        'com.dfsoft.icu.nws.nursingscores.sofa.SofaForm',
        'com.dfsoft.icu.nws.nursingscores.lods.LodsForm',
        'com.dfsoft.icu.nws.nursingscores.ards.ArdsForm',
        'com.dfsoft.icu.nws.nursingscores.sapstwo.SapsTwoForm',
        'com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeForm',
        'com.dfsoft.icu.nws.nursingscores.mpmone.MpmOneForm',
        'com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoForm',
        'com.dfsoft.icu.nws.nursingscores.timiriskst.TimiriskStForm',
        'com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstForm',
        'com.dfsoft.icu.nws.nursingscores.wellscriteriafordvt.WellsCriteriaForDVTForm',
        'com.dfsoft.icu.nws.nursingscores.wellscriteriaforpe.WellsCriteriaForPEForm',
        'com.dfsoft.icu.nws.nursingscores.gcs.GCSForm',
        'com.dfsoft.icu.nws.nursingscores.rass.RASSForm',
        'com.dfsoft.icu.nws.nursingscores.obese.ObeseForm',
        'com.dfsoft.icu.nws.nursingscores.vpossum.VPossumForm',
        'com.dfsoft.icu.nws.nursingscores.possum.PossumForm',
        'com.dfsoft.icu.nws.nursingscores.ppossum.PPossumForm',
        'com.dfsoft.icu.nws.nursingscores.opossum.OPossumForm',
        'com.dfsoft.icu.nws.nursingscores.crpossum.CrPossumForm',
        'com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreForm',
        'com.dfsoft.icu.nws.nursingscores.odin.OdinForm',
        'com.dfsoft.icu.nws.nursingscores.lemon.LemonForm',
        'com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissForm'
    ],
    constructor: function (config) {
        Ext.util.CSS.swapStyleSheet('nursingscores.css', '/app/nws/nursingscores/css/nursingscores.css');
        Ext.apply(this, config);
        var proxy = this;
        var me = this;
        Ext.Ajax.request({
            url: webRoot + '/nws/icu/care_scores/getScores',
            method: 'GET',
            async: false,
            scope: me,
            success: function (response) {
                var respText = Ext.decode(response.responseText).children;
                var getItemTreeNode = function (items) {

                    var nodes = [];
                    for (var i = 0; i < items.length; i++) {
                        var id, text;
                        if (items[i].data) {
                            id = items[i].data.id;
                            text = items[i].data.text;
                        } else {
                            id = items[i].id;

                            text = items[i].text;
                            if (text != '危重评分' && text != '创伤评分' && text != '手术麻醉风险预测') {
                                text = text + ' - ' + items[i].description;
                            }

                        }
                        var root = (function (id, text) {
                            return{

                               // id: id,
                                text: text,
                                iconCls: 'icon-care-scores',
                                handler: function () {
                                    var strn = text.lastIndexOf("-");
                                    if (strn != -1) {
                                        var titleStr = text.substring(0, text.lastIndexOf("-") - 1);
                                        if (titleStr == "TIMI Risk-ST - 急性心肌梗死溶栓风险评"){
                                            titleStr = titleStr.substring(0, titleStr.lastIndexOf("-") - 1);
                                        }else if(titleStr == "TIMI Risk-UST - 急性心肌梗死溶栓风险评"){
                                            titleStr = titleStr.substring(0, titleStr.lastIndexOf("-") - 1);
                                        }
                                        for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                                            if (proxy.nwsApp.tabPanel.items.items[i].title == titleStr) {
                                                proxy.nwsApp.tabPanel.setActiveTab(i);
                                                return;
                                            }
                                        }
                                        //添加不同评分 开始
                                        if (titleStr == "TISS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.tiss.TissForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                        } //添加不同评分结束
                                        if (titleStr == "TISS 28") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                        }
                                        if (titleStr == "APACHE Ⅱ") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.apachetwo.ApacheTwoForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "APACHE Ⅳ") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.apachefour.ApacheFourForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "MODS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.mods.ModsForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "SOFA") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.sofa.SofaForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "LODS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.lods.LodsForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "ARDS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.ards.ArdsForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "SAPS Ⅱ") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.sapstwo.SapsTwoForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "SAPS Ⅲ") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.sapsthree.SapsThreeForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "MPM Ⅱ-0") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.mpmone.MpmOneForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "MPM Ⅱ-24-72") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.mpmtwo.MpmTwoForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "TIMI Risk-ST") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.timiriskst.TimiriskStForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "TIMI Risk-UST") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.timiriskust.TimiriskUstForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "Well’s Criteria for DVT") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.wellscriteriafordvt.WellsCriteriaForDVTForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "Well’s Criteria for PE") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.wellscriteriaforpe.WellsCriteriaForPEForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "GCS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.gcs.GCSForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "RASS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.rass.RASSForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "OBESE") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.obese.ObeseForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "V-POSSUM") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.vpossum.VPossumForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "POSSUM") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.possum.PossumForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "P-POSSUM") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.ppossum.PPossumForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "O-POSSUM") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.opossum.OPossumForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "Cr-POSSUM") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.crpossum.CrPossumForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "EuroSCORE") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.euroscore.EuroScoreForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "ODIN") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.odin.OdinForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "LEMON") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.lemon.LemonForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                        if (titleStr == "ISS-RTS-TRISS") {
                                            proxy.bodyTemperaturePanel = new com.dfsoft.icu.nws.nursingscores.issrtstriss.IssRtsTrissForm({
                                                patientInfo: proxy.nwsApp.bedPanel.patientInfo,
                                                nwsApp: proxy.nwsApp,
                                                mod:me.mod
                                            });
                                            proxy.nwsApp.tabPanel.add(proxy.bodyTemperaturePanel);
                                            proxy.nwsApp.tabPanel.setActiveTab(proxy.bodyTemperaturePanel);
                                            proxy.bodyTemperaturePanel.doLayout();
                                        }
                                    }
                                }
                            }
                        })(id, text);

                        if (items[i].children && items[i].children.length > 0) {
                            root.menu = getItemTreeNode(items[i].children)
                        }
                        nodes.push(root);
                    }
                    return nodes;
                };
                me.menus = getItemTreeNode(respText);
            }
        });
        Ext.apply(me, {
            items: me.menus
        })
        me.callParent();
    }

});
