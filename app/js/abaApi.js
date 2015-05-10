/*jshint esnext: true */

var _ = require('underscore');
var RSVP = require('rsvp');

module.exports = {
	corsproxy: 'http://localhost:9292/',
	base: 'api.brain-map.org',
	path: '/api/v2/data/query.json',

	getExpressionData: function(geneAcronym){
		var thiz = this;
		return this.requestProbeId(geneAcronym).then(function(data){
	    return thiz.requestExprVals(data.msg[0].id); // Take the first of the returned probes
	  }, function(error){
	  	console.error(error);
	  });
	},

	requestProbeId: function(geneAcronym){
		console.log("REQUESTPROBEID", geneAcronym);
		var queryString = "?criteria=model::Probe," +
			"rma::criteria,[probe_type$eq'DNA']," +
			"products[abbreviation$eq'HumanMA']," +
			"gene[acronym$eq'" + geneAcronym + "']," +
			"rma::options[only$eq'probes.id']";
		var url = 'http://' this.base + this.path + queryString;
		var promise = this.sendXhrReturnPromise(url);
		return promise;
	},

	requestExprVals: function(probeId){
		console.log("REQUESTEXPRVALS", probeId);
		var queryString = "?criteria=" +
			  "service::human_microarray_expression" +
				  "[probes$eq" + probeId + "]";
				  // "[donors$eq15496]"; // Specify donor
				  // "[structures$eq9148]"; // Specify structure
		var url = 'http://' + this.base + this.path + queryString;
		return this.sendXhrReturnPromise(url);
	},

	sendXhrReturnPromise: function(url){
		var promise = new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			request.open('GET', url);
			request.onload = function(){
				if (request.status == 200){
	        resolve(JSON.parse(request.response));
	      } else {
	        reject(Error(request.statusText));
	      }
			};
			request.send();
		});
		return promise;
	}

};
