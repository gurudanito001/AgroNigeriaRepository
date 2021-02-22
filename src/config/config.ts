import * as dotenv from 'dotenv';
dotenv.config();

export default {
  APP: process.env.APP || 'development',
  ATLAS_URI: 'mongodb+srv://nwokocha95:nwokocha95@cluster0.fbrwv.mongodb.net/AgroNigeriaRepository?retryWrites=true&w=majority',
  PORT: process.env.PORT || '6000',
  DB_DIALECT: process.env.DB_DIALECT || 'mongo',
  DB_HOST: process.env.DB_HOST || 'mongodb+srv://nwokocha95:nwokocha95@cluster0.fbrwv.mongodb.net/AgroNigeriaRepository?retryWrites=true&w=majority', 
  DB_NAME: process.env.DB_NAME || 'example_db',
  DB_PASSWORD: process.env.DB_PASSWORD || 'db-password',
  DB_PORT: process.env.DB_PORT || '27017',
  DB_USER: process.env.DB_USER || 'root',
  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'cyphersecretkey',
  FORGOT_PASSWORD_ENCRYPTION: process.env.FORGOT_PASSWORD_ENCRYPTION || 'forgotsecretkey',
  JWT_EXPIRATION: 900000,
  SALT_ROUNDS: 10 
};
