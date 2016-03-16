//适配器任务队列 {linkUrl:'', linkId:'', surgeryId, adapterId:'', protocol:'', lastSaveDate:13212121232, interval:60, items:[]}
var adapterTaskQueue = [];

exports.addAdapterTask = function(task) {

	for (var i = 0; i < adapterTaskQueue.length; i++) {
		if (adapterTaskQueue[i].adapterId === task.adapterId) {
			adapterTaskQueue[i] = task;
			return;
		}
	}
	adapterTaskQueue.push(task);
};

exports.removeAdapterTask = function(adapterId) {

	for (var i = 0; i < adapterTaskQueue.length; i++) {
		if (adapterTaskQueue[i].adapterId === adapterId) {
			adapterTaskQueue.splice(i, 1);
			return;
		}
	}
};

exports.getAdapterTaskById = function(id) {
	for (var i = 0; i < adapterTaskQueue.length; i++) {
		if (adapterTaskQueue[i].adapterId === id) {
			return adapterTaskQueue[i];
		}
	}
	return null;
};