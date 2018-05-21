const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const anonymousAuth = require('./middleware/anonymousAuth');

const indexRouter = require('./routes/index');
const todoRouter = require('./routes/todo');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const healthCheckRouter = require('./routes/healthcheck');
const apiRouter = require('./api/todo');

const app = express();

const db = require('./data');
const LocalStrategy = require('passport-local').Strategy;




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 's3cr3t',
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    // We really should be setting this!
    // secure: true,
  },
  name: 'id-workshop-session-cookie',
  resave: false,
  saveUninitialized: false
}));


// passport 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
  db.user(username, (err, user) => cb(err, user));
});



passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  },
  (username, password, cb) => {
    db.user(username, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      bcrypt.compare(password, user.hash, (err, match) => {
        cb(err, match ? user : false);
      });
    });
  }
));



// add anonymous user
app.use(anonymousAuth);

app.use('/', indexRouter);
app.use('/todo', todoRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/check', healthCheckRouter);
app.use('/api', apiRouter);
app.get('/logout', (req, res) => {
  
  req.logout();
  res.clearCookie('id-workshop-session-cookie');
  res.redirect('/login');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
