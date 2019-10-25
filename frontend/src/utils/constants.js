let baseRoot = '/api';
if(process.env.NODE_ENV === 'devlopment'){
  baseRoot = 'https://pen-request-c2mvws-dev.pathfinder.gov.bc.ca/api';
} 

//Authentication endpoints
const authRoot = baseRoot + '/auth';
export const AuthRoutes = Object.freeze({
  LOGIN: authRoot + '/login',
  LOGOUT: authRoot + '/logout',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token'
});
