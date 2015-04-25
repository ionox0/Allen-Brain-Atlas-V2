var _ = require('underscore');
var promise = require('./promise');
var RSVP = require('rsvp');

module.exports = {

	corsproxy: 'http://localhost:9292/',
	base: 'api.brain-map.org',
	path: '/api/v2/data/query.json',

	getExpressionData: function(geneAcronym, callback) {
		var thiz = this;
		this.requestProbeId(geneAcronym).done(function(data) {
	    thiz.requestExprVals(data.msg[0].id).done(function(data2) {
	  		return callback(data2);
			});
	  });
	},

	requestProbeId: function(geneAcronym){
		console.log("REQUESTPROBEID", geneAcronym);
		var queryString = "?criteria=model::Probe," +
			"rma::criteria,[probe_type$eq'DNA']," +
			"products[abbreviation$eq'HumanMA']," +
			"gene[acronym$eq'" + geneAcronym + "']," +
			"rma::options[only$eq'probes.id']";
		var url = this.corsproxy + this.base + this.path + queryString;
		return $.ajax({
		  url: url
		});
	},

	requestExprVals: function(probeId) {
		console.log("REQUESTEXPRVALS", probeId);
		var queryString = "?criteria=" +
			  "service::human_microarray_expression" +
				  "[probes$eq" + probeId + "]";
				  //"[donors$eq15496]";
				  // "[structures$eq9148]";
		var url = this.corsproxy + this.base + this.path + queryString;
		return $.ajax({
		  url: url
		}); 
	}
};