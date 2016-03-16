/**
 * 带时分秒的时间控件选择器
 *
 * @author chm
 */
Ext.define('com.dfsoft.lancet.plugin.DateTimeControls', {
    extend: 'com.dfsoft.lancet.plugin.DateTimePicker',
    alias: 'widget.datetimecontrols',
	editable:true,
    selectToday: function() {
        var me = this, btn = me.todayBtn;
        
        if (btn && !btn.disabled) {
            me.hour.setValue(new Date().getHours());
            me.minute.setValue(new Date().getMinutes());
            me.second.setValue(new Date().getSeconds());
            me.setValue(new Date());
            me.fireEvent('select', me, me.value);
            me.onDestroy();
        }
        return me;
    },
    confirmBtnHandler:function(){
        var me = this, btn = me.ConfirmBtn;
        
	    if (btn && !btn.disabled) {
	        var datetime = "";
            var dateFormat=me.format;
            if(me.format.indexOf('Y')<0){
                if(me.format.indexOf('/')>0){
                    dateFormat='Y/'+ me.format;
                }else{
                    dateFormat='Y-'+ me.format;
                }
            }
	        datetime += Ext.Date.format(me.value,dateFormat)
	            .substr(0, 10);
	        datetime += " ";
	        datetime += me.hour.getValue() == null ? 00 : me.hour.getValue();
	        datetime += ":";
	        datetime += me.minute.getValue() == null ? 00 : me.minute.getValue();
	        datetime += ":";
	        datetime += me.second.getValue() == null ? 00 : me.second.getValue();
	        me.setValue(Ext.Date.clearTime(new Date(datetime)));
	        me.fireEvent('select', me, datetime, true);
	        me.onDestroy();
	    }
	    return me;
    },
    resetBtnHandler:function(){
        var me = this, btn = me.ResetBtn;
        
	    if (btn && !btn.disabled) {
	        me.setValue(Ext.Date.clearTime(new Date()));
	        me.hour.setValue("00");
	        me.minute.setValue("00");
	        me.second.setValue("00");
	        me.fireEvent('select', me, "", false);
	        me.onDestroy();
	    }
	    return me;    	
    }
});