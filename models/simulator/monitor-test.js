var Monitor = require('./monitor.js');

var opts = {
	items: '\'66fdcf30fdaf11e2a82ced18a26e5652\', \'dacdeaa0fe6b11e280d93dcb7a309f55\', \'ef3793f0fdae11e297fe9f2e1260e7e7\'',
	timeout: 1000 * 5
};

var monitor = new Monitor(opts);

monitor.on('start', function() {
	console.log('Monitor started.');
});

monitor.on('体温（T）', function(value) {
	console.log('T: ' + value);
});

monitor.on('呼吸频率（RR）', function(value) {
	console.log('RR: ' + value);
});

monitor.on('心率（HR）', function(value) {
	console.log('HR: ' + value);
});

monitor.on('end', function() {
	console.log('Monitor end.');
});