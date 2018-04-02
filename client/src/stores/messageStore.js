import { action, extendObservable } from 'mobx';

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
      addGuess: action((username) => {
        this.messages.push({username: username, message: this.values.guess, fromMe: true});
        this.reset();
      }),
    })
  }
}

export default new MessageStore();
