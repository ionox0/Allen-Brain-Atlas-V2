var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic('./app')).listen(8080);