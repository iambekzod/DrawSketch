import React, { Component } from "react";
import "../style/form.css";
import "../style/lobby.css";

import ResultErrors from "./ResultErrors";
import LoadingSpinner from "./LoadingSpinner";
import LobbyModal from "./LobbyModal";

import { Table, Button } from "reactstrap";
import { inject, observer } from 'mobx-react';

class Lobby extends Component {
      
  refreshLobby = () => {
    this.props.lobbyStore.getLobbies();
  };

  componentDidMount() {
    const { token, room } = this.props.userStore;

    // Cannot visit lobby without being logged in
    if (!token) {
      this.props.history.push("/signin");
      return null;
    }

    // If there is a room for this user, we need to wait until the promise is resolved
    if (room) {
      this.props.lobbyStore.leave(room).then(() => {
        this.refreshLobby();
      })
    } else {
      this.refreshLobby();
    }
  };

  joinLobby = () => {
    this.props.lobbyStore.getLobbies();
  };

  createLobby = () => {
    this.props.lobbyStore.setModal();
  };

  render() {
    const { values, errors, inProgress, rooms, viewModal } = this.props.lobbyStore;

    let renderRooms = rooms.map((room, i) =>
        <tr key={i} onClick={() => { alert("asd"); }}>
            <th scope="row">{room.name}</th>
            <td>{room.author}</td>
            <td>{room.players}</td>
            <td className={room.locked ? "locked" : "unlocked"}></td>
            <td>{room.rounds}</td>
        </tr>)

    return (
      <div className="lobby">
        <div className="control-panel">
          <h1>Lobby</h1>
          <p>Create a lobby and start up a match with your friends!</p>
          <div className="actions">
            <Button 
                color="primary"
                onClick={this.createLobby}>Create</Button>
            <Button 
                color="primary"
                onClick={this.refreshLobby}>Refresh</Button>
          </div>
        </div>

        <LobbyModal toggle={this.createLobby} values={values} history={this.props.history} viewModal={viewModal}/>
        <ResultErrors errors={errors}/>
        <LoadingSpinner inProgress={inProgress}/>

        <Table id="lobby-table" striped bordered hover>
                <thead>
                <tr>
                    <th>Room Name</th>
                    <th>Host</th>
                    <th>Players</th>
                    <th>Private</th>
                    <th>Rounds</th>
                </tr>
                </thead>
                <tbody>
                    {renderRooms}
                </tbody>
            </Table>
      </div>
    );
  }
}

export default Lobby = inject('userStore', 'authStore', 'lobbyStore')(observer(Lobby))