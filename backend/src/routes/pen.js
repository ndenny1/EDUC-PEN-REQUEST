'use strict';

const passport = require('passport');
const express = require('express');
const axios = require('axios');
//const auth = require('../components/auth');
const config = require('../config/index');
const log = require('npmlog');
const lodash = require('lodash');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.post('/request', passport.authenticate('jwt', { session: false }),
  (req, res) => postData(req, res, config.get('penRequest:apiEndpoint') + '/', beforePenRequestPost, penRequestPostPosted)
);

router.get('/gender_codes', passport.authenticate('jwt', { session: false }),
  (req, res) => getData(req, res, config.get('codeTable:apiEndpoint') + '/gender')
);

router.get('/request/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => getData(req, res, config.get('penRequest:apiEndpoint') + `/${req.params.id}`)
);

router.get('/document_type_codes', passport.authenticate('jwt', { session: false }),
  (req, res) => getData(req, res, config.get('codeTable:apiEndpoint') + '/documentType')
);

router.get('/file_requirements', passport.authenticate('jwt', { session: false }),
  (req, res) => getData(req, res, config.get('document:apiEndpoint') + '/file-requirements')
);

router.post('/document', passport.authenticate('jwt', { session: false }),
  (req, res) => postData(req, res, config.get('document:apiEndpoint') + '/')
);

function getUserInfo(req) {
  const sessID = req.sessionID;
  const thisSession = JSON.parse(req.sessionStore.sessions[sessID]);
  return thisSession && thisSession.passport.user;
}

function beforePenRequestPost(data, userInfo) {
  let reqData = lodash.cloneDeep(data);
  reqData.digitalID = userInfo._json.digitalIdentityID;
  if(userInfo._json.accountType === 'BCEID'){
    reqData.dataSourceCode = 'DIRECT';
  } else {
    reqData.dataSourceCode = userInfo._json.accountType;
  }
  return reqData;
}

function penRequestPostPosted(data) {
  let resData = lodash.cloneDeep(data);
  resData.digitalID = null;
  return resData;
}

async function getData(req, res, url) {
  try{
    const userInfo = getUserInfo(req);
    if(!userInfo) {
      return res.status(500).json({
        message: 'No session data'
      }); 
    }

    const userToken = userInfo.jwt;
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    }

    log.info('get Data Url', url);
    const response = await axios.get(url, config);
    log.info('get Data Status', response.status);
    log.info('get Data StatusText', response.statusText);

    if(response.status !== 200){
      return res.status(response.status).json({
        message: 'API Get error'
      });
    }

    log.verbose('get Data Res', response.data);

    return res.status(200).json(response.data);
  } catch (e) {
    return res.status(500).json(e);
  }
} 

async function postData(req, res, url, beforePost, posted) {
  try{
    const userInfo = getUserInfo(req);
    if(!userInfo) {
      return res.status(500).json({
        message: 'No session data'
      }); 
    }

    const userToken = userInfo.jwt;
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      }
    }
    const data = beforePost ? beforePost(req.body, userInfo) : req.body;

    log.info('post Data Url', url);
    log.verbose('post Data Req', data);
    
    const response = await axios.post(url, data, config);

    log.info('post Data Status', response.status);
    log.info('post Data StatusText', response.statusText);

    if(response.status !== 200){
      return res.status(response.status).json({
        message: 'API Post error'
      });
    }

    log.verbose('post Data Res', response.data);

    const resData = posted ? posted(response.data) : response.data;
    return res.status(200).json(resData);
  } catch(e) {
    return res.status(500).json(e);
  }
}

module.exports = router;
