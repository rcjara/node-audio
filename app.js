
/**
 * Module dependencies.
 */

var express = require('express')
  , _ = require('underscore')
  , http = require('http')
  , socket = require('socket.io')
  , path = require('path')
  , socketServerSide = require('./lib/server-side')
  , namingScheme = require('./lib/naming-scheme')
  , rooms = require('./lib/rooms')
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

//Set up httpServer
var httpServer = http.createServer(app)

httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//Set up rooms
rooms.setNamingScheme(namingScheme);
rooms.reset();

//Set up sockets
socketServerSide.start(socket, httpServer, rooms);

//Set up routes
app.get('/', function(req, res){
  res.render('index', { title: 'Jam-r' });
});

app.get(/room\/([^\-]+\-[^\-]+\-[^\-]+)$/, function(req, res) {
  var roomName = req.params[0];
  if (rooms.isAvailable(roomName)) {
    res.render('index', { title: 'Jam-r', roomName: roomName });
  } else {
    res.write('Room is unavailable. Sorry.');
    res.end();
  }
});
