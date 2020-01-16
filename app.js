var createError = require('http-errors');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var stylus = require('stylus');
var exphbs = require('express-handlebars');
var cors  = require('cors');

var routes = require('./routes/index');
var indexRouter = require('./routes/index');

var app = express();

var settingsPort = require('./config/trasactionConfig')
const listeningPort = settingsPort.connetion.MIDDLE_RECEIVER_PORT;


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', routes);

// Set Port
var port = process.env.PORT || listeningPort;
app.set('port', port);

//set app to listen to port 3000
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


// var server = https.createServer(app);
// server.listen(port, function(){
//     console.log('Express server listening to port '+port);
// });

// // Secondary http app
// var httpApp = express();
// var httpRouter = express.Router();
// httpApp.use('*', httpRouter);
// httpRouter.get('*', function(req, res){
//     var host = req.get('Host');
//     // replace the port in the host
//     host = host.replace(/:\d+$/, ":"+app.get('port'));
//     // determine the redirect destination
//     var destination = ['https://', host, req.url].join('');
//     return res.redirect(destination);
// });
// var httpServer = http.createServer(httpApp);
// httpServer.listen(8080);

/*
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Set Port
app.set('port', (process.env.PORT || 3000));

//set app to listen to port 3000
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
*/