import { observable, action, extendObservable } from 'mobx';
import agent from './agent';

class UserStore {
  constructor() {
    extendObservable(this, {
      currentUser: null,
      loadingUser: null,
      updatingUser: null,
      updatingUserErrors: null,

      pullUser: action(function() {
        this.loadingUser = true;
        return agent.Auth.current()
          .then(action(({ user }) => { this.currentUser = user; }))
          .finally(action(() => { this.loadingUser = false; }))
      }),
      updateUser: action(function(newUser) {
        this.updatingUser = true;
        return agent.Auth.save(newUser)
          .then(action(({ user }) => { this.currentUser = user; }))
          .finally(action(() => { this.updatingUser = false; }))
      }),
      forgetUser: action(function() {
        this.currentUser = undefined;
      })
    })
  }
}

export default new UserStore();