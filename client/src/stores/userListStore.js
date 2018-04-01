import { action, extendObservable } from 'mobx';
import api from './api';

class userListStore {
  constructor() {
    extendObservable(this, {
        inProgress: false,
        errors: undefined,
        users: [{username:"drawsketch", isMe: false},
                {username:"weiqiang", isMe: false}],
        values: {
            points: 0
        },
        setPoints: action((set) => this.values.points = set),
        reset: action((set) => {
            this.values.points = 0;
        }),
        addUser: action((username) => {
            this.users.push({username: username, isMe: true});
            this.values.points = 0;
      }),
    })
  }
}

export default new userListStore();