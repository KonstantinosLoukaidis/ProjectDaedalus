var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var exphbs = require('express-handlebars');
var flash = require('express-flash');

const Network_Planner = require('./models/network_planner');
const Airlines = require('./models/airlines');
const Airports = require('./models/airports');
const GateDispatcher = require('./models/gateDispatcher');
const Gates = require('./models/gates');
const Airplanes = require('./models/airplanes');
const Flight = require('./models/flight');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const network_planningRouter = require('./routes/network_planningRouter');
const gate_managementRouter = require('./routes/gate_managementRouter');
const flight_applicationRouter = require('./routes/flight_applicationRouter');
const adminHelloRouter = require('./routes/adminHelloRouter');
const flight_tableRouter = require('./routes/flight_tableRouter');
const analyticsRouter = require('./routes/analyticsRouter');

const connect = mongoose.connect(config.mongoUrl);
connect.then((db) => {
    console.log('Connected currently to server');
}, (err) => { console.log('An error has occured'); });

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.secretKey));

app.use(session({
    name: 'session-id',
    secret: config.secretKey,
    saveUninitialized: false,
    resave: true,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/network_planning', network_planningRouter);
// app.use('/flight_table', flight_tableRouter);

function auth(req, res, next) {
    if (!req.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
    } else {
        next();
    }
}

app.use(auth);

app.use('/admin-logged', adminHelloRouter);
app.use('/admin-logged/gate_management', gate_managementRouter);
app.use('/admin-logged/flight_applications', flight_applicationRouter);
app.use('/admin-logged/flight_table', flight_tableRouter);
app.use('/admin-logged/analytics', analyticsRouter);

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