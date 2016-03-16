/**
 * 功能说明:  帮助 window
 * @author: zag
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.ScorePopWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'com.dfsoft.icu.nws.nursingscores.tiss.TissForm',
        'com.dfsoft.icu.nws.nursingscores.tisstwentyeight.TissTwentyEightForm',
        'com.dfsoft.icu.nws.nursingscores.apachetwo.ApacheTwoForm',
        'com.dfsoft.icu.nws.nursingscores.apachetwo.ApacheTwo_SpecialEventForm',
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
    /*
     * 窗口初始化值：
     * scoreCode 评分项目代码（唯一，通过代码查询评分项目信息）。
     * patientInfo 患者信息
     * careTime 创建时间
     * mod 窗口模式，在哪打开的窗口，处理ID冲突问题。
     * */
    initComponent: function (config) {
        //careRecordPanel   dataIndex

        var me = this;



       // console.log(me.careTime);
        me.scoreInfo = "";
        me.winWidth = 800;
        me.winHeight = 500,
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getScoreInfo/' + me.scoreCode,
            method: 'GET',
            async: false,
            scope: me,
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    me.scoreInfo = reqmsg.data;
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
        if( me.scoreCode == '9a177b5db18811e3aa8800271396a820'){//apache4 窗口 width 900 其他默认 800
            me.winWidth = 1000;
        }else if(me.scoreCode == 'ac3b17f0af4811e387589951d960470f'){     //ISS 评分窗口
            me.winWidth = 930;
        };
        if(me.scoreCode=='64245769b18711e3aa8800271396a820'||me.scoreCode=='641ca522b18711e3aa8800271396a820'||me.scoreCode=='64145b42b18711e3aa8800271396a820'||me.scoreCode=='640c8983b18711e3aa8800271396a820'||me.scoreCode=='64059279b18711e3aa8800271396a820'||me.scoreCode=='63f0a832b18711e3aa8800271396a820'||me.scoreCode=='63f6be03b18711e3aa8800271396a820'||me.scoreCode=='63fef784b18711e3aa8800271396a820'){
            me.winWidth = 1150;
          //  me.winHeight=550;
        }
        me.scoreClassName = me.scoreInfo[0].CLASS_NAME; // 类名称
        me.ttile = me.scoreInfo[0].NAME + '评分项目'; //窗口标题。
        if(me.mod=='nws_specialevent')me.scoreClassName='apachetwo.ApacheTwo_SpecialEventForm';
        var scoreClass = 'com.dfsoft.icu.nws.nursingscores.' + me.scoreClassName;
        me.scoreItem = Ext.create(scoreClass,
            {header:false, closable: false, mod: me.mod,nwsApp:me.nwsApp, patientInfo: me.patientInfo, popw:me,margin:0,careTime:me.careTime});

        Ext.apply(me, {
            title: me.ttile,
            header: true,
            //iconCls: 'ico-help',
            layout: 'fit',
            width:  me.winWidth,
            height: me.winHeight,
            padding:0,
            items: [
                me.scoreItem
            ]
        });
        me.callParent();
    },
    //获取评分项信息
    getScoreItemInfo: function (coresCode) {
        var scoreInfo = "";
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getScoreInfo/' + coresCode,
            method: 'GET',
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    scoreInfo = reqmsg.data;
                } else {
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
        return scoreInfo;
    },

    //显示模态窗口
    showModalWindowPop: function (win) {
        var me = this;
        //创建遮罩效果
        me.loadMask = new Ext.LoadMask(me, {
            msg: "数据加载中...",
            useMsg: false
        });
        me.hasModalChild = true;
        me.loadMask.show();
        win.on("close", function (_panel, eOpts) {
            me.loadMask.hide();
            me.hasModalChild = false;
        }, this);
        win.show();
    },
    /*
    * 功能说明：评分项保存到护理记录。
    *score 得分
    * items 项目明细
    * showType 在特护单显示方式， 1 显示 总得分   2 显示  项目明细
    * */
    saveRecordScore:function(score,items,scoreId,showType){
        var me = this;

         var scoreValue = "";// 得分 json串  如：{"showType":1,"score":23,items:"E2V4M5"}
        // 判断是否是护理记录打开窗口
        if(me.mod.indexOf("care_record") != -1){
            // showType  1 显示得分   2 显示详细
            scoreValue = '{"showType":' + showType + ',"score":"'+ score +'",items:"' + items + '","scoreId":"'+scoreId+'"}';
           // console.log(scoreValue);

            // 写入护理记录
            me.careRecordPanel.saveScoreValue(me.dataIndex,scoreValue);
           // me.close();

        }
    }
});