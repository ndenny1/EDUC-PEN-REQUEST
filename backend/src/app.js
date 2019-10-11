'use strict';

const config = require('./config/index');
const dotenv = require('dotenv');
const log = require('npmlog');
const morgan = require('morgan');
const session = require('express-session');
const express = require('express');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');

dotenv.config();


const apiRouter = express.Router();

//initialize app
const app = express();

//sets security measures (headers, etc)
app.use(cors());
app.use(helmet());
app.use(helmet.noCache());

//tells the app to use json as means of transporting data
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

//initialize logging middleware
if(process.env.NODE_ENV !== 'test'){
  app.use(morgan(config.get('server:morganFormat')));
}

//app.use(keycloak.middleware());
//sets cookies for security purposes (prevent cookie access, allow secure connections only, etc)
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(session({
  secret: 'fakeSecret',
  resave: true,
  saveUninitialized: true,
  httpOnly: true,
  secure: true,
  expires: expiryDate
}));

//initialize routing and session. Cookies are now only reachable via requests (not js)
app.use(passport.initialize());
app.use(passport.session());

//configure logging
log.level = config.get('server:logLevel');
log.addLevel('debug', 1500, {
  fg: 'cyan'
});

//initialize our authentication strategy



// GetOK Base API Directory
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/api/auth',
      '/api/main'
    ],
    versions: [
      1
    ]
  });
});

//set up routing to auth and main API
app.use(/(\/getok)?(\/api)?/, apiRouter);

//Handle 500 error
app.use((err, _req, res, next) => {
  log.error(err.stack);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error: ' + err.stack.split('\n', 1)[0]
  });
  next();
});

// Handle 404 error
app.use((_req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page Not Found'
  });
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', err => {
  log.error(err.stack);
});

module.exports = app;
