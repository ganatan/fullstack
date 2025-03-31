import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
    angular: `${applicationBase.angular} DEV`,
  },
  useDatabase: false,
  backend: 'http://localhost:3000',
  urlNews: './assets/params/json/mock/trailers.json',
  urlMovies: './assets/params/json/mock/movies.json',
};