import { observable, action } from 'mobx';
import agent from './agent';

class UserStore {

  currentUser = observable();
  loadingUser = observable();
  updatingUser = observable();
  updatingUserErrors = observable();

  // currentUser = null
  // loadingUser = null
  // updateUser = null
  // updatingUserErrors = null

  // constructor() {
  //   extendObservable(this, {
  //     currentUser,
  //     loadingUser,
  //     updatingUser,
  //     updatingUserErrors
  //   });
  // }

  pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  updateUser(newUser) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }))
  }

  forgetUser() {
    this.currentUser = undefined;
  }

}

action(UserStore.prototype, "pullUser", Object.getOwnPropertyDescriptor(UserStore.prototype, "pullUser"));
action(UserStore.prototype, "updateUser", Object.getOwnPropertyDescriptor(UserStore.prototype, "updateUser"));
action(UserStore.prototype, "forgetUser", Object.getOwnPropertyDescriptor(UserStore.prototype, "forgetUser"));

export default new UserStore();