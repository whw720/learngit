/**
 * 定义ConventionalCombo 通用下拉框组件
 *
 * @author chm
 * @version 2012-9-4
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.ConventionalComboStore', {
    extend : 'Ext.data.Store',
    autoLoad : true,

    fields : ['ITEM_VALUE', 'DISPLAY_NAME','HELPER_CODE'],
    proxy: {
        type: 'ajax',
        url: webRoot+'/icu/nursingRecord/conventional/combobox/comboxitems/all',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    toComboxValue : function(value, store){
        var proxy = store;
        var temp=value;
        if(value != null &&value != '' && value.length>0){
            if(typeof value == 'object'||value.indexOf('{')>-1){
                try{
                    var obj = Ext.decode(value);
                    if(obj.name == undefined){
                        value = this.formatCombox(value, 'DISPLAY_NAME', 'ITEM_VALUE', proxy);
                    }else{
                        value = obj.name;
                        return value;
                    }
                }catch (e){
                    value = this.formatCombox(value, 'DISPLAY_NAME', 'ITEM_VALUE', proxy);
                }
            }else{
                value = this.formatCombox(value, 'DISPLAY_NAME', 'ITEM_VALUE', proxy);
            }
        }

        if(value==''&&temp!=''){
            return temp;
        }
        return value;
    },

    formatCombox : function (value, displayField, valueField, store){

        if(typeof value == 'object'){
            var str = "";
            for(var i=0; i<value.length; i++){
                var index = store.find(valueField, value[i]);
                if(index == -1){
                    return '';
                }
                str += store.getAt(index).get(displayField)+",";
            }
            value = str.substring(0, str.length-1);
        }else{
            var index = store.find(valueField, value);
            if(index == -1){
                return '';
            }
            value = store.getAt(index).get(displayField);
        }
        return value;
    },
    listeners : {
        beforeload : function(store, records, successful, eOpts){
            Ext.apply(store.proxy.extraParams, {
                registerId : this.registerId, fieldName : this.dataIndex
            });
        }
    }
});