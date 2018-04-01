/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import { Fade, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Label, Input, Form } from "reactstrap";
import { observer, inject } from "mobx-react";

class ResultModal extends Component {

  componentDidMount() {
    this.toggle = this.props.toggle.bind(this);
  }

  exitGame = (e) => {
    e.preventDefault();
    this.toggle();
    this.props.history.push("/lobby");
  };

  getWinner = (users) => {
    var winner = users[0];
    for(let user in users) {
      if user.points > winner.points{
        winner = user;
      }
    }
    return (
      <div>
        {winner.username} : {winner.points}
      </div>
    )
  }
  render() {
    const viewResultModal = this.props.viewResultModal;
    const { users } = this.props.userListStore;

    return (
      <div>
        <Modal isOpen={viewResultModal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>
            Winner!
          </ModalHeader>
          <ModalBody>
            <Fade in={true} tag="h5" className="mt-3">
              {this.getWinner(users)}
            </Fade>
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