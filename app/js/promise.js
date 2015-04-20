module.exports = function(callback){
	return {
		callback: callback,
		done: function() {
			this.callback();
		}
	};
};