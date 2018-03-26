import { action, extendObservable } from 'mobx';
import api from './api';
import userStore from './userStore';

class LobbyStore {
  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      viewCreateModal: false,
      viewJoinModal: false,
      rooms: [],
      values: {
        name: '',
        maxPlayers: "10",
        rounds: "8",
        timeLimit: "0:30",
        password: '',
        locked: false,
        joinId: '',
        joinPassword: '',
      },
      reset: action(() => {
        this.values.name = '';
        this.values.maxPlayers = "10";
        this.values.rounds = "8";
        this.values.timeLimit = "0:30";
        this.values.password = '';
        this.values.locked = false;
        this.values.joinId = '';
        this.values.joinPassword = '';
      }),
      setRoomName: action((set) => this.values.name = set),
      setMaxPlayers: action((set) => this.values.maxPlayers = set),
      setRounds: action((set) => this.values.rounds = set),
      setTimeLimit: action((set) => this.values.timeLimit = set),
      setPassword: action((set) => { 
        this.values.password = set;
        this.values.locked = (this.values.password !== "");
      }),
      setJoinPassword: action((set) => { 
        this.values.joinPassword = set;
      }),
      setJoinId: action((set) => { 
        this.values.joinId = set;
      }),
      getRooms: action(() => {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.getRooms()
          .then(action((res) => { this.rooms = res; }))
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          })).finally(action(() => {
            this.inProgress = false; }));
      }),
      getRoom: action((id) => {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.getRoom(id)
          .then(action((res) => { return res; }))
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          })).finally(action((res) => {
            this.inProgress = false;
            return res; }));
      }),
      create: action(function() {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.createRoom(this.values)
          .then((room) => {
            return room;
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action((room) => { 
            this.reset();
            this.inProgress = false;
            return room;
          }));
      }),
      join: action(function() {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.joinRoom(this.values.joinId, this.values.joinPassword)
          .then((room) => {
            userStore.setRoom(room);
          })
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { 
            this.reset();
            this.inProgress = false;
          }));
      }),
      leave: action(function(id) {
        this.inProgress = true;
        this.errors = undefined;
        return api.Lobby.leaveRoom(id)
          .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
          }))
          .finally(action(() => { 
            this.inProgress = false;
            userStore.setRoom(null);
            Promise.resolve();
           }));
      }),
      setCreateModal: action(function() {
        this.viewCreateModal = !this.viewCreateModal;
      }),
      setJoinModal: action(function() {
        this.viewJoinModal = !this.viewJoinModal;
      })
    })
  }
}

export default new LobbyStore();