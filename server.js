var express = require('express');
var app = express();
var http = require('http').Server(app);
var routes = require('./routes');
var path = require('path');
var io = require('socket.io')(http);
var wikipedia = require('./wikipedia');

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
    wikipedia.getLinkBacks(msg, "", function(content) {
      socket.emit("new data", content);
    });
  });
  socket.on('get article', function(msg) {
    wikipedia.getArticle(msg, function(content) {
      socket.emit("found article", content);
    });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});