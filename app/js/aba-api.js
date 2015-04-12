// Listen for 'return' in gene-entry field:
$("#gene-entry").keyup(function (e) {
	if (e.keyCode == 13) {
		requestProbeId();  
	}
});

function requestProbeId() {
	var geneAcronym = $('#gene-entry').val(); 
	var base = "http://api.brain-map.org";
	var path = "/api/v2/data/query.json";
	var queryString = "?criteria=model::Probe," +
		"rma::criteria,[probe_type$eq'DNA']," +
		"products[abbreviation$eq'HumanMA']," +
		"gene[acronym$eq'" + geneAcronym + "']," +
		"rma::options[only$eq'probes.id']";
	var url = base + path + queryString;

	console.log("Probe Request URL: " + url);
	$.ajax({
	  url: url,
	  // beforeSend: function( xhr ) {
	  //   xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	  // }
	})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log(data);
      requestExprVals(data.msg[0].id);
    }
  });
}

function requestExprVals(probeId) {
	var url = "http://api.brain-map.org/api/v2/data/query.json" +
		"?criteria=" +
		  "service::human_microarray_expression" +
			  "[probes$eq" + probeId + "]" +
			  "[donors$eq15496]";
			  // "[structures$eq9148]";

	console.log("ExprVals Request URL: " + url);
	$.ajax({
	  url: url,
	  // beforeSend: function( xhr ) {
	  //   xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	  // }
	})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log(data);
      return data;
    }
  });	  
}