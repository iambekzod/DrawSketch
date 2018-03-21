import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {inject, observer} from "mobx-react";

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
    const { values, users } = this.props.userListStore;
    return (
      <Table dark size="sm">
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