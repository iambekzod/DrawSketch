import { action, extendObservable } from 'mobx';

class CommonStore {
    constructor() {

        extendObservable(this, {
            token: window.localStorage.getItem('jwt'),
            appLoaded: false,

            get getToken() {
                return this.token;
            },
            get getAppLoaded() {
                return this.appLoaded;
            },
            setAppLoaded: action((set) => this.appLoaded = set),
            setToken: action(function(setToken) {
                if (setToken) {
                    this.token = setToken;
                    window.localStorage.setItem("jwt", setToken);
                } else {
                    this.token = undefined;
                    window.localStorage.removeItem("jwt");
                }
            }),
        })
    }
}

export default new CommonStore();