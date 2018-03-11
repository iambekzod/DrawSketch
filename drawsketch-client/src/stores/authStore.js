import { observable, action } from 'mobx';
import agent from './agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {

  inProgress = observable(false);
  errors = observable(undefined);
  values = observable({
    username: '',
    email: '',
    password: '',
  });
  // @observable inProgress = false;
  // @observable errors = undefined;

  // @observable values = {
  //   username: '',
  //   email: '',
  //   password: '',
  // };

  setUsername(username) {
    this.values.username = username;
  }

  setEmail(email) {
    this.values.email = email;
  }

  setPassword(password) {
    this.values.password = password;
  }

  reset() {
    this.values.username = '';
    this.values.email = '';
    this.values.password = '';
  }

  login() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.login(this.values.email, this.values.password)
      .then(({ user }) => commonStore.setToken(user.token))
      .then(() => userStore.pullUser())
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  register() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.register(this.values.username, this.values.email, this.values.password)
      .then(({ user }) => commonStore.setToken(user.token))
      .then(() => userStore.pullUser())
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  logout() {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    return Promise.resolve();
  }
}

action(AuthStore.prototype, "setUsername");
action(AuthStore.prototype, "setEmail");
action(AuthStore.prototype, "setPassword");
action(AuthStore.prototype, "reset");
action(AuthStore.prototype, "login");
action(AuthStore.prototype, "register");
action(AuthStore.prototype, "logout");

export default new AuthStore();