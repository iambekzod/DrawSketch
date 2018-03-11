import { observable, action, reaction } from 'mobx';
import agent from './agent';

class CommonStore {

    appName = observable("DrawSketch");
    token = observable(window.localStorage.getItem('jwt'));
    appLoaded = observable(false);
    tags = observable([]);
    isLoadingTags = observable([]);

    constructor() {

        reaction(() => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
  }

  loadTags() {
    this.isLoadingTags = true;
    return agent.Tags.getAll()
      .then(action(({ tags }) => { this.tags = tags.map(t => t.toLowerCase()); }))
      .finally(action(() => { this.isLoadingTags = false; }))
  }

 setToken(token) {
    this.token = token;
  }

  setAppLoaded() {
    this.appLoaded = true;
  }
}

action(CommonStore.prototype, "loadTags", Object.getOwnPropertyDescriptor(CommonStore.prototype, "loadTags"));
action(CommonStore.prototype, "setToken", Object.getOwnPropertyDescriptor(CommonStore.prototype, "setToken"));
action(CommonStore.prototype, "setAppLoaded", Object.getOwnPropertyDescriptor(CommonStore.prototype, "setAppLoaded"));

export default new CommonStore();