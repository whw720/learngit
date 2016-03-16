/**
 * 功能说明: Demo模块
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.sta.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'Ext.data.*',
        'Ext.form.*',
        'Ext.util.*',
        'Ext.view.View'
    ],

    id: 'sta',//注意id一定要与yDesktop.App.getModules 的module保持一致，否则无法通过快捷方式打开 todo

    init: function() {
        Ext.util.CSS.swapStyleSheet('sta.css', '/app/sta/css/sta.css');

        this.launcher = {
            text: '查询统计',
            iconCls: 'sta-small'
        }
    },

    //必须实现此方法
    createNewWindow: function() {
        var me = this,
            desktop = me.app.getDesktop();

        return desktop.createWindow({
            id: me.id,
            title: '查询统计',
            iconCls: 'sta-small',
            width: 1045,
            height: 600,
            animCollapse: false,
            constrainHeader: false,
            border: false,
            layout: {
                type: 'border',
                padding: 5
            },
            defaults: {
                split: false
            },
            items: [{
                region: 'west',
                layout: 'fit',
                border: true,
                split: {
                    size: 5
                },
                items: [
                    this.createPan()
                ]
            }, {
                region: 'center',
                layout: 'fit',
                border: true,
                split: {
                    size: 5
                },
                items: [
                    this.createReport()
                ]
            }]
        });
    },

    //必须实现此方法
    createWindow: function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    },
    //判断病人是否在登陆用户的科室内，为了检查床位选择cookie是否有效
    findPatientIsExist: function (deptId, registerId) {
        var patientIsExist = false;
        Ext.Ajax.request({
            url: window.parent.webRoot + '/nws/carecenter/findpatientisexist',
            method: 'post',
            async: false,
            params: {
                deptId: deptId,
                registerId: registerId
            },
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    patientIsExist = result.data.patientCount > 0;
                }
            }
        });
        return patientIsExist;
    },
    //查询参数
    queryParam: function() {
        var me = this;
        var result = '&ICU_ID=' + userInfo.deptId;
        //从cookie中取值
        var patientInfo = Ext.util.Cookies.get("patientInfo");
        if (patientInfo != null) {
            //防止之前保存cookie信息错误出现异常
            try {
                patientInfo = Ext.decode(patientInfo);
                var patientIsExist = me.findPatientIsExist(userInfo.deptId, patientInfo.REGISTER_ID);
                if (patientIsExist == false) {
                    patientInfo = null;
                }
            } catch (e) {

            }
        }
        if (patientInfo != null) {
            result += '&START_CARE_TIME=' +
                (patientInfo.CARE_START_TIME!=null && patientInfo.CARE_START_TIME.length>=16 ?
                    patientInfo.CARE_START_TIME.substring(0, 16) : "");
            result += '&END_CARE_TIME=' +
                (patientInfo.OUT_TIME!=null && patientInfo.OUT_TIME.length>=16 ?
                    patientInfo.OUT_TIME.substring(0, 16) : "");
            result += '&PATIENT_NAME=' + patientInfo.NAME;
            result += '&HOSPITAL_NUMBER=' + patientInfo.HOSPITAL_NUMBER;
        }
        return result;
    },
    createPan: function() {
        var me = this;
        var sourceMap = {'dc992a44c0a711e4865700262dff6a9e': true,
            'e37136dac0a711e4865700262dff6a9e': true,
            'e7b2a796c0a711e4865700262dff6a9e': true,
            'efcf7d3ec0a711e4865700262dff6a9e': true,
            'f497c533c0a711e4865700262dff6a9e': true,
            '31fa297ac0a811e4865700262dff6a9e': true,
            '36d0bd16c0a811e4865700262dff6a9e': true,
            '3e267e4cc0a811e4865700262dff6a9e': true,
            '42f0294ec0a811e4865700262dff6a9e': true,
            '4753aa0bc0a811e4865700262dff6a9e': true,
            '753e0581e24411e4a181001a64b2b09a':true,
            'bc7379bce4c211e4a8ed002186f90e51':true,
            'fa0fbf2eed6911e4a9ae00262dff6a9e':true,
            'cf1e4447458911e58d4b001a64b2b09a':true};
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            if (sourceMap[resourceData[i].id] == true) {
                sourceMap[resourceData[i].id] = false;
            }
        }
        var panel = Ext.create('Ext.panel.Panel', {
            width: 210,
            minWidth: 220,
            layout: {
                type: 'accordion',
                animate: true
            },
            items: [ {
                xtype: 'treepanel',
                plugins: [
                    {
                        ptype: 'nodedisabled'
                    }
                ],
                title: '查询',
                rootVisible: false,
                useArrows: true,
                autoScroll: false,
                store: new Ext.data.TreeStore({
                    root: {
                        expanded: true,
                        children: [{
                            disabled: sourceMap['dc992a44c0a711e4865700262dff6a9e'],
                            text: '患者情况查询',
                            id: 'sta_4028804d4569bd9e01456d3887cc001c',
                            leaf: true
                        }, {
                            disabled: sourceMap['e37136dac0a711e4865700262dff6a9e'],
                            text: '监护记录查询',
                            id: 'sta_5a9c10a54573fd0f014583234ca80063',
                            leaf: true
                        }, {
                            disabled: sourceMap['e7b2a796c0a711e4865700262dff6a9e'],
                            text: '异常体征查询',
                            id: 'sta_5a9c10a54573fd0f01458383bbc50092',
                            leaf: true
                        }, {
                            disabled: sourceMap['efcf7d3ec0a711e4865700262dff6a9e'],
                            text: '体液平衡查询',
                            id: 'sta_5a9c10a54573fd0f01458db30d0100ff',
                            leaf: true
                        }, {
                            disabled: sourceMap['f497c533c0a711e4865700262dff6a9e'],
                            text: '体温脉搏呼吸记录单',
                            id: 'sta_5a9c10a749c707a0014a291632f70000',
                            leaf: true
                        },{
                            disabled: sourceMap['bc7379bce4c211e4a8ed002186f90e51'],
                            text: '医生用药',
                            id: 'sta_000000004c68305b014cc55c0a640000',
                            leaf: true
                        }]
                    }
                }),
                listeners: {
                    itemclick: function(_this, record, item, index, e, eOpts) {
                        if (record.raw.disabled == false)
                            var currQueryID = record.data.id.split('_')[1];
                            if (currQueryID) {
                                var url = hummerurl + '/report.action?queryId=' + currQueryID + '&isRightEvent=1' + me.queryParam();
                                if (record.raw.disabled == false)
                                    dtmShowInTabSta(currQueryID, record.data.text, url);
                            }
                    }
                }
            },{
                xtype: 'treepanel',
                title: '统计',
                rootVisible: false,
                useArrows: true,
                autoScroll: false,
                plugins: [
                    {
                        ptype: 'nodedisabled'
                    }
                ],
                store: new Ext.data.TreeStore({
                    root: {
                        expanded: true,
                        children: [{
                            disabled: sourceMap['31fa297ac0a811e4865700262dff6a9e'],
                            text: '收治人次统计',
                            id: 'sta_4028805b4581d352014582b8d76e0010',
                            leaf: true
                        },{
                            disabled: sourceMap['36d0bd16c0a811e4865700262dff6a9e'],
                            text: '出科归转情况统计',
                            id: 'sta_4028805b4581d3520145830e26e0001f',
                            leaf: true
                        },{
                            disabled: sourceMap['3e267e4cc0a811e4865700262dff6a9e'],
                            text: '床位使用率统计',
                            id: 'sta_5a9c10a54573fd0f0145881c062600ec',
                            leaf: true
                        }, {
                            //disabled: sourceMap['cf1e4447458911e58d4b001a64b2b09a'],
                            text: '质量控制指标',
                            //id: 'sta_3112',
                            expanded: true,
                            children: [{
                                disabled: sourceMap['cf1e4447458911e58d4b001a64b2b09a'],
                                text: '质量控制指标(卫生部2015)',
                                id: 'sta_3112',
                                leaf: true
                                },{
                                disabled: sourceMap['42f0294ec0a811e4865700262dff6a9e'],
                                text: '质量控制指标(卫生部2011)',
                                id: 'sta_5a9c10a54573fd0f01458dce2f530135',
                                leaf: true
                            }
                            ]
                        },{
                            disabled: sourceMap['4753aa0bc0a811e4865700262dff6a9e'],
                            text: '耗材使用情况统计',
                            id: 'sta_suppliesStatistics',
                            leaf: true
                        }, {
                            disabled: sourceMap['753e0581e24411e4a181001a64b2b09a'],
                            text: '血气分析统计',
                            id: 'sta_3122',
                            leaf: true
                        },{
                            disabled: sourceMap['fa0fbf2eed6911e4a9ae00262dff6a9e'],
                            text: '特护单统计',
                            id: 'sta_4028804d4cfdf302014cfdf567fa0000',
                            leaf: true
                        }]
                    }
                }),
                listeners: {
                    itemclick: function(_this, record, item, index, e, eOpts) {
                        var currQueryID = record.data.id.split('_')[1];
                        if(record.internalId == "sta_suppliesStatistics"){
                            if (record.raw.disabled == false)
                                staShowSuppliesStatistics(currQueryID, record.data.text, url);
                        } else if (record.internalId == "sta_3122") {
                            if (record.raw.disabled == false)
                                staShowbloodgas(record.internalId, '查询统计-' + record.data.text, panel);
                        }else if (record.internalId == "sta_3112") {
                            if (record.raw.disabled == false)
                                staQualityControl(record.internalId, '查询统计-' + record.data.text, panel);
                        }else{
                            if (currQueryID) {
                                var url = hummerurl + '/report.action?queryId=' + currQueryID + '&isRightEvent=1' + me.queryParam();
                                if (record.raw.disabled == false)
                                dtmShowInTabSta(currQueryID, record.data.text, url);
                            }
                        }

                    }
                }
            }]
        });
        return panel;
    },
    createReport: function() {
        var me = this;
        var panel = Ext.create('Ext.tab.Panel', {
            id: 'sta-report-panel',
            plain: true,
            padding: 5,
            tabBar: {
                height: 30,
                defaults: {
                    height: 27
                }
            }
        });
        return panel;
    }
});
function staShowSuppliesStatistics(tabId, tabName, url){
    var panel = Ext.getCmp("accessibility-consumable-count-form"),
        main = Ext.getCmp('sta-report-panel');
    if (!panel) {
        panel = Ext.create('com.dfsoft.icu.dtm.accessibility.ConsumableCountForm', {
            parent: this
        });
       // panel.id = tabId;
       // panel.name = tabId;
        panel.title = "<div style='padding-top: 1px;'>" + tabName + "</div>";
        var p = main.add(panel);
        main.setActiveTab(p);
    }else{
        main.setActiveTab(panel);
    }
}
function staShowbloodgas(tabId, tabName, url){
    var panel = Ext.getCmp("sta_blood_gas_form_panel"),
        main = Ext.getCmp('sta-report-panel');
    if (!panel) {
        panel = Ext.create('com.dfsoft.icu.sta.bloodgas.BloodGasForm', {
            parent: this
        });
        // panel.id = tabId;
        // panel.name = tabId;
        panel.title = "<div style='padding-top: 1px;'>" + tabName + "</div>";
        var p = main.add(panel);
        main.setActiveTab(p);
    }else{
        main.setActiveTab(panel);
    }
}
function staQualityControl(tabId, tabName, url){
    var panel = Ext.getCmp("quality-control-form-1"),
        main = Ext.getCmp('sta-report-panel');
    if (!panel) {
        panel = Ext.create('com.dfsoft.icu.sta.qualitycontrol.QualityControlForm', {
            parent: this
        });
        // panel.id = tabId;
        // panel.name = tabId;
        panel.title = "<div style='padding-top: 1px;'>" + tabName + "</div>";
        var p = main.add(panel);
        main.setActiveTab(p);
    }else{
        main.setActiveTab(panel);
    }
}
var remoteObj
//麻醉数据showW
function dtmShowInTabSta(tabId, tabName, url) {
    //解析Url参数
    var paramsObject = parseUrl(url);
    if (paramsObject.register_id) {
        tabId = tabId + '_' + paramsObject.register_id;
    }
    //iframe html 模板
    var iframeTemplate = new Ext.Template('<iframe style="display:block"' +
        ' id="iframe_{id}" name="iframe_{name}" frameborder="0" src="{url}"' +
        ' width="100%" height="100%"></iframe>');
    var panel = Ext.getCmp(tabId),
        main = Ext.getCmp('sta-report-panel');
    var iframeHtml = iframeTemplate.apply({
        id: tabId,
        name: tabId,
        url: url
    });
    if (!panel) {
        /**
         * 判断是否同域,如果不同域，通过easyXDM 创建iframe
         */
        var isSame = isSameDomain(url);
        if (!isSame) {
            iframeHtml = ""; //通过easyXDM 创建IFRAME
        }

        panel = {
            id: tabId,
            title: "<div style='padding-top: 1px;'>" + tabName + "</div>",
            closable: true,
            border: true,
            layout: 'fit',
            html: iframeHtml
        }
        var p = main.add(panel);
        main.setActiveTab(p);

        if (!isSame) {
            var remote = new easyXDM.Rpc({
                remote: url,
                local: webRoot + "/lib/easyxdm/name.html",
                swf: webRoot + "/lib/easyxdm/easyxdm.swf",
                container: tabId + "-body",
                props: {
                    width: "100%",
                    height: "100%",
                    id: "iframe_" + tabId
                }
            }, {
                local: {
                    showInTab: dtmShowInTabSta,
                    showInWindow:dtmShowInWindowSta,
                    showMessage:dtmShowInWindowSta
                },
                remote:{
                    reloadData:{}
                }
            });
            remoteObj=remote;
        }
    } else {
        main.setActiveTab(panel);
    }
}
function dtmShowInWindowSta(windowName, url, width, height,callback) {
    var me=this;
    if(width==null) width=500;
    if(height==null) width=400;
    var params=parseUrl(url);
    var myWindow = null;
    if(params.indexType){
        myWindow=Ext.create('com.dfsoft.icu.sta.QtisWindow', {
            title		: windowName,
            height		: height,
            width		: width,
            closable 	: true,
            constrain   : false, // 限制拖动范围
            modal 		: true,
            border 	 	: false,
            layout 		: 'fit',
            fitToFrame 	: true,
            resizable   : false,
            indexType:(params.indexType+'').replace('-','')
        });
        myWindow.show();
    }else{
        myWindow=Ext.create('com.dfsoft.icu.sta.StaMessageBox',{
            msg:params.msg,
            url:url,
            params:params,
            remoteObj:remoteObj
        })
    }
}

/**
 * 判断url与当前页面是否存在跨域的问题
 * @param url
 */
function isSameDomain(url) {
    var urlObj = parse_url(url);
    if (urlObj.scheme == null || urlObj.scheme == "") {
        return true;
    }
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var currentPort = window.location.port;

    if (urlObj.scheme != currentProtocol || urlObj.host != currentHost || urlObj.port != currentPort) {
        return false;
    }
    return true;
}

/**
 * 解析url
 * @param str
 * @param component
 * @returns
 */
function parse_url(str, component) {
    // *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    // *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
    var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'
        ],
        ini = (this.php_js && this.php_js.ini) || {},
        mode = (ini['phpjs.parse_url.mode'] &&
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i];
        }
    }

    if (component) {
        return uri[component.replace('PHP_URL_', '').toLowerCase()];
    }
    if (mode !== 'php') {
        var name = (ini['phpjs.parse_url.queryKey'] &&
            ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        uri[key[12]].replace(parser, function($0, $1, $2) {
            if ($1) {
                uri[name][$1] = $2;
            }
        });
    }
    delete uri.source;
    return uri;
}