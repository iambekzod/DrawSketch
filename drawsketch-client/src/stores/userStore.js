import { action, extendObservable } from 'mobx';
import api from './api';

class UserStore {
  constructor() {
    extendObservable(this, {
      currentUser: { },
      token: window.localStorage.getItem('jwt'),
      inProgress: false,
      room: { },

      pullUser: action(function() {
        this.inProgress = true;
        return api.Auth.current()
          .then(action((user) => { 
            this.currentUser = user; }))
          .finally(action(() => { this.inProgress = false; }))
      }),
      forgetUser: action(function() {
        this.currentUser = null;
      }),
      setToken: action(function(setToken) {
        if (setToken) {
            this.token = setToken;
            window.localStorage.setItem("jwt", setToken);
        } else {
            this.token = null;
            window.localStorage.removeItem("jwt");
        }
      }),
      setRoom: action(function(room) {
        this.room = room;
      }),
      leaveRoom: action(function() {
        this.room = null;
      }),
    })
  }
}

export default new UserStore();