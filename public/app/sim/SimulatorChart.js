Ext.define('com.dfsoft.lancet.sim.SimulatorChart', {
	extend: 'Ext.Component',

    requires: [
        'Ext.chart.*',
        'Ext.data.JsonStore'
    ],

    init: function() {

    },

    //创建心电图
    createEcgChart: function() {
    	var me = this;
    	me.ecg = {};
    	me.ecg.data = [];
		me.ecg.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateEcgData();

        var panel = Ext.getCmp('simulator-ecg-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'ECG',
            style: 'color: chartreuse; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'ECG',
			store: me.ecg.store,
			color: 'chartreuse',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生心电图数据，index是当前产生到了样本数据的第几个。
    generateEcgData: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [1, 1, 1, 3, 1, 1, 0, 10, 0, 1, 1, 4, 1, 1, 1];
        if (me.ecg.data.length === 0) {
        	//一次产生8个波形
        	var time = 0;
        	for(var r = 0; r < 8; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.ecg.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.ecg.store.loadData(me.ecg.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.ecg.store.data.removeAt(0);
            me.ecg.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.ecg.store.last().data;
            me.ecg.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建血氧饱和度容积波
    createSpO2Chart: function() {
    	var me = this;
    	me.spo2 = {};
    	me.spo2.data = [];
		me.spo2.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateSpO2Data();

        var panel = Ext.getCmp('simulator-spo2-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'PLETH',
            style: 'color: turquoise; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'SpO2',
			store: me.spo2.store,
			color: 'turquoise',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生容积波数据，index是当前产生到了样本数据的第几个。
    generateSpO2Data: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [1, 2, 8, 10, 8, 5, 6, 5];
        if (me.spo2.data.length === 0) {
        	//一次产生8个波形
        	var time = 0;
        	for(var r = 0; r < 8; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.spo2.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.spo2.store.loadData(me.spo2.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.spo2.store.data.removeAt(0);
            me.spo2.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.spo2.store.last().data;
            me.spo2.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建有创血压图
    createArtChart: function() {
    	var me = this;
    	me.art = {};
    	me.art.data = [];
		me.art.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateArtData();

        var panel = Ext.getCmp('simulator-art-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'ART',
            style: 'color: red; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'ART',
			store: me.art.store,
			color: 'red',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生有创血压数据，index是当前产生到了样本数据的第几个。
    generateArtData: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [1, 3, 5, 7, 9, 8.5, 8, 7, 6, 6.5, 6.5, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        if (me.art.data.length === 0) {
        	//一次产生5个波形
        	var time = 0;
        	for(var r = 0; r < 5; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.art.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.art.store.loadData(me.art.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.art.store.data.removeAt(0);
            me.art.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.art.store.last().data;
            me.art.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建中心静脉压图
    createCvpChart: function() {
    	var me = this;
    	me.cvp = {};
    	me.cvp.data = [];
		me.cvp.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateCvpData();

        var panel = Ext.getCmp('simulator-cvp-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'CVP',
            style: 'color: slateblue; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'CVP',
			store: me.cvp.store,
			color: 'slateblue',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生中心静脉压数据，index是当前产生到了样本数据的第几个。
    generateCvpData: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [3, 4, 4.5, 4.8, 5, 4.5, 4, 4, 4.5, 5, 5.5, 6, 7, 7, 6.5, 6, 5, 5.5, 5.5, 4, 3];
        if (me.cvp.data.length === 0) {
        	//一次产生4个波形
        	var time = 0;
        	for(var r = 0; r < 4; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.cvp.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.cvp.store.loadData(me.cvp.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.cvp.store.data.removeAt(0);
            me.cvp.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.cvp.store.last().data;
            me.cvp.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建呼吸末二氧化碳分压图
    createCo2Chart: function() {
    	var me = this;
    	me.co2 = {};
    	me.co2.data = [];
		me.co2.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateCo2Data();

        var panel = Ext.getCmp('simulator-co2-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'CO2',
            style: 'color: yellow; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'CO2',
			store: me.co2.store,
			color: 'yellow',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生呼吸末二氧化碳数据，index是当前产生到了样本数据的第几个。
    generateCo2Data: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [0, 0, 0, 0, 0, 0, 7, 7.5, 7.6, 7.7, 7.8, 7.9, 8, 0];
        if (me.co2.data.length === 0) {
        	//一次产生6个波形
        	var time = 0;
        	for(var r = 0; r < 6; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.co2.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.co2.store.loadData(me.co2.data);
		} else {
			//样本数据为到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.co2.store.data.removeAt(0);
            me.co2.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.co2.store.last().data;
            me.co2.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建呼吸机气道压图
    createPawChart: function() {
    	var me = this;
    	me.paw = {};
    	me.paw.data = [];
		me.paw.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generatePawData();

        var panel = Ext.getCmp('simulator-paw-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'PAW',
            style: 'color: slateblue; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'PAW',
			store: me.paw.store,
			color: 'slateblue',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生呼吸机气道压数据，index是当前产生到了样本数据的第几个。
    generatePawData: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [0, 0, 0, 1, 4, 5, 5.5, 9, 8, 7, 6, 5, 4, 4.1, 4.1, 3, 0];
        if (me.paw.data.length === 0) {
        	//一次产生8个波形
        	var time = 0;
        	for(var r = 0; r < 8; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.paw.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.paw.store.loadData(me.paw.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.paw.store.data.removeAt(0);
            me.paw.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.paw.store.last().data;
            me.paw.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

  	//创建呼吸机流量图
    createFlowChart: function() {
    	var me = this;
    	me.flow = {};
    	me.flow.data = [];
		me.flow.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateFlowData();

        var panel = Ext.getCmp('simulator-flow-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'FLOW',
            style: 'color: slateblue; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'FLOW',
			store: me.flow.store,
			color: 'slateblue',
			minimum: 0,
			maximum: 10,
			smooth: true
		}));
		return this;
    },

    //产生呼吸机流量数据，index是当前产生到了样本数据的第几个。
    generateFlowData: function (index) {
    	var me = this;
    	//样本数据
    	var standardData = [1, 1, 3, 5, 8, 9, 8, 7, 6, 3, 2, 1];
        if (me.flow.data.length === 0) {
        	//一次产生8个波形
        	var time = 0;
        	for(var r = 0; r < 8; r++) {
		        for (var i = 0; i < standardData.length; i++) {
			        me.flow.data.push({
			        	value: standardData[i],
			        	time: time++
			        });
			    }
			}
		    me.flow.store.loadData(me.flow.data);
		} else {
			//样本数据到了末尾就要复位。
			if(index > standardData.length) 
				index = 0;
			me.flow.store.data.removeAt(0);
            me.flow.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.flow.store.last().data;
            me.flow.store.loadData([{
                value: standardData[index],
                time: lastData.time + 1
            }], true);
            index++;
		}
		return index;
    },

    //创建双频脑电指数图
    createBisChart: function() {
    	var me = this;
    	me.bis = {};
    	me.bis.data = [];
		me.bis.store = Ext.create('store.json', {
        	fields: ['value', 'time']
    	});

		me.generateBisData();

        var panel = Ext.getCmp('simulator-bis-chart-panel');
        panel.insert(0, {
            xtype: 'label',
            text: 'BIS',
            style: 'color: yellow; position: absolute;'
        });
		panel.insert(1, me.chartTemplate({
			item: 'BIS',
			store: me.bis.store,
			color: 'yellow',
			minimum: 20,
			maximum: 100,
			smooth: false
		}));
		return this;
    },

    //产生双频脑电指数
    generateBisData: function (newValue) {
    	var me = this;
        if (me.bis.data.length === 0) {
        	me.bis.data.push({
        		value: 20,
        		time: 0
        	});
	        for (var i = 1; i < 100; i++) {
		        me.bis.data.push({
		        	value: parseInt(Math.random()*(100-20)+20),
		        	time: i
		        });
		    }
		    me.bis.store.loadData(me.bis.data);
		} else {
			me.bis.store.data.removeAt(0);
            me.bis.store.data.each(function(item, key) {
                item.data.time = key;
            });

            var lastData = me.bis.store.last().data;
            me.bis.store.loadData([{
                value: newValue,
                time: lastData.time + 1
            }], true);            
		}
    },

    chartTemplate: function(opts) {
		Ext.define('Ext.chart.theme.LancetChartTheme-' + opts.item, {
		    extend: 'Ext.chart.theme.Base', 
		    constructor: function(config) {
		        this.callParent([Ext.apply({           
		            colors: [opts.color]
		        }, config)]);
		    }
		});

	    return {
            xtype: 'chart',
            animate: false,
            store: opts.store,
            theme: 'LancetChartTheme-' + opts.item,
            style: 'margin-left: -9px; margin-bottom: -9px;',
            axes: [{
                type: 'Numeric',
                position: 'left',
                minimum: opts.minimum,
                maximum: opts.maximum,
                fields: ['value'],
                grid: false,
                hidden: true
            }],
            series: [{
                type: 'line',
                smooth: opts.smooth,
                showMarkers: true,
                fill: false,
                axis: 'left',
                xField: 'time',
                yField: 'value',
                style: {
                    'stroke-width': 2
                }, 
                markerConfig: {
		            type: 'circle',
		            radius: 0,
		            'stroke-width': 0
                }
            }]
	    };
    }
});