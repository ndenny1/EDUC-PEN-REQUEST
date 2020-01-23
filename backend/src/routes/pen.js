'use strict';

const passport = require('passport');
const express = require('express');
const axios = require('axios');
//const auth = require('../components/auth');
const config = require('../config/index');
const log = require('npmlog');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.post('/request', passport.authenticate('jwt', { session: false }),
  (req, res) => postData(req, res, config.get('penRequest:apiEndpoint') + '/', req.body)
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
  (req, res) => postData(req, res, config.get('document:apiEndpoint') + '/', req.body)
);

async function getData(req, res, url) {
  try{
    var sessID = req.sessionID;

    var thisSession = JSON.parse(req.sessionStore.sessions[sessID]);
    var userToken = thisSession.passport.user.jwt;

    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;  //? 
    const response = await axios.get(url);
    if(response.status !== 200){
      return res.status(response.status).json({
        message: 'API Get error'
      });
    }
    return res.status(200).json(response.data);
  } catch (e) {
    return res.status(500).json(e);
  }
} 

async function postData(req, res, url, data) {
  try{
    var sessID = req.sessionID;

    // eslint-disable-next-line no-console
    //console.log(req.sessionStore.sessions[sessID]);
    var thisSession = JSON.parse(req.sessionStore.sessions[sessID]);
    var userToken = thisSession.passport.user.jwt;

    // eslint-disable-next-line no-console
    log.verbose('post Data',req.body);

    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    const response = await axios.post(url, data);
    if(response.status !== 200){
      return res.status(response.status).json({
        message: 'API Post error'
      });
    }
    log.verbose('post Data', response.data);
    return res.status(200).json(response.data);
  } catch(e) {
    return res.status(500).json(e);
  }
}

module.exports = router;
