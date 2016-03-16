/**
 * 定义护理记录常规store
 *
 * @author chm
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalStore', {
    extend: 'Ext.data.Store',

//    autoLoad : true,
    proxy: {
        type: 'ajax',
        actionMethods: { read: 'POST' },
        url: webRoot + '/icu/nursingRecord/conventional/all',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    },
    listeners: {
        load:function(_this, records, successful, eOpts ){
            var storeItems = records;
            var storeRawArray = [];
            for (var i=0; i<storeItems.length; i++) {
                storeRawArray.push(storeItems[i].raw);
            }
            _this.loadData(storeRawArray);
        },
        beforeload : function(_store, records, successful, eOpts){
            Ext.apply(_store.proxy.extraParams, {
                registerId : _store.nursingRecordApp.patientInfo.REGISTER_ID,
                startTime : _store.nursingRecordApp.conventionalToolbar.getBeginDateTime(),
                endTime: _store.nursingRecordApp.conventionalToolbar.getEndDateTime(),
                careContent : _store.nursingRecordApp.careContentPreset,
                bedItemArray : _store.nursingRecordApp.bedItemArray
            });
        },
        update: function (_this, record, operation, modifiedFieldNames, eOpts) {

            var len=this.nursingRecordApp.fields.length;
            var flag=true;
            for(var i=0;i<len;i++){
                if(typeof this.nursingRecordApp.fields[i]=='object'){
                    if(this.nursingRecordApp.fields[i].name==modifiedFieldNames){
                        flag=false;
                        break;
                    }
                }
            }
            if(flag){
                return;
            }
            /*if (this.nursingRecordApp.batchUpdateFields) {
                return;
            }*/
            if (modifiedFieldNames == null || modifiedFieldNames == 'CHECKHAVE') {
                return;
            }
            var id = record.get('id');
            var careTime = record.get('CARE_TIME');
            var careValue = record.get(modifiedFieldNames);
            /*if (this.nursingRecordApp.gridpanel.inputType == 1) { // 下拉框
                careValue = this.nursingRecordApp.gridpanel.comboboxValue;
                this.nursingRecordApp.gridpanel.inputType = '';
            }
            if (modifiedFieldNames == this.nursingRecordApp.careContentPreset) {
                careValue = careValue.replace(/\r\n|\n/g, '')
            }*/
            Ext.Ajax.request({
                url: webRoot + '/icu/nursingRecord/conventional/1_store',
                params: {
                    userId: userInfo.userId,
                    registerId: this.nursingRecordApp.patientInfo.REGISTER_ID,
                    careTime: Ext.Date.format(new Date(careTime), 'Y-m-d H:i:s'),
                    bedItemId: modifiedFieldNames,
                    careValue: careValue,
                    careContent: this.nursingRecordApp.careContentPreset
                },
                method: 'PUT',
                scope: this,
                success: function (response) {
                    record.commit();
                },
                failure: function (response, options) {
                    record.cancelEdit();
                    Ext.MessageBox.alert('提示', '更新失败,请求超时或网络故障!');
                }
            });
        }
    }
});

/*,

 beforeload : function(store, records, successful, eOpts){
 var grid = store.nursingRecordApp;
 var startTime = grid.conventionalToolbar.getBeginDateTime();
 var endTime = grid.conventionalToolbar.getEndDateTime();

 var dateRadioGroup = grid.conventionalToolbar.dateRadioGroup;
 if(dateRadioGroup.getValue()[grid.nwsApp.id+'careRadio'] == 'custom'
 && (endTime.getTime()-startTime.getTime()>24*60*60*1000)){

 startTime = store.nursingRecordApp.beginDateTime;
 endTime = store.nursingRecordApp.endDateTime;
 }
 if(startTime != ''){
 startTime = Ext.Date.format(new Date(startTime), 'Y-m-d H:i:s');
 }
 if(endTime){
 endTime = Ext.Date.format(new Date(endTime), 'Y-m-d H:i:s');
 }

 Ext.apply(store.proxy.extraParams, {
 registerId : this.nursingRecordApp.patientInfo.REGISTER_ID, startTime : startTime, endTime: endTime,
 careContent : this.nursingRecordApp.careContentPreset,
 bedItemArray : store.nursingRecordApp.bedItemArray, userId : userInfo.userId
 });
 }*/