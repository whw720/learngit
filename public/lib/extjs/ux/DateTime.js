/**
 * 带时分秒的日期控件
 * 
 * @author chm
 */
Ext.define('Ext.ux.datetime.DateTime', {
			extend : 'Ext.form.field.Date',
			alias : 'widget.datetimefield',
			requires : ['Ext.ux.datetime.DateTimePicker'],
			trigger1Cls : Ext.baseCSSPrefix + 'form-date-trigger',
			format : 'Y-m-d H:i:s',
			initComponent : function() {
				var me = this;
				me.callParent(arguments);
			},
			/**
			 * 创建时间选择器
			 * 
			 * @return {}
			 */
			createPicker : function() {
				var me = this, format = Ext.String.format;
				return new Ext.ux.datetime.DateTimePicker({
							dateTimeId : this.id,
							pickerField : me,
							ownerCt : me.ownerCt,
							renderTo : document.body,
							floating : true,
							hidden : true,
							focusOnShow : true,
							minDate : me.minValue,
							maxDate : me.maxValue,
							disabledDatesRE : me.disabledDatesRE,
							disabledDatesText : me.disabledDatesText,
							disabledDays : me.disabledDays,
							disabledDaysText : me.disabledDaysText,
							format : me.format,
							showToday : me.showToday,
							startDay : me.startDay,
							minText : format(me.minText, me
											.formatDate(me.minValue)),
							maxText : format(me.maxText, me
											.formatDate(me.maxValue)),
							listeners : {
								scope : me,
								select : me.onSelect
							},
							keyNavConfig : {
								esc : function() {
									me.collapse();
								}
							}
						});
			},

			
			/**
			 * @private 设置选择器的值
			 */
			onExpand : function() {
                var me = this, value = me.getValue() ? me
						.getValue() : new Date();
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
			        if(me.picker.minDate){
						if(Ext.Date.format(me.picker.minDate, me.format).substr(0, 10) == Ext.Date.format(me.value, me.format).substr(0, 10)){
							me.picker.hour.setMinValue(serverDate.substr(11, 2));
							me.picker.hour.setValue(serverDate.substr(11, 2));
							
							me.picker.minute.setMinValue(serverDate.substr(14, 2));
							me.picker.minute.setValue(serverDate.substr(14, 2));
							
							me.picker.second.setMinValue(serverDate.substr(17, 2));
							me.picker.second.setValue(serverDate.substr(17, 2));
						}else{
							me.picker.hour.setMinValue(0);
							me.picker.minute.setMinValue(0);
							me.picker.second.setMinValue(0);
						}
					}
			    }
		});
