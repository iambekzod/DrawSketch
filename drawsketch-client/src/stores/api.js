import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

import userStore from './userStore';
import authStore from './authStore';

const superagent = superagentPromise(_superagent, global.Promise);
const API_ROOT = 'https://localhost:3001/api';

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    authStore.logout();
  }
  return err;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  if (userStore.token) {
    req.set('authorization', `Token ${userStore.token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (username, password) =>
    requests.post('/users/login', { user: { username, password } }),
  register: (user) =>
    requests.post('/users', { user }),
  save: user =>
    requests.put('/user', { user })
};

const Game = {
  connectedUsers: () =>
    requests.get('/game/users')
}

export default {
  Auth,
  Game
};