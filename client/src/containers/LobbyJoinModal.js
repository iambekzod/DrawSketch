/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, Form } from "reactstrap";
import { observer, inject } from "mobx-react";

class LobbyJoinModal extends Component {

  handlePasswordChange = (e) => this.props.lobbyStore.setJoinPassword(e.target.value);

  componentDidMount() {
    this.toggle = this.props.toggle.bind(this);
  }

  joinLobby = (e) => {
    e.preventDefault();
    this.toggle();
    this.props.lobbyStore.join().then((room) => {
      this.props.userStore.pullUser().then((user) => {
        this.props.userListStore.addUser(user.username);
        this.props.history.push("/game/" + room.id);
      });
    });
  };

  render() {
    const viewJoinModal = this.props.viewJoinModal;
    const { values } = this.props.lobbyStore;

    return (
      <div>
        <Modal isOpen={viewJoinModal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Join a Lobby</ModalHeader>
          <ModalBody>
            <Form>
              <Label>Password</Label>
              <Input type="password"
                id="password"
                value={values.joinPassword}
                onChange={this.handlePasswordChange}/>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.joinLobby}>Submit</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LobbyJoinModal = inject('userStore', 'lobbyStore', 'userListStore')(observer(LobbyJoinModal))
