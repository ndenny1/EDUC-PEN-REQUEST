'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('npmlog');
const HttpStatus = require('http-status-codes');
const lodash = require('lodash');

let discovery = null;

function minify(obj, keys=['documentData']) {
  return lodash.transform(obj, (result, value, key) => 
    result[key] = keys.includes(key) && lodash.isString(value) ? value.substring(0,1) + ' ...' : value );
}

function getSessionUser(req) {
  log.verbose('getSessionUser', req.session);
  const session = req.session;
  return session && session.passport && session.passport.user;
}

function getAccessToken(req) {
  const user = getSessionUser(req);
  return user && user.jwt;
}

async function deleteData(token, url) {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    log.info('delete Data Url', url);
    const response = await axios.delete(url, config);
    log.info('delete Data Status', response.status);
    log.info('delete Data StatusText', response.statusText);
    log.verbose('delete Data Res', response.data);

    return [HttpStatus.OK, response.data];
  } catch (e) {
    log.error('deleteData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status, { message: 'API Delete error'}];
  }
}

async function forwardGetReq(req, res, url) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    const [status, data] = await getData(accessToken, url);
    return res.status(status).json(data);
  } catch (e) {
    log.error('forwardGetReq Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Get error'
    });
  }
}

async function getData(token, url) {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    log.info('get Data Url', url);
    const response = await axios.get(url, config);
    log.info('get Data Status', response.status);
    log.info('get Data StatusText', response.statusText);
    log.verbose('get Data Res', minify(response.data));

    return [HttpStatus.OK, response.data];
  } catch (e) {
    log.error('getData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status, { message: 'API Get error'}];
  }
}

async function forwardPostReq(req, res, url) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      });
    }

    const [status, data] = await postData(accessToken, req.body, url);
    return res.status(status).json(data);
  } catch(e) {
    log.error('forwardPostReq Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Post error'
    });
  }
}

async function postData(token, data, url) {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    log.info('post Data Url', url);
    log.verbose('post Data Req', minify(data));

    const response = await axios.post(url, data, config);

    log.info('post Data Status', response.status);
    log.info('post Data StatusText', response.statusText);

    log.verbose('post Data Res', response.data);

    return [HttpStatus.OK, response.data];
  } catch(e) {
    log.error('postData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status,{ message: 'API Post error'}];
  }
}

async function putData(token, data, url) {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    log.info('put Data Url', url);
    log.verbose('put Data Req', data);

    const response = await axios.put(url, data, config);

    log.info('put Data Status', response.status);
    log.info('put Data StatusText', response.statusText);

    log.verbose('put Data Res', response.data);

    return [HttpStatus.OK, response.data];
  } catch(e) {
    log.error('putData Error',  e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status,{ message: 'API Put error'}];
  }
}

const PenRequestStatuses = Object.freeze({
  DRAFT: 'DRAFT',
  INITREV: 'INITREV',
  RETURNED: 'RETURNED',
  SUBSREV: 'SUBSREV',
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
  REJECTED: 'REJECTED',
  UNMATCHED: 'UNMATCHED'
});

const EmailVerificationStatuses = Object.freeze({
  VERIFIED: 'Y',
  NOT_VERIFIED: 'N'
});

const VerificationResults = Object.freeze({
  TOKEN_ERROR: 'token-error',
  SERVER_ERROR: 'server-error',
  EXPIRED: 'expired',
  OK: 'ok'
});

const utils = {
  // Returns OIDC Discovery values
  async getOidcDiscovery() {
    if (!discovery) {
      try {
        const response = await axios.get(config.get('oidc:discovery'));
        discovery = response.data;
      } catch (error) {
        log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
      }
    }
    return discovery;
  },

  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),
  getSessionUser,
  getAccessToken,
  deleteData,
  forwardGetReq,
  getData,
  forwardPostReq,
  postData,
  putData,
  PenRequestStatuses,
  VerificationResults,
  EmailVerificationStatuses
};

module.exports = utils;
