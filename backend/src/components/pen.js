'use strict';

const { getSessionUser, getAccessToken, deleteData, getData, postData, putData, PenRequestStatuses, VerificationResults, EmailVerificationStatuses } = require('./utils');
const { getPenRequestApiCredentials } = require('./auth');
const config = require('../config/index');
const log = require('npmlog');
const lodash = require('lodash');
const HttpStatus = require('http-status-codes');
const jsonwebtoken = require('jsonwebtoken');
const localDateTime = require('@js-joda/core').LocalDateTime;
const { ServiceError, ConflictStateError } = require('./error'); 

let codes = null;

function getPenRequest(req, res, next) {
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
  try {
    return await getData(token, config.get('digitalID:apiEndpoint') + `/${digitalID}`);
  } catch (e) {
    throw new ServiceError('getDigitalIdData error', e);
  }
}

async function getStudent(token, studentID, sexCodes) {
  try {
    let student = await getData(token, config.get('student:apiEndpoint') + `/${studentID}`);
    const sexInfo = lodash.find(sexCodes, ['sexCode', student.sexCode]);
    if(!sexInfo) {
      throw new ServiceError(`Wrong sexCode: ${student.sexCode}`);
    }
    student.sexLabel = sexInfo.label;
    return student;
  } catch (e) {
    throw new ServiceError('getStudent error', e);
  }
}

async function getLatestPenRequest(token, digitalID) {
  let penRequest = null;
  try {
    let data = await getData(token, `${config.get('penRequest:apiEndpoint')}/?digitalID=${digitalID}`);
    penRequest = lodash.maxBy(data, 'statusUpdateDate') || null;
    if(penRequest) {
      penRequest.digitalID = null;
    }
  } catch(e) {
    if(!e.status || e.status !== HttpStatus.NOT_FOUND) {
      throw new ServiceError('getLatestPenRequest error', e);
    }
  }

  return penRequest;
}

function getDefaultBcscInput(userInfo) {
  let givenArray = (userInfo._json.givenNames).split(' ');
  givenArray.shift();
  let middleNames = givenArray.join(' ');
  return {
    legalLastName: userInfo._json.surname,
    legalFirstName: userInfo._json.givenName,
    legalMiddleNames: middleNames,
    gender: userInfo._json.gender,
    email: userInfo._json.email,
    dob: userInfo._json.birthDate
  };
}

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if(!userInfo) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  
  const accessToken = userInfo.jwt;
  const digitalID = userInfo._json.digitalIdentityID;

  Promise.all([
    getDigitalIdData(accessToken, digitalID), 
    getServerSideCodes(accessToken), 
    getLatestPenRequest(accessToken, digitalID)
  ]).then(async ([digitalIdData, codes, penRequest]) => {
  
    const identityType = lodash.find(codes.identityTypes, ['identityTypeCode', digitalIdData.identityTypeCode]);
    if(! identityType) {
      log.error('getIdentityType Error identityTypeCode', digitalIdData.identityTypeCode);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Wrong identityTypeCode'
      });
    }

    let student = null;
    if(digitalIdData.studentID) {
      student = await getStudent(accessToken, digitalIdData.studentID, codes.sexCodes);
    }

    req.session.digitalIdentityData = digitalIdData;
    req.session.digitalIdentityData.identityTypeLabel = identityType.label;
    req.session.penRequest = penRequest;

    let resData = {
      displayName: userInfo._json.displayName,
      accountType: userInfo._json.accountType,
      identityTypeLabel: identityType.label,
      ...(userInfo._json.accountType === 'BCSC' ? getDefaultBcscInput(userInfo) : {}),
      penRequest,
      student,
    };

    return res.status(HttpStatus.OK).json(resData);
  }).catch(e => {
    log.error('getUserInfo Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get userInfo error',
      errorSource: e.errorSource
    });
  });
}

async function getCodes(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    const codeUrls = [
      `${config.get('penRequest:apiEndpoint')}/gender-codes`, 
      `${config.get('penRequest:apiEndpoint')}/statuses`,
    ];

    const [genderCodes, statusCodes] = await Promise.all(codeUrls.map(url => getData(accessToken, url)));
    return res.status(HttpStatus.OK).json({genderCodes, statusCodes});
  } catch (e) {
    log.error('getCodes Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get codes error'
    });
  }
}

async function getServerSideCodes(accessToken) {
  if(!codes) {
    try{
      const codeUrls = [
        `${config.get('student:apiEndpoint')}/sex-codes`,
        `${config.get('digitalID:apiEndpoint')}/identityTypeCodes`
      ];

      const [sexCodes, identityTypes] = await Promise.all(codeUrls.map(url => getData(accessToken, url)));
      codes = {sexCodes, identityTypes};
    } catch(e) {
      throw new ServiceError('getServerSideCodes error', e);
    }
  }
  return codes;
}

async function sendVerificationEmail(accessToken, emailAddress, penRequestId, identityTypeLabel) {
  const reqData = {
    emailAddress,
    penRequestId,
    identityTypeLabel
  };
  const url = config.get('email:apiEndpoint') + '/verify';
  try {
    return await postData(accessToken, reqData, url);
  } catch (e) {
    throw new ServiceError('sendVerificationEmail error', e);
  }
}

async function postPenRequest(accessToken, req, userInfo) {
  try{
    const url = config.get('penRequest:apiEndpoint') + '/';

    let reqData = lodash.cloneDeep(req);
    reqData.emailVerified = EmailVerificationStatuses.NOT_VERIFIED;
    reqData.digitalID = userInfo._json.digitalIdentityID;
    let resData = await postData(accessToken, reqData, url);
    resData.digitalID = null;

    return resData;
  } catch(e) {
    throw new ServiceError('postPenRequest error', e);
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

    if(req.session.penRequest && req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.REJECTED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Submit PEN Request not allowed'
      });
    }

    const resData = await postPenRequest(accessToken, req.body, userInfo);

    req.session.penRequest = resData;
    sendVerificationEmail(accessToken, req.body.email, resData.penRequestID, req.session.digitalIdentityData.identityTypeLabel).catch(e => 
      log.error('sendVerificationEmail Error', e.stack)
    );

    return res.status(HttpStatus.OK).json(resData);
  } catch(e) {
    log.error('submitPenRequest Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Submit pen request error',
      errorSource: e.errorSource
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
    const comment = {
      penRetrievalRequestID: req.params.id,
      staffMemberIDIRGUID: null,
      staffMemberName: null,
      commentContent: req.body.content,
      commentTimestamp: localDateTime.now().toString()
    };

    const data = await postData(accessToken, comment, url);

    const message = {
      content: data.commentContent,
      participantId: '1',
      myself: true,
      timestamp: data.commentTimestamp
    };
    return res.status(HttpStatus.OK).json(message);
  } catch(e) {
    log.error('postComment Error', e.stack);
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

    const apiResData = await getData(accessToken, url);

    //console.log(apiResData);
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
      // if(element.commentTimestamp.length>23){
      //   element.commentTimestamp = element.commentTimestamp.substring(0,23);
      // }

      // const retrievedTimestamp = localDateTime.parse(element.commentTimestamp);
      // let minute =  retrievedTimestamp.minute();
      // if(retrievedTimestamp.minute() < 10){
      //   minute = '0' + retrievedTimestamp.minute();
      // }
      response.messages.push({
        content: element.commentContent,
        participantId: (element.staffMemberIDIRGUID ? element.staffMemberIDIRGUID : '1'),
        myself: participant.id.toUpperCase() === response.myself.id.toUpperCase(),
        timestamp: element.commentTimestamp
        // timestamp: {
        //   year: retrievedTimestamp.year(),
        //   month: retrievedTimestamp.month().name(),// this will show month name as ex:- DECEMBER not value 12.
        //   day: retrievedTimestamp.dayOfMonth(),
        //   hour: retrievedTimestamp.hour(),
        //   minute: minute,
        //   second: retrievedTimestamp.second(),
        //   millisecond: retrievedTimestamp.nano(),
        //   dayOfWeek: retrievedTimestamp.dayOfWeek()
        // }
      });
    });

    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error('getComments Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Comments Get error'
    });
  }
}

function beforeUpdatePenRequestAsInitrev(penRequest) {
  if(penRequest.penRequestStatusCode !== PenRequestStatuses.DRAFT) {
    throw new ConflictStateError('Current PEN Request Status: ' + penRequest.penRequestStatusCode);
  }

  if(penRequest.emailVerified !== EmailVerificationStatuses.NOT_VERIFIED) {
    throw new ConflictStateError('Current Email Verification Status: ' + penRequest.emailVerified);
  }
  
  penRequest.initialSubmitDate = localDateTime.now().toString();
  penRequest.emailVerified = EmailVerificationStatuses.VERIFIED;

  return penRequest;
}

async function setPenRequestAsInitrev(penRequestID) {
  let data = await getPenRequestApiCredentials();
  const accessToken = data.accessToken;

  return await updatePenRequestStatus(accessToken, penRequestID, PenRequestStatuses.INITREV, beforeUpdatePenRequestAsInitrev);
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
    log.error('verifyEmailToken Err', e.stack);
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

    const data = await setPenRequestAsInitrev(penRequestID);
    req.session.penRequest = data;

    return res.redirect(loggedin ? baseUrl : (verificationUrl + VerificationResults.OK));
  }catch(e){
    if(e instanceof ConflictStateError) {
      return res.redirect(loggedin ? baseUrl : (verificationUrl + VerificationResults.OK));
    } else {
      log.error('verifyEmail Error', e.stack);
      return res.redirect(verificationUrl + VerificationResults.SERVER_ERROR);
    }
  }
}

async function updatePenRequestStatus(accessToken, penRequestID, penRequestStatus, beforeUpdate) {
  try {
    let data = await getData(accessToken, `${config.get('penRequest:apiEndpoint')}/${penRequestID}`);

    let penRequest = beforeUpdate(data);
    penRequest.penRequestStatusCode = penRequestStatus;
    penRequest.statusUpdateDate = localDateTime.now().toString();

    data = await putData(accessToken, penRequest, config.get('penRequest:apiEndpoint'));
    data.digitalID = null;

    return data;
  } catch (e) {
    if(e instanceof ConflictStateError) {
      throw e;
    } else {
      throw new ServiceError('updatePenRequestStatus error', e);
    }
  }
}

function beforeUpdatePenRequestAsSubsrev(penRequest) {
  if(penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
    throw new ConflictStateError('Current PEN Request Status: ' + penRequest.penRequestStatusCode);
  }

  return penRequest;
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

    let data = await updatePenRequestStatus(accessToken, penRequestID, penRequestStatus, beforeUpdatePenRequestAsSubsrev);
    req.session.penRequest = data;

    return res.status(HttpStatus.OK).json(data);
  } catch(e) {
    log.error('setPenRequestAsSubsrev Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Set pen request as subsrev error',
      errorSource: e.errorSource
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

    const data = await sendVerificationEmail(accessToken, req.session.penRequest.email, req.session.penRequest.penRequestID, 
      req.session.digitalIdentityData.identityTypeLabel);

    return res.status(HttpStatus.OK).json(data);
  } catch(e) {
    log.error('resendVerificationEmail Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Resend verification email error',
      errorSource: e.errorSource
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

    const data = await postData(accessToken, req.body, url);
    return res.status(HttpStatus.OK).json(data);
  } catch(e) {
    log.error('uploadFile Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Upload file error'
    });
  }
}

async function getDocument(token, penRequestID, documentID, includeDocData = 'Y') {
  try {
    return await getData(token, `${config.get('penRequest:apiEndpoint')}/${penRequestID}/documents/${documentID}?includeDocData=${includeDocData}`);  
  } catch (e) {
    throw new ServiceError('getDocument error', e);
  }
}

async function deleteDocument(req, res) {
  try{
    const accessToken = getAccessToken(req);
    if(!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    let resData = await getDocument(accessToken, req.params.id, req.params.documentId, 'N');

    if(resData.createDate <= req.session.penRequest.statusUpdateDate || 
      req.session.penRequest.penRequestStatusCode !== PenRequestStatuses.RETURNED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Delete file not allowed'
      });
    }

    const url = `${config.get('penRequest:apiEndpoint')}/${req.params.id}/documents/${req.params.documentId}`;

    await deleteData(accessToken, url);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error('deleteDocument Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Delete document error',
      errorSource: e.errorSource
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

    let resData = await getDocument(accessToken, req.params.id, req.params.documentId, 'Y');

    res.setHeader('Content-disposition', 'attachment; filename=' + resData.fileName);
    res.setHeader('Content-type', resData.fileExtension);

    return res.status(HttpStatus.OK).send(Buffer.from(resData.documentData, 'base64'));
  } catch (e) {
    log.error('downloadFile Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Download file error',
      errorSource: e.errorSource
    });
  }
}

module.exports = {
  getUserInfo,
  getCodes,
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
