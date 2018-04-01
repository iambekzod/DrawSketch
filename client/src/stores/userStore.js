import { action, extendObservable } from 'mobx';
import api from './api';

class UserStore {
  constructor() {
    extendObservable(this, {
      token: window.localStorage.getItem('jwt'),
      inProgress: false,
      room: window.localStorage.getItem('room'),

      pullUser: action(function() {
        this.inProgress = true;
        return api.Auth.current()
          .then(action((user) => { return user; }))
          .finally(action((user) => { this.inProgress = false; return user; }))
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