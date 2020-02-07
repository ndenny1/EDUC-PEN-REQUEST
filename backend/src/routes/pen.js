'use strict';

const passport = require('passport');
const express = require('express');
const axios = require('axios');
//const auth = require('../components/auth');
const config = require('../config/index');
const log = require('npmlog');
const lodash = require('lodash');
const HttpStatus = require('http-status-codes');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/request'
    ]
  });
});

router.get('/user', passport.authenticate('jwt', { session: false }), getUserInfo);

router.post('/request', passport.authenticate('jwt', { session: false }), postPenRequest);

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

router.get('/request/:id/comments', passport.authenticate('jwt', { session: false }), getComments); //todo: check the pen request id

router.post('/request/:id/comments', passport.authenticate('jwt', { session: false }), postComment); //todo: check the pen request id

function getSessionUser(req) {
  const sessID = req.sessionID;
  const thisSession = sessID && JSON.parse(req.sessionStore.sessions[sessID]);
  return thisSession && thisSession.passport.user;
}

async function getDigitalIdData(token, digitalID) {
  let [status, data] = await getData(token, config.get('digitalID:apiEndpoint') + `/${digitalID}`);
  if(status !== HttpStatus.OK) {
    data.errorSource = 'getDigitalIdData';
  }
  return [status, data];
}

async function getStudentPen(token, studentID) {
  let [status, data] = await getData(token, config.get('student:apiEndpoint') + `/${studentID}`);
  if(status !== HttpStatus.OK) {
    data.errorSource = 'getStudentPen';
    return [status, data];
  } else {
    const pen = studentData.pen;
    return [HttpStatus.OK, {pen}];
  }
}

async function getLatestPenRequest(token, digitalID) {
  let [status, data] = await getData(token, `${config.get('penRequest:apiEndpoint')}/?digitalID=${digitalID}`);
  if(status !== HttpStatus.OK && status !== HttpStatus.NOT_FOUND) {
    data.errorSource = 'getLatestPenRequest';
    return [status, data];
  } else {
    const penRequest = (status == HttpStatus.NOT_FOUND || data.length == 0) ? null : lodash.maxBy(data, 'statusUpdateDate');
    if(penRequest) {
      penRequest.digitalID = null;
    }

    return [HttpStatus.OK, {penRequest}];
  }
}

async function getUserInfo(req, res) {
  if (! req.user) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  const userInfo = getSessionUser(req);
  if(!userInfo) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    }); 
  }

  let resData = {
    displayName: userInfo._json.displayName, 
    accountType: userInfo._json.accountType,
  };

  const accessToken = userInfo.jwt;
  const digitalID = userInfo._json.digitalIdentityID;
  let [status, data] = await getDigitalIdData(accessToken, digitalID);
  if(status !== HttpStatus.OK) {
    return res.status(status).json(data);
  }

  if(data.studentID) {
    [status, data] = await getStudentPen(accessToken, data.studentID);
  } else {
    [status, data] = await getLatestPenRequest(accessToken, digitalID);
  }

  resData = Object.assign(resData, data);
  return res.status(status).json(resData);
}

async function postPenRequest(req, res) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      }); 
    }

    const accessToken = userInfo.jwt;
    const url = config.get('penRequest:apiEndpoint') + '/';

    let reqData = lodash.cloneDeep(req.body);
    reqData.digitalID = userInfo._json.digitalIdentityID;
    if(userInfo._json.accountType === 'BCEID'){
      reqData.dataSourceCode = 'DIRECT';
    } else {
      reqData.dataSourceCode = userInfo._json.accountType;
    }

    const [status, data] = await postData(accessToken, reqData, url);
    if(status !== HttpStatus.OK) {
      return res.status(status).json(data);
    }

    let resData = lodash.cloneDeep(data);
    resData.digitalID = null;
    
    return res.status(status).json(resData);
  } catch(e) {
    log.error('forwardPostReq Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Post error'
    });
  }
}

async function postComment(req, res) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      }); 
    }

    const accessToken = userInfo.jwt;
    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/comments`;
    const commment = {
      penRetrievalRequestID: req.params.id,
      staffMemberIDIRGUID: null,
      staffMemberName: null,
      commentContent: req.body.content,
      commentTimestamp: req.body.timestamp
    }

    const [status, data] = await postData(accessToken, commment, url);
    if(status !== HttpStatus.OK) {
      return res.status(status).json(data);
    }
    return res.status(status).json({penRetrievalReqCommentID: data.penRetrievalReqCommentID});
  } catch(e) {
    log.error('postComment Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Post comment error'
    });
  }
}

async function getComments(req, res) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      }); 
    }

    const accessToken = userInfo.jwt;
    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/comments`;

    const [status, apiResData] = await getData(accessToken, url);
    if(status !== HttpStatus.OK) {
      return res.status(status).json(apiResData);
    }

    let response = {
      participants: [],
      myself: {
        name: userInfo._json.displayName,
        id: '1'
      },
      messages: []
    };
    apiResData.sort((a,b) => (a.commentTimestamp > b.commentTimestamp) ? 1 : ((b.commentTimestamp > a.commentTimestamp) ? -1 : 0));

    apiResData.forEach(element => {
      const participant = {
        name: (element.staffMemberName ? element.staffMemberName : 'Student'),
        id: (element.staffMemberIDIRGUID ? element.staffMemberIDIRGUID : '1')
      };

      if (participant.id.toUpperCase() !== response.myself.id.toUpperCase()) {
        const index = response.participants.findIndex((e) => e.id === participant.id);

        if (index === -1) {
          response.participants.push(participant);
        }
      }
      let timestamp = new Date(element.commentTimestamp);

      response.messages.push({
        content: element.commentContent,
        participantId: (element.staffMemberIDIRGUID ? element.staffMemberIDIRGUID : '1'),
        myself: participant.id.toUpperCase() == response.myself.id.toUpperCase(),
        timestamp: {
          year: timestamp.getFullYear(),
          month: timestamp.getMonth() + 1,
          day: timestamp.getDate(),
          hour: timestamp.getHours(),
          minute: timestamp.getMinutes(),
          second: timestamp.getSeconds(),
          millisecond: timestamp.getMilliseconds()
        }
      });
    });

    return res.status(status).json(response);
  } catch (e) {
    log.error('forwardGetReq Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Get error'
    });
  }
}

async function forwardGetReq(req, res, url) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      }); 
    }

    const accessToken = userInfo.jwt;
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
    }

    log.info('get Data Url', url);
    const response = await axios.get(url, config);
    log.info('get Data Status', response.status);
    log.info('get Data StatusText', response.statusText);
    log.verbose('get Data Res', response.data);

    return [HttpStatus.OK, response.data];
  } catch (e) {
    log.error('getData Error', e.Error);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status, { message: 'API Get error'}];
  }
} 

async function forwardPostReq(req, res, url) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      }); 
    }

    const accessToken = userInfo.jwt;

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
    }

    log.info('post Data Url', url);
    log.verbose('post Data Req', data);
    
    const response = await axios.post(url, data, config);

    log.info('post Data Status', response.status);
    log.info('post Data StatusText', response.statusText);

    log.verbose('post Data Res', response.data);

    return [HttpStatus.OK, response.data];
  } catch(e) {
    log.error('postData Error', e.Error);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    return [status,{ message: 'API Get error'}];
  }
}

module.exports = router;
