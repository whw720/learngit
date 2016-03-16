Ext.define('com.dfsoft.lancet.sim.App', {
    extend: 'com.dfsoft.lancet.sys.desktop.Module',

    requires: [
        'com.dfsoft.lancet.sim.SimulatorPanel',
        'com.dfsoft.lancet.sim.SimulatorChart'
    ],

    id: 'sim',

    init : function() {
        var me = this;
        Ext.util.CSS.swapStyleSheet('sim.css', '/app/sim/css/sim.css');
        Ext.Loader.injectScriptElement('/socket.io/socket.io.js');
        this.launcher = {
            text: '监护仪模拟器',
            iconCls:'sim-small'
        };
    },

    toFixed: function(number, precision) {
        var multiplier = Math.pow(10, precision);
        return Math.round(number * multiplier) / multiplier;
    },

    startListen: function() {
        var me = this;
        //判断是重连还是新连到socket.io。
        if (!me.socket) {
            me.socket = io.connect(webRoot);
        } else {
            me.socket.socket.connect();
        }
        me.socket.emit('simulator', 'start');
        var calcArtAvg = function(shrinkId, diastolicId) {
            //计算平均动脉压（舒张压+1/3脉压差）
            var shrink = parseInt(Ext.getCmp(shrinkId).text);
            var diastolic = parseInt(Ext.getCmp(diastolicId).text);
            return parseInt(diastolic + ((1/3) * (shrink - diastolic)));
        };

        me.socket.on('now-time', function(data) {
            Ext.getCmp('simulator-now-time').setText(data.VALUE.substring(0, data.VALUE.lastIndexOf(':')));
        });

        me.socket.on('HR', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-hr').setText(data);
            Ext.getCmp('simulator-pr').setText(data);
            //me.ecgIndex = me.ecgChart.generateEcgData(me.ecgIndex);
        });
        me.socket.on('SpO2', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-spo2').setText(data);
            //me.spo2Index = me.spo2Chart.generateSpO2Data(me.spo2Index);
        });
        me.socket.on('ART-SBP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-art-shrink').setText(data);
            Ext.getCmp('simulator-art-avg').setText('(' + calcArtAvg('simulator-art-shrink', 'simulator-art-diastolic') + ')');
            //me.artIndex = me.artChart.generateArtData(me.artIndex);
        });
        me.socket.on('ART-DBP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-art-diastolic').setText(data);
            Ext.getCmp('simulator-art-avg').setText('(' + calcArtAvg('simulator-art-shrink', 'simulator-art-diastolic') + ')');
        });
        me.socket.on('RAP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-rap').setText(data);
        });
        me.socket.on('CVP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-cvp').setText(data);
            //me.cvpIndex = me.cvpChart.generateCvpData(me.cvpIndex);
        });
        me.socket.on('ICP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-icp').setText(data);
        });
        me.socket.on('ET-CO2', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-et-co2').setText(data);
            //me.co2Index = me.co2Chart.generateCo2Data(me.co2Index);
            //me.pawIndex = me.pawChart.generatePawData(me.pawIndex);
        });
        me.socket.on('FI-CO2', function(data) {
            data = me.toFixed(data.VALUE, 1);
            Ext.getCmp('simulator-fi-co2').setText(data);
        });
        me.socket.on('CO', function(data) {
            Ext.getCmp('simulator-co').setText(data.VALUE);
        });
        me.socket.on('PIP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-pip').setText(data);
        });
        me.socket.on('Pplat', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-pplat').setText(data);
        });
        me.socket.on('Pmean', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-pmean').setText(data);
        });
        me.socket.on('PEEP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-peep').setText(data);
        });
        me.socket.on('VT', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-tvi').setText(data);
            Ext.getCmp('simulator-tve').setText(data);
        });
        me.socket.on('RR', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-awrr').setText(data);
            Ext.getCmp('simulator-rr').setText(data);
            //me.flowIndex = me.flowChart.generateFlowData(me.flowIndex);
        });
        me.socket.on('BIS', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-bis').setText(data);
            //me.bisChart.generateBisData(data);
        });
        me.socket.on('NIBP-SBP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-nibp-shrink').setText(data);
            Ext.getCmp('simulator-nibp-avg').setText('(' + calcArtAvg('simulator-nibp-shrink', 'simulator-nibp-diastolic') + ')');
        });
        me.socket.on('NIBP-DBP', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-nibp-diastolic').setText(data);
            Ext.getCmp('simulator-nibp-avg').setText('(' + calcArtAvg('simulator-nibp-shrink', 'simulator-nibp-diastolic') + ')');
        });
        me.socket.on('ET-O2', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-o2-et').setText(data);
        });
        me.socket.on('FI-O2', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-o2-fi').setText(data);
        });
        me.socket.on('ET-N2O', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-n2o-et').setText(data);
        });
        me.socket.on('FI-N2O', function(data) {
            data = Math.round(data.VALUE);
            Ext.getCmp('simulator-n2o-fi').setText(data);
        });
        me.socket.on('Enf', function(data) {
            data = me.toFixed(data.VALUE, 1);
            Ext.getCmp('simulator-enf-mac').setText(data);
        });
        me.socket.on('FI-Enf', function(data) {
            data = me.toFixed(data.VALUE, 1);
            Ext.getCmp('simulator-enf-fi').setText(data);
        });
        me.socket.on('ET-Enf', function(data) {
            data = me.toFixed(data.VALUE, 1);
            Ext.getCmp('simulator-enf-et').setText(data);
        });
        me.socket.on('T', function(data) {
            data = me.toFixed(data.VALUE, 1);
            Ext.getCmp('simulator-t1').setText(data);
        });

        //1.5秒钟刷新一次图形
        me.chartRefresh = setInterval(function() {
            me.ecgIndex = me.ecgChart.generateEcgData(me.ecgIndex);
            me.spo2Index = me.spo2Chart.generateSpO2Data(me.spo2Index);
            me.artIndex = me.artChart.generateArtData(me.artIndex);
            me.cvpIndex = me.cvpChart.generateCvpData(me.cvpIndex);
            me.co2Index = me.co2Chart.generateCo2Data(me.co2Index);
            me.pawIndex = me.pawChart.generatePawData(me.pawIndex);
            me.flowIndex = me.flowChart.generateFlowData(me.flowIndex);
            me.bisChart.generateBisData(parseInt(Math.random()*(100-20)+20));  //先特殊处理BIS，因为目前Simulator还不支持对某个监测项单独设置刷新时间。
        }, 1500);
    },

    stopListen: function() {
        var me = this;
        //避免不必要的网络资源开销，用完就关闭socket.io和刷新图的定时器。
        me.socket.emit('simulator', 'stop');
        me.socket.disconnect();
        clearInterval(me.chartRefresh);
    },

    createNewWindow: function () {
        var me = this,
            desktop = me.app.getDesktop();
        var stopListen = function() {
            me.stopListen();
        }
        var simWindow = desktop.createWindow({
            id: 'sim',
            title: '监护仪模拟器',
            iconCls: 'sim-small',
            width: 940,
            height: 600,
            animCollapse: false,
            constrainHeader: true,
            border: false,
            resizable: false,
            maximizable: false,
            items: [{
                anchor: '100%',
                border: false,
                items: [
                    me.createSimulatorPanel()
                ]
            }],
            listeners: {
                beforeclose: function() {
                    //窗口关闭前停止监听器
                    stopListen();
                }
            }
        });

        me.chart = {};
        me.chart = Ext.create('com.dfsoft.lancet.sim.SimulatorChart', {parent: this});
        me.bisChart = me.chart.createBisChart();
        me.ecgChart = me.chart.createEcgChart();
        me.ecgIndex = 0;
        me.spo2Chart = me.chart.createSpO2Chart();
        me.spo2Index = 0;
        me.artChart = me.chart.createArtChart();
        me.artIndex = 0;
        me.cvpChart = me.chart.createCvpChart();
        me.cvpIndex = 0;
        me.co2Chart = me.chart.createCo2Chart();
        me.co2Index = 0;
        me.pawChart = me.chart.createPawChart();
        me.pawIndex = 0;
        me.flowChart = me.chart.createFlowChart();
        me.flowIndex = 0;

        this.startListen();
        return simWindow;
    },

    createWindow : function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    },

    createSimulatorPanel: function () {
        var panel = Ext.create('com.dfsoft.lancet.sim.SimulatorPanel', {
            parent: this
        });

        return panel;
    }
});
