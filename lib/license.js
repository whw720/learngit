(function() {

	var fs = require("fs");
	var ursa = require("ursa");
	var async = require('async');
	var address = require('network-address');
	var colors = require('colors');
	var PUBLIC_KEY = fs.readFileSync(__dirname + "/lancet.pub");
	var decoded = {};

	function decrypt(keypath) {
		var encoded = fs.readFileSync(keypath);
		var publKey = ursa.createPublicKey(PUBLIC_KEY);
		var decoded = publKey.publicDecrypt(encoded).toString('utf8');
		return decoded;
	}

	var License = function(keypath) {
		decoded = JSON.parse(decrypt(keypath));
		this.validate();
	};

	License.prototype.getHospitalName = function() {
		return decoded.name;
	}

	License.prototype.getExpirationDate = function() {
		return decoded.expiration;
	}

	License.prototype.getConcurrent = function() {
		return decoded.concurrent;
	}

	License.prototype.validate = function() {
		async.series([
			function(callback) {
				require('getmac').getMac(function(err, macAddress) {
					if(decoded.mac == '00:00:00:00:00:00' || 
						macAddress.replace(/-/g, ':') == decoded.mac) {
						callback(null, 'mac authentication successful.');
					} else {
						callback('mac authentication failure!');
						process.exit();
					}
				});
			},
			function(callback) {
				if(decoded.ip == '0.0.0.0' || 
					address() == decoded.ip) {
					callback(null, 'ip authentication successful.');
				} else {
					callback('ip authentication failure!');
					process.exit();
				}
			},
			function(callback) {
				if(new Date(decoded.expiration) >= new Date()) {
					callback(null, 'expiration date authentication successful.');
				} else {
					callback('expiration data authentication failure!');
					process.exit();
				}
			}
		], function (err, results) {
			if (err) {
				console.log(err.red);
			}
		});
	};
	
	module.exports = License;
}());