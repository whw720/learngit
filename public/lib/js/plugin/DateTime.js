/**
 * 带时分秒的日期控件
 *
 * @author chm
 */
Ext.define('com.dfsoft.lancet.plugin.DateTime', {
	extend: 'Ext.form.field.Date',
	alias: 'widget.datetimefield',
	//requires: ['com.dfsoft.lancet.plugin.DateTimePicker'],
    requires: ['com.dfsoft.lancet.plugin.DateTimePicker'],
	trigger1Cls: Ext.baseCSSPrefix + 'form-date-trigger',
	format: 'Y-m-d H:i:s',
	hideResetBtn: false, 
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
	},
	/**
	 * 创建时间选择器
	 *
	 * @return {}
	 */
	createPicker: function() {
		var me = this,
			format = Ext.String.format;
		return new com.dfsoft.lancet.plugin.DateTimePicker({
			dateTimeId: this.id,
			pickerField: me,
			ownerCt: me.ownerCt,
			renderTo: document.body,
			floating: true,
			hidden: true,
			focusOnShow: true,
			editable: me.editable, // 时分秒是否可编辑
			minDate: me.minValue,
			maxDate: me.maxValue,
			disabledDatesRE: me.disabledDatesRE,
			disabledDatesText: me.disabledDatesText,
			disabledDays: me.disabledDays,
			disabledDaysText: me.disabledDaysText,
			format: me.format,
			showToday: me.showToday,
			startDay: me.startDay,
			minText: format(me.minText, me
				.formatDate(me.minValue)),
			maxText: format(me.maxText, me
				.formatDate(me.maxValue)),
			listeners: {
				scope: me,
				select: me.onSelect
			},
			keyNavConfig: {
				esc: function() {
					me.collapse();
				}
			},
			resetBtnHandler:this.resetBtnHandler,
			confirmBtnHandler:this.confirmBtnHandler,
			selectToday:this.selectToday,
			hideResetBtn: this.hideResetBtn
		});
	},


	/**
	 * @private 设置选择器的值
	 */
	onExpand: function() {
		var me = this,
			value = me.getValue() instanceof Date ? me
			.getValue() : new Date();
        if(me.getValue() instanceof oDate){
            value = me.getValue();
        }
		me.picker.setValue(value);
		me.picker.hour.setValue(value.getHours());
		me.picker.minute.setValue(value.getMinutes());
		me.picker.second.setValue(value.getSeconds());
		me.updateLayout();
	},

	/**
	 * 重写选中方法，去掉收起功能，在点击下面按钮时收起
	 */
	onSelect: function(m, d) {
		var me = this;

		me.setValue(d);
		me.fireEvent('select', me, d);
		//me.collapse();

		// 如果控件有最小值，设置时分秒的最小值
		if (me.picker.minDate) {
			if (Ext.Date.format(me.picker.minDate, me.format).substr(0, 10) == Ext.Date.format(me.value, me.format).substr(0, 10)) {

			} else {
				//me.picker.hour.setMinValue(0);
				me.picker.minute.setMinValue(0);
				me.picker.second.setMinValue(0);
			}
		}
	},
	confirmBtnHandler:function(){
		var me =this;
		var btn = me.ConfirmBtn;
		if (btn && !btn.disabled) {
			var datetime = "";
			datetime += Ext.Date.format(me.value, me.format)
				.substr(0, 10);
			datetime += " ";
			datetime += me.hour.getValue();
			datetime += ":";
			datetime += me.minute.getValue();
			datetime += ":";
			datetime += me.second.getValue();
			datetime = Ext.Date.format(new Date(datetime), me.format)
			me.fireEvent('select', me, datetime, true);
			me.onSelect();
			Ext.getCmp(this.dateTimeId).collapse();
		}
	
	},
	resetBtnHandler:function(){
		var me = this, btn = me.ResetBtn;
		
		if (btn && !btn.disabled) {
			me.setValue(Ext.Date.clearTime(new Date()));
			me.hour.setValue("00");
			me.minute.setValue("00");
			me.second.setValue("00");
			me.fireEvent('select', me, "", false);
			me.onSelect();
			Ext.getCmp(this.dateTimeId).collapse();
		}
		return me;
			
	},
	/**
	 * 重新方法，点击时收起面板
	 */
	selectToday: function() {
		var me = this,
			btn = me.todayBtn,
			handler = me.handler;

		if (btn && !btn.disabled) {
			me.setValue(Ext.Date.clearTime(new Date()));
			me.fireEvent('select', me, me.value);
			if (handler) {
				handler.call(me.scope || me, me, me.value);
			}
			me.onSelect();
			Ext.getCmp(this.dateTimeId).collapse();
		}
		return me;
	}
});