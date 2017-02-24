var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var count = 0;
var counter = 0;

io.on('connection', function(socket){

  // user has connected
  socket.on('user in', function(nick, anim, stat){
    socket.nick = nick;
    io.sockets.emit('user in', socket.nick, ++count, ++counter, anim, stat);
  });

  //user's message to send
  socket.on('chat message', function(nick, msg){
    socket.broadcast.emit('chat message', socket.nick, msg, ++counter);
  });

  //notice when user is typing
  socket.on('typing', function(nick){
  	io.sockets.emit('user typing', `${nick} is typing...`);
  });

  //notice when user has disconnected
  socket.on('disconnect', function(){
    --count;
    io.sockets.emit('user out', socket.nick, count);
  });

});

const PORT = process.env.PORT || '2017';

http.listen(PORT, function() {
	const port = process.env.PORT || '2017';
	console.log(`Listening on port ${PORT}`);
});
