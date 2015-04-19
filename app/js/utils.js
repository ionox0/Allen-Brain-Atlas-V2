exports.findMaxMin = function (data) {
	var min = 1000;
	var max = 0;
	for (var i = 0; i < data.length; i++){
		if (data[i] < min) min = data[i];
		if (data[i] > max) max = data[i];
	}
	return [min, max];
};