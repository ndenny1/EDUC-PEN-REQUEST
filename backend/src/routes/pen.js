'use strict';

const passport = require('passport');
const express = require('express');
const { getUserInfo, getCodes, submitPenRequest, getComments, postComment, verifyEmail, setPenRequestAsSubsrev, resendVerificationEmail, getPenRequest, deleteDocument, downloadFile, uploadFile } = require('../components/pen');
const { forwardGetReq } = require('../components/utils');
const config = require('../config/index');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.get('/user', passport.authenticate('jwt', { session: false }), getUserInfo);

router.post('/request', passport.authenticate('jwt', { session: false }), submitPenRequest);

router.get('/codes', passport.authenticate('jwt', { session: false }), getCodes);

// router.get('/request/:id', passport.authenticate('jwt', { session: false }),
//   (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + `/${req.params.id}`)   //todo: check the pen request id
// );

router.get('/document-type-codes', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + '/document-types')
);

router.get('/file-requirements', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + '/file-requirements')
);

router.post('/request/:id/documents', passport.authenticate('jwt', { session: false }), [getPenRequest, uploadFile]);

router.get('/request/:id/documents', passport.authenticate('jwt', { session: false }), getPenRequest, 
  (req, res) => forwardGetReq(req, res, `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents`)
);

router.get('/request/:id/documents/:documentId', passport.authenticate('jwt', { session: false }), getPenRequest,
  (req, res) => forwardGetReq(req, res, `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents/${req.params.documentId}`)
);

router.get('/request/:id/documents/:documentId/download/:fileName', [getPenRequest, downloadFile]);

router.delete('/request/:id/documents/:documentId', passport.authenticate('jwt', { session: false }), [getPenRequest, deleteDocument]);

router.get('/request/:id/comments', passport.authenticate('jwt', { session: false }), [getPenRequest, getComments]);

router.post('/request/:id/comments', passport.authenticate('jwt', { session: false }), [getPenRequest, postComment]);

router.post('/request/:id/verification-email', passport.authenticate('jwt', { session: false }), [getPenRequest, resendVerificationEmail]);

router.patch('/request/:id', passport.authenticate('jwt', { session: false }), [getPenRequest, setPenRequestAsSubsrev]);

router.get('/verification', verifyEmail);

module.exports = router;
