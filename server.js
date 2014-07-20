var express = require('express');
var app = express();
var http = require('http').Server(app);
var routes = require('./routes');
var path = require('path');
var io = require('socket.io')(http);
var data = [12, 24, 32, 48, 60, 80, 120, 210 ];
var requests = 0;

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
  socket.on('need data', function(msg){
    requests++;
    io.emit('new data', data[requests % data.length]);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});