import { action, extendObservable } from 'mobx';
import api from './api';

class UserStore {
  constructor() {
    extendObservable(this, {
      currentUser: { },
      inProgress: false,
      token: window.localStorage.getItem('jwt'),
      room: window.localStorage.getItem('room'),

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
        if (room) {
          this.room = room.id;
          window.localStorage.setItem("room", room.id);
        } else {
          this.room = null;
          window.localStorage.removeItem("room");
        }
      })
    })
  }
}

export default new UserStore();