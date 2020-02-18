'use strict';

const passport = require('passport');
const express = require('express');
const { getUserInfo, submitPenRequest, getComments, postComment, verifyEmail, setPenRequestAsSubsrev, resendVerificationEmail, getPenRequest, deleteDocument, downloadFile } = require('../components/pen');
const { forwardGetReq, forwardPostReq } = require('../components/utils');
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

router.get('/gender_codes', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('codeTable:apiEndpoint') + '/gender-codes')
);

router.get('/request/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + `/${req.params.id}`)
);

router.get('/document_type_codes', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + '/document-types')
);

router.get('/file_requirements', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, config.get('penRequest:apiEndpoint') + '/file-requirements')
);

router.post('/request/:id/documents', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardPostReq(req, res, `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents`)
);

router.get('/request/:id/documents', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents`)   //todo: check the pen request id
);

router.get('/request/:id/documents/:documentId', passport.authenticate('jwt', { session: false }),
  (req, res) => forwardGetReq(req, res, `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents/${req.params.documentId}`)   //todo: check the pen request id
);

router.get('/request/:id/documents/:documentId/download/:fileName', [getPenRequest, downloadFile]);

router.delete('/request/:id/documents/:documentId', passport.authenticate('jwt', { session: false }), [getPenRequest, deleteDocument]);

router.get('/request/:id/comments', passport.authenticate('jwt', { session: false }), getComments); //todo: check the pen request id

router.post('/request/:id/comments', passport.authenticate('jwt', { session: false }), postComment); //todo: check the pen request id

router.post('/request/:id/verification-email', passport.authenticate('jwt', { session: false }), [getPenRequest, resendVerificationEmail]); //todo: check the pen request id

router.patch('/request/:id', passport.authenticate('jwt', { session: false }), setPenRequestAsSubsrev);

router.get('/verification', verifyEmail);

module.exports = router;
