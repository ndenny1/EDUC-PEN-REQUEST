'use strict';

const passport = require('passport');
const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.post('/request', passport.authenticate('jwt', {
  failureRedirect: 'error'
}),
async (req, res) => {
  return res.status(200).json(req);
});

module.exports = router;