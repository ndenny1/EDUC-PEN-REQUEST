'use strict';
const nconf = require('nconf');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const env = process.env.NODE_ENV;
// Setlocal environment to "local" to run locally (duh)
// $env:NODE_ENV="local"

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

//injects environment variables into the json file
nconf.overrides({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL + '/auth/realms/master/protocol/openid-connect/logout',
  siteMinder_logout_endpoint: process.env.SITEMINDER_LOGOUT_ENDPOINT,
  server: {
    logLevel: 'verbose',
    morganFormat: 'dev',
    port: 8080
  }
});



nconf.defaults({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL + '/auth/realms/master/protocol/openid-connect/logout',
  siteMinder_logout_endpoint: process.env.SITEMINDER_LOGOUT_ENDPOINT,
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
    clientId: process.env.PEN_REQUEST_CLIENT_ID,
    clientSecret: process.env.PEN_REQUEST_CLIENT_SECRET,
  },
  codeTable: {
    apiEndpoint: process.env.CODE_TABLE_ENDPOINT,
  },
  document: {
    apiEndpoint: process.env.DOCUMENT_API_ENDPOINT,
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY,
    audience: process.env.SERVER_FRONTEND,
    issuer: process.env.ISSUER
  },
  digitalID: {
    apiEndpoint: process.env.DIGITALID_API_ENDPOINT,
  },
  student: {
    apiEndpoint: process.env.STUDENT_API_ENDPOINT,
  },
  email: {
    apiEndpoint: process.env.PEN_REQUEST_EMAIL_API_ENDPOINT,
    secretKey: process.env.PEN_REQUEST_EMAIL_SECRET_KEY,
  },
});
console.log(nconf.get('logoutEndpoint'));
console.log(nconf.get('siteMinder_logout_endpoint'));
module.exports = nconf;
