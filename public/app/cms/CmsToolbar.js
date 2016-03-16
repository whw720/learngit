/**
 * 功能说明: 中央监护站工具栏
 * @author: 王小伟
 */
Ext.define('com.dfsoft.icu.cms.CmsToolbar', {
    extend: 'com.dfsoft.icu.nws.NwsToolbar',
    requires: ['com.dfsoft.icu.nws.NwsToolbar'],
    constructor: function(config) {
        Ext.apply(this, config);
        var proxy = this;
//        var warningPanel = {
//            xtype: 'buttongroup',
//            title: '警示',
//            height: 96,
//            layout: 'fit',
//            name: 'warning_div',
//            minWidth: 10,
//            html: '<div class="cms-warningdiv" ></div>' +
//                '<audio src="/audio/sound/warning.wav"  id="music_warning" name="music_warning"></audio >'
//        };
        var warningPanel =  {
            xtype: 'buttongroup',
                title: '警示',
            height: 96,
            layout: 'fit',
            padding:'0',
            name: 'warning_div',
            minWidth: 110,
            //items:[this.warning]
            items:[]

//                html: '<div id="alarm_panel" class="dws-warningdiv" ></div>' +
//                    '<audio src="/audio/sound/warning.wav"  id="music_warning" name="music_warning"></audio >'
        };
        this.callParent([config]);
        //删除床位管理，增加监控中心
        var buttonGroup = this.toolbar.items.items[0];
        buttonGroup.remove(buttonGroup.items.items[0]);
        
        //删除未执行医嘱面板
        this.toolbar.remove(this.toolbar.items.items[5]);

        //删除医嘱提取统计
        this.toolbar.remove(this.toolbar.items.items[5]);

//        var doctorLog = Ext.ComponentQuery.query('buttongroup[name="doctor_log"]')[0];
//
//        this.toolbar.remove(doctorLog);

        //添加生命体征警示
        this.toolbar.add(warningPanel);

        this.careCenterButton = new Ext.button.Button({
            text: '监护中心',
            id: proxy.nwsApp.id + '_148014c0ba3811e3b95d3d6e35b3dec9',
            disabled: true,
            iconCls: 'care-center-button',
            cls: 'nwsLargeButton',
            scale: 'large',
            iconAlign: 'top',
            height: this.BUTTON_HEIGHT_2,
            width: this.BUTTON_WIDTH_2,
            handler: function() {
                for (var i = 0; i < proxy.nwsApp.tabPanel.items.items.length; i++) {
                    if (proxy.nwsApp.tabPanel.items.items[i].title == this.text) {
                        proxy.nwsApp.tabPanel.setActiveTab(i);
                        return;
                    }
                }
                proxy.careCenterPanel = new com.dfsoft.icu.nws.CareCenterPanel({
                    nwsApp: proxy.nwsApp,
                    title: '监护中心',
                    closable: true
                });
                proxy.nwsApp.tabPanel.add(proxy.careCenterPanel);
                proxy.nwsApp.tabPanel.setActiveTab(proxy.careCenterPanel);
            }
        });
//        buttonGroup.insert(0, this.careCenterButton);
        // 权限控制医生工作站工具栏
        var resourceData = userInfo.resource;
        for (var i = 0; i < resourceData.length; i++) {
            var currButton = Ext.getCmp(proxy.nwsApp.id + '_' + resourceData[i].id);
            if (currButton != undefined) {
                currButton.setDisabled(false);
            }
        }
        this.on('afterrender', function(p, eOpts) {
            if (proxy.nwsApp.bedPanel.patientInfo != null) {
                // 连接服务器，发送查询报警信息请求
                var socket = io.connect(parent.webRoot);
                // 请求查询数据
                var params = [{
                    registerId: proxy.nwsApp.bedPanel.patientInfo.REGISTER_ID,
                    careTime: Ext.Date.format(new Date(), 'Y-m-d H:i')
                }];
                socket.emit('careAnimaWarning',params[0]);
//                // 接受告警信息并在页面展示
                socket.on('AnimaWarningdata', function(data){
                    var alarmDiv = Ext.select("div.cms-warningdiv");
                    alarmDiv =  alarmDiv.elements[0];
                    var isPlay = false;
                    if(alarmDiv!=undefined){
                    alarmDiv.innerHTML = "";
                    if(data.length > 0){
                        for(var i = 0;i < data.length;i++){
                            alarmDiv.innerHTML = alarmDiv.innerHTML + '<div style="color:#F00;height:19px;padding:0;margin:0;cursor:default;">【' +data[i].name +'】 值：'+ data[i].CARE_VALUE + '<span style="color:#4D924D;padding:0;"> 护理时间：' +new Date(data[i].CARE_TIME).Format("yyyy-MM-dd hh:mm") + '</span></div>';
                        }
                    }
                    if (isPlay) {
                        document.getElementById('music_warning').play();
                    }}

                });
            }
        });
        // 重新设置警示框宽度
        this.on('resize', function(_this, width, height, oldWidth, oldHeight, eOpts) {

//            var doctorLog = Ext.ComponentQuery.query('buttongroup[name="doctor_log"]')[0];
//            this.remove(doctorLog);
//

            var divObj = this.down('[name=warning_div]');
          //  console.log(width);
            divObj.setWidth(width - 1035 + 138);
           // console.log(divObj);


        });


    }
});