import React, { Component } from "react";
import "../style/form.css";
import "../style/lobby.css";

import ResultErrors from "./ResultErrors";
import LoadingSpinner from "./LoadingSpinner";

import { Table } from "reactstrap";
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

class Lobby extends Component {

  render() {
    const user = this.props.userStore.token;
    const { values, errors, inProgress } = this.props.lobbyStore;

    if (!user) {
        this.props.history.push("/login");
        return null;
    }

    return (
      <div className="sign-in">
        <div className="control-panel">
          <h1>Lobby</h1>
          <p>Create a lobby and start up a match with your friends!</p>
        </div>

        <ResultErrors errors={errors} />

        <Table id="lobby-table" striped bordered hover>
                <thead>
                <tr>
                    <th>Room Name</th>
                    <th>Owner</th>
                    <th>Players</th>
                    <th>Locked</th>
                    <th>Rounds</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">abcd</th>
                    <td>Mark</td>
                    <td>2/8</td>
                    <td className="locked"></td>
                    <td>8</td>
                </tr>
                <tr>
                    <th scope="row">defgh</th>
                    <td>Alice</td>
                    <td>5/16</td>
                    <td className="unlocked"></td>
                    <td>32</td>
                </tr>
                <tr>
                    <th scope="row">hehexd</th>
                    <td>Bekzod</td>
                    <td>2/8</td>
                    <td className="locked"></td>
                    <td>16</td>
                </tr>
                </tbody>
            </Table>

        <LoadingSpinner inProgress={inProgress}/>
      </div>
    );
  }
}

export default Lobby = inject('userStore', 'lobbyStore')(observer(Lobby))