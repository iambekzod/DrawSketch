import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';
import Lobby from '../containers/Lobby';

class LobbyStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      values: {
      },

      reset: action((set) => {

      }),
      create: action(function() {
        this.inProgress = true;
        this.errors = undefined;
        return api.Auth.login(this.values.username, this.values.password)
          .then((user) => {
            userStore.setToken(user.token)
          })
          .then(() => userStore.pullUser())
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { this.inProgress = false; }));
      }),
      join: action(function() {
        return Promise.resolve();
      }),
      leave: action(function() {
          
      }),
      
    })
  }
}

export default new LobbyStore();