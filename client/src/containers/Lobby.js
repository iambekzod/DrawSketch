import React, { Component } from "react";
import "../style/form.css";
import "../style/lobby.css";

import ResultErrors from "./ResultErrors";
import LoadingSpinner from "./LoadingSpinner";
import LobbyCreateModal from "./LobbyCreateModal";
import LobbyJoinModal from "./LobbyJoinModal";

import { Table, Button } from "reactstrap";
import { inject, observer } from 'mobx-react';

class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
        user: null
    };
  }

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
        this.props.lobbyStore.getRooms();
      })
    } else {
      this.props.lobbyStore.getRooms();
    }

    var self = this;
    if (token) {
      this.props.userStore.pullUser().then(function (resultUser) {
        self.setState({
          user: resultUser
        });
      });
    }
  };

  joinLobby = (lock, id) => {
    this.props.lobbyStore.setJoinId(id);
    if (lock)
      this.props.lobbyStore.setJoinModal();
    else {
      this.props.userStore.pullUser().then((user) => {
        this.props.userListStore.addUser(user.username);
        this.props.lobbyStore.join().then(() => {
          this.props.history.push("/game/" + id);
        });
      });
    }
  };

  createLobby = () => {
    this.props.lobbyStore.setCreateModal();
  };

  render() {
    const { values, errors, inProgress, rooms, viewCreateModal, viewJoinModal } = this.props.lobbyStore;

    let renderRooms = rooms.map((room, i) =>
        <tr key={i} onDoubleClick={() => { this.joinLobby(room.locked, room.id) }}>
            <th scope="row">{room.name}</th>
            <td>{room.author}</td>
            <td>{room.players}</td>
            <td className={room.locked ? "locked" : "unlocked"}></td>
            <td>{room.rounds}</td>
        </tr>)

    let user = (this.state.user) ? this.state.user.username : null;

    return (
      <div className="lobby">
        <div className="control-panel">
          <h1>Lobby</h1>
          <p>Welcome <span className="user">{user}</span></p>
          <p>Create a lobby and start up a match with your friends!</p>
          <div className="actions">
            <Button
                color="primary"
                onClick={this.createLobby}>Create</Button>
            <Button
                color="primary"
                onClick={() => { this.props.lobbyStore.getRooms(); }}>Refresh</Button>
          </div>
        </div>

        <LobbyCreateModal toggle={this.createLobby} values={values} history={this.props.history} viewCreateModal={viewCreateModal}/>
        <LobbyJoinModal toggle={() => { this.props.lobbyStore.setJoinModal(); }} history={this.props.history} values={values} viewJoinModal={viewJoinModal}/>
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

export default Lobby = inject('userStore', 'authStore', 'lobbyStore', 'userListStore')(observer(Lobby))
