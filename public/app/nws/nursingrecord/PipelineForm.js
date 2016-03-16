/**
 * 定义护理记录管理编辑页面
 *
 * @author chm
 * @version 2013-3-10
 */

Ext.define('com.dfsoft.icu.nws.nursingrecord.PipelineForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.pipelineform',

    requires: ['com.dfsoft.icu.nws.nursingrecord.IntubateChart',
        'com.dfsoft.icu.nws.nursingrecord.PipelineGrid',
        'com.dfsoft.icu.nws.nursingrecord.PipeOtherGrid',
        'com.dfsoft.icu.nws.nursingrecord.PipeArteryGrid',
        'com.dfsoft.icu.nws.nursingrecord.PipelineOtherGrid'],

    initComponent: function () {
        var proxy = this;

        Ext.apply(this, {
            region: 'center',
            xtype: 'form',
            header: false,
            collapsible: true,
            frame: false,
            border: false,

            layout: 'border',
            defaults: {
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                }
            },

            fieldDefaults: {
                msgTarget: 'side',
                labelAlign: 'right'
            },
            autoScroll: false,

            items: [
                {
                    region: 'north',
                    frame: false,

                    items: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            margin: '-1 -1 0 -1',
                            items: ['->', {
                                xtype: 'button',
                                tooltip: '保存',
                                iconCls: 'icon-save',
                                handler: function (btn) {
                                    var form = btn.up('form').getForm();
                                    if (!form.isValid()) {
                                        return;
                                    }

                                    var ids="";
                                    // 气管
                                    var tracheaFieldset = Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').checkboxCmp;
                                    var trachea = [];
                                    if (tracheaFieldset.getValue()) { // 选中气管前的复选框
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '气管-' + record.data.NAME;
                                                if (record.data.OXYGEN_MODE == '') {
                                                    Ext.MessageBox.alert('提示', str + ' 人工气道不能为空');
                                                    return;
                                                }
                                                if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                    (record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i'))),
                                                    (record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i'))),
                                                    str)) {
                                                    return;
                                                }
                                                /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                    (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                    Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                    return;
                                                }*/

                                                if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                    (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                    record.set('INTUBATION_TIME', new Date());
                                                }
                                                ids+="'"+record.data.ID+"',";
                                                trachea[i] = {
                                                    "ID":record.data.ID,
                                                    "NAME": record.data.NAME,
                                                    "INTUBATION_TIME": record.data.INTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.INTUBATION_TIME),
                                                    "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                    "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                    "OXYGEN_MODE": record.data.OXYGEN_MODE,
                                                    "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' :proxy.formatTime(record.data.CHANGE_TIME),
                                                    "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.EXTUBATION_TIME),
                                                    "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                    "TYPE": '气管'
                                                }
                                            }
                                        }
                                    }

                                    // 胃管
                                    var stomachFieldset = Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').checkboxCmp;
                                    var stomach = [];
                                    if (stomachFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '胃管-' + record.data.NAME;
                                                if (record.data.INTUBATION_WAY == '') {
                                                    Ext.MessageBox.alert('提示', str + ' 位置不能为空');
                                                    return;
                                                }
                                                if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                    (record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i'))),
                                                    (record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i'))),
                                                    '胃管-' + record.data.NAME)) {
                                                    return;
                                                }
                                                /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                    (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                    Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                    return;
                                                }*/
                                                if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                    (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                    record.set('INTUBATION_TIME', new Date());
                                                }
                                                ids+="'"+record.data.ID+"',";
                                                stomach[i] = {
                                                    "ID":record.data.ID,
                                                    "NAME": record.data.NAME,
                                                    "INTUBATION_TIME": record.data.INTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.INTUBATION_TIME),
                                                    "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                    "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                    "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' :proxy.formatTime(record.data.CHANGE_TIME),
                                                    "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.EXTUBATION_TIME),
                                                    "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                    "TYPE": '胃管'
                                                }
                                            }
                                        }
                                    }

                                    // 尿管
                                    var pissFieldset = Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').checkboxCmp;
                                    var piss = [];
                                    if (pissFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str='尿管-' + record.data.NAME;
                                                if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                    (record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i'))),
                                                    (record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i'))),
                                                    '尿管-' + record.data.NAME)) {
                                                    return;
                                                }
                                               /* if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                    (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                    Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                    return;
                                                }*/
                                                if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                    (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                    record.set('INTUBATION_TIME', new Date());
                                                }
                                                ids+="'"+record.data.ID+"',";
                                                piss[i] = {
                                                    "ID":record.data.ID,
                                                    "NAME": record.data.NAME,
                                                    "INTUBATION_TIME": record.data.INTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.INTUBATION_TIME),
                                                    "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                    "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' :proxy.formatTime(record.data.CHANGE_TIME),
                                                    "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.EXTUBATION_TIME),
                                                    "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                    "TYPE": '尿管'
                                                }
                                            }
                                        }
                                    }
                                    // 引流管
                                    var drainageFieldset = Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').checkboxCmp;
                                    var drainage = [];
                                    if (drainageFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '引流管-' + record.data.NAME;
                                                if (record.data.INTUBATION_WAY == '') {
                                                    Ext.MessageBox.alert('提示', str + ' 位置不能为空');
                                                    return;
                                                }
                                                if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                    (record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i'))),
                                                    (record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i'))),
                                                    '引流管-' + record.data.NAME)) {
                                                    return;
                                                }
                                                /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                    (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                    Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                    return;
                                                }*/
                                                if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                    (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                    record.set('INTUBATION_TIME', new Date());
                                                }
                                                ids+="'"+record.data.ID+"',";
                                                drainage[i] = {
                                                    "ID":record.data.ID,
                                                    "NAME": record.data.NAME,
                                                    "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                    "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                    "INTUBATION_TIME": record.data.INTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.INTUBATION_TIME),
                                                    "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' :proxy.formatTime(record.data.CHANGE_TIME),
                                                    "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.EXTUBATION_TIME),
                                                    "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                    "TYPE": '引流管'
                                                }
                                            }
                                        }
                                    }
                                    // 其他管
                                    var otherLineFieldset = Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').checkboxCmp;
                                    var otherLine = [];
                                    if (otherLineFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '其他管-' + record.data.NAME;
                                                if (record.data.INTUBATION_WAY == '') {
                                                    Ext.MessageBox.alert('提示', str + ' 位置不能为空');
                                                    return;
                                                }
                                                if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                    (record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i'))),
                                                    (record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i'))),
                                                    '其他管-' + record.data.NAME)) {
                                                    return;
                                                }
                                                /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                    (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                    Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                    return;
                                                }*/
                                                if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                    (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                    record.set('INTUBATION_TIME', new Date());
                                                }
                                                ids+="'"+record.data.ID+"',";
                                                otherLine[i] = {
                                                    "ID":record.data.ID,
                                                    "NAME": record.data.NAME,
                                                    "INTUBATION_TIME": proxy.formatTime(record.data.INTUBATION_TIME),
                                                    "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                    "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                    "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' :proxy.formatTime(record.data.CHANGE_TIME),
                                                    "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' :proxy.formatTime(record.data.EXTUBATION_TIME),
                                                    "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                    "TYPE": '其他管'
                                                }
                                            }
                                        }
                                    }
                                    // 静脉管
                                    var othersFieldset = Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').checkboxCmp;
                                    var others = [], deleteothers = [];
                                    if (othersFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            var m = 0, n = 0;
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '静脉管-' + record.data.NAME;
                                                if (record.data.INTUBATION_WAY == '' && (record.data.INTUBATION_DEPTH != '' || record.data.GRADUATION != '' || (record.data.INTUBATION_TIME != null && record.data.INTUBATION_TIME != ''))) {

                                                    Ext.MessageBox.alert('提示', str + ' 位置不能为空');
                                                    return;
                                                }
                                                if (record.data.INTUBATION_WAY != '' && record.data.INTUBATION_WAY != null) {
                                                    if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                        record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i')),
                                                        record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i')), '静脉管-' + record.data.NAME)) {
                                                        return;
                                                    }
                                                    /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                        (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                        Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                        return;
                                                    }*/
                                                    if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                        (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                        record.set('INTUBATION_TIME', new Date());
                                                    }
                                                    ids+="'"+record.data.ID+"',";
                                                    others[m] = {
                                                        "ID":record.data.ID,
                                                        "NAME": record.data.NAME,
                                                        "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                        "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                        "GRADUATION": record.data.GRADUATION,
                                                        "INTUBATION_TIME": proxy.formatTime(record.data.INTUBATION_TIME),
                                                        "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' : proxy.formatTime(record.data.CHANGE_TIME),
                                                        "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' : proxy.formatTime(record.data.EXTUBATION_TIME),
                                                        "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' :proxy.formatTime(record.data.ADJUST_TIME),
                                                        "TYPE": '静脉管'
                                                    }
                                                    m++;
                                                } else {
                                                    deleteothers[n] = {
                                                        "NAME": record.data.NAME
                                                    };
                                                    n++;
                                                }
                                            }
                                        }
                                    }
                                    // 动脉管
                                    var arteryFieldset = Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').checkboxCmp;
                                    var artery = [], deleteartery = [];
                                    if (arteryFieldset.getValue()) {
                                        var grid = Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').down('gridpanel');
                                        var store = grid.getStore();
                                        if (store.getCount() > 0) {
                                            var m = 0, n = 0;
                                            for (var i = 0; i < store.getCount(); i++) {
                                                var record = store.getAt(i);
                                                var str = '动脉管-' + record.data.NAME;
                                                if (record.data.INTUBATION_WAY == '' && (record.data.INTUBATION_DEPTH != '' || (record.data.INTUBATION_TIME != null && record.data.INTUBATION_TIME != ''))) {

                                                    Ext.MessageBox.alert('提示', str + ' 位置不能为空');
                                                    return;
                                                }
                                                if (record.data.INTUBATION_WAY != '' && record.data.INTUBATION_WAY != null) {
                                                    if (!proxy.checkPopTime(new Date(Ext.Date.format(new Date(record.data.INTUBATION_TIME), 'Y-m-d H:i')),
                                                        record.data.CHANGE_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.CHANGE_TIME), 'Y-m-d H:i')),
                                                        record.data.EXTUBATION_TIME == null ? '' : new Date(Ext.Date.format(new Date(record.data.EXTUBATION_TIME), 'Y-m-d H:i')), '动脉管-' + record.data.NAME)) {
                                                        return;
                                                    }

                                                    /*if ((record.data.INTUBATION_TIME != '' && record.data.INTUBATION_TIME != null)&&
                                                        (record.data.ADJUST_TIME != '' && record.data.ADJUST_TIME != null)){
                                                        Ext.MessageBox.alert('提示', str + ' 置管时间和调整时间只能录入一个!');
                                                        return;
                                                    }*/
                                                    if ((record.data.INTUBATION_TIME == '' || record.data.INTUBATION_TIME == null)&&
                                                        (record.data.ADJUST_TIME == '' || record.data.ADJUST_TIME == null)){
                                                        record.set('INTUBATION_TIME', new Date());
                                                    }
                                                    ids+="'"+record.data.ID+"',";
                                                    artery[m] = {
                                                        "ID":record.data.ID,
                                                        "NAME": record.data.NAME,
                                                        "INTUBATION_DEPTH": record.data.INTUBATION_DEPTH,
                                                        "INTUBATION_WAY": record.data.INTUBATION_WAY,
                                                        "INTUBATION_TIME": proxy.formatTime(record.data.INTUBATION_TIME),
                                                        "CHANGE_TIME": record.data.CHANGE_TIME == '' ? '' : proxy.formatTime(record.data.CHANGE_TIME),
                                                        "EXTUBATION_TIME": record.data.EXTUBATION_TIME == '' ? '' : proxy.formatTime(record.data.EXTUBATION_TIME),
                                                        "ADJUST_TIME": record.data.ADJUST_TIME == '' ? '' : proxy.formatTime(record.data.ADJUST_TIME),
                                                        "TYPE": '动脉管'
                                                    };
                                                    m++;
                                                } else {
                                                    deleteartery[n] = {
                                                        "NAME": record.data.NAME
                                                    };
                                                    n++;
                                                }
                                            }
                                        }
                                    }
                                    btn.setDisabled(true);
                                    if(ids.lastIndexOf(',')>=0){
                                        ids=ids.substr(0,ids.length-1);
                                    }
                                    Ext.Ajax.request({
                                        url: '/icu/nursingRecord/pipeline',
                                        params: {
                                            ids:ids,
                                            trachea: JSON.stringify(trachea),
                                            stomach: JSON.stringify(stomach),
                                            piss: JSON.stringify(piss),
                                            drainage: JSON.stringify(drainage),
                                            otherLine: JSON.stringify(otherLine),
                                            others: JSON.stringify(others),
                                            deleteothers: JSON.stringify(deleteothers),
                                            artery: JSON.stringify(artery),
                                            deleteartery: JSON.stringify(deleteartery),
                                            userId: userInfo.userId,
                                            registerId: proxy.patientInfo.REGISTER_ID
                                        },
                                        method: 'post',
                                        scope: this,
                                        success: function (response) {

                                            var res = Ext.decode(response.responseText);
                                            if (res.success) {
                                                proxy.down('chart').store.load();
                                                //proxy.fireEvent('beforerender', proxy);
                                                proxy.innitPage(proxy,btn);

                                                // 刷新统计图
                                                /*
                                                 var grid = Ext.getCmp(proxy.nwsApp.id+'artery_fieldset').down('gridpanel');
                                                 grid.getStore().commitChanges();
                                                 var jingmai = Ext.getCmp(proxy.nwsApp.id+'other_fieldset').down('gridpanel');
                                                 jingmai.getStore().commitChanges();
                                                 var yinliu = Ext.getCmp(proxy.nwsApp.id+'drainage_tube_fieldset').down('gridpanel');
                                                 yinliu.getStore().commitChanges();
                                                 var other = Ext.getCmp(proxy.nwsApp.id+'otherLine_fieldset').down('gridpanel');
                                                 other.getStore().commitChanges();*/
                                            }
                                        },
                                        failure: function (response, options) {
                                            Ext.MessageBox.alert('提示', '保存失败,请求超时或网络故障!');
                                        }
                                    });
                                }
                            }]
                        }
                    ]
                },
                {
                    region: 'center',
                    layout: 'column',
                    frame: false,
                    autoScroll: true,

                    items: [
                        {
                            columnWidth: .4,        //设置列的宽度
                            margin: '5 5 0 5',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '静脉管',
                                    id: proxy.nwsApp.id + 'other_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 220,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipeOtherGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]

                                },
                                {
                                    xtype: 'fieldset',
                                    title: '动脉管',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    id: proxy.nwsApp.id + 'artery_fieldset',
                                    checkboxToggle: true,
                                    collapsed: true,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 183,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipeArteryGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '胃管',
                                    id: proxy.nwsApp.id + 'stomach_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,

                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 123,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipeStomachGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                }

                            ]

                        },
                        {
                            columnWidth: .4,
                            margin: '5 5 0 0',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '尿管',
                                    id: proxy.nwsApp.id + 'piss_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,

                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 123,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipePissGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '气管',
                                    id: proxy.nwsApp.id + 'trachea_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,

                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 123,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipeTracheaGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '引流管',
                                    id: proxy.nwsApp.id + 'drainage_tube_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,

                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 123,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipelineGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '其他管',
                                    id: proxy.nwsApp.id + 'otherLine_fieldset',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    checkboxToggle: true,
                                    collapsed: true,

                                    items: [
                                        {
                                            xtype: 'panel',
                                            height: 123,
                                            layout: 'border',
                                            bodyStyle: 'background-color:#FFFFFF',
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.PipelineOtherGrid',{nwsApp:proxy.nwsApp})]
                                        }
                                    ]
                                }
                            ]

                        },
                        {
                            columnWidth: .2,
                            margin: '18 5 0 0',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    layout: 'anchor',
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    height: 395,

                                    items: [
                                        {
                                            layout: {
                                                type: 'vbox',
                                                pack: 'start',              //纵向对齐方式 start：从顶部；center：从中部；end：从底部
                                                align: 'center'             //对齐方式 center、left、right：居中、左对齐、右对齐；stretch：延伸；stretchmax：以最大的元素为标准延伸
                                            },
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    text: '插管时间统计图',
                                                    margin: '10 10 10 90',
                                                    style: 'font-size:16px;font-weight: bold;color: #707070;width:auto'
                                                }
                                            ]

                                        },
                                        {
                                            layout: 'fit',
                                            height: 360,
                                            items: [Ext.create('com.dfsoft.icu.nws.nursingrecord.IntubateChart', {
                                                patientInfo: this.patientInfo})]
                                        }
                                    ]

                                }
                            ]

                        }
                    ]
                }
            ]
        });

        // 给form赋值
        this.on('beforerender', function (form, eOpts) {
            this.innitPage(form);

        });

        this.callParent(arguments);
    },

    innitPage: function (_form, btn) {
        var proxy = this;
        var grids = Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').down('gridpanel');
        grids.getStore().removeAll();
        var gridArterys = Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').down('gridpanel');
        gridArterys.getStore().removeAll();
        var gridLine = Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').down('gridpanel');
        gridLine.getStore().removeAll();
        var otherLine = Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').down('gridpanel');
        otherLine.getStore().removeAll();
        var stomach = Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').down('gridpanel');
        stomach.getStore().removeAll();
        var piss = Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').down('gridpanel');
        piss.getStore().removeAll();
        var trachea = Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').down('gridpanel');
        trachea.getStore().removeAll();
        if (this.patientInfo == null) {
            return;
        }
        var form = _form.getForm();
        form.reset();
        //获取信息并给页面赋值
        Ext.Ajax.request({
            url: webRoot + '/icu/nursingRecord/pipeline/' + this.patientInfo.REGISTER_ID,
            method: 'get',
            scope: this,
            success: function (response) {
                var retmsg = Ext.decode(response.responseText);
                if (retmsg != null) {
                    var resData = retmsg.data;
                    if (resData.length > 0) {
                        for (var i = 0; i < resData.length; i++) {
                            var catheter = resData[i];
                            if (catheter.TYPE == '气管') {
                                Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME,
                                        OXYGEN_MODE: catheter.OXYGEN_MODE,
                                        INTUBATION_WAY:catheter.INTUBATION_WAY,
                                        INTUBATION_DEPTH: catheter.INTUBATION_DEPTH,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)
                                    }
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').down('gridpanel');
                                grid.getStore().add(data);

                            } else if (catheter.TYPE == '胃管') {
                                Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME,
                                        INTUBATION_WAY: catheter.INTUBATION_WAY,
                                        INTUBATION_DEPTH: catheter.INTUBATION_DEPTH,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').down('gridpanel');
                                grid.getStore().add(data);

                            } else if (catheter.TYPE == '尿管') {
                                Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME,
                                        INTUBATION_DEPTH: catheter.INTUBATION_DEPTH,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').down('gridpanel');
                                grid.getStore().add(data);

                            } else if (catheter.TYPE == '引流管') {
                                Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME,
                                        INTUBATION_WAY: catheter.INTUBATION_WAY,
                                        INTUBATION_DEPTH: catheter.INTUBATION_DEPTH,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').down('gridpanel');
                                grid.getStore().add(data);
                            } else if (catheter.TYPE == '其他管') {
                                Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME,
                                        INTUBATION_WAY: catheter.INTUBATION_WAY,
                                        INTUBATION_DEPTH: catheter.INTUBATION_DEPTH,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').down('gridpanel');
                                grid.getStore().add(data);
                            } else if (catheter.TYPE == '静脉管') {
                                Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME, INTUBATION_DEPTH: catheter.INTUBATION_DEPTH, INTUBATION_WAY: catheter.INTUBATION_WAY, GRADUATION: catheter.GRADUATION,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').down('gridpanel');
                                grid.getStore().add(data);
                            } else if (catheter.TYPE == '动脉管') {
                                Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').checkboxCmp.setValue(true);
                                var data = [
                                    {
                                        ID:catheter.ID,
                                        NAME: catheter.NAME, INTUBATION_DEPTH: catheter.INTUBATION_DEPTH, INTUBATION_WAY: catheter.INTUBATION_WAY,
                                        INTUBATION_TIME: catheter.INTUBATION_TIME == null ? null : new Date(catheter.INTUBATION_TIME),
                                        CHANGE_TIME: catheter.CHANGE_TIME == null ? null : new Date(catheter.CHANGE_TIME),
                                        EXTUBATION_TIME: catheter.EXTUBATION_TIME == null ? null : new Date(catheter.EXTUBATION_TIME),
                                        ADJUST_TIME: catheter.ADJUST_TIME == null ? null : new Date(catheter.ADJUST_TIME)}
                                ];
                                var grid = Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').down('gridpanel');
                                grid.getStore().add(data);
                            }
                        }

                    } else {
                        Ext.getCmp(proxy.nwsApp.id + 'trachea_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'stomach_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'piss_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'drainage_tube_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'otherLine_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').checkboxCmp.setValue(false);
                        Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').checkboxCmp.setValue(false);
                        // 刷新统计图
                        proxy.down('chart').getStore().loadData([
                            {}
                        ]);
                    }
                    //初始化其他管或者动脉管数据
                    var grid = Ext.getCmp(proxy.nwsApp.id + 'other_fieldset').down('gridpanel');
                    var addDatas = [
                        {NAME: 'CVC1'},
                        {NAME: 'CVC2'},
                        {NAME: 'PICC'},
                        {NAME: '外周1'},
                        {NAME: '外周2'},
                        {NAME: '外周3'},
                        {NAME: 'CVVH'}
                    ];
                    var _store = grid.getStore();
                    var len = _store.getCount();
                    for (var i = 0; i < addDatas.length; i++) {
                        var da = addDatas[i];
                        var f = false;
                        for (var j = 0; j < _store.getCount(); j++) {
                            if (_store.getAt(j).get('NAME') == da.NAME) {
                                f = true;
                                break;
                            }
                        }
                        if (!f) {
                            _store.add(da);
                        }
                    }
                    _store.sort('NAME', 'ASC');

                    var gridArtery = Ext.getCmp(proxy.nwsApp.id + 'artery_fieldset').down('gridpanel');
                    var addDatasArtery = [
                        {NAME: '动脉1'},
                        {NAME: '动脉2'},
                        {NAME: 'PAC'},
                        {NAME: 'PICCO'},
                        {NAME: 'IABP'}
                    ];
                    var _storeArtery = gridArtery.getStore();
                    var lenArtery = _storeArtery.getCount();
                    for (var i = 0; i < addDatasArtery.length; i++) {
                        var da = addDatasArtery[i];
                        var f = false;
                        for (var j = 0; j < _storeArtery.getCount(); j++) {
                            if (_storeArtery.getAt(j).get('NAME') == da.NAME) {
                                f = true;
                                break;
                            }
                        }
                        if (!f) {
                            _storeArtery.add(da);
                        }
                    }
                    _storeArtery.sort('NAME', 'ASC');
                    if (btn) {
                        btn.setDisabled(false);
                    }
                }
            }
        });
    },
    formatTime: function (time) {
        if (time != null) {
            time = Ext.Date.format(new Date(time), 'Y-m-d H:i:s');
        }
        return time;
    },
    checkPopTime: function (val1, val2, val3, str) {
        /*if(val1==null||val1==''){
         Ext.MessageBox.alert('提示', str+'置管时间不能为空！');
         return false;
         }*/
        if (val2 != null && val2 != '' && val2 < val1) {
            Ext.MessageBox.alert('提示', str + '更换时间不能小于置管时间！');
            return false;
        }
        if (val3 != null && val3 != '' && val3 < val1) {
            Ext.MessageBox.alert('提示', str + '拨管时间不能小于置管时间！');
            return false;
        }
        if (val3 != null && val2 != null && val3 != '' && val2 != '' && val3 < val2) {
            Ext.MessageBox.alert('提示', str + '拨管时间不能小于更换时间！');
            return false;
        }
        if (val1.getTime() > new Date().getTime()) {
            Ext.MessageBox.alert('提示', str + '置管时间不能大于当前时间！');
            return false;
        }
        return true;
    }
})