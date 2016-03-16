var License = require('./license.js');

var license = new License('../lancet-anesthesia.key');
license.validate();
console.log('Hospital Name: ' + license.getHospitalName());
console.log('Expiration Date: ' + license.getExpirationDate());