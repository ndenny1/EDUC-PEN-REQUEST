'use strict';

const config =require('../config/index');
const passport = require('passport');
const express = require('express');
const auth = require('../components/auth');
const {
  body,
  validationResult
} = require('express-validator');
const router = express.Router();


router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/callback',
      '/login',
      '/logout',
      '/refresh',
      '/token'
    ]
  });
});

//provides a callback location for the auth service
router.get('/callback',
  passport.authenticate('oidc', {
    failureRedirect: 'error'
  }),
  (_req, res) => {
    res.redirect(config.get('server:frontend'));
  }
);

//a prettier way to handle errors
router.get('/error', (_req, res) => {
  res.status(401).json({
    message: 'Error: Unable to authenticate'
  });
});

//redirects to the SSO login screen
router.get('/login', passport.authenticate('oidc', {
  failureRedirect: 'error'
}));

//removes tokens and destroys session
router.get('/logout', async (req, res) => {
  if(req.user.jwt){
    const token = req.user.jwt;
    req.logout();
    req.session.destroy();
    res.redirect(config.get('logoutEndpoint') + '?id_token_hint=' + token + '&post_logout_redirect_uri=' + config.get('server:frontend'));
  } else {
    const refresh = await auth.renew(req.user.refreshToken);
    if(req.user){
      req.logout();
      req.session.destroy();
      res.redirect(config.get('logoutEndpoint') + '?id_token_hint=' + refresh.jwt + '&post_logout_redirect_uri=' + config.get('server:frontend'));
    } else{
      req.logout();
      req.session.destroy();
      res.redirect(config.get('server:frontend'));
    }
  }
});

const UnauthorizedRsp = {
  error: 'Unauthorized',
  error_description: 'Not logged in'
};

//refreshes jwt on refresh if refreshToken is valid
router.post('/refresh', [
  body('refreshToken').exists()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  if(!req.user || !req.user.refreshToken){
    res.status(401).json(UnauthorizedRsp);
  } else{
    await auth.renew(req.user.refreshToken);  //need to update req.user?
    if(req.user){
      var newUiToken = auth.generateUiToken();
      const responseJson = {
        jwtFrontend: newUiToken
      };
      res.status(200).json(responseJson);
    } else {
      res.status(401).json(UnauthorizedRsp);
    }
  }
});

//provides a jwt to authenticated users
router.use('/token', auth.refreshJWT, (req, res) => {
  if (req.user && req.user.jwtFrontend && req.user.refreshToken) {
    const responseJson = {
      jwtFrontend: req.user.jwtFrontend
    };
    res.status(200).json(responseJson);
  } else {
    res.status(401).json(UnauthorizedRsp);
  }
});

module.exports = router;
