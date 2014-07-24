var express = require('express');
var app = express();
var http = require('http').Server(app);
var routes = require('./routes');
var path = require('path');
var io = require('socket.io')(http);
var request = require('request');
var querystring = require('querystring');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('dev' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/', routes.index);
app.set('port', 3001);

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('need data', function(msg) {
    console.log("msg: " + msg);
    getLinkBacks(msg, socket);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


var getLinkBacks = function(title, socket) {
  var root = "http://en.wikipedia.org/w/api.php?";
  var params = {
    action: "query",
    list:   "backlinks",
    bltitle: title,
    bllimit: 1,
    format: "json",
    blfilterredir: "nonredirects",
    blnamespace: 0
  };
  var endpoint = root + querystring.stringify(params);
  request.get(endpoint, function(err, res, body) {
    console.log(JSON.parse(body))
    socket.emit("new data", body);
  });
};


http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});