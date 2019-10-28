import axios from 'axios';
import { AuthRoutes } from '@/utils/constants.js';

export default {

  //Retrieves an auth token from the API endpoint
  async getAuthToken() {
    try {
      const response = await axios.get(AuthRoutes.TOKEN);
      console.log(response.status);
      if(response.status === 401){
        return response.status;
      }
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  //Refreshes the users auth token
  async refreshAuthToken(token) {
    try {
      const response = await axios.post(AuthRoutes.REFRESH, {
        refreshToken: token
      });

      if(response.data.error){
        return {error: response.data.error_description};
      }
      
      return response.data;
    } catch (e) {
      console.log(`Failed to refresh JWT token - ${e}`); // eslint-disable-line no-console
      throw e;
    }
  }
};
