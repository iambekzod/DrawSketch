import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';

class MessageStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      messages: [],
      values: {
        guess: ''
      },

      setGuess: action((set) => this.values.guess = set),
      reset: action((set) => {
        this.values.guess = '';
      }),
      addGuess: action(() => {
            this.messages.push({username: userStore.currentUser.username, message: this.values.guess, fromMe: true});
            this.values.guess = '';
      }),
    })
  }
}

export default new MessageStore();