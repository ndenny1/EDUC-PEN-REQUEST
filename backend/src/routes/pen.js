'use strict';

const passport = require('passport');
const express = require('express');
const axios = require('axios');
const auth = require('../components/auth');
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
    const newJwt = auth.renew(req.user.refreshToken).jwt;
    axios.defaults.headers.common['Authorization'] = `Bearer ${newJwt}`;

    const response = axios.post(config.get('penRequest:apiEndpoint'), req.body);
    if(response.status !== 200){
      return res.status(response.status).json({
        message: 'API Post error'
      });
    }
    return res.status(200).json(res.body);
  }
);

module.exports = router;
