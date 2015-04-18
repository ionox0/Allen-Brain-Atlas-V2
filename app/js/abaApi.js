var _ = require('underscore');

module.exports = {

	getExpressionData: function(geneAcronym, callback) {
		var thiz = this;
		this.requestProbeId(geneAcronym).done(function(data) {
	    thiz.requestExprVals(data.msg[0].id).done(function(data2) {
	  		callback(data2);
			});
	  });
	},

	requestProbeId: function(geneAcronym){
		console.log("REQUESTPROBEID", geneAcronym);
		var thiz = this;
		var base = 'http://api.brain-map.org';
		var path = '/api/v2/data/query.json';
		var queryString = "?criteria=model::Probe," +
			"rma::criteria,[probe_type$eq'DNA']," +
			"products[abbreviation$eq'HumanMA']," +
			"gene[acronym$eq'" + geneAcronym + "']," +
			"rma::options[only$eq'probes.id']";
		var url = base + path + queryString;
		return $.ajax({
		  url: url
		});
	},

	requestExprVals: function(probeId) {
		console.log("REQUESTEXPRVALS", probeId);
		var thiz = this;
		var url = "http://api.brain-map.org/api/v2/data/query.json" +
			"?criteria=" +
			  "service::human_microarray_expression" +
				  "[probes$eq" + probeId + "]" +
				  "[donors$eq15496]";
				  // "[structures$eq9148]";
		return $.ajax({
		  url: url
		}); 
	}

};