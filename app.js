var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var owner = require('./routes/owner');
var admin = require('./routes/admin');
var appointments = require('./routes/appointment');
var auth = require('./auth');
var authenticate = require('./routes/login');
var machanic = require('./routes/machanic');
var mongoose = require('mongoose');
var debug = require('debug')('MMMProjectVerion1');


mongoose.connect('mongodb://localhost/test');
var UserModel = mongoose.model('User', {
    sign_up_email: String,
    sign_up_gender: String,
    sign_up_age: Number,
    sign_up_first_name: String,
    sign_up_last_name: String,
    sign_up_password: String,
    sign_up_birthday_day: Number,
    sign_up_birthday_month: Number,
    sign_up_birthday_year: Number,
    current_vehicle: {
        year: Number,
        brand: String,
        model: String,
        mileage: String,
        color: String
    }
});
var AppointmentModel = mongoose.model('Appointment', {
    sign_up_email: String,
    time: String,
    sign_up_first_name: String,
    sign_up_last_name: String,
    status: String
});

var ODB2CodeModel = mongoose.model('ODB2CODE', {
   orginal: String,
   Description: String,
   code: String
});

var ReportModel = mongoose.model('Report', {
   sign_up_email: String,
   htmlcontent: String,
   time: String,
   reporturl: String
});
var app = express();

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'tmp')));
auth(app, passport, UserModel);
users(app, UserModel);
appointments(app, AppointmentModel, io);
authenticate(app, passport, AppointmentModel, ReportModel);
machanic(app, ODB2CodeModel,AppointmentModel, ReportModel);
admin(app, AppointmentModel);
app.use('/', routes);
app.use('/owner', owner);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
