/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, Form } from "reactstrap";
import { observer, inject } from "mobx-react";

class LobbyCreateModal extends Component {

  handleRoomNameChange = (e) => this.props.lobbyStore.setRoomName(e.target.value);
  handleMaxPlayerChange = (e) => this.props.lobbyStore.setMaxPlayers(e.target.value);  
  handleRoundsChange = (e) => this.props.lobbyStore.setRounds(e.target.value);  
  handleTimeLimitChange = (e) => this.props.lobbyStore.setTimeLimit(e.target.value);
  handlePasswordChange = (e) => this.props.lobbyStore.setPassword(e.target.value);

  componentDidMount() {
    this.toggle = this.props.toggle.bind(this);
  }

  createLobby = (e) => {
    e.preventDefault();

    this.toggle();
    this.props.lobbyStore.create().then(() => {
      this.props.history.push("/game");
    });
  };

  render() {
    const viewCreateModal = this.props.viewCreateModal;
    const { values } = this.props.lobbyStore;

    return (
      <div>
        <Modal isOpen={viewCreateModal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Create a Lobby</ModalHeader>
          <ModalBody>
            <Form>
              <Label>Room Name</Label>
              <Input 
                id="roomname"
                autoFocus
                value={values.name}
                onChange={this.handleRoomNameChange} />
              <Label>Max Players</Label>
              <Input type="number" 
                id="maxPlayers" 
                value={values.maxPlayers}
                onChange={this.handleMaxPlayerChange}/>
              <Label>Rounds</Label>
              <Input type="number" 
                id="rounds" 
                value={values.rounds}
                onChange={this.handleRoundsChange}/>
              <Label>Time Limit</Label>
              <Input type="select" 
                id="timeLimit"
                value={values.timeLimit}
                onChange={this.handleTimeLimitChange}>
                  <option>0:30</option>
                  <option>1:00</option>
                  <option>1:30</option>
                  <option>2:00</option>
                  <option>2:30</option>
                  <option>3:00</option>
              </Input>
              <Label>Password (optional)</Label>
              <Input type="password" 
                id="password" 
                value={values.password}
                onChange={this.handlePasswordChange}/>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.createLobby}>Submit</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LobbyCreateModal = inject('userStore', 'lobbyStore')(observer(LobbyCreateModal))