const HttpStatus = require('http-status-codes');
const config = require('../../../src/config/index');

jest.mock('@js-joda/core');
const LocalDateTime = require('@js-joda/core').LocalDateTime;
jest.mock('../../../src/components/utils');
const utils = require('../../../src/components/utils');
jest.mock('../../../src/components/auth');

const pen = require('../../../src/components/pen');
const { mockRequest, mockResponse } = require('../helpers'); 

describe('postComment', () => {
  const localDateTime = '2020-01-01T12:00:00';
  const comment = {
    content: 'test comment'
  };
  const postRes = {
    commentContent: 'test comment',
    commentTimestamp: localDateTime,
  };
  const params = {
    id: 'penRequestId',
  };
  const session = {
    penRequest: {
      penRequestStatusCode: utils.PenRequestStatuses.RETURNED,
    }
  };

  let req;
  let res;

  jest.spyOn(LocalDateTime, 'now');
  jest.spyOn(utils, 'getAccessToken');
  const spy = jest.spyOn(utils, 'postData');

  beforeEach(() => {
    LocalDateTime.now.mockReturnValue(localDateTime);
    utils.getAccessToken.mockReturnValue('token');
    utils.postData.mockResolvedValue(postRes);
    req = mockRequest(comment, session, params);
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return response data', async () => {
    await pen.postComment(req, res);

    const commentRes = {
      content: postRes.commentContent,
      participantId: '1',
      myself: true,
      timestamp: postRes.commentTimestamp
    };

    const postReq =  {
      penRetrievalRequestID: params.id,
      staffMemberIDIRGUID: null,
      staffMemberName: null,
      commentContent: comment.content,
      commentTimestamp: localDateTime
    };

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(commentRes);
    expect(spy).toHaveBeenCalledWith('token', postReq, `${config.get('penRequest:apiEndpoint')}/${params.id}/comments`);
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getAccessToken.mockReturnValue(null);

    await pen.postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return CONFLICT if no penRequest in the session', async () => {
    const session = {
      penRequest: null,
    };
    req = mockRequest(comment, session, params);

    await pen.postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return CONFLICT if penRequest is not RETURNED', async () => {
    const session = {
      penRequestStatusCode: utils.PenRequestStatuses.INITREV,
    };
    req = mockRequest(comment, session, params);

    await pen.postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return INTERNAL_SERVER_ERROR if postData is failed', async () => {
    utils.postData.mockRejectedValue(new Error('test error'));

    await pen.postComment(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('getComments', () => {
  const getRes = [];

  const params = {
    id: 'penRequestId',
  };
  const sessionUser = {
    jwt: 'token',
    _json: {
      displayName: 'Firstname Lastname',
      accountType: 'BCEID',
    }
  };

  let req;
  let res;

  jest.spyOn(utils, 'getSessionUser');
  const spy = jest.spyOn(utils, 'getData');

  beforeEach(() => {
    utils.getSessionUser.mockReturnValue(sessionUser);
    utils.getData.mockResolvedValue(getRes);
    req = mockRequest(null, null, params);
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted comment data if multiple comments', async () => {
    const getRes = [
      {
        commentTimestamp: '2020-02-04T12:00:00',
        staffMemberName: 'Staff A',
        staffMemberIDIRGUID: 'Staff A GUID',
        commentContent: 'Staff comment 1',
      },
      {
        commentTimestamp: '2020-02-01T09:56:32',
        staffMemberName: 'Staff B',
        staffMemberIDIRGUID: 'Staff B GUID',
        commentContent: 'Staff comment 2',
      },
      {
        commentTimestamp: '2020-02-03T18:00:00',
        staffMemberName: null,
        staffMemberIDIRGUID: null,
        commentContent: 'Student comment 1',
      },
      {
        commentTimestamp: '2020-02-10T01:00:59',
        staffMemberName: null,
        staffMemberIDIRGUID: null,
        commentContent: 'Student comment 2',
      }
    ];
    utils.getData.mockResolvedValue(getRes);

    await pen.getComments(req, res);

    const commentsRes = {
      participants: [
        {
          name: 'Staff B',
          id: 'Staff B GUID'
        },
        {
          name: 'Staff A',
          id: 'Staff A GUID'
        },
      ],
      myself: {
        name: sessionUser._json.displayName,
        id: '1'
      },
      messages: [
        {
          content: 'Staff comment 2',
          participantId: 'Staff B GUID',
          myself: false,
          timestamp: '2020-02-01T09:56:32'
        },
        {
          content: 'Student comment 1',
          participantId: '1',
          myself: true,
          timestamp: '2020-02-03T18:00:00'
        },
        {
          content: 'Staff comment 1',
          participantId: 'Staff A GUID',
          myself: false,
          timestamp: '2020-02-04T12:00:00'
        },
        {
          content: 'Student comment 2',
          participantId: '1',
          myself: true,
          timestamp: '2020-02-10T01:00:59'
        },
      ]
    };

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(commentsRes);
    expect(spy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${params.id}/comments`);
  });

  it('should return empty array of messages when no comment', async () => {
    await pen.getComments(req, res);

    const commentsRes = {
      participants: [],
      myself: {
        name: sessionUser._json.displayName,
        id: '1'
      },
      messages: []
    };

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(commentsRes);
    expect(spy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${params.id}/comments`);
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getSessionUser.mockReturnValue(null);

    await pen.getComments(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return INTERNAL_SERVER_ERROR if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('test error'));

    await pen.getComments(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
