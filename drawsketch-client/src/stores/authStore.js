import { observable, action, extendObservable } from 'mobx';
import agent from './agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      values: {
          username: '',
          email: '', 
          password: ''
      },

      get getInProgress() {
        return this.inProgress;
      },
      get getErrors() {
        return this.errors;
      },
      get getUsername() {
        return this.values.username;
      },
      get getPassword() {
        return this.values.password;
      },
      get getEmail() {
        return this.values.email;
      },

      setInProgres: action((set) => this.inProgress = set),
      setUsername: action((set) => this.values.username = set),
      setPassword: action((set) => this.values.password = set),
      setEmail: action((set) => this.values.email = set),
      reset: action((set) => {
        this.values.username = '';
        this.values.email = '',
        this.values.password = '';
      }),
      login: action(function() {
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
      }),
      logout: action(function() {
        commonStore.setToken(undefined);
        userStore.forgetUser();
        return Promise.resolve();
      }),
      register: action(function() {
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
      }),
      
    })
  }
}

export default new AuthStore();