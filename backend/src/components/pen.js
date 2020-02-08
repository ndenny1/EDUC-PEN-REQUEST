'use strict';

const { getSessionUser, getData, postData }= require('../components/utils');
const config = require('../config/index');
const log = require('npmlog');
const lodash = require('lodash');
const HttpStatus = require('http-status-codes');

let identityTypes = null;

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

async function getIdentityType(accessToken, identityTypeCode) {
  if(!identityTypes) {
    const url = `${config.get('digitalID:apiEndpoint')}/identityTypeCodes`;
    const [status, resData] = getData(accessToken, url);
    if(status !== HttpStatus.OK) {
      log.error('getIdentityTypeLabel Error Status', status);
      return null;
    }
    identityTypes = resData;
  }
  return lodash.find(identityTypes, ['identityTypeCode', identityTypeCode]);
}

async function sendVerificationEmail(accessToken, emailAddress, penRequestId, identityTypeCode) {
  const identityType = getIdentityType(identityTypeCode);
  if(! identityType) {
    log.error('getIdentityTypeLabel Error identityTypeCode', identityTypeCode);
    return;
  }

  const reqData = {
    emailAddress,
    penRequestId,
    identityTypeLabel: identityType.label
  };
  const url = config.get('email:apiEndpoint') + '/verify';

  const [status] = await postData(accessToken, reqData, url);
  if(status !== HttpStatus.OK) {
    log.error('sendVerificationEmail Error Status', status);
  }
}

async function postPenRequest(accessToken, req, userInfo) {
  try{
    const url = config.get('penRequest:apiEndpoint') + '/';

    let reqData = lodash.cloneDeep(req);
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

    const [status, resData] = await postPenRequest(accessToken, req.body, userInfo);
    if(status !== HttpStatus.OK) {
      return res.status(status).json(resData);
    }

    sendVerificationEmail(accessToken, req.body.email, resData.penRequestID, userInfo._json.accountType);

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

module.exports = {
  getUserInfo,
  submitPenRequest,
  postComment,
  getComments
};
