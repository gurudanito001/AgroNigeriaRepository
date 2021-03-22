import * as jwt from 'jwt-then';
import config from '../config/config';

const verifyRefreshToken = async (refreshToken) => {

  const decoded = await jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  const email = decoded.email
  if(!email){
      return false
  }
  return email
};

export default verifyRefreshToken;