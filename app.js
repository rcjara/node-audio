
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , socket = require('socket.io')
  , path = require('path')
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var httpServer = http.createServer(app)

httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socket.listen(httpServer);


io.on('connection', function(client) {
  console.log('I be connected');
  client.emit('message', {text: 'Welcome to the server'});
  client.broadcast.emit('message', {text: 'Someone just connected.'});

  client.on('keypress', function(msg) {
    client.broadcast.emit('message', { text: 'Some dude just pressed f.' });
  });
});

