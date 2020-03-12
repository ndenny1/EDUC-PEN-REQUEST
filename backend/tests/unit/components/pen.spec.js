//const axios = require('axios');
const HttpStatus = require('http-status-codes');
const config = require('../../../src/config/index');
const log = require('npmlog');
//const MockAdapter = require('axios-mock-adapter');
//const jsonwebtoken = require('jsonwebtoken');

jest.mock('../../../src/components/utils');
const utils = require('../../../src/components/utils');
const pen = require('../../../src/components/pen');
const { ServiceError, ApiError } = require('../../../src/components/error'); 
// const {verifyEmailToken} = require('../../../src/components/pen');

log.level = config.get('server:logLevel');
//const mockAxios = new MockAdapter(axios);

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
        givenNames: 'Name1 Name2 Name3',
      } 
    };

    const result = pen.__get__('getDefaultBcscInput')(userInfo);

    expect(result).toBeTruthy();
    expect(result.legalMiddleNames).toEqual('Name2 Name3');
  });
});
