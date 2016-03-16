/**
 * Created by Administrator on 14-4-1.
 */

Ext.define('com.dfsoft.icu.nws.nursingscores.ScorePubFun', {
    /*
     * 方法功能：公用弹出窗口
     * mod: 打开窗口类型：如：护士站打开、医生站打开等等
     * pobj:父对象
     * cwin:弹出窗口对象
     * */
    cdLength: 1000,//病情描述最大长度
    popWindow: function (mod, pobj, cwin) {
        if (mod.substring((mod.length - 6), mod.length) == "record") {
            mod = mod.substring((mod.length - 6), mod.length);
        }
        if (mod == 'dws') {
            pobj.nwsApp.showModalWindowDws(cwin);
        } else if (mod == 'nws') {
            pobj.nwsApp.showModalWindow(cwin);
        } else if (mod == 'record') {
            pobj.popw.showModalWindowPop(cwin);
        } else {
            pobj.nwsApp.showModalWindow(cwin);
        }
    },
    showLoad: function (sObj) {
        var elm = new Ext.LoadMask(me, {
            msg: "数据加载中。。。"
        });
    },
    /*
     * 功能：取短时间格式，如 传入："2014-05-23 23:21:10"  返回： "05-23 23:21"
     *
     *
     * */
    formatTimeToGrid: function (inputTime) {
        var outTime = "";
        outTime = inputTime.substr(5, 11);
        if (inputTime.substr(5, 1) == '0') {
            outTime = inputTime.substr(6, 10)
        }
        return outTime;
    },
    /*
     * 功能说明：评分项目目输入项目验证。
     * vp : 验证结果  truea或false
     * */
    veriPower: function (vp) {
        return vp;  // 限制不能为空
        // return true;// 不限制
    },
    /*
     * 功能说明：取消评分项普通grid选择项。
     * */
    gridCancelSel: function (gridObj) {
        var rowCon = gridObj.getStore().getCount();
        for (var j = 0; j < rowCon; j++) {
            var recordtt = gridObj.getStore().getAt(j);
            recordtt.set('SEL', false);
            recordtt.commit();
        }

    },
    showMe: function (t, d) {
        Ext.Msg.alert(t, d);
    },
    /*
     * 功能说明：提取SPS数据时间选择
     *
     * */
    apsDatefield: function () {
        var apsDate = new Ext.form.field.Date({
            width: 220,
            format: 'Y-m-d',
            name: 'apsDate',
            labelAlign: 'right',
            fieldLabel: '获取检验数据',
            value: new Date((new Date()).getTime() - (24 * 60 * 60 * 1000)).Format("yyyy-MM-dd")
        });
        return apsDate;
    },
    /*
     * 评分时间
     * */

    scoreTime: function () {
        return '评分时间：' + (new Date()).Format("yyyy-MM-dd");
    },
    /*
     * 获取APS数据
     *registerId 患者登记ID
     * pickDate 取数时间
     * scoreCode 评分项目代码
     * intervalTime 间隔时间  24小时 48小时  72小时  默认24小时。
     * */
    getApsData: function (registerId, pickDate, scoreCode, intervalTime, cb) {
        // alert(intervalTime);
        var startTime = "";
        var endTime = "";
        endTime = new Date(pickDate).Format("yyyy-MM-dd 23:59:59");
        if (intervalTime == 24) {
            startTime = new Date(pickDate).Format("yyyy-MM-dd 00:00:00");
        } else if (intervalTime == 48) {
            startTime = this.DateAdd('h', -48, (new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
        } else if (intervalTime == 72) {
            startTime = this.DateAdd('h', -72, (new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
        }
        var apsData = {};
        Ext.Ajax.request({
            url: parent.webRoot + '/nws/getAps',
            method: 'POST',
            params: {
                registerId: registerId,
                startTime: startTime,
                endTime: endTime,
                scoreCode: scoreCode
            },
            success: function (response) {
                var reqmsg = Ext.decode(response.responseText);
                if (reqmsg.success === true) {
                    apsData = reqmsg.data;
                    // console.log(apsData);
                    cb(apsData);
                } else {
                    apsData = "";
                    request.showErr(reqmsg.errors, '加载');
                }
            }
        });
    },
    /**
     * 通用方法，弹出面板。
     * @param registerId
     * @param pickDate
     * @param scoreCode
     * @param intervalTime
     * @param toppanel
     */
    getCommonData:function(registerId, pickDate, scoreCode, intervalTime,toppanel,me){
        if(!intervalTime){
            intervalTime=24;
        }
        var startTime = "";
        var endTime = new Date(pickDate).Format("yyyy-MM-dd 23:59:59");
        if(intervalTime == 24){
            startTime = new Date(pickDate).Format("yyyy-MM-dd 00:00:00");
        }else if(intervalTime == 48){
            startTime = this.DateAdd('h',-48,(new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
        }else if(intervalTime == 72){
            startTime = this.DateAdd('h',-72,(new Date(pickDate))).Format("yyyy-MM-dd 00:00:01");
        }
        me.nwsApp.showModalWindow(Ext.create('com.dfsoft.icu.nws.nursingscores.commonset.AutoSetWindow', {
            registerId:registerId,
            startTime:startTime,
            scoreCode:scoreCode,
            endTime:endTime,
            parent:me,
            toppanel:toppanel
        }));
    },
    // APS控件赋值
    setApsValue: function (itemobj, apsData) {

        var me = this;
        if (itemobj.name === undefined) {
            if (itemobj.items === undefined) {
                return '';
            }
            Ext.each(itemobj.items.items, function (item) {
                return me.setApsValue(item, apsData);
            })
        } else {
            // console.log(apsData);
            for (var p in apsData) {
                if (itemobj.name == p) {
                    //alert(typeof(eval("apsData."+p)) + "------"+p);
//                    if(typeof(eval("apsData."+p)) == 'number'){
//                        itemobj.setValue(eval("apsData."+p));
//                    }
                    if (eval("apsData." + p) != "null" || eval("apsData." + p) != "") {
                        itemobj.setValue(eval("apsData." + p));
                    }
                }
            }
        }
    },
    /**
     * 设置NAME 字段的值
     * @param itemobj
     * @param ageStr
     */
    setNameValue:function(itemobj,ageStr){
        if(itemobj.getForm().findField('age')&&ageStr&&ageStr!=""){
            if(ageStr.indexOf('岁')>=0){
                var age=ageStr.substr(0,ageStr.indexOf('岁'));
                if(Number(age)>0){
                    itemobj.getForm().findField('age').setValue(Number(age));
                }
            }else if(!isNaN( ageStr ) ){
                itemobj.getForm().findField('age').setValue(Number(ageStr));
            }else{
                itemobj.getForm().findField('age').setValue(0);
            }
        }
    },
    /**
     * 设置 GCS 字段的值
     * @param itemobj
     * @param ageStr
     */
    setGcsValue:function(itemobj,registerId,startTime,endTime){
        if(itemobj.getForm().findField('Eyes')){
            Ext.Ajax.request({
                url: parent.webRoot + '/nws/getGCSRange',
                method: 'POST',
                params:{
                    registerId:registerId,
                    startTime:startTime,
                    endTime:endTime
                },
                success: function (response) {
                    var reqmsg = Ext.decode(response.responseText);
                    if (reqmsg.success === true) {
                        if(reqmsg.data){
                            itemobj.getForm().findField('Eyes').setValue(reqmsg.data.Eyes);
                            itemobj.getForm().findField('Language').setValue(reqmsg.data.Language);
                            itemobj.getForm().findField('Motor').setValue(reqmsg.data.Motor);
                        }
                    } else {
                        request.showErr(reqmsg.errors, '加载');
                    }
                }
            });
        }
    },
    DateAdd: function (interval, number, date) {
        //确保为date类型:
        switch (interval.toLowerCase()) {
            case "y":
                return new Date(date.setFullYear(date.getFullYear() + number));
            case "m":
                return new Date(date.setMonth(date.getMonth() + number));
            case "d":
                return new Date(date.setDate(date.getDate() + number));
            case "w":
                return new Date(date.setDate(date.getDate() + 7 * number));
            case "h":
                return new Date(date.setHours(date.getHours() + number));
            case "n":
                return new Date(date.setMinutes(date.getMinutes() + number));
            case "s":
                return new Date(date.setSeconds(date.getSeconds() + number));
            case "l":
                return new Date(date.setMilliseconds(date.getMilliseconds() + number));
        }
    }
});