/**
 * 带时分秒的时间控件选择器
 *
 * @author chm
 */
Ext.define('Ext.ux.datetime.DateTimePicker', {
	extend: 'Ext.picker.Date',
	alias: 'widget.datetimepicker',
	alternateClassName: 'Ext.DateTimePicker',
	ResetText: "Reset",
	ConfirmText: "Confirm",
	renderTpl: [
		'<div id="{id}-innerEl">',
		'<div role="presentation" class="{baseCls}-header">',
		'<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
		'<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
		'<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
		'</div>',
		'<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
		'<thead role="presentation"><tr role="presentation">',
		'<tpl for="dayNames">',
		'<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
		'</tpl>',
		'</tr></thead>',
		'<tbody role="presentation"><tr role="presentation">',
		'<tpl for="days">',
		'{#:this.isEndOfWeek}',
		'<td role="gridcell" id="{[Ext.id()]}">',
		'<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
		'<em role="presentation"><span role="presentation"></span></em>',
		'</a>',
		'</td>',
		'</tpl>',
		'</tr></tbody>',
		'</table>',
		'<tpl if="showToday">',
		'<div id="{id}-footerEl" role="presentation"   class="{baseCls}-footer">{%this.renderHour(values, out)%}{%this.renderMinute(values, out)%}{%this.renderSecond(values, out)%}{%this.renderResetBtn(values, out)%}{%this.renderTodayBtn(values, out)%}{%this.renderConfirmBtn(values, out)%}</div>',
		'</tpl>', '</div>', {
			firstInitial: function(value) {
				return Ext.picker.Date.prototype.getDayInitial(value);
			},
			isEndOfWeek: function(value) {
				value--;
				var end = value % 7 === 0 && value !== 0;
				return end ? '</tr><tr role="row">' : '';
			},
			longDay: function(value) {
				return Ext.Date.format(value, this.longDayFormat);
			},
			renderHour: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.hour
					.getRenderTree(), out);
			},
			renderMinute: function(values, out) {
				out
					.push('<font  style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');
				Ext.DomHelper.generateMarkup(values.$comp.minute
					.getRenderTree(), out);
			},
			renderSecond: function(values, out) {
				out
					.push('<font style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');
				Ext.DomHelper.generateMarkup(values.$comp.second
					.getRenderTree(), out);
			},
			renderResetBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.ResetBtn
					.getRenderTree(), out);
			},
			renderTodayBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.todayBtn
					.getRenderTree(), out);
			},
			renderConfirmBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.ConfirmBtn
					.getRenderTree(), out);
			},
			renderMonthBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.monthBtn
					.getRenderTree(), out);
			}
		}
	],
	/**
	 * 创建时分秒控件
	 */
	beforeRender: function() {
		/** --------------------- */
		var me = this;
		var fm = me.format;
		var houreDisabled = false;
		var minuteDisabled = false;
		var secondDisabled = false;
		if (fm == 'Y-m-d' || fm == 'Y年m月d日') {
			houreDisabled = true;
			minuteDisabled = true;
			secondDisabled = true;
		} else if (fm.indexOf('H') == -1) {
			houreDisabled = true;
			minuteDisabled = false;
			secondDisabled = false;
		} else if (fm.indexOf('i') == -1) {
			houreDisabled = false;
			minuteDisabled = true;
			secondDisabled = false;
		} else if (fm.indexOf('s') == -1) {
			houreDisabled = false;
			minuteDisabled = false;
			secondDisabled = true;
		};
		me.hour = Ext.create('Ext.form.field.Number', {
			scope: me,
			ownerCt: me,
			disabled: houreDisabled,
			editable: false,
			ownerLayout: me.getComponentLayout(),
			minValue: 0,
			maxValue: 23,
			width: 45,
			style: {
				float: "left"
			},
			enableKeyEvents: true,
			listeners: {
				keyup: function(field, e) {
					if (field.getValue() > 23) {
						e.stopEvent();
						field.setValue(23);
					}
				}
			}
		});

		me.minute = Ext.create('Ext.form.field.Number', {
			scope: me,
			ownerCt: me,
			style: {
				float: "left"
			},
			ownerLayout: me.getComponentLayout(),
			minValue: 0,
			maxValue: 59,
			disabled: minuteDisabled,
			editable: false,
			width: 45,
			enableKeyEvents: true,
			listeners: {
				keyup: function(field, e) {
					if (field.getValue() > 59) {
						e.stopEvent();
						field.setValue(59);
					}
				}
			}
		});

		me.second = Ext.create('Ext.form.field.Number', {
			scope: me,
			ownerCt: me,
			disabled: secondDisabled,
			editable: false,
			style: {
				float: "left"
			},
			ownerLayout: me.getComponentLayout(),
			minValue: 0,
			maxValue: 59,
			width: 45,
			enableKeyEvents: true,
			listeners: {
				keyup: function(field, e) {
					if (field.getValue() > 59) {
						e.stopEvent();
						field.setValue(59);
					}
				}
			}
		});
		// 如果有最小值，设置时分秒的最小值
		var dateMinValue = Ext.Date.format(Ext.getCmp(this.dateTimeId).minValue, this.format);
		if (dateMinValue != "") {
			me.hour.setMinValue(serverDate.substr(11, 2));
			me.minute.setMinValue(serverDate.substr(14, 2));
			me.second.setMinValue(serverDate.substr(17, 2));

		}

		me.ResetBtn = Ext.create('Ext.button.Button', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: '清空',
			handler: function() {
				var me = this,
					btn = me.ResetBtn,
					handler = me.handler;
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
			scope: me
		});
		me.ConfirmBtn = Ext.create('Ext.button.Button', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: '确定',
			//disabled: (me.format == 'Y-m-d H' || me.format == 'Y-m-d H:i' || me.format == 'Y-m-d H:i:s' || me.mutiSel && me.format != 'Y年m月d日' || me.format == 'm-d H:i') ? false : true,
			handler: function() {
				var btn = me.ConfirmBtn;
				if (btn && !btn.disabled) {
					var datetime = "";
					datetime += Ext.Date.format(me.value, 'Y-m-d H:i:s')
						.substr(0, 10);
					datetime += " ";
					datetime += me.hour.getValue();
					datetime += ":";
					datetime += me.minute.getValue();
					datetime += ":";
					datetime += me.second.getValue();

					datetime = Ext.Date.format(new Date(datetime), me.format);
					me.fireEvent('select', me, datetime, true);
					me.onSelect();
					Ext.getCmp(this.dateTimeId).collapse();
				}
			},
			scope: me
		});
		me.callParent();
	},

	/**
	 * 渲染时分秒控件
	 */
	finishRenderChildren: function() {
		this.callParent();
		/** -------------------------------------- */

		this.hour.finishRender();
		this.minute.finishRender();
		this.second.finishRender();

		this.ResetBtn.finishRender();
		this.ConfirmBtn.finishRender();
		/** -------------------------------------- */
	},
	/**
	 * Update the contents of the picker
	 *
	 * @private
	 * @param {Date}
	 *            date The new date
	 * @param {Boolean}
	 *            forceRefresh True to force a full refresh
	 */
	update: function(date, forceRefresh) {
		var me = this;
		/** -----------设置时分秒---------------- */
		date.setHours(me.hour.getValue());
		date.setMinutes(me.minute.getValue());
		date.setSeconds(me.second.getValue());
		/** -----------设置时分秒---------------- */

		me.callParent(arguments);
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
	},

	/**
	 * Update the selected cell
	 * @private
	 * @param {Date} date The new date
	 */
	selectedUpdate: function(date) {
		// 把选择的日期的时分秒设置为0，因为控件上获取的日期时分秒为0
		date = new Date(date);
		date.setHours(0, 0, 0);

		var me = this,
			t = date.getTime(),
			cells = me.cells,
			cls = me.selectedCls,
			cellItems = cells.elements,
			c,
			cLen = cellItems.length,
			cell;

		cells.removeCls(cls);

		for (c = 0; c < cLen; c++) {
			cell = Ext.fly(cellItems[c]);

			if (cell.dom.firstChild.dateValue == t) {
				me.fireEvent('highlightitem', me, cell);
				cell.addCls(cls);

				if (me.isVisible() && !me.doCancelFocus) {
					Ext.fly(cell.dom.firstChild).focus(50);
				}

				break;
			}
		}
	}
});