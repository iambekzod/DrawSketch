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
        maxPlayers: "0",
        rounds: "0",
        timeLimit: "0:30",
        password: '',
        locked: false,
      },   
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
      delete: action(function(id) {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.removeLobby(id)
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
            userStore.setRoom(room);
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { this.inProgress = false; }));
      }),
      join: action(function() {
        return Promise.resolve();
      }),
      leave: action(function() {
          
      }),
      setModal: action(function() {
        this.viewModal = !this.viewModal;
      }),
    })
  }
}

export default new LobbyStore();