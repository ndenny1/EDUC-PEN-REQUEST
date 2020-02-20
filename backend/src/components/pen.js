'use strict';

const { getSessionUser, getAccessToken, deleteData, getData, postData, putData, PenRequestStatuses, VerificationResults, EmailVerificationStatuses } = require('./utils');
const { getPenRequestApiCredentials } = require('./auth');
const config = require('../config/index');
const log = require('npmlog');
const lodash = require('lodash');
const HttpStatus = require('http-status-codes');
const jsonwebtoken = require('jsonwebtoken');

let identityTypes = null;


async function getPenRequest(req, res, next) {
  const userInfo = getSessionUser(req);
  if(!userInfo) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  const penRequestID = req.params.id;
  if(!req.session.penRequest || req.session.penRequest.penRequestID !== penRequestID) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Wrong penRequestID'
    });
  }

  next();
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
    const pen = data.pen;
    return [HttpStatus.OK, {pen}];
  }
}

async function getLatestPenRequest(token, digitalID) {
  let [status, data] = await getData(token, `${config.get('penRequest:apiEndpoint')}/?digitalID=${digitalID}`);
  if(status !== HttpStatus.OK && status !== HttpStatus.NOT_FOUND) {
    data.errorSource = 'getLatestPenRequest';
    return [status, data];
  } else {
    let penRequest = (status == HttpStatus.NOT_FOUND || data.length == 0) ? null : lodash.maxBy(data, 'statusUpdateDate');
    if(penRequest) {
      penRequest.digitalID = null;
    }

    return [HttpStatus.OK, {penRequest}];
  }
}

async function getUserInfo(req, res) {
  if (! req.user) {
    log.verbose('getUserInfo', req.user);
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
  
  let resData;

  if(userInfo._json.accountType === 'BCSC'){
    let givenArray = (userInfo._json.givenNames).split(" ");
    givenArray.shift();
    let middleNames = givenArray.join(" ");
    resData = {
      displayName: userInfo._json.displayName,
      accountType: userInfo._json.accountType,
      legalLastName: userInfo._json.surname,
      legalFirstName: userInfo._json.givenName,
      legalMiddleNames: middleNames,
      gender: userInfo._json.gender,
      email: userInfo._json.email,
      dob: userInfo._json.birthDate
    };
  } else{
    resData = {
      displayName: userInfo._json.displayName,
      accountType: userInfo._json.accountType,
    };
  }

  const accessToken = userInfo.jwt;
  const digitalID = userInfo._json.digitalIdentityID;
  let [status, data] = await getDigitalIdData(accessToken, digitalID);
  if(status !== HttpStatus.OK) {
    return res.status(status).json(data);
  }

  req.session.digitalIdentityData = data;

  const identityType = await getIdentityType(accessToken, data.identityTypeCode);
  if(! identityType) {
    log.error('getIdentityType Error identityTypeCode', identityTypeCode);
    return [HttpStatus.INTERNAL_SERVER_ERROR, {
      message: 'Wrong identityTypeCode'
    }];
  }

  req.session.digitalIdentityData.identityTypeLabel = identityType.label;
  resData.identityTypeLabel = identityType.label;

  if(data.studentID) {
    [status, data] = await getStudentPen(accessToken, data.studentID);
  } else {
    [status, data] = await getLatestPenRequest(accessToken, digitalID);
    if(status === HttpStatus.OK) {
      req.session.penRequest = data.penRequest;
    }
  }

  resData = Object.assign(resData, data);
  return res.status(status).json(resData);
}

async function getIdentityType(accessToken, identityTypeCode) {
  if(!identityTypes) {
    const url = `${config.get('digitalID:apiEndpoint')}/identityTypeCodes`;
    const [status, resData] = await getData(accessToken, url);
    if(status !== HttpStatus.OK) {
      log.error('getIdentityType Error Status', status);
      return null;
    }
    identityTypes = resData;
  }
  return lodash.find(identityTypes, ['identityTypeCode', identityTypeCode]);
}

async function sendVerificationEmail(accessToken, emailAddress, penRequestId, identityTypeLabel) {
  const reqData = {
    emailAddress,
    penRequestId,
    identityTypeLabel
  };
  const url = config.get('email:apiEndpoint') + '/verify';

  const [status] = await postData(accessToken, reqData, url);
  if(status !== HttpStatus.OK) {
    log.error('sendVerificationEmail Error Status', status);
  }

  return [status,  {
    message: 'Ok'
  }]
}

async function postPenRequest(accessToken, req, userInfo) {
  try{
    const url = config.get('penRequest:apiEndpoint') + '/';

    let reqData = lodash.cloneDeep(req);
    reqData.emailVerified = EmailVerificationStatuses.NOT_VERIFIED;
    reqData.digitalID = userInfo._json.digitalIdentityID;
    if(userInfo._json.accountType === 'BCEID'){
      reqData.dataSourceCode = 'DIRECT';
    } else {
      reqData.dataSourceCode = userInfo._json.accountType;
    }

    let [status, resData] = await postData(accessToken, reqData, url);
    if(status === HttpStatus.OK) {
      resData.digitalID = null;
    }

    return [status, resData];
  } catch(e) {
    log.error('postPenRequest Error', e);
    return [HttpStatus.INTERNAL_SERVER_ERROR, {
      message: 'Post pen request error'
    }];
  }
}

async function submitPenRequest(req, res) {
  try{
    const userInfo = getSessionUser(req);
    if(!userInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      });
    }

    const accessToken = userInfo.jwt;

    if(req.session.penRequest && (req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.REJECTED || 
      req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.UNMATCHED)) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Submit PEN Request not allowed'
      });
    }

    const [status, resData] = await postPenRequest(accessToken, req.body, userInfo);
    if(status !== HttpStatus.OK) {
      return res.status(status).json(resData);
    }

    req.session.penRequest = resData;
    sendVerificationEmail(accessToken, req.body.email, resData.penRequestID, req.session.digitalIdentityData.identityTypeLabel);

    return res.status(status).json(resData);
  } catch(e) {
    log.error('submitPenRequest Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Submit pen request error'
    });
  }
}

async function postComment(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    if(req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Post comment not allowed'
      });
    }

    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/comments`;
    const commment = {
      penRetrievalRequestID: req.params.id,
      staffMemberIDIRGUID: null,
      staffMemberName: null,
      commentContent: req.body.content,
      commentTimestamp: req.body.timestamp
    };

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

function beforeUpdatePenRequestAsInitrev(penRequest) {
  if(penRequest.penRequestStatusCode !== PenRequestStatuses.DRAFT) {
    return [HttpStatus.CONFLICT, { message: 'Current PEN Request Status: ' + penRequest.penRequestStatusCode}];
  }

  if(penRequest.emailVerified !== EmailVerificationStatuses.NOT_VERIFIED) {
    return [HttpStatus.CONFLICT, { message: 'Current Email Verification Status: ' + penRequest.emailVerified}];
  }
  
  penRequest.initialSubmitDate = new Date().toISOString();
  penRequest.emailVerified = EmailVerificationStatuses.VERIFIED;

  return [HttpStatus.OK, penRequest];
}

async function setPenRequestAsInitrev(penRequestID) {
  let [status, data] = await getPenRequestApiCredentials();
  if(status !== HttpStatus.OK) {
    data.errorSource = 'getPenRequestApiCredentials';
    log.error('setPenRequestAsInitrev Error', data);
    return [status, data];
  }
  const accessToken = data.accessToken;

  [status, data] = await updatePenRequestStatus(accessToken, penRequestID, PenRequestStatuses.INITREV, beforeUpdatePenRequestAsInitrev);
  if(status !== HttpStatus.OK) {
    log.error('setPenRequestAsInitrev Error', data);
    return [status, data];
  }

  return [HttpStatus.OK, data];
}

function verifyEmailToken(token) {
  try{
    const tokenPayload = jsonwebtoken.verify(token, config.get('email:secretKey'));
    if(tokenPayload.SCOPE !== 'VERIFY_EMAIL') {
      log.error('verifyEmailToken Error', `Invalid SCOPE: ${tokenPayload.SCOPE}`);
      return [{name: 'JsonWebTokenError'}, null];
    }

    if(! tokenPayload.jti) {
      log.error('verifyEmailToken Error', 'Invalid PEN Request ID');
      return [{name: 'JsonWebTokenError'}, null];
    }

    return [null, tokenPayload.jti];
  }catch(e){
    log.error('verifyEmailToken Err', e);
    return [e, null];
  }
}

async function verifyEmail(req, res) {
  const loggedin = getSessionUser(req);
  const baseUrl = config.get('server:frontend');
  const verificationUrl = baseUrl + '/verification/';

  if(! req.query.verificationToken) {
    return res.redirect(verificationUrl + VerificationResults.TOKEN_ERROR);
  }

  try{
    const [error, penRequestID] = verifyEmailToken(req.query.verificationToken);
    if(error && error.name === 'TokenExpiredError') {
      return res.redirect(loggedin ? baseUrl : (verificationUrl + VerificationResults.EXPIRED));
    } else if (error) {
      return res.redirect(verificationUrl + VerificationResults.TOKEN_ERROR);
    }

    const [status] = await setPenRequestAsInitrev(penRequestID);
    if(status === HttpStatus.CONFLICT) {
      return res.redirect(loggedin ? baseUrl : (verificationUrl + VerificationResults.OK));
    } else if(status !== HttpStatus.OK) {
      return res.redirect(verificationUrl + VerificationResults.SERVER_ERROR);
    }

    return res.redirect(loggedin ? baseUrl : (verificationUrl + VerificationResults.OK));
  }catch(e){
    log.error('verifyEmail Error', e);
    return res.redirect(verificationUrl + VerificationResults.SERVER_ERROR);
  }
}

async function updatePenRequestStatus(accessToken, penRequestID, penRequestStatus, beforeUpdate) {
  let [status, data] = await getData(accessToken, `${config.get('penRequest:apiEndpoint')}/${penRequestID}`);
  if(status !== HttpStatus.OK) {
    data.errorSource = 'getPenRequest';
    log.error('updatePenRequestStatus Error', data);
    return [status, data];
  }

  [status, data] = beforeUpdate(data);
  if(status !== HttpStatus.OK) {
    data.errorSource = 'beforeUpdate';
    log.error('updatePenRequestStatus Error', data);
    return [status, data];
  }

  let penRequest = data;
  penRequest.penRequestStatusCode = penRequestStatus;
  penRequest.statusUpdateDate = new Date().toISOString();

  [status, data] = await putData(accessToken, penRequest, config.get('penRequest:apiEndpoint'));
  if(status !== HttpStatus.OK) {
    data.errorSource = 'updatePenRequest';
    log.error('updatePenRequestStatus Error', data);
    return [status, data];
  }

  data.digitalID = null;

  return [HttpStatus.OK, data];
}

function beforeUpdatePenRequestAsSubsrev(penRequest) {
  if(penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
    return [HttpStatus.CONFLICT, { message: 'Current PEN Request Status: ' + penRequest.penRequestStatusCode}];
  }

  return [HttpStatus.OK, penRequest];
}

async function setPenRequestAsSubsrev(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    const penRequestID = req.params.id;
    const penRequestStatus = req.body.penRequestStatusCode;

    if(! penRequestStatus) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No penRequestStatus data'
      });
    }

    if(penRequestStatus !== PenRequestStatuses.SUBSREV) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Wrong penRequestStatus'
      });
    }

    let [status, data] = await updatePenRequestStatus(accessToken, penRequestID, penRequestStatus, beforeUpdatePenRequestAsSubsrev);
    if(status !== HttpStatus.OK) {
      log.error('setPenRequestAsSubsrev Error', data);
    }
    req.session.penRequest = data.penRequest;

    return res.status(status).json(data);
  } catch(e) {
    log.error('setPenRequestAsSubsrev Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Set pen request as subsrev error'
    });
  }
}

async function resendVerificationEmail(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    if(req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.DRAFT) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Resend email not allowed'
      });
    }

    const [status, data] = await sendVerificationEmail(accessToken, req.session.penRequest.email, req.session.penRequest.penRequestID, 
      req.session.digitalIdentityData.identityTypeLabel);

    return res.status(status).json(data);
  } catch(e) {
    log.error('resendVerificationEmail Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Resend verification email error'
    });
  }
}

async function uploadFile(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    if(req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Upload file not allowed'
      });
    }

    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents`;

    const [status, data] = await postData(accessToken, req.body, url);
    return res.status(status).json(data);
  } catch(e) {
    log.error('postComment Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Post comment error'
    });
  }
}

async function getDocument(token, penRequestID, documentID, includeDocData = 'Y') {
  let [status, data] = await getData(token, `${config.get('penRequest:apiEndpoint')}/${penRequestID}/documents/${documentID}?includeDocData=${includeDocData}`);
  if(status !== HttpStatus.OK) {
    data.errorSource = 'getDocument'; 
  }
  return [status, data];
}

async function deleteDocument(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    let [status, resData] = await getDocument(accessToken, req.params.id, req.params.documentId, 'N');
    if(status !== HttpStatus.OK) {
      return res.status(status).json(resData);
    }

    if(resData.createDate <= req.session.penRequest.statusUpdateDate || 
      req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Delete file not allowed'
      });
    }

    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents/${req.params.documentId}`;

    [status] = await deleteData(accessToken, url);
    return res.status(status).json();
  } catch (e) {
    log.error('deleteDocument Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Delete document error'
    });
  }
}

async function downloadFile(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    let [status, resData] = await getDocument(accessToken, req.params.id, req.params.documentId, 'Y');
    if(status !== HttpStatus.OK) {
      return res.status(status).json(resData);
    }

    res.setHeader('Content-disposition', 'attachment; filename=' + resData.fileName);
    res.setHeader('Content-type', resData.fileExtension);

    return res.status(status).send(Buffer.from(resData.documentData, 'base64'));
  } catch (e) {
    log.error('deleteDocument Error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Delete document error'
    });
  }
}

module.exports = {
  getUserInfo,
  submitPenRequest,
  postComment,
  getComments,
  verifyEmail,
  verifyEmailToken,
  setPenRequestAsSubsrev,
  resendVerificationEmail,
  getPenRequest,
  deleteDocument,
  downloadFile,
  uploadFile
};
