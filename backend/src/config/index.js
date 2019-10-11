'use strict';
const path = require('path');
const nconf = require('nconf');
const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || 'development';

//injects environment variables into the json file
nconf.overrides({
  environment: env,
  oidc: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    publicKey: process.env.PUBLIC_KEY,
    discovery: ''
  },
  server: {
    frontend: process.env.FRONTEND,
    logLevel: 'silent',
    morganFormat: 'dev',
    port: 8080
  }
});

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

nconf.defaults({
});

module.exports = nconf;
