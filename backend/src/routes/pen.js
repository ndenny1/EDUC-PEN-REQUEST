'use strict';

const passport = require('passport');
const express = require('express');
const axios = require('axios');
//const auth = require('../components/auth');
const config = require('../config/index');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.post('/request', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try{
      var sessID = req.sessionID;

      // eslint-disable-next-line no-console
      //console.log(req.sessionStore.sessions[sessID]);
      var thisSession = JSON.parse(req.sessionStore.sessions[sessID]);
      var userToken = thisSession.passport.user.jwt;

      // eslint-disable-next-line no-console
      console.log(req.body);

      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      const response = await axios.post(config.get('penRequest:apiEndpoint') + '/', req.body);
      if(response.status !== 200){
        return res.status(response.status).json({
          message: 'API Post error'
        });
      }
      return res.status(200).json(res.body);
    } catch(e) {
      return res.status(500).json(e);
    }
  }
);

router.get('/gender_codes', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try{
      var sessID = req.sessionID;

      var thisSession = JSON.parse(req.sessionStore.sessions[sessID]);
      var userToken = thisSession.passport.user.jwt;

      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      const response = await axios.get(config.get('codeTable:apiEndpoint') + '/gender');
      if(response.status !== 200){
        return res.status(response.status).json({
          message: 'API Post error'
        });
      }
      return res.status(200).json(response.data);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
);

module.exports = router;
