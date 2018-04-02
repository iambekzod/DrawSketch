/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import { Fade, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, Form } from "reactstrap";
import { observer, inject } from "mobx-react";
import { Table } from 'reactstrap'

class ResultModal extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      viewResultModal: !this.props.viewResultModal
    });
    this.props.history.push("/lobby");
  }

  exitGame = (e) => {
    e.preventDefault();
    this.toggle();
    this.props.history.push("/lobby");
  };

  getWinner = (players) => {
    var winner = players[0];
    for(let player in players) {
      if (player.points > winner.points){
        winner = player;
      }
    }
    return (
      <div>
        {winner.username} : {winner.points}
      </div>
    )
  }

  renderUser(player, i) {
    const fromMe = player.isMe ? 'from-me' : '';
    return (
      <tr className={`${fromMe}`} key={i}>
        <td>{player.username} : {player.points}</td>
      </tr>
    )
  }

  render() {
    const viewResultModal = this.props.viewResultModal;
    const players = this.props.players;

    return (
      <div>
        <Modal isOpen={viewResultModal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>
            Here are the Results!
          </ModalHeader>
          <ModalBody>
            <Fade in={true} tag="h5" className="mt-3">
              <h1>Winner!:</h1>
              {this.getWinner(players)}
            </Fade>
            <Table className="user-list" bordered hover>
              <thead>
                <tr>
                  <th>Results</th>
                </tr>
              </thead>
              <tbody>
                {players.map(this.renderUser)}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.exitGame}>Continue</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ResultModal = inject('userStore', 'userListStore')(observer(ResultModal))