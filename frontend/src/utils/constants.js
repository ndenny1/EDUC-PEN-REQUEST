const baseRoot = '/api';
const authRoot = baseRoot + '/auth';
const apiRoot = baseRoot + '/pen';
let object;

object = {
  LOGIN_BCSC: authRoot + '/login_bcsc',
  LOGIN_BCEID: authRoot + '/login_bceid',
  LOGOUT: authRoot + '/logout',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token'
};
//Authentication endpoints
export const AuthRoutes = Object.freeze(object);

export const ApiRoutes = Object.freeze({
  PEN_REQUEST: apiRoot + '/request',
  GENDER_CODES: apiRoot + '/gender_codes',
  PEN_REQUEST_STATUS_CODES: apiRoot + '/pen_request_status_codes',
  DOCUMENT_TYPE_CODES: apiRoot + '/document_type_codes',
  FILE_REQUIREMENTS: apiRoot + '/file_requirements',
  // FILE_UPLOAD: apiRoot + '/document',
  USER: apiRoot + '/user',
});

export const PenRequestStatuses = Object.freeze({
  DRAFT: 'DRAFT',
  INITREV: 'INITREV',
  RETURNED: 'RETURNED',
  SUBSREV: 'SUBSREV',
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
  REJECTED: 'REJECTED',
  UNMATCHED: 'UNMATCHED'
});

export const VerificationResults = Object.freeze({
  TOKEN_ERROR: 'token-error',
  SERVER_ERROR: 'server-error',
  EXPIRED: 'expired',
  OK: 'ok'
});
