import { action, reaction, extendObservable } from 'mobx';
import agent from './agent';

class CommonStore {
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

        extendObservable(this, {
            appName: "DrawSketch",
            token: window.localStorage.getItem('jwt'),
            appLoaded: false,
            tags: [],
            isLoadingTags: false,

            get AppName() {
                return this.appName;
            },
            get getToken() {
                return this.token;
            },
            get getAppLoaded() {
                return this.appLoaded;
            },
            get getTags() {
                return this.tags;
            },
            get getIsLoadingTags() {
                return this.isLoadingTags;
            },
            setAppLoaded: action((set) => this.appLoaded = set),
            setToken: action((set) => this.token = set),
            loadTags: action(function() {
                this.isLoadingTags = true;
                return agent.Tags.getAll()
                .then(action(({ tags }) => { this.tags = tags.map(t => t.toLowerCase()); }))
                .finally(action(() => { this.isLoadingTags = false; }))
            })
        })
    }
}

export default new CommonStore();