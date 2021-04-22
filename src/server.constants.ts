// import { Config, IEnvironmentConfig } from './config/config';

// const env = process.env.NODE_ENV || 'development';

// export const SERVER_CONFIG: IEnvironmentConfig = Config[env];

export const DB_CONNECTION_TOKEN = 'DbConnectionToken';
export const SERVER_CONFIG_TOKEN = 'ServerConfigToken';
export const USER_MODEL_TOKEN = 'UserModelToken';
export const FACEBOOK_CONFIG_TOKEN = 'FacebookConfigToken';
export const TWITTER_CONFIG_TOKEN = 'TwitterConfigToken';
export const GOOGLE_CONFIG_TOKEN = 'GoogleConfigToken';

export const MESSAGES = {
  UNAUTHORIZED_EMAIL_IN_USE: 'The email already exists',
  UNAUTHORIZED_INVALID_PASSWORD: 'Invalid password',
  UNAUTHORIZED_INVALID_EMAIL: 'The email does not exist',
  UNAUTHORIZED_UNRECOGNIZED_BEARER: 'Unrecognized bearer of the token',
};
