import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';

class LobbyStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      viewModal: false,
      rooms: [],
      values: {
        name: '',
        maxPlayers: "10",
        rounds: "8",
        timeLimit: "0:30",
        password: '',
        locked: false,
      },
      reset: action(() => {
        this.values.name = '';
        this.values.maxPlayers = "10";
        this.values.rounds = "8";
        this.values.timeLimit = "0:30";
        this.values.password = '';
        this.values.locked = false;
      }),
      setRoomName: action((set) => this.values.name = set),
      setMaxPlayers: action((set) => this.values.maxPlayers = set),
      setRounds: action((set) => this.values.rounds = set),
      setTimeLimit: action((set) => this.values.timeLimit = set),
      setPassword: action((set) => { 
        this.values.password = set;
        this.values.locked = (this.values.password !== "");
      }),
      getLobbies: action((set) => {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.getLobbies()
          .then(action((res) => { this.rooms = res; }))
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          })).finally(action(() => {
            this.inProgress = false; }));
      }),
      create: action(function() {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.createLobby(this.values)
          .then((room) => {
            this.join(room.id);
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { 
            this.inProgress = false;
          }));
      }),
      join: action(function(id) {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.joinRoom(id)
          .then((room) => {
            userStore.setRoom(room);
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { this.inProgress = false; }));
      }),
      leave: action(function(id) {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.leaveRoom(id)
          .then((room) => {
            userStore.setRoom(null);
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { 
            this.inProgress = false;
            Promise.resolve();
           }));
      }),
      setModal: action(function() {
        this.viewModal = !this.viewModal;
      }),
    })
  }
}

export default new LobbyStore();