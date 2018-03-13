import { action, extendObservable } from 'mobx';
import agent from './agent';

class UserStore {
  constructor() {
    extendObservable(this, {
      currentUser: null,
      loadingUser: false,

      pullUser: action(function() {
        this.loadingUser = true;
        return agent.Auth.current()
          .then(action(({ user }) => { this.currentUser = user; }))
          .finally(action(() => { this.loadingUser = false; }))
      }),
      forgetUser: action(function() {
        this.currentUser = undefined;
      })
    })
  }
}

export default new UserStore();