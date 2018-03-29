import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

import userStore from './userStore';
import authStore from './authStore';

const superagent = superagentPromise(_superagent, global.Promise);
const API_ROOT = '/api';

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
    requests.post('/user/signin', { user: { username, password } }),
  register: (user) =>
    requests.post('/user/signup', { user }),
};

const Game = {
  connectedUsers: () =>
    requests.get('/game/connected'),
}

const Lobby = {
  getRooms: () =>
    requests.get('/lobby/'),
  getRoom: (id) =>
    requests.get(`/lobby/${id}`),
  createRoom: (room) =>
    requests.post('/lobby/', room),
  joinRoom: (id, password) =>
    requests.post(`/lobby/join/${id}`, { password }),
  leaveRoom: (id) =>
    requests.post(`/lobby/leave/${id}`)
}

export default {
  Auth,
  Game,
  Lobby
};