
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
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

var httpServer = http.createServer(app)

httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socket.listen(httpServer);

io.on('connection', function(client) {
  client.emit('authorized', { text: 'Connected.  Welcome to Jam-r.'
                            , clientID: client.id
                            });

  var clientMethods = [];
  for (var attr in client) {
    clientMethods.push(attr);
  }
  console.log(clientMethods);
  client.broadcast.emit('message', { text: 'Someone just connected.' });

  client.on('synth-event', function(e) {
    client.broadcast.emit('synth-event', e);
    client.emit('synth-event', e);
  });

});

