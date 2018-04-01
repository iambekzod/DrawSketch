import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';

class userListStore {
  constructor() {
    extendObservable(this, {
        inProgress: false,
        errors: undefined,
        users: [{username:"drawsketch", isMe: false, points: 0},
                {username:"weiqiang", isMe: false, points: 0}],
        setPoints: action((name, points) => {
            var user = this.users.find(function(user) {
                return user.username === name;
            });

            user.points += points
        }),

        reset: action((set) => {
            this.users.forEach(user => {
                user.points = 0;
            });
        }),

        addUser: action(() => {
            this.users.push({username: userStore.currentUser.username, isMe: true, points: 0});
      }),
    })
  }
}

export default new userListStore();