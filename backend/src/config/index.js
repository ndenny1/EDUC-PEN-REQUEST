'use strict';
const nconf = require('nconf');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const env = process.env.NODE_ENV;

//injects environment variables into the json file
nconf.overrides({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL + '/auth/realms/master/protocol/openid-connect/logout',
  server: {
    logLevel: 'verbose',
    morganFormat: 'dev',
    port: 8080
  }
});


nconf.argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

nconf.defaults({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL + '/auth/realms/master/protocol/openid-connect/logout',
  server: {
    frontend: process.env.SERVER_FRONTEND,
    logLevel: 'verbose',
    morganFormat: 'dev',
    port: 8080
  },
  oidc: {
    publicKey: process.env.SOAM_PUBLIC_KEY,
    clientId: process.env.SOAM_CLIENT_ID,
    clientSecret: process.env.SOAM_CLIENT_SECRET,
    discovery: process.env.SOAM_DISCOVERY
  },
  penRequest: {
    apiEndpoint: process.env.PEN_REQUEST_API_ENDPOINT,
  },
  codeTable: {
    genderEndpoint: process.env.CODE_TABLE_GENDER_ENDPOINT + '/gender'
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY,
    audience: process.env.SERVER_FRONTEND,
    issuer: process.env.ISSUER
  }
});

module.exports = nconf;
