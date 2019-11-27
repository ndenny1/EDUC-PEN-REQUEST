const baseRoot = '/api';
const authRoot = baseRoot + '/auth';
const apiRoot = baseRoot + '/pen';
let object;

if(process.env.NODE_ENV === 'development'){
  object = {
    LOGIN: '/',
    LOGOUT: '/',
    REFRESH: authRoot + '/refresh',
    TOKEN: authRoot + '/token'
  };
} else {
  object = {
    LOGIN: authRoot + '/login',
    LOGOUT: authRoot + '/logout',
    REFRESH: authRoot + '/refresh',
    TOKEN: authRoot + '/token'
  };
}
//Authentication endpoints
export const AuthRoutes = Object.freeze(object);

export const ApiRoutes = Object.freeze({
  PEN_REQUEST: apiRoot + '/request'
});
