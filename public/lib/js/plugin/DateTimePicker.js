/**
 * 带时分秒的时间控件选择器
 *
 * @author chm
 */
Ext.define('com.dfsoft.lancet.plugin.DateTimePicker', {
	extend: 'Ext.picker.Date',
	alias: 'widget.datetimepicker',
	alternateClassName: 'Ext.DateTimePicker',
	ResetText: "Reset",
	ConfirmText: "Confirm",
	style: {
		fontSize: '13px'
	},
	hideResetBtn: false, // 是否隐藏清空按钮
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
		'<table id="{id}-timeEl" style="table-layout: auto;width: auto;margin: 0 3px;" class="x-datepicker-inner" cellspacing="0">',
        '<tbody><tr>',
        '<td>{%this.renderHour(values,out)%}</td>',
        '<td>{%this.renderMinute(values,out)%}</td>',
        '<td>{%this.renderSecond(values,out)%}</td>',
        '</tr></tbody>',
        '</table>',
		'<tpl if="showToday">',
		'<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderResetBtn(values, out)%}{%this.renderTodayBtn(values, out)%}{%this.renderConfirmBtn(values, out)%}</div>',
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
				/*out
					.push('<font  style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');*/
				Ext.DomHelper.generateMarkup(values.$comp.minute
					.getRenderTree(), out);
			},
			renderSecond: function(values, out) {
				/*out
					.push('<font style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');*/
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
		if (fm == 'Y-m-d' || fm == 'Y年m月d日'||fm == 'Y/m/d'||fm =='m/d'||fm =='m-d') {
			houreDisabled = true;
			minuteDisabled = true;
			secondDisabled = true;
		} else if (fm == 'Y-m-d H'||fm == 'Y/m/d H'||fm =='m/d H'||fm =='m-d H') {
			houreDisabled = false;
			minuteDisabled = true;
			secondDisabled = true;
		} else if (fm == 'Y-m-d H:i'||fm == 'Y/m/d H:i'||fm =='m/d H:i'||fm =='m-d H:i') {
			houreDisabled = false;
			minuteDisabled = false;
			secondDisabled = true;
		} else if (fm == 'Y-m-d H:i:s'||fm == 'Y/m/d H:i:s'||fm =='m/d H:i:s'||fm =='m-d H:i:s') {
			houreDisabled = false;
			minuteDisabled = false;
			secondDisabled = false;
		};
		me.hour = Ext.create('Ext.form.field.Number', {
			scope: me,
			//ownerCt: me,
			//ownerLayout: me.getComponentLayout(),
			disabled: houreDisabled,
			editable: me.editable,
			minValue: 0,
			maxValue: 23,
			width: 55,
			allowDecimals: false,
			autoStripChars: true,
			allowExponential: false,
			enableKeyEvents: true,
			listeners: {
				keyup: function(field, e) { // keyup是在change后被触发
					me.timeKeyUp('hour');
				},
				change: function(field, newValue, oldValue, eOpts) {
					if (newValue > 23) {
						field.setValue(23);
					}
				}
			}
		});

		me.minute = Ext.create('Ext.form.field.Number', {
			scope: me,
			//ownerCt: me,
			//ownerLayout: me.getComponentLayout(),
			minValue: 0,
			maxValue: 59,
			disabled: minuteDisabled,
			editable: me.editable,
			width: 70,
			labelWidth: 10,
			fieldLabel: '&nbsp;', //在组件之前渲染 ':'
			enableKeyEvents: true,
			allowDecimals: false,
			autoStripChars: true,
			allowExponential: false,
			listeners: {
				keyup: function(field, e) {
					me.timeKeyUp('minute');
				},
				change: function(field, newValue, oldValue, eOpts) {
					if (newValue > 59) {
						if (me.hour.getValue() < 23) {
							me.hour.setValue(me.hour.getValue() + 1);
							field.setValue(0);
						} else {
							field.setValue(59);
						}
					}
				}
			}
		});

		me.second = Ext.create('Ext.form.field.Number', {
			scope: me,
			//ownerCt: me,
			//ownerLayout: me.getComponentLayout(),
			disabled: secondDisabled,
			editable: me.editable,
			minValue: 0,
			maxValue: 59,
			width: 70,
			labelWidth: 10,
            fieldLabel: '&nbsp;', //在组件之前渲染 ':'
			allowDecimals: false,
			autoStripChars: true,
			allowExponential: false,
			listeners: {
				change: function(field, newValue, oldValue, eOpts) {
					if (newValue > 59) {
						me.minute.setValue(me.minute.getValue() + 1);
						field.setValue(0);
					}
				}
			}
		});


		me.ResetBtn = Ext.create('Ext.button.Button', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: '清空',
			handler: me.resetBtnHandler,
			scope: me,
			hidden: me.hideResetBtn
		});
		me.ConfirmBtn = Ext.create('Ext.button.Button', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: '确定',
			disabled: false,//(me.format == 'Y-m-d'||me.format == 'Y/m/d' || me.format == 'Y-m-d H'|| me.format == 'Y/m/d H'|| me.format == 'Y-m-d H:i'|| me.format == 'Y/m/d H:i' || me.format == 'Y-m-d H:i:s'||me.format == 'Y/m/d H:i:s' || me.mutiSel && me.format != 'Y年m月d日') ? false : true,
			handler: me.confirmBtnHandler,
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
	},
	/**
	 * timeKeyUp
	 * 在小时输入框，如果输入的值等于0、或在3,4...23范围内、或者为01,02 ，则自动切换到分钟输入框
	 */
	timeKeyUp: function(part) {
		if (part == 'hour') {
			var value = this.hour.getValue();
			var raw = this.hour.getRawValue();
			if (value !== null && value !== undefined) {
				if (value === 0 || (value > 2 && value < 24) || raw === '01' || raw === '02') {
					if (!this.minute.isDisabled()) {
						this.minute.focus();
					}
				}
			}
		} else if (part == 'minute') {
			var value = this.minute.getValue();
			if (value !== null && value !== undefined) {
				if (value == 0 || (value > 5 && value < 60)) {
					if (!this.second.isDisabled()) {
						this.second.focus();
					}
				}
			}
		}
	},
	abstractError: function(name) {
		throw new Error(name + " 是abstract方法，子类应该implement该方法");
	},
	confirmBtnHandler: function() {
		this.abstractError('confirmBtnHandler');
	},

	resetBtnHandler: function() {
		this.abstractError('resetBtnHandler');
	},

	selectToday: function() {
		this.abstractError('selectToday');
	}

});