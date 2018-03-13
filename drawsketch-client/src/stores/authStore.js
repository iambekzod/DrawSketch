import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';

class AuthStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      values: {
          username: '',
          firstname: '',
          lastname: '',
          email: '', 
          password: '',
          confirmPassword: ''
      },

      setUsername: action((set) => this.values.username = set),
      setFirstname: action((set) => this.values.firstname = set),
      setLastname: action((set) => this.values.lastname = set),
      setEmail: action((set) => this.values.email = set),
      setPassword: action((set) => this.values.password = set),
      setConfirmPassword: action((set) => this.values.confirmPassword = set),
      reset: action((set) => {
        this.values.username = '';
        this.values.firstname = '';
        this.values.lastname = '';
        this.values.email = '';
        this.values.password = '';
        this.values.confirmPassword = '';
      }),
      login: action(function() {
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
      logout: action(function() {
        userStore.setToken(undefined);
        userStore.forgetUser();
        return Promise.resolve();
      }),
      register: action(function() {
        this.inProgress = true;
        this.errors = undefined;
        
        return api.Auth.register(this.values)
          .then((user) => userStore.setToken(user.token))
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