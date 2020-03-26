//const HttpStatus = require('http-status-codes');
// const lodash = require('lodash');
const config = require('../../../src/config/index');

jest.mock('@js-joda/core');
const LocalDateTime = require('@js-joda/core').LocalDateTime;
jest.mock('../../../src/components/utils');
const utils = require('../../../src/components/utils');
jest.mock('../../../src/components/auth');
const auth = require('../../../src/components/auth');

const pen = require('../../../src/components/pen');
const {  __RewireAPI__: rewirePen} =  require('../../../src/components/pen');
const { ConflictStateError } = require('../../../src/components/error');
const { mockRequest, mockResponse } = require('../helpers'); 

describe('beforeUpdatePenRequestAsInitrev', () => {
  const localDateTime = '2020-01-01T12:00:00';

  jest.spyOn(LocalDateTime, 'now');

  beforeEach(() => {
    LocalDateTime.now.mockReturnValue(localDateTime);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return penRequest with VERIFIED and initialSubmitDate', async () => {
    let penRequest = {
      penRequestStatusCode: utils.PenRequestStatuses.DRAFT,
      emailVerified: utils.EmailVerificationStatuses.NOT_VERIFIED
    };

    const result = await pen.__get__('beforeUpdatePenRequestAsInitrev')(penRequest);

    expect(result).toEqual({
      ...penRequest,
      initialSubmitDate: localDateTime,
      emailVerified: utils.EmailVerificationStatuses.VERIFIED
    });
  });

  it('should throw ConflictStateError if penRequest is not DRAFT', async () => {
    let penRequest = {
      penRequestStatusCode: utils.PenRequestStatuses.INITREV,
      emailVerified: utils.EmailVerificationStatuses.NOT_VERIFIED
    };

    expect(() => pen.__get__('beforeUpdatePenRequestAsInitrev')(penRequest)).toThrowError(ConflictStateError);
  });

  it('should throw ConflictStateError if penRequest is already VERIFIED', async () => {
    let penRequest = {
      penRequestStatusCode: utils.PenRequestStatuses.DRAFT,
      emailVerified: utils.EmailVerificationStatuses.VERIFIED
    };

    expect(() => pen.__get__('beforeUpdatePenRequestAsInitrev')(penRequest)).toThrowError(ConflictStateError);
  });

});

describe('setPenRequestAsInitrev', () => {
  const localDateTime = '2020-01-01T12:00:00';
  const penRequestID = 'penRequestID';
  let penRequest = {
    penRequestID,
    digitalID: 'digitalID',
    penRequestStatusCode: utils.PenRequestStatuses.DRAFT,
    emailVerified: utils.EmailVerificationStatuses.NOT_VERIFIED
  };

  const getDataSpy = jest.spyOn(utils, 'getData');
  const putDataSpy = jest.spyOn(utils, 'putData');
  const authSpy = jest.spyOn(auth, 'getPenRequestApiCredentials');

  jest.spyOn(LocalDateTime, 'now');

  beforeEach(() => {
    LocalDateTime.now.mockReturnValue(localDateTime);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return penrequest data', async () => {
    utils.getData.mockResolvedValue(penRequest);
    utils.putData.mockResolvedValue(penRequest);
    auth.getPenRequestApiCredentials.mockResolvedValue({accessToken: 'token'});

    const result = await pen.__get__('setPenRequestAsInitrev')(penRequestID);

    expect(result).toBeTruthy();
    expect(result.penRequestID).toEqual(penRequestID);
    expect(result.digitalID).toBeNull();
    expect(result.penRequestStatusCode).toEqual(utils.PenRequestStatuses.INITREV);
    expect(result.emailVerified).toEqual(utils.EmailVerificationStatuses.VERIFIED);
    expect(result.statusUpdateDate).toEqual(localDateTime);

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(getDataSpy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${penRequestID}`);
    expect(putDataSpy).toHaveBeenCalledWith('token', penRequest ,config.get('penRequest:apiEndpoint'));
  });

  it('should throw ConflictStateError if penRequest is not DRAFT', async () => {
    let penRequest = {
      penRequestID,
      digitalID: 'digitalID',
      penRequestStatusCode: utils.PenRequestStatuses.INITREV,
      emailVerified: utils.EmailVerificationStatuses.NOT_VERIFIED
    };
    utils.getData.mockResolvedValue(penRequest);
    auth.getPenRequestApiCredentials.mockResolvedValue({accessToken: 'token'});

    expect(pen.__get__('setPenRequestAsInitrev')(penRequestID)).rejects.toThrowError(ConflictStateError);
  });
});

describe('verifyEmailToken', () => {
  it('should return penRequestID if valid token', async () => {
    const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiU0NPUEUiOiJWRVJJRllfRU1BSUwiLCJpYXQiOjE1MTYyMzkwMjJ9.3Qlu82ltNX0DJKwWedrT5MX2Nk9hn8cKbd6PpktTVAl_RTH42lkaolhdOFwlrC5g1kJh9rt-QmF8ABDqlpWpHA';

    expect(pen.verifyEmailToken(token)).toEqual([null, '1234567890']);
  });

  it('should return error if invalid token', async () => {
    const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiU0NPUEUiOiJWRVJJRllfRU1BSUwiLCJpYXQiOjE1MTYyMzkwMjJ9.3Qlu82ltNX0DJKwWedrT5MX2Nk9hn8cKbd6PpktTVAl_RTH42lkaolhdOFwlrC5g1kJh9rt-QmF8ABDqlpWpKA';

    const result = pen.verifyEmailToken(token);
    expect(result[0]).toBeTruthy();
    expect(result[1]).toBeNull();
  });

  it('should return error if wrong token SCOPE', async () => {
    const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.N5s4iL02C9W14Jsue2wNn76nelQMBcev-kNfZbvrkrsfEwJxe6l-U4M9xVqKW-bPkSMxXCpVZ0hrC6aL3njyuQ';

    const result = pen.verifyEmailToken(token);
    expect(result[0]).toBeTruthy();
    expect(result[0].name).toEqual('JsonWebTokenError');
    expect(result[1]).toBeNull();
  });

  it('should return error if no penRequestID', async () => {
    const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJTQ09QRSI6IlZFUklGWV9FTUFJTCIsImlhdCI6MTUxNjIzOTAyMn0.flzoPiee7N6bHuq424_8a5wmyqd5qIY1tXEP4Ouv0ueA6E-7hPJonKlK4K_az3tKPRMlGNsfbd6C3MeK4VRg6g';

    const result = pen.verifyEmailToken(token);
    expect(result[0]).toBeTruthy();
    expect(result[0].name).toEqual('JsonWebTokenError');
    expect(result[1]).toBeNull();
  });
});

describe('verifyEmail', () => {
  const penRequest = {
    penRequestID: 'penRequestID'
  };
  const query = {
    verificationToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiU0NPUEUiOiJWRVJJRllfRU1BSUwiLCJpYXQiOjE1MTYyMzkwMjJ9.3Qlu82ltNX0DJKwWedrT5MX2Nk9hn8cKbd6PpktTVAl_RTH42lkaolhdOFwlrC5g1kJh9rt-QmF8ABDqlpWpHA',
  };
  jest.spyOn(utils, 'getSessionUser');
  const setPenRequestAsInitrevSpy = jest.fn();

  let req;
  let res;

  beforeEach(() => {
    utils.getSessionUser.mockReturnValue({});
    req = mockRequest(null, undefined, undefined, query);
    res = mockResponse();
    setPenRequestAsInitrevSpy.mockResolvedValue(penRequest);
    rewirePen.__Rewire__('setPenRequestAsInitrev', setPenRequestAsInitrevSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    rewirePen.__ResetDependency__('setPenRequestAsInitrev');
  });

  it('should redirect to home url if the user logged in', async () => {
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(config.get('server:frontend'));
    expect(req.session.penRequest).toEqual(penRequest);
    expect(setPenRequestAsInitrevSpy).toHaveBeenCalledWith('1234567890');
  });

  it('should redirect to verification OK url if the user not logged in', async () => {
    utils.getSessionUser.mockReturnValue();
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.OK}`);
    expect(req.session.penRequest).toBeFalsy();
    expect(setPenRequestAsInitrevSpy).toHaveBeenCalledWith('1234567890');
  });

  it('should redirect to TOKEN_ERROR url if no verificationToken', async () => {
    req = mockRequest();
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.TOKEN_ERROR}`);
  });

  it('should redirect to home url if verificationToken expired and the user logged in', async () => {
    const query = {
      verificationToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiU0NPUEUiOiJWRVJJRllfRU1BSUwiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyM30.0w1CC5hsYGa_CTrNcccR2fx-xPxq-_mXrFZmhJcMj7Lcra8TmKGPKZkwsFVcXBXA11cnRQDZtrrbC18sWVx-Uw',
    };
    req = mockRequest(null, undefined, undefined, query);
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(config.get('server:frontend'));
  });

  it('should redirect to EXPIRED url if verificationToken expired and the user not logged in', async () => {
    const query = {
      verificationToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiU0NPUEUiOiJWRVJJRllfRU1BSUwiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyM30.0w1CC5hsYGa_CTrNcccR2fx-xPxq-_mXrFZmhJcMj7Lcra8TmKGPKZkwsFVcXBXA11cnRQDZtrrbC18sWVx-Uw',
    };
    req = mockRequest(null, undefined, undefined, query);
    utils.getSessionUser.mockReturnValue();
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.EXPIRED}`);
  });

  it('should redirect to TOKEN_ERROR url if wrong token SCOPE', async () => {
    const query = {
      verificationToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.N5s4iL02C9W14Jsue2wNn76nelQMBcev-kNfZbvrkrsfEwJxe6l-U4M9xVqKW-bPkSMxXCpVZ0hrC6aL3njyuQ',
    };
    req = mockRequest(null, undefined, undefined, query);
    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.TOKEN_ERROR}`);
  });

  it('should redirect to home url if ConflictStateError thrown and the user logged in', async () => {
    setPenRequestAsInitrevSpy.mockRejectedValue(new ConflictStateError('test error'));
    rewirePen.__Rewire__('setPenRequestAsInitrev', setPenRequestAsInitrevSpy);

    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(config.get('server:frontend'));
    expect(setPenRequestAsInitrevSpy).toHaveBeenCalledWith('1234567890');
  });

  it('should redirect to verification OK url if ConflictStateError thrown and the user not logged in', async () => {
    setPenRequestAsInitrevSpy.mockRejectedValue(new ConflictStateError('test error'));
    rewirePen.__Rewire__('setPenRequestAsInitrev', setPenRequestAsInitrevSpy);
    utils.getSessionUser.mockReturnValue();

    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.OK}`);
    expect(setPenRequestAsInitrevSpy).toHaveBeenCalledWith('1234567890');
  });

  it('should redirect to SERVER_ERROR url if other Errors thrown', async () => {
    setPenRequestAsInitrevSpy.mockRejectedValue(new Error('test error'));
    rewirePen.__Rewire__('setPenRequestAsInitrev', setPenRequestAsInitrevSpy);

    await pen.verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${config.get('server:frontend')}/verification/${utils.VerificationResults.SERVER_ERROR}`);
    expect(setPenRequestAsInitrevSpy).toHaveBeenCalledWith('1234567890');
  });
});
