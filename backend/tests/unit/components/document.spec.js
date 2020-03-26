const HttpStatus = require('http-status-codes');
const config = require('../../../src/config/index');

// jest.mock('@js-joda/core');
// const LocalDateTime = require('@js-joda/core').LocalDateTime;
jest.mock('../../../src/components/utils');
const utils = require('../../../src/components/utils');
jest.mock('../../../src/components/auth');

const pen = require('../../../src/components/pen');
//const {  __RewireAPI__: rewirePen} =  require('../../../src/components/pen');
const { ServiceError } = require('../../../src/components/error');
const { mockRequest, mockResponse } = require('../helpers'); 

describe('uploadFile', () => {
  const document = {
    documentData: 'test data'
  };
  const postRes = {
    documentID: 'documentId',
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

  jest.spyOn(utils, 'getAccessToken');
  const spy = jest.spyOn(utils, 'postData');

  beforeEach(() => {
    utils.getAccessToken.mockReturnValue('token');
    utils.postData.mockResolvedValue(postRes);
    req = mockRequest(document, session, params);
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return response data', async () => {
    await pen.uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(postRes);
    expect(spy).toHaveBeenCalledWith('token', document, `${config.get('penRequest:apiEndpoint')}/${params.id}/documents`);
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getAccessToken.mockReturnValue(null);

    await pen.uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return CONFLICT if no penRequest in the session', async () => {
    const session = {
      penRequest: null,
    };
    req = mockRequest(document, session, params);

    await pen.uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return CONFLICT if penRequest is not RETURNED', async () => {
    const session = {
      penRequestStatusCode: utils.PenRequestStatuses.INITREV,
    };
    req = mockRequest(document, session, params);

    await pen.uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return INTERNAL_SERVER_ERROR if postData is failed', async () => {
    utils.postData.mockRejectedValue(new Error('test error'));

    await pen.uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('getDocument', () => {
  const documentData = { documentData: 'test data' };

  const spy = jest.spyOn(utils, 'getData');
  const penRequestID = 'penRequestID';
  const documentID = 'documentID';
  const includeDocData = 'Y';
  const token = 'token';

  afterEach(() => {
    spy.mockClear();
  });

  it('should return document data', async () => {
    utils.getData.mockResolvedValue(documentData);

    const result = await pen.__get__('getDocument')(token, penRequestID, documentID, includeDocData);

    expect(result).toEqual(documentData);
    expect(spy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${penRequestID}/documents/${documentID}?includeDocData=${includeDocData}`);
  });

  it('should throw ServiceError if getData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('error'));

    expect(pen.__get__('getDocument')(token, penRequestID, documentID, includeDocData)).rejects.toThrowError(ServiceError);
  });
});

describe('deleteDocument', () => {
  const document = {
    documentData: 'test data',
    createDate: '2020-03-02T12:13:14'
  };
  const params = {
    id: 'penRequestId',
    documentId: 'documentId'
  };
  const session = {
    penRequest: {
      penRequestStatusCode: utils.PenRequestStatuses.RETURNED,
      statusUpdateDate: '2020-03-01T12:13:16'
    }
  };

  let req;
  let res;

  jest.spyOn(utils, 'getAccessToken');
  const getDataSpy = jest.spyOn(utils, 'getData');
  const deleteDataSpy = jest.spyOn(utils, 'deleteData');

  beforeEach(() => {
    utils.getAccessToken.mockReturnValue('token');
    utils.getData.mockResolvedValue(document);
    req = mockRequest(null, session, params);
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK', async () => {
    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalled();
    expect(getDataSpy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${params.id}/documents/${params.documentId}?includeDocData=N`);
    expect(deleteDataSpy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${params.id}/documents/${params.documentId}`);
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getAccessToken.mockReturnValue(null);

    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return CONFLICT if no penRequest in the session', async () => {
    const session = {
      penRequest: null,
    };
    req = mockRequest(null, session, params);

    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return CONFLICT if penRequest is not RETURNED', async () => {
    const session = {
      penRequestStatusCode: utils.PenRequestStatuses.INITREV,
      statusUpdateDate: '2020-03-01T12:13:16'
    };
    req = mockRequest(null, session, params);

    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return CONFLICT if document was uploaded before pen request was returned ', async () => {
    const session = {
      penRequestStatusCode: utils.PenRequestStatuses.RETURNED,
      statusUpdateDate: '2020-03-03T12:13:16'
    };
    req = mockRequest(null, session, params);

    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return INTERNAL_SERVER_ERROR if deleteData is failed', async () => {
    utils.deleteData.mockRejectedValue(new Error('test error'));

    await pen.deleteDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('downloadFile', () => {
  const document = {
    documentData: 'dGVzdCBkYXRh',
    fileName: 'test.jpg',
    fileExtension: 'image/jpeg'
  };
  const params = {
    id: 'penRequestId',
    documentId: 'documentId'
  };

  let req;
  let res;

  jest.spyOn(utils, 'getAccessToken');
  const getDataSpy = jest.spyOn(utils, 'getData');

  beforeEach(() => {
    utils.getAccessToken.mockReturnValue('token');
    utils.getData.mockResolvedValue(document);
    req = mockRequest(null, null, params);
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK and document data', async () => {
    await pen.downloadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.data.raw.toString()).toEqual('test data');
    expect(res.setHeader).toHaveBeenNthCalledWith(1, 'Content-disposition', 'attachment; filename=' + document.fileName);
    expect(res.setHeader).toHaveBeenNthCalledWith(2, 'Content-type', document.fileExtension);
    expect(getDataSpy).toHaveBeenCalledWith('token', `${config.get('penRequest:apiEndpoint')}/${params.id}/documents/${params.documentId}?includeDocData=Y`);
  });

  it('should return UNAUTHORIZED if no session', async () => {
    utils.getAccessToken.mockReturnValue(null);

    await pen.downloadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });

  it('should return INTERNAL_SERVER_ERROR if deleteData is failed', async () => {
    utils.getData.mockRejectedValue(new Error('test error'));

    await pen.downloadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
