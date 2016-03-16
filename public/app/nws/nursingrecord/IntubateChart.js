/**
 * 定义护理记录管道面板
 *
 * @author chm
 * @version 2014-3-3
 */
Ext.define('com.dfsoft.icu.nws.nursingrecord.IntubateChart',{
    extend 	: 'Ext.chart.Chart',
    alias	: 'widget.intubatechart',

    requires	: ['com.dfsoft.icu.nws.nursingrecord.IntubateChartStore'],

    initComponent : function(){
        Ext.apply(this, {
            border	    : false,

            margin      : '10 -5 10 -5',

            legend: {
                position: 'top'
            },

            style: 'background:#fff',
            animate: true,
            shadow: false,
            store : Ext.create('com.dfsoft.icu.nws.nursingrecord.IntubateChartStore', {patientInfo: this.patientInfo}),

            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['DAY'],
                label: {
                    renderer: Ext.util.Format.numberRenderer('0.00')
                },
                title: '天数',
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['NAME'],
                title: '管道'
            }],
            series: [{
                type: 'column',
                axis: 'left',
                title :'天数',
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 100,
                    height: 28,
                    renderer: function(storeItem, item) {
                        var fromatStr = '0.0';
                        var value = storeItem.get('DAY').toString();
                        var index = value.indexOf('.');
                        if(index !=-1 && value.charAt(index+1) == 0){
                            fromatStr = '0';
                        }
                        this.setTitle(storeItem.get('NAME') + ': ' + Ext.util.Format.number(value, fromatStr) + '天');
                    }
                },
                label: {
                    display: 'insideEnd',
                    'text-anchor': 'right',
                    field: 'DAY',
                    renderer: Ext.util.Format.numberRenderer('0.0'),
                    orientation: 'horizontal',
                    color: '#333'/*,
                    rotate: {
                        degrees: 45
                    }*/
                },
                xField: 'NAME',
                yField: 'DAY'
            }]
        });

        this.callParent(arguments);
    }
});