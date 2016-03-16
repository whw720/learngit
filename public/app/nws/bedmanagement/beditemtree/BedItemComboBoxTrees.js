Ext.define('com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemComboBoxTrees', {
    extend: 'com.dfsoft.icu.nws.bedmanagement.beditemtree.ComboBoxTrees',
    alias: 'widget.beditemcomboboxtree',
    requires: [
        'com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore'
    ],
    constructor: function (config) {
        Ext.apply(this, config);
        Ext.QuickTips.init();
        var me = this;
        me.code = "";
        var tooltips;
        var top = 0;
        var left = 0;
        var BedItemStore = new com.dfsoft.icu.nws.bedmanagement.beditemtree.BedItemTreeStore();
        BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBoxs/' + me.bed_id;
        //BedItemStore.load();
        this.getSelsJson = function () {
            if (me.picker == undefined) {
                return "";
            } else {
                var records = me.picker.getView().getChecked();
                var codeNames = "",selectCodes="";
                Ext.Array.each(records, function (rec) {
                    codeNames = codeNames + '{"code":"' + rec.get('id') + '","name":"' + rec.get('text') + '"},';
                    selectCodes += rec.get('id') + ",";
                });
                if (selectCodes != ""){
                    me.code = selectCodes.substring(0, selectCodes.length - 1);
                }else{
                    me.code="";
                }
                codeNames = '[' + codeNames.substr(0, codeNames.length - 1) + ']';
                return codeNames;
            }
        },
            this.selectCode = function (data,bed_id) {
                me.bed_id = bed_id;
                if (data == null) {
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBoxs/' + bed_id;
                    me.picker.selectPath('/root');
                    BedItemStore.reload();
                } else {
                    data = Ext.decode(data);
                    var code = "";
                    for (var i = 0; i < data.length; i++) {
                        code = code + data[i].code + ",";
                    }
                    if (code != ""){
                        code = code.substring(0, code.length - 1);
                    }
                    me.code = code;
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getSelectBedItemComboBoxs/' + bed_id + '/' + code;
                    me.picker.selectPath('/root');
                    BedItemStore.reload();
                }
            },
            this.changebedid = function (bed_id) {
                me.bed_id = bed_id;
                BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBoxs/' + bed_id;

                me.picker.selectPath('/root');
                BedItemStore.load();
            },
            this.reloadItem = function (bed_id) {
                BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getBedItemComboBoxs/' + me.bed_id;
                me.picker.selectPath('/root');
                BedItemStore.reload();
            },
            this.addItem = function (code) {
                var codeNames = "";
                if (me.code == null || me.code == '' || me.code == undefined) {
                    var records = me.picker.getView().getChecked();

                    Ext.Array.each(records, function (rec) {
                        codeNames += rec.get('id') + ",";
                    });

                    if (codeNames != ""){
                        codeNames = codeNames.substring(0, codeNames.length - 1);
                    }
                    me.code = codeNames + "," + code;
                }else{
                    me.code += "," + code;
                }
                //me.code = codeNames + "," + code;
                if (me.code == null || me.code == '' || me.code == undefined) {
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getSelectBedItemComboBoxs/' + me.bed_id + '/null';
                } else {
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getSelectBedItemComboBoxs/' + me.bed_id + '/' + me.code;
                }
                me.picker.selectPath('/root');
                BedItemStore.load();
            },
            this.subItem = function (code) {
                if (me.code == null || me.code == '' || me.code == undefined) {
                    var records = me.picker.getView().getChecked();
                    var codeNames = "";
                    Ext.Array.each(records, function (rec) {
                        me.code = me.code + "," + rec.get('id');
                    });
                }
                me.code = me.code.replace(code, "");
                if (me.code == null || me.code == '' || me.code == undefined) {
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getSelectBedItemComboBoxs/' + me.bed_id + '/null';
                } else {
                    BedItemStore.proxy.url = webRoot + '/nws/icu_beds/getSelectBedItemComboBoxs/' + me.bed_id + '/' + me.code;
                }
                me.picker.selectPath('/root');
                BedItemStore.load();
            },
            me.callParent([
                {
                    hiddenName: 'department',
                    width: 137,
                    //matchFieldWidth:false,
                    //listConfig : { width: 280},
                    labelWidth: 58,
                    fieldLabel: '监护项目',
                    rootVisible: false,
                    displayField: 'text',
                    editable: false,
                    value: '已过滤',
                    multiSelect: true,
                    store: BedItemStore,
                    listeners: {
                        render: function (p) {//渲染后给el添加mouseover事件
                            p.getEl().on('mouseover', function (e) {
                                if (me.picker == undefined) {
                                    return "";
                                } else {
                                    var records = me.picker.getView().getChecked();
                                    var height = 30 * records.length;
                                    if (records.length == 0 || height > 300)height = 300;
                                    var tipnames = "";
                                    Ext.Array.each(records, function (rec) {
                                        if (rec.get('parentId') == 'root') {
                                            if (tipnames != "" && tipnames.substring(tipnames.length - 1, tipnames.length) == ',')tipnames = tipnames.substring(0, tipnames.length - 1);
                                            tipnames = tipnames + "<br>" + rec.get('text') + "";
                                        } else {
                                            tipnames = tipnames + "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + rec.get('text') + "";
                                        }
                                    });
                                    tipnames = tipnames.substring(4, tipnames.length);
                                    var tiphtml = "<div id=\"tipdiv\" style=\"height:" + height + "px;width:120px;overflow:auto;\">" + tipnames + "</div>";
//                            new Ext.ToolTip({
//                                target: Ext.get('tiptext').dom.id,
//                                html: tiphtml,
//                                autoHide: false,
//                                closable: true,
//                                draggable: true
//                            });
                                    p.getEl().dom.setAttribute("data-qtip", tiphtml);
                                    //动态生成div
//                            var event =window.event;
//                    		var tipdiv = document.getElementById("tipdiv");
//                    		if(top==0)top=event.clientY;
//                    		if(left==0)left=event.clientX;
//                            if (tipdiv==null) {
//                                var tipdiv = document.createElement("div");
//                                tipdiv.style.zIndex = 99999;
//                                tipdiv.style.position = "absolute";
//                                tipdiv.style.top = top+"px";     
//                                tipdiv.style.left = left+35+"px"; 
//                                tipdiv.style.height = height+"px";   
//                                tipdiv.style.width = "182px";
//                                tipdiv.style.overflow="auto";
//                                tipdiv.style.backgroundColor="#B9DADA";
//                                tipdiv.tabIndex=-1;
//                                tipdiv.id = "tipdiv";
//                                tipdiv.innerHTML=tipnames;
//                                document.body.appendChild(tipdiv);
//                            }
//                            me.picker.hide();
                                }
                            });
                            p.getEl().on('mouseout', function (p) {
                                var tipdiv = document.getElementById("tipdiv");
                                if (tipdiv != null) {
                                    //document.body.removeChild(tipdiv);
                                }
                            });
                            p.getEl().on('mousewheel', function (e) {
                                var tipdiv = document.getElementById("tipdiv");
                                if (tipdiv != null) {
                                    if (window.event.wheelDelta == -120) {
                                        tipdiv.scrollTop += 20;
                                    } else if (window.event.wheelDelta == 120) {
                                        tipdiv.scrollTop -= 20;
                                    }
                                }

                            });
                            p.getEl().on('click', function (e) {
                                var tipdiv = document.getElementById("tipdiv");
                                if (tipdiv != null) {
                                    //document.body.removeChild(tipdiv);
                                }
                            });
                        }
                    }
                }
            ]);
    }
});