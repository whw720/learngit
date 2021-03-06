/**
 *
 * 功能说明: 月份选择控件，只能选择 年、月
 * @author: 王帅
 * @DATE:2012-8-9 @TIME: 上午11:43:58
 */
Ext.define('Ext.ux.tree.plugin.MonthComboBox', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.monthcombo',
    requires: ['Ext.picker.Date'],
    editable: false,
    triggerCls: Ext.baseCSSPrefix + 'form-date-trigger',
    matchFieldWidth: false,
    startDay: new Date(),
    initComponent: function () {
        var me = this;
        me.disabledDatesRE = null;
        me.callParent();
    },
    initValue: function () {
        var me = this;
        value = me.value;
        if (Ext.isString(value)) {
            me.value = Ext.Date.parse(value, this.format);
        }
        if (me.value)
            me.startDay = me.value;
        /**
         * 限制最大、最小值
         */
//        if(currentYearmonth && initYearmonth){
//	        //TODO 待实现
//    	}
//        /**
//         * 如果没有默认值，初始化进去
//         */
//        if(!me.value && currentYearmonth!=null){
//        	me.value = Ext.Date.parse(currentYearmonth, 'Ym');
//        	me.startDay = me.value;
//        }
        me.callParent();
        me.addEvents('select');
    },
    rawToValue: function (rawValue) {
        return Ext.Date.parse(rawValue, this.format) || rawValue || null;
    },
    valueToRaw: function (value) {
        return this.formatDate(value);
    },
    formatDate: function (date) {
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
    },
    createPicker: function () {
        var me = this;
        format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            shadow: false,
            height:240,
            focusOnShow: true,
            listeners: {
                scope: me,
                cancelclick: me.onCancelClick,
                okclick: me.onOkClick,
                yeardblclick: me.onOkClick,
                monthdblclick: me.onOkClick
            }
        });
    },
    /**展开默认值**/
    onExpand: function () {
        this.picker.setValue(this.startDay);
    },
    /**选中**/
    onOkClick: function (picker, value) {
        var me = this;
        month = value[0],
            year = value[1],
            date = new Date(year, month, 1);
        me.startDay = date;
        me.setValue(parseInt(Ext.Date.dateFormat(date, me.format)));
        me.value=date;
        me.collapse();
        me.fireEvent('select',me,picker);
    },
    /**取消**/
    onCancelClick: function () {
        var me = this;
        me.collapse();
    },
    /**
     * 获取控件时间
     * 格式： Ym
     */
    getYearMonth:function(){
        var me = this;
        return Ext.Date.dateFormat(this.value, me.format);//格式化成201205
    },
    /**
     * 获取控件时间
     * 格式： Ym
     */
    getValue:function(){
        var me = this;
        return Ext.Date.dateFormat(this.value, me.format);//格式化成201205
    },
    /**
     * 设置控件时间,初始化时间用
     * Example:
     * firstYearmonth = new dac.compoents.dictionary.MonthComboBox({
					    fieldLabel: '日期', 
					    labelWidth: 30, 
					    labelAlign: 'right'
					});
     firstYearmonth.setYearMonth("201212");
     * 格式：Ym
     */
    setYearMonth:function(value){
        var me = this;
        var date = Ext.Date.parse(value, "Ym");//转成Date
        me.value = date;
        this.initValue();
    },
    //设置默认值
    setDefaultValue:function(value){
        this.setYearMonth(value);
        this.fireEvent('select',this);
    }
});