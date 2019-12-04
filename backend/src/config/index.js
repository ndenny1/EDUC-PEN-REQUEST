'use strict';
const nconf = require('nconf');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const env = 'local';//process.env.NODE_ENV;

//injects environment variables into the json file
nconf.overrides({
  environment: env,
  logoutEndpoint: process.env.KC_DOMAIN + '/auth/realms/master/protocol/openid-connect/logout',
  server: {
    frontend: process.env.SERVER_FRONTEND,
    logLevel: 'verbose',
    morganFormat: 'dev',
    port: '8080'
  },
  oidc: {
    publicKey: process.env.PUBLIC_KEY,
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
    discovery: process.env.DISCOVERY
  },
  penRequest: {
    apiEndpoint: process.env.PEN_REQUEST_API,
    clientId: process.env.PEN_REQUEST_API_CLIENTID,
    clientSecret: process.env.PEN_REQUEST_API_SECRET
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY
  }
});


nconf.argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

nconf.defaults({

});

module.exports = nconf;
