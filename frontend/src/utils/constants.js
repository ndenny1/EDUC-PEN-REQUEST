const baseRoot = '/api';

//Authentication endpoints
const authRoot = baseRoot + '/auth';
export const AuthRoutes = Object.freeze({
  LOGIN: authRoot + '/login',
  LOGOUT: authRoot + '/logout',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token'
});
