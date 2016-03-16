/*
 系统设置--->选项
 */

Ext.define('com.dfsoft.lancet.sys.settings.Options', {
    extend: 'Ext.tree.Panel',
    initComponent: function () {
        Ext.QuickTips.init();
        var me = this;
        var store = Ext.create('Ext.data.TreeStore', {
            fields: [
                {
                    name: 'option',
                    type: 'string'
                },
                {
                    name: 'settings',
                    type: 'string'
                },
                {
                    name: 'remark',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'ajax',
                url: '../../templates/standard/models/sys-options.json',
                reader: {
                    type: 'json',
                    root: 'children'
                }
            },
            autoLoad: true,
            listeners: {
                load: function (_this, node, records, successful, eOpts) {
                    //查找所有节点
                    var getChild = function (node) {
                        var childs = [];
                        var childNodes = node.childNodes;
                        for (var i = 0; i < childNodes.length; i++) {
                            childs.push(childNodes[i]);
                            if (childNodes[i].hasChildNodes()) {
                                childs = childs.concat(getChild(childNodes[i]));
                            }
                        }
                        return childs;
                    }
                    var recordsAll = getChild(_this.getRootNode());
                    Ext.Ajax.request({
                        url: webRoot + '/sys/options',
                        async: false,
                        method: 'GET',
                        scope: this,
                        success: function (response) {
                            var respText = Ext.decode(response.responseText);
                            me.currItems = respText.items;// 当前配置的所有监测项目
                            for (var i = 0; i < recordsAll.length; i++) {
                                // console.log(respText.data);
                                // console.log(recordsAll);
                                for (var j = 0; j < respText.data.length; j++) {
                                    if (recordsAll[i].raw.code == null) {
                                        if (recordsAll[i].raw.option === respText.data[j].name) {
                                            recordsAll[i].raw.id = respText.data[j].id;
                                            recordsAll[i].data.settings = respText.data[j].settings;
                                        }
                                    }
                                }
                            }
                        },
                        failure: function (response, options) {
                            Ext.MessageBox.alert('提示', '修改选项值失败,请求超时或网络故障!');
                            e.record.reject();
                        }
                    });
                    var items = {
                        option: "监测项目",
                        settings: "",
                        remark: "",
                        readOnly: true,
                        expanded: true
                    }

                    //监测项目下的孩子
                    var childrens = [];
                    for (var i = 0; i < me.currItems.length; i++) {
                        var children = me.getItemString(me.currItems[i]);
                        childrens.push(children);
                    }
                    items.children = childrens;
                    _this.getRootNode().appendChild(items);
                }
            }
        });
        Ext.apply(me, {
            id: 'settings_options',
            border: false,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            html: '<img src="/app/sys/settings/images/data-collect-list.png" />',
                            width: '10px'
                        },
                        '系统设置',
                        '->',
                        {
                            xtype: 'button',
                            iconCls: 'add',
                            tooltip: '添加监测项',
                            disabled: true,
                            scope: me,
                            handler: function () {
                                var selectRecord = me.getSelectionModel().getSelection()[0];
                                me.createItemWindow(selectRecord);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'delete',
                            tooltip: '删除监测项',
                            disabled: true,
                            scope: me,
                            handler: function (button) {
                                var selectRecord = me.getSelectionModel().getSelection()[0];
                                var content = '确定删除监测项: ' + selectRecord.raw.option + ' ?';
                                Ext.Msg.confirm('删除节点', content, function (btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: webRoot + '/sys/options/' + selectRecord.raw.option,
                                            method: 'DELETE',
                                            scope: me,
                                            success: function (response) {
                                                var respText = Ext.decode(response.responseText);
                                                if (respText.success == 'false') {
                                                    Ext.MessageBox.show({
                                                        title: '删除失败',
                                                        msg: respText.msg,
                                                        icon: Ext.Msg.ERROR,
                                                        buttons: Ext.Msg.OK
                                                    });
                                                } else {
                                                    var currItems = [];
                                                    for (var i = 0; i < me.currItems.length; i++) {
                                                        if (me.currItems[i].CODE != selectRecord.childNodes[0].raw.code) {
                                                            currItems.push(me.currItems[i]);
                                                        }
                                                    }
                                                    me.currItems = currItems;
                                                    selectRecord.remove();
                                                    //删除后重新置灰按钮
                                                    button.setDisabled(true);
                                                }
                                            },
                                            failure: function (response, options) {
                                                Ext.MessageBox.alert('提示', '删除监测项失败,请求超时或网络故障!');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            autoScroll: true,
            containerScroll: true,
            columnLines: true,
            rowLines: true,
            forceFit: true,
            desktopId: undefined,
            store: store,
            columns: [
                {
                    xtype: 'treecolumn',
                    text: '项目',
                    flex: 3,
                    sortable: false,
                    dataIndex: 'option'
                },
                {
                    text: '设置值',
                    flex: 2,
                    sortable: false,
                    dataIndex: 'settings',
                    align: 'left',
                    renderer: me.formatValue,
                    editor: {
                        xtype: 'textfield'
                    },
                    listeners: {
                    }
                },
                {
                    text: '备注',
                    flex: 3,
                    dataIndex: 'remark',
                    sortable: false
                }
            ],
            selModel: Ext.create('Ext.selection.RowModel', {mode: "SINGLE"}),
            plugins: [
                Ext.create('com.dfsoft.lancet.sys.settings.GridCellEditing', {
                    clicksToEdit: 1
                })
            ],
            listeners: {

            }
        });

        //设置单元格是否可编辑
        me.on('beforeedit', function (editor, e, eOpts) {
            var record = e.record;

            if (record.raw.readOnly) {
                return false; //不可编辑
            }
            return true; //可编辑
        });
        me.on('edit', me.updateNode, me);
        me.on('itemclick', me.onItemClick, me);
        me.callParent();
    },

    // 只有点中
    onItemClick: function (_this, record, item, index, e, eOpts) {
        var me = this,
            buttons = me.getDockedItems('toolbar[dock="top"]')[0].items.items;
        // 只有选中监测项目这个节点时才能添加
        if (record.raw.option == '监测项目') {
            buttons[3].setDisabled(false);
        } else {
            buttons[3].setDisabled(true);
        }
        // 只有选中监测项目下的监测项时才能删除
        if (record.parentNode.raw.option == '监测项目') {
            buttons[4].setDisabled(false);
        } else {
            buttons[4].setDisabled(true);
        }
    },

    // 添加监测项目窗口
    createItemWindow: function (record) {
        var me = this;
        var itemWindow = Ext.create('Ext.Window', {
            title: '监测项',
            height: 80,
            width: 200,
            closable: false,
            modal: true,
            tools: [
                {
                    type: 'save',
                    tooltip: '确认',
                    handler: function () {
                        if (itemWindow.down('form').getForm().isValid()) {
                            var selectItem = itemWindow.down('combo');
                            var items = {
                                CODE: selectItem.getValue(),
                                TYPE: selectItem.getRawValue(),
                                DISPLAY_COLOR: '',
                                LEGEND_CODE: '',
                                CORRECTION_VALUE: ''
                            }
                            var count = 0;
                            for (var i = 0; i < me.currItems.length; i++) {
                                if (me.currItems[i].CODE == items.CODE) {
                                    count++;
                                }
                            }
                            if (count > 0) {
                                Ext.MessageBox.alert('提示', '监测项目已存在, 请重新选择!');
                                return;
                            }
                            me.currItems.push(items);
                            var node = record.appendChild(me.getItemString(items));
                            me.getSelectionModel().select(node);
                            for (var i = 0; i < node.childNodes.length; i++) {
                                me.ajaxAddItem(node.childNodes[i]);
                            }
                            itemWindow.close();
                        }
                    }
                },
                {
                    type: 'close',
                    tooltip: '取消',
                    handler: function () {
                        itemWindow.close();
                    }
                }
            ],
            items: [
                {
                    xtype: 'form',
                    layout: 'hbox',
                    padding: 5,
                    items: [
                        {
                            xtype: 'combo',
                            width: 180,
                            fieldLabel: '监测项',
                            labelAlign: 'right',
                            labelWidth: 48,
                            listConfig: {minWidth: 150},
                            displayField: 'text',
                            valueField: 'value',
                            allowBlank: false,
                            //matchFieldWidth: false,
                            editable: false,
                            store: new Ext.data.Store({
                                fields: ['value', 'text'],
                                proxy: {
                                    type: 'ajax',
                                    url: webRoot + '/dics/dic_monitor_item',
                                    method: 'GET',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                },
                                autoLoad: true
                            })
                        }
                    ]
                }
            ]
        });
        itemWindow.show();
    },
    //绘制图例，王小伟 2014-08-19
    drawLegend: function (iframe) {
        var div = iframe.parentNode;
        div.removeChild(iframe);
        var icon = div.getAttribute("icon");
        var color = div.getAttribute("color");
        var canvas = div.firstChild;

        var legendIcon = {x: 8, y: 8, width: 12, height: 12, stroke: "#000000",
            type: "LT001", strokeWidth: 1};
        if (typeof(icon) != "undefined") {
            legendIcon.type = icon;
        }
        if (typeof(color) != "undefined") {
            legendIcon.stroke = color;
        }
        customDraw(canvas, legendIcon);
    },

    formatValue: function (value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            editor = record.raw.editor,
            editorClass = '';
        if (editor != undefined) {
            editorClass = editor.editorClass;
        }
        if (editorClass == 'COMBOBOX') { //显示COMBOBOX对应的displayField
            var items = record.raw.selectItems;
            var retmsg = Ext.decode(items);
            var fields = eval(record.raw.selectFields);
            if (fields.length === 3) {
                if (record.raw.option === '颜色') {
                    for (var i = 0; i < retmsg.length; i++) {
                        if (value == retmsg[i].selValue) {
                            var icon = retmsg[i].icon;
                            return '<img src="/app/sys/settings/images/colors/' + icon + '.png" />';
                        }
                    }
                } else if (record.raw.option === '图示') {
                    var color = record.previousSibling.data.settings;

                    return '<div style="width: 16px; height:16px;" icon="' + value + '" color="' + color + '"><canvas></canvas>'
                        + '<iframe frameborder="0" scrolling="no" width="0" height="0" src="" onLoad="Ext.getCmp(\''
                        + me.getId() + '\').drawLegend(this);"></iframe></div>';
//                    for (var i = 0; i < retmsg.length; i++) {
//						if (value == retmsg[i].selValue) {
//							var icon = retmsg[i].icon;
//							return '<img src="/app/sys/settings/images/' + icon + '.png" />';
//						}
//					}
                } else {
                    for (var i = 0; i < retmsg.length; i++) {
                        if (value == retmsg[i].selValue) {
                            var icon = retmsg[i].icon;
                            return '<img src="/app/sys/settings/images/colors/' + icon + '.png" />';
                        }
                    }
                }
            } else {
                for (var i = 0; i < retmsg.length; i++) {
                    if (value == retmsg[i].selValue) {
                        return retmsg[i].disValue;
                    }
                }
            }
        } else if (editorClass == 'TAB') {
            var text = "设置",
                id = record.raw.id,
                type = record.parentNode.raw.option,
                name = record.raw.option,
                code = record.raw.code;
            text = '<div style="float:left">' + text + '</div>';
            return text + '<a href="javascript:settingsDesktop(\'' + id + '\',\'' + type + '\',\'' + name + '\',\'' + code + '\');"><img src="/app/sys/settings/images/dot.png" title="设置桌面背景" style="margin-bottom: -3px; margin-right: -5px;" align="right"></a>';
        } else {
            return value;
        }
    },

    // 添加监测项目ajax
    ajaxAddItem: function (record) {
        Ext.Ajax.request({
            url: webRoot + '/sys/options',
            params: {
                TYPE: record.parentNode.raw.option,
                NAME: record.raw.option,
                CODE: record.raw.code,
                VALUE: record.data.settings
            },
            method: 'POST',
            scope: this,
            success: function (response) {
                var respText = Ext.decode(response.responseText);
                if (respText.success == 'false') {
                    Ext.MessageBox.show({
                        title: '更新失败',
                        msg: respText.msg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                } else {
                    record.raw.id = respText.data.id;
                    record.commit();
                    //更新图示记录，用于刷新
                    if (record.raw.option === '颜色') {
                        record.nextSibling.commit();
                    }
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '修改选项值失败,请求超时或网络故障!');
                e.record.reject();
            }
        });
    },

    // 修改监测项目ajax
    ajaxUpdateItem: function (code, record, params) {
        Ext.Ajax.request({
            url: webRoot + '/sys/options/' + code,
            params: params,
            method: 'PUT',
            scope: this,
            success: function (response) {
                var respText = Ext.decode(response.responseText);
                if (respText.success == 'false') {
                    Ext.MessageBox.show({
                        title: '更新失败',
                        msg: respText.msg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                } else {
                    record.commit();
                    //更新图示记录，用于刷新
                    if (record.raw.option === '颜色') {
                        record.nextSibling.commit();
                    }
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '修改监测项目失败,请求超时或网络故障!');
                record.reject();
            }
        });
    },

    updateNode: function (editor, e) {
        var me = this,
            record = e.record,
            newId = record.raw.id,
            code = record.raw.code;
        // code为null时，则选择的不是监护项
        if (code == null) {
            if (newId === undefined) {
                me.ajaxAddItem(record);
            } else {
                var params = {
                    ID: newId,
                    VALUE: record.data.settings
                }
                me.ajaxUpdateItem(code, record, params);
            }
            //修改监测项目
        } else {
            var params = {
                CODE: code,
                NAME: record.raw.option,
                VALUE: record.data.settings
            }
            me.ajaxUpdateItem(code, record, params);
        }
    },

    //拼监测项目
    getItemString: function (item) {
        var selectFields = ['disValue', 'selValue', 'icon'],
            colorSelectItems = "[{'disValue':'橙色','selValue':'#FF8800','icon':'circle-orange'},{'disValue':'黑色','selValue':'#212121','icon':'circle-black'},{'disValue':'红色','selValue':'#CC0000','icon':'circle-red'},{'disValue':'黄色','selValue':'#A7A400','icon':'circle-yellow'},{'disValue':'蓝色','selValue':'#0099CC','icon':'circle-light-blue'},{'disValue':'绿色','selValue':'#669900','icon':'circle-green'},{'disValue':'紫红色','selValue':'#980034','icon':'circle-violet'},{'disValue':'紫罗兰','selValue':'#180438','icon':'circle-purple'},{'disValue':'紫色','selValue':'#9933CC','icon':'circle-light-purple'}]",
            legendSelectItems = [];//"[{'disValue':'收缩压','selValue':'SBP','icon':'sbp'},{'disValue':'舒张压','selValue':'DBP','icon':'dbp'},{'disValue':'脉搏','selValue':'PULSE','icon':'pulse'},{'disValue':'自主呼吸','selValue':'SPONT','icon':'spont'},{'disValue':'机械通气','selValue':'FMMV','icon':'fmmv'},{'disValue':'体温','selValue':'TP','icon':'tp'},{'disValue':'平均动脉压','selValue':'PACU_MAP','icon':'mibr-map'},{'disValue':'中心静脉压','selValue':'PACU_CVP','icon':'cvp'},{'disValue':'心率','selValue':'HR','icon':'hr'},{'disValue':'△','selValue':'TRI','icon':'tri'},{'disValue':'*','selValue':'ICP','icon':'icp'},{'disValue':'X','selValue':'X','icon':'x'}]";
        //更改图例名称和值，王小伟 2014-08-18
        for (var i = 1; i <= 36; i++) {
            var legendName = "LT";
            if (i < 10) {
                legendName += "00" + i;
            } else {
                legendName += "0" + i;
            }
            legendSelectItems.push({disValue: legendName, selValue: legendName, icon: legendName});
        }

        var children = {
            option: item.TYPE,
            settings: "",
            remark: "",
            readOnly: true,
            expanded: true,
            children: [
                {
                    option: "颜色",
                    code: item.CODE,
                    settings: item.DISPLAY_COLOR,
                    readOnly: false,
                    remark: "监测项目显示颜色。",
                    leaf: true,
                    editor: {
                        editorClass: "COMBOBOX"
                    },
                    selectFields: selectFields,
                    selectItems: colorSelectItems
                },
                {
                    option: "图示",
                    code: item.CODE,
                    settings: item.LEGEND_CODE,
                    readOnly: false,
                    remark: "监测项目显示图示。",
                    leaf: true,
                    editor: {
                        editorClass: "COMBOBOX"
                    },
                    selectFields: selectFields,
                    selectItems: Ext.encode(legendSelectItems)
                },
                {
                    option: "修正值",
                    code: item.CODE,
                    settings: item.CORRECTION_VALUE,
                    readOnly: false,
                    validRex: {maxValue: 99999.99, minValue: -99999.99, decimalPrecision: 2},
                    remark: "受到高频设备干扰出现数据失真时采用的修正值。",
                    leaf: true,

                    editor: {
                        editorClass: "NUMBER"
                    }
                }
            ]
        };
        return children;
    }
});