var express = require('express'),
  app       = express(),
  port      = process.env.PORT || 3001;

app.use(express.static('./app'));

app.listen(port, function(){
  console.log('listening on port ' + port);
})