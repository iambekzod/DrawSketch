import { action, extendObservable } from 'mobx';
import api from './api';

class UserStore {
  constructor() {
    extendObservable(this, {
      currentUser: null,
      token: window.localStorage.getItem('jwt'),
      loadingUser: false,

      pullUser: action(function() {
        this.loadingUser = true;
        return api.Auth.current()
          .then(action((user) => { this.currentUser = user; }))
          .finally(action(() => { this.loadingUser = false; }))
      }),
      forgetUser: action(function() {
        this.currentUser = undefined;
      }),
      setToken: action(function(setToken) {
        if (setToken) {
            this.token = setToken;
            window.localStorage.setItem("jwt", setToken);
        } else {
            this.token = undefined;
            window.localStorage.removeItem("jwt");
        }
      }),
    })
  }
}

export default new UserStore();