const HttpStatus = require('http-status-codes');
const lodash = require('lodash');
const config = require('../../../src/config/index');

jest.mock('../../../src/components/utils');
const utils = require('../../../src/components/utils');
const pen = require('../../../src/components/pen');
const {  __RewireAPI__: rewirePen} =  require('../../../src/components/pen');
const { ServiceError, ApiError } = require('../../../src/components/error'); 
const { mockRequest, mockResponse } = require('../helpers'); 

describe('getDigitalIdData', () => {
  const digitalIdData = { data: 'data' };

  const spy = jest.spyOn(utils, 'getData');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return DigitalId data', async () => {
    utils.getData.mockResolvedValue(digitalIdData);

    const result = await pen.__get__('getDigitalIdData')('token', 'digitalID');

    expect(result).toBeTruthy();
    expect(result.data).toEqual(digitalIdData.data);
    //expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('token', config.get('digitalID:apiEndpoint') + '/digitalID');
  });

  it('should throw ServiceError if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('error'));

    expect(pen.__get__('getDigitalIdData')('token', 'digitalID')).rejects.toThrowError(ServiceError);
  });
});

describe('getStudent', () => {
  const studentData = { data: 'data', sexCode: 'M' };
  const sexCodes = [
    {
      sexCode: 'M',
      label: 'Male',
    },
    {
      sexCode: 'F',
      label: 'Female',
    }
  ];

  const spy = jest.spyOn(utils, 'getData');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return Student data with sexLabel', async () => {
    utils.getData.mockResolvedValue(studentData);

    const result = await pen.__get__('getStudent')('token', 'studentID', sexCodes);

    expect(result).toBeTruthy();
    expect(result.data).toEqual(studentData.data);
    expect(result.sexCode).toEqual(studentData.sexCode);
    expect(result.sexLabel).toEqual('Male');
    expect(spy).toHaveBeenCalledWith('token', config.get('student:apiEndpoint') + '/studentID');
  });

  it('should throw ServiceError if no sexCode label', async () => {
    studentData.sexCode = 'NotExist';
    utils.getData.mockResolvedValue(studentData);

    expect(pen.__get__('getStudent')('token', 'studentID', sexCodes)).rejects.toThrowError(ServiceError);
  });

  it('should throw ServiceError if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('error'));

    expect(pen.__get__('getStudent')('token', 'studentID', sexCodes)).rejects.toThrowError(ServiceError);
  });
});

describe('getLatestPenRequest', () => {
  const digitalID = 'ac337def-704b-169f-8170-653e2f7c001';
  const penRequests = [
    { 
      digitalID,
      statusUpdateDate: '2020-03-03T23:05:40' 
    },
    { 
      digitalID,
      statusUpdateDate: '2020-03-05T07:05:59' 
    },
    { 
      digitalID, 
      statusUpdateDate: '2020-03-04T10:05:40' 
    },
  ];

  const spy = jest.spyOn(utils, 'getData');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return the last pen request', async () => {
    utils.getData.mockResolvedValue(penRequests);

    const result = await pen.__get__('getLatestPenRequest')('token', digitalID);

    expect(result).toBeTruthy();
    expect(result.statusUpdateDate).toEqual('2020-03-05T07:05:59');
    expect(result.digitalID).toBeNull();
    expect(spy).toHaveBeenCalledWith('token', config.get('penRequest:apiEndpoint') + `/?digitalID=${digitalID}`);
  });

  it('should return null if no pen requests', async () => {
    utils.getData.mockResolvedValue([]);

    const result = await pen.__get__('getLatestPenRequest')('token', digitalID);

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith('token', config.get('penRequest:apiEndpoint') + `/?digitalID=${digitalID}`);
  });

  it('should return null if getData return NOT_FOUND', async () => {
    utils.getData.mockRejectedValue(new ApiError(HttpStatus.NOT_FOUND, { message: 'API Get error' }));

    const result = await pen.__get__('getLatestPenRequest')('token', digitalID);

    expect(result).toBeNull();
  });

  it('should throw ServiceError if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('error'));

    expect(pen.__get__('getLatestPenRequest')('token', digitalID)).rejects.toThrowError(ServiceError);
  });
});

describe('getDefaultBcscInput', () => {
  it('should return middleNames', async () => {
    const userInfo = { 
      _json: {
        givenNames: 'FirstName MiddleName',
      } 
    };

    const result = pen.__get__('getDefaultBcscInput')(userInfo);

    expect(result).toBeTruthy();
    expect(result.legalMiddleNames).toEqual('MiddleName');
  });

  it('should return empty string if no middle name', async () => {
    const userInfo = { 
      _json: {
        givenNames: 'FirstName',
      } 
    };

    const result = pen.__get__('getDefaultBcscInput')(userInfo);

    expect(result).toBeTruthy();
    expect(result.legalMiddleNames.length).toBe(0);
  });

  it('should return empty string if no given names', async () => {
    const userInfo = { 
      _json: {
        givenNames: '',
      } 
    };

    const result = pen.__get__('getDefaultBcscInput')(userInfo);

    expect(result).toBeTruthy();
    expect(result.legalMiddleNames.length).toBe(0);
  });
});

describe('getServerSideCodes', () => {
  const codes =[
    {
      code: 'M',
      label: 'Male',
    },
    {
      code: 'F',
      label: 'Female',
    }
  ];

  const spy = jest.spyOn(utils, 'getData');

  afterEach(() => {
    spy.mockClear();
    pen.__set__('codes', null);
  });

  it('should return codes', async () => {
    utils.getData.mockResolvedValue(codes);

    const result = await pen.__get__('getServerSideCodes')('token');

    expect(result).toBeTruthy();
    expect(result.sexCodes).toEqual(codes);
    expect(result.identityTypes).toEqual(codes);
    expect(pen.__get__('codes').sexCodes).toEqual(codes);
    expect(pen.__get__('codes').identityTypes).toEqual(codes);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('token', `${config.get('student:apiEndpoint')}/sex-codes`);
    expect(spy).toHaveBeenCalledWith('token', `${config.get('digitalID:apiEndpoint')}/identityTypeCodes`);
  });

  it('should not call getData if codes exist', async () => {
    pen.__set__('codes', {
      sexCodes: codes,
      identityTypes: codes
    });

    const result = await pen.__get__('getServerSideCodes')('token');

    expect(result).toBeTruthy();
    expect(result.sexCodes).toEqual(codes);
    expect(result.identityTypes).toEqual(codes);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should throw ServiceError if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('error'));

    expect(pen.__get__('getServerSideCodes')('token')).rejects.toThrowError(ServiceError);
  });
});

describe('getUserInfo', () => {
  const digitalID = 'ac337def-704b-169f-8170-653e2f7c001';
  const penRequest = { 
    digitalID,
    statusUpdateDate: '2020-03-03T23:05:40' 
  };

  const sessionUser = {
    jwt: 'token',
    _json: {
      digitalIdentityID: digitalID,
      displayName: 'Firstname Lastname',
      accountType: 'BCEID',
    }
  };

  const digitalIdData = {
    identityTypeCode: 'BASIC',
    studentID: null
  };

  const codes = {
    sexCodes: [
      {
        sexCode: 'M',
        label: 'Male',
      },
      {
        sexCode: 'F',
        label: 'Female',
      }
    ],
    identityTypes: [
      {
        identityTypeCode: 'BCSC',
        label: 'BC Services Card',
      },
      {
        identityTypeCode: 'BASIC',
        label: 'Basic BCeID',
      }
    ]
  };

  let req;
  let res;

  jest.spyOn(utils, 'getSessionUser');

  beforeEach(() => {
    utils.getSessionUser.mockReturnValue(sessionUser);
    req = mockRequest();
    res = mockResponse();
    rewirePen.__Rewire__('getDigitalIdData', () => Promise.resolve(digitalIdData));
    rewirePen.__Rewire__('getServerSideCodes', () => Promise.resolve(codes));
    rewirePen.__Rewire__('getLatestPenRequest', () => Promise.resolve(penRequest));
  });

  afterEach(() => {
    jest.clearAllMocks();
    rewirePen.__ResetDependency__('getDigitalIdData');
    rewirePen.__ResetDependency__('getServerSideCodes');
    rewirePen.__ResetDependency__('getLatestPenRequest');
    rewirePen.__ResetDependency__('getStudent');
    rewirePen.__ResetDependency__('getDefaultBcscInput');
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getSessionUser.mockReturnValue(null);

    await pen.getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return user info without student info if no student info', async () => {
    await pen.getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      displayName: sessionUser._json.displayName,
      accountType: sessionUser._json.accountType,
      identityTypeLabel: lodash.find(codes.identityTypes, ['identityTypeCode', digitalIdData.identityTypeCode]).label,
      penRequest,
      student: null,
    });
  });

  it('should return user info with student info if there is student info', async () => {
    const studentID = 'ac337def-704b-169f-8170-653e2f7c090';
    const digitalIdData = {
      identityTypeCode: 'BASIC',
      studentID
    };

    const student = {
      pen: '123456',
      studentID
    };

    rewirePen.__Rewire__('getDigitalIdData', () => Promise.resolve(digitalIdData));
    rewirePen.__Rewire__('getStudent', () => Promise.resolve(student));

    await pen.getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      displayName: sessionUser._json.displayName,
      accountType: sessionUser._json.accountType,
      identityTypeLabel: lodash.find(codes.identityTypes, ['identityTypeCode', digitalIdData.identityTypeCode]).label,
      penRequest,
      student,
    });
  });

  it('should return user info with BCSC info if accountType is BCSC', async () => {
    const bcscUser = {
      jwt: 'token',
      _json: {
        digitalIdentityID: digitalID,
        displayName: 'Firstname Lastname',
        accountType: 'BCSC',
      }
    };

    const bcscInfo = { legalLastName: 'LegalName' };

    utils.getSessionUser.mockReturnValue(bcscUser);
    rewirePen.__Rewire__('getDefaultBcscInput', () => bcscInfo);

    await pen.getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      displayName: bcscUser._json.displayName,
      accountType: bcscUser._json.accountType,
      ...bcscInfo,
      identityTypeLabel: lodash.find(codes.identityTypes, ['identityTypeCode', digitalIdData.identityTypeCode]).label,
      penRequest,
      student: null,
    });
  });

  it('should return INTERNAL_SERVER_ERROR if invalid identityTypeCode', async () => {
    const digitalIdData = {
      identityTypeCode: 'INVALID',
      studentID: null
    };

    rewirePen.__Rewire__('getDigitalIdData', () => Promise.resolve(digitalIdData));

    await pen.getUserInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should return INTERNAL_SERVER_ERROR if exceptions thrown', async () => {
    rewirePen.__Rewire__('getDigitalIdData', () => Promise.reject(new ServiceError('error')));

    await pen.getUserInfo(req, res);
    
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('getCodes', () => {
  const codes =[
    {
      code: 'Code1',
      label: 'Label1',
      displayOrder: 2
    },
    {
      code: 'Code3',
      label: 'Label3',
      displayOrder: 3
    },
    {
      code: 'Code2',
      label: 'Label2',
      displayOrder: 1
    }
  ];

  let req;
  let res;

  jest.spyOn(utils, 'getAccessToken');
  jest.spyOn(utils, 'getData');

  beforeEach(() => {
    utils.getAccessToken.mockReturnValue('token');
    utils.getData.mockResolvedValue(codes);
    req = mockRequest();
    res = mockResponse();
  });

  const spy = jest.spyOn(utils, 'getData');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return codes', async () => {
    const response = await pen.getCodes(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      genderCodes: codes,
      statusCodes: codes,
    });
    expect(response.data.json.genderCodes[0].displayOrder).toBe(1);
  });

  it('should return UNAUTHORIZED if no access token', async () => {
    utils.getAccessToken.mockReturnValue(null);

    await pen.getCodes(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return INTERNAL_SERVER_ERROR if exceptions thrown', async () => {
    utils.getData.mockRejectedValue(new Error('test error'));

    await pen.getCodes(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
