import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {inject, observer} from "mobx-react";
import "../style/sidebar.css"

class UserList extends Component {
  //handlePointsChange = e => this.props.userListStore.setPoints(e.target.value);
  //handleNewUserChange = e => this.props.userListStore.addUser();
  renderUser(user, i) {
    return (
      <tr key={i}>
        <td>{user.username}</td>
      </tr>
    )
  }
  render() {
    const { users } = this.props.userListStore;
    return (
      <Table className="user-list" size="sm" bordered hover>
        <thead>
          <tr>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {users.map(this.renderUser)}
        </tbody>
      </Table>
    );
  }
}

export default UserList = inject('userStore', 'userListStore')(observer(UserList))