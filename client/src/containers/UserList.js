import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {inject, observer} from "mobx-react";
import "../style/sidebar.css"

class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
        players: []
    };
  }

  componentDidMount() {
    var self = this;
    this.props.userStore.pullUser().then((user) => {
      if (!user.room) return null;

      self.props.lobbyStore.getRoom(user.room.id).then((room) => {
        var players = room.players.map(function(player) {
          return {username: player.username, isMe: player.username === user.username, points: player.points};
        });

        self.setState({
          players: players
        });
      });

      this.props.socket.on('newUser', (game) => {
        var players = game.players.map(function(player) {
          return {username: player.username, isMe: player.username === user.username, points: player.points};
        });

        this.setState({ players: players});
      });
      this.props.socket.on('disconnected', () => {
        console.log(this.game);
        // var players = this.game.players.map(function(player) {
        //   return {username: player.username, isMe: player.username === user.username, points: player.points};
        // });
        //
        // this.setState({ players: players});
      });
    })
  }

  //handlePointsChange = e => this.props.userListStore.setPoints(e.target.value);
  //handleNewUserChange = e => this.props.userListStore.addUser();
  renderUser(user, i) {
    const fromMe = user.isMe ? 'from-me' : '';
    return (
      <tr className={`${fromMe}`} key={i}>
        <td>{user.username} : {user.points}</td>
      </tr>
    )
  }

  render() {
    return (
      <Table className="user-list" size="sm" bordered hover>
        <thead>
          <tr>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {this.state.players.map(this.renderUser)}
        </tbody>
      </Table>
    );
  }
}

export default UserList = inject('userStore', 'lobbyStore', 'userListStore')(observer(UserList))
